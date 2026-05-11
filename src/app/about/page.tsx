import type { Metadata } from "next";

import { PresenterCallout } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

export const metadata: Metadata = {
  title: "關於 LINE101Chat｜北科大工程團隊打造企業 AI 知識助理",
  description:
    "LINE101Chat 由 NTUT（國立台北科技大學 / 北科大）工程背景團隊打造，專注於台灣中小企業可以實際落地的企業 AI 知識助理與 LINE 文件查詢。",
  alternates: { canonical: "/about" },
};

export function AboutContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const content = getSiteContent(locale);
  const about = content.pages.about;

  return (
    <main>
      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={about.heading.eyebrow}
            title={about.heading.title}
            description={about.heading.description}
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {about.values.map(([title, body]) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={about.teamHeading.eyebrow}
            title={about.teamHeading.title}
            description={about.teamHeading.description}
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {content.teamHighlights.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <item.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-black text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <PresenterCallout
            imageKey="about"
            label={about.callout.label}
            title={about.callout.title}
            body={about.callout.body}
            actionLabel={about.callout.actionLabel}
            actionHref={localizePath("/contact", locale)}
          />
        </div>
      </section>
    </main>
  );
}

export default function AboutPage() {
  return <AboutContent locale="zh" />;
}
