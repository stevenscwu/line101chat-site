import "server-only";
import { readAccountConfig } from "../account-config";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { AccountError, ownerKey, type DashboardPermission, type VerifiedIdentity } from "./account-access";
import { normalizeAccountUsage, type AccountLessonRepository, type StoredAccountLesson, type StoredLessonSummary } from "./account-library";
import type { AccountDependencies } from "./account-http";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type SupabaseAccountConfig = Readonly<{ url: string; publishableKey: string }>;

/** Only a publishable key is accepted: never run learner requests with a secret or
 * service-role key. The user's verified JWT remains attached to all database calls.
 */
export function readSupabaseAccountConfig(env: Record<string, string | undefined> = process.env): SupabaseAccountConfig | null {
  return readAccountConfig(env);
}

function unauthenticated(): never {
  throw new AccountError(401, "AUTHENTICATION_REQUIRED", "Sign in again to access your account library.");
}
function providerUnavailable(): never {
  throw new AccountError(503, "ACCOUNT_SERVICE_UNAVAILABLE", "Account library is temporarily unavailable. Please try again later.");
}
function rateLimited(): never {
  throw new AccountError(429, "RATE_LIMITED", "Too many account requests. Please try again later.");
}
function checkError(error: { status?: number; code?: string; message?: string } | null, auth = false): void {
  if (!error) return;
  if (error.status === 429 || (error.code === "P0001" && error.message === "ACCOUNT_RATE_LIMITED")) rateLimited();
  if (error.code === "22023" && error.message === "INVALID_PAGINATION") {
    throw new AccountError(400, "INVALID_PAGINATION", "Use a valid page size and complete lesson cursor.");
  }
  if (error.code === "22P05" || (error.code === "22023" && error.message === "INVALID_LESSON")) {
    throw new AccountError(400, "INVALID_LESSON", "Use valid Japanese lesson text within the supported limits.");
  }
  if (auth && (error.status === 400 || error.status === 401 || error.status === 403)) unauthenticated();
  if (error.code === "42501" && error.message === "ACCOUNT_AUTHENTICATION_REQUIRED") unauthenticated();
  // Deliberately do not expose the error message, details, hint or provider URL.
  providerUnavailable();
}

/** Redirects are refused before any credential can be forwarded to another host.
 * Timeouts and provider failures remain fail-closed, with no cached private data.
 */
function providerFetch(config: SupabaseAccountConfig, fetcher: typeof fetch): typeof fetch {
  const deadline = AbortSignal.timeout(20000);
  return async (input, init) => {
    const target = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    if (target.origin !== config.url) providerUnavailable();
    const prior = init?.signal ?? (input instanceof Request ? input.signal : undefined);
    const signal = prior ? AbortSignal.any([prior, deadline]) : deadline;
    return fetcher(input, { ...init, cache: "no-store", redirect: "error", signal });
  };
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) providerUnavailable();
  return value as Record<string, unknown>;
}

function stored(value: unknown, identity: VerifiedIdentity): StoredAccountLesson {
  const row = object(value);
  if (row.owner_id !== identity.subject || typeof row.id !== "string" || typeof row.revision !== "number" ||
      typeof row.created_at !== "string" || typeof row.updated_at !== "string") providerUnavailable();
  // The domain service validates lesson shape, ID, revision and timestamps again.
  return { ownerKey: ownerKey(identity), id: row.id, revision: row.revision,
    createdAt: row.created_at, updatedAt: row.updated_at, lesson: row.lesson as StoredAccountLesson["lesson"] };
}

function summary(value: unknown, identity: VerifiedIdentity): StoredLessonSummary {
  const row = object(value);
  if (row.owner_id !== identity.subject) providerUnavailable();
  // Domain validation covers every copied summary field and page ordering.
  return { ownerKey: ownerKey(identity), id: row.id as string, revision: row.revision as number,
    createdAt: row.created_at as string, updatedAt: row.updated_at as string,
    title: row.title as string, targetLanguage: row.targetLanguage as "ja-JP", level: row.level as string,
    topic: row.topic as string, sentenceCount: row.sentenceCount as number };
}

type Context = { identity: VerifiedIdentity; client: SupabaseClient };

/** Request-scoped; never cache this object, a token, or an identity across requests.
 * Current adapter accepts Supabase bearer tokens from either web or Android.
 * It does not yet implement browser cookie refresh or any password-entry flow.
 */
