import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { del, get, list, put } from "@vercel/blob";
import { Redis } from "@upstash/redis";
import { MAX_LESSON_BYTES, MaterialError, validateLesson, type Lesson } from "./materials";

export const TRANSFER_HOURS = 48;
const TTL_MS = TRANSFER_HOURS * 60 * 60 * 1000;
const PREFIX = "language-companion/transfers/v3/";
const TOKEN_PATTERN = /^[a-f0-9]{64}$/;
const PATH_PATTERN = /^language-companion\/transfers\/v3\/[a-f0-9]{64}\.json$/;

export class TransferError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "TransferError";
  }
}

function redisCredentials() {
  return {
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  };
}

export function transfersAvailable(): boolean {
  const redis = redisCredentials();
  return Boolean(
    (process.env.TRANSFER_SECRET?.length ?? 0) >= 32 &&
    (process.env.BLOB_READ_WRITE_TOKEN || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)) &&
    redis.url?.startsWith("https://") && redis.token,
  );
}

function requireConfigured() {
  if (!transfersAvailable()) {
    throw new TransferError(503, "Transfer links are unavailable. Download the lesson JSON instead.");
  }
}

function hash(value: string): string {
  const secret = process.env.TRANSFER_SECRET;
  if (!secret || secret.length < 32) throw new TransferError(503, "Transfer links are unavailable.");
  return createHmac("sha256", secret).update(value).digest("hex");
}

function pathname(token: string): string {
  if (!TOKEN_PATTERN.test(token)) throw new TransferError(404, "This transfer link is unavailable or has expired.");
  return `${PREFIX}${hash(`transfer:${token}`)}.json`;
}

export function requireSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new TransferError(403, "Open this website to create or delete a transfer link.");
  }
}

const RATE_SCRIPT = `
local client = redis.call('INCR', KEYS[1])
if client == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
local total = redis.call('INCR', KEYS[2])
if total == 1 then redis.call('EXPIRE', KEYS[2], ARGV[2]) end
if client > tonumber(ARGV[3]) or total > tonumber(ARGV[4]) then return 0 end
return 1
`;

/** Durable atomic limits apply across all serverless instances; storage outages fail closed. */
export async function rateLimit(request: Request, operation: "write" | "read"): Promise<void> {
  requireConfigured();
  const credentials = redisCredentials();
  const redis = new Redis({ url: credentials.url!, token: credentials.token! });
  // Only Vercel's platform-set header is trusted. Other hosts use a shared budget.
  const client = process.env.VERCEL === "1"
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "shared"
    : "shared";
  const windowSeconds = operation === "write" ? 3600 : 60;
  const now = Date.now();
  const keys = [
    `companion:limit:${operation}:${hash(`client:${client}`)}:${Math.floor(now / (windowSeconds * 1000))}`,
    `companion:limit:${operation}:global:${Math.floor(now / 86400000)}`,
  ];
  const allowed = await redis.eval<number[], number>(RATE_SCRIPT, keys, [windowSeconds + 1, 86401, operation === "write" ? 10 : 60, operation === "write" ? 500 : 10000]);
  if (allowed !== 1) throw new TransferError(429, "Too many transfer requests. Please try again later or download the lesson JSON.");
}

/** Enforce the real streamed byte count, even when Content-Length is missing or false. */
export async function readJsonBody(request: Request, maxBytes = MAX_LESSON_BYTES): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    throw new TransferError(415, "Send lesson data as application/json.");
  }
  const advertised = request.headers.get("content-length");
  if (advertised && Number(advertised) > maxBytes) throw new TransferError(413, "The lesson is larger than 256 KB.");
  if (!request.body) throw new TransferError(400, "A lesson is required.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new TransferError(413, "The lesson is larger than 256 KB.");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); } catch {
    throw new TransferError(400, "Send a valid UTF-8 lesson JSON file.");
  }
}

