import { AuthClient, type AuthError } from "@supabase/supabase-js";
import type { PublicAccountConfig } from "./account-config";

export const AUTH_RETURN_PATH = "/account/auth-return";
export const NEW_PASSWORD_MIN_LENGTH = 12;
export const NEW_PASSWORD_MAX_LENGTH = 256;
const DEADLINE_MS = 15000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type LearnerAuthErrorCode = "INVALID_EMAIL" | "WEAK_PASSWORD" | "RATE_LIMITED" | "UNAVAILABLE" | "INVALID_LINK" | "BUSY";
export class LearnerAuthError extends Error {
  constructor(readonly code: LearnerAuthErrorCode) { super(code); }
}
export interface LearnerAuthPort {
  signUp(email: string, password: string): Promise<void>;
  resendConfirmation(email: string): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  acceptEmailLink(fragment: string): Promise<{ kind: "signup" | "recovery"; email: string }>;
  updatePassword(password: string): Promise<void>;
  dispose(): void;
}
export function authReturnUrl(origin: string): string {
  const url = new URL(origin);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/" ||
      !(url.origin === "https://line101chat.com" || (local && url.protocol === "http:"))) throw new LearnerAuthError("UNAVAILABLE");
  return `${url.origin}${AUTH_RETURN_PATH}`;
}
function emailValue(email: string): string {
  const value = email.trim();
  if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new LearnerAuthError("INVALID_EMAIL");
  return value;
}
export function validateNewPassword(password: string): void {
  if (password.length < NEW_PASSWORD_MIN_LENGTH || password.length > NEW_PASSWORD_MAX_LENGTH) throw new LearnerAuthError("WEAK_PASSWORD");
}
function providerError(error: AuthError | null) {
  if (!error) return;
  if (error.status === 429 || error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit") throw new LearnerAuthError("RATE_LIMITED");
  if (error.code === "weak_password" || error.code === "same_password") throw new LearnerAuthError("WEAK_PASSWORD");
  throw new LearnerAuthError("UNAVAILABLE");
}
/** Parse only a provider implicit-flow fragment. Parsing is not authentication:
 * the returned access token must still be checked by the configured Auth server. */
export function parseAuthFragment(fragment: string, providerOrigin: string, now = Date.now()): { kind: "signup" | "recovery"; accessToken: string; refreshToken: string; subject: string; expiresAt: number } {
  if (!fragment.startsWith("#") || fragment.length > 20000) throw new LearnerAuthError("INVALID_LINK");
  const values = new URLSearchParams(fragment.slice(1));
  for (const key of values.keys()) if (values.getAll(key).length !== 1) throw new LearnerAuthError("INVALID_LINK");
  if (values.has("error") || values.has("error_code") || values.has("code") || values.has("next")) throw new LearnerAuthError("INVALID_LINK");
  const kind = values.get("type"), accessToken = values.get("access_token"), refreshToken = values.get("refresh_token");
  if ((kind !== "signup" && kind !== "recovery") || values.get("token_type") !== "bearer" || !accessToken || !refreshToken ||
      accessToken.length > 16000 || !/^[A-Za-z0-9_-]{10,512}$/.test(refreshToken)) throw new LearnerAuthError("INVALID_LINK");
  try {
    const parts = accessToken.split(".");
    if (parts.length !== 3 || parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))) throw new Error();
    const claims = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (claims.iss !== `${providerOrigin}/auth/v1` || claims.aud !== "authenticated" || claims.role !== "authenticated" ||
        typeof claims.sub !== "string" || !UUID.test(claims.sub) || typeof claims.exp !== "number" || claims.exp * 1000 <= now) throw new Error();
    return { kind, accessToken, refreshToken, subject: claims.sub, expiresAt: claims.exp * 1000 };
  } catch { throw new LearnerAuthError("INVALID_LINK"); }
}

/** Isolated managed Auth for enrollment/recovery. No credentials, sessions,
 * passwords or authorization roles are written to application tables or disk.
 * Default implicit links allow confirmation on another device, without a stored
 * PKCE verifier. The caller must remove the fragment before calling this port. */
