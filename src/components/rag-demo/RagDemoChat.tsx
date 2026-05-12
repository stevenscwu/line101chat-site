"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { AlertCircle, Bot, ExternalLink, Loader2, Send, UserRound } from "lucide-react";

import { SuggestedQuestions } from "@/components/rag-demo/SuggestedQuestions";

const MAX_QUESTION_LENGTH = 300;

const suggestedQuestions = [
  "人工智慧學程 TOEFL iBT 畢業門檻是多少？",
  "資訊安全學程修業規定有哪些？",
  "半導體學程指導教授相關規定是什麼？",
  "人工智慧博士班資格考可以免考嗎？",
  "我要查詢英文畢業門檻",
];

const programOptions = [
  { value: "auto", label: "自動判斷" },
  { value: "ai_program", label: "人工智慧科技學程" },
  { value: "security_program", label: "資訊安全學程" },
  { value: "semi_program", label: "半導體科技學程" },
] as const;

type RagProgram = (typeof programOptions)[number]["value"];

type RagSource = {
  title: string;
  url: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: RagSource[];
  isError?: boolean;
};

type RagDemoResponse = {
  answer?: unknown;
  error?: unknown;
  sources?: unknown;
};

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function sourceTitle(source: Record<string, unknown>) {
  return (
    stringValue(source.heading) ||
    stringValue(source.title) ||
    stringValue(source.source_file).split(/[\\/]/).pop() ||
    "資料來源"
  );
}

function safeSourceUrl(value: unknown) {
  const rawUrl = stringValue(value);
  if (!rawUrl) {
    return "";
  }

  try {
    const url = new URL(rawUrl);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function normalizeSources(value: unknown): RagSource[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const sources: RagSource[] = [];

  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }

    const url = safeSourceUrl(item.source_url ?? item.url);
    if (!url || seen.has(url)) {
      continue;
    }

    seen.add(url);
    sources.push({
      title: sourceTitle(item),
      url,
    });
  }

  return sources;
}

function displayAnswer(answer: string) {
  return answer.replace(/\n*\s*資料來源[:：][\s\S]*$/u, "").trim() || answer;
}

function errorMessageFromPayload(payload: RagDemoResponse) {
  return stringValue(payload.error) || "目前無法取得回答，請稍後再試。";
}

export function RagDemoChat() {
  const [program, setProgram] = useState<RagProgram>("auto");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  async function sendQuestion(questionText = draft) {
    const question = questionText.trim();

    if (!question || isLoading) {
      return;
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      setMessages((current) => [
        ...current,
        {
          id: createId("error"),
          role: "assistant",
          content: `問題最多 ${MAX_QUESTION_LENGTH} 個字，請縮短後再送出。`,
          isError: true,
        },
      ]);
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: createId("user"),
        role: "user",
        content: question,
      },
    ]);
    setDraft("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/rag-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, program }),
      });
      const payload = (await response.json().catch(() => ({}))) as RagDemoResponse;

      if (!response.ok) {
        throw new Error(errorMessageFromPayload(payload));
      }

      const answer = stringValue(payload.answer);
      setMessages((current) => [
        ...current,
        {
          id: createId("assistant"),
          role: "assistant",
          content: answer || "目前沒有收到可顯示的回答，請稍後再試。",
          sources: normalizeSources(payload.sources),
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createId("error"),
          role: "assistant",
          content: error instanceof Error ? error.message : "目前無法連線到 Demo 後端，請稍後再試。",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendQuestion();
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendQuestion();
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px] lg:items-end">
          <div>
            <h2 className="text-2xl font-black leading-tight text-slate-950">iFIRST 文件問答</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              可查詢人工智慧、資訊安全與半導體三個學程的公開文件內容。
            </p>
          </div>
          <label className="text-sm font-black text-slate-800">
            學程
            <select
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={program}
              onChange={(event) => setProgram(event.target.value as RagProgram)}
            >
              {programOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-h-[520px] flex-col rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-[300px] items-center justify-center text-center">
                <div className="max-w-sm">
                  <Bot className="mx-auto h-10 w-10 text-emerald-700" aria-hidden="true" />
                  <p className="mt-4 text-base font-black text-slate-950">請輸入想查詢的 iFIRST 問題</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    回答會依據目前公開文件與後端索引結果產生。
                  </p>
                </div>
              </div>
            ) : null}

            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[88%] rounded-lg bg-emerald-600 px-4 py-3 text-white shadow-sm sm:max-w-[72%]">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black text-emerald-50">
                      <UserRound className="h-4 w-4" aria-hidden="true" />
                      你
                    </div>
                    <p className="whitespace-pre-wrap text-sm font-bold leading-7">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex justify-start">
                  <article
                    className={`max-w-[92%] rounded-lg border p-4 shadow-sm sm:max-w-[82%] ${
                      message.isError
                        ? "border-rose-200 bg-rose-50 text-rose-950"
                        : "border-slate-200 bg-white text-slate-800"
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-2 text-xs font-black text-slate-500">
                      {message.isError ? (
                        <AlertCircle className="h-4 w-4 text-rose-600" aria-hidden="true" />
                      ) : (
                        <Bot className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                      )}
                      AI 助理
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-7">{displayAnswer(message.content)}</p>
                    {!message.isError && message.sources?.length ? (
                      <div className="mt-4 border-t border-slate-200 pt-4">
                        <p className="text-xs font-black uppercase tracking-[0.08em] text-emerald-700">
                          資料來源
                        </p>
                        <div className="mt-3 grid gap-2">
                          {message.sources.map((source) => (
                            <a
                              key={source.url}
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold leading-6 text-slate-700 hover:border-emerald-400 hover:text-emerald-800"
                            >
                              <span className="min-w-0 flex-1 truncate">{source.title}</span>
                              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </article>
                </div>
              ),
            )}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-700" aria-hidden="true" />
                  查詢公開文件中...
                </div>
              </div>
            ) : null}

            <div ref={scrollRef} />
          </div>

          <form className="border-t border-slate-200 bg-white p-4" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="rag-demo-question">
              輸入問題
            </label>
            <textarea
              id="rag-demo-question"
              className="min-h-24 w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              maxLength={MAX_QUESTION_LENGTH}
              placeholder="輸入你的問題..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleTextareaKeyDown}
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold text-slate-500">
                {draft.length}/{MAX_QUESTION_LENGTH}
              </p>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={isLoading || !draft.trim()}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                送出問題
              </button>
            </div>
          </form>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-base font-black text-slate-950">建議問題</h3>
          <div className="mt-4">
            <SuggestedQuestions
              questions={suggestedQuestions}
              disabled={isLoading}
              onSelect={(question) => void sendQuestion(question)}
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
