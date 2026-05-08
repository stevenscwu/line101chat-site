import type { Metadata } from "next";

import { PricingCard } from "@/components/cards";
import { FAQSection } from "@/components/faq-section";
import { SectionHeading } from "@/components/section-heading";
import { pricingPlans } from "@/data/site";

export const metadata: Metadata = {
  title: "價格方案｜LINE101Chat",
  description:
    "LINE101Chat 提供免費需求評估、Starter PoC、Business Plan 與 Custom / Private Deployment，適合台灣中小企業與學校導入 AI 聊天助理。",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="價格方案"
            title="價格方案"
            description="價格會依文件量、整合方式、部署位置與維護需求調整。建議先從需求評估或 Starter PoC 開始，確認值得投入後再擴大。"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-4">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-black text-slate-950">月維護費</h2>
            <p className="mt-3 text-base leading-8 text-slate-700">
              維護費依文件更新頻率、使用量與整合複雜度而定，通常為 NT$10,000-60,000 / 月。
            </p>
          </div>
        </div>
      </section>
      <FAQSection />
    </main>
  );
}
