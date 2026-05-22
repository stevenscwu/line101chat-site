import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  FileQuestion,
  FileSearch,
  GraduationCap,
  Headphones,
  MapPin,
  MessageCircle,
  PlayCircle,
  QrCode,
  SearchCheck,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "開始了解 LINE101Chat｜台灣在地 LINE AI 知識助理",
  description:
    "LINE101Chat 社群入口：查看 LINE chatbot demo、案例、小型 PoC 預約、文件準備檢查表，以及 LINE101Chat 商務詢問入口。",
  alternates: { canonical: "/start" },
  openGraph: {
    title: "LINE101Chat｜台灣在地 LINE AI 知識助理",
    description:
      "把 FAQ、SOP、招生資料與服務文件變成可在 LINE 中即時回答的 AI 助理。先用一份文件做小型 PoC。",
    url: `${site.url}/start`,
    images: [{ url: "/social-launch/social-cover-square.svg", width: 1080, height: 1080 }],
  },
};

type LinkCard = {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "line";
};

type UseCase = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

const linkCards: LinkCard[] = [
  {
    title: "查看 LINE chatbot demo",
    description: "先看 iFIRST 文件問答如何把公開資料變成 LINE 中可查詢的 AI 知識助理。",
    href: "/demo/ifirst-rag",
    label: "線上試用 Demo",
    icon: PlayCircle,
    variant: "primary",
  },
  {
    title: "預約討論小型 PoC",
    description: "準備一份 FAQ、PDF 或 SOP，先評估一個明確場景是否適合導入。",
    href: "/book-demo",
    label: "預約討論",
    icon: CalendarDays,
    variant: "secondary",
  },
  {
    title: "加入 LINE 商務詢問",
    description: "詢問 LINE 自動客服、企業知識庫問答、文件 / SOP 查詢與 PoC 範圍。",
    href: "/line",
    label: "LINE 詢問服務",
    icon: MessageCircle,
    variant: "line",
  },
  {
    title: "查看案例與 demo 場景",
    description: "了解學校招生、企業客服、觀光旅遊、HR 與內部 SOP 的應用方向。",
    href: "/case-studies",
    label: "查看案例",
    icon: BookOpenCheck,
    variant: "secondary",
  },
  {
    title: "準備文件檢查表",
    description: "檢查你的 FAQ、PDF、SOP 是否適合做第一版 LINE AI 知識助理。",
    href: "/document-readiness-checklist",
    label: "檢查文件狀態",
    icon: FileSearch,
    variant: "secondary",
  },
];

const useCases: UseCase[] = [
  { title: "學校招生", detail: "招生簡章、報名流程、學費時程、家長與學生 FAQ。", icon: GraduationCap },
  { title: "企業客服", detail: "LINE 自動客服、服務流程、價格與交付說明。", icon: Headphones },
  { title: "內部 SOP", detail: "表單位置、作業流程、制度查詢與部門知識。", icon: FileQuestion },
  { title: "觀光旅遊", detail: "交通、票券、營業時間、雨天備案與旅客服務。", icon: MapPin },
  { title: "HR / 新人訓練", detail: "新人手冊、請假流程、系統帳號與常見制度。", icon: UsersRound },
];

export default function StartPage() {
  return (
    <main>
      <section className="bg-slate-950 px-5 py-14 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="inline-flex rounded-lg bg-emerald-400/15 px-3 py-1 text-sm font-black text-emerald-200">
              LINE101Chat social launch
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
              台灣在地 LINE AI 知識助理
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-semibold leading-9 text-slate-200">
              將 FAQ、SOP、招生資料、服務文件變成可在 LINE 中即時回答的 AI 助理。
              第一階段可以很小：一份文件、一個場景、一個 demo。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/demo/ifirst-rag" icon={PlayCircle}>
                查看 Demo
              </ButtonLink>
              <ButtonLink href="/book-demo" icon={CalendarDays} variant="secondary">
                預約討論
              </ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-emerald-300/30 bg-white shadow-2xl">
              <Image
                src="/presenter/host-main.png"
                alt="LINE101Chat presenter"
                fill
                priority
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-4 left-4 right-4 rounded-lg border border-emerald-200 bg-white p-4 text-sm font-black leading-7 text-slate-900 shadow-xl">
              準備一份 FAQ、PDF 或 SOP，就能開始評估 LINE chatbot demo。
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4">
            {linkCards.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:border-emerald-300 hover:bg-white hover:shadow-md sm:grid-cols-[56px_1fr_auto] sm:items-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <item.icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xl font-black leading-tight text-slate-950">{item.title}</span>
                  <span className="mt-2 block text-sm font-semibold leading-7 text-slate-600">
                    {item.description}
                  </span>
                </span>
                <span
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-black ${
                    item.variant === "line"
                      ? "bg-[#06c755] text-white"
                      : item.variant === "primary"
                        ? "bg-emerald-600 text-white"
                        : "border border-slate-300 bg-white text-slate-900"
                  }`}
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">Demo first</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950">
              適合先測試的五種情境
            </h2>
            <p className="mt-4 text-base font-semibold leading-8 text-slate-600">
              LINE101Chat 專注處理有文件、有標準答案、又經常被問的問題。先用小型 PoC 確認價值，再決定是否擴充。
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {useCases.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <item.icon className="h-7 w-7 text-emerald-700" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-black leading-tight text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          <article className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
            <QrCode className="h-8 w-8 text-emerald-700" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black text-slate-950">iFIRST 文件問答 Demo</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
              掃描 QR Code 或進入 demo 頁，查看文件如何變成可查詢的 LINE AI 知識助理。
            </p>
            <div className="mt-5 rounded-lg bg-white p-4">
              <Image
                src="/ntut-ifirst-demo-qr.png"
                alt="iFIRST 文件問答 Demo QR Code"
                width={250}
                height={250}
                className="mx-auto h-auto w-40"
              />
            </div>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <MessageCircle className="h-8 w-8 text-emerald-700" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black text-slate-950">LINE101Chat 商務詢問</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
              詢問 LINE 自動客服、企業知識庫問答、文件 / SOP 查詢與小型 PoC 導入。
            </p>
            <div className="mt-5 rounded-lg bg-white p-4">
              <Image
                src="/line101-business-qr.png"
                alt="LINE101Chat 商務詢問 QR Code"
                width={250}
                height={250}
                className="mx-auto h-auto w-40"
              />
            </div>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white">
            <SearchCheck className="h-8 w-8 text-emerald-300" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black">開始前請準備</h2>
            <ul className="mt-4 grid gap-3 text-sm font-semibold leading-7 text-slate-200">
              <li>一份 FAQ、PDF 或 SOP</li>
              <li>10 個最常被問的問題</li>
              <li>想先測試的單一場景</li>
              <li>誰可以確認答案是否正確</li>
            </ul>
            <ButtonLink href="/book-demo" className="mt-6" icon={CalendarDays}>
              預約討論
            </ButtonLink>
          </article>
        </div>
      </section>
    </main>
  );
}
