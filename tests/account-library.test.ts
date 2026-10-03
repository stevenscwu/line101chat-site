import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ENGLISH_SAMPLE, JAPANESE_SAMPLE, MAX_LESSON_BYTES } from "../src/lib/materials";
import { AccountError, ownerKey, requireDashboardPermission, requireIdentity, type VerifiedIdentity } from "../src/lib/server/account-access";
import { createAccountLibrary, normalizeAccountUsage } from "../src/lib/server/account-library";
import { createAccountHandlers } from "../src/lib/server/account-http";
import { GET as usageUnavailable } from "../src/app/api/account/usage/route";
import { GET as listUnavailable, POST as createUnavailable } from "../src/app/api/account/lessons/route";
import { GET as getUnavailable, PUT as replaceUnavailable } from "../src/app/api/account/lessons/[id]/route";
import { testRepository } from "./support/account-repository";

beforeEach(() => vi.stubEnv("ACCOUNT_BACKEND", ""));
afterEach(() => vi.unstubAllEnvs());

const origin = "https://line101chat.com";
const accountA: VerifiedIdentity = { issuer: "https://identity.invalid", subject: "account-a", expiresAt: Date.now() + 3600000, authentication: "session-cookie", permissions: [] };
const accountB: VerifiedIdentity = { ...accountA, subject: "account-b" };
const unknownId = "00000000-0000-4000-8000-000000000000";

function request(method = "GET", value?: unknown, headers: Record<string, string> = {}) {
  return new Request(`${origin}/api/account/lessons`, { method,
    headers: { origin, "content-type": "application/json", ...headers },
    ...(value === undefined ? {} : { body: JSON.stringify(value) }),
  });
}

function harness(identity: VerifiedIdentity | null = accountA) {
  const store = testRepository();
  const authenticate = vi.fn(async () => identity);
  const rateLimit = vi.fn(async () => {});
  const handlers = createAccountHandlers({ authenticate, rateLimit, repository: store.repository });
  return { ...store, authenticate, rateLimit, handlers, library: createAccountLibrary(store.repository) };
}

async function create(h: ReturnType<typeof harness>) {
  const response = await h.handlers.create(request("POST", { lesson: JAPANESE_SAMPLE }));
  expect(response.status).toBe(201);
  return response.json();
}

