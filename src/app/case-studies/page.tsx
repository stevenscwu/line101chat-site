import type { Metadata } from "next";

import { CTASection, DemoCard } from "@/components/cards";
import { SectionHeading } from "@/components/section-heading";
import { demoCases } from "@/data/site";

export const metadata: Metadata = {
  title: "成功案例 / Demo｜LINE101Chat",
  description:
    "查看 LINE101Chat 的核心 RAG 文件問答助理 Demo，以及可加購的 Indonesian ⇄ Traditional Chinese 翻譯加值服務 Demo。",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="成功案例 / Demo"
            title="成功案例 / Demo"
            description="目前展示重點是文件來源導向的 RAG 問答助理；LINE 裡的印尼文繁體中文翻譯則作為加值服務 Demo。"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {demoCases.map((demo) => (
              <DemoCard key={demo.title} {...demo} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            ["PoC 重點", "先選一個可衡量的場景，例如招生 FAQ、SOP 查詢或跨語言溝通。"],
            ["驗證方式", "使用真實問題測試 RAG 回答準確度、來源引用、LINE 使用體驗與維護流程。"],
            ["下一步", "若 RAG PoC 成效明確，再擴充文件、使用者、權限、雲端或本地端部署。"],
          ].map(([title, body]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-black text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <CTASection
        title="想用你的文件做第一個 Demo？"
        body="準備一份乾淨文件與真實問題，我們可以協助判斷是否適合做 RAG Starter PoC。"
        label="取得 RAG PoC 評估"
      />
    </main>
  );
}
