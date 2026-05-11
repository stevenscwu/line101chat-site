import type { Metadata } from "next";
import { CheckCircle2, FileText } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { PrintButton } from "@/components/print-button";
import { SectionHeading } from "@/components/section-heading";
import { getGrowthContent } from "@/data/growth";
import { localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

const zh = getGrowthContent("zh").checklist;

export const metadata: Metadata = {
  title: zh.metadata.title,
  description: zh.metadata.description,
  alternates: { canonical: "/document-readiness-checklist" },
};

export function DocumentReadinessChecklistContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const page = getGrowthContent(locale).checklist;

  return (
    <main>
      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow={page.eyebrow} title={page.title} description={page.description} />
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <PrintButton label={page.printLabel} />
            <ButtonLink href={localizePath("/book-demo", locale)} icon={FileText}>
              {page.bookLabel}
            </ButtonLink>
          </div>

          <div className="mt-10 grid gap-5">
            {page.sections.map((section) => (
              <section key={section.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-xl font-black text-slate-950">{section.title}</h2>
                <ul className="mt-4 grid gap-3">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-7 text-slate-700">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-700 px-5 py-12 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black leading-tight tracking-[0]">{page.leadTitle}</h2>
            <p className="mt-3 text-base leading-8 text-emerald-50">{page.leadBody}</p>
          </div>
          <ButtonLink href={localizePath("/book-demo", locale)} variant="secondary">
            {page.bookLabel}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}

export default function DocumentReadinessChecklistPage() {
  return <DocumentReadinessChecklistContent locale="zh" />;
}
