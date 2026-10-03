import { afterEach, describe, expect, it, vi } from "vitest";
import { createAccountController, type AccountSession, type AuthPort, type AccountLessonRecord } from "../src/lib/account-client";
import { JAPANESE_SAMPLE, ENGLISH_SAMPLE } from "../src/lib/materials";
import { createSupabaseBrowserAuth } from "../src/lib/supabase-browser-auth";

const { sdkFactory } = vi.hoisted(() => ({ sdkFactory: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: sdkFactory }));
const A: AccountSession = { accessToken: "test-a", user: { id: "a", email: "a@example.invalid" } };
const B: AccountSession = { accessToken: "test-b", user: { id: "b", email: "b@example.invalid" } };
const id = "00000000-0000-4000-8000-000000000001";
const id2 = "00000000-0000-4000-8000-000000000002";
const record: AccountLessonRecord = { id, revision: 1, createdAt: "2026-10-01T00:00:00Z", updatedAt: "2026-10-01T00:00:00Z",
  lesson: { ...JAPANESE_SAMPLE, id, title: "A 的私人教材" } };
const summary = { id, revision: 1, createdAt: record.createdAt, updatedAt: record.updatedAt, title: record.lesson.title,
  targetLanguage: "ja-JP", level: record.lesson.level, topic: record.lesson.topic, sentenceCount: record.lesson.sentences.length };