export function createSupabaseAccountDependencies(request: Request, config: SupabaseAccountConfig, fetcher: typeof fetch = fetch): AccountDependencies {
  let context: Promise<Context> | undefined;
  async function load(): Promise<Context> {
    const authorization = request.headers.get("authorization");
    const match = authorization?.match(/^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/i);
    if (!match || match[1].length > 16384) unauthenticated();
    const token = match[1];
    const transport = providerFetch(config, fetcher);
    const verifier = createClient(config.url, config.publishableKey, { auth: {
      persistSession: false, autoRefreshToken: false, detectSessionInUrl: false,
    }, global: { fetch: transport } });
    const claimsResult = await verifier.auth.getClaims(token);
    checkError(claimsResult.error, true);
    const claims = claimsResult.data?.claims;
    const audience = claims?.aud;
    if (!claims || claims.iss !== `${config.url}/auth/v1` ||
        !(audience === "authenticated" || (Array.isArray(audience) && audience.length === 1 && audience[0] === "authenticated")) ||
        claims.role !== "authenticated" || typeof claims.sub !== "string" || !UUID.test(claims.sub) ||
        typeof claims.session_id !== "string" || !UUID.test(claims.session_id) || claims.is_anonymous === true ||
        typeof claims.exp !== "number" || !Number.isSafeInteger(claims.exp) || claims.exp * 1000 <= Date.now() ||
        (claims.nbf !== undefined && (typeof claims.nbf !== "number" || claims.nbf * 1000 > Date.now()))) unauthenticated();
    const userResult = await verifier.auth.getUser(token);
    checkError(userResult.error, true);
    if (!userResult.data.user || userResult.data.user.id !== claims.sub || userResult.data.user.is_anonymous) unauthenticated();
    // A separate data client uses the recommended accessToken option. It cannot
    // silently refresh into another session or substitute a service-role credential.
    const client = createClient(config.url, config.publishableKey, { accessToken: async () => token,
      global: { fetch: transport } });
    const access = await client.rpc("account_access_context");
    checkError(access.error);
    const result = object(access.data);
    if (result.active !== true) unauthenticated();
    if (!Array.isArray(result.permissions) || result.permissions.some((value) => value !== "product:manage" && value !== "security:triage")) providerUnavailable();
    const identity: VerifiedIdentity = Object.freeze({ issuer: claims.iss, subject: claims.sub,
      expiresAt: claims.exp * 1000, authentication: "bearer-token", permissions: Object.freeze([...result.permissions]) as readonly DashboardPermission[] });
    return { identity, client };
  }
  function current(): Promise<Context> { return context ??= load(); }
  async function owned(owner: string): Promise<Context> {
    const result = await current();
    if (owner !== ownerKey(result.identity)) unauthenticated();
    return result;
  }
  const repository: AccountLessonRepository = {
    async listSummariesOwned(owner, options) {
      const { identity, client } = await owned(owner);
      const result = await client.rpc("list_account_lesson_summaries", {
        p_limit: options.limit, p_before_updated_at: options.before?.updatedAt ?? null, p_before_id: options.before?.id ?? null,
      });
      checkError(result.error);
      const page = object(result.data);
      if (!Array.isArray(page.lessons)) providerUnavailable();
      return { lessons: page.lessons.map((row) => summary(row, identity)),
        nextCursor: page.nextCursor as Awaited<ReturnType<AccountLessonRepository["listSummariesOwned"]>>["nextCursor"] };
    },
    async usageOwned(owner) {
      const { client } = await owned(owner);
      const result = await client.rpc("account_library_usage");
      checkError(result.error);
      return normalizeAccountUsage(result.data);
    },
    async getOwned(owner, id) {
      const { identity, client } = await owned(owner);
      const result = await client.rpc("get_account_lesson", { p_id: id });
      checkError(result.error);
      return result.data === null ? null : stored(result.data, identity);
    },
    async saveOwned(record, expectedRevision) {
      const { identity, client } = await owned(record.ownerKey);
      // The old save RPC has the same signature. Require the additive migration's
      // owner-only usage capability before writing; never fall back to old caps.
      await repository.usageOwned(record.ownerKey);
      const result = await client.rpc("save_account_lesson", { p_id: record.id, p_lesson: record.lesson, p_expected_revision: expectedRevision });
      checkError(result.error);
      const value = object(result.data);
      if (value.status === "conflict" || value.status === "quota-exceeded") return value.status;
      if (value.status !== "saved") providerUnavailable();
      return { status: "saved", record: stored(value.record, identity) };
    },
  };
  return {
    authenticate: async (candidate) => {
      if (candidate !== request) unauthenticated();
      return (await current()).identity;
    },
    repository,
    rateLimit: async (candidate, owner, operation) => {
      if (candidate !== request) unauthenticated();
      const { client } = await owned(owner);
      const result = await client.rpc("account_rate_limit", { p_operation: operation });
      checkError(result.error);
      if (result.data === false) rateLimited();
      if (result.data !== true) providerUnavailable();
    },
  };
}
