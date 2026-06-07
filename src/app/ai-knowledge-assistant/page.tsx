import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Bot,
  Building2,
  CheckCircle2,
  FileText,
  FileSearch,
  Globe2,
  GraduationCap,
  Headphones,
  Mail,
  MessageCircle,
  Moon,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "LINE 招生 FAQ 知識助理 Pilot",
  description:
    "LINE101Chat 協助台灣補習班、課程單位與教育服務團隊，將招生 FAQ、課程資料與櫃台 SOP 變成可在 LINE 中回答的 AI 知識助理。",
  alternates: { canonical: "/ai-knowledge-assistant" },
};

type IconCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const painPoints: IconCard[] = [
  {
    title: "招生與課程問題每天重複出現",
    description: "開課時間、報名資格、費用、退費與試聽問題佔用櫃台與課程顧問時間。",
    icon: Headphones,
  },
  {
    title: "課程資訊散在網站、PDF 與 LINE 對話",
    description: "學生或家長找不到最新版資訊，最後還是回到 LINE 詢問真人。",
    icon: FileSearch,
  },
  {
    title: "課程顧問回答不一致",
    description: "不同同仁用不同說法回答相同問題，容易造成期待落差與後續爭議。",
    icon: UsersRound,
  },
  {
    title: "晚上與假日仍有報名詢問",
    description: "常見問題可以先由 LINE 知識助理回覆，真正有意願的名單再交給真人。",
    icon: Moon,
  },
];

const useCases: IconCard[] = [
  {
    title: "招生 / 報名 FAQ",
    description: "開課時程、報名資格、準備文件、試聽與入班流程。",
    icon: GraduationCap,
  },
  {
    title: "課程與費用說明",
    description: "課程差異、費用範圍、付款方式、優惠邊界與常見疑問。",
    icon: Building2,
  },
  {
    title: "課務與櫃台 SOP",
    description: "退費、補課、請假、教材領取與行政流程查詢。",
    icon: FileSearch,
  },
  {
    title: "真人顧問分流",
    description: "當使用者有報名意願或個別情況，收集聯絡方式交給真人跟進。",
    icon: UsersRound,
  },
];

const pocSteps = [
  ["Step 1", "提供 FAQ / PDF / SOP", "先選一個明確場景與一批可使用的正式文件。"],
  ["Step 2", "建立小型知識庫", "整理問題、文件段落與回答邊界，避免一開始範圍過大。"],
  ["Step 3", "接上 LINE 測試", "用使用者熟悉的 LINE 入口測試真實問法與回覆流程。"],
  ["Step 4", "評估準確率與商業價值", "檢查回答品質、可追查性、節省時間與後續維護方式。"],
];

const demoCards = [
  {
    title: "iFirst chatbot",
    badge: "可試用 Demo",
    description: "以公開文件展示招生、規章與表單資訊如何變成可查詢的文件問答助理。",
    href: "/demo/ifirst-rag",
    label: "試用 Demo",
  },
  {
    title: "Business chatbot",
    badge: "商務詢問",
    description: "用來詢問 LINE101Chat 服務範圍、文件盤點、PoC 規劃與導入方式。",
    href: "/line",
    label: "LINE 詢問",
  },
  {
    title: "Taipei101 chatbot",
    badge: "開發中",
    description: "規劃作為觀光與服務資訊情境展示，適合說明旅客 FAQ 與服務查詢流程。",
    href: "/case-studies",
    label: "查看案例",
  },
];

const preparationItems = [
  ["課程 FAQ", "把學生或家長最常問的 20-30 題整理成一份清單。", MessageCircle],
  ["招生簡章", "挑選最新版 PDF、網頁或說明文件，先確認內容可公開回答。", FileText],
  ["櫃台 SOP", "選一個常被問到的流程，例如退費、補課、請假或試聽。", FileSearch],
  ["網站 URL", "提供現有課程頁、報名頁、FAQ 或公告頁連結。", Globe2],
  ["真人窗口", "指定需要轉真人的問題與聯絡方式，避免 AI 勉強回答。", CheckCircle2],
] satisfies Array<[string, string, LucideIcon]>;