const json = (data: unknown, status = 200) => Response.json(data, { status });
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
async function settle() { for (let i = 0; i < 12; i++) await Promise.resolve(); }
function harness() {
  const listeners = new Set<(session: AccountSession | null) => void>();
  const auth: AuthPort = { subscribe: (listener) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    signIn: vi.fn(async () => A), signOut: vi.fn(async () => {}), dispose: vi.fn() };
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => json({ lessons: [] }));
  const controller = createAccountController({ auth, fetcher, timeoutMs: 100 });
  const emit = (session: AccountSession | null) => { for (const listener of listeners) listener(session); };
  return { auth, fetcher, controller, emit };
}
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe("private account controller", () => {
  it("starts signed out, never reads local storage, never silently uploads offline lessons", async () => {
    const storage = { getItem: vi.fn(() => { throw new Error("must not access offline data"); }), setItem: vi.fn() };
    vi.stubGlobal("localStorage", storage);
    const h = harness();
    expect(h.controller.getSnapshot().status).toBe("signed-out");
    expect(h.fetcher).not.toHaveBeenCalled();
    await h.controller.signIn(" a@example.invalid ", "password-only-in-call"); await settle();
    expect(h.auth.signIn).toHaveBeenCalledWith("a@example.invalid", "password-only-in-call");
    expect(h.controller.getSnapshot()).toMatchObject({ status: "ready", account: A.user, summaries: [], selected: null });
    expect(h.fetcher).toHaveBeenCalledTimes(1);
    expect(h.fetcher.mock.calls[0][1]?.method).toBe("GET");
    expect(storage.getItem).not.toHaveBeenCalled(); expect(storage.setItem).not.toHaveBeenCalled();
    expect(JSON.stringify(h.controller.getSnapshot())).not.toMatch(/test-a|password-only-in-call/);
  });

  it("uses the managed auth result as Bearer, omits cookies and refuses redirects/cache", async () => {
    const h = harness(); await h.controller.signIn("a@example.invalid", "pw"); await settle();
    expect(h.fetcher).toHaveBeenCalledWith("/api/account/lessons", expect.objectContaining({
      headers: { Authorization: "Bearer test-a" }, credentials: "omit", cache: "no-store", redirect: "error" }));
  });

  it("clears A's records immediately and discards a late A list after switching to B", async () => {
    const h = harness(), lateA = deferred<Response>();
    h.fetcher.mockResolvedValueOnce(json({ lessons: [summary] }));
    h.emit(A); await settle(); expect(h.controller.getSnapshot().summaries).toHaveLength(1);
    h.fetcher.mockReturnValueOnce(lateA.promise);
    const pending = h.controller.refresh();
    const signalA = h.fetcher.mock.calls[1][1]?.signal;
    h.emit(B);
    expect(signalA?.aborted).toBe(true);
    expect(h.controller.getSnapshot()).toMatchObject({ account: B.user, summaries: [], selected: null });
    await settle();
    lateA.resolve(json({ lessons: [summary] })); expect(await pending).toBe(false);
    expect(h.controller.getSnapshot()).toMatchObject({ account: B.user, summaries: [] });
    expect(JSON.stringify(h.controller.getSnapshot())).not.toContain("A 的私人教材");
  });

  it("discards a late A lesson body after sign-out and B login", async () => {
    const h = harness(); h.emit(A); await settle();
    const late = deferred<Response>(); h.fetcher.mockReturnValueOnce(late.promise);
    const pending = h.controller.open(id);
    await h.controller.signOut(); h.emit(B); await settle();
    late.resolve(json(record)); expect(await pending).toBe(false);
    expect(h.controller.getSnapshot().selected).toBeNull();
    expect(h.controller.getSnapshot().account).toEqual(B.user);
  });

  it("discards a late A successful save after B signs in", async () => {
    const h = harness(); h.emit(A); await settle();
    const late = deferred<Response>(); h.fetcher.mockReturnValueOnce(late.promise);
    const pending = h.controller.create(JAPANESE_SAMPLE);
    h.emit(B); await settle(); late.resolve(json(record, 201));
    expect(await pending).toBe(false);
    expect(h.controller.getSnapshot()).toMatchObject({ account: B.user, summaries: [], selected: null });
  });

  it("401 wipes selection, summaries and identity and increments the editor generation", async () => {
    const h = harness(); h.emit(A); await settle();
    h.fetcher.mockResolvedValueOnce(json(record)); await h.controller.open(id);
    const previous = h.controller.getSnapshot().generation;
    h.fetcher.mockResolvedValueOnce(json({ code: "AUTHENTICATION_REQUIRED" }, 401));
    expect(await h.controller.refresh()).toBe(false); await settle();
    expect(h.controller.getSnapshot()).toMatchObject({ account: null, selected: null, summaries: [], errorCode: "AUTHENTICATION_REQUIRED" });
    expect(h.controller.getSnapshot().generation).toBeGreaterThan(previous);
    expect(h.auth.signOut).toHaveBeenCalledOnce();
  });

  it("sign-out clears private state before network completion, reports revoke failure honestly", async () => {
    const h = harness(); h.emit(A); await settle();
    h.fetcher.mockResolvedValueOnce(json(record)); await h.controller.open(id);
    const pending = deferred<void>(); vi.mocked(h.auth.signOut).mockReturnValueOnce(pending.promise);
    const signout = h.controller.signOut();
    expect(h.controller.getSnapshot()).toMatchObject({ account: null, summaries: [], selected: null, signOutBusy: true });
    expect(await h.controller.signOut()).toBe(false);
    expect(await h.controller.signIn("b@example.invalid", "pw")).toBe(false);
    pending.reject(new Error("offline with secret details")); expect(await signout).toBe(false);
    expect(h.controller.getSnapshot()).toMatchObject({ errorCode: "SIGN_OUT_FAILED", signOutBusy: false });
    expect(h.controller.getSnapshot().error).toContain("無法確認");
    expect(JSON.stringify(h.controller.getSnapshot())).not.toContain("secret details");
  });

  it("409 preserves selection and permits an intentional replace after a reload", async () => {
    const h = harness(); h.emit(A); await settle();
    h.fetcher.mockResolvedValueOnce(json(record)); await h.controller.open(id);
    const generation = h.controller.getSnapshot().generation;
    h.fetcher.mockResolvedValueOnce(json({ code: "REVISION_CONFLICT" }, 409));
    expect(await h.controller.replace(id, 1, { ...record.lesson, title: "未儲存草稿" })).toBe(false);
    expect(h.controller.getSnapshot()).toMatchObject({ selected: record, generation, errorCode: "REVISION_CONFLICT" });
    expect(JSON.parse(h.fetcher.mock.calls.at(-1)![1]!.body as string)).toEqual({ lesson: { ...record.lesson, title: "未儲存草稿" }, expectedRevision: 1 });
  });

  it("guards repeated sign-in and write clicks synchronously", async () => {
    const h = harness(), signin = deferred<AccountSession>(); vi.mocked(h.auth.signIn).mockReturnValueOnce(signin.promise);
    const first = h.controller.signIn("a@example.invalid", "pw");
    expect(await h.controller.signIn("a@example.invalid", "pw")).toBe(false);
    expect(h.auth.signIn).toHaveBeenCalledOnce(); signin.resolve(A); await first; await settle();
    const write = deferred<Response>(); h.fetcher.mockReturnValueOnce(write.promise);
    const one = h.controller.create(JAPANESE_SAMPLE), two = h.controller.create(JAPANESE_SAMPLE);
    expect(await two).toBe(false); expect(h.fetcher.mock.calls.filter((call) => call[1]?.method === "POST")).toHaveLength(1);
    write.resolve(json(record, 201)); expect(await one).toBe(true);
  });

  it("double-clicking open does not suppress the first successful selection", async () => {
    const h = harness(); h.emit(A); await settle();
    const read = deferred<Response>(); h.fetcher.mockReturnValueOnce(read.promise);
    const one = h.controller.open(id); expect(await h.controller.open(id)).toBe(false);
    read.resolve(json(record)); expect(await one).toBe(true); expect(h.controller.getSnapshot().selected).toEqual(record);
  });

  it("keeps closeSelection closed when an in-flight open resolves", async () => {
    const h = harness(); h.emit(A); await settle();
    const read = deferred<Response>(); h.fetcher.mockReturnValueOnce(read.promise);
    const open = h.controller.open(id); h.controller.closeSelection(); read.resolve(json(record)); await open;
    expect(h.controller.getSnapshot().selected).toBeNull();
  });

  it("explicit create uploads only the supplied lesson; successful replace sends expectedRevision", async () => {
    const h = harness(); h.emit(A); await settle();
    h.fetcher.mockResolvedValueOnce(json(record, 201)); expect(await h.controller.create(JAPANESE_SAMPLE)).toBe(true);
    expect(h.fetcher.mock.calls[1][0]).toBe("/api/account/lessons");
    expect(JSON.parse(h.fetcher.mock.calls[1][1]!.body as string)).toEqual({ lesson: JAPANESE_SAMPLE });
    expect(h.controller.getSnapshot().selected).toEqual(record); expect(h.controller.getSnapshot().summaries).toHaveLength(1);
    const updated = { ...record, revision: 2, lesson: { ...record.lesson, title: "已更新" } };
    h.fetcher.mockResolvedValueOnce(json(updated)); expect(await h.controller.replace(id, 1, updated.lesson)).toBe(true);
    expect(h.controller.getSnapshot().selected).toEqual(updated); expect(h.controller.getSnapshot().summaries[0].title).toBe("已更新");
  });

  it("does not submit invalid or non-Japanese lessons", async () => {
    const h = harness(); h.emit(A); await settle();
    expect(await h.controller.create(ENGLISH_SAMPLE)).toBe(false);
    expect(h.controller.getSnapshot().errorCode).toBe("LANGUAGE_NOT_ENABLED");
    expect(await h.controller.create({ ...JAPANESE_SAMPLE, sentences: [] })).toBe(false);
    expect(h.controller.getSnapshot().errorCode).toBe("INVALID_LESSON"); expect(h.fetcher).toHaveBeenCalledOnce();
  });

  it("allows an explicit retry after a failed list and handles an empty library", async () => {
    const h = harness(); h.fetcher.mockRejectedValueOnce(new Error("network")); h.emit(A); await settle();
    expect(h.controller.getSnapshot().errorCode).toBe("NETWORK_ERROR");
    expect(await h.controller.refresh()).toBe(true);
    expect(h.controller.getSnapshot()).toMatchObject({ status: "ready", error: null, summaries: [] });
  });

  it("bounds a stalled read and does not reuse its late result", async () => {
    vi.useFakeTimers(); const h = harness(), late = deferred<Response>(); h.fetcher.mockReturnValueOnce(late.promise); h.emit(A);
    await vi.advanceTimersByTimeAsync(101);
    expect(h.controller.getSnapshot()).toMatchObject({ workBusy: false, errorCode: "REQUEST_TIMEOUT" });
    expect(h.fetcher.mock.calls[0][1]?.signal?.aborted).toBe(true);
    late.resolve(json({ lessons: [summary] })); await settle(); expect(h.controller.getSnapshot().summaries).toEqual([]);
  });

  it("POST timeout is ambiguous and blocked until a successful explicit read, even if a retry refresh fails", async () => {
    vi.useFakeTimers(); const h = harness(); h.emit(A); await settle();
    const late = deferred<Response>(); h.fetcher.mockReturnValueOnce(late.promise);
    const write = h.controller.create(JAPANESE_SAMPLE); await vi.advanceTimersByTimeAsync(101); expect(await write).toBe(false);
    expect(h.controller.getSnapshot().errorCode).toBe("WRITE_UNCERTAIN");
    expect(await h.controller.create(JAPANESE_SAMPLE)).toBe(false);
    h.fetcher.mockRejectedValueOnce(new Error("still offline")); await h.controller.refresh();
    expect(h.controller.getSnapshot().errorCode).toBe("WRITE_UNCERTAIN");
    expect(await h.controller.create(JAPANESE_SAMPLE)).toBe(false);
    late.resolve(json(record, 201)); await settle(); expect(h.controller.getSnapshot().selected).toBeNull();
    await h.controller.refresh(); h.fetcher.mockResolvedValueOnce(json(record, 201));
    expect(await h.controller.create(JAPANESE_SAMPLE)).toBe(true);
  });

  it("PUT network failure is ambiguous without erasing the selected record", async () => {
    const h = harness(); h.emit(A); await settle(); h.fetcher.mockResolvedValueOnce(json(record)); await h.controller.open(id);
    h.fetcher.mockRejectedValueOnce(new Error("network")); await h.controller.replace(id, 1, record.lesson);
    expect(h.controller.getSnapshot()).toMatchObject({ selected: record, errorCode: "WRITE_UNCERTAIN" });
  });

  it("does not accept a different record ID or malformed private payload", async () => {
    const h = harness(); h.emit(A); await settle();
    h.fetcher.mockResolvedValueOnce(json({ ...record, id: id2, lesson: { ...record.lesson, id: id2 } }));
    expect(await h.controller.open(id)).toBe(false); expect(h.controller.getSnapshot().selected).toBeNull();
    h.fetcher.mockResolvedValueOnce(json({ lessons: [summary, summary] })); expect(await h.controller.refresh()).toBe(false);
  });

  it("keeps refreshed tokens inside the same account generation", async () => {
    const h = harness(); h.emit(A); await settle(); const generation = h.controller.getSnapshot().generation;
    h.emit({ ...A, accessToken: "rotated-a" }); await h.controller.refresh();
    expect(h.controller.getSnapshot().generation).toBe(generation);
    expect(h.fetcher.mock.calls.at(-1)![1]!.headers).toEqual({ Authorization: "Bearer rotated-a" });
  });

  it("handles SDK-style null then authenticated callbacks before the sign-in promise resolves", async () => {
    const h = harness(), login = deferred<AccountSession>();
    vi.mocked(h.auth.signIn).mockImplementationOnce(() => { h.emit(null); h.emit(A); return login.promise; });
    const pending = h.controller.signIn("a@example.invalid", "pw");
    expect(h.controller.getSnapshot()).toMatchObject({ account: A.user, signInBusy: false, workBusy: true });
    await settle(); const generation = h.controller.getSnapshot().generation;
    h.emit({ ...A, accessToken: "refreshed-before-return" });
    login.resolve(A); expect(await pending).toBe(true);
    expect(h.controller.getSnapshot().generation).toBe(generation);
    await h.controller.refresh();
    expect(h.fetcher.mock.calls.at(-1)![1]!.headers).toEqual({ Authorization: "Bearer refreshed-before-return" });
  });

  it("a B auth notification wins over a delayed A password sign-in result", async () => {
    const h = harness(), login = deferred<AccountSession>(); vi.mocked(h.auth.signIn).mockReturnValueOnce(login.promise);
    const pending = h.controller.signIn("a@example.invalid", "pw"); h.emit(B); await settle();
    login.resolve(A); expect(await pending).toBe(false);
    expect(h.controller.getSnapshot().account).toEqual(B.user);
  });

  it("refresh preserves selection and revision instead of silently overwriting an unsaved editor", async () => {
    const h = harness(); h.emit(A); await settle(); h.fetcher.mockResolvedValueOnce(json(record)); await h.controller.open(id);
    const generation = h.controller.getSnapshot().generation;
    h.fetcher.mockResolvedValueOnce(json({ lessons: [{ ...summary, revision: 2, title: "其他裝置的新版本" }] }));
    await h.controller.refresh();
    expect(h.controller.getSnapshot()).toMatchObject({ generation, selected: record });
    expect(h.controller.getSnapshot().summaries[0].revision).toBe(2);
  });

  it("sign-out cancels a pending sign-in and a late return cannot restore A", async () => {
    const h = harness(), late = deferred<AccountSession>(); vi.mocked(h.auth.signIn).mockReturnValueOnce(late.promise);
    const signin = h.controller.signIn("a@example.invalid", "pw"); await h.controller.signOut();
    late.resolve(A); expect(await signin).toBe(false); expect(h.controller.getSnapshot().account).toBeNull();
  });

  it("dispose stops auth, aborts requests and ignores all late callbacks", async () => {
    const h = harness(), late = deferred<Response>(); h.fetcher.mockReturnValueOnce(late.promise); h.emit(A);
    h.controller.dispose(); expect(h.auth.dispose).toHaveBeenCalledOnce();
    expect(h.fetcher.mock.calls[0][1]?.signal?.aborted).toBe(true);
    h.emit(B); late.resolve(json({ lessons: [summary] })); await settle();
    expect(h.controller.getSnapshot()).toMatchObject({ account: null, summaries: [], selected: null });
    expect(await h.controller.create(JAPANESE_SAMPLE)).toBe(false);
  });
});

