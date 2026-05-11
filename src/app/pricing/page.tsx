import type { Metadata } from "next";

import { ButtonLink } from "@/components/button-link";
import { PricingCard } from "@/components/cards";
import { FAQSection } from "@/components/faq-section";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent } from "@/data/site";
import type { Locale } from "@/data/site";

export const metadata: Metadata = {
  title: "價格方案｜LINE101Chat",
  description:
    "LINE101Chat 提供企業 AI 知識助理 Starter PoC、SME Cloud RAG、Local / Private RAG 與翻譯選配模組，適合台灣中小企業導入 LINE 文件查詢。",
  alternates: { canonical: "/pricing" },
};

export function PricingContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const content = getSiteContent(locale);
  const pricing = content.pages.pricing;
  const pilot =
    locale === "en"
      ? {
          eyebrow: "Founding Customer Pilot",
          title: "First 90 days: smaller pilot for fast feedback",
          body: "For the first suitable customers, LINE101Chat can start with one use case, 20-30 pages, one LINE or web chatbot, and a 7-14 day validation window in exchange for clear feedback and a possible testimonial.",
          price: "Suggested pilot range: NT$30,000-50,000",
          label: "Discuss pilot fit",
        }
      : {
          eyebrow: "Founding Customer Pilot",
          title: "前 90 天：用小型 Pilot 快速換取回饋",
          body: "針對適合的第一批客戶，可先用 1 個場景、20-30 頁文件、1 個 LINE 或網站 chatbot，在 7-14 天內驗證可行性，並換取明確回饋或案例推薦。",
          price: "建議 pilot 範圍：NT$30,000-50,000",
          label: "討論是否適合 Pilot",
        };

  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={pricing.heading.eyebrow}
            title={pricing.heading.title}
            description={pricing.heading.description}
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {content.pricingPlans.map((plan) => (
              <PricingCard
                key={plan.name}
                {...plan}
                recommendedLabel={content.labels.recommendedPoc}
                timelineLabel={content.labels.timeline}
                bestForLabel={content.labels.bestFor}
              />
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-black text-slate-950">{pricing.maintenanceTitle}</h2>
            <p className="mt-3 text-base leading-8 text-slate-700">
              {pricing.maintenanceBody}
            </p>
          </div>
          <div className="mt-8 rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">{pilot.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950">{pilot.title}</h2>
            <p className="mt-3 text-base leading-8 text-slate-700">{pilot.body}</p>
            <p className="mt-4 text-sm font-black text-emerald-700">{pilot.price}</p>
            <ButtonLink href={locale === "en" ? "/en/book-demo" : "/book-demo"} className="mt-5">
              {pilot.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={pricing.scheduleHeading.eyebrow}
            title={pricing.scheduleHeading.title}
            description={pricing.scheduleHeading.description}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {content.smeRolloutSchedule.map((item) => (
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
            eyebrow={pricing.deploymentHeading.eyebrow}
            title={pricing.deploymentHeading.title}
            description={pricing.deploymentHeading.description}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {content.deploymentOptions.map((option) => (
              <article key={option.name} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-black text-slate-950">{option.name}</h2>
                <p className="mt-3 text-sm font-black text-emerald-700">{option.priceSignal}</p>
                <p className="mt-2 text-sm font-semibold text-slate-600">{option.timeline}</p>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-950">{content.labels.pros}</h3>
                    <ul className="mt-3 grid gap-2">
                      {option.pros.map((item) => (
                        <li key={item} className="text-sm leading-6 text-slate-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-950">{content.labels.cons}</h3>
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
      <FAQSection locale={locale} />
    </main>
  );
}

export default function PricingPage() {
  return <PricingContent locale="zh" />;
}
