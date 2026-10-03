import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authReturnUrl, createLearnerAuth, parseAuthFragment, validateNewPassword, type LearnerAuthPort } from "../src/lib/learner-auth";
const origin = "https://auth-fixture.invalid";
const config = { url: origin, publishableKey: "sb_publishable_synthetic_test" };
const redirect = "https://line101chat.com/account/auth-return";
const id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const password = "synthetic-password-only";
const user = { id, email: "learner@example.invalid", aud: "authenticated", role: "authenticated", email_confirmed_at: "2026-10-03T00:00:00Z", created_at: "2026-10-03T00:00:00Z", app_metadata: {}, user_metadata: {}, is_anonymous: false };
function token(overrides = {}) {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "ES256", typ: "JWT" })}.${encode({ sub: id, iss: `${origin}/auth/v1`, aud: "authenticated", role: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600, ...overrides })}.${Buffer.from("synthetic-signature").toString("base64url")}`;
}
const fragment = (kind = "recovery", jwt = token()) => `#type=${kind}&access_token=${jwt}&refresh_token=synthetic_refresh_token&token_type=bearer&expires_in=3600`;
let calls: { url: URL; init?: RequestInit; body?: Record<string, unknown> }[];
let handler: (url: URL, init?: RequestInit) => Promise<Response>;
let ports: LearnerAuthPort[];
function port() { const value = createLearnerAuth(config, redirect); ports.push(value); return value; }
beforeEach(() => {
  calls = []; ports = [];
  handler = async (url) => url.pathname.endsWith("/user") ? Response.json(user) : Response.json({ user, session: null });
  vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    expect(url.origin).toBe(origin); expect(url.pathname.startsWith("/auth/v1/")).toBe(true);
    calls.push({ url, init, body: typeof init?.body === "string" ? JSON.parse(init.body) : undefined });
    return handler(url, init);
  }));
});
afterEach(async () => { ports.forEach((value) => value.dispose()); await Promise.resolve(); vi.unstubAllGlobals(); });

