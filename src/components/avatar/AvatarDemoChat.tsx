"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  ExternalLink,
  Loader2,
  Send,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  sources?: string[];
  shouldHandoff?: boolean;
};

type ChatResponse = {
  ok: boolean;
  reply?: string;
  error?: string;
  sources?: string[];
  shouldHandoff?: boolean;
};

const MAX_MESSAGE_LENGTH = 1_000;
const lineAddFriendUrl =
  process.env.NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL ||
  "https://line.me/R/ti/p/%40821jpehj";

const quickQuestions = [
  "你好",
  "你是真人嗎？",
  "LINE101Chat 的 AI 分身適合什麼情境？",
  "我想做一個 LINE 客服 AI 分身，價格怎麼算？",
];

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AvatarDemoChat() {
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "celine-intro",
      role: "assistant",
      content:
        "嗨，我是 Celine。這是 Phase 1 demo，你可以測試問候、身分界線、LINE101Chat 產品問題，或直接說明你想做的 LINE AI 分身情境。",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  async function sendMessage(messageText = draft) {
    const message = messageText.trim();
    if (!message || isSending) return;

    if (message.length > MAX_MESSAGE_LENGTH) {
      setMessages((current) => [
        ...current,
        {
          id: createId("error"),
          role: "assistant",
          content: `訊息最多 ${MAX_MESSAGE_LENGTH} 個字，請縮短後再傳送。`,
          isError: true,
        },
      ]);
      return;
    }

    setMessages((current) => [
      ...current,
      { id: createId("user"), role: "user", content: message },
    ]);
    setDraft("");
    setIsSending(true);

    try {
      const response = await fetch("/api/avatar/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = (await response.json()) as ChatResponse;

      if (!response.ok || !payload.reply) {
        throw new Error(payload.error || "Celine 暫時沒有回覆。");
      }

      const reply = payload.reply;
      setMessages((current) => [
        ...current,
        {
          id: createId("assistant"),
          role: "assistant",
          content: reply,
          sources: payload.sources,
          shouldHandoff: payload.shouldHandoff,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createId("error"),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "連線沒有成功，請稍後再試。",
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  async function forgetConversation() {
    if (isSending) return;
    await sendMessage("忘記我");
  }

  return (
    <section
      id="avatar-demo"
      className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
      aria-labelledby="avatar-demo-title"
    >
      <header className="border-b border-emerald-100 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#06c755] bg-white shadow-sm">
              <Image
                src="/presenter/4.png"
                alt=""
                fill
                sizes="56px"
                className="object-cover object-top"
              />
              <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#06c755]" />
            </div>
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-emerald-700">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Live Website Demo
              </p>
              <h2
                id="avatar-demo-title"
                className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl"
              >
                Talk to Celine
              </h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                One focused Phase 1 flow: chat, qualify, hand off.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={forgetConversation}
            disabled={isSending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-rose-300 hover:text-rose-700 disabled:cursor-wait disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear demo memory
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-h-[560px] flex-col bg-[#f5faf7]">
          <div
            className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
            aria-live="polite"
          >
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[88%] rounded-2xl rounded-br-sm bg-[#06c755] px-4 py-3 text-white shadow-sm sm:max-w-[72%]">
                    <div className="mb-1 flex items-center gap-2 text-xs font-black text-emerald-50">
                      <UserRound className="h-4 w-4" aria-hidden="true" />
                      You
                    </div>
                    <p className="whitespace-pre-wrap text-sm font-semibold leading-7">
                      {message.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex justify-start">
                  <article
                    className={`max-w-[94%] rounded-2xl rounded-bl-sm border bg-white px-4 py-3 shadow-sm sm:max-w-[82%] ${
                      message.isError
                        ? "border-rose-200 text-rose-950"
                        : "border-emerald-100 text-slate-800"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs font-black text-slate-500">
                      {message.isError ? (
                        <AlertCircle
                          className="h-4 w-4 text-rose-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="relative h-5 w-5 overflow-hidden rounded-full border border-emerald-200">
                          <Image
                            src="/presenter/4.png"
                            alt=""
                            fill
                            sizes="20px"
                            className="object-cover object-top"
                          />
                        </span>
                      )}
                      Celine · LINE101
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-7">
                      {message.content}
                    </p>
                    {message.sources?.length ? (
                      <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] font-semibold leading-5 text-slate-400">
                        Used {message.sources.length} local knowledge source
                        {message.sources.length > 1 ? "s" : ""}
                      </p>
                    ) : null}
                    {message.shouldHandoff ? (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                        <Link
                          href="/free-assessment"
                          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#06c755] px-3 py-2 text-xs font-black text-white transition hover:bg-[#05ae4a]"
                        >
                          Book free assessment
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </Link>
                        <a
                          href={lineAddFriendUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                        >
                          Add Celine on LINE
                        </a>
                      </div>
                    ) : null}
                  </article>
                </div>
              ),
            )}

            {isSending ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm border border-emerald-100 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm">
                  <Loader2
                    className="h-4 w-4 animate-spin text-emerald-700"
                    aria-hidden="true"
                  />
                  Celine is preparing a reply
                </div>
              </div>
            ) : null}
            <div ref={scrollRef} />
          </div>

          <form
            className="border-t border-emerald-100 bg-white p-4 sm:p-5"
            onSubmit={handleSubmit}
          >
            <label className="sr-only" htmlFor="avatar-message">
              Message Celine
            </label>
            <textarea
              id="avatar-message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX_MESSAGE_LENGTH}
              className="min-h-24 w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Ask Celine about the demo, LINE use cases, pricing, or identity boundaries"
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {draft.length}/{MAX_MESSAGE_LENGTH}
              </span>
              <button
                type="submit"
                disabled={!draft.trim() || isSending}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#06c755] px-5 py-3 text-sm font-black text-white transition hover:bg-[#05ae4a] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Send
              </button>
            </div>
          </form>
        </div>

        <aside className="border-t border-emerald-100 bg-white p-5 lg:border-l lg:border-t-0">
          <h3 className="text-sm font-black text-slate-950">
            Phase 1 demo script
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Use these prompts to verify the MVP before touching LINE webhook
            settings or production deployment.
          </p>
          <div className="mt-4 grid gap-2">
            {quickQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => void sendMessage(question)}
                disabled={isSending}
                className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-bold leading-6 text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900 disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
          <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs font-semibold leading-6 text-amber-900">
            Do not send passwords, tokens, customer private data, or payment
            details. Celine is a virtual representative; real quotes and
            commitments still go through the LINE101Chat team.
          </p>
        </aside>
      </div>
    </section>
  );
}
