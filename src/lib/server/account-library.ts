import "server-only";
import { randomUUID } from "node:crypto";
import { LEVELS, MAX_LESSON_BYTES, MaterialError, validateLesson, type Lesson } from "../materials";
import type { AccountLessonCursor, AccountLibraryUsage, UsageDimension } from "../account-contract";
import { AccountError, ownerKey, type VerifiedIdentity } from "./account-access";

const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export type StoredAccountLesson = {
  ownerKey: string;
  id: string;
  revision: number;
  createdAt: string;
  updatedAt: string;
  lesson: Lesson;
};

/** Never return storage URLs, owner identifiers, credentials or repository metadata. */
export type AccountLesson = Omit<StoredAccountLesson, "ownerKey">;
export type LessonSummary = Omit<AccountLesson, "lesson"> & {
  title: string; targetLanguage: "ja-JP"; level: string; topic: string; sentenceCount: number;
};
export type SaveResult = { status: "saved"; record: StoredAccountLesson } | "conflict" | "quota-exceeded";

export type AccountListOptions = { limit: number; before: AccountLessonCursor | null };
export type AccountLibraryPage = { lessons: LessonSummary[]; nextCursor: AccountLessonCursor | null };
export type StoredLessonSummary = LessonSummary & { ownerKey: string };
export type StoredSummaryPage = { lessons: readonly StoredLessonSummary[]; nextCursor: AccountLessonCursor | null };
export type { AccountLessonCursor, AccountLibraryUsage, UsageDimension } from "../account-contract";
export const ACCOUNT_PAGE_SIZE = 50;
export const ACCOUNT_MAX_PAGE_SIZE = 100;
const DIMENSIONS: readonly UsageDimension[] = ["lessons", "sentences", "bytes"];

/** Production adapters scope every call to the verified owner. Listing returns
 * bounded metadata only, never lesson text. Writes atomically enforce CAS and
 * database-owned effective allowances; no caller-supplied quota is accepted.
 * expectedRevision=null means create-only; replacements cannot upsert. Bytes
 * count UTF-8 JSON payloads, not metadata. Summary pages use updatedAt DESC,
 * id ASC; nextCursor is the last returned row when another page exists.
 * Do not implement production persistence using a process-local Map/filesystem.
 */
export interface AccountLessonRepository {
  listSummariesOwned(owner: string, options: AccountListOptions): Promise<StoredSummaryPage>;
  usageOwned(owner: string): Promise<unknown>;
  getOwned(owner: string, id: string): Promise<StoredAccountLesson | null>;
  saveOwned(record: StoredAccountLesson, expectedRevision: number | null): Promise<SaveResult>;
}

/** Keep database microseconds intact: rounding a cursor to milliseconds can skip
 * rows. Accept explicit ISO timezone offsets, and reject normalized invalid dates.
 */
