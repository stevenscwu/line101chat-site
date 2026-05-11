import type { Metadata } from "next";

import { CTASection } from "@/components/cards";
import { SectionHeading } from "@/components/section-heading";
import { getGrowthContent } from "@/data/growth";
import { localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

const zh = getGrowthContent("zh").ntutCaseStudy;

export const metadata: Metadata = {
  title: zh.metadata.title,
  description: zh.metadata.description,
  alternates: { canonical: "/case-studies/ntut-ifirst-rag" },
};

export function NtutIfirstRagCaseStudyContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const page = getGrowthContent(locale).ntutCaseStudy;

  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow={page.eyebrow} title={page.title} description={page.description} />
          <div className="mt-10 grid gap-5">
            {page.sections.map(([title, body]) => (
              <section key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">{title}</p>
                <p className="mt-3 text-base leading-8 text-slate-700">{body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
      <CTASection
        title={page.ctaTitle}
        body={page.ctaBody}
        href={localizePath("/book-demo", locale)}
        label={locale === "en" ? "Book a Demo" : "預約 Demo"}
      />
    </main>
  );
}

export default function NtutIfirstRagCaseStudyPage() {
  return <NtutIfirstRagCaseStudyContent locale="zh" />;
}