describe("owned lesson HTTP contract", () => {
  it("a verified account can create on web and read the same lesson with Android bearer auth", async () => {
    const h = harness();
    const saved = await create(h);
    expect(saved.id).not.toBe(JAPANESE_SAMPLE.id);
    expect(saved.lesson.id).toBe(saved.id);
    expect(saved.lesson.sentences).toEqual(JAPANESE_SAMPLE.sentences);
    h.authenticate.mockResolvedValue({ ...accountA, authentication: "bearer-token" });
    const android = new Request(`${origin}/api/account/lessons/${saved.id}`);
    const response = await h.handlers.get(android, saved.id);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(saved);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("vary")).toBe("Cookie, Authorization");
    expect(JSON.stringify(saved)).not.toContain(ownerKey(accountA));
  });

  it("account B cannot list, read, overwrite or infer existence of account A's lesson", async () => {
    const h = harness();
    const saved = await create(h);
    h.authenticate.mockResolvedValue(accountB);
    expect(await (await h.handlers.list(request())).json()).toMatchObject({ lessons: [], nextCursor: null, usage: { usage: { lessons: 0 } } });
    const read = await h.handlers.get(request(), saved.id);
    expect(read.status).toBe(404);
    expect(await read.json()).toEqual(await (await h.handlers.get(request(), unknownId)).json());
    expect((await h.handlers.replace(request("PUT", { lesson: JAPANESE_SAMPLE, expectedRevision: 1 }), saved.id)).status).toBe(404);
    expect((await h.repository.getOwned(ownerKey(accountA), saved.id))?.revision).toBe(1);
  });

  it("dashboard permissions do not confer access to another learner's private content", async () => {
    const h = harness();
    const saved = await create(h);
    h.authenticate.mockResolvedValue({ ...accountB, permissions: ["product:manage", "security:triage"] });
    expect((await h.handlers.get(request(), saved.id)).status).toBe(404);
    expect(await (await h.handlers.list(request())).json()).toMatchObject({ lessons: [], nextCursor: null, usage: { usage: { lessons: 0 } } });
  });

  it("does not accept owner, role, public visibility or storage path fields in uploads", async () => {
    const h = harness();
    for (const key of ["ownerKey", "userId", "role", "visibility", "storagePath", "plan", "limits", "entitlement"]) {
      const response = await h.handlers.create(request("POST", { lesson: JAPANESE_SAMPLE, [key]: "untrusted" }));
      expect(response.status).toBe(400);
    }
    expect(h.records.size).toBe(0);
  });

  it("header and query owner spoofing never change the server-selected owner", async () => {
    const h = harness();
    const req = new Request(`${origin}/api/account/lessons?ownerKey=${ownerKey(accountB)}`, {
      method: "POST", headers: { origin, "content-type": "application/json", "x-user-id": accountB.subject, "x-role": "security:triage" },
      body: JSON.stringify({ lesson: { ...JAPANESE_SAMPLE, ownerKey: ownerKey(accountB), visibility: "public" } }),
    });
    const response = await h.handlers.create(req);
    expect(response.status).toBe(201);
    const saved = await response.json();
    expect(h.records.get(`${ownerKey(accountA)}/${saved.id}`)).toBeDefined();
    expect(JSON.stringify(saved)).not.toContain("visibility");
    expect(await h.repository.listSummariesOwned(ownerKey(accountB), { limit: 50, before: null })).toEqual({ lessons: [], nextCursor: null });
  });

  it("requires authentication before body parsing, limits or repository access", async () => {
    const h = harness(null);
    const response = await h.handlers.create(request("POST", { invalid: true }));
    expect(response.status).toBe(401);
    expect(h.rateLimit).not.toHaveBeenCalled();
    expect(h.records.size).toBe(0);
    expect((await h.handlers.list(request())).status).toBe(401);
    expect((await h.handlers.get(request(), unknownId)).status).toBe(401);
    expect((await h.handlers.replace(request("PUT", {}), unknownId)).status).toBe(401);
  });

  it("does not treat a transfer capability or client identity headers as authentication", async () => {
    const h = harness(null);
    expect((await h.handlers.list(request("GET", undefined, { authorization: `Bearer ${"a".repeat(64)}`, "x-user-id": accountA.subject }))).status).toBe(401);
    expect(h.records.size).toBe(0);
  });

  it("rejects cross-origin and missing-origin cookie writes before persistence", async () => {
    const h = harness();
    for (const headers of ([{ origin: "https://elsewhere.invalid" }, { origin: "null" }, { "sec-fetch-site": "cross-site" }] as Record<string, string>[])) {
      expect((await h.handlers.create(request("POST", { lesson: JAPANESE_SAMPLE }, headers))).status).toBe(403);
    }
    const noOrigin = new Request(`${origin}/api/account/lessons`, { method: "POST", headers: { "content-type": "application/json", authorization: "Bearer unverified-header" }, body: JSON.stringify({ lesson: JAPANESE_SAMPLE }) });
    expect((await h.handlers.create(noOrigin)).status).toBe(403);
    expect(h.rateLimit).not.toHaveBeenCalled();
    expect(h.records.size).toBe(0);
  });

  it("permits native no-Origin writes only with adapter-verified bearer authentication", async () => {
    const h = harness({ ...accountA, authentication: "bearer-token" });
    const req = new Request(`${origin}/api/account/lessons`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lesson: JAPANESE_SAMPLE }) });
    expect((await h.handlers.create(req)).status).toBe(201);
    expect((await h.handlers.create(request("POST", { lesson: JAPANESE_SAMPLE }, { origin: "https://elsewhere.invalid" }))).status).toBe(403);
  });

  it("rejects invalid schema and English account uploads while preserving legacy English tools", async () => {
    const h = harness();
    expect((await h.handlers.create(request("POST", { lesson: { ...JAPANESE_SAMPLE, sentences: [] } }))).status).toBe(400);
    const response = await h.handlers.create(request("POST", { lesson: ENGLISH_SAMPLE }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ code: "LANGUAGE_NOT_ENABLED" });
    expect(h.records.size).toBe(0);
    expect(ENGLISH_SAMPLE.targetLanguage).toBe("en-US");
  });

  it("rejects JSONB-incompatible null and lone-surrogate text before persistence", async () => {
    const h = harness();
    for (const text of ["bad\u0000text", "bad\ud800", "bad\udfff"]) {
      for (const lesson of [{ ...JAPANESE_SAMPLE, originalText: text },
        { ...JAPANESE_SAMPLE, sentences: [{ ...JAPANESE_SAMPLE.sentences[0], english: text }] }]) {
        expect((await h.handlers.create(request("POST", { lesson }))).status).toBe(400);
      }
    }
    expect(h.records.size).toBe(0);
  });

  it("validates media type, malformed JSON, UTF-8 and real streamed byte count", async () => {
    const h = harness();
    expect((await h.handlers.create(request("POST", {}, { "content-type": "text/plain" }))).status).toBe(415);
    for (const payload of ["{", "[]", new Uint8Array([123, 34, 255, 34, 58, 49, 125])]) {
      const req = new Request(`${origin}/api/account/lessons`, { method: "POST", headers: { origin, "content-type": "application/json" }, body: payload });
      expect((await h.handlers.create(req)).status).toBe(400);
    }
    const stream = new ReadableStream({ start(controller) {
      controller.enqueue(new Uint8Array(MAX_LESSON_BYTES + 1024)); controller.enqueue(new Uint8Array(1)); controller.close();
    } });
    const req = new Request(`${origin}/api/account/lessons`, { method: "POST", headers: { origin, "content-type": "application/json", "content-length": "1" }, body: stream, duplex: "half" } as RequestInit);
    expect((await h.handlers.create(req)).status).toBe(413);
    expect(h.records.size).toBe(0);
  });

  it("refuses dangerous IDs without repository access", async () => {
    const h = harness();
    const read = vi.spyOn(h.repository, "getOwned");
    for (const id of ["../other", "a".repeat(64), JAPANESE_SAMPLE.id, "https://storage.invalid/private"]) {
      expect((await h.handlers.get(request(), id)).status).toBe(404);
    }
    expect(read).not.toHaveBeenCalled();
  });

  it("fails closed when auth, durable limits or storage fail without leaking details", async () => {
    for (const failure of ["auth", "limit", "storage"]) {
      const h = harness();
      const error = new Error("private-storage-url secret token account-a");
      if (failure === "auth") h.authenticate.mockRejectedValue(error);
      if (failure === "limit") h.rateLimit.mockRejectedValue(error);
      if (failure === "storage") vi.spyOn(h.repository, "saveOwned").mockRejectedValue(error);
      const response = await h.handlers.create(request("POST", { lesson: JAPANESE_SAMPLE }));
      expect(response.status).toBe(503);
      expect(await response.text()).not.toMatch(/secret|storage-url|account-a/);
      expect(h.records.size).toBe(0);
    }
  });

  it("propagates bounded rate-limit responses and never saves after a limit denial", async () => {
    const h = harness();
    h.rateLimit.mockRejectedValue(new AccountError(429, "RATE_LIMITED", "Please try again later."));
    expect((await h.handlers.create(request("POST", { lesson: JAPANESE_SAMPLE }))).status).toBe(429);
    expect(h.records.size).toBe(0);
  });

  it("rejects repository ownership and ID mismatches rather than leaking rows", async () => {
    const h = harness();
    const saved = await create(h);
    const stored = h.records.get(`${ownerKey(accountA)}/${saved.id}`)!;
    vi.spyOn(h.repository, "getOwned").mockResolvedValue({ ...stored, ownerKey: ownerKey(accountB) });
    expect((await h.handlers.get(request(), saved.id)).status).toBe(404);
    vi.spyOn(h.repository, "listSummariesOwned").mockResolvedValue({ lessons: [{ ...stored, ownerKey: ownerKey(accountB), title: "Other", targetLanguage: "ja-JP", level: "", topic: "", sentenceCount: 1 }], nextCursor: null });
    expect((await h.handlers.list(request())).status).toBe(404);
    vi.spyOn(h.repository, "getOwned").mockResolvedValue({ ...stored, id: unknownId });
    expect((await h.handlers.get(request(), saved.id)).status).toBe(404);
  });

  it("lists metadata without returning original text or sentences", async () => {
    const h = harness();
    const saved = await create(h);
    const result = await (await h.handlers.list(request())).json();
    expect(result.lessons[0]).toMatchObject({ id: saved.id, title: JAPANESE_SAMPLE.title, sentenceCount: JAPANESE_SAMPLE.sentences.length });
    expect(JSON.stringify(result.lessons)).not.toMatch(/originalText|sentences|ownerKey/);
  });
});