function sdkHarness() {
  type Options = { auth: { persistSession: boolean; autoRefreshToken: boolean; detectSessionInUrl: boolean; storageKey: string;
    storage: { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void } };
    global: { fetch: typeof fetch } };
  let options!: Options;
  let event!: (event: string, session: unknown) => void;
  const sdkSession = { access_token: "managed-access", user: { id: "managed-user", email: "real@example.invalid", is_anonymous: false } };
  const auth = { signInWithPassword: vi.fn(async () => ({ data: { session: sdkSession }, error: null as unknown })),
    signOut: vi.fn(async () => ({ error: null as unknown })),
    stopAutoRefresh: vi.fn(async () => {}), dispose: vi.fn(async () => {}),
    onAuthStateChange: vi.fn((callback: typeof event) => { event = callback; return { data: { subscription: { unsubscribe: vi.fn() } } }; }) };
  sdkFactory.mockImplementation((_url: string, _key: string, passed: Options) => { options = passed; return { auth }; });
  const driver = createSupabaseBrowserAuth({ url: "https://account.example.invalid", publishableKey: "sb_publishable_test" });
  return { driver, auth, sdkSession, options: () => options, emit: (session: unknown) => event("SIGNED_IN", session) };
}

describe("managed Supabase browser auth adapter", () => {
  it("cannot create a fake production account: delegates exact password login and requires a managed session", async () => {
    const h = sdkHarness(); expect(sdkFactory).not.toHaveBeenCalled();
    const session = await h.driver.signIn("real@example.invalid", "typed-once");
    expect(h.auth.signInWithPassword).toHaveBeenCalledWith({ email: "real@example.invalid", password: "typed-once" });
    expect(session).toEqual({ accessToken: "managed-access", user: { id: "managed-user", email: "real@example.invalid" } });
    expect(h.options().auth).toMatchObject({ autoRefreshToken: true, detectSessionInUrl: false });
    h.driver.dispose();
  });

  it("rejects service keys and invalid public origins before creating any SDK client", () => {
    for (const config of [
      { url: "https://account.example.invalid", publishableKey: "sb_secret_no" },
      { url: "http://account.example.invalid", publishableKey: "sb_publishable_test" },
      { url: "https://user:pass@account.example.invalid", publishableKey: "sb_publishable_test" },
    ]) expect(() => createSupabaseBrowserAuth(config)).toThrow();
    expect(sdkFactory).not.toHaveBeenCalled();
  });

  it("uses isolated memory and clears it despite failed remote sign-out; late SDK writes cannot revive it", async () => {
    const h = sdkHarness(), seen: unknown[] = []; h.driver.subscribe((value) => seen.push(value));
    await h.driver.signIn("real@example.invalid", "pw"); const storage = h.options().auth.storage;
    storage.setItem("sdk-session", "private-refresh"); expect(storage.getItem("sdk-session")).toBe("private-refresh");
    h.auth.signOut.mockResolvedValueOnce({ error: new Error("network") });
    await expect(h.driver.signOut()).rejects.toThrow();
    expect(h.auth.signOut).toHaveBeenCalledWith({ scope: "local" });
    expect(seen.at(-1)).toBeNull(); expect(storage.getItem("sdk-session")).toBeNull();
    storage.setItem("sdk-session", "late-refresh"); expect(storage.getItem("sdk-session")).toBeNull();
    h.emit(h.sdkSession); expect(seen.at(-1)).toBeNull();
    expect(h.auth.dispose).toHaveBeenCalled();
  });

  it("disposes SDK background refresh and fences late auth callbacks on unmount", async () => {
    const h = sdkHarness(), seen: unknown[] = []; h.driver.subscribe((value) => seen.push(value));
    await h.driver.signIn("real@example.invalid", "pw"); const count = seen.length;
    h.driver.dispose(); h.emit(h.sdkSession);
    expect(h.auth.dispose).toHaveBeenCalledOnce(); expect(seen).toHaveLength(count);
  });

  it("has no anonymous or fallback identity when SDK login fails", async () => {
    const h = sdkHarness(); h.auth.signInWithPassword.mockResolvedValueOnce({ data: { session: h.sdkSession }, error: new Error("bad password") });
    const seen: unknown[] = []; h.driver.subscribe((value) => seen.push(value));
    await expect(h.driver.signIn("real@example.invalid", "bad")).rejects.toThrow(); expect(seen.at(-1)).toBeNull();
  });

  it("auth transport refuses other hosts before sending credentials", async () => {
    const h = sdkHarness(); await h.driver.signIn("real@example.invalid", "pw");
    const network = vi.fn(); vi.stubGlobal("fetch", network);
    await expect(h.options().global.fetch("https://elsewhere.invalid/auth/v1/token", { body: "secret" })).rejects.toThrow();
    await expect(h.options().global.fetch("https://account.example.invalid/rest/v1/lessons")).rejects.toThrow();
    expect(network).not.toHaveBeenCalled(); h.driver.dispose();
  });
});