export async function createTransfer(value: unknown): Promise<{ token: string; expiresAt: string }> {
  requireConfigured();
  const lesson = validateLesson(value);
  const token = randomBytes(32).toString("hex");
  const createdAt = Date.now();
  const expiresAt = new Date(createdAt + TTL_MS).toISOString();
  await put(pathname(token), JSON.stringify({ version: 1, createdAt, expiresAt, lesson }), {
    access: "private", addRandomSuffix: false, allowOverwrite: false,
    contentType: "application/json", cacheControlMaxAge: 60,
  });
  return { token, expiresAt };
}

export async function readTransfer(token: string): Promise<{ lesson: Lesson; expiresAt: string }> {
  requireConfigured();
  const path = pathname(token);
  const result = await get(path, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) throw new TransferError(404, "This transfer link is unavailable or has expired.");
  if (result.blob.size > MAX_LESSON_BYTES + 1024) {
    await result.stream.cancel();
    throw new TransferError(404, "This transfer link is unavailable or has expired.");
  }
  const envelope = await readJsonBody(new Request("https://storage.invalid/lesson", {
    method: "POST", headers: { "content-type": "application/json" },
    body: result.stream, duplex: "half",
  } as RequestInit), MAX_LESSON_BYTES + 1024);
  if (!envelope || typeof envelope !== "object" || !("expiresAt" in envelope) || !("createdAt" in envelope) || !("lesson" in envelope)) {
    throw new TransferError(404, "This transfer link is unavailable or has expired.");
  }
  const expiresAt = envelope.expiresAt;
  const createdAt = envelope.createdAt;
  const expiry = typeof expiresAt === "string" ? Date.parse(expiresAt) : NaN;
  if (!Number.isFinite(expiry) || typeof createdAt !== "number" || !Number.isFinite(createdAt) || createdAt > Date.now() || expiry > createdAt + TTL_MS || expiry <= Date.now()) {
    // Access expires regardless of whether background physical cleanup has run.
    throw new TransferError(404, "This transfer link is unavailable or has expired.");
  }
  return { lesson: validateLesson(envelope.lesson), expiresAt: expiresAt as string };
}

export async function deleteTransfer(token: string): Promise<void> {
  requireConfigured();
  await del(pathname(token));
}

export function authorizeCleanup(request: Request): void {
  const secret = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret || ""}`;
  const suppliedBytes = Buffer.from(supplied);
  const expectedBytes = Buffer.from(expected);
  if (!secret || secret.length < 16 || suppliedBytes.length !== expectedBytes.length || !timingSafeEqual(suppliedBytes, expectedBytes)) {
    throw new TransferError(401, "Unauthorized.");
  }
}

/** Deletes only expired objects in this feature's namespace, never unrelated Blob data. */
export async function cleanupTransfers(): Promise<{ deleted: number }> {
  requireConfigured();
  const cutoff = Date.now() - TTL_MS;
  let deleted = 0;
  let cursor: string | undefined;
  for (let page = 0; page < 10; page++) {
    const result = await list({ prefix: PREFIX, cursor, limit: 1000 });
    const expired = result.blobs.filter((blob) => PATH_PATTERN.test(blob.pathname) && blob.uploadedAt.getTime() <= cutoff).map((blob) => blob.pathname);
    for (let index = 0; index < expired.length; index += 100) {
      const batch = expired.slice(index, index + 100);
      await del(batch);
      deleted += batch.length;
    }
    if (!result.hasMore) break;
    cursor = result.cursor;
  }
  return { deleted };
}

export function transferResponse(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: {
    "Cache-Control": "private, no-store, max-age=0",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
  } });
}

export function transferErrorResponse(error: unknown): Response {
  if (error instanceof TransferError) return transferResponse({ error: error.message }, error.status);
  if (error instanceof MaterialError) return transferResponse({ error: error.message }, 400);
  // Do not expose storage URLs, configuration, credentials, lesson text, or tokens.
  return transferResponse({ error: "Transfer links are temporarily unavailable. Download the lesson JSON instead." }, 503);
}
