import type { Metadata } from "next";
import { ExternalLink, UserRoundCheck } from "lucide-react";

import { getSiteContent } from "@/data/site";
import type { Locale } from "@/data/site";

export const metadata: Metadata = {
  title: "私人信箱登入｜LINE101Chat",
  description: "LINE101Chat 私人信箱登入入口。",
  alternates: { canonical: "/feiz" },
  robots: {
    index: false,
    follow: false,
  },
};

export function FeizMailContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const content = getSiteContent(locale);
  const feiz = content.pages.feiz;
  const { site } = content;

  return (
    <main>
      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="inline-flex rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200">
              {feiz.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
              {feiz.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-300">
              {feiz.descriptionPrefix} {site.email}{feiz.descriptionSuffix}
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-black text-slate-200">{feiz.primaryLogin}</p>
            <a
              href={site.mailLoginUrl}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-black text-white hover:bg-emerald-600"
              target="_blank"
              rel="noreferrer"
            >
              {feiz.openZoho}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <UserRoundCheck className="h-8 w-8 text-emerald-600" aria-hidden="true" />
            <p className="mt-5 text-sm font-black uppercase tracking-[0] text-slate-500">{feiz.accountLabel}</p>
            <h2 className="mt-2 break-words text-xl font-black text-slate-950 sm:text-2xl">{site.email}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {feiz.purpose}
            </p>
            <a
              href={site.mailLoginUrl}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
              target="_blank"
              rel="noreferrer"
            >
              {feiz.useAccount}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>

          <div className="grid gap-4">
            {feiz.tips.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex gap-4">
                  <item.icon className="mt-1 h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function FeizMailPage() {
  return <FeizMailContent locale="zh" />;
}
