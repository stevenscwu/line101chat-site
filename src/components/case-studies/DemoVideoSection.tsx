import { existsSync } from "fs";
import path from "path";

import Link from "next/link";
import { ArrowRight, FileSearch, MessageCircle, PlayCircle, ShieldCheck } from "lucide-react";

import { localizePath, type Locale } from "@/data/site";

const videoPublicPath = "/videos/ifirst-rag-demo.mp4";
const videoFilePath = path.join(process.cwd(), "public", "videos", "ifirst-rag-demo.mp4");

const copy = {
  zh: {
    eyebrow: "Video Demo",
    title: "北科大創新學院 iFIRST AI 文件問答 Demo",
    videoSubtitle: "用公開文件建立可在 LINE 查詢的 AI 知識助理",
    subtitle:
      "這個 Demo 使用公開文件建立，展示如何將法規、表單與修業資訊轉換成可在 LINE 查詢的 AI 知識助理。",
    placeholderTitle: "Demo 影片準備中",
    placeholderDescription: "目前可先透過 LINE 試用北科大創新學院 AI 文件問答 Demo。",
    videoTitle: "北科大創新學院 iFIRST AI 文件問答 Demo",
    qrGuideHint: "請見下方 QR Code 使用說明，Demo chatbot 與商務詢問帳號分開使用。",
    assessmentButton: "免費評估",
    serviceButton: "查看 AI 知識助理服務",
    businessLineButton: "加入 LINE 詢問",
    demoBoundaryTitle: "iFIRST Demo chatbot",
    demoBoundary: "用來試用公開文件 RAG Demo，測試文件問答與來源引用。",
    businessBoundaryTitle: "LINE101Chat 商務帳號",
    businessBoundary: "用來詢問 AI 知識助理服務、免費評估、PoC、文件準備與導入方式。",
    viewDemoQr: "查看 Demo QR Code",
    viewBusinessLine: "查看商務 LINE",
    disclaimer:
      "本 Demo 使用北科大創新前瞻科技學院公開資料建立，僅供技術展示與商業案例說明。正式規定仍以學校官方公告與辦公室回覆為準。",
  },
  en: {
    eyebrow: "Video Demo",
    title: "NTUT iFIRST AI Document Q&A Demo",
    videoSubtitle: "Build a LINE-searchable AI Knowledge Assistant from public documents",
    subtitle:
      "This demo uses public documents to show how rules, forms, and program information can become a LINE-searchable AI Knowledge Assistant.",
    placeholderTitle: "Demo video in production",
    placeholderDescription: "For now, try the NTUT iFIRST AI document Q&A demo through LINE.",
    videoTitle: "NTUT iFIRST AI Document Q&A Demo",
    qrGuideHint: "See the QR guide below. The demo chatbot and business inquiry account are separate.",
    assessmentButton: "Book Free Assessment",
    serviceButton: "View AI Knowledge Assistant",
    businessLineButton: "Ask on LINE",
    demoBoundaryTitle: "iFIRST demo chatbot",
    demoBoundary: "Use this to try the public-document RAG demo and test document Q&A with source citations.",
    businessBoundaryTitle: "LINE101Chat business account",
    businessBoundary:
      "Use this to ask about AI Knowledge Assistant services, free assessment, PoC scope, documents, and implementation.",
    viewDemoQr: "View Demo QR Code",
    viewBusinessLine: "View Business LINE",
    disclaimer:
      "This demo uses public information from NTUT iFIRST and is provided only for technical demonstration and business case-study purposes. Official rules should still be confirmed through school announcements and office replies.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function DemoVideoSection({ locale = "zh" }: { locale?: Locale }) {
  const content = copy[locale];
  const hasVideo = existsSync(videoFilePath);

  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:px-10" aria-labelledby="ifirst-demo-video-title">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              <FileSearch className="h-4 w-4" aria-hidden="true" />
              {content.eyebrow}
            </p>
            <h2
              id="ifirst-demo-video-title"
              className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-[0] text-slate-950 sm:text-4xl"
            >
              {content.title}
            </h2>
            <p className="mt-3 text-lg font-black leading-8 text-emerald-700">{content.videoSubtitle}</p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{content.subtitle}</p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm font-bold leading-7 text-slate-700">
            <ShieldCheck className="h-7 w-7 text-amber-700" aria-hidden="true" />
            <p className="mt-3">{content.disclaimer}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-sm">
          {hasVideo ? (
            <video
              aria-label={content.videoTitle}
              className="aspect-video w-full bg-slate-950"
              controls
              playsInline
              preload="metadata"
            >
              <source src={videoPublicPath} type="video/mp4" />
              {content.placeholderDescription}
            </video>
          ) : (
            <div className="flex aspect-video items-center justify-center bg-slate-950 px-6 py-10 text-center text-white">
              <div className="max-w-xl">
                <PlayCircle className="mx-auto h-14 w-14 text-emerald-300" aria-hidden="true" />
                <p className="mt-5 text-2xl font-black">{content.placeholderTitle}</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                  {content.placeholderDescription}
                </p>
                <p className="mt-4 text-xs font-bold leading-6 text-slate-400">{content.qrGuideHint}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-7 text-slate-700">
            <p className="font-black text-slate-950">{content.demoBoundaryTitle}</p>
            <p className="mt-1">{content.demoBoundary}</p>
            {/* TODO: Add an approved public LINE add-friend URL or QR image for the iFIRST demo chatbot when available. */}
            <a
              href="#chatbot-qr-guide"
              className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-black text-emerald-800 hover:text-emerald-700"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {content.viewDemoQr}
            </a>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            <p className="font-black text-slate-950">{content.businessBoundaryTitle}</p>
            <p className="mt-1">{content.businessBoundary}</p>
            {/* TODO: Replace /line with an approved public LINE add-friend URL for LINE101Chat service inquiries if available. */}
            <Link
              href={localizePath("/line", locale)}
              className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-black text-slate-800 hover:text-emerald-700"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {content.viewBusinessLine}
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={localizePath("/free-assessment", locale)}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700"
          >
            {content.assessmentButton}
          </Link>
          <Link
            href={localizePath("/rag-chatbot", locale)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
          >
            {content.serviceButton}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href={localizePath("/line", locale)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {content.businessLineButton}
          </Link>
        </div>
      </div>
    </section>
  );
}
