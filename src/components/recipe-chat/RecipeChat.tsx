"use client";

import Image from "next/image";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Bot,
  ChefHat,
  Download,
  FileText,
  Loader2,
  LockKeyhole,
  LogOut,
  Send,
  UserRound,
} from "lucide-react";

type RecipeCandidate = {
  id: string;
  name: string;
  score: number;
};

type RecipeFile = {
  id: string;
  name: string;
  mimeType: string;
  score: number;
};

type RecipeQueryResponse = {
  status: "selected" | "clarify" | "no_match";
  message: string;
  file?: RecipeFile;
  candidates?: RecipeCandidate[];
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  file?: RecipeFile;
  candidates?: RecipeCandidate[];
  isError?: boolean;
};

const examples = ["想找胡桃塔 PDF", "有沒有水果三明治的食譜？", "雞肉派", "檸檬餅乾", "南瓜濃湯無酒版"];

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeFileName(value: string) {
  return value.trim().toLocaleLowerCase("zh-TW");
}

function candidateToFile(candidate: RecipeCandidate): RecipeFile {
  return {
    id: candidate.id,
    name: candidate.name,
    mimeType: "application/pdf",
    score: candidate.score,
  };
}

export function RecipeChat() {
  const [token, setToken] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [passcode, setPasscode] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [openingFileId, setOpeningFileId] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("recipeSessionToken") || "";
    const savedExpiresAt = sessionStorage.getItem("recipeSessionExpiresAt") || "";
    if (savedToken && savedExpiresAt && new Date(savedExpiresAt).getTime() > Date.now()) {
      setToken(savedToken);
      setExpiresAt(savedExpiresAt);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isAsking]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passcode.trim()) return;
    setIsLoggingIn(true);
    try {
      const response = await fetch("/api/101recipe/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "登入失敗。");
      setToken(payload.token);
      setExpiresAt(payload.expiresAt);
      sessionStorage.setItem("recipeSessionToken", payload.token);
      sessionStorage.setItem("recipeSessionExpiresAt", payload.expiresAt);
      setPasscode("");
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createId("error"),
          role: "assistant",
          text: error instanceof Error ? error.message : "登入失敗。",
          isError: true,
        },
      ]);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function logout() {
    if (token) {
      await fetch("/api/101recipe/logout", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      }).catch(() => undefined);
    }
    setToken("");
    setExpiresAt("");
    sessionStorage.removeItem("recipeSessionToken");
    sessionStorage.removeItem("recipeSessionExpiresAt");
  }

  async function ask(messageText = draft) {
    const message = messageText.trim();
    if (!message || !token || isAsking) return;

    const selectedCandidate = findCandidateByName(message);
    if (selectedCandidate) {
      const selectedFile = candidateToFile(selectedCandidate);
      setMessages((current) => [
        ...current,
        { id: createId("user"), role: "user", text: message },
        {
          id: createId("assistant"),
          role: "assistant",
          text: "我幫你開啟這份 PDF。之後看到相近結果時，也可以直接點選檔名。",
          file: selectedFile,
        },
      ]);
      setDraft("");
      await openPdf(selectedFile);
      return;
    }

    setMessages((current) => [...current, { id: createId("user"), role: "user", text: message }]);
    setDraft("");
    setIsAsking(true);

    try {
      const response = await fetch("/api/101recipe/query", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const payload = (await response.json()) as RecipeQueryResponse & { error?: string };
      if (response.status === 401) {
        await logout();
        throw new Error("登入已過期，請重新登入。");
      }
      if (!response.ok) throw new Error(payload.message || "查詢失敗。");
      setMessages((current) => [
        ...current,
        {
          id: createId("assistant"),
          role: "assistant",
          text: payload.message,
          file: payload.file,
          candidates: payload.candidates,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createId("error"),
          role: "assistant",
          text: error instanceof Error ? error.message : "查詢失敗。",
          isError: true,
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  async function openPdf(file: Pick<RecipeFile, "id" | "name">) {
    if (!token || openingFileId) return;
    const pdfWindow = window.open("about:blank", "_blank");
    if (pdfWindow) {
      pdfWindow.opener = null;
      pdfWindow.document.title = file.name;
      pdfWindow.document.body.textContent = "Loading PDF...";
    }
    setOpeningFileId(file.id);
    try {
      const response = await fetch(`/api/101recipe/file/${encodeURIComponent(file.id)}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        pdfWindow?.close();
        setMessages((current) => [
          ...current,
          { id: createId("error"), role: "assistant", text: "無法開啟這份 PDF，請重新登入後再試。", isError: true },
        ]);
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (pdfWindow) {
        pdfWindow.location.href = url;
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } finally {
      setOpeningFileId("");
    }
  }

  function findCandidateByName(fileName: string) {
    const normalized = normalizeFileName(fileName);
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const match = messages[index].candidates?.find((candidate) => normalizeFileName(candidate.name) === normalized);
      if (match) return match;
    }
    return undefined;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      ask();
    }
  }

  return (
    <main className="bg-[#f6f8f5]">
      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto grid min-h-[calc(100vh-150px)] max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-h-[680px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800">
                    <ChefHat className="h-4 w-4" aria-hidden="true" />
                    101recipe
                  </p>
                  <h1 className="mt-3 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                    食譜 PDF 查找助理
                  </h1>
                </div>
                {token ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-800 hover:border-rose-300 hover:text-rose-700"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    登出
                  </button>
                ) : null}
              </div>
            </div>

            {!token ? (
              <div className="grid flex-1 place-items-center p-5">
                <form className="w-full max-w-md rounded-lg border border-slate-200 bg-slate-50 p-5" onSubmit={login}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <LockKeyhole className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-xl font-black text-slate-950">登入 101recipe</h2>
                      <p className="mt-1 text-sm font-semibold text-slate-600">請輸入通行碼。</p>
                    </div>
                  </div>
                  <label className="mt-5 block text-sm font-black text-slate-800" htmlFor="recipe-passcode">
                    通行碼
                  </label>
                  <input
                    id="recipe-passcode"
                    type="password"
                    autoComplete="current-password"
                    className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    value={passcode}
                    onChange={(event) => setPasscode(event.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!passcode.trim() || isLoggingIn}
                    className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isLoggingIn ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LockKeyhole className="h-4 w-4" aria-hidden="true" />}
                    登入
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-5">
                  {messages.length === 0 ? (
                    <div className="grid min-h-[360px] place-items-center text-center">
                      <div className="max-w-md">
                        <Bot className="mx-auto h-10 w-10 text-emerald-700" aria-hidden="true" />
                        <p className="mt-4 text-lg font-black text-slate-950">輸入食譜名稱、食材或日期</p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          Ollama 會根據本機 recipes 資料夾索引結果選出最接近的 PDF。
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-4">
                    {messages.map((message) =>
                      message.role === "user" ? (
                        <div key={message.id} className="flex justify-end">
                          <div className="max-w-[86%] rounded-lg bg-emerald-600 px-4 py-3 text-white sm:max-w-[70%]">
                            <div className="mb-2 flex items-center gap-2 text-xs font-black text-emerald-50">
                              <UserRound className="h-4 w-4" aria-hidden="true" />
                              你
                            </div>
                            <p className="whitespace-pre-wrap text-sm font-bold leading-7">{message.text}</p>
                          </div>
                        </div>
                      ) : (
                        <div key={message.id} className="flex justify-start">
                          <article
                            className={`max-w-[92%] rounded-lg border bg-white p-4 shadow-sm sm:max-w-[78%] ${
                              message.isError ? "border-rose-200 text-rose-950" : "border-slate-200 text-slate-800"
                            }`}
                          >
                            <div className="mb-3 flex items-center gap-2 text-xs font-black text-slate-500">
                              {message.isError ? (
                                <AlertCircle className="h-4 w-4 text-rose-600" aria-hidden="true" />
                              ) : (
                                <Bot className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                              )}
                              101recipe
                            </div>
                            <p className="whitespace-pre-wrap text-sm leading-7">{message.text}</p>
                            {message.file ? (
                              <button
                                type="button"
                                onClick={() => openPdf(message.file!)}
                                disabled={openingFileId === message.file.id}
                                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-500"
                              >
                                {openingFileId === message.file.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                ) : (
                                  <FileText className="h-4 w-4" aria-hidden="true" />
                                )}
                                {openingFileId === message.file.id ? "開啟中" : "開啟 PDF"}
                              </button>
                            ) : null}
                            {message.candidates?.length && !message.file ? (
                              <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4">
                                <p className="text-xs font-black text-slate-500">請直接點選要開啟的 PDF：</p>
                                {message.candidates.slice(0, 5).map((candidate) => (
                                  <button
                                    key={candidate.id}
                                    type="button"
                                    onClick={() => openPdf(candidateToFile(candidate))}
                                    disabled={Boolean(openingFileId)}
                                    className="group grid min-h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-black text-slate-800 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900 disabled:cursor-wait disabled:opacity-70"
                                  >
                                    <span className="min-w-0 break-all leading-6">{candidate.name}</span>
                                    <span className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-black text-emerald-700 shadow-sm group-hover:bg-emerald-600 group-hover:text-white">
                                      {openingFileId === candidate.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                      ) : (
                                        <Download className="h-4 w-4" aria-hidden="true" />
                                      )}
                                      {openingFileId === candidate.id ? "開啟中" : "開啟"}
                                    </span>
                                  </button>
                                ))}
                                <p className="text-xs font-semibold leading-6 text-slate-500">
                                  也可以補充食材、日期或完整檔名；若輸入上方完整檔名，系統會直接開啟該 PDF。
                                </p>
                              </div>
                            ) : null}
                          </article>
                        </div>
                      ),
                    )}
                    {isAsking ? (
                      <div className="flex justify-start">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
                          <Loader2 className="h-4 w-4 animate-spin text-emerald-700" aria-hidden="true" />
                          查找中
                        </div>
                      </div>
                    ) : null}
                    <div ref={scrollRef} />
                  </div>
                </div>

                <div className="border-t border-slate-200 bg-white p-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {examples.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => ask(example)}
                        disabled={isAsking}
                        className="min-h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 hover:border-emerald-400 hover:text-emerald-800 disabled:opacity-50"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={handleSubmit}>
                    <label className="sr-only" htmlFor="recipe-message">
                      輸入訊息
                    </label>
                    <textarea
                      id="recipe-message"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={handleKeyDown}
                      maxLength={300}
                      className="min-h-24 w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      placeholder="例如：我要胡桃塔的 PDF"
                    />
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-slate-500">
                        {expiresAt ? `登入到期：${new Date(expiresAt).toLocaleString("zh-TW")}` : ""}
                      </p>
                      <button
                        type="submit"
                        disabled={!draft.trim() || isAsking}
                        className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                        送出
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>

          <aside className="grid content-start gap-4">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <Image
                src="/101recipe/recipe-cover.jpg"
                alt="101recipe 食譜照片"
                width={900}
                height={900}
                priority
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-black text-slate-950">本機食譜庫</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  查詢來源是 101recipe 的本機 PDF 索引。檔案下載前會再次檢查登入狀態與通行碼權限。
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold leading-7 text-emerald-950">
              <div className="mb-2 flex items-center gap-2 font-black">
                <Download className="h-4 w-4" aria-hidden="true" />
                PDF retrieval
              </div>
              回傳的是授權後的 PDF 檔案，不會顯示未授權檔名。
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
