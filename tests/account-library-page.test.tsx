// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AccountSession, AuthPort } from "../src/lib/account-client";
import { JAPANESE_SAMPLE, ENGLISH_SAMPLE } from "../src/lib/materials";

const mock = vi.hoisted(() => ({ auth: null as AuthPort | null }));
vi.mock("../src/lib/supabase-browser-auth", () => ({ createSupabaseBrowserAuth: () => mock.auth! }));
import { AccountLibraryPage } from "../src/components/account-library-page";

const config = { url: "https://ui-fixture.invalid", publishableKey: "sb_publishable_not_a_real_key" };
const idA = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const idB = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const lessonA = "11111111-1111-4111-8111-111111111111";
const lessonB = "22222222-2222-4222-8222-222222222222";
const session = (id: string): AccountSession => ({ accessToken: `synthetic-${id}`, user: { id, email: id === idA ? "a@example.invalid" : "b@example.invalid" } });
const stored = (id: string, title: string, revision = 1) => ({ id, revision,
  createdAt: "2026-10-03T00:00:00Z", updatedAt: "2026-10-03T01:00:00Z", lesson: { ...JAPANESE_SAMPLE, id, title } });
const summary = (record: ReturnType<typeof stored>) => ({ id: record.id, revision: record.revision,
  createdAt: record.createdAt, updatedAt: record.updatedAt, title: record.lesson.title,
  targetLanguage: "ja-JP", level: record.lesson.level, topic: record.lesson.topic, sentenceCount: record.lesson.sentences.length });
let emitAuth: (value: AccountSession | null) => void;
let rejectSignIn = false;
let rejectSignOut = false;
let conflict = false;
let uncertain = false;
let readFailure = false;
let quota: Record<string, unknown> | null = null;
let pageSize = 100;
let rows: Record<string, ReturnType<typeof stored>[]>;
let requests: { method: string; owner: string; path: string; body?: unknown }[];
let confirm: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  rows = { [idA]: [stored(lessonA, "A 的私人京都教材")], [idB]: [stored(lessonB, "B 的私人東京教材")] };
  requests = []; rejectSignIn = false; rejectSignOut = false; conflict = false; uncertain = false; readFailure = false; quota = null; pageSize = 100;
  const listeners = new Set<(value: AccountSession | null) => void>();
  emitAuth = (value) => listeners.forEach((listener) => listener(value));
  mock.auth = {
    subscribe(listener) { listeners.add(listener); listener(null); return () => { listeners.delete(listener); }; },
    async signIn(email) {
      if (rejectSignIn) throw new Error("Raw provider detail must not render");
      const result = session(email.startsWith("b") ? idB : idA);
      emitAuth(result); return result;
    },
    async signOut() { emitAuth(null); if (rejectSignOut) throw new Error("Revocation failed"); },
    dispose() { listeners.clear(); },
  };
  vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const path = String(input);
    const url = new URL(path, "https://app.invalid");
    if (!path.startsWith("/api/account/lessons")) throw new Error("Test forbids all non-local requests");
    const owner = new Headers(init?.headers).get("authorization")?.includes(idB) ? idB : idA;
    const method = init?.method ?? "GET";
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
    requests.push({ method, path, owner, body });
    if (method === "POST" && uncertain) return Response.json({ code: "ACCOUNT_SERVICE_UNAVAILABLE" }, { status: 503 });
    if (method === "POST") {
      const id = "33333333-3333-4333-8333-333333333333";
      const record = { ...stored(id, body.lesson.title), lesson: { ...body.lesson, id } };
      rows[owner].push(record); return Response.json(record, { status: 201 });
    }
    if (method === "PUT") {
      if (conflict) return Response.json({ code: "REVISION_CONFLICT" }, { status: 409 });
      const index = rows[owner].findIndex((record) => path.endsWith(record.id));
      const record = { ...rows[owner][index], revision: body.expectedRevision + 1, lesson: body.lesson };
      rows[owner][index] = record; return Response.json(record);
    }
    if (readFailure && path !== "/api/account/lessons") return Response.json({ code: "ACCOUNT_SERVICE_UNAVAILABLE" }, { status: 503 });
    const record = url.pathname !== "/api/account/lessons" ? rows[owner].find((row) => url.pathname.endsWith(row.id)) : undefined;
    const start = url.searchParams.get("beforeId") ? rows[owner].findIndex((row) => row.id === url.searchParams.get("beforeId")) + 1 : 0;
    const page = rows[owner].slice(start, start + pageSize);
    const last = page.at(-1);
    return Response.json(record ?? { lessons: page.map(summary), usage: quota,
      nextCursor: start + page.length < rows[owner].length && last ? { updatedAt: last.updatedAt, id: last.id } : null });
  }));
  confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

