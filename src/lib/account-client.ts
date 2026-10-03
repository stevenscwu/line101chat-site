import { validateLesson, type Lesson } from "./materials";
import type { AccountLessonCursor, AccountLibraryUsage, UsageDimension } from "./account-contract";

export type AccountSession = { accessToken: string; user: { id: string; email: string | null } };
/** An adapter owns credentials. Only the controller receives the access token; it
 * is never included in a UI snapshot, URL, lesson, log, or browser persistence. */
export interface AuthPort {
  subscribe(listener: (session: AccountSession | null) => void): () => void;
  signIn(email: string, password: string): Promise<AccountSession>;
  /** Clear local credentials synchronously, even if remote revocation fails. */
  signOut(): Promise<void>;
  dispose(): void;
}
export type AccountLessonRecord = { id: string; revision: number; createdAt: string; updatedAt: string; lesson: Lesson };
export type AccountLessonSummary = Omit<AccountLessonRecord, "lesson"> & {
  title: string; targetLanguage: "ja-JP"; level: string; topic: string; sentenceCount: number;
};
export type AccountSnapshot = {
  status: "signed-out" | "signing-in" | "loading" | "ready" | "error";
  account: AccountSession["user"] | null;
  summaries: AccountLessonSummary[];
  selected: AccountLessonRecord | null;
  nextCursor: AccountLessonCursor | null;
  usage: AccountLibraryUsage | null;
  signInBusy: boolean;
  signOutBusy: boolean;
  workBusy: boolean;
  error: string | null;
  errorCode: string | null;
  /** Key account editor/practice subtrees by this value to erase their drafts. */
  generation: number;
};
export interface AccountController {
  subscribe(listener: () => void): () => void;
  getSnapshot(): AccountSnapshot;
  signIn(email: string, password: string): Promise<boolean>;
  signOut(): Promise<boolean>;
  refresh(): Promise<boolean>;
  loadMore(): Promise<boolean>;
  open(id: string): Promise<boolean>;
  create(lesson: Lesson): Promise<boolean>;
  replace(id: string, revision: number, lesson: Lesson): Promise<boolean>;
  closeSelection(): void;
  dispose(): void;
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const messages: Record<string, string> = {
  AUTHENTICATION_REQUIRED: "登入已失效，私人教材已清除。請重新登入。",
  SIGN_IN_FAILED: "無法登入。請確認電子郵件與密碼，或稍後再試。",
  SIGN_OUT_FAILED: "本頁的登入資料與私人教材已清除，但無法確認伺服器已撤銷此登入。請在網路恢復後檢查帳號的登入狀態。",
  INVALID_CREDENTIALS: "請輸入電子郵件與密碼。",
  INVALID_LESSON: "教材格式不正確，請檢查內容與大小後再試。",
  LANGUAGE_NOT_ENABLED: "帳號教材庫目前僅支援日文教材。",
  INVALID_REVISION: "教材版本不正確，請重新開啟教材後再儲存。",
  REVISION_CONFLICT: "其他裝置已更新這份教材。你的未儲存內容仍保留，請先複製草稿，再重新開啟最新版本。",
  LIBRARY_LIMIT_REACHED: "帳號教材庫已達目前的安全額度。已儲存的教材仍可讀取，不會自動刪除。",
  PAYLOAD_TOO_LARGE: "教材太大，請拆成較小的教材後再上傳。",
  LESSON_NOT_FOUND: "這份教材已不存在，或不屬於目前的帳號。",
  ORIGIN_NOT_ALLOWED: "請從此網站開啟帳號教材庫後再試。",
  RATE_LIMITED: "操作太頻繁，請稍候再試。",
  ACCOUNT_SERVICE_UNAVAILABLE: "帳號教材庫暫時無法使用，請稍後重試。",
  NETWORK_ERROR: "連線失敗，請檢查網路後重試。",
  REQUEST_TIMEOUT: "連線逾時，請稍後重試。",
  WRITE_UNCERTAIN: "未能確認儲存結果，伺服器可能已儲存。請先重新整理教材清單並檢查內容，再決定是否重試，以免建立重複教材。",
};
class ClientError extends Error {
  constructor(readonly code: string) { super(code); }
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
  return value as Record<string, unknown>;
}
function metadata(value: unknown): Omit<AccountLessonRecord, "lesson"> {
  const row = object(value);
  if (typeof row.id !== "string" || !UUID.test(row.id) || typeof row.revision !== "number" ||
      !Number.isSafeInteger(row.revision) || row.revision < 1 || typeof row.createdAt !== "string" ||
      typeof row.updatedAt !== "string" || !Number.isFinite(Date.parse(row.createdAt)) ||
      !Number.isFinite(Date.parse(row.updatedAt)) || Date.parse(row.updatedAt) < Date.parse(row.createdAt)) {
    throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
  }
  return { id: row.id, revision: row.revision, createdAt: row.createdAt, updatedAt: row.updatedAt };
}
function lessonRecord(value: unknown, expectedId?: string): AccountLessonRecord {
  const row = object(value), info = metadata(row);
  if (expectedId && info.id !== expectedId) throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
  const lesson = validateLesson(row.lesson);
  if (lesson.targetLanguage !== "ja-JP" || lesson.id !== info.id) throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
  return { ...info, lesson };
}
function summary(value: unknown): AccountLessonSummary {
  const row = object(value), info = metadata(row);
  if (typeof row.title !== "string" || !row.title.trim() || row.title.length > 120 ||
      row.targetLanguage !== "ja-JP" || typeof row.level !== "string" || !["", "N5", "N4", "N3", "N2", "N1"].includes(row.level) ||
      typeof row.topic !== "string" || row.topic.length > 80 || typeof row.sentenceCount !== "number" ||
      !Number.isInteger(row.sentenceCount) || row.sentenceCount < 1 || row.sentenceCount > 200) throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
  return { ...info, title: row.title, targetLanguage: "ja-JP", level: row.level, topic: row.topic, sentenceCount: row.sentenceCount };
}
function summarize(row: AccountLessonRecord): AccountLessonSummary {
  const { lesson, ...info } = row;
  return { ...info, title: lesson.title, targetLanguage: "ja-JP", level: lesson.level, topic: lesson.topic, sentenceCount: lesson.sentences.length };
}
function readCursor(value: unknown): AccountLessonCursor | null {
  if (value === null || value === undefined) return null;
  const cursor = object(value);
  if (typeof cursor.id !== "string" || !UUID.test(cursor.id) || typeof cursor.updatedAt !== "string" ||
      cursor.updatedAt.length > 64 || !Number.isFinite(Date.parse(cursor.updatedAt))) throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
  return { id: cursor.id, updatedAt: cursor.updatedAt };
}
const dimensions: UsageDimension[] = ["lessons", "sentences", "bytes"];
function readUsage(value: unknown): AccountLibraryUsage | null {
  if (value === null || value === undefined) return null; // Older API read compatibility only.
  const input = object(value), plan = object(input.plan);
  if (typeof plan.key !== "string" || !plan.key || plan.key.length > 100 || typeof plan.provisional !== "boolean") throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
  const vector = (value: unknown) => {
    const row = object(value);
    if (dimensions.some((dimension) => typeof row[dimension] !== "number" || !Number.isSafeInteger(row[dimension]) || (row[dimension] as number) < 0)) throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
    return { lessons: row.lessons as number, sentences: row.sentences as number, bytes: row.bytes as number };
  };
  const alerts = (value: unknown): UsageDimension[] => {
    if (!Array.isArray(value) || value.some((dimension) => !dimensions.includes(dimension)) || new Set(value).size !== value.length) throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
    return [...value] as UsageDimension[];
  };
  if (typeof input.warningThresholdPercent !== "number" || !Number.isInteger(input.warningThresholdPercent) || input.warningThresholdPercent < 1 ||
      typeof input.criticalThresholdPercent !== "number" || !Number.isInteger(input.criticalThresholdPercent) ||
      input.criticalThresholdPercent < input.warningThresholdPercent || input.criticalThresholdPercent > 100) throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
  return { plan: { key: plan.key, provisional: plan.provisional }, usage: vector(input.usage), limits: vector(input.limits),
    warningThresholdPercent: input.warningThresholdPercent, criticalThresholdPercent: input.criticalThresholdPercent,
    nearLimit: alerts(input.nearLimit), criticalLimit: alerts(input.criticalLimit), atLimit: alerts(input.atLimit), overLimit: alerts(input.overLimit) };
}
function readPage(value: unknown) {
  const page = object(value), list = page.lessons;
  if (!Array.isArray(list) || list.length > 100) throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
  const summaries = list.map(summary);
  if (new Set(summaries.map((item) => item.id)).size !== summaries.length) throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
  const nextCursor = readCursor(page.nextCursor);
  const last = summaries.at(-1);
  if (nextCursor && (!last || nextCursor.id !== last.id || nextCursor.updatedAt !== last.updatedAt)) throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
  return { summaries, nextCursor, usage: readUsage(page.usage) };
}
function blank(generation = 0): AccountSnapshot {
  return { status: "signed-out", account: null, summaries: [], selected: null, nextCursor: null, usage: null, signInBusy: false,
    signOutBusy: false, workBusy: false, error: null, errorCode: null, generation };
}

/** Memory-only, framework-independent and deliberately separate from the offline
 * library. No action reads, migrates, caches or uploads offline material implicitly. */
export function createAccountController({ auth, fetcher = fetch, timeoutMs = 15000 }: {
  auth: AuthPort; fetcher?: typeof fetch; timeoutMs?: number;
}): AccountController {
  let state = blank();
  let session: AccountSession | null = null;
  let disposed = false;
  let authAttempt = 0;
  let selectionVersion = 0;
  let uncertainWrite = false;
  let activeRequest: AbortController | null = null;
  const listeners = new Set<() => void>();
  const emit = (patch: Partial<AccountSnapshot>) => {
    if (disposed) return;
    state = { ...state, ...patch };
    for (const listener of listeners) listener();
  };
  const clear = () => {
    activeRequest?.abort(); activeRequest = null;
    session = null; selectionVersion++; uncertainWrite = false;
    state = blank(state.generation + 1);
    emit({});
  };
  const fail = (code: string) => emit({ status: "error", errorCode: code,
    error: messages[code] ?? messages.ACCOUNT_SERVICE_UNAVAILABLE, workBusy: false, signInBusy: false });
  const current = (generation: number) => !disposed && generation === state.generation;
  const withDeadline = async <T>(promise: Promise<T>): Promise<T> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([promise, new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new ClientError("REQUEST_TIMEOUT")), timeoutMs);
      })]);
    } finally { clearTimeout(timer); }
  };
  const revoke = async (generation: number, expired = false): Promise<boolean> => {
    emit({ signOutBusy: true });
    try {
      await withDeadline(auth.signOut());
      return true;
    } catch {
      if (current(generation) && !expired) fail("SIGN_OUT_FAILED");
      return false;
    } finally {
      if (current(generation)) emit({ signOutBusy: false });
    }
  };
  const expire = () => {
    authAttempt++; clear();
    const generation = state.generation;
    fail("AUTHENTICATION_REQUIRED");
    void revoke(generation, true);
  };
  const run = async (method: "GET" | "POST" | "PUT", path: string, payload: unknown,
    commit: (value: unknown) => void): Promise<boolean> => {
    if (disposed || !session || state.workBusy || state.signInBusy || state.signOutBusy) return false;
    const generation = state.generation;
    const token = session.accessToken;
    const abort = new AbortController();
    activeRequest = abort;
    emit({ status: "loading", workBusy: true, error: null, errorCode: null });
    let timedOut = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const response = await Promise.race([
        (async () => {
          const response = await fetcher(`/api/account/lessons${path}`, { method, signal: abort.signal,
            headers: { Authorization: `Bearer ${token}`, ...(payload === undefined ? {} : { "Content-Type": "application/json" }) },
            ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
            credentials: "omit", cache: "no-store", redirect: "error" });
          // Include response-body consumption in the bounded deadline.
          if (!response.ok) {
            if (response.status === 401) throw new ClientError("AUTHENTICATION_REQUIRED");
            let error: unknown;
            try { error = await response.json(); } catch { /* Never display raw server text. */ }
            const code = error && typeof error === "object" && "code" in error ? error.code : null;
            throw new ClientError(typeof code === "string" && messages[code] ? code : "ACCOUNT_SERVICE_UNAVAILABLE");
          }
          return response.json();
        })(),
        new Promise<never>((_, reject) => { timer = setTimeout(() => {
          timedOut = true; abort.abort(); reject(new ClientError("REQUEST_TIMEOUT"));
        }, timeoutMs); }),
      ]);
      if (!current(generation) || activeRequest !== abort) return false;
      commit(response);
      if (method === "GET") uncertainWrite = false;
      emit({ status: "ready", error: null, errorCode: null });
      return true;
    } catch (error) {
      if (!current(generation) || activeRequest !== abort) return false;
      if (error instanceof ClientError && error.code === "AUTHENTICATION_REQUIRED") { expire(); return false; }
      const code = error instanceof ClientError ? error.code : timedOut ? "REQUEST_TIMEOUT" : "NETWORK_ERROR";
      // Once a write is sent, a transport, timeout or malformed success cannot prove
      // it failed. Never automatically replay POST or PUT, even after a retry click.
      if (method !== "GET" && ["NETWORK_ERROR", "REQUEST_TIMEOUT", "ACCOUNT_SERVICE_UNAVAILABLE"].includes(code)) uncertainWrite = true;
      fail(uncertainWrite ? "WRITE_UNCERTAIN" : code);
      return false;
    } finally {
      clearTimeout(timer);
      if (current(generation) && activeRequest === abort) { activeRequest = null; emit({ workBusy: false }); }
    }
  };
  const refresh = () => run("GET", "", undefined, (value) => { emit(readPage(value)); });
  const loadMore = () => {
    const cursor = state.nextCursor;
    if (!cursor) return Promise.resolve(false);
    const query = new URLSearchParams({ limit: "50", beforeUpdatedAt: cursor.updatedAt, beforeId: cursor.id });
    return run("GET", `?${query}`, undefined, (value) => {
      const page = readPage(value);
      if (page.nextCursor?.id === cursor.id && page.nextCursor.updatedAt === cursor.updatedAt) throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
      const merged = new Map(state.summaries.map((item) => [item.id, item]));
      for (const item of page.summaries) {
        if ((merged.get(item.id)?.revision ?? 0) <= item.revision) merged.set(item.id, item);
      }
      emit({ summaries: [...merged.values()], nextCursor: page.nextCursor, usage: page.usage });
    });
  };
  const accept = (next: AccountSession) => {
    if (disposed || state.signOutBusy) return;
    if (!next.accessToken || !next.user.id) { expire(); return; }
    if (session?.user.id === next.user.id) {
      session = next;
      emit({ account: { ...next.user } });
      return;
    }
    clear(); session = next;
    emit({ account: { ...next.user }, status: "ready" });
    void refresh();
  };
  const unsubscribe = auth.subscribe((next) => {
    if (disposed || state.signOutBusy) return;
    if (next) accept(next);
    else if (session) { authAttempt++; clear(); }
    // An initial empty auth notification must not cancel password sign-in.
  });
  const validateUpload = (lesson: Lesson): Lesson | null => {
    try {
      const result = validateLesson(lesson);
      if (result.targetLanguage !== "ja-JP") throw new ClientError("LANGUAGE_NOT_ENABLED");
      return result;
    } catch (error) { fail(error instanceof ClientError ? error.code : "INVALID_LESSON"); return null; }
  };
  const save = async (method: "POST" | "PUT", id: string | null, revision: number | null, lesson: Lesson) => {
    if (disposed || !session || state.workBusy || state.signInBusy || state.signOutBusy) return false;
    if (id !== null && (!UUID.test(id) || !Number.isSafeInteger(revision) || revision! < 1)) { fail("INVALID_REVISION"); return false; }
    if (uncertainWrite) return false;
    const validated = validateUpload(lesson);
    if (!validated) return false;
    const selectedAtStart = selectionVersion;
    return run(method, id ? `/${encodeURIComponent(id)}` : "", {
      lesson: validated, ...(revision === null ? {} : { expectedRevision: revision }),
    }, (value) => {
      const record = lessonRecord(value, id ?? undefined);
      if ((revision !== null && record.revision !== revision + 1) || (revision === null && record.revision !== 1)) {
        throw new ClientError("ACCOUNT_SERVICE_UNAVAILABLE");
      }
      emit({ summaries: [summarize(record), ...state.summaries.filter((item) => item.id !== record.id)],
        ...(selectedAtStart === selectionVersion ? { selected: record } : {}) });
    });
  };
  return {
    subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getSnapshot: () => state,
    async signIn(email, password) {
      if (disposed || state.signInBusy || state.signOutBusy) return false;
      if (!email.trim() || !password) { fail("INVALID_CREDENTIALS"); return false; }
      const attempt = ++authAttempt;
      clear(); emit({ status: "signing-in", signInBusy: true });
      try {
        const next = await withDeadline(auth.signIn(email.trim(), password));
        if (disposed || attempt !== authAttempt) return false;
        // A newer session notification wins over a delayed sign-in return value.
        if (session) return (session as AccountSession).user.id === next.user.id;
        accept(next);
        return true;
      } catch {
        if (!disposed && attempt === authAttempt && !session) {
          clear(); fail("SIGN_IN_FAILED");
          void revoke(state.generation, true);
        }
        return false;
      }
    },
    async signOut() {
      if (disposed || state.signOutBusy) return false;
      authAttempt++; clear();
      return revoke(state.generation);
    },
    refresh,
    loadMore,
    open(id) {
      if (disposed || !session || state.workBusy || state.signInBusy || state.signOutBusy) return Promise.resolve(false);
      if (!UUID.test(id)) { fail("LESSON_NOT_FOUND"); return Promise.resolve(false); }
      const version = ++selectionVersion;
      return run("GET", `/${encodeURIComponent(id)}`, undefined, (value) => {
        const record = lessonRecord(value, id);
        if (version === selectionVersion) emit({ selected: record });
      });
    },
    create: (lesson) => save("POST", null, null, lesson),
    replace: (id, revision, lesson) => save("PUT", id, revision, lesson),
    closeSelection() { selectionVersion++; emit({ selected: null }); },
    dispose() {
      if (disposed) return;
      authAttempt++; clear(); disposed = true;
      unsubscribe(); listeners.clear(); auth.dispose();
    },
  };
}
