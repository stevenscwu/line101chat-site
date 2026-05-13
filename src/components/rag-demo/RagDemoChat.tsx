"use client";

import Image from "next/image";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { AlertCircle, Bot, ExternalLink, MessageCircle, Send, UserRound } from "lucide-react";

import { SuggestedQuestions } from "@/components/rag-demo/SuggestedQuestions";

const MAX_QUESTION_LENGTH = 300;

const suggestedQuestions = [
  "人工智慧學程 TOEFL iBT 畢業門檻是多少？",
  "資訊安全學程修業規定有哪些？",
  "半導體學程指導教授相關規定是什麼？",
  "人工智慧博士班資格考可以免考嗎？",
  "我要查詢英文畢業門檻",
  "博士班最多可以念幾年？",
  "資訊安全博士生新制資格考核需要在入學後幾年內完成？",
  "人工智慧科技碩士申請學位考試要準備哪些資料？",
];

const lineReminder =
  "網頁版是純 Demo，這則回答是預先準備的示意內容，沒有呼叫 RAG 後端。若要測試真實查詢速度、自由提問與完整回答品質，請掃描 QR code 加入 LINE chatbot。";

const formalRulesReminder = "正式規定仍以北科大創新前瞻科技學院官方公告與辦公室回覆為準。";

type RagSource = {
  title: string;
  url: string;
};

type PreparedAnswer = {
  content: string;
  sources: RagSource[];
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: RagSource[];
  isError?: boolean;
  showLineQr?: boolean;
};

const sources = {
  ifirst: {
    title: "北科大創新前瞻科技學院公開資訊",
    url: "https://ifirst.ntut.edu.tw/",
  },
  aiEnglishThreshold: {
    title: "人工智慧科技學位學程碩士班學生英文能力畢業門檻實施要點",
    url: "https://ifirst.ntut.edu.tw/var/file/130/1130/img/4091/713675937.pdf",
  },
  aiDegreeExam: {
    title: "人工智慧科技學位學程碩士學位考試公告",
    url: "https://ifirst.ntut.edu.tw/p/406-1118-141378,r2240.php?Lang=zh-tw",
  },
  securityQualification: {
    title: "資訊安全博士生新制資格考核公告",
    url: "https://ifirst.ntut.edu.tw/p/405-1118-135982,c19643.php?Lang=zh-tw",
  },
};

const preparedAnswers: Record<string, PreparedAnswer> = {
  "人工智慧學程 TOEFL iBT 畢業門檻是多少？": {
    content: [
      "示意回答：人工智慧科技學位學程碩士班英文能力畢業門檻公開文件寫法，是需符合 CEFR B1 程度，或通過校內英文能力畢業門檻鑑定考試 A 級分或 B 級分以上。TOEFL iBT 的實際對照分數請以該文件附件與最新公告為準。",
      formalRulesReminder,
      lineReminder,
    ].join("\n\n"),
    sources: [sources.aiEnglishThreshold],
  },
  "資訊安全學程修業規定有哪些？": {
    content: [
      "示意回答：資訊安全學程修業規定通常會看修業年限、應修學分、資格考或學位考試、論文與畢業門檻等項目。正式查詢應以資訊安全學程最新公開規定與公告為準。",
      formalRulesReminder,
      lineReminder,
    ].join("\n\n"),
    sources: [sources.ifirst],
  },
  "半導體學程指導教授相關規定是什麼？": {
    content: [
      "示意回答：半導體學程的指導教授規範需依學程最新修業規定與公告確認，常見會包含指導教授選定、共同指導、變更流程與學位考試前確認事項。",
      formalRulesReminder,
      lineReminder,
    ].join("\n\n"),
    sources: [sources.ifirst],
  },
  "人工智慧博士班資格考可以免考嗎？": {
    content: [
      "示意回答：人工智慧博士班資格考是否可免考，需要依博士班資格考規定、抵免或免考條件與當學期公告確認。此網頁 Demo 不做正式資格判定。",
      formalRulesReminder,
      lineReminder,
    ].join("\n\n"),
    sources: [sources.ifirst],
  },
  我要查詢英文畢業門檻: {
    content: [
      "示意回答：人工智慧科技學位學程碩士班英文能力畢業門檻文件提到 CEFR B1 程度與校內英文能力畢業門檻鑑定考試等條件。不同考試類型與分數對照請直接確認最新公告文件。",
      formalRulesReminder,
      lineReminder,
    ].join("\n\n"),
    sources: [sources.aiEnglishThreshold],
  },
  "博士班最多可以念幾年？": {
    content: [
      "示意回答：博士班修業年限需要同時確認校級學則與學程修業規定。此網頁 Demo 不做正式年限判定；正式 LINE chatbot 會回查文件後列出適用條文。",
      formalRulesReminder,
      lineReminder,
    ].join("\n\n"),
    sources: [sources.ifirst],
  },
  "資訊安全博士生新制資格考核需要在入學後幾年內完成？": {
    content: [
      "示意回答：資訊安全博士生新制資格考核的完成期限需以最新公開公告為準。正式查詢建議用 LINE chatbot，由系統回查公告內容與資料來源後回答。",
      formalRulesReminder,
      lineReminder,
    ].join("\n\n"),
    sources: [sources.securityQualification],
  },
  "人工智慧科技碩士申請學位考試要準備哪些資料？": {
    content: [
      "示意回答：依人工智慧科技學程碩士學位考試公告，申請時需依公告流程與教務處時程辦理，並準備學位考試相關申請資料；公告中特別提醒需填寫「創新前瞻研究科技學院-碩博生通過畢業門檻申請表」，並回傳學位考試申請名單彙整表給承辦人。",
      formalRulesReminder,
      lineReminder,
    ].join("\n\n"),
    sources: [sources.aiDegreeExam],
  },
};

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function fallbackAnswer(question: string): PreparedAnswer {
  return {
    content: [
      `你輸入的是：「${question}」`,
      "這個網頁版是純 Demo，只準備了右側「建議問題」的示意回答，沒有呼叫 RAG 後端，也不會對自由輸入做正式查詢。",
      "若要測試真實查詢速度、自由提問與完整回答品質，請掃描 QR code 加入 LINE chatbot。",
    ].join("\n\n"),
    sources: [],
  };
}

function LineQrBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-3 ${compact ? "" : "border-t border-slate-200 pt-4"} sm:grid-cols-[140px_1fr] sm:items-center`}>
      <div className="w-36 rounded-lg border border-slate-200 bg-white p-2">
        <Image
          src="/line101chat-qr.png"
          alt="LINE101Chat LINE QR Code"
          width={250}
          height={250}
          className="h-auto w-full"
        />
      </div>
      <div>
        <p className="text-sm font-black leading-6 text-slate-950">真實效能請用 LINE chatbot</p>
        <p className="mt-1 text-xs font-semibold leading-6 text-slate-600">
          網頁版只展示預先回答；LINE chatbot 才是實際查詢體驗。
        </p>
        <a
          href="/line"
          className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          加入 LINE chatbot
        </a>
      </div>
    </div>
  );
}

export function RagDemoChat() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function sendQuestion(questionText = draft) {
    const question = questionText.trim();

    if (!question) {
      return;
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      setMessages((current) => [
        ...current,
        {
          id: createId("error"),
          role: "assistant",
          content: `問題最多 ${MAX_QUESTION_LENGTH} 個字，請縮短後再送出。若要測試真實查詢，請掃描 QR code 加入 LINE chatbot。`,
          isError: true,
        },
      ]);
      return;
    }

    const prepared = preparedAnswers[question] ?? fallbackAnswer(question);

    setMessages((current) => [
      ...current,
      {
        id: createId("user"),
        role: "user",
        content: question,
      },
      {
        id: createId("assistant"),
        role: "assistant",
        content: prepared.content,
        sources: prepared.sources,
        showLineQr: true,
      },
    ]);
    setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendQuestion();
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendQuestion();
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <h2 className="text-2xl font-black leading-tight text-slate-950">iFIRST 文件問答純 Demo</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              請先點選建議問題。這個網頁版只展示預先準備的示意回答，不會呼叫 RAG 後端。
            </p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold leading-7 text-emerald-900">
            真實查詢速度、自由提問與完整回答品質，請掃描 QR code 加入 LINE chatbot 測試。
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-h-[520px] flex-col rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-[300px] items-center justify-center text-center">
                <div className="max-w-sm">
                  <Bot className="mx-auto h-10 w-10 text-emerald-700" aria-hidden="true" />
                  <p className="mt-4 text-base font-black text-slate-950">請先點選右側建議問題</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    網頁版只展示預先準備的示意回答，不呼叫 RAG 後端。真實效能請掃描 QR code 加入 LINE chatbot。
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
                      {message.isError ? "Demo 提醒" : "AI 助理示意回答"}
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
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
                    {!message.isError && message.showLineQr ? (
                      <div className="mt-4">
                        <LineQrBlock />
                      </div>
                    ) : null}
                  </article>
                </div>
              ),
            )}

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
              placeholder="可輸入問題；網頁版會提醒你改用 LINE chatbot 測試真實效能。"
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
                className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={!draft.trim()}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                送出 Demo 問題
              </button>
            </div>
          </form>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-base font-black text-slate-950">建議問題</h3>
          <p className="mt-2 text-xs font-semibold leading-6 text-slate-600">
            下列問題已準備示意回答；網頁版不會呼叫 RAG 後端。
          </p>
          <div className="mt-4">
            <SuggestedQuestions questions={suggestedQuestions} onSelect={sendQuestion} />
          </div>
          <div className="mt-5 rounded-lg border border-emerald-100 bg-white p-4">
            <LineQrBlock compact />
          </div>
        </aside>
      </div>
    </section>
  );
}