describe("managed learner enrollment and recovery", () => {
  it("only allows the fixed public callback or explicit local testing origin", () => {
    expect(authReturnUrl("https://line101chat.com")).toBe(redirect);
    expect(authReturnUrl("http://localhost:3191")).toBe("http://localhost:3191/account/auth-return");
    for (const value of ["https://evil.invalid", "https://line101chat.com.evil.invalid", "http://line101chat.com", "https://x@line101chat.com", "https://line101chat.com/?next=x"]) expect(() => authReturnUrl(value)).toThrow();
    expect(() => createLearnerAuth(config, `${redirect}?next=evil`)).toThrow();
  });
  it("enrolls through managed Auth with a fixed callback and no privilege metadata", async () => {
    await port().signUp(" learner@example.invalid ", password);
    expect(calls).toHaveLength(1);
    expect(calls[0].url.pathname).toBe("/auth/v1/signup");
    expect(calls[0].url.searchParams.get("redirect_to")).toBe(redirect);
    expect(calls[0].body).toMatchObject({ email: user.email, password });
    expect(calls[0].body).not.toHaveProperty("role");
    expect(calls[0].body?.data).toEqual({});
    expect(calls[0].init).toMatchObject({ credentials: "omit", redirect: "error", cache: "no-store" });
  });
  it("uses generic outcomes for existing signup and unknown recovery addresses", async () => {
    handler = async (url) => Response.json({ code: url.pathname.endsWith("signup") ? "user_already_exists" : "user_not_found", msg: "private raw provider detail" }, { status: 400, headers: { "X-Supabase-Api-Version": "2024-01-01" } });
    await expect(port().signUp(user.email, password)).resolves.toBeUndefined();
    await expect(port().requestPasswordReset(user.email)).resolves.toBeUndefined();
  });
  it("resends only signup confirmation and sends reset with the fixed callback", async () => {
    const auth = port(); await auth.resendConfirmation(user.email); await auth.requestPasswordReset(user.email);
    expect(calls.map((call) => call.url.pathname)).toEqual(["/auth/v1/resend", "/auth/v1/recover"]);
    expect(calls[0].body).toMatchObject({ type: "signup", email: user.email });
    expect(calls.every((call) => call.url.searchParams.get("redirect_to") === redirect)).toBe(true);
  });
  it("maps rate limits and operational failures without exposing provider details", async () => {
    handler = async () => Response.json({ code: "over_email_send_rate_limit", msg: "secret config" }, { status: 429 });
    await expect(port().requestPasswordReset(user.email)).rejects.toMatchObject({ code: "RATE_LIMITED", message: "RATE_LIMITED" });
    handler = async () => Response.json({ code: "unexpected_failure", msg: "secret config" }, { status: 500 });
    await expect(port().signUp(user.email, password)).rejects.toMatchObject({ code: "UNAVAILABLE", message: "UNAVAILABLE" });
  });
  it("validates email and new password before any provider request", async () => {
    await expect(port().signUp(user.email, "short")).rejects.toMatchObject({ code: "WEAK_PASSWORD" });
    await expect(port().requestPasswordReset("bad-email")).rejects.toMatchObject({ code: "INVALID_EMAIL" });
    expect(() => validateNewPassword("x".repeat(257))).toThrow();
    expect(calls).toHaveLength(0);
  });
  it("rejects malformed, duplicate, expired and wrong-project fragments before network", async () => {
    for (const value of ["", "#error=access_denied", fragment("magiclink"), fragment()+"&type=signup", fragment("recovery", token({ exp: 1 })), fragment("recovery", token({ iss: "https://evil.invalid/auth/v1" })), fragment()+"&next=https://evil.invalid"]) {
      await expect(port().acceptEmailLink(value)).rejects.toMatchObject({ code: "INVALID_LINK" });
    }
    expect(calls).toHaveLength(0);
  });
  it("requires provider verification even when a token is syntactically valid", async () => {
    handler = async () => Response.json({ code: "bad_jwt", msg: "invalid" }, { status: 401 });
    await expect(port().acceptEmailLink(fragment())).rejects.toMatchObject({ code: "INVALID_LINK" });
    expect(calls.length).toBeGreaterThan(0);
  });
  it("accepts recovery without persistent storage and only updates that verified account", async () => {
    const auth = port();
    expect(await auth.acceptEmailLink(fragment())).toEqual({ kind: "recovery", email: user.email });
    await auth.updatePassword(password);
    const updates = calls.filter((call) => call.init?.method === "PUT");
    expect(updates).toHaveLength(1); expect(updates[0].body).toEqual({ password, code_challenge: null, code_challenge_method: null });
    expect(calls.at(-1)?.url.pathname).toBe("/auth/v1/logout");
    await expect(auth.updatePassword(password)).rejects.toMatchObject({ code: "INVALID_LINK" });
  });
  it("requires a recovery link before changing passwords and rejects account mismatch", async () => {
    await expect(port().updatePassword(password)).rejects.toMatchObject({ code: "INVALID_LINK" });
    handler = async () => Response.json({ ...user, id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" });
    await expect(port().acceptEmailLink(fragment())).rejects.toMatchObject({ code: "INVALID_LINK" });
    expect(calls.some((call) => call.init?.method === "PUT")).toBe(false);
  });
  it("signup confirmation does not authorize a password reset", async () => {
    const auth = port(); expect(await auth.acceptEmailLink(fragment("signup"))).toEqual({ kind: "signup", email: user.email });
    await expect(auth.updatePassword(password)).rejects.toMatchObject({ code: "INVALID_LINK" });
    expect(calls.at(-1)?.url.pathname).toBe("/auth/v1/logout");
  });
  it("serializes repeated requests and rejects late success after disposal", async () => {
    let finish: (response: Response) => void = () => {};
    handler = () => new Promise<Response>((resolve) => { finish = resolve; });
    const auth = port(); const first = auth.requestPasswordReset(user.email);
    await vi.waitFor(() => expect(calls).toHaveLength(1));
    await expect(auth.requestPasswordReset(user.email)).rejects.toMatchObject({ code: "BUSY" });
    auth.dispose(); finish(Response.json({}));
    await expect(first).rejects.toMatchObject({ code: "UNAVAILABLE" });
    await expect(auth.signUp(user.email, password)).rejects.toMatchObject({ code: "UNAVAILABLE" });
  });
  it("keeps tokens out of returned confirmation details", () => {
    const parsed = parseAuthFragment(fragment(), origin);
    expect(parsed.kind).toBe("recovery"); expect(parsed.subject).toBe(id);
  });
});