const pilotIncludes = [
  "20-30 頁 FAQ、招生簡章、課程頁或 SOP",
  "30 個真實測試問題",
  "LINE 或網站 Demo 入口",
  "有來源的繁體中文回答",
  "不確定問題轉真人",
  "一份測試結果與導入建議",
];

function IconCardGrid({ items }: { items: IconCard[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {items.map(({ title, description, icon: Icon }) => (
        <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-5 text-lg font-black leading-tight text-slate-950">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
        </article>
      ))}
    </div>
  );
}

export default function AiKnowledgeAssistantPage() {
  return (
    <main>
      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-lg bg-[#06c755]/15 px-3 py-1 text-sm font-black text-[#8df5ad]">
              LINE Enrollment FAQ Pilot
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl lg:text-6xl">
              把報名、課程與 FAQ 問題，變成 LINE 裡查得到的答案
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-200">
              LINE101Chat 幫台灣教育與課程團隊，用正式 FAQ、招生簡章、課程頁與櫃台 SOP 建立可測試的 LINE AI 知識助理。先做小型 Pilot，能回答就上線，不確定就轉真人。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#start-small-poc" variant="primary">
                免費檢查我的 FAQ
              </ButtonLink>
              <ButtonLink href="#pilot-offer" variant="line" icon={MessageCircle}>
                查看 Pilot 方案
              </ButtonLink>
              <ButtonLink href="/case-studies" variant="secondary">
                查看案例
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-3 text-sm font-bold leading-6 text-slate-300 sm:grid-cols-3">
              {["NT$38,000 試行價", "7-10 個工作天", "30 題測試問題"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#06c755]" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="relative mx-auto aspect-[4/5] max-w-[430px] overflow-hidden rounded-lg border border-white/15 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
              <Image
                src="/presenter/3.png"
                alt="LINE101Chat 顧問介紹台灣在地 LINE AI 知識助理"
                fill
                priority
                sizes="(min-width: 1024px) 430px, 86vw"
                className="object-cover object-top"
              />
            </div>
            <div className="mx-auto -mt-16 max-w-[390px] rounded-lg border border-emerald-200 bg-white p-4 text-sm font-bold leading-7 text-slate-800 shadow-xl">
              先用一份課程 FAQ 或招生簡章，測試 LINE AI 知識助理是否能真的減少重複詢問。
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Pain Points"
            title="學生和家長不是沒有問題，是每個問題都回到 LINE 找真人"
            description="對台灣課程與教育服務團隊來說，LINE 是最自然的招生入口；真正的瓶頸是問題重複、資訊分散、回答不一致。"
          />
          <div className="mt-8">
            <IconCardGrid items={painPoints} />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Start Small"
            title="先準備一份最常被問的招生資料"
            description="不用先整理完整系統規格。選一份學生、家長或櫃台最常查詢的內容，我們就能先判斷是否適合做成 LINE AI 知識助理。"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {preparationItems.map(([title, description, Icon]) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <Icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-lg border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">A Practical Promise</p>
          <h2 className="mt-3 max-w-5xl text-3xl font-black leading-tight tracking-[0] text-slate-950 sm:text-4xl">
            不是取代課程顧問，而是讓標準問題先被正確回答。
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
            開課時間、報名資格、試聽、費用範圍、退費規則等標準問題適合先由 AI 根據文件回答；個別狀況、價格談判與正式承諾仍交給真人。
          </p>
        </div>
      </section>

      <section id="pilot-offer" className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="MVP Offer"
              title="LINE Enrollment FAQ Pilot"
              description="給已經用 LINE 回覆招生、報名或課程問題的教育團隊。先用一個明確場景驗證，不先買大型系統。"
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Setup", "NT$38,000", "限第一批教育情境 Pilot"],
                ["Monthly", "NT$8,000-12,000", "Pilot 後維護與小幅更新"],
                ["Timeline", "7-10 個工作天", "文件清楚時可快速完成"],
              ].map(([label, value, detail]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.08em] text-emerald-700">{label}</p>
                  <p className="mt-3 text-2xl font-black leading-tight text-slate-950">{value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
            <h3 className="text-2xl font-black text-slate-950">包含項目</h3>
            <ul className="mt-5 grid gap-3">
              {pilotIncludes.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-semibold leading-7 text-slate-700">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg border border-amber-200 bg-white p-4">
              <p className="text-sm font-black text-slate-950">成功標準</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                30 題低風險測試問題中，至少 24 題能根據文件回答；不確定、個別承諾或高風險問題必須轉真人。
              </p>
            </div>
            <div className="mt-6">
              <ButtonLink href="#start-small-poc" variant="primary">
                申請 Pilot 評估
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Solution"
              title="把招生資料整理成 LINE 裡可查詢的回答"
              description="LINE101Chat 會先協助盤點課程 FAQ、招生簡章、報名流程與櫃台 SOP，再建立小型知識庫，讓 chatbot 根據整理過的內容回答。"
            />
            <p className="mt-5 text-base leading-8 text-slate-600">
              技術上可以理解為簡化版 RAG：AI 先找相關文件內容，再根據資料回答。對學生或家長來說，不需要學新系統，直接在熟悉的 LINE 提問；對課程團隊來說，重點是資料可更新、範圍可控、回答可追查。
            </p>
          </div>
          <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
            {[
              ["FAQ / SOP / PDF", "整理正式文件與常見問題"],
              ["知識庫", "建立可維護、可查詢的資料範圍"],
              ["LINE chatbot", "讓使用者在 LINE 直接提問"],
              ["來源與修正", "依測試結果更新文件與回答邊界"],
            ].map(([title, body]) => (
              <div key={title} className="flex gap-4 rounded-lg bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#06c755]/10 text-[#06c755]">
                  <Bot className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Use Cases"
            title="先從有文件、有標準答案的招生情境開始"
            description="先選一個清楚場景，讓團隊用真實問題測試回答品質，再決定是否擴充到更多課程、部門或服務流程。"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {useCases.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Demo"
            title="先看教育文件 Demo，再決定 Pilot 範圍"
            description="Demo 用來理解文件如何變成 LINE 裡的回答。正式導入仍會依每個課程單位的文件、權限與使用情境重新規劃。"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {demoCards.map((demo) => (
              <article key={demo.title} className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  {demo.badge}
                </span>
                <h3 className="mt-5 text-2xl font-black text-slate-950">{demo.title}</h3>
                <p className="mt-3 text-base leading-8 text-slate-600">{demo.description}</p>
                <Link
                  href={demo.href}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
                >
                  {demo.label}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="PoC Process"
            title="小型 Pilot 先驗證，降低導入風險"
            description="LINE101Chat 建議先從一份招生資料、一個課程場景、一組常見問題開始，確認真的有用，再投入正式導入。"
          />
          <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pocSteps.map(([step, title, body]) => (
              <li key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <span className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">{step}</span>
                <h3 className="mt-3 text-xl font-black leading-tight text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="start-small-poc" className="scroll-mt-24 bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <SectionHeading
              eyebrow="Free Check"
              title="免費檢查：你的招生 FAQ 適不適合做成 LINE AI 知識助理？"
              description="先描述課程類型、最常重複的問題與目前使用的 LINE 流程。我們會協助判斷資料是否適合做小型 Pilot，以及下一步應該先整理什麼。"
            />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
          <aside className="h-fit rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">LINE OA</p>
            <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950">也可以直接用 LINE 詢問</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              掃描商務帳號 QR Code，傳一份招生 FAQ、課程頁或 PDF 的情境說明，就可以先討論小型 Pilot。
            </p>
            <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <Image
                src={site.lineQrImage}
                alt="加入 LINE101Chat 商務詢問 LINE 官方帳號 QR Code"
                width={612}
                height={612}
                className="mx-auto h-auto w-full max-w-[240px]"
              />
            </div>
            <div className="mt-5 grid gap-3">
              <ButtonLink href={site.linePageUrl} variant="line" icon={MessageCircle}>
                LINE 詢問服務
              </ButtonLink>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {site.email}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-emerald-700 px-5 py-14 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-100">Next Step</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-[0] sm:text-4xl">
              準備一份招生 FAQ 或課程 PDF，我們可以先做小型 Pilot。
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-emerald-50">
              先確認文件品質、常見問題、LINE 使用情境與回答邊界，再決定是否正式導入。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink href="#start-small-poc" variant="secondary">
              免費檢查文件是否適合
            </ButtonLink>
            <ButtonLink href="/line" variant="dark" icon={MessageCircle}>
              LINE 詢問服務
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
