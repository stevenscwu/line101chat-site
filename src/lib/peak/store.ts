import { createHash } from "node:crypto";

import { BlobPreconditionFailedError, get, put } from "@vercel/blob";

import { hasPeakPrivateBlobConfig } from "@/lib/peak/config";
import type { ExecutiveState, StoredExecutiveState } from "@/lib/peak/executive-types";
import { parseExecutiveState } from "@/lib/peak/executive-validation";
import type { PeakSnapshot, StoredPeakSnapshot } from "@/lib/peak/types";
import { parsePeakSnapshot } from "@/lib/peak/validation";

const SNAPSHOT_PATH = "peak/dashboard/v1/owner.json";
const REPLAY_PATH = "peak/security/replay-window.json";
const OWNER_PASSWORD_PATH = "peak/security/owner-password.json";
const EXECUTIVE_STATE_PATH = "peak/executive/v1/latest.json";
const SECURITY_STATE_SECONDS = 10 * 60;
const MAX_WRITE_RETRIES = 4;
const globalStore = globalThis as typeof globalThis & {
  peakSnapshot?: StoredPeakSnapshot;
  peakRate?: Map<string, { count: number; expires: number }>;
  peakOwnerPasswordHash?: string;
  peakExecutiveState?: StoredExecutiveState;
};

export function resetPeakStoreForTests() {
  if (process.env.NODE_ENV !== "test") throw new Error("Test reset is unavailable outside tests.");
  delete globalStore.peakSnapshot;
  delete globalStore.peakRate;
  delete globalStore.peakOwnerPasswordHash;
  delete globalStore.peakExecutiveState;
}

type BlobRecord<T> = { value: T; etag: string };
type ReplayState = { nonces: Record<string, number> };
type RateState = { count: number; expiresAt: number };
type OwnerPasswordState = { version: 1; hash: string; updatedAt: string };

export class PeakPrivateStoreError extends Error {
  constructor(public readonly code: "owner_password_corrupt" | "owner_password_verify_failed") {
    super(code);
    this.name = "PeakPrivateStoreError";
  }
}

export function isValidPasswordHash(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const [algorithm, iterations, salt, digest, extra] = value.split("$");
  const count = Number(iterations);
  if (algorithm !== "pbkdf2-sha512" || !Number.isInteger(count) || count < 210_000 || count > 1_000_000 || !salt || !digest || extra !== undefined) return false;
  try {
    const saltBytes = Buffer.from(salt, "base64url"); const digestBytes = Buffer.from(digest, "base64url");
    return saltBytes.length >= 16 && saltBytes.length <= 64 && digestBytes.length >= 32 && digestBytes.length <= 128;
  } catch { return false; }
}

export function resolveOwnerPasswordState(value: unknown, bootstrapHash: string) {
  if (value === null || value === undefined) return { hash: bootstrapHash, source: "bootstrap" as const };
  if (
    typeof value !== "object" ||
    Array.isArray(value) ||
    (value as Partial<OwnerPasswordState>).version !== 1 ||
    !isValidPasswordHash((value as Partial<OwnerPasswordState>).hash) ||
    typeof (value as Partial<OwnerPasswordState>).updatedAt !== "string" ||
    !Number.isFinite(Date.parse((value as Partial<OwnerPasswordState>).updatedAt as string))
  ) {
    throw new PeakPrivateStoreError("owner_password_corrupt");
  }
  return { hash: (value as OwnerPasswordState).hash, source: "durable" as const };
}

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
  const value: unknown = usesPrivateBlob()
    ? (await readJsonBlob<unknown>(OWNER_PASSWORD_PATH))?.value ?? null
    : globalStore.peakOwnerPasswordHash
      ? { version: 1, hash: globalStore.peakOwnerPasswordHash, updatedAt: new Date().toISOString() }
      : null;
  return resolveOwnerPasswordState(value, fallback).hash;
}

export async function getOwnerPasswordStorageStatus() {
  requireDurableProductionStore();
  const value: unknown = usesPrivateBlob()
    ? (await readJsonBlob<unknown>(OWNER_PASSWORD_PATH))?.value ?? null
    : globalStore.peakOwnerPasswordHash
      ? { version: 1, hash: globalStore.peakOwnerPasswordHash, updatedAt: new Date().toISOString() }
      : null;
  if (value === null) return "missing" as const;
  resolveOwnerPasswordState(value, "");
  return "initialized" as const;
}

export async function saveOwnerPasswordHash(hash: string) {
  if (!isValidPasswordHash(hash)) throw new Error("Invalid password hash.");
  requireDurableProductionStore();
  if (usesPrivateBlob()) {
    const state = { version: 1, hash, updatedAt: new Date().toISOString() } satisfies OwnerPasswordState;
    await put(OWNER_PASSWORD_PATH, JSON.stringify(state), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      contentType: "application/json",
    });
    const stored = (await readJsonBlob<unknown>(OWNER_PASSWORD_PATH))?.value ?? null;
    const verified = resolveOwnerPasswordState(stored, "");
    if (verified.source !== "durable" || verified.hash !== hash) {
      throw new PeakPrivateStoreError("owner_password_verify_failed");
    }
    return verified;
  }
  globalStore.peakOwnerPasswordHash = hash;
  return { hash, source: "durable" as const };
}

export async function saveExecutiveState(state: ExecutiveState) {
  requireDurableProductionStore();
  const record = { state, received_at: new Date().toISOString() } satisfies StoredExecutiveState;
  if (usesPrivateBlob()) {
    await put(EXECUTIVE_STATE_PATH, JSON.stringify(record), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      contentType: "application/json",
    });
    return record;
  }
  globalStore.peakExecutiveState = record;
  return record;
}

export async function loadExecutiveState() {
  requireDurableProductionStore();
  const raw: unknown = usesPrivateBlob()
    ? (await readJsonBlob<unknown>(EXECUTIVE_STATE_PATH))?.value ?? null
    : globalStore.peakExecutiveState ?? null;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const candidate = raw as { state?: unknown; received_at?: unknown };
  const state = parseExecutiveState(candidate.state);
  if (!state || typeof candidate.received_at !== "string" || !Number.isFinite(Date.parse(candidate.received_at))) return null;
  return { state, received_at: candidate.received_at } satisfies StoredExecutiveState;
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
