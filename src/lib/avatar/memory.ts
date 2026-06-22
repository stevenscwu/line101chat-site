import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { Redis } from "@upstash/redis";

import type {
  AvatarConversationMessage,
  AvatarMemoryChannel,
  AvatarMemoryContext,
  AvatarMemoryProfile,
  AvatarMemoryRecord,
} from "@/lib/avatar/types";

type MemoryDatabase = {
  version: 1;
  records: Record<string, AvatarMemoryRecord>;
  linkCodes?: Record<string, MemoryLinkCodeRecord>;
};

type StorageMode = AvatarMemoryContext["storageMode"];
type MemoryLinkCodeRecord = {
  subjectId: string;
  expiresAt: string;
};

const DEFAULT_MEMORY_FILE = ".data/celine-memory.json";
const DEFAULT_RETENTION_DAYS = 90;
const DEFAULT_MAX_MESSAGES = 40;
const DEFAULT_LINK_CODE_MINUTES = 10;
const MAX_STORED_MESSAGE_LENGTH = 1_500;
const MEMORY_KEY_PREFIX = "celine:memory:v1";
const LINK_CODE_KEY_PREFIX = "celine:link:v1";
const PERSON_TOKEN_PREFIX = "celine-person-v1";
const globalMemory = new Map<string, AvatarMemoryRecord>();
const globalLinkCodes = new Map<string, MemoryLinkCodeRecord>();

let localWriteQueue = Promise.resolve();
let warnedAboutDevelopmentSecret = false;
let warnedAboutEphemeralProduction = false;

function readPositiveInteger(name: string, fallback: number) {
  const parsed = Number(process.env[name]);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getRetentionDays() {
  return readPositiveInteger(
    "CELINE_MEMORY_RETENTION_DAYS",
    DEFAULT_RETENTION_DAYS,
  );
}

function getMaxMessages() {
  return readPositiveInteger(
    "CELINE_MEMORY_MAX_MESSAGES",
    DEFAULT_MAX_MESSAGES,
  );
}

function getMemorySecret() {
  const configured = process.env.CELINE_MEMORY_SECRET?.trim();

  if (configured) {
    return configured;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("CELINE_MEMORY_SECRET is required in production.");
  }

  if (!warnedAboutDevelopmentSecret) {
    console.warn(
      "[celine-memory] using a development-only identity key; configure CELINE_MEMORY_SECRET before deployment",
    );
    warnedAboutDevelopmentSecret = true;
  }

  return "celine-local-development-only";
}

function getSubjectId(channel: AvatarMemoryChannel, externalId: string) {
  return createHmac("sha256", getMemorySecret())
    .update(`${channel}:${externalId}`)
    .digest("hex");
}

function signPersonSubject(subjectId: string) {
  return createHmac("sha256", getMemorySecret())
    .update(`${PERSON_TOKEN_PREFIX}:${subjectId}`)
    .digest("hex");
}

export function createAvatarPersonToken(subjectId: string) {
  return `${subjectId}.${signPersonSubject(subjectId)}`;
}

function parseAvatarPersonToken(token?: string) {
  if (!token) return null;
  const [subjectId, signature] = token.split(".");

  if (
    !/^[a-f0-9]{64}$/u.test(subjectId || "") ||
    !/^[a-f0-9]{64}$/u.test(signature || "")
  ) {
    return null;
  }

  const expected = Buffer.from(signPersonSubject(subjectId), "hex");
  const received = Buffer.from(signature, "hex");
  return expected.length === received.length &&
    timingSafeEqual(expected, received)
    ? subjectId
    : null;
}

function getRedisConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim();
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim();

  return url && token ? { url, token } : null;
}

function getStorageMode(): StorageMode {
  if (getRedisConfig()) {
    return "upstash";
  }

  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    if (!warnedAboutEphemeralProduction) {
      console.warn(
        "[celine-memory] durable production storage is not configured; using ephemeral memory",
      );
      warnedAboutEphemeralProduction = true;
    }
    return "ephemeral";
  }

  return "local";
}

function getLocalFilePath() {
  const configured =
    process.env.CELINE_MEMORY_FILE?.trim() || DEFAULT_MEMORY_FILE;
  return path.isAbsolute(configured)
    ? configured
    : path.join(/* turbopackIgnore: true */ process.cwd(), configured);
}

