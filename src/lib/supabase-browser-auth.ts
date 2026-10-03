import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import type { AccountSession, AuthPort } from "./account-client";

export type SupabaseBrowserConfig = Readonly<{ url: string; publishableKey: string }>;
const AUTH_TIMEOUT_MS = 15000;
function publicConfig(config: SupabaseBrowserConfig): URL {
  const url = new URL(config.url);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/" ||
      !/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.publishableKey)) throw new Error("Account sign-in is not configured.");
  return url;
}
function present(session: Session | null): AccountSession | null {
  if (!session?.access_token || !session.user?.id || session.user.is_anonymous) return null;
  return { accessToken: session.access_token, user: { id: session.user.id, email: session.user.email ?? null } };
}

/** Managed Supabase password authentication for existing users only. The supplied
 * key is publishable, never a service key. An isolated SDK memory store is used:
 * refresh tokens never enter localStorage, sessionStorage, URLs or lesson files.
 * Every client lifecycle has its own storage key and closed-store fence so even
 * a late SDK refresh cannot restore credentials after sign-out or disposal. */
export function createSupabaseBrowserAuth(config: SupabaseBrowserConfig): AuthPort {
  const origin = publicConfig(config).origin;
  const listeners = new Set<(session: AccountSession | null) => void>();
  let session: AccountSession | null = null;
  let disposed = false;
  let epoch = 0;
  type Context = { client: SupabaseClient; unsubscribe: () => void; close: () => void; abort: () => void };
  let context: Context | null = null;
  const emit = (next: AccountSession | null) => {
    session = next;
    for (const listener of listeners) listener(next);
  };
  const release = (old: Context | null) => {
    if (!old) return;
    old.unsubscribe(); old.close(); old.abort();
    void old.client.auth.dispose().catch(() => {});
  };
  const makeClient = (version: number): Context => {
    const memory = new Map<string, string>();
    const pending = new Set<AbortController>();
    let closed = false;
    const transport: typeof fetch = async (input, init) => {
      const target = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
      if (closed || target.origin !== origin || !target.pathname.startsWith("/auth/v1/")) throw new Error("Authentication request rejected.");
      const controller = new AbortController(); pending.add(controller);
      const prior = init?.signal ?? (input instanceof Request ? input.signal : undefined);
      const abort = () => controller.abort();
      prior?.addEventListener("abort", abort, { once: true });
      if (prior?.aborted) controller.abort();
      const timer = setTimeout(abort, AUTH_TIMEOUT_MS);
      try {
        const response = await fetch(input, { ...init, cache: "no-store", credentials: "omit", redirect: "error", signal: controller.signal });
        // Authentication endpoints return bounded JSON, not streams. Consume the
        // body before clearing the deadline so a stalled body cannot hang refresh.
        const bytes = await response.arrayBuffer();
        return new Response(bytes.byteLength ? bytes : null, { status: response.status, statusText: response.statusText, headers: response.headers });
      } finally { clearTimeout(timer); pending.delete(controller); prior?.removeEventListener("abort", abort); }
    };
    const client = createClient(origin, config.publishableKey, { auth: {
      // "persist" means use this explicitly supplied memory adapter, never disk.
      persistSession: true, autoRefreshToken: true, detectSessionInUrl: false,
      storageKey: `japanese-daily-account-${crypto.randomUUID()}`,
      storage: {
        getItem: (key) => closed ? null : memory.get(key) ?? null,
        setItem: (key, value) => { if (!closed) memory.set(key, value); },
        removeItem: (key) => { memory.delete(key); },
      },
    }, global: { fetch: transport } });
    const { data } = client.auth.onAuthStateChange((_event, next) => {
      // The callback stays synchronous; controller fetching never awaits this SDK.
      if (!disposed && version === epoch && !closed) emit(present(next));
    });
    return { client, unsubscribe: () => data.subscription.unsubscribe(),
      close: () => { closed = true; memory.clear(); },
      abort: () => { for (const request of pending) request.abort(); } };
  };
  return {
    subscribe(listener) { listeners.add(listener); listener(session); return () => { listeners.delete(listener); }; },
    async signIn(email, password) {
      if (disposed) throw new Error("Authentication is closed.");
      const version = ++epoch;
      release(context); context = null; emit(null);
      const current = makeClient(version); context = current;
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        const result = await Promise.race([
          current.client.auth.signInWithPassword({ email, password }),
          new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("Authentication timed out.")), AUTH_TIMEOUT_MS); }),
        ]);
        if (disposed || version !== epoch || result.error) throw new Error("Authentication failed.");
        const next = present(result.data.session);
        if (!next) throw new Error("Authentication failed.");
        emit(next);
        return next;
      } catch {
        if (version === epoch) { epoch++; context = null; emit(null); }
        release(current);
        throw new Error("Authentication failed.");
      } finally { clearTimeout(timer); }
    },
    async signOut() {
      ++epoch;
      const old = context; context = null;
      old?.unsubscribe(); old?.abort();
      if (old) void old.client.auth.stopAutoRefresh().catch(() => {});
      emit(null); // Erase the UI before attempting remote revocation.
      if (!old) return;
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        const result = await Promise.race([
          old.client.auth.signOut({ scope: "local" }),
          new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("Sign-out timed out.")), AUTH_TIMEOUT_MS); }),
        ]);
        if (result.error) throw new Error("Remote sign-out could not be confirmed.");
      } finally { clearTimeout(timer); release(old); }
    },
    dispose() {
      if (disposed) return;
      disposed = true; epoch++;
      release(context); context = null; session = null; listeners.clear();
    },
  };
}