describe("multi-device updates and quota contract", () => {
  it("requires revision and preserves source/sentence IDs on a successful update", async () => {
    const h = harness();
    const saved = await create(h);
    expect((await h.handlers.replace(request("PUT", { lesson: JAPANESE_SAMPLE }), saved.id)).status).toBe(400);
    const response = await h.handlers.replace(request("PUT", { lesson: { ...JAPANESE_SAMPLE, title: "京都の練習" }, expectedRevision: 1 }), saved.id);
    expect(response.status).toBe(200);
    const updated = await response.json();
    expect(updated.revision).toBe(2);
    expect(updated.createdAt).toBe(saved.createdAt);
    expect(updated.lesson.originalText).toBe(saved.lesson.originalText);
    expect(updated.lesson.sentences).toEqual(saved.lesson.sentences);
    expect((await h.handlers.replace(request("PUT", { lesson: JAPANESE_SAMPLE, expectedRevision: 1 }), saved.id)).status).toBe(409);
    expect((await h.library.get(accountA, saved.id)).lesson.title).toBe("京都の練習");
  });

  it("two concurrent writes with the same revision cannot both win", async () => {
    const h = harness();
    const saved = await create(h);
    const responses = await Promise.all(["First", "Second"].map((title) => h.handlers.replace(request("PUT", {
      lesson: { ...JAPANESE_SAMPLE, title }, expectedRevision: 1,
    }), saved.id)));
    expect(responses.map((response) => response.status).sort()).toEqual([200, 409]);
    expect((await h.library.get(accountA, saved.id)).revision).toBe(2);
  });

  it("invalid revisions cannot overflow or create a missing record", async () => {
    const h = harness();
    const saved = await create(h);
    for (const revision of [0, -1, 1.5, Number.MAX_SAFE_INTEGER]) {
      expect((await h.handlers.replace(request("PUT", { lesson: JAPANESE_SAMPLE, expectedRevision: revision }), saved.id)).status).toBe(400);
    }
    expect((await h.handlers.replace(request("PUT", { lesson: JAPANESE_SAMPLE, expectedRevision: 1 }), unknownId)).status).toBe(404);
    expect(h.records.size).toBe(1);
  });

  it("atomic lesson count quota survives concurrent creates and is scoped per account", async () => {
    const h = harness();
    const responses = await Promise.all(Array.from({ length: 21 }, () => h.handlers.create(request("POST", { lesson: JAPANESE_SAMPLE }))));
    expect(responses.filter((response) => response.status === 201)).toHaveLength(20);
    expect(responses.filter((response) => response.status === 413)).toHaveLength(1);
    h.authenticate.mockResolvedValue(accountB);
    expect((await h.handlers.create(request("POST", { lesson: JAPANESE_SAMPLE }))).status).toBe(201);
  });

  it("enforces total UTF-8 byte quota without corrupting prior records", async () => {
    const h = harness();
    const largeLesson = { ...JAPANESE_SAMPLE, originalText: "あ".repeat(60000) };
    for (let index = 0; index < 5; index++) {
      expect((await h.handlers.create(request("POST", { lesson: largeLesson }))).status).toBe(201);
    }
    expect((await h.handlers.create(request("POST", { lesson: largeLesson }))).status).toBe(413);
    expect(h.records.size).toBe(5);
  });
});

