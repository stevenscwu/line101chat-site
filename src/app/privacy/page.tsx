import type { Metadata } from "next";

import { getSiteContent } from "@/data/site";
import type { Locale } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy｜LINE101Chat",
  description: "LINE101Chat 隱私權政策，說明聯絡資料、客戶文件、LINE 訊息紀錄與資料刪除請求的處理方式。",
  alternates: { canonical: "/privacy" },
};

export function PrivacyContent({ locale = "zh" }: { locale?: Locale } = {}) {
  const privacy = getSiteContent(locale).pages.privacy;

  return (
    <main className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
      <article className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">{privacy.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black leading-tight tracking-[0] text-slate-950">
          {privacy.title}
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          {privacy.intro}
        </p>
        <div className="mt-8 grid gap-6">
          {privacy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-black text-slate-950">{section.title}</h2>
              <p className="mt-3 text-base leading-8 text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}

export default function PrivacyPage() {
  return <PrivacyContent locale="zh" />;
}