function timestampMicros(value: unknown): bigint | null {
  if (typeof value !== "string") return null;
  const match = value.match(/^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(?:\.(\d{1,6}))?(Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/);
  if (!match || match[1].startsWith("0000") || !Number.isFinite(Date.parse(value))) return null;
  const day = new Date(`${match[1]}T00:00:00.000Z`);
  if (!Number.isFinite(day.getTime()) || day.toISOString().slice(0, 10) !== match[1]) return null;
  return BigInt(Math.floor(Date.parse(value) / 1000)) * BigInt(1000000) + BigInt((match[5] ?? "").padEnd(6, "0"));
}

export function isAccountCursor(value: unknown): value is AccountLessonCursor {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const cursor = value as Record<string, unknown>;
  return typeof cursor.id === "string" && ID.test(cursor.id) && timestampMicros(cursor.updatedAt) !== null;
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid account metadata");
  return value as Record<string, unknown>;
}

/** Copy only approved server fields. Client entitlements never enter this path. */
export function normalizeAccountUsage(value: unknown): AccountLibraryUsage {
  const input = object(value); const plan = object(input.plan);
  if (typeof plan.key !== "string" || !/^[a-z][a-z0-9_-]{0,63}$/.test(plan.key) || typeof plan.provisional !== "boolean") {
    throw new Error("Invalid account plan metadata");
  }
  function amounts(value: unknown): Record<UsageDimension, number> {
    const input = object(value);
    for (const dimension of DIMENSIONS) {
      if (!Number.isSafeInteger(input[dimension]) || (input[dimension] as number) < 0) throw new Error("Invalid account usage");
    }
    return { lessons: input.lessons as number, sentences: input.sentences as number, bytes: input.bytes as number };
  }
  const usage = amounts(input.usage); const limits = amounts(input.limits);
  const warning = input.warningThresholdPercent; const critical = input.criticalThresholdPercent;
  if (!Number.isInteger(warning) || !Number.isInteger(critical) || (warning as number) < 1 ||
      (critical as number) > 100 || (critical as number) < (warning as number)) throw new Error("Invalid account thresholds");
  function dimensions(key: string, matches: (used: bigint, allowed: bigint) => boolean): UsageDimension[] {
    const value = input[key];
    if (!Array.isArray(value) || new Set(value).size !== value.length ||
        value.some((item) => !DIMENSIONS.includes(item))) throw new Error("Invalid account warning metadata");
    const expected = DIMENSIONS.filter((dimension) => matches(BigInt(usage[dimension]), BigInt(limits[dimension])));
    if (value.length !== expected.length || expected.some((dimension) => !value.includes(dimension))) throw new Error("Inconsistent account warning metadata");
    return expected;
  }
  return { plan: { key: plan.key, provisional: plan.provisional }, usage, limits,
    warningThresholdPercent: warning as number, criticalThresholdPercent: critical as number,
    nearLimit: dimensions("nearLimit", (used, allowed) => used * BigInt(100) >= allowed * BigInt(warning as number)),
    criticalLimit: dimensions("criticalLimit", (used, allowed) => used * BigInt(100) >= allowed * BigInt(critical as number)),
    atLimit: dimensions("atLimit", (used, allowed) => used >= allowed),
    overLimit: dimensions("overLimit", (used, allowed) => used > allowed),
  };
}

function missing(): never {
  throw new AccountError(404, "LESSON_NOT_FOUND", "This lesson is not available in your account library.");
}

function validId(id: string): void { if (!ID.test(id)) missing(); }
function conflict(): never {
  throw new AccountError(409, "REVISION_CONFLICT", "This lesson changed on another device. Reload it before saving.");
}

function copyLesson(value: unknown, id: string): Lesson {
  const lesson = validateLesson(value);
  if (lesson.targetLanguage !== "ja-JP") {
    throw new AccountError(400, "LANGUAGE_NOT_ENABLED", "Account libraries currently support Japanese lessons only.");
  }
  // Account ID is server-owned; preserve stable sentence IDs and the original source.
  const normalized = { ...lesson, id };
  // PostgreSQL JSONB cannot represent NUL or lone UTF-16 surrogate code units.
  // Check every persisted string before sending it to the provider.
  const strings = [normalized.id, normalized.title, normalized.targetLanguage, normalized.level,
    normalized.topic, normalized.sourceName, normalized.originalText,
    ...normalized.sentences.flatMap((sentence) => Object.values(sentence))];
  if (strings.some((text) => text.includes("\u0000") || !text.isWellFormed())) {
    throw new MaterialError("Use valid Unicode text without null characters.");
  }
  if (Buffer.byteLength(JSON.stringify(normalized), "utf8") > MAX_LESSON_BYTES) {
    throw new MaterialError("The lesson is larger than 256 KB. Split it into smaller lessons.");
  }
  return normalized;
}

function present(record: StoredAccountLesson, owner: string, expectedId = record.id): AccountLesson {
  // Defense in depth against a repository returning an unscoped or corrupt record.
  if (record.ownerKey !== owner || record.id !== expectedId) missing();
  validId(record.id);
  if (!Number.isSafeInteger(record.revision) || record.revision < 1 ||
      !Number.isFinite(Date.parse(record.createdAt)) || !Number.isFinite(Date.parse(record.updatedAt)) ||
      Date.parse(record.updatedAt) < Date.parse(record.createdAt)) {
    throw new Error("Invalid stored account lesson metadata");
  }
  return {
    id: record.id, revision: record.revision, createdAt: record.createdAt,
    updatedAt: record.updatedAt, lesson: copyLesson(record.lesson, record.id),
  };
}

async function persist(repository: AccountLessonRepository, record: StoredAccountLesson, expected: number | null) {
  const result = await repository.saveOwned(record, expected);
  if (result === "conflict") conflict();
  if (result === "quota-exceeded") {
    throw new AccountError(413, "LIBRARY_LIMIT_REACHED", "This save would exceed your account storage allowance. Your existing lessons remain available.");
  }
  if (!result || typeof result !== "object" || result.status !== "saved") throw new Error("Invalid repository write result");
  const saved = present(result.record, record.ownerKey, record.id);
  if (saved.revision !== record.revision || JSON.stringify(saved.lesson) !== JSON.stringify(record.lesson)) {
    throw new Error("Repository write result does not match the saved revision");
  }
  return saved;
}

export function createAccountLibrary(repository: AccountLessonRepository) {
  return {
    async list(identity: VerifiedIdentity, options: AccountListOptions = { limit: ACCOUNT_PAGE_SIZE, before: null }): Promise<AccountLibraryPage> {
      if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > ACCOUNT_MAX_PAGE_SIZE ||
          (options.before !== null && !isAccountCursor(options.before))) {
        throw new AccountError(400, "INVALID_PAGINATION", "Use a page size from 1 to 100 and a valid complete lesson cursor.");
      }
      const owner = ownerKey(identity);
      const page = await repository.listSummariesOwned(owner, options);
      if (!page || !Array.isArray(page.lessons) || page.lessons.length > options.limit) throw new Error("Invalid repository page");
      const ids = new Set<string>();
      let previous = options.before;
      const lessons = page.lessons.map((record): LessonSummary => {
        if (record.ownerKey !== owner) missing();
        validId(record.id);
        const created = timestampMicros(record.createdAt); const updated = timestampMicros(record.updatedAt);
        if (!Number.isSafeInteger(record.revision) || record.revision < 1 || created === null || updated === null || updated < created ||
            typeof record.title !== "string" || !record.title.trim() || record.title.length > 120 ||
            record.targetLanguage !== "ja-JP" || !LEVELS["ja-JP"].includes(record.level) ||
            typeof record.topic !== "string" || record.topic.length > 80 ||
            !Number.isInteger(record.sentenceCount) || record.sentenceCount < 1 || record.sentenceCount > 200 ||
            [record.title, record.topic].some((text) => text.includes("\u0000") || !text.isWellFormed()) || ids.has(record.id)) {
          throw new Error("Invalid repository summary metadata");
        }
        if (previous) {
          const beforeTime = timestampMicros(previous.updatedAt)!;
          if (updated > beforeTime || (updated === beforeTime && record.id <= previous.id)) throw new Error("Invalid repository page ordering");
        }
        ids.add(record.id); previous = { updatedAt: record.updatedAt, id: record.id };
        return { id: record.id, revision: record.revision, createdAt: record.createdAt, updatedAt: record.updatedAt,
          title: record.title, targetLanguage: "ja-JP", level: record.level, topic: record.topic, sentenceCount: record.sentenceCount };
      });
      let nextCursor: AccountLessonCursor | null = null;
      if (page.nextCursor !== null) {
        if (!isAccountCursor(page.nextCursor) || lessons.length !== options.limit || !previous ||
            page.nextCursor.id !== previous.id || timestampMicros(page.nextCursor.updatedAt) !== timestampMicros(previous.updatedAt)) {
          throw new Error("Invalid repository next cursor");
        }
        nextCursor = { id: page.nextCursor.id, updatedAt: page.nextCursor.updatedAt };
      }
      return { lessons, nextCursor };
    },
    async usage(identity: VerifiedIdentity): Promise<AccountLibraryUsage> {
      return normalizeAccountUsage(await repository.usageOwned(ownerKey(identity)));
    },
    async get(identity: VerifiedIdentity, id: string): Promise<AccountLesson> {
      validId(id);
      const owner = ownerKey(identity);
      const record = await repository.getOwned(owner, id);
      if (!record) missing();
      return present(record, owner, id);
    },
    async create(identity: VerifiedIdentity, value: unknown): Promise<AccountLesson> {
      const owner = ownerKey(identity);
      const id = randomUUID();
      const lesson = copyLesson(value, id);
      const timestamp = new Date().toISOString();
      const record = { ownerKey: owner, id, revision: 1, createdAt: timestamp, updatedAt: timestamp, lesson };
      return persist(repository, record, null);
    },
    async replace(identity: VerifiedIdentity, id: string, expectedRevision: number, value: unknown): Promise<AccountLesson> {
      validId(id);
      if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 1 || expectedRevision >= Number.MAX_SAFE_INTEGER) {
        throw new AccountError(400, "INVALID_REVISION", "Provide the current lesson revision before saving.");
      }
      const owner = ownerKey(identity);
      const stored = await repository.getOwned(owner, id);
      if (!stored) missing();
      const previous = present(stored, owner, id);
      if (previous.revision !== expectedRevision) conflict();
      const record = { ownerKey: owner, id, revision: expectedRevision + 1, createdAt: previous.createdAt,
        updatedAt: new Date(Math.max(Date.now(), Date.parse(previous.updatedAt))).toISOString(), lesson: copyLesson(value, id) };
      // Atomic compare-and-swap is still required even after the earlier read check.
      return persist(repository, record, expectedRevision);
    },
  };
}
