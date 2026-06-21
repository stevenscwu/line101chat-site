import { createHmac } from "node:crypto";
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
};

type StorageMode = AvatarMemoryContext["storageMode"];

const DEFAULT_MEMORY_FILE = ".data/celine-memory.json";
const DEFAULT_RETENTION_DAYS = 90;
const DEFAULT_MAX_MESSAGES = 40;
const MAX_STORED_MESSAGE_LENGTH = 1_500;
const MEMORY_KEY_PREFIX = "celine:memory:v1";
const globalMemory = new Map<string, AvatarMemoryRecord>();

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
    channel,
    subjectId,
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
      : { version: 1, records: {} };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return { version: 1, records: {} };
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
      preferredName: record.profile.preferredName,
      interests: record.profile.interests,
      facts: record.profile.facts,
      storageMode,
      durable: storageMode !== "ephemeral",
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
    disclosureSentAt: record.disclosureSentAt || now,
    profile: extractProfile(record.profile, userMessage),
    messages,
  });
}

export async function markMemoryDisclosure(
  channel: AvatarMemoryChannel,
  externalId: string,
) {
  const { record } = await loadAvatarMemory(channel, externalId);

  if (!record.disclosureSentAt) {
    const now = new Date().toISOString();
    await saveRecord({
      ...record,
      disclosureSentAt: now,
      updatedAt: now,
    });
  }
}

export async function deleteAvatarMemory(
  channel: AvatarMemoryChannel,
  externalId: string,
) {
  await deleteRecordBySubject(getSubjectId(channel, externalId));
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

export function getMemoryDisclosure(durable: boolean, english = false) {
  if (english) {
    return durable
      ? "Memory note: to keep relevant conversations coherent, I store limited pseudonymous recent context and preferences you voluntarily share. Send “forget me” to delete it."
      : "Memory note: this environment only keeps temporary conversation context. Send “forget me” to clear it.";
  }

  return durable
    ? "記憶說明：為了讓相關對話接得上，我會以去識別方式保存有限的近期脈絡與你主動告訴我的偏好；輸入「忘記我」可刪除。"
    : "記憶說明：這個環境只會暫時保留本次服務執行期間的對話；輸入「忘記我」可清除。";
}

export const avatarMemoryDefaults = {
  localFile: DEFAULT_MEMORY_FILE,
  retentionDays: DEFAULT_RETENTION_DAYS,
  maxMessages: DEFAULT_MAX_MESSAGES,
};
