import type { Metadata } from "next";

import { PricingCard } from "@/components/cards";
import { FAQSection } from "@/components/faq-section";
import { SectionHeading } from "@/components/section-heading";
import { deploymentOptions, pricingPlans, smeRolloutSchedule } from "@/data/site";

export const metadata: Metadata = {
  title: "價格方案｜LINE101Chat",
  description:
    "LINE101Chat 提供企業 AI 知識助理 Starter PoC、SME Cloud RAG、Local / Private RAG 與翻譯選配模組，適合台灣中小企業導入 LINE 文件查詢。",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="價格方案"
            title="符合台灣 SME 節奏的企業 AI 助理價格方案"
            description="先用小額 PoC 驗證 LINE 查詢體驗、來源引用與資料保密邊界，再決定正式導入、雲端代管或本地端私有化。翻譯 chatbot 不是主方案，而是可在 LINE 流程成熟後選配。"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-black text-slate-950">月維護費</h2>
            <p className="mt-3 text-base leading-8 text-slate-700">
              維護費依文件更新頻率、使用量、部署位置與整合複雜度而定。雲端代管通常從 NT$12,000-35,000 / 月起；本地端或私有雲因需維運、資安與效能調校，通常從 NT$35,000-90,000 / 月起。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="導入時程"
            title="從 30 分鐘評估到正式上線"
            description="台灣中小企業通常需要先看到可驗證成果，再逐步擴大預算與導入範圍。"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {smeRolloutSchedule.map((item) => (
              <article key={item.phase} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0] text-emerald-700">{item.phase}</p>
                <h2 className="mt-3 text-lg font-black text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm font-black text-slate-700">{item.duration}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="部署選擇"
            title="AI 助理可以雲端代管，也可以本地端 / 私有雲"
            description="部署方式會直接影響價格、時程、維護責任與資料安全邊界。"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {deploymentOptions.map((option) => (
              <article key={option.name} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
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
      <FAQSection />
    </main>
  );
}