function getRedis() {
  const config = getRedisConfig();

  if (!config) {
    throw new Error("Upstash Redis is not configured.");
  }

  return new Redis(config);
}

function createEmptyRecord(
  channel: AvatarMemoryChannel,
  subjectId: string,
): AvatarMemoryRecord {
  const now = new Date().toISOString();
  return {
    version: 1,
    subjectId,
    channel,
    linkedChannels: [channel],
    createdAt: now,
    updatedAt: now,
    profile: {
      interests: [],
      facts: [],
    },
    messages: [],
  };
}

function isExpired(record: AvatarMemoryRecord) {
  const updatedAt = Date.parse(record.updatedAt);
  const retentionMs = getRetentionDays() * 24 * 60 * 60 * 1_000;
  return !Number.isFinite(updatedAt) || updatedAt < Date.now() - retentionMs;
}

function normalizeRecord(
  record: AvatarMemoryRecord,
  channel: AvatarMemoryChannel,
  subjectId: string,
) {
  const profile = record.profile || { interests: [], facts: [] };
  return {
    ...record,
    version: 1 as const,
    channel: record.channel || channel,
    subjectId,
    linkedChannels: Array.from(
      new Set([...(record.linkedChannels || []), record.channel || channel]),
    ),
    profile: {
      preferredName: profile.preferredName?.slice(0, 40),
      language: profile.language,
      interests: Array.isArray(profile.interests)
        ? profile.interests.slice(-8)
        : [],
      facts: Array.isArray(profile.facts) ? profile.facts.slice(-12) : [],
    },
    messages: Array.isArray(record.messages)
      ? record.messages.slice(-getMaxMessages())
      : [],
  };
}

async function readLocalDatabase(): Promise<MemoryDatabase> {
  try {
    const content = await readFile(getLocalFilePath(), "utf8");
    const parsed = JSON.parse(content) as MemoryDatabase;
    return parsed.version === 1 && parsed.records
      ? parsed
      : { version: 1, records: {}, linkCodes: {} };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return { version: 1, records: {}, linkCodes: {} };
    }
    throw error;
  }
}

async function writeLocalDatabase(database: MemoryDatabase) {
  const filePath = getLocalFilePath();
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(temporaryPath, JSON.stringify(database, null, 2), "utf8");
  await rename(temporaryPath, filePath);
}

function queueLocalWrite(operation: () => Promise<void>) {
  const pending = localWriteQueue.then(operation);
  localWriteQueue = pending.catch(() => undefined);
  return pending;
}

async function loadRecordBySubject(
  channel: AvatarMemoryChannel,
  subjectId: string,
): Promise<AvatarMemoryRecord | null> {
  const mode = getStorageMode();
  let record: AvatarMemoryRecord | null = null;

  if (mode === "upstash") {
    record = await getRedis().get<AvatarMemoryRecord>(
      `${MEMORY_KEY_PREFIX}:${subjectId}`,
    );
  } else if (mode === "local") {
    const database = await readLocalDatabase();
    record = database.records[subjectId] || null;
  } else {
    record = globalMemory.get(subjectId) || null;
  }

  if (!record || isExpired(record)) {
    if (record) {
      await deleteRecordBySubject(subjectId);
    }
    return null;
  }

  return normalizeRecord(record, channel, subjectId);
}

async function saveRecord(record: AvatarMemoryRecord) {
  const mode = getStorageMode();
  const normalized = normalizeRecord(
    record,
    record.channel,
    record.subjectId,
  );

  if (mode === "upstash") {
    await getRedis().set(
      `${MEMORY_KEY_PREFIX}:${record.subjectId}`,
      normalized,
      { ex: getRetentionDays() * 24 * 60 * 60 },
    );
  } else if (mode === "local") {
    await queueLocalWrite(async () => {
      const database = await readLocalDatabase();
      const cutoff = Date.now() - getRetentionDays() * 24 * 60 * 60 * 1_000;

      for (const [key, item] of Object.entries(database.records)) {
        if (Date.parse(item.updatedAt) < cutoff) {
          delete database.records[key];
        }
      }

      database.records[record.subjectId] = normalized;
      await writeLocalDatabase(database);
    });
  } else {
    globalMemory.set(record.subjectId, normalized);
  }
}

