import Image from "next/image";
import Link from "next/link";
import { Bot, FileSearch, MessageCircle } from "lucide-react";

import { localizePath, site, type Locale } from "@/data/site";

const guideCopy = {
  zh: {
    eyebrow: "QR Code 使用說明",
    title: "先試 Demo，再詢問導入",
    description:
      "這裡有兩個 LINE chatbot：北科大創新學院 Demo chatbot 用來試用公開文件 RAG 問答；LINE101Chat 商務詢問 chatbot 用來討論你的文件、免費評估與 PoC。",
    demoLabel: "試用北科大創新學院文件問答 Demo",
    demoPurpose: "試用 AI 文件問答 Demo，測試公開文件檢索、來源引用與 LINE 問答流程。",
    demoButton: "掃描 QR Code 試用",
    businessLabel: "詢問 LINE101Chat 服務",
    businessPurpose: "詢問 AI 知識助理、免費評估、PoC、文件準備與費用邏輯。",
    businessButton: "詢問 LINE101Chat 服務",
    assessmentButton: "預約免費評估",
    channelLabel: "Channel ID",
  },
  en: {
    eyebrow: "QR Code Guide",
    title: "Try the demo, then ask about implementation",
    description:
      "There are two LINE chatbots here: the NTUT demo chatbot is for testing public-document RAG Q&A; the LINE101Chat business chatbot is for discussing your documents, free assessment, and PoC.",
    demoLabel: "Try the NTUT iFIRST document Q&A demo",
    demoPurpose: "Try AI document Q&A with public document retrieval, source citations, and LINE chat flow.",
    demoButton: "Scan QR Code",
    businessLabel: "Ask About LINE101Chat Services",
    businessPurpose: "Ask about AI knowledge assistants, free assessment, PoCs, document preparation, and pricing logic.",
    businessButton: "Ask About Services",
    assessmentButton: "Book Free Assessment",
    channelLabel: "Channel ID",
  },
} satisfies Record<Locale, Record<string, string>>;

export function ChatbotQrGuide({ locale = "zh" }: { locale?: Locale }) {
  const content = guideCopy[locale];

  return (
    <section id="chatbot-qr-guide" className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">{content.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black leading-tight tracking-[0] text-slate-950">{content.title}</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">{content.description}</p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-32 shrink-0 rounded-lg border border-emerald-100 bg-white p-2">
                {/* TODO: Replace with an approved public iFIRST demo QR image if this asset changes. */}
                <Image
                  src={site.ntutDemoQrImage}
                  alt={content.demoLabel}
                  width={250}
                  height={250}
                  className="h-auto w-full"
                />
              </div>
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <FileSearch className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-black leading-tight text-slate-950">{content.demoLabel}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{content.demoPurpose}</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.08em] text-emerald-700">
                  {content.channelLabel} {site.ntutDemoLineChannelId}
                </p>
                {/* TODO: Add public LINE add-friend URL for channel 2007782998 when available. */}
                <div className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-800">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                  {content.demoButton}
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-32 shrink-0 rounded-lg border border-slate-200 bg-white p-2">
                {/* TODO: Replace with an approved public LINE101Chat business QR image if this asset changes. */}
                <Image
                  src={site.lineQrImage}
                  alt={content.businessLabel}
                  width={250}
                  height={250}
                  className="h-auto w-full"
                />
              </div>
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-black leading-tight text-slate-950">{content.businessLabel}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{content.businessPurpose}</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
                  {content.channelLabel} {site.businessLineChannelId}
                </p>
                {/* TODO: Replace /line with a public LINE add-friend URL for channel 2007691019 if direct add-friend linking is preferred. */}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={localizePath("/free-assessment", locale)}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700"
                  >
                    {content.assessmentButton}
                  </Link>
                  <Link
                    href={localizePath("/line", locale)}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-black text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {content.businessButton}
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
