import type { Metadata } from "next";

import { PresenterCallout } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";
import { teamHighlights } from "@/data/site";

export const metadata: Metadata = {
  title: "關於 LINE101Chat｜北科大工程團隊打造 RAG 知識助理",
  description:
    "LINE101Chat 由 NTUT（國立台北科技大學 / 北科大）工程背景團隊打造，專注於台灣中小企業可以實際落地的 RAG 知識助理。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="關於我們"
            title="關於 LINE101Chat"
            description="LINE101Chat 專注於台灣中小企業、學校與組織可以實際落地的 RAG 知識助理。工程團隊來自 NTUT（國立台北科技大學 / 北科大），重視文件品質、資料安全、來源引用與可衡量的工作效率改善。"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["務實", "先確認場景、資料與效益，再決定導入範圍。"],
              ["可信任", "回答需要能追溯來源，敏感資料需要明確處理方式。"],
              ["可維護", "AI chatbot 必須能隨文件更新與組織流程長期調整。"],
            ].map(([title, body]) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="工程團隊"
            title="北科大工程背景，貼近台灣企業採購信任"
            description="對台灣 SME 來說，AI 導入必須兼顧預算、時程、維護責任與資料安全。北科大工程背景讓我們更適合用務實方式把 RAG 做進既有工作流程。"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {teamHighlights.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <item.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-black text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <PresenterCallout
            imageKey="about"
            label="品牌體驗"
            title="有人味的 AI 服務體驗"
            body="我們希望 AI 服務不只是冷冰冰的技術工具，而是由清楚的導入流程、可信任的顧問角色與穩定的系統設計組成。網站中的品牌顧問形象，代表 LINE101Chat 希望帶給客戶的溫度與專業感。"
            actionLabel="預約需求評估"
            actionHref="/contact"
          />
        </div>
      </section>
    </main>
  );
}
