import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ put: vi.fn(), get: vi.fn(), del: vi.fn(), list: vi.fn(), eval: vi.fn() }));
vi.mock("@vercel/blob", () => ({ put: mocks.put, get: mocks.get, del: mocks.del, list: mocks.list }));
vi.mock("@upstash/redis", () => ({ Redis: class { eval = mocks.eval; } }));

import { JAPANESE_SAMPLE, MAX_LESSON_BYTES } from "../src/lib/materials";
import { authorizeCleanup, cleanupTransfers, createTransfer, readJsonBody, readTransfer, TRANSFER_HOURS, transfersAvailable } from "../src/lib/transfers";
import { GET as status, POST } from "../src/app/api/transfers/route";
import { GET, DELETE } from "../src/app/api/transfers/[token]/route";

const origin = "https://line101chat.com";
const token = "a".repeat(64);
const context = { params: Promise.resolve({ token }) };
const now = Date.parse("2026-10-02T00:00:00Z");

function request(method = "POST", body: unknown = { lesson: JAPANESE_SAMPLE }, extra: Record<string, string> = {}) {
  return new Request(`${origin}/api/transfers`, {
    method,
    headers: { origin, "content-type": "application/json", ...extra },
    ...(method === "POST" ? { body: JSON.stringify(body) } : {}),
  });
}

