"use client";

import Image from "next/image";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  Bot,
  Brain,
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
};

type ChatResponse = {
  ok: boolean;
  reply?: string;
  error?: string;
  memoryDurable?: boolean;
  memoryMode?: string;
};

const MAX_MESSAGE_LENGTH = 1_000;
const suggestions = [
  "嗨 Celine，先自我介紹一下",
  "我叫 Steven，請記得我的名字",
  "今天工作有點累，陪我整理一下",
  "你記得我什麼？",
  "LINE AI 分身可以做什麼？",
];

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function CelineChat() {
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [memoryDurable, setMemoryDurable] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "celine-intro",
      role: "assistant",
      content:
        "嗨，我是 Celine，一位有年輕女性聊天風格的 AI，不是真人。你可以跟我聊日常、工作、學習，或請我一起整理腦中的事。",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  async function sendMessage(messageText = draft) {
    const message = messageText.trim();

    if (!message || isSending) {
      return;
    }

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
      const response = await fetch("/api/celine/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = (await response.json()) as ChatResponse;

      if (!response.ok || !payload.reply) {
        throw new Error(payload.error || "Celine 暫時沒有回覆。");
      }

      setMemoryDurable(
        payload.memoryMode === "cleared"
          ? null
          : Boolean(payload.memoryDurable),
      );
      setMessages((current) => [
        ...current,
        {
          id: createId("assistant"),
          role: "assistant",
          content: payload.reply || "",
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
    sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  async function forgetConversation() {
    if (isSending) {
      return;
    }

    await sendMessage("忘記我");
    setMemoryDurable(null);
  }

  return (
    <section
      id="talk-to-celine"
      className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
      aria-labelledby="celine-chat-title"
    >
      <header className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#06c755] bg-white">
              <Image
                src="/presenter/4.png"
                alt=""
                fill
                sizes="56px"
                className="object-cover object-top"
              />
            </div>
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-emerald-700">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Live web conversation
              </p>
              <h2
                id="celine-chat-title"
                className="mt-1 text-2xl font-black text-slate-950"
              >
                和 Celine 聊聊
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                AI 對話角色 · 繁體中文優先 · 可延續對話脈絡
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
            忘記這段對話
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-h-[620px] flex-col bg-[#f5faf7]">
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
                      你
                    </div>
                    <p className="whitespace-pre-wrap text-sm font-semibold leading-7">
                      {message.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex justify-start">
                  <article
                    className={`max-w-[92%] rounded-2xl rounded-bl-sm border bg-white px-4 py-3 shadow-sm sm:max-w-[78%] ${
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
                        <Bot
                          className="h-4 w-4 text-emerald-700"
                          aria-hidden="true"
                        />
                      )}
                      Celine · AI
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-7">
                      {message.content}
                    </p>
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
                  Celine 正在想
                </div>
              </div>
            ) : null}
            <div ref={scrollRef} />
          </div>

          <form
            className="border-t border-emerald-100 bg-white p-4 sm:p-5"
            onSubmit={handleSubmit}
          >
            <label className="sr-only" htmlFor="celine-message">
              傳訊息給 Celine
            </label>
            <textarea
              id="celine-message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX_MESSAGE_LENGTH}
              className="min-h-24 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="跟 Celine 說點什麼… Enter 送出，Shift+Enter 換行"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-slate-500">
                {draft.length}/{MAX_MESSAGE_LENGTH}
              </p>
              <button
                type="submit"
                disabled={!draft.trim() || isSending}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#06c755] px-5 py-3 text-sm font-black text-white transition hover:bg-[#05ae4a] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                傳送
              </button>
            </div>
          </form>
        </div>

        <aside className="border-t border-emerald-100 bg-white p-5 lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2 text-sm font-black text-slate-950">
            <Brain className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            記憶狀態
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {memoryDurable === null
              ? "第一次送出後，Celine 會告訴你目前是否使用持久記憶。"
              : memoryDurable
                ? "已啟用去識別化持久記憶；保存有限的近期對話與你主動提供的偏好。"
                : "目前只使用暫時記憶；服務重新啟動後可能不會保留。"}
          </p>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs font-semibold leading-6 text-slate-600">
            不要傳送密碼、權杖、信用卡或其他不必要的敏感資料。輸入「你記得我什麼？」可查看摘要，輸入「忘記我」可刪除。
          </p>

          <h3 className="mt-6 text-sm font-black text-slate-950">
            不知道怎麼開始？
          </h3>
          <div className="mt-3 grid gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                disabled={isSending}
                className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-bold leading-6 text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