describe("verified identity and distinct dashboards", () => {
  it("partitions same subject from different issuers and ambiguous string pairs", () => {
    expect(ownerKey(accountA)).not.toBe(ownerKey({ ...accountA, issuer: "https://other.invalid" }));
    expect(ownerKey({ ...accountA, issuer: "ab", subject: "c" })).not.toBe(ownerKey({ ...accountA, issuer: "a", subject: "bc" }));
  });

  it("rejects missing, malformed and exactly-expired identities", async () => {
    for (const identity of [null, { ...accountA, subject: "" }, { ...accountA, issuer: "" }, { ...accountA, expiresAt: 1000 }, { ...accountA, expiresAt: NaN }]) {
      await expect(requireIdentity(request(), async () => identity, 1000)).rejects.toMatchObject({ status: 401 });
    }
  });

  it("product and security grants are independent; neither is implicit for learners", async () => {
    const product = async () => ({ ...accountA, permissions: ["product:manage"] as const });
    const security = async () => ({ ...accountA, permissions: ["security:triage"] as const });
    await expect(requireDashboardPermission(request(), product, "product")).resolves.toBeDefined();
    await expect(requireDashboardPermission(request(), product, "security")).rejects.toMatchObject({ status: 403 });
    await expect(requireDashboardPermission(request(), security, "security", ownerKey(accountA))).resolves.toBeDefined();
    await expect(requireDashboardPermission(request(), security, "security")).rejects.toMatchObject({ status: 403 });
    await expect(requireDashboardPermission(request(), security, "security", ownerKey(accountB))).rejects.toMatchObject({ status: 403 });
    await expect(requireDashboardPermission(request(), security, "product")).rejects.toMatchObject({ status: 403 });
    await expect(requireDashboardPermission(request(), async () => accountA, "product")).rejects.toMatchObject({ status: 403 });
    await expect(requireDashboardPermission(request(), async () => null, "security")).rejects.toMatchObject({ status: 401 });
  });
});

