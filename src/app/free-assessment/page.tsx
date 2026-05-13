import type { Metadata } from "next";
import { CheckCircle2, FileText, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

const zh = getSiteContent("zh").pages.pricing;

export const metadata: Metadata = {
  title: zh.metadata.title,
  description: zh.metadata.description,
  alternates: { canonical: "/free-assessment" },
};

export function FreeAssessmentContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const content = getSiteContent(locale);
  const assessment = content.pages.pricing;

  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={assessment.heading.eyebrow}
            title={assessment.heading.title}
            description={assessment.heading.description}
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#assessment-form" icon={FileText}>
              {content.primaryCtas.assessment.label}
            </ButtonLink>
            <ButtonLink href={localizePath(content.primaryCtas.demo.href, locale)} variant="secondary">
              {content.primaryCtas.demo.label}
            </ButtonLink>
            <ButtonLink href={localizePath(content.primaryCtas.line.href, locale)} icon={MessageCircle} variant="line">
              {content.primaryCtas.line.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          {assessment.sections.map((section) => (
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
      </section>

      <section id="assessment-form" className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow={locale === "en" ? "Start Here" : "開始評估"}
            title={locale === "en" ? "Send your document situation first" : "先描述你的文件與問題"}
            description={
              locale === "en"
                ? "You can start without a full specification. Tell us what documents you have, how many pages, and who needs to search them."
                : "不用先準備完整規格。先告訴我們文件類型、大約頁數、誰會查詢，以及目前最常重複的問題。"
            }
          />
          <ContactForm locale={locale} />
        </div>
      </section>

      <section id="poc-pricing" className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-2xl font-black leading-tight text-slate-950">{assessment.pricingNote.title}</h2>
          <p className="mt-4 text-base leading-8 text-slate-700">{assessment.pricingNote.body}</p>
        </div>
      </section>
    </main>
  );
}

export default function FreeAssessmentPage() {
  return <FreeAssessmentContent locale="zh" />;
}
