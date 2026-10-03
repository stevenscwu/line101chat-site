import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { JAPANESE_SAMPLE } from "../src/lib/materials";
import { ownerKey, type VerifiedIdentity } from "../src/lib/server/account-access";

import { createAccountHandlers } from "../src/lib/server/account-http";
import { createSupabaseAccountDependencies, readSupabaseAccountConfig } from "../src/lib/server/supabase-account";
import { GET as listRoute } from "../src/app/api/account/lessons/route";

const config = { url: "https://account-adapter-tests.supabase.co", publishableKey: "sb_publishable_synthetic_test_only" };
const userId = "11111111-1111-4111-8111-111111111111";
const otherUserId = "22222222-2222-4222-8222-222222222222";
const sessionId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const lessonId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
let keys: CryptoKeyPair;
let jwk: JsonWebKey;
beforeAll(async () => {
  keys = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  jwk = await crypto.subtle.exportKey("jwk", keys.publicKey);
});
afterEach(() => vi.unstubAllEnvs());

function payload(overrides: Record<string, unknown> = {}) {
  return { iss: `${config.url}/auth/v1`, aud: "authenticated", role: "authenticated", sub: userId,
    session_id: sessionId, exp: Math.floor(Date.now() / 1000) + 600, iat: Math.floor(Date.now() / 1000),
    is_anonymous: false, ...overrides };
}
async function jwt(overrides: Record<string, unknown> = {}) {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const input = `${encode({ alg: "ES256", kid: "local-test-signing-key", typ: "JWT" })}.${encode(payload(overrides))}`;
  const signature = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, keys.privateKey, new TextEncoder().encode(input));
  return `${input}.${Buffer.from(signature).toString("base64url")}`;
}
function request(token: string, method = "GET", body?: unknown) {
  return new Request("https://line101chat.com/api/account/lessons", { method, headers: {
    authorization: `Bearer ${token}`, "content-type": "application/json", "x-user-id": otherUserId,
  }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
function row(id = lessonId, owner = userId, lesson = { ...JAPANESE_SAMPLE, id }, revision = 1) {
  const time = new Date().toISOString();
  return { owner_id: owner, id, revision, created_at: time, updated_at: time, lesson };
}
function summaryRow(id = lessonId, owner = userId) {
  const { lesson, ...metadata } = row(id, owner);
  return { ...metadata, title: lesson.title, targetLanguage: lesson.targetLanguage, level: lesson.level,
    topic: lesson.topic, sentenceCount: lesson.sentences.length };
}
function usage() {
  return { plan: { key: "pilot", provisional: true }, usage: { lessons: 1, sentences: 3, bytes: 1024 },
    limits: { lessons: 20, sentences: 4000, bytes: 1048576 }, warningThresholdPercent: 80, criticalThresholdPercent: 95,
    nearLimit: [], criticalLimit: [], atLimit: [], overLimit: [] };
}
function provider(overrides: { user?: unknown; context?: unknown; records?: unknown; limit?: unknown;
  authStatus?: number; rpcError?: boolean; save?: unknown; page?: unknown; usage?: unknown; missingUsage?: boolean; missingSummaries?: boolean; paginationError?: boolean } = {}) {
  const calls: { url: URL; headers: Headers; init: RequestInit; body: unknown }[] = [];
  const fetcher = vi.fn<typeof fetch>(async (input, init) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
    calls.push({ url, headers, init: init ?? {}, body });
    if (url.pathname.endsWith("/.well-known/jwks.json")) return Response.json({ keys: [{ ...jwk, kid: "local-test-signing-key", alg: "ES256", use: "sig" }] });
    if (url.pathname === "/auth/v1/user") return Response.json(overrides.authStatus ? { message: "secret-auth-provider-detail" } :
      (overrides.user ?? { id: userId, is_anonymous: false, user_metadata: { permissions: ["security:triage"], role: "owner" } }), { status: overrides.authStatus ?? 200 });
    if (overrides.rpcError && url.pathname.startsWith("/rest/")) return Response.json({ code: "PGRST202", message: "secret-database-detail" }, { status: 404 });
    if (url.pathname === "/rest/v1/rpc/account_access_context") return Response.json(overrides.context ?? { active: true, permissions: [] });
    if (url.pathname === "/rest/v1/rpc/account_rate_limit") return Response.json(overrides.limit ?? true);
    if ((overrides.missingUsage && url.pathname.endsWith("account_library_usage")) ||
        (overrides.missingSummaries && url.pathname.endsWith("list_account_lesson_summaries"))) {
      return Response.json({ code: "PGRST202", message: "private migration missing" }, { status: 404 });
    }
    if (url.pathname === "/rest/v1/rpc/list_account_lesson_summaries") {
      if (overrides.paginationError) return Response.json({ code: "22023", message: "INVALID_PAGINATION" }, { status: 400 });
      return Response.json(overrides.page ?? { lessons: overrides.records ?? [summaryRow()], nextCursor: null });
    }
    if (url.pathname === "/rest/v1/rpc/account_library_usage") return Response.json(overrides.usage ?? usage());
    if (url.pathname === "/rest/v1/rpc/get_account_lesson") return Response.json(overrides.records ?? row());
    if (url.pathname === "/rest/v1/rpc/save_account_lesson") {
      const args = body as { p_id: string; p_lesson: typeof JAPANESE_SAMPLE; p_expected_revision: number | null };
      return Response.json(overrides.save ?? { status: "saved", record: row(args.p_id, userId, args.p_lesson, (args.p_expected_revision ?? 0) + 1) });
    }
    throw new Error("Unexpected provider endpoint");
  });
  return { fetcher, calls };
}

async function harness(overrides: Parameters<typeof provider>[0] = {}) {
  const token = await jwt();
  const req = request(token);
  const transport = provider(overrides);
  const dependencies = createSupabaseAccountDependencies(req, config, transport.fetcher);
  return { token, req, ...transport, dependencies, handlers: createAccountHandlers(dependencies) };
}

describe("Supabase configuration and real SDK verification", () => {
  it("requires explicit opt-in, HTTPS origin and a publishable key; refuses privileged keys", () => {
    const valid = { ACCOUNT_BACKEND: "supabase", SUPABASE_URL: config.url, SUPABASE_PUBLISHABLE_KEY: config.publishableKey };
    expect(readSupabaseAccountConfig({})).toBeNull();
    expect(readSupabaseAccountConfig(valid)).toEqual(config);
    for (const change of [{ ACCOUNT_BACKEND: "" }, { SUPABASE_PUBLISHABLE_KEY: "sb_secret_not_allowed" },
      { SUPABASE_PUBLISHABLE_KEY: "eyJlegacy_service_role" }, { SUPABASE_URL: "http://project.supabase.co" },
      { SUPABASE_URL: `${config.url}/other` }, { SUPABASE_URL: `${config.url}?key=wrong` },
      { SUPABASE_URL: "https://user:password@project.supabase.co" }]) {
      expect(readSupabaseAccountConfig({ ...valid, ...change })).toBeNull();
    }
  });

  it("verifies an actual ES256 signature, current user and database session; ignores editable profile roles", async () => {
    const h = await harness();
    const identity = await h.dependencies.authenticate(h.req);
    expect(identity).toMatchObject({ subject: userId, issuer: `${config.url}/auth/v1`, authentication: "bearer-token", permissions: [] });
    expect(h.calls.some((call) => call.url.pathname === "/auth/v1/user")).toBe(true);
    expect(h.calls.some((call) => call.url.pathname.endsWith("account_access_context"))).toBe(true);
    for (const call of h.calls) {
      expect(call.init.cache).toBe("no-store"); expect(call.init.redirect).toBe("error");
      expect(call.url.origin).toBe(config.url);
    }
  });

  it("rejects missing and transfer-capability tokens without contacting a provider", async () => {
    for (const token of ["", "a".repeat(64), "not-a-jwt"]) {
      const req = request(token); const transport = provider();
      const dependencies = createSupabaseAccountDependencies(req, config, transport.fetcher);
      await expect(dependencies.authenticate(req)).rejects.toMatchObject({ status: 401 });
      expect(transport.fetcher).not.toHaveBeenCalled();
    }
  });

  it("rejects tampered JWT signatures rather than decoding them as identity", async () => {
    const token = await jwt();
    const parts = token.split("."); parts[1] = Buffer.from(JSON.stringify(payload({ sub: otherUserId }))).toString("base64url");
    const req = request(parts.join(".")); const transport = provider();
    const dependencies = createSupabaseAccountDependencies(req, config, transport.fetcher);
    await expect(dependencies.authenticate(req)).rejects.toMatchObject({ status: 401 });
    expect(transport.calls.some((call) => call.url.pathname.startsWith("/rest/"))).toBe(false);
  });

  it("rejects signed tokens for another issuer/audience/role, malformed IDs, future or expired times and anonymous accounts", async () => {
    for (const claims of [{ iss: "https://another.supabase.co/auth/v1" }, { aud: "other" }, { aud: ["authenticated", "other"] },
      { role: "service_role" }, { sub: "other" }, { session_id: "" }, { is_anonymous: true },
      { nbf: Math.floor(Date.now() / 1000) + 60 }, { exp: Math.floor(Date.now() / 1000) - 1 }]) {
      const req = request(await jwt(claims)); const transport = provider();
      const dependencies = createSupabaseAccountDependencies(req, config, transport.fetcher);
      await expect(dependencies.authenticate(req)).rejects.toMatchObject({ status: 401 });
      expect(transport.calls.some((call) => call.url.pathname.startsWith("/rest/"))).toBe(false);
    }
  });

  it("rejects deleted/current-user mismatch and revoked sessions, failing closed on missing migration", async () => {
    for (const options of [{ user: { id: otherUserId } }, { user: { id: userId, is_anonymous: true } },
      { context: { active: false, permissions: [] } }, { authStatus: 401 }]) {
      const h = await harness(options);
      await expect(h.dependencies.authenticate(h.req)).rejects.toMatchObject({ status: 401 });
    }
    const absent = await harness({ rpcError: true });
    const response = await absent.handlers.list(absent.req);
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("secret-database-detail");
  });

  it("takes permissions only from a trusted database context and rejects unknown grants", async () => {
    const granted = await harness({ context: { active: true, permissions: ["product:manage"] } });
    expect((await granted.dependencies.authenticate(granted.req))?.permissions).toEqual(["product:manage"]);
    const invalid = await harness({ context: { active: true, permissions: ["admin"] } });
    await expect(invalid.dependencies.authenticate(invalid.req)).rejects.toMatchObject({ status: 503 });
  });

  it("never reuses a request-scoped identity for another request", async () => {
    const h = await harness();
    await h.dependencies.authenticate(h.req);
    await expect(h.dependencies.authenticate(request(h.token))).rejects.toMatchObject({ status: 401 });
  });
});

describe("Supabase user-context repository", () => {
  it("preserves the user's bearer token/RLS and uses only rate-limited owner-derived read RPCs", async () => {
    const h = await harness();
    const response = await h.handlers.list(h.req);
    expect(response.status).toBe(200);
    const database = h.calls.filter((call) => call.url.pathname.startsWith("/rest/"));
    for (const call of database) {
      expect(call.headers.get("authorization")).toBe(`Bearer ${h.token}`);
      expect(call.headers.get("apikey")).toBe(config.publishableKey);
    }
    const list = database.find((call) => call.url.pathname.endsWith("list_account_lesson_summaries"))!;
    expect(list).toBeDefined();
    expect(list.body).toEqual({ p_limit: 50, p_before_updated_at: null, p_before_id: null });
    expect(database.some((call) => call.url.pathname === "/rest/v1/account_lessons")).toBe(false);
    expect(await response.text()).not.toContain("owner_id");
  });

  it("rejects an owner partition mismatch before querying lessons", async () => {
    const h = await harness();
    await expect(h.dependencies.repository.listSummariesOwned("wrong-owner", { limit: 50, before: null })).rejects.toMatchObject({ status: 401 });
    expect(h.calls.some((call) => ["list_account_lessons", "list_account_lesson_summaries", "account_library_usage"].some((rpc) => call.url.pathname.endsWith(rpc)))).toBe(false);
  });

  it("refuses malformed and foreign-owner rows even if a provider returns them", async () => {
    for (const records of [[summaryRow(lessonId, otherUserId)], [{ id: lessonId }]]) {
      const h = await harness({ records });
      const response = await h.handlers.list(h.req);
      expect(response.status).toBe(503);
      expect(await response.text()).not.toContain(otherUserId);
    }
  });

  it("saves through the atomic RPC without trusting client ownership, timestamps or quota overrides", async () => {
    const token = await jwt(); const req = request(token, "POST", { lesson: JAPANESE_SAMPLE }); const transport = provider();
    const dependencies = createSupabaseAccountDependencies(req, config, transport.fetcher);
    const response = await createAccountHandlers(dependencies).create(req);
    expect(response.status).toBe(201);
    const saved = await response.json();
    const call = transport.calls.find((call) => call.url.pathname.endsWith("save_account_lesson"))!;
    expect(Object.keys(call.body as object).sort()).toEqual(["p_expected_revision", "p_id", "p_lesson"]);
    expect(call.body).toMatchObject({ p_expected_revision: null, p_id: saved.id });
    expect(saved.lesson.id).toBe(saved.id);
    expect(saved.revision).toBe(1);
    expect(transport.calls.some((call) => call.url.pathname.endsWith("account_lessons"))).toBe(false);
  });

  it("maps atomic conflicts, quotas and durable rate denials without exposing database errors", async () => {
    for (const [status, expected] of [["conflict", 409], ["quota-exceeded", 413]] as const) {
      const token = await jwt(); const req = request(token, "POST", { lesson: JAPANESE_SAMPLE }); const transport = provider({ save: { status } });
      const response = await createAccountHandlers(createSupabaseAccountDependencies(req, config, transport.fetcher)).create(req);
      expect(response.status).toBe(expected);
    }
    const denied = await harness({ limit: false });
    expect((await denied.handlers.list(denied.req)).status).toBe(429);
    expect(denied.calls.some((call) => ["list_account_lessons", "list_account_lesson_summaries", "account_library_usage"].some((rpc) => call.url.pathname.endsWith(rpc)))).toBe(false);
  });

  it("refuses a saved result with another account's identity", async () => {
    const h = await harness({ save: { status: "saved", record: row(lessonId, otherUserId) } });
    const identity = await h.dependencies.authenticate(h.req) as VerifiedIdentity;
    await expect(h.dependencies.repository.saveOwned({ ownerKey: ownerKey(identity), id: lessonId, revision: 1,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), lesson: { ...JAPANESE_SAMPLE, id: lessonId } }, null)).rejects.toMatchObject({ status: 503 });
  });
});

describe("account route configuration boundary", () => {
  it("defaults to503, becomes401 for missing real bearer only after explicit Supabase configuration", async () => {
    vi.stubEnv("ACCOUNT_BACKEND", "");
    expect((await listRoute(new Request("https://line101chat.com/api/account/lessons"))).status).toBe(503);
    vi.stubEnv("ACCOUNT_BACKEND", "supabase"); vi.stubEnv("SUPABASE_URL", config.url); vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", config.publishableKey);
    expect((await listRoute(new Request("https://line101chat.com/api/account/lessons"))).status).toBe(401);
  });
});

describe("configurable usage adapter boundaries", () => {
  it("passes exact cursor precision to the summary RPC with no owner or quota input", async () => {
    const token = await jwt();
    const updatedAt = "2026-10-03T00:00:00.123456+00:00";
    const query = new URLSearchParams({ limit: "100", beforeUpdatedAt: updatedAt, beforeId: lessonId });
    const req = new Request(`https://line101chat.com/api/account/lessons?${query}`, request(token));
    const transport = provider({ page: { lessons: [], nextCursor: null } });
    const response = await createAccountHandlers(createSupabaseAccountDependencies(req, config, transport.fetcher)).list(req);
    expect(response.status).toBe(200);
    expect(transport.calls.find((call) => call.url.pathname.endsWith("list_account_lesson_summaries"))?.body)
      .toEqual({ p_limit: 100, p_before_updated_at: updatedAt, p_before_id: lessonId });
    expect(transport.calls.some((call) => call.url.pathname.endsWith("list_account_lessons"))).toBe(false);
  });

  it("loads summaries and usage concurrently after one verified request identity", async () => {
    const h = await harness();
    let release!: () => void;
    const usageStarted = new Promise<void>((resolve) => { release = resolve; });
    const original = h.fetcher.getMockImplementation()!;
    h.fetcher.mockImplementation(async (input, init) => {
      const url = String(input);
      if (url.endsWith("list_account_lesson_summaries")) await usageStarted;
      if (url.endsWith("account_library_usage")) release();
      return original(input, init);
    });
    const response = await h.handlers.list(h.req);
    expect(response.status).toBe(200);
    expect(h.calls.filter((call) => call.url.pathname === "/auth/v1/user")).toHaveLength(1);
    expect(h.calls.filter((call) => call.url.pathname.endsWith("account_access_context"))).toHaveLength(1);
    expect(h.calls.filter((call) => call.url.pathname.endsWith("account_rate_limit"))).toHaveLength(1);
  });

  it("fails closed when only the additive schema is missing and never tries a legacy list or save", async () => {
    for (const change of [{ missingUsage: true }, { missingSummaries: true }]) {
      const h = await harness(change);
      const response = await h.handlers.list(h.req);
      expect(response.status).toBe(503);
      expect(await response.text()).not.toContain("migration");
      expect(h.calls.some((call) => call.url.pathname.endsWith("list_account_lessons"))).toBe(false);
    }
    const token = await jwt(); const req = request(token, "POST", { lesson: JAPANESE_SAMPLE });
    const transport = provider({ missingUsage: true });
    const response = await createAccountHandlers(createSupabaseAccountDependencies(req, config, transport.fetcher)).create(req);
    expect(response.status).toBe(503);
    expect(transport.calls.some((call) => call.url.pathname.endsWith("save_account_lesson"))).toBe(false);
  });

  it("maps database cursor errors to400 and rejects corrupted usage instead of trusting it", async () => {
    const pagination = await harness({ paginationError: true });
    expect((await pagination.handlers.list(pagination.req)).status).toBe(400);
    const invalid = await harness({ usage: { ...usage(), limits: { lessons: "unlimited", sentences: 4000, bytes: 1048576 } } });
    expect((await invalid.handlers.list(invalid.req)).status).toBe(503);
    const noOwner = await harness();
    await expect(noOwner.dependencies.repository.usageOwned("someone-else")).rejects.toMatchObject({ status: 401 });
    expect(noOwner.calls.some((call) => call.url.pathname.endsWith("account_library_usage"))).toBe(false);
  });

  it("reads a downgraded library above20 without fetching lesson payloads", async () => {
    const lessons = Array.from({ length: 25 }, (_, index) => ({ ...summaryRow(`${index.toString(16).padStart(8, "0")}-0000-4000-8000-000000000000`),
      created_at: "2026-10-03T00:00:00Z", updated_at: "2026-10-03T00:00:00Z" }));
    const h = await harness({ page: { lessons, nextCursor: null }, usage: { ...usage(), usage: { lessons: 25, sentences: 75, bytes: 25600 },
      nearLimit: ["lessons"], criticalLimit: ["lessons"], atLimit: ["lessons"], overLimit: ["lessons"] } });
    const response = await h.handlers.list(h.req);
    expect(response.status).toBe(200);
    const result = await response.json(); expect(result.lessons).toHaveLength(25);
    expect(result.usage.overLimit).toEqual(["lessons"]);
    expect(h.calls.some((call) => ["/rest/v1/rpc/list_account_lessons", "/rest/v1/rpc/get_account_lesson"].includes(call.url.pathname))).toBe(false);
    expect(JSON.stringify(result.lessons)).not.toMatch(/originalText|sentences|owner_id/);
  });
});
