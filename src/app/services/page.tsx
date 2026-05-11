import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { PricingCard } from "@/components/cards";
import { PresenterSideCard } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

export const metadata: Metadata = {
  title: "服務項目｜企業 AI 知識助理與 LINE 文件查詢",
  description:
    "了解 LINE101Chat 的企業 AI 知識助理、LINE 文件查詢、資料保密部署、SME Cloud RAG、Local / Private RAG 與翻譯選配模組。",
  alternates: { canonical: "/services" },
};

export function ServicesContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const content = getSiteContent(locale);
  const services = content.pages.services;

  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <SectionHeading
              eyebrow={services.hero.eyebrow}
              title={services.hero.title}
              description={services.hero.description}
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {services.bullets.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <p className="text-sm font-bold leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <PresenterSideCard quote={services.presenterQuote} />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={services.comparison.eyebrow}
            title={services.comparison.title}
            description={services.comparison.description}
          />
          <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  {services.comparison.headers.map((header) => (
                    <th key={header} className="p-4 font-black">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.comparison.rows.map(([item, rag, translation]) => (
                  <tr key={item} className="border-t border-slate-200">
                    <th className="w-44 bg-slate-50 p-4 font-black text-slate-900">{item}</th>
                    <td className="p-4 leading-7 text-slate-700">{rag}</td>
                    <td className="p-4 leading-7 text-slate-700">{translation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={services.plans.eyebrow}
            title={services.plans.title}
            description={services.plans.description}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {content.packages.map((item) => (
              <PricingCard
                key={item.title}
                name={item.title}
                price={item.price}
                summary={item.description}
                includes={item.items}
                highlighted={item.highlighted}
                recommendedLabel={content.labels.recommendedPoc}
                timelineLabel={content.labels.timeline}
                bestForLabel={content.labels.bestFor}
              />
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            {services.plans.noteBefore}{" "}
            <a className="font-black text-emerald-700" href={localizePath("/pricing", locale)}>
              {services.plans.noteLink}
            </a>
            {services.plans.noteAfter} {content.site.email} {services.plans.noteBook} {content.primaryCtas.demo.label}.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function ServicesPage() {
  return <ServicesContent locale="zh" />;
}
