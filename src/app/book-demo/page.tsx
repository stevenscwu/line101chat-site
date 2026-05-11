import type { Metadata } from "next";
import { CalendarDays, CheckCircle2 } from "lucide-react";

import { BookDemoForm } from "@/components/book-demo-form";
import { SectionHeading } from "@/components/section-heading";
import { getGrowthContent } from "@/data/growth";
import type { Locale } from "@/data/site";

const zh = getGrowthContent("zh").bookDemo;

export const metadata: Metadata = {
  title: zh.metadata.title,
  description: zh.metadata.description,
  alternates: { canonical: "/book-demo" },
};

export function BookDemoContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const page = getGrowthContent(locale).bookDemo;

  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <SectionHeading eyebrow={page.eyebrow} title={page.title} description={page.description} />
            <div className="mt-8">
              <BookDemoForm locale={locale} />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
              <CalendarDays className="h-8 w-8 text-emerald-700" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black text-slate-950">{page.sideTitle}</h2>
              <ul className="mt-4 grid gap-3">
                {page.sideItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <ol className="grid gap-3">
                {page.flow.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm font-bold leading-6 text-slate-700">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default function BookDemoPage() {
  return <BookDemoContent locale="zh" />;
}
