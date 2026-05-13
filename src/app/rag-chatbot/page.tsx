import type { Metadata } from "next";
import { CheckCircle2, FileText, Quote } from "lucide-react";

import { DataReadinessScore } from "@/components/data-readiness-score";
import { PresenterCallout } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent } from "@/data/site";
import type { Locale } from "@/data/site";

export const metadata: Metadata = {
  title: "AI 知識助理｜LINE 文件問答、來源引用與部署評估",
  description:
    "LINE101Chat 企業 AI 知識助理可將 FAQ、SOP、規章、產品手冊與內部文件轉為 LINE 或網站 AI 問答助理，支援來源引用、資料保密邊界、雲端代管與本地端部署。",
  alternates: { canonical: "/rag-chatbot" },
};

export function RagChatbotContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const content = getSiteContent(locale);
  const rag = content.pages.rag;

  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="inline-flex rounded-lg bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              {rag.hero.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[0] text-slate-950 sm:text-5xl">
              {rag.hero.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
              {rag.hero.description}
            </p>
          </div>
          <PresenterCallout
            imageKey="rag"
            label={rag.callout.label}
            title={rag.callout.title}
            body={rag.callout.body}
          />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={rag.reasonsHeading.eyebrow}
            title={rag.reasonsHeading.title}
            description={rag.reasonsHeading.description}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {rag.reasons.map((reason) => (
              <div key={reason} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <p className="text-sm font-bold leading-7 text-slate-700">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={rag.useCasesHeading.eyebrow}
            title={rag.useCasesHeading.title}
            description={rag.useCasesHeading.description}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.ragUseCases.map((useCase) => (
              <article key={useCase} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <FileText className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-black text-slate-950">{useCase}</h2>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={rag.deploymentHeading.eyebrow}
            title={rag.deploymentHeading.title}
            description={rag.deploymentHeading.description}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {content.deploymentOptions.map((option) => (
              <article key={option.name} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-2xl font-black text-slate-950">{option.name}</h2>
                <p className="mt-3 text-sm font-black text-emerald-700">{option.priceSignal}</p>
                <p className="mt-2 text-sm font-semibold text-slate-600">{option.timeline}</p>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-950">{content.labels.pros}</h3>
                    <ul className="mt-3 grid gap-2">
                      {option.pros.map((item) => (
                        <li key={item} className="text-sm leading-6 text-slate-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-950">{content.labels.cons}</h3>
                    <ul className="mt-3 grid gap-2">
                      {option.cons.map((item) => (
                        <li key={item} className="text-sm leading-6 text-slate-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={rag.documentsHeading.eyebrow}
            title={rag.documentsHeading.title}
            description={rag.documentsHeading.description}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {content.acceptedFormats.map((format) => (
              <div key={format} className="rounded-lg border border-slate-200 bg-white p-4 text-center text-sm font-black text-slate-800 shadow-sm">
                {format}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <Quote className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              <p className="text-base font-bold leading-8 text-slate-800">
                {rag.quote}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={rag.readinessHeading.eyebrow}
            title={rag.readinessHeading.title}
            description={rag.readinessHeading.description}
          />
          <div className="mt-8">
            <DataReadinessScore locale={locale} />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={rag.scheduleHeading.eyebrow}
            title={rag.scheduleHeading.title}
            description={rag.scheduleHeading.description}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {content.smeRolloutSchedule.map((item) => (
              <article key={item.phase} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0] text-emerald-700">{item.phase}</p>
                <h2 className="mt-3 text-lg font-black text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm font-black text-slate-700">{item.duration}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function RagChatbotPage() {
  return <RagChatbotContent locale="zh" />;
}
