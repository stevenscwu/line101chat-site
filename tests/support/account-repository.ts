import { AccountError } from "../../src/lib/server/account-access";
import type { AccountLessonRepository, StoredAccountLesson, UsageDimension } from "../../src/lib/server/account-library";

// Explicit test-only pilot defaults, not a production or client entitlement.
export const TEST_PILOT_LIMITS = { lessons: 20, sentences: 4000, bytes: 1024 * 1024 };

/** Test double ONLY. Production must supply durable transactions and owner indexes. */
export function testRepository(initialLimits = TEST_PILOT_LIMITS) {
  const limits = { ...initialLimits };
  const records = new Map<string, StoredAccountLesson>();
  const key = (owner: string, id: string) => `${owner}/${id}`;
  const owned = (owner: string) => [...records.values()].filter((row) => row.ownerKey === owner);
  const measure = (rows: StoredAccountLesson[]) => ({ lessons: rows.length,
    sentences: rows.reduce((sum, row) => sum + row.lesson.sentences.length, 0),
    bytes: rows.reduce((sum, row) => sum + Buffer.byteLength(JSON.stringify(row.lesson), "utf8"), 0),
  });
  const repository: AccountLessonRepository = {
    async listSummariesOwned(owner, { limit, before }) {
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new AccountError(400, "INVALID_PAGINATION", "Invalid page size");
      const rows = owned(owner).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id))
        .filter((row) => !before || row.updatedAt < before.updatedAt || (row.updatedAt === before.updatedAt && row.id > before.id));
      const lessons = rows.slice(0, limit).map(({ lesson, ...metadata }) => ({ ...metadata,
        title: lesson.title, targetLanguage: "ja-JP" as const, level: lesson.level, topic: lesson.topic, sentenceCount: lesson.sentences.length,
      }));
      const last = lessons.at(-1);
      return structuredClone({ lessons, nextCursor: rows.length > limit && last ? { id: last.id, updatedAt: last.updatedAt } : null });
    },
    async usageOwned(owner) {
      const usage = measure(owned(owner));
      const dimensions: UsageDimension[] = ["lessons", "sentences", "bytes"];
      return { plan: { key: "pilot", provisional: true }, usage, limits: { ...limits },
        warningThresholdPercent: 80, criticalThresholdPercent: 95,
        nearLimit: dimensions.filter((key) => usage[key] * 100 >= limits[key] * 80),
        criticalLimit: dimensions.filter((key) => usage[key] * 100 >= limits[key] * 95),
        atLimit: dimensions.filter((key) => usage[key] >= limits[key]),
        overLimit: dimensions.filter((key) => usage[key] > limits[key]),
      };
    },
    async getOwned(owner, id) { return structuredClone(records.get(key(owner, id)) ?? null); },
    async saveOwned(record, expected) {
      // No await between check and write: emulate a database transaction for tests.
      const previous = records.get(key(record.ownerKey, record.id));
      if (expected === null ? previous !== undefined : previous?.revision !== expected) return "conflict";
      const existing = owned(record.ownerKey);
      const other = existing.filter((row) => row.id !== record.id);
      const before = measure(existing); const next = measure([...other, record]);
      if ((["lessons", "sentences", "bytes"] as const).some((key) => next[key] > Math.max(limits[key], before[key]))) return "quota-exceeded";
      records.set(key(record.ownerKey, record.id), structuredClone(record));
      return { status: "saved", record: structuredClone(record) };
    },
  };
  return { repository, records, limits };
}