async function login(user = userEvent.setup(), email = "a@example.invalid") {
  await screen.findByLabelText("電子郵件");
  await user.type(screen.getByLabelText("電子郵件"), email);
  await user.type(screen.getByLabelText("密碼"), "not-a-real-password");
  await user.click(screen.getByRole("button", { name: "登入" }));
  await screen.findByRole("heading", { name: "我的日語教材" });
  await waitFor(() => expect(screen.getByRole("button", { name: /私人.*教材/ }).hasAttribute("disabled")).toBe(false));
  return user;
}
async function preview(user: ReturnType<typeof userEvent.setup>, title = "新しい教材") {
  await user.type(screen.getByLabelText("教材名稱", { exact: true }), title);
  await user.type(screen.getByLabelText("日語內容"), "こんにちは。今日はいい天気ですね。");
  await user.click(screen.getByRole("button", { name: "先預覽內容" }));
  return screen.findByRole("region", { name: "確認要上傳的教材" });
}

 describe("managed account page", () => {
  it("shows a truthful disabled setup screen with no login or network call when not configured", () => {
    render(<AccountLibraryPage config={null} />);
    expect(screen.getByText("尚未啟用")).toBeTruthy();
    expect(screen.queryByLabelText("密碼")).toBeNull();
    expect(screen.getByRole("link", { name: "返回離線教材庫" }).getAttribute("href")).toBe("/");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("renders accessible email/password fields without registration/reset or automatic upload", async () => {
    render(<AccountLibraryPage config={config} />);
    const password = await screen.findByLabelText("密碼");
    expect(password.getAttribute("type")).toBe("password");
    expect(password.getAttribute("autocomplete")).toBe("current-password");
    expect(screen.queryByRole("button", { name: /註冊|重設/ })).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByText(/不會自動搬移或上傳/)).toBeTruthy();
  });

  it("reports failed login without raw provider detail and clears password", async () => {
    rejectSignIn = true;
    const user = userEvent.setup(); render(<AccountLibraryPage config={config} />);
    await user.type(await screen.findByLabelText("電子郵件"), "a@example.invalid");
    await user.type(screen.getByLabelText("密碼"), "not-a-real-password");
    await user.click(screen.getByRole("button", { name: "登入" }));
    await screen.findByRole("alert");
    expect((screen.getByLabelText("密碼") as HTMLInputElement).value).toBe("");
    expect(document.body.textContent).not.toContain("Raw provider detail");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("loads only the account library and never reads the legacy local library", async () => {
    const get = vi.spyOn(Storage.prototype, "getItem"); const set = vi.spyOn(Storage.prototype, "setItem");
    render(<AccountLibraryPage config={config} />); await login();
    expect(screen.getByText("A 的私人京都教材")).toBeTruthy();
    expect(screen.queryByText("B 的私人東京教材")).toBeNull();
    expect(get).not.toHaveBeenCalled(); expect(set).not.toHaveBeenCalled();
    expect(requests.every((request) => request.method === "GET")).toBe(true);
  });

  it("previews first, requires explicit consent and uploads only once on repeat click", async () => {
    render(<AccountLibraryPage config={config} />); const user = await login();
    const area = await preview(user);
    const upload = within(area).getByRole("button", { name: "確認上傳到我的帳號" });
    expect(upload.hasAttribute("disabled")).toBe(true);
    expect(requests.filter((request) => request.method === "POST")).toHaveLength(0);
    await user.click(within(area).getByRole("checkbox"));
    await user.dblClick(upload);
    await screen.findByText("教材已儲存到你的私人帳號。");
    expect(requests.filter((request) => request.method === "POST")).toHaveLength(1);
    expect(screen.queryByRole("region", { name: "確認要上傳的教材" })).toBeNull();
    expect((screen.getByLabelText("日語內容") as HTMLTextAreaElement).value).toBe("");
  });

  it("canceling a preview never uploads", async () => {
    render(<AccountLibraryPage config={config} />); const user = await login(); const area = await preview(user);
    await user.click(within(area).getByRole("checkbox"));
    await user.click(within(area).getByRole("button", { name: "取消" }));
    expect(screen.queryByRole("region", { name: "確認要上傳的教材" })).toBeNull();
    expect(requests.filter((request) => request.method === "POST")).toHaveLength(0);
  });

  it("blocks replay of uncertain saves until the user explicitly checks the library", async () => {
    uncertain = true; render(<AccountLibraryPage config={config} />); const user = await login(); const area = await preview(user);
    await user.click(within(area).getByRole("checkbox"));
    await user.click(within(area).getByRole("button", { name: "確認上傳到我的帳號" }));
    await screen.findByText(/未能確認儲存結果/);
    expect(within(area).getByRole("button", { name: "確認上傳到我的帳號" }).hasAttribute("disabled")).toBe(true);
    expect(requests.filter((request) => request.method === "POST")).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "重新整理教材清單" }));
    await waitFor(() => expect(within(area).getByRole("button", { name: "確認上傳到我的帳號" }).hasAttribute("disabled")).toBe(false));
    expect(requests.filter((request) => request.method === "POST")).toHaveLength(1);
  });

  it("keeps unsaved editor content on409 and confirms before discarding it for a fresh revision", async () => {
    conflict = true; render(<AccountLibraryPage config={config} />); const user = await login();
    await user.click(screen.getByRole("button", { name: /A 的私人京都教材/ }));
    let editor = await screen.findByRole("region", { name: "檢視與修改教材" });
    const title = within(editor).getByLabelText("教材名稱", { exact: true });
    await user.clear(title); await user.type(title, "未儲存的私人草稿");
    await user.click(within(editor).getByRole("button", { name: "儲存修改" }));
    await screen.findByText(/其他裝置已更新/);
    expect((title as HTMLInputElement).value).toBe("未儲存的私人草稿");
    confirm.mockReturnValueOnce(false);
    await user.click(within(editor).getByRole("button", { name: "重新載入雲端版本" }));
    expect((title as HTMLInputElement).value).toBe("未儲存的私人草稿");
    rows[idA] = [stored(lessonA, "雲端新版本", 2)];
    await user.click(within(editor).getByRole("button", { name: "重新載入雲端版本" }));
    editor = await screen.findByRole("region", { name: "檢視與修改教材" });
    await waitFor(() => expect((within(editor).getByLabelText("教材名稱") as HTMLInputElement).value).toBe("雲端新版本"));
  });

  it("confirmed reload resets an unchanged revision and subsequent edits retain discard protection", async () => {
    render(<AccountLibraryPage config={config} />); const user = await login();
    await user.click(screen.getByRole("button", { name: /A 的私人京都教材/ }));
    let editor = await screen.findByRole("region", { name: "檢視與修改教材" });
    await user.clear(within(editor).getByLabelText("教材名稱"));
    await user.type(within(editor).getByLabelText("教材名稱"), "尚未儲存的修改");
    await user.click(within(editor).getByRole("button", { name: "重新載入雲端版本" }));
    await waitFor(() => expect((within(screen.getByRole("region", { name: "檢視與修改教材" })).getByLabelText("教材名稱") as HTMLInputElement).value).toBe("A 的私人京都教材"));
    editor = screen.getByRole("region", { name: "檢視與修改教材" });
    await user.type(within(editor).getByLabelText("教材名稱"), "再次修改");
    confirm.mockReturnValueOnce(false);
    await user.click(within(editor).getByRole("button", { name: "關閉" }));
    expect(screen.getByRole("region", { name: "檢視與修改教材" })).toBeTruthy();
  });

  it("failed reload preserves draft contents and the dirty warning", async () => {
    render(<AccountLibraryPage config={config} />); const user = await login();
    await user.click(screen.getByRole("button", { name: /A 的私人京都教材/ }));
    const editor = await screen.findByRole("region", { name: "檢視與修改教材" });
    await user.clear(within(editor).getByLabelText("教材名稱"));
    await user.type(within(editor).getByLabelText("教材名稱"), "必須保留的草稿");
    readFailure = true;
    await user.click(within(editor).getByRole("button", { name: "重新載入雲端版本" }));
    await screen.findByText("帳號教材庫暫時無法使用，請稍後重試。");
    expect((within(editor).getByLabelText("教材名稱") as HTMLInputElement).value).toBe("必須保留的草稿");
    confirm.mockReturnValueOnce(false);
    await user.click(screen.getByRole("button", { name: "登出" }));
    expect(screen.getByRole("region", { name: "檢視與修改教材" })).toBeTruthy();
  });

  it("sign-out cancellation preserves a draft; confirmed sign-out erases it before B signs in", async () => {
    render(<AccountLibraryPage config={config} />); const user = await login(); await preview(user, "A 的未上傳秘密");
    confirm.mockReturnValueOnce(false);
    await user.click(screen.getByRole("button", { name: "登出" }));
    expect(screen.getByText("A 的未上傳秘密")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "登出" }));
    await screen.findByLabelText("電子郵件");
    expect(document.body.textContent).not.toContain("A 的未上傳秘密");
    await login(user, "b@example.invalid");
    expect(screen.getByText("B 的私人東京教材")).toBeTruthy();
    expect(document.body.textContent).not.toContain("A 的私人京都教材");
    expect((screen.getByLabelText("日語內容") as HTMLTextAreaElement).value).toBe("");
  });

  it("a failed provider sign-out still removes private content and reports revocation uncertainty", async () => {
    rejectSignOut = true; render(<AccountLibraryPage config={config} />); const user = await login();
    await user.click(screen.getByRole("button", { name: "登出" }));
    await screen.findByText(/無法確認伺服器已撤銷/);
    expect(document.body.textContent).not.toContain("A 的私人京都教材");
    expect(screen.getByLabelText("密碼")).toBeTruthy();
  });

  it("account practice stays memory-only and clears its modal on account change", async () => {
    const get = vi.spyOn(Storage.prototype, "getItem"); const set = vi.spyOn(Storage.prototype, "setItem");
    render(<AccountLibraryPage config={config} />); const user = await login();
    await user.click(screen.getByRole("button", { name: /A 的私人京都教材/ }));
    const editor = await screen.findByRole("region", { name: "檢視與修改教材" });
    await user.click(within(editor).getByRole("button", { name: "聽與跟讀已儲存教材" }));
    const modal = screen.getByRole("dialog");
    await user.click(within(modal).getByRole("button", { name: "Mark as practised" }));
    expect(within(modal).getByText("Progress is tracked for this session.")).toBeTruthy();
    expect(get).not.toHaveBeenCalled(); expect(set).not.toHaveBeenCalled();
    act(() => emitAuth(session(idB)));
    await screen.findByText("B 的私人東京教材");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("shows over-limit usage without locking reads or adding a payment link", async () => {
    quota = { plan: { key: "pilot", provisional: true }, usage: { lessons: 25, sentences: 125, bytes: 30000 },
      limits: { lessons: 20, sentences: 4000, bytes: 1048576 }, warningThresholdPercent: 80, criticalThresholdPercent: 95,
      nearLimit: ["lessons"], criticalLimit: ["lessons"], atLimit: ["lessons"], overLimit: ["lessons"] };
    render(<AccountLibraryPage config={config} />); const user = await login();
    expect(screen.getByRole("region", { name: "我的儲存用量" })).toBeTruthy();
    expect(screen.getByText(/目前用量已超過額度/)).toBeTruthy();
    expect(screen.getByText(/暫定的技術安全額度/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /付款|購買|升級/ })).toBeNull();
    await user.click(screen.getByRole("button", { name: /A 的私人京都教材/ }));
    expect(await screen.findByRole("region", { name: "檢視與修改教材" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "關閉" }));
    const area = await preview(user);
    await user.click(within(area).getByRole("checkbox"));
    expect(within(area).getByRole("button", { name: "確認上傳到我的帳號" }).hasAttribute("disabled")).toBe(true);
  });

  it("loads more owned summaries only after an explicit request", async () => {
    pageSize = 1;
    rows[idA].push(stored("44444444-4444-4444-8444-444444444444", "第二頁教材"));
    render(<AccountLibraryPage config={config} />); const user = await login();
    expect(screen.queryByText("第二頁教材")).toBeNull();
    await user.click(screen.getByRole("button", { name: "載入更多教材" }));
    expect(await screen.findByText("第二頁教材")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "載入更多教材" })).toBeNull();
  });

  it("requires fresh consent when another file reuses the same lesson ID", async () => {
    render(<AccountLibraryPage config={config} />); const user = await login();
    const uploadFile = async (title: string) => {
      const text = JSON.stringify({ ...JAPANESE_SAMPLE, title });
      const file = new File([text], "lesson.json", { type: "application/json" });
      Object.defineProperty(file, "arrayBuffer", { value: async () => new TextEncoder().encode(text).buffer });
      await user.upload(screen.getByLabelText("選擇日語教材檔案"), file);
      await screen.findByRole("heading", { name: title });
    };
    await uploadFile("第一份預覽");
    await user.click(screen.getByRole("checkbox"));
    await uploadFile("替換後的預覽");
    expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(false);
    expect(screen.getByRole("button", { name: "確認上傳到我的帳號" }).hasAttribute("disabled")).toBe(true);
    expect(requests.filter((request) => request.method === "POST")).toHaveLength(0);
  });

  it("rejects English file imports without uploading them", async () => {
    render(<AccountLibraryPage config={config} />); const user = await login();
    const text = JSON.stringify(ENGLISH_SAMPLE);
    const file = new File([text], "english.json", { type: "application/json" });
    Object.defineProperty(file, "arrayBuffer", { value: async () => new TextEncoder().encode(text).buffer });
    await user.upload(screen.getByLabelText("選擇日語教材檔案"), file);
    await screen.findByText("個人教材庫目前只開放日語教材。");
    expect(requests.filter((request) => request.method !== "GET")).toHaveLength(0);
  });
});
