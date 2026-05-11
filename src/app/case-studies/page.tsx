import type { Metadata } from "next";

import { CTASection, DemoCard } from "@/components/cards";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

export const metadata: Metadata = {
  title: "成功案例 / Demo｜LINE101Chat",
  description:
    "查看 LINE101Chat 的核心企業 AI 文件問答助理 Demo，以及可選配的 Indonesian ⇄ Traditional Chinese 翻譯模組 Demo。",
  alternates: { canonical: "/case-studies" },
};

export function CaseStudiesContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const content = getSiteContent(locale);
  const caseStudies = content.pages.caseStudies;

  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={caseStudies.heading.eyebrow}
            title={caseStudies.heading.title}
            description={caseStudies.heading.description}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {content.demoCases.map((demo) => (
              <DemoCard key={demo.title} {...demo} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {caseStudies.cards.map(([title, body]) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-black text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <CTASection
        title={caseStudies.cta.title}
        body={caseStudies.cta.body}
        label={caseStudies.cta.label}
        href={localizePath("/contact", locale)}
      />
    </main>
  );
}

export default function CaseStudiesPage() {
  return <CaseStudiesContent locale="zh" />;
}
