import type { Metadata } from "next";
import { CheckCircle2, Languages } from "lucide-react";

import { PresenterCallout } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";
import { getSiteContent } from "@/data/site";
import type { Locale } from "@/data/site";

export const metadata: Metadata = {
  title: "翻譯選配模組｜LINE 印尼文繁體中文雙向翻譯",
  description:
    "LINE101Chat 翻譯選配模組支援 Indonesian ⇄ Traditional Chinese，可在企業 AI 知識助理或 LINE chatbot 上線後視需求加購。",
  alternates: { canonical: "/translation-chatbot" },
};

export function TranslationChatbotContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const translation = getSiteContent(locale).pages.translation;

  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="inline-flex rounded-lg bg-sky-50 px-4 py-2 text-sm font-black text-sky-700">
              {translation.hero.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[0] text-slate-950 sm:text-5xl">
              {translation.hero.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
              {translation.hero.description}
            </p>
          </div>
          <PresenterCallout
            imageKey="translation"
            label={translation.callout.label}
            title={translation.callout.title}
            body={translation.callout.body}
          />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionHeading
            eyebrow={translation.featuresHeading.eyebrow}
            title={translation.featuresHeading.title}
            description={translation.featuresHeading.description}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {translation.features.map((feature) => (
              <div key={feature} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <p className="text-sm font-bold leading-7 text-slate-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f0f9ff] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Languages className="h-10 w-10 text-sky-700" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[0] text-slate-950">
              {translation.demo.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {translation.demo.description}
            </p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4">
              {translation.demo.conversation.map((message, index) => (
                <div
                  key={`${message.speaker}-${index}`}
                  className={`max-w-[86%] rounded-lg px-4 py-3 ${
                    message.speaker === "User"
                      ? "justify-self-end bg-emerald-600 text-white"
                      : "justify-self-start bg-slate-100 text-slate-900"
                  }`}
                >
                  <p className="text-xs font-black opacity-80">{message.speaker}</p>
                  <p className="mt-1 text-base font-semibold leading-7">{message.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function TranslationChatbotPage() {
  return <TranslationChatbotContent locale="zh" />;
}
