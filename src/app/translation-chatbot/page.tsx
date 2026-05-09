import type { Metadata } from "next";
import { CheckCircle2, Languages } from "lucide-react";

import { PresenterCallout } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "翻譯加值服務｜LINE 印尼文繁體中文雙向翻譯",
  description:
    "LINE101Chat 翻譯加值服務支援 Indonesian ⇄ Traditional Chinese，可接在 RAG 或 LINE chatbot 之後，協助台灣雇主、移工、看護、工廠、仲介與家庭日常溝通。",
  alternates: { canonical: "/translation-chatbot" },
};

const translationFeatures = [
  "定位為 RAG / LINE chatbot 加值服務",
  "Indonesian ⇄ Traditional Chinese",
  "直接在 LINE 裡使用",
  "適合移工、看護、工廠、仲介與家庭",
  "可評估本地端 / 私有化 LLM backend",
  "可搭配使用量紀錄",
  "可規劃額度與付費使用模式",
];

const conversation = [
  { speaker: "User", text: "Saya akan tiba jam 8 pagi." },
  { speaker: "Bot", text: "我早上 8 點會到。" },
  { speaker: "User", text: "今天請記得帶健保卡。" },
  { speaker: "Bot", text: "Hari ini jangan lupa membawa kartu asuransi kesehatan." },
];

export default function TranslationChatbotPage() {
  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="inline-flex rounded-lg bg-sky-50 px-4 py-2 text-sm font-black text-sky-700">
              Add-on Service / LINE Translation Assistant
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[0] text-slate-950 sm:text-5xl">
              翻譯加值服務：讓 LINE chatbot 支援印尼文繁體中文
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
              LINE101Chat 的主服務是 RAG 知識助理；若你的現場還需要跨語言溝通，可加購印尼文與繁體中文雙向翻譯，讓雇主、移工、看護、工廠管理者、仲介與家庭用熟悉的 LINE 溝通。
            </p>
          </div>
          <PresenterCallout
            imageKey="translation"
            label="適合日常使用"
            title="先把核心 RAG 做穩，再依需求加上翻譯"
            body="適合已經有 LINE 使用流程、需要頻繁跨語言溝通，但又希望操作方式簡單的場景。"
          />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionHeading
            eyebrow="服務能力"
            title="為台灣現場情境設計的加值能力"
            description="翻譯助理不取代 RAG 知識助理，而是補上日常句子、提醒、工作安排與照護溝通的跨語言需求。"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {translationFeatures.map((feature) => (
              <div key={feature} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <p className="text-sm font-bold leading-7 text-slate-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f0f9ff] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Languages className="h-10 w-10 text-sky-700" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[0] text-slate-950">
              LINE 對話示意
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              使用者只要把訊息貼到 LINE，bot 會回傳另一種語言的自然翻譯。正式導入時可接在既有 LINE chatbot 後方，並加上紀錄、額度與使用者管理。
            </p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4">
              {conversation.map((message, index) => (
                <div
                  key={`${message.speaker}-${index}`}
                  className={`max-w-[86%] rounded-lg px-4 py-3 ${
                    message.speaker === "User"
                      ? "justify-self-end bg-emerald-600 text-white"
                      : "justify-self-start bg-slate-100 text-slate-900"
                  }`}
                >
                  <p className="text-xs font-black opacity-80">{message.speaker}</p>
                  <p className="mt-1 text-base font-semibold leading-7">{message.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
