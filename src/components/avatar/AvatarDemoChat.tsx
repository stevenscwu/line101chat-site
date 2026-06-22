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
  Brain,
  ExternalLink,
  Link2,
  Loader2,
  Mic,
  Send,
  Sparkles,
  Square,
  Trash2,
  UserRound,
  Volume2,
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
  memoryDurable?: boolean;
  memoryMode?: string;
  linkedToLine?: boolean;
  message?: string;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<{
    0: { transcript: string };
  }>;
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const MAX_MESSAGE_LENGTH = 1_000;
const quickQuestions = [
  "嗨 Celine，先介紹你自己",
  "你覺得好的 AI 分身是什麼？",
  "你會記得我嗎？",
  "今天工作有點亂，陪我整理一下",
  "你跟一般 ChatGPT 有什麼不同？",
  "RAG 是什麼？",
  "可以幫學校做招生問答嗎？",
  "我想打造自己的 AI 分身",
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
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean | null>(null);
  const [voiceNotice, setVoiceNotice] = useState("");
  const [memoryDurable, setMemoryDurable] = useState<boolean | null>(null);
  const [linkedToLine, setLinkedToLine] = useState(false);
  const [linkCode, setLinkCode] = useState("");
  const [linkNotice, setLinkNotice] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "celine-intro",
      role: "assistant",
      content:
        "嗨，我是 Celine，很高興認識你。你可以直接跟我聊工作、整理想法，或問 LINE101Chat、AI 分身、RAG 和 LINE 串接。告訴我你現在最想弄清楚什麼？",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(Boolean(Recognition && window.speechSynthesis));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

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
    setVoiceNotice("");

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

      setMemoryDurable(
        payload.memoryMode === "cleared"
          ? null
          : Boolean(payload.memoryDurable),
      );
      setLinkedToLine(Boolean(payload.linkedToLine));
      setMessages((current) => [
        ...current,
        {
          id: createId("assistant"),
          role: "assistant",
          content: payload.reply || "",
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
    setMemoryDurable(null);
    setLinkedToLine(false);
    setLinkCode("");
    setLinkNotice("");
  }

  async function connectLineMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = linkCode.trim();
    if (!code || isLinking) return;

    setIsLinking(true);
    setLinkNotice("");

    try {
      const response = await fetch("/api/avatar/link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const payload = (await response.json()) as ChatResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "連結沒有成功，請重新取得連結碼。");
      }

      setLinkedToLine(true);
      setMemoryDurable(Boolean(payload.memoryDurable));
      setLinkCode("");
      setLinkNotice(
        payload.message || "已連結 LINE，網站可以接續同一段對話。",
      );
    } catch (error) {
      setLinkNotice(
        error instanceof Error ? error.message : "連結沒有成功，請稍後再試。",
      );
    } finally {
      setIsLinking(false);
    }
  }

  function toggleListening() {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceNotice("此瀏覽器不支援語音辨識，請改用文字輸入。");
      setVoiceSupported(false);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "zh-TW";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || "";
      setDraft(transcript);
      setVoiceNotice("已將語音轉成文字，確認後即可送出。");
    };
    recognition.onerror = (event) => {
      setVoiceNotice(
        event.error === "not-allowed"
          ? "麥克風權限未開啟，請允許權限或改用文字輸入。"
          : "語音辨識沒有成功，請再試一次或改用文字輸入。",
      );
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    setVoiceNotice("正在聆聽，請開始說話。");
    recognition.start();
  }

  function speakLatestReply() {
    const latestReply = [...messages]
      .reverse()
      .find((message) => message.role === "assistant" && !message.isError);

    if (!latestReply || !window.speechSynthesis) {
      setVoiceNotice("此瀏覽器不支援語音朗讀。");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(latestReply.content);
    utterance.lang = "zh-TW";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
    setVoiceNotice("正在朗讀最新回覆。");
  }

  return (
    <section
      id="avatar-demo"
      className="overflow-hidden rounded-[1.75rem] border border-emerald-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
      aria-labelledby="avatar-demo-title"
    >
      <header className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#06c755] bg-white shadow-sm">
              <Image
                src="/presenter/4.png"
                alt=""
                fill
                sizes="64px"
                className="object-cover object-top"
              />
              <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#06c755]" />
            </div>
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-emerald-700">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Live Celine Demo
              </p>
              <h2
                id="avatar-demo-title"
                className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl"
              >
                和 Celine 聊聊
              </h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                LINE101 虛擬代表 · 有個性 · 有根據 · 可接續
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

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
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
                      您
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
                        已參考 {message.sources.length} 個本地知識片段
                      </p>
                    ) : null}
                    {message.shouldHandoff ? (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                        <Link
                          href="/free-assessment"
                          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#06c755] px-3 py-2 text-xs font-black text-white transition hover:bg-[#05ae4a]"
                        >
                          預約免費評估
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                        <a
                          href="https://line.me/R/ti/p/%40821jpehj"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                        >
                          加入 Celine LINE
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
                  Celine 正在找資料，也在想怎麼說得更清楚
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
              傳訊息給 Celine
            </label>
            <textarea
              id="avatar-message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX_MESSAGE_LENGTH}
              className="min-h-24 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="跟 Celine 說點什麼… Enter 送出，Shift+Enter 換行"
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={voiceSupported === false}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isListening ? (
                    <Square className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Mic className="h-4 w-4" aria-hidden="true" />
                  )}
                  {isListening ? "停止聆聽" : "語音輸入"}
                </button>
                <button
                  type="button"
                  onClick={speakLatestReply}
                  disabled={voiceSupported === false}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  讓 Celine 朗讀
                </button>
                <span className="text-xs font-semibold text-slate-500">
                  {draft.length}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
              <button
                type="submit"
                disabled={!draft.trim() || isSending}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#06c755] px-5 py-3 text-sm font-black text-white transition hover:bg-[#05ae4a] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                傳送
              </button>
            </div>
            {voiceNotice ? (
              <p className="mt-3 text-xs font-semibold leading-6 text-slate-500">
                {voiceNotice}
              </p>
            ) : null}
          </form>
        </div>

        <aside className="border-t border-emerald-100 bg-white p-5 lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2 text-sm font-black text-slate-950">
            <Brain className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            對話記憶
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {linkedToLine
              ? "已連結 LINE。Celine 會用同一個去識別化身分，在網站與 LINE 接續近期脈絡。"
              : memoryDurable === null
                ? "網站會用安全 session 辨識這個瀏覽器；連結 LINE 後，也能跨裝置接續。"
              : memoryDurable
                ? "已使用去識別化持久記憶，只保存有限近期脈絡與你主動提供的偏好。"
                : "目前只使用暫時記憶；服務重新啟動後可能不會保留。"}
          </p>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs font-semibold leading-6 text-slate-600">
            輸入「你記得我什麼？」可查看摘要；輸入「忘記我」可清除。
          </p>

          <form
            className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4"
            onSubmit={connectLineMemory}
          >
            <label
              htmlFor="line-memory-code"
              className="flex items-center gap-2 text-sm font-black text-slate-950"
            >
              <Link2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              連結 LINE 記憶
            </label>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">
              在 Celine 的 LINE 聊天室傳送「連結網站」，再把 10
              分鐘內有效的連結碼貼到這裡。
            </p>
            <div className="mt-3 flex gap-2">
              <input
                id="line-memory-code"
                value={linkCode}
                onChange={(event) =>
                  setLinkCode(event.target.value.toUpperCase())
                }
                autoComplete="one-time-code"
                inputMode="text"
                maxLength={16}
                placeholder={linkedToLine ? "已連結" : "輸入連結碼"}
                disabled={linkedToLine || isLinking}
                className="min-w-0 flex-1 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-black uppercase tracking-wider text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
              />
              <button
                type="submit"
                disabled={linkedToLine || isLinking || !linkCode.trim()}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-700 px-3 py-2 text-xs font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isLinking ? "連結中" : linkedToLine ? "已連結" : "連結"}
              </button>
            </div>
            {linkNotice ? (
              <p
                className={`mt-3 text-xs font-semibold leading-5 ${
                  linkedToLine ? "text-emerald-800" : "text-rose-700"
                }`}
              >
                {linkNotice}
              </p>
            ) : null}
          </form>

          <h3 className="mt-6 text-sm font-black text-slate-950">
            不知道怎麼開始？
          </h3>
          <div className="mt-3 grid gap-2">
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
            請勿傳送密碼、權杖、信用卡或不必要的敏感資料。Celine 是
            LINE101 的虛擬代表；正式報價與專業判斷由團隊確認。
          </p>
        </aside>
      </div>
    </section>
  );
}
