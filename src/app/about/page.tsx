import type { Metadata } from "next";

import { PresenterCallout } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "關於 LINE101Chat｜有人味的 AI 聊天助理服務",
  description:
    "LINE101Chat 專注於台灣中小企業、學校與組織可以實際落地的 AI 聊天助理，重視文件品質、資料安全、來源引用與可衡量的效率改善。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="關於我們"
            title="關於 LINE101Chat"
            description="LINE101Chat 專注於台灣中小企業、學校與組織可以實際落地的 AI 聊天助理。我們重視文件品質、資料安全、來源引用與可衡量的工作效率改善，而不是只做一個看起來會聊天的 AI。"
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
