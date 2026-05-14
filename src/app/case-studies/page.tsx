import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { CTASection, DemoCard } from "@/components/cards";
import { ChatbotQrGuide } from "@/components/case-studies/ChatbotQrGuide";
import { DemoVideoSection } from "@/components/case-studies/DemoVideoSection";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

export const metadata: Metadata = {
  title: "成功案例 / Demo｜LINE101Chat",
  description:
    "查看 LINE101Chat 的北科大 iFIRST AI 文件問答 Demo，了解如何用公開文件建立可查詢、可引用來源的 AI 知識助理。",
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
          <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            {content.demoCases.map((demo, index) => (
              <DemoCard
                key={demo.title}
                {...demo}
                actionHref={index === 0 ? "/demo/ifirst-rag" : undefined}
                actionLabel={index === 0 ? (locale === "en" ? "Try Demo Online" : "線上試用 Demo") : undefined}
              />
            ))}
            <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">
                {locale === "en" ? "What this demo proves" : "這個 Demo 對客戶代表什麼"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {locale === "en"
                  ? "The NTUT iFIRST demo is a proof of capability: official documents can become a source-grounded assistant that users can query in LINE or on the web."
                  : "北科大 iFIRST Demo 是能力證明：正式文件可以變成可在 LINE 或網站查詢、能附來源的 AI 知識助理。"}
              </p>
              <div className="mt-5 grid gap-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4 sm:grid-cols-[132px_1fr] sm:items-center lg:grid-cols-1 xl:grid-cols-[132px_1fr]">
                <div className="w-32 rounded-lg border border-emerald-100 bg-white p-2">
                  <Image
                    src={content.site.ntutDemoQrImage}
                    alt={locale === "en" ? "NTUT iFIRST demo chatbot QR Code" : "北科大創新學院文件問答 Demo chatbot QR Code"}
                    width={250}
                    height={250}
                    className="h-auto w-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-black leading-6 text-slate-950">
                    {locale === "en" ? "Try the NTUT iFIRST demo chatbot" : "試用北科大創新學院文件問答 Demo"}
                  </p>
                  <p className="mt-2 text-xs font-semibold leading-6 text-slate-600">
                    {locale === "en"
                      ? `This QR Code is for the NTUT iFIRST RAG demo only. Business inquiries use the separate LINE101Chat service account, channel ${content.site.businessLineChannelId}.`
                      : `此 QR Code 僅供北科大創新學院 RAG Demo 使用。LINE101Chat 服務詢問請使用另一個商務帳號，Channel ${content.site.businessLineChannelId}。`}
                  </p>
                  <div className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-black text-white">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {locale === "en"
                      ? `Demo channel ${content.site.ntutDemoLineChannelId}`
                      : `Demo Channel ${content.site.ntutDemoLineChannelId}`}
                  </div>
                </div>
              </div>
              <p className="mt-5 rounded-lg bg-slate-50 p-4 text-xs font-bold leading-6 text-slate-500">
                {caseStudies.secondaryNote}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href={localizePath(content.primaryCtas.assessment.href, locale)}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700"
                >
                  {locale === "en" ? "Book Free Assessment" : "預約免費評估"}
                </Link>
                <Link
                  href={localizePath(content.primaryCtas.line.href, locale)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {locale === "en" ? "Ask About Services" : "詢問導入方式"}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <DemoVideoSection locale={locale} />

      <ChatbotQrGuide locale={locale} />

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
        href={localizePath(content.primaryCtas.assessment.href, locale)}
      />
    </main>
  );
}

export default function CaseStudiesPage() {
  return <CaseStudiesContent locale="zh" />;
}
