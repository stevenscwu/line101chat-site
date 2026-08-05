import { Redis } from "@upstash/redis";

import { getPeakRedisConfig } from "@/lib/peak/config";
import type { PeakSnapshot, StoredPeakSnapshot } from "@/lib/peak/types";
import { parsePeakSnapshot } from "@/lib/peak/validation";

const SNAPSHOT_KEY = "peak:dashboard:v1:owner";
const globalStore = globalThis as typeof globalThis & { peakSnapshot?: StoredPeakSnapshot; peakRate?: Map<string, { count: number; expires: number }>; };

function redis() {
  const config = getPeakRedisConfig();
  return config ? new Redis(config) : null;
}

function requireDurableProductionStore() {
  if (process.env.NODE_ENV === "production" && !redis()) {
    throw new Error("Private dashboard storage is unavailable.");
  }
}

export async function savePeakSnapshot(snapshot: PeakSnapshot) {
  requireDurableProductionStore();
  const record = { snapshot, receivedAt: new Date().toISOString() } satisfies StoredPeakSnapshot;
  const client = redis();
  if (client) await client.set(SNAPSHOT_KEY, record, { ex: 7 * 24 * 60 * 60 });
  else globalStore.peakSnapshot = record;
}

export async function loadPeakSnapshot() {
  requireDurableProductionStore();
  const client = redis();
  const raw: unknown = client ? await client.get<unknown>(SNAPSHOT_KEY) : globalStore.peakSnapshot ?? null;
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as { snapshot?: unknown; receivedAt?: unknown };
  const snapshot = parsePeakSnapshot(candidate.snapshot);
  if (!snapshot || typeof candidate.receivedAt !== "string" || !Number.isFinite(Date.parse(candidate.receivedAt))) return null;
  return { snapshot, receivedAt: candidate.receivedAt } satisfies StoredPeakSnapshot;
}

export async function consumeReplayNonce(nonce: string) {
  const client = redis();
  if (process.env.NODE_ENV === "production" && !client) return false;
  const key = `peak:dashboard:nonce:${nonce}`;
  if (client) return (await client.set(key, "1", { nx: true, ex: 600 })) === "OK";
  const map = (globalStore.peakRate ??= new Map());
  if (map.has(key)) return false;
  map.set(key, { count: 1, expires: Date.now() + 600_000 });
  return true;
}

export async function allowAttempt(key: string, maximum: number, seconds: number) {
  const client = redis();
  if (process.env.NODE_ENV === "production" && !client) return false;
  const storageKey = `peak:dashboard:rate:${key}`;
  if (client) {
    const count = await client.incr(storageKey);
    if (count === 1) await client.expire(storageKey, seconds);
    return count <= maximum;
  }
  const map = (globalStore.peakRate ??= new Map());
  const now = Date.now();
  const entry = map.get(storageKey);
  if (!entry || entry.expires <= now) {
    map.set(storageKey, { count: 1, expires: now + seconds * 1_000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= maximum;
}
