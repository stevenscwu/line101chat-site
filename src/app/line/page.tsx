import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Mail, MessageCircle } from "lucide-react";

import { getSiteContent, localizePath, site as baseSite } from "@/data/site";
import type { Locale } from "@/data/site";

export const metadata: Metadata = {
  title: "加入 LINE 詢問｜LINE101Chat",
  description: `掃描 LINE101Chat LINE 官方帳號 QR Code，或寄信至 ${baseSite.email} 洽詢企業 AI 知識助理。`,
  alternates: { canonical: "/line" },
};

export function LineContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const content = getSiteContent(locale);
  const line = content.pages.line;
  const { site } = content;
  const quickOptions =
    locale === "en"
      ? [
          "AI knowledge assistant",
          "LINE document Q&A",
          "Free document assessment",
          "Document preparation checklist",
        ]
      : ["AI 知識助理", "LINE 文件問答", "免費文件評估", "文件準備方式"];

  return (
    <main>
      <section className="bg-slate-950 px-5 py-8 text-white sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="inline-flex rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200">
              {line.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
              {line.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-300">
              {line.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={localizePath("/contact", locale)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-black text-white hover:bg-emerald-600"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {line.contactLabel}
              </Link>
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(line.subject)}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-600 px-5 py-3 text-sm font-black text-slate-100 hover:border-emerald-400 hover:text-white"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {site.email}
              </a>
            </div>
          </div>

          <div className="order-1 mx-auto w-full max-w-[340px] rounded-lg border border-white/10 bg-white p-4 shadow-2xl lg:order-2 lg:max-w-none lg:p-5">
            <Image
              src={site.lineQrImage}
              alt={line.qrAlt}
              width={612}
              height={612}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>
      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">
              {locale === "en" ? "What to ask in LINE" : "LINE 詢問選項"}
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-[0] text-slate-950">
              {locale === "en" ? "Start with one of four requests" : "可直接用四個選項開始"}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {locale === "en"
                ? "These match the recommended LINE Official Account auto-reply flow, so prospects can move from QR scan to a concrete consultation topic."
                : "這對應建議的 LINE 官方帳號自動回覆流程，讓訪客掃碼後可以直接進入明確諮詢主題。"}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickOptions.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <p className="text-sm font-bold leading-7 text-slate-700">
                  {index + 1}. {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LinePage() {
  return <LineContent locale="zh" />;
}