async function deleteRecordBySubject(subjectId: string) {
  const mode = getStorageMode();

  if (mode === "upstash") {
    await getRedis().del(`${MEMORY_KEY_PREFIX}:${subjectId}`);
  } else if (mode === "local") {
    await queueLocalWrite(async () => {
      const database = await readLocalDatabase();
      delete database.records[subjectId];
      await writeLocalDatabase(database);
    });
  } else {
    globalMemory.delete(subjectId);
  }
}

function normalizeLinkCode(code: string) {
  return code.toUpperCase().replace(/[^A-Z0-9]/gu, "");
}

function createLinkCode() {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = randomBytes(8);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function isLinkCodeExpired(record: MemoryLinkCodeRecord) {
  return Date.parse(record.expiresAt) <= Date.now();
}

async function saveLinkCode(code: string, record: MemoryLinkCodeRecord) {
  const mode = getStorageMode();
  const normalizedCode = normalizeLinkCode(code);

  if (mode === "upstash") {
    await getRedis().set(`${LINK_CODE_KEY_PREFIX}:${normalizedCode}`, record, {
      ex: DEFAULT_LINK_CODE_MINUTES * 60,
    });
  } else if (mode === "local") {
    await queueLocalWrite(async () => {
      const database = await readLocalDatabase();
      database.linkCodes ||= {};
      database.linkCodes[normalizedCode] = record;
      await writeLocalDatabase(database);
    });
  } else {
    globalLinkCodes.set(normalizedCode, record);
  }
}

async function consumeLinkCode(code: string) {
  const mode = getStorageMode();
  const normalizedCode = normalizeLinkCode(code);
  let record: MemoryLinkCodeRecord | null = null;

  if (mode === "upstash") {
    record = await getRedis().getdel<MemoryLinkCodeRecord>(
      `${LINK_CODE_KEY_PREFIX}:${normalizedCode}`,
    );
  } else if (mode === "local") {
    await queueLocalWrite(async () => {
      const database = await readLocalDatabase();
      record = database.linkCodes?.[normalizedCode] || null;
      if (database.linkCodes) {
        delete database.linkCodes[normalizedCode];
      }
      await writeLocalDatabase(database);
    });
  } else {
    record = globalLinkCodes.get(normalizedCode) || null;
    globalLinkCodes.delete(normalizedCode);
  }

  return record && !isLinkCodeExpired(record) ? record : null;
}

function mergeMemoryRecords(
  primary: AvatarMemoryRecord,
  secondary: AvatarMemoryRecord,
) {
  const primaryCreatedAt = Date.parse(primary.createdAt);
  const secondaryCreatedAt = Date.parse(secondary.createdAt);
  const createdAt =
    Number.isFinite(primaryCreatedAt) &&
    Number.isFinite(secondaryCreatedAt) &&
    primaryCreatedAt > secondaryCreatedAt
      ? secondary.createdAt
      : primary.createdAt;
  const messages = [...secondary.messages, ...primary.messages]
    .sort(
      (left, right) =>
        (Date.parse(left.createdAt || "") || 0) -
        (Date.parse(right.createdAt || "") || 0),
    )
    .slice(-getMaxMessages());

  return {
    ...primary,
    createdAt,
    updatedAt: new Date().toISOString(),
    linkedChannels: Array.from(
      new Set([
        ...(primary.linkedChannels || [primary.channel]),
        ...(secondary.linkedChannels || [secondary.channel]),
      ]),
    ),
    profile: {
      preferredName:
        primary.profile.preferredName || secondary.profile.preferredName,
      language: primary.profile.language || secondary.profile.language,
      interests: Array.from(
        new Set([...secondary.profile.interests, ...primary.profile.interests]),
      ).slice(-8),
      facts: Array.from(
        new Set([...secondary.profile.facts, ...primary.profile.facts]),
      ).slice(-12),
    },
    messages,
  } satisfies AvatarMemoryRecord;
}

function redactSensitiveText(value: string) {
  return value
    .replace(
      /\b(?:bearer\s+)?[A-Za-z0-9+/_=-]{40,}\b/gi,
      "[已隱藏的敏感字串]",
    )
    .replace(
      /(密碼|password|token|secret|access key|api key)\s*[:：=]\s*\S+/gi,
      "$1：[已隱藏]",
    )
    .slice(0, MAX_STORED_MESSAGE_LENGTH)
    .trim();
}

function uniqueRecent(values: string[], value: string, limit: number) {
  return [...values.filter((item) => item !== value), value].slice(-limit);
}

function extractProfile(
  profile: AvatarMemoryProfile,
  message: string,
): AvatarMemoryProfile {
  const next = {
    ...profile,
    interests: [...profile.interests],
    facts: [...profile.facts],
  };
  const compact = message.replace(/\s+/g, " ").trim();
  const nameMatch = compact.match(
    /(?:我叫|叫我|我的名字是|可以叫我|I(?:'m| am)|my name is)\s*([A-Za-z\u3400-\u9fff·・]{1,24})/iu,
  );
  const interestMatch = compact.match(
    /(?:我喜歡|我喜欢|我對.+?有興趣|我对.+?有兴趣|I (?:like|love|am interested in))\s*([^。！？!?\n]{1,60})/iu,
  );

  if (nameMatch?.[1]) {
    next.preferredName = nameMatch[1].trim();
  }

  if (interestMatch?.[1]) {
    next.interests = uniqueRecent(
      next.interests,
      interestMatch[1].trim(),
      8,
    );
  }

  if (/[A-Za-z]/.test(compact) && !/[\u3400-\u9fff]/u.test(compact)) {
    next.language = "en";
  } else if (/[\u3400-\u9fff]/u.test(compact)) {
    next.language = "zh-TW";
  }

  const preferenceMatch = compact.match(
    /(?:請記得|请记得|記得我|记得我|我的偏好是|我習慣|我习惯)\s*[:：]?\s*([^。！？!?\n]{2,100})/u,
  );

  if (
    preferenceMatch?.[1] &&
    !/^(?:我的)?名字$/u.test(preferenceMatch[1].trim()) &&
    !/(密碼|密码|token|secret|信用卡|身分證|身份证)/iu.test(
      preferenceMatch[1],
    )
  ) {
    next.facts = uniqueRecent(
      next.facts,
      preferenceMatch[1].trim(),
      12,
    );
  }

  return next;
}

export function isForgetMemoryCommand(message: string) {
  return /^(忘記我|忘记我|刪除記憶|删除记忆|清除記憶|清除记忆|forget me|delete my memory)[。.!！\s]*$/iu.test(
    message.trim(),
  );
}

export function isMemorySummaryCommand(message: string) {
  return /^(你記得我什麼|妳記得我什麼|你记得我什么|妳记得我什么|what do you remember about me)[？?。\s]*$/iu.test(
    message.trim(),
  );
}

export async function loadAvatarMemory(
  channel: AvatarMemoryChannel,
  externalId: string,
) {
  const subjectId = getSubjectId(channel, externalId);
  const record =
    (await loadRecordBySubject(channel, subjectId)) ||
    createEmptyRecord(channel, subjectId);
  const storageMode = getStorageMode();

  return {
    record,
    context: {
      subjectId: record.subjectId,
      preferredName: record.profile.preferredName,
      interests: record.profile.interests,
      facts: record.profile.facts,
      storageMode,
      durable: storageMode !== "ephemeral",
      linkedToLine: Boolean(record.linkedChannels?.includes("line")),
    } satisfies AvatarMemoryContext,
  };
}

export async function loadAvatarWebMemory(
  externalId: string,
  personToken?: string,
) {
  const linkedSubjectId = parseAvatarPersonToken(personToken);

  if (!linkedSubjectId) {
    return loadAvatarMemory("web", externalId);
  }

  const record =
    (await loadRecordBySubject("line", linkedSubjectId)) ||
    createEmptyRecord("line", linkedSubjectId);
  const storageMode = getStorageMode();

  return {
    record,
    context: {
      subjectId: record.subjectId,
      preferredName: record.profile.preferredName,
      interests: record.profile.interests,
      facts: record.profile.facts,
      storageMode,
      durable: storageMode !== "ephemeral",
      linkedToLine: true,
    } satisfies AvatarMemoryContext,
  };
}

export async function createAvatarWebLinkCode(
  channel: AvatarMemoryChannel,
  externalId: string,
) {
  const subjectId = getSubjectId(channel, externalId);
  const record =
    (await loadRecordBySubject(channel, subjectId)) ||
    createEmptyRecord(channel, subjectId);
  const code = createLinkCode();
  const expiresAt = new Date(
    Date.now() + DEFAULT_LINK_CODE_MINUTES * 60 * 1_000,
  ).toISOString();

  await saveRecord(record);
  await saveLinkCode(code, { subjectId, expiresAt });

  return {
    code,
    expiresAt,
    durable: getStorageMode() !== "ephemeral",
  };
}

export async function linkWebMemoryToCode(
  externalId: string,
  code: string,
) {
  const link = await consumeLinkCode(code);

  if (!link) {
    return null;
  }

  const websiteSubjectId = getSubjectId("web", externalId);
  const lineRecord =
    (await loadRecordBySubject("line", link.subjectId)) ||
    createEmptyRecord("line", link.subjectId);
  const websiteRecord =
    (await loadRecordBySubject("web", websiteSubjectId)) ||
    createEmptyRecord("web", websiteSubjectId);
  const merged = mergeMemoryRecords(lineRecord, websiteRecord);

  await saveRecord(merged);
  if (websiteSubjectId !== link.subjectId) {
    await deleteRecordBySubject(websiteSubjectId);
  }

  return {
    token: createAvatarPersonToken(link.subjectId),
    record: merged,
    context: {
      subjectId: merged.subjectId,
      preferredName: merged.profile.preferredName,
      interests: merged.profile.interests,
      facts: merged.profile.facts,
      storageMode: getStorageMode(),
      durable: getStorageMode() !== "ephemeral",
      linkedToLine: true,
    } satisfies AvatarMemoryContext,
  };
}

export async function saveAvatarConversationTurn(
  record: AvatarMemoryRecord,
  userMessage: string,
  assistantMessage: string,
) {
  const now = new Date().toISOString();
  const messages: AvatarConversationMessage[] = [
    ...record.messages,
    {
      role: "user" as const,
      content: redactSensitiveText(userMessage),
      createdAt: now,
    },
    {
      role: "assistant" as const,
      content: redactSensitiveText(assistantMessage),
      createdAt: now,
    },
  ].slice(-getMaxMessages());

  await saveRecord({
    ...record,
    updatedAt: now,
    profile: extractProfile(record.profile, userMessage),
    messages,
  });
}

export async function deleteAvatarMemory(
  channel: AvatarMemoryChannel,
  externalId: string,
) {
  await deleteRecordBySubject(getSubjectId(channel, externalId));
}

export async function deleteAvatarMemoryRecord(record: AvatarMemoryRecord) {
  await deleteRecordBySubject(record.subjectId);
}

export function isCreateWebLinkCommand(message: string) {
  return /^(?:(?:連結|連接|同步)\s*(?:網站|網頁|web)|link\s*(?:website|web))[。.!！\s]*$/iu.test(
    message.trim(),
  );
}

export function buildMemorySummaryReply(record: AvatarMemoryRecord) {
  const details = [
    record.profile.preferredName
      ? `你希望我叫你「${record.profile.preferredName}」`
      : "",
    record.profile.interests.length
      ? `你提過感興趣的事：${record.profile.interests.join("、")}`
      : "",
    ...record.profile.facts.map((fact) => `你請我記得：${fact}`),
  ].filter(Boolean);

  if (!details.length) {
    return "目前我只保留了最近的對話脈絡，還沒有整理出你的稱呼或偏好。你可以直接告訴我「我叫…」或「請記得…」；控制權在你手上。";
  }

  return [
    "我目前記得這些，而且只會在相關時自然使用：",
    ...details.map((detail) => `• ${detail}`),
    "如果你想全部清除，輸入「忘記我」就可以。",
  ].join("\n");
}

export const avatarMemoryDefaults = {
  localFile: DEFAULT_MEMORY_FILE,
  retentionDays: DEFAULT_RETENTION_DAYS,
  maxMessages: DEFAULT_MAX_MESSAGES,
  linkCodeMinutes: DEFAULT_LINK_CODE_MINUTES,
};
