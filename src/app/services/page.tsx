import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { PresenterSideCard } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

export const metadata: Metadata = {
  title: "服務說明｜企業 AI 知識助理與 LINE 文件問答",
  description:
    "了解 LINE101Chat 如何協助台灣中小企業、學校與組織，把 FAQ、SOP、規章、產品手冊與內部文件導入成可引用來源的 AI 知識助理。",
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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.sections.map((section) => (
              <article key={section.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-xl font-black text-slate-950">{section.title}</h2>
                <ul className="mt-4 grid gap-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-7 text-slate-700">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-black text-slate-950">{services.optionalModule.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">{services.optionalModule.body}</p>
          </div>

          <ButtonLink href={localizePath(content.primaryCtas.assessment.href, locale)} className="mt-8">
            {content.primaryCtas.assessment.label}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}

export default function ServicesPage() {
  return <ServicesContent locale="zh" />;
}