const pilotUsage = {
  plan: { key: "pilot", provisional: true }, usage: { lessons: 25, sentences: 125, bytes: 30000 },
  limits: { lessons: 20, sentences: 4000, bytes: 1048576 }, warningThresholdPercent: 80, criticalThresholdPercent: 95,
  nearLimit: ["lessons"], criticalLimit: ["lessons"], atLimit: ["lessons"], overLimit: ["lessons"],
};
const manySummaries = (count: number) => Array.from({ length: count }, (_, index) => ({ ...summary,
  id: `00000000-0000-4000-8000-${(index + 1).toString(16).padStart(12, "0")}`, title: `私人教材 ${index + 1}`,
  updatedAt: "2026-10-01T00:00:00.123456+00:00" }));

describe("paginated account usage", () => {
  it("keeps a downgraded library larger than20 readable and displays server usage", async () => {
    const h = harness();
    h.fetcher.mockResolvedValueOnce(json({ lessons: manySummaries(25), nextCursor: null, usage: pilotUsage }));
    h.emit(A); await settle();
    expect(h.controller.getSnapshot()).toMatchObject({ status: "ready", nextCursor: null, usage: pilotUsage });
    expect(h.controller.getSnapshot().summaries).toHaveLength(25);
  });

  it("loads pages on demand and preserves exact microsecond cursor text", async () => {
    const h = harness(), items = manySummaries(25), cursor = { updatedAt: items[19].updatedAt, id: items[19].id };
    h.fetcher.mockResolvedValueOnce(json({ lessons: items.slice(0, 20), nextCursor: cursor, usage: pilotUsage }));
    h.emit(A); await settle();
    expect(h.fetcher).toHaveBeenCalledTimes(1);
    h.fetcher.mockResolvedValueOnce(json({ lessons: items.slice(20), nextCursor: null, usage: pilotUsage }));
    expect(await h.controller.loadMore()).toBe(true);
    const query = new URL(String(h.fetcher.mock.calls[1][0]), "https://app.invalid").searchParams;
    expect(query.get("beforeUpdatedAt")).toBe(cursor.updatedAt);
    expect(query.get("beforeId")).toBe(cursor.id);
    expect(h.controller.getSnapshot().summaries).toHaveLength(25);
    expect(h.controller.getSnapshot().nextCursor).toBeNull();
    expect(await h.controller.loadMore()).toBe(false);
    expect(h.fetcher).toHaveBeenCalledTimes(2);
  });

  it("deduplicates page overlap without reverting a newer cached revision", async () => {
    const h = harness(), items = manySummaries(2), cursor = { updatedAt: items[0].updatedAt, id: items[0].id };
    h.fetcher.mockResolvedValueOnce(json({ lessons: [{ ...items[0], revision: 2 }], nextCursor: cursor, usage: pilotUsage }));
    h.emit(A); await settle();
    h.fetcher.mockResolvedValueOnce(json({ lessons: items, nextCursor: null, usage: pilotUsage }));
    await h.controller.loadMore();
    expect(h.controller.getSnapshot().summaries).toHaveLength(2);
    expect(h.controller.getSnapshot().summaries[0].revision).toBe(2);
  });

  it("clears pagination and usage on account switch and discards the late prior page", async () => {
    const h = harness(), items = manySummaries(2), cursor = { updatedAt: items[0].updatedAt, id: items[0].id };
    h.fetcher.mockResolvedValueOnce(json({ lessons: items.slice(0, 1), nextCursor: cursor, usage: pilotUsage }));
    h.emit(A); await settle();
    const late = deferred<Response>(); h.fetcher.mockReturnValueOnce(late.promise);
    const loading = h.controller.loadMore(); h.emit(B); await settle();
    late.resolve(json({ lessons: items.slice(1), nextCursor: null, usage: pilotUsage }));
    expect(await loading).toBe(false);
    expect(h.controller.getSnapshot()).toMatchObject({ account: B.user, summaries: [], nextCursor: null, usage: null });
  });

  it("accepts every operator-configured threshold permitted by the server contract", async () => {
    for (const thresholds of [{ warningThresholdPercent: 80, criticalThresholdPercent: 80 },
      { warningThresholdPercent: 80, criticalThresholdPercent: 100 },
      { warningThresholdPercent: 100, criticalThresholdPercent: 100 }]) {
      const h = harness();
      h.fetcher.mockResolvedValueOnce(json({ lessons: [summary], nextCursor: null, usage: { ...pilotUsage, ...thresholds } }));
      h.emit(A); await settle();
      expect(h.controller.getSnapshot().status).toBe("ready");
      expect(h.controller.getSnapshot().usage).toMatchObject(thresholds);
    }
  });

  it("rejects malformed usage, overlarge pages and nonadvancing cursors without losing owned data", async () => {
    const h = harness(), items = manySummaries(2), cursor = { updatedAt: items[0].updatedAt, id: items[0].id };
    h.fetcher.mockResolvedValueOnce(json({ lessons: items.slice(0, 1), nextCursor: cursor, usage: pilotUsage }));
    h.emit(A); await settle();
    h.fetcher.mockResolvedValueOnce(json({ lessons: items.slice(0, 1), nextCursor: cursor, usage: pilotUsage }));
    expect(await h.controller.loadMore()).toBe(false);
    expect(h.controller.getSnapshot().summaries).toHaveLength(1);
    for (const page of [
      { lessons: items, usage: { ...pilotUsage, limits: { ...pilotUsage.limits, bytes: -1 } } },
      { lessons: manySummaries(101), usage: pilotUsage },
      { lessons: items, usage: { ...pilotUsage, nearLimit: ["password"] } },
    ]) {
      h.fetcher.mockResolvedValueOnce(json(page));
      expect(await h.controller.refresh()).toBe(false);
      expect(h.controller.getSnapshot().summaries).toHaveLength(1);
    }
  });
});
