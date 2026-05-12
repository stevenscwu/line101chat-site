import type { Metadata } from "next";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

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
  const videoHeading =
    locale === "en"
      ? {
          eyebrow: "Demo Videos",
          title: "Two demo walkthroughs to support buyer trust",
          description:
            "The video slots are ready for the RAG assistant and translation module recordings. Until the public clips are uploaded, visitors can request the same walkthrough in a live demo.",
          videos: [
            ["NTUT iFIRST RAG chatbot demo", "Document retrieval, source citations, and LINE Q&A flow."],
            ["Indonesian ⇄ Traditional Chinese translation demo", "LINE text translation flow, usage records, and add-on positioning."],
          ],
          request: "Request walkthrough",
          caseStudy: "Read the NTUT case study",
        }
      : {
          eyebrow: "Demo 影片",
          title: "兩支 Demo 影片區塊，補強客戶信任",
          description:
            "RAG 文件問答與翻譯模組的影片位置已放上網站；正式公開影片上傳前，訪客可先預約同樣流程的 live demo。",
          videos: [
            ["北科大 iFIRST RAG chatbot demo", "文件檢索、來源引用與 LINE 問答流程。"],
            ["印尼文 ⇄ 繁中 translation chatbot demo", "LINE 文字翻譯流程、使用紀錄與選配定位。"],
          ],
          request: "預約 walkthrough",
          caseStudy: "閱讀北科大案例",
        };

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
            {content.demoCases.map((demo, index) => (
              <DemoCard
                key={demo.title}
                {...demo}
                actionHref={index === 0 ? "/demo/ifirst-rag" : undefined}
                actionLabel={index === 0 ? (locale === "en" ? "Try Demo Online" : "線上試用 Demo") : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={videoHeading.eyebrow}
            title={videoHeading.title}
            description={videoHeading.description}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {videoHeading.videos.map(([title, body]) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex aspect-video items-center justify-center rounded-lg border border-slate-200 bg-slate-950 text-white">
                  <div className="text-center">
                    <PlayCircle className="mx-auto h-12 w-12 text-emerald-300" aria-hidden="true" />
                    <p className="mt-3 text-sm font-black uppercase tracking-[0.08em] text-slate-300">Demo video</p>
                  </div>
                </div>
                <h2 className="mt-5 text-xl font-black text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
                <Link
                  href={localizePath("/book-demo", locale)}
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700"
                >
                  {videoHeading.request}
                </Link>
              </article>
            ))}
          </div>
          <Link
            href={localizePath("/case-studies/ntut-ifirst-rag", locale)}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
          >
            {videoHeading.caseStudy}
          </Link>
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
        href={localizePath("/book-demo", locale)}
      />
    </main>
  );
}

export default function CaseStudiesPage() {
  return <CaseStudiesContent locale="zh" />;
}