function stored(expiresAt = new Date(now + TRANSFER_HOURS * 3600000).toISOString()) {
  const data = JSON.stringify({ version: 1, createdAt: now, expiresAt, lesson: JAPANESE_SAMPLE });
  return { statusCode: 200, blob: { size: Buffer.byteLength(data) }, stream: new Blob([data]).stream() };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("TRANSFER_SECRET", "test-secret-".repeat(4));
  vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test-blob-token");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://test.upstash.io");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-redis-token");
  vi.stubEnv("KV_REST_API_URL", "");
  vi.stubEnv("KV_REST_API_TOKEN", "");
  vi.stubEnv("BLOB_STORE_ID", "");
  vi.stubEnv("VERCEL_OIDC_TOKEN", "");
  vi.spyOn(Date, "now").mockReturnValue(now);
  mocks.eval.mockResolvedValue(1);
  mocks.put.mockResolvedValue({ url: "https://private-store.invalid/secret-object" });
  mocks.del.mockResolvedValue(undefined);
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("private transfer routes", () => {
  it("stores privately under a keyed hash and returns a capability fragment, never Blob URLs", async () => {
    const response = await POST(request());
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.token).toMatch(/^[a-f0-9]{64}$/);
    expect(body.url).toBe(`${origin}/transfer#${body.token}`);
    expect(Date.parse(body.expiresAt) - now).toBe(48 * 3600000);
    expect(mocks.put.mock.calls[0][0]).not.toContain(body.token);
    expect(mocks.put.mock.calls[0][2]).toMatchObject({ access: "private", addRandomSuffix: false, allowOverwrite: false });
    expect(JSON.stringify(body)).not.toContain("private-store");
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("rejects cross-origin writes before touching rate limits or storage", async () => {
    expect((await POST(request("POST", {}, { origin: "https://other.invalid" }))).status).toBe(403);
    expect((await DELETE(request("DELETE", null, { origin: "null" }), context)).status).toBe(403);
    expect(mocks.eval).not.toHaveBeenCalled();
    expect(mocks.put).not.toHaveBeenCalled();
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it("disables links when credentials are absent, and fails closed when Redis fails", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    expect(transfersAvailable()).toBe(false);
    expect(await (await status()).json()).toMatchObject({ available: false });
    expect((await POST(request())).status).toBe(503);
    expect(mocks.put).not.toHaveBeenCalled();
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    mocks.eval.mockRejectedValue(new Error("secret-redis-credential"));
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("secret-redis-credential");
    expect(mocks.put).not.toHaveBeenCalled();
  });

  it("enforces durable rate limits for writes and reads", async () => {
    mocks.eval.mockResolvedValue(0);
    expect((await POST(request())).status).toBe(429);
    expect((await GET(request("GET"), context)).status).toBe(429);
    expect(mocks.put).not.toHaveBeenCalled();
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it("validates lessons before upload and media types before body parsing", async () => {
    expect((await POST(request("POST", { lesson: { ...JAPANESE_SAMPLE, level: "C2" } }))).status).toBe(400);
    expect((await POST(request("POST", {}, { "content-type": "text/plain" }))).status).toBe(415);
    expect(mocks.put).not.toHaveBeenCalled();
  });

  it("rejects an oversized streamed body even with a false Content-Length", async () => {
    const stream = new ReadableStream({ start(controller) {
      controller.enqueue(new Uint8Array(MAX_LESSON_BYTES));
      controller.enqueue(new Uint8Array(1));
      controller.close();
    } });
    const req = new Request(`${origin}/api/transfers`, { method: "POST", body: stream,
      headers: { origin, "content-type": "application/json", "content-length": "1" }, duplex: "half" } as RequestInit);
    expect((await POST(req)).status).toBe(413);
    expect(mocks.put).not.toHaveBeenCalled();
  });

  it("rejects malformed UTF-8 instead of replacing bytes in lesson text", async () => {
    const req = new Request(`${origin}/api/transfers`, { method: "POST", headers: { "content-type": "application/json" }, body: new Uint8Array([123, 34, 255, 34, 58, 49, 125]) });
    await expect(readJsonBody(req)).rejects.toMatchObject({ status: 400 });
  });

  it("reads only the private object with caching bypassed and returns the app envelope", async () => {
    mocks.get.mockResolvedValue(stored());
    const response = await GET(request("GET"), context);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ lesson: JAPANESE_SAMPLE, expiresAt: new Date(now + 48 * 3600000).toISOString() });
    expect(mocks.get.mock.calls[0][1]).toEqual({ access: "private", useCache: false });
  });

  it("denies expired links at exactly 48 hours, even before physical cleanup", async () => {
    mocks.get.mockResolvedValue(stored(new Date(now).toISOString()));
    expect((await GET(request("GET"), context)).status).toBe(404);
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it("denies altered token formats without looking up storage", async () => {
    for (const invalid of ["short", "../" + token, "https://example.com", "g".repeat(64)]) {
      await expect(readTransfer(invalid)).rejects.toMatchObject({ status: 404 });
    }
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it("deletes by capability without returning or accepting an arbitrary Blob path", async () => {
    expect((await DELETE(request("DELETE"), context)).status).toBe(200);
    expect(mocks.del.mock.calls[0][0]).toMatch(/^language-companion\/transfers\/v3\/[a-f0-9]{64}\.json$/);
    expect(mocks.del.mock.calls[0][0]).not.toContain(token);
  });

  it("does not leak private storage error details", async () => {
    mocks.put.mockRejectedValue(new Error("blob-token-and-private-url"));
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("blob-token-and-private-url");
  });
});

describe("expiry cleanup", () => {
  it("requires the configured cron bearer secret", () => {
    vi.stubEnv("CRON_SECRET", "cron-secret-".repeat(4));
    expect(() => authorizeCleanup(request("GET"))).toThrow("Unauthorized");
    expect(() => authorizeCleanup(request("GET", null, { authorization: `Bearer ${process.env.CRON_SECRET}` }))).not.toThrow();
  });

  it("deletes only old transfer objects, preserving current lessons and unrelated storage", async () => {
    const expired = `language-companion/transfers/v3/${token}.json`;
    mocks.list.mockResolvedValue({ hasMore: false, blobs: [
      { pathname: expired, uploadedAt: new Date(now - 49 * 3600000) },
      { pathname: `language-companion/transfers/v3/${"b".repeat(64)}.json`, uploadedAt: new Date(now - 3600000) },
      { pathname: "other-feature/keep.json", uploadedAt: new Date(now - 100 * 3600000) },
    ] });
    expect(await cleanupTransfers()).toEqual({ deleted: 1 });
    expect(mocks.del).toHaveBeenCalledWith([expired]);
  });

  it("generates a different capability for every upload", async () => {
    const one = await createTransfer(JAPANESE_SAMPLE);
    const two = await createTransfer(JAPANESE_SAMPLE);
    expect(one.token).not.toBe(two.token);
  });
});
