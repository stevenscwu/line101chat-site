import { existsSync } from "fs";
import path from "path";

import Link from "next/link";
import { ArrowRight, FileSearch, MessageCircle, PlayCircle } from "lucide-react";

import { localizePath, type Locale } from "@/data/site";

const videoPublicPath = "/videos/ifirst-rag-demo.mp4";
const videoFilePath = path.join(process.cwd(), "public", "videos", "ifirst-rag-demo.mp4");

const copy = {
  zh: {
    eyebrow: "Promotion Video",
    title: "不只是學校 Demo，而是 AI 知識助理的可複製案例",
    subtitle:
      "北科大創新學院 iFIRST Demo 展示：正式文件、規章、表單與 FAQ 可以被整理成可在 LINE 查詢、能附來源的 AI 知識助理。相同方法也能套用到學校、SME、客服、HR、製造業 SOP 與內部制度。",
    placeholderTitle: "Demo 影片準備中",
    placeholderDescription:
      "目前可先透過 LINE 掃描 QR Code 試用北科大創新學院 AI 文件問答 Demo。正式影片上線後，將展示從文件檢索、LINE 提問、回答生成、來源引用到免費評估的完整流程。",
    videoTitle: "用公開文件建立 LINE AI 知識助理｜北科大創新學院 RAG Demo",
    demoButton: "線上試用 Demo",
    lineDemoButton: "試用 LINE Demo",
    businessLineButton: "詢問導入方式",
    assessmentButton: "預約免費評估",
    note: "先試 Demo 了解能力，再用 20-30 頁自己的文件做免費評估，確認是否適合進入 Starter PoC。",
  },
  en: {
    eyebrow: "Promotion Video",
    title: "Not just a school demo: a repeatable AI knowledge assistant case",
    subtitle:
      "The NTUT iFIRST demo shows how official documents, rules, forms, and FAQs can become a LINE-searchable AI knowledge assistant with source citations. The same approach can apply to schools, SMEs, support teams, HR, manufacturing SOPs, and internal policies.",
    placeholderTitle: "Demo video in production",
    placeholderDescription:
      "For now, scan the QR Code to try the NTUT iFIRST AI document Q&A demo in LINE. The video will show retrieval, LINE Q&A, answer generation, source citations, and the free assessment path.",
    videoTitle: "Build a LINE AI Knowledge Assistant from Public Documents | NTUT iFIRST RAG Demo",
    demoButton: "Try Web Demo",
    lineDemoButton: "Try LINE Demo",
    businessLineButton: "Ask About Implementation",
    assessmentButton: "Book Free Assessment",
    note: "Try the demo to understand the capability, then use 20-30 pages of your own documents for a free assessment before a Starter PoC.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function DemoVideoSection({ locale = "zh" }: { locale?: Locale }) {
  const content = copy[locale];
  const hasVideo = existsSync(videoFilePath);

  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              <FileSearch className="h-4 w-4" aria-hidden="true" />
              {content.eyebrow}
            </p>
            <h2 className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-[0] text-slate-950 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{content.subtitle}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-bold leading-7 text-slate-700">
            {content.note}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-sm">
          {hasVideo ? (
            <video className="aspect-video w-full bg-slate-950" controls preload="metadata">
              <source src={videoPublicPath} type="video/mp4" />
              {content.placeholderDescription}
            </video>
          ) : (
            <div className="flex aspect-video items-center justify-center px-6 py-10 text-center text-white">
              <div className="max-w-xl">
                <PlayCircle className="mx-auto h-14 w-14 text-emerald-300" aria-hidden="true" />
                <p className="mt-5 text-2xl font-black">{content.placeholderTitle}</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                  {content.placeholderDescription}
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/demo/ifirst-rag"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-black text-white hover:bg-emerald-600"
                  >
                    {content.demoButton}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  {/* TODO: Replace this anchor with a public LINE add-friend URL for channel 2007782998 when available. */}
                  <a
                    href="#chatbot-qr-guide"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-600 px-5 py-3 text-sm font-black text-slate-100 hover:border-emerald-300 hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {content.lineDemoButton}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={localizePath("/line", locale)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {content.businessLineButton}
          </Link>
          <Link
            href={localizePath("/free-assessment", locale)}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700"
          >
            {content.assessmentButton}
          </Link>
        </div>
      </div>
    </section>
  );
}