export function createLearnerAuth(config: PublicAccountConfig, redirectTo: string): LearnerAuthPort {
  const provider = new URL(config.url);
  if (provider.protocol !== "https:" || provider.pathname !== "/" || provider.search || provider.hash || provider.username || provider.password ||
      !/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey)) throw new LearnerAuthError("UNAVAILABLE");
  const callback = new URL(redirectTo);
  if (redirectTo !== authReturnUrl(callback.origin)) throw new LearnerAuthError("UNAVAILABLE");
  const pending = new Set<AbortController>();
  const memory = new Map<string, string>();
  let disposed = false, busy = false;
  let recovery: { userId: string; expiresAt: number } | null = null;
  const transport: typeof fetch = async (input, init) => {
    const target = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    if (disposed || target.origin !== provider.origin || !target.pathname.startsWith("/auth/v1/")) throw new LearnerAuthError("UNAVAILABLE");
    const controller = new AbortController(); pending.add(controller);
    const previous = init?.signal ?? (input instanceof Request ? input.signal : undefined);
    const abort = () => controller.abort(); previous?.addEventListener("abort", abort, { once: true });
    if (previous?.aborted) controller.abort();
    const timer = setTimeout(abort, DEADLINE_MS);
    try {
      const response = await fetch(input, { ...init, signal: controller.signal, cache: "no-store", credentials: "omit", redirect: "error" });
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength > 256 * 1024) throw new LearnerAuthError("UNAVAILABLE");
      return new Response(bytes.byteLength ? bytes : null, { status: response.status, headers: response.headers });
    } finally { clearTimeout(timer); pending.delete(controller); previous?.removeEventListener("abort", abort); }
  };
  const client = new AuthClient({
    url: `${provider.origin}/auth/v1`, headers: { apikey: config.publishableKey }, fetch: transport,
    flowType: "implicit", detectSessionInUrl: false, persistSession: true, autoRefreshToken: false,
    storageKey: `japanese-daily-enrollment-${crypto.randomUUID()}`,
    storage: { getItem: (key) => disposed ? null : memory.get(key) ?? null,
      setItem: (key, value) => { if (!disposed) memory.set(key, value); }, removeItem: (key) => { memory.delete(key); } },
  });
  async function operation<T>(action: () => Promise<T>): Promise<T> {
    if (disposed) throw new LearnerAuthError("UNAVAILABLE");
    if (busy) throw new LearnerAuthError("BUSY");
    busy = true;
    try { const result = await action(); if (disposed) throw new LearnerAuthError("UNAVAILABLE"); return result; }
    catch (error) { throw error instanceof LearnerAuthError ? error : new LearnerAuthError("UNAVAILABLE"); }
    finally { busy = false; }
  }
  async function endSession() {
    recovery = null;
    try { await client.signOut({ scope: "local" }); } finally { memory.clear(); }
  }
  return {
    signUp(email, password) { return operation(async () => {
      validateNewPassword(password);
      const { data, error } = await client.signUp({ email: emailValue(email), password, options: { emailRedirectTo: redirectTo } });
      // A provider may conceal an already registered address with an obfuscated
      // response, or return this code. Neither identifies account existence in UI.
      if (error?.code !== "user_already_exists") providerError(error);
      if (data.session) await endSession();
    }); },
    resendConfirmation(email) { return operation(async () => {
      const { error } = await client.resend({ type: "signup", email: emailValue(email), options: { emailRedirectTo: redirectTo } });
      if (!["user_not_found", "email_not_confirmed", "email_exists", "user_already_exists"].includes(error?.code ?? "")) providerError(error);
    }); },
    requestPasswordReset(email) { return operation(async () => {
      const { error } = await client.resetPasswordForEmail(emailValue(email), { redirectTo });
      if (error?.code !== "user_not_found") providerError(error);
    }); },
    acceptEmailLink(fragment) { return operation(async () => {
      recovery = null;
      const parsed = parseAuthFragment(fragment, provider.origin);
      try {
        const established = await client.setSession({ access_token: parsed.accessToken, refresh_token: parsed.refreshToken });
        if (established.error || !established.data.session || established.data.user?.id !== parsed.subject) throw new Error();
        const verified = await client.getUser(parsed.accessToken);
        const user = verified.data.user;
        if (verified.error || !user || user.id !== parsed.subject || user.is_anonymous || !user.email || !user.email_confirmed_at) throw new Error();
        if (parsed.kind === "recovery") recovery = { userId: user.id, expiresAt: parsed.expiresAt };
        else await endSession();
        return { kind: parsed.kind, email: user.email };
      } catch { recovery = null; memory.clear(); throw new LearnerAuthError("INVALID_LINK"); }
    }); },
    updatePassword(password) { return operation(async () => {
      validateNewPassword(password);
      if (!recovery || recovery.expiresAt <= Date.now()) { recovery = null; memory.clear(); throw new LearnerAuthError("INVALID_LINK"); }
      const verified = await client.getUser();
      if (verified.error || verified.data.user?.id !== recovery.userId) { recovery = null; memory.clear(); throw new LearnerAuthError("INVALID_LINK"); }
      const { error } = await client.updateUser({ password });
      providerError(error);
      await endSession();
    }); },
    dispose() {
      if (disposed) return;
      disposed = true; recovery = null; memory.clear();
      for (const request of pending) request.abort();
      void client.dispose().catch(() => {});
      // SDK initialization may register visibility listeners after synchronous
      // cleanup; finish disposal again once that initialization has settled.
      void client.initialize().then(() => client.dispose()).catch(() => {});
    },
  };
}