describe("unconfigured production routes", () => {
  it("all account endpoints fail closed with no mock login or storage fallback", async () => {
    for (const route of [() => usageUnavailable(request()), () => listUnavailable(request()), () => createUnavailable(request("POST", {})),
      () => getUnavailable(request(), { params: Promise.resolve({ id: unknownId }) }),
      () => replaceUnavailable(request("PUT", {}), { params: Promise.resolve({ id: unknownId }) })]) {
      const response = await route();
      expect(response.status).toBe(503);
      expect(await response.json()).toMatchObject({ code: "ACCOUNT_SERVICE_UNAVAILABLE" });
      expect(response.headers.get("cache-control")).toContain("no-store");
    }
  });
});

describe("paginated summaries and server-owned usage", () => {
  it("reads every lesson above the old pilot cap, including after a downgrade", async () => {
    const h = harness();
    h.limits.lessons = 100;
    for (let index = 0; index < 55; index++) await create(h);
    h.limits.lessons = 20;
    const first = await (await h.handlers.list(request())).json();
    expect(first.lessons).toHaveLength(50);
    expect(first.usage.usage.lessons).toBe(55);
    expect(first.usage.overLimit).toContain("lessons");
    const query = new URLSearchParams({ beforeUpdatedAt: first.nextCursor.updatedAt, beforeId: first.nextCursor.id });
    const second = await (await h.handlers.list(new Request(`${origin}/api/account/lessons?${query}`))).json();
    expect(second.lessons).toHaveLength(5);
    expect(second.nextCursor).toBeNull();
    expect(new Set([...first.lessons, ...second.lessons].map((row) => row.id)).size).toBe(55);
    const sample = second.lessons[0];
    expect((await h.handlers.get(request(), sample.id)).status).toBe(200);
    expect((await h.handlers.create(request("POST", { lesson: JAPANESE_SAMPLE }))).status).toBe(413);
  });

  it("validates limits, duplicate/unknown parameters and complete ISO/UUID cursors before querying", async () => {
    const h = harness();
    const list = vi.spyOn(h.repository, "listSummariesOwned");
    const usage = vi.spyOn(h.repository, "usageOwned");
    for (const query of ["limit=0", "limit=101", "limit=-1", "limit=1.5", "limit=", "limit=01", "limit=1e2",
      "limit=10&limit=20", "ownerKey=somebody", "plan=paid", "beforeId=" + unknownId,
      "beforeUpdatedAt=2026-10-03T00:00:00Z", `beforeId=${unknownId}&beforeUpdatedAt=2026-02-30T00:00:00Z`,
      `beforeId=${unknownId}&beforeUpdatedAt=2026-10-03`, "beforeId=not-a-uuid&beforeUpdatedAt=2026-10-03T00:00:00Z"]) {
      expect((await h.handlers.list(new Request(`${origin}/api/account/lessons?${query}`))).status, query).toBe(400);
    }
    expect(list).not.toHaveBeenCalled(); expect(usage).not.toHaveBeenCalled();
    const result = await h.handlers.list(new Request(`${origin}/api/account/lessons?limit=100`));
    expect(result.status).toBe(200);
    expect(list).toHaveBeenCalledWith(ownerKey(accountA), { limit: 100, before: null });
  });

  it("preserves sub-millisecond keyset timestamps and strips all unapproved summary fields", async () => {
    const h = harness();
    const updatedAt = "2026-10-03T00:00:00.123456+00:00";
    vi.spyOn(h.repository, "listSummariesOwned").mockResolvedValue({ lessons: [{ ownerKey: ownerKey(accountA),
      id: unknownId, revision: 1, createdAt: "2026-10-02T00:00:00Z", updatedAt,
      title: "日本語", targetLanguage: "ja-JP", level: "N5", topic: "", sentenceCount: 1,
      lesson: JAPANESE_SAMPLE, storageUrl: "private" } as never], nextCursor: { id: unknownId, updatedAt } });
    const response = await h.handlers.list(new Request(`${origin}/api/account/lessons?limit=1`));
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.nextCursor).toEqual({ id: unknownId, updatedAt });
    expect(Object.keys(result.lessons[0]).sort()).toEqual(["id", "revision", "createdAt", "updatedAt", "title", "targetLanguage", "level", "topic", "sentenceCount"].sort());
  });

  it("rejects malformed, duplicate, unsorted and inconsistent provider page data", async () => {
    const h = harness(); await create(h);
    const page = await h.repository.listSummariesOwned(ownerKey(accountA), { limit: 50, before: null });
    const row = page.lessons[0];
    for (const bad of [
      { lessons: [{ ...row, sentenceCount: 0 }], nextCursor: null },
      { lessons: [{ ...row, targetLanguage: "en-US" }], nextCursor: null },
      { lessons: [{ ...row, revision: 1.5 }], nextCursor: null },
      { lessons: [row, row], nextCursor: null },
      { lessons: [row], nextCursor: { id: row.id, updatedAt: row.updatedAt } },
      { lessons: [row], nextCursor: undefined },
    ]) {
      vi.spyOn(h.repository, "listSummariesOwned").mockResolvedValue(bad as never);
      expect((await h.handlers.list(request())).status).toBe(503);
    }
  });

  it("returns only own usage and rejects owner/quota query input", async () => {
    const h = harness(); await create(h);
    const result = await h.handlers.usage(new Request(`${origin}/api/account/usage`));
    expect(result.status).toBe(200);
    expect(await result.json()).toMatchObject({ plan: { key: "pilot", provisional: true }, usage: { lessons: 1 }, limits: { lessons: 20 } });
    h.authenticate.mockResolvedValue(accountB);
    expect(await (await h.handlers.usage(request())).json()).toMatchObject({ usage: { lessons: 0, sentences: 0, bytes: 0 } });
    expect((await h.handlers.usage(new Request(`${origin}/api/account/usage?ownerId=other`))).status).toBe(400);
    h.authenticate.mockResolvedValue(null);
    expect((await h.handlers.usage(request())).status).toBe(401);
  });

  it("normalizes configurable usage, zero allowances and exact inclusive warning boundaries", async () => {
    const h = harness(); const empty = await h.repository.usageOwned(ownerKey(accountA)) as ReturnType<typeof normalizeAccountUsage>;
    expect(normalizeAccountUsage({ ...empty, providerToken: "secret", plan: { ...empty.plan, receipt: "private" } })).toEqual(empty);
    const usage = { lessons: 80, sentences: 95, bytes: 101 };
    const value = { ...empty, usage, limits: { lessons: 100, sentences: 100, bytes: 100 }, nearLimit: ["lessons", "sentences", "bytes"],
      criticalLimit: ["sentences", "bytes"], atLimit: ["bytes"], overLimit: ["bytes"] };
    expect(normalizeAccountUsage(value)).toEqual(value);
    const all = ["lessons", "sentences", "bytes"];
    expect(normalizeAccountUsage({ ...empty, limits: { lessons: 0, sentences: 0, bytes: 0 }, nearLimit: all, criticalLimit: all, atLimit: all })).toMatchObject({ atLimit: all, overLimit: [] });
    for (const invalid of [{ ...empty, usage: { ...empty.usage, bytes: -1 } }, { ...empty, limits: { ...empty.limits, bytes: Number.MAX_SAFE_INTEGER + 1 } },
      { ...empty, plan: { key: "pilot", provisional: "true" } }, { ...empty, warningThresholdPercent: 0 },
      { ...empty, criticalThresholdPercent: 79 }, { ...empty, nearLimit: ["invalid"] }, { ...empty, nearLimit: ["lessons"] },
      { ...empty, overLimit: ["lessons", "lessons"] }]) {
      expect(() => normalizeAccountUsage(invalid)).toThrow();
    }
  });
});
