import type { Metadata } from "next";
import { CheckCircle2, FileText, Quote } from "lucide-react";

import { DataReadinessScore } from "@/components/data-readiness-score";
import { PresenterCallout } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";
import { acceptedFormats, deploymentOptions, ragUseCases, smeRolloutSchedule } from "@/data/site";

export const metadata: Metadata = {
  title: "RAG 知識助理｜台灣 SME 文件問答與來源引用",
  description:
    "LINE101Chat RAG 知識助理可將 FAQ、SOP、規章、產品手冊與內部文件轉為 LINE 或網站 AI 問答助理，支援來源引用、雲端代管與本地端部署。",
  alternates: { canonical: "/rag-chatbot" },
};

const ragReasons = [
  "回答前先查找你的正式文件，而不是只依賴模型記憶。",
  "可附上來源段落或文件名稱，方便使用者追溯。",
  "當文件更新時，可透過知識庫更新改善答案。",
  "比一般聊天機器人更適合招生規章、SOP、內部制度與客服知識庫。",
];

export default function RagChatbotPage() {
  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="inline-flex rounded-lg bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              Core Service / RAG Knowledge Assistant
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[0] text-slate-950 sm:text-5xl">
              RAG 知識助理：LINE101Chat 的核心導入服務
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
              RAG 不是讓 AI 憑空回答，而是先從你的文件中找出相關內容，再根據這些內容產生答案。因此更適合台灣中小企業的招生規章、SOP、產品手冊、內部制度與客服知識庫。
            </p>
          </div>
          <PresenterCallout
            imageKey="rag"
            label="顧問提醒"
            title="先驗證文件品質，再談導入規模"
            body="RAG 成敗通常取決於文件是否正式、最新、結構清楚，以及測試問題是否接近真實場景。雲端或本地端部署則在 PoC 後一起評估。"
          />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="為什麼選 RAG"
            title="為什麼 RAG 比一般聊天機器人更適合商務場景？"
            description="中小企業與學校最在意的通常不是 AI 說得多漂亮，而是答案是否符合正式文件、是否能追溯來源、是否能被維護。"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {ragReasons.map((reason) => (
              <div key={reason} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <p className="text-sm font-bold leading-7 text-slate-700">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="使用場景"
            title="常見使用場景"
            description="只要有正式文件、重複問題與明確使用者，就很適合先做小範圍 PoC。"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ragUseCases.map((useCase) => (
              <article key={useCase} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <FileText className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-black text-slate-950">{useCase}</h2>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="部署架構"
            title="雲端代管或本地端部署，依資料敏感度決定"
            description="RAG 的價格與時程會受到部署方式影響。多數 SME 可先用雲端快速驗證 ROI；敏感資料、內規或研發文件則可評估本地端或私有雲。"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {deploymentOptions.map((option) => (
              <article key={option.name} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-2xl font-black text-slate-950">{option.name}</h2>
                <p className="mt-3 text-sm font-black text-emerald-700">{option.priceSignal}</p>
                <p className="mt-2 text-sm font-semibold text-slate-600">{option.timeline}</p>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-950">優點</h3>
                    <ul className="mt-3 grid gap-2">
                      {option.pros.map((item) => (
                        <li key={item} className="text-sm leading-6 text-slate-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-950">限制</h3>
                    <ul className="mt-3 grid gap-2">
                      {option.cons.map((item) => (
                        <li key={item} className="text-sm leading-6 text-slate-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="文件準備"
            title="文件準備方式"
            description="PoC 階段建議先準備 20-40 頁乾淨、正式、最新的文件。資料越清楚，越容易評估 RAG 的真實效果。"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {acceptedFormats.map((format) => (
              <div key={format} className="rounded-lg border border-slate-200 bg-white p-4 text-center text-sm font-black text-slate-800 shadow-sm">
                {format}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <Quote className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              <p className="text-base font-bold leading-8 text-slate-800">
                PoC 階段建議先準備 20-40 頁乾淨、正式、最新的文件。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Data Readiness"
            title="Data Readiness Score"
            description="這五項可以快速判斷你的文件是否適合進入 PoC。若分數偏低，先整理文件會比直接導入更有效。"
          />
          <div className="mt-8">
            <DataReadinessScore />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="導入節奏"
            title="適合 SME 的 RAG 導入時程"
            description="用可控範圍快速驗證，再把預算花在確定有價值的正式導入與維護。"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {smeRolloutSchedule.map((item) => (
              <article key={item.phase} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0] text-emerald-700">{item.phase}</p>
                <h2 className="mt-3 text-lg font-black text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm font-black text-slate-700">{item.duration}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
