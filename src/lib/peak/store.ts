import { createHash } from "node:crypto";

import { BlobPreconditionFailedError, get, put } from "@vercel/blob";

import { hasPeakPrivateBlobConfig } from "@/lib/peak/config";
import type { PeakSnapshot, StoredPeakSnapshot } from "@/lib/peak/types";
import { parsePeakSnapshot } from "@/lib/peak/validation";

const SNAPSHOT_PATH = "peak/dashboard/v1/owner.json";
const REPLAY_PATH = "peak/security/replay-window.json";
const OWNER_PASSWORD_PATH = "peak/security/owner-password.json";
const SECURITY_STATE_SECONDS = 10 * 60;
const MAX_WRITE_RETRIES = 4;
const globalStore = globalThis as typeof globalThis & {
  peakSnapshot?: StoredPeakSnapshot;
  peakRate?: Map<string, { count: number; expires: number }>;
  peakOwnerPasswordHash?: string;
};

type BlobRecord<T> = { value: T; etag: string };
type ReplayState = { nonces: Record<string, number> };
type RateState = { count: number; expiresAt: number };
type OwnerPasswordState = { version: 1; hash: string; updatedAt: string };

function usesPrivateBlob() {
  return process.env.NODE_ENV === "production";
}

function requireDurableProductionStore() {
  if (usesPrivateBlob() && !hasPeakPrivateBlobConfig()) {
    throw new Error("Private dashboard storage is unavailable.");
  }
}

async function readJsonBlob<T>(pathname: string): Promise<BlobRecord<T> | null> {
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  const text = await new Response(result.stream).text();
  return { value: JSON.parse(text) as T, etag: result.blob.etag };
}

async function writeJsonBlob<T>(pathname: string, value: T, previousEtag?: string) {
  await put(pathname, JSON.stringify(value), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: Boolean(previousEtag),
    cacheControlMaxAge: 60,
    contentType: "application/json",
    ifMatch: previousEtag,
  });
}

async function retryConditionalWrite<T>(
  pathname: string,
  update: (current: T | null) => { value?: T; result: boolean },
) {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_WRITE_RETRIES; attempt += 1) {
    const current = await readJsonBlob<T>(pathname);
    const change = update(current?.value ?? null);
    if (!change.value) return change.result;
    try {
      await writeJsonBlob(pathname, change.value, current?.etag);
      return change.result;
    } catch (error) {
      lastError = error;
      if (error instanceof BlobPreconditionFailedError) continue;
      if (!current && (await readJsonBlob<T>(pathname))) continue;
      throw error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Private storage write conflict.");
}

export async function savePeakSnapshot(snapshot: PeakSnapshot) {
  requireDurableProductionStore();
  const record = { snapshot, receivedAt: new Date().toISOString() } satisfies StoredPeakSnapshot;
  if (usesPrivateBlob()) {
    await put(SNAPSHOT_PATH, JSON.stringify(record), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      contentType: "application/json",
    });
    return;
  }
  globalStore.peakSnapshot = record;
}

export async function loadPeakSnapshot() {
  requireDurableProductionStore();
  const raw: unknown = usesPrivateBlob()
    ? (await readJsonBlob<unknown>(SNAPSHOT_PATH))?.value ?? null
    : globalStore.peakSnapshot ?? null;
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as { snapshot?: unknown; receivedAt?: unknown };
  const snapshot = parsePeakSnapshot(candidate.snapshot);
  if (!snapshot || typeof candidate.receivedAt !== "string" || !Number.isFinite(Date.parse(candidate.receivedAt))) return null;
  return { snapshot, receivedAt: candidate.receivedAt } satisfies StoredPeakSnapshot;
}

export async function loadOwnerPasswordHash(fallback: string) {
  requireDurableProductionStore();
  const hash = usesPrivateBlob()
    ? (await readJsonBlob<OwnerPasswordState>(OWNER_PASSWORD_PATH))?.value.hash
    : globalStore.peakOwnerPasswordHash;
  return typeof hash === "string" && hash.startsWith("pbkdf2-sha512$") ? hash : fallback;
}

export async function saveOwnerPasswordHash(hash: string) {
  if (!hash.startsWith("pbkdf2-sha512$")) throw new Error("Invalid password hash.");
  requireDurableProductionStore();
  if (usesPrivateBlob()) {
    await put(OWNER_PASSWORD_PATH, JSON.stringify({ version: 1, hash, updatedAt: new Date().toISOString() }), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      contentType: "application/json",
    });
    return;
  }
  globalStore.peakOwnerPasswordHash = hash;
}

export async function consumeReplayNonce(nonce: string) {
  requireDurableProductionStore();
  if (usesPrivateBlob()) {
    const now = Date.now();
    return retryConditionalWrite<ReplayState>(REPLAY_PATH, (current) => {
      const nonces = Object.fromEntries(
        Object.entries(current?.nonces ?? {}).filter(([, expires]) => expires > now),
      );
      if (nonces[nonce]) return { result: false };
      nonces[nonce] = now + SECURITY_STATE_SECONDS * 1_000;
      return { value: { nonces }, result: true };
    });
  }
  const key = `nonce:${nonce}`;
  const map = (globalStore.peakRate ??= new Map());
  const now = Date.now();
  const existing = map.get(key);
  if (existing && existing.expires > now) return false;
  map.set(key, { count: 1, expires: now + SECURITY_STATE_SECONDS * 1_000 });
  return true;
}

export async function allowAttempt(key: string, maximum: number, seconds: number) {
  requireDurableProductionStore();
  if (usesPrivateBlob()) {
    const fingerprint = createHash("sha256").update(key).digest("hex").slice(0, 32);
    const pathname = `peak/security/rate/${fingerprint}.json`;
    return retryConditionalWrite<RateState>(pathname, (current) => {
      const now = Date.now();
      if (!current || current.expiresAt <= now) {
        return { value: { count: 1, expiresAt: now + seconds * 1_000 }, result: true };
      }
      if (current.count >= maximum) return { result: false };
      return { value: { ...current, count: current.count + 1 }, result: true };
    });
  }
  const storageKey = `rate:${key}`;
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
