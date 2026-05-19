import type { Metadata } from "next";
import Image from "next/image";
import {
  Bus,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileSearch,
  GraduationCap,
  HelpCircle,
  Home,
  Landmark,
  MessageCircle,
  Plane,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { PresenterCallout } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";

const taipei101LineId = "@138hrqii";
const taipei101LineChannelId = "2007764825";
const taipei101LineAddFriendUrl = "https://line.me/R/ti/p/%40138hrqii";
const taipei101QrImage = "/taipei101-chatbot-qr.png";

export const metadata: Metadata = {
  title: "Taipei101 Chatbot｜台北留學生報到生活 AI 助理",
  description:
    "Taipei101 Chatbot 是一個微型商業案例 / 開發中 Demo，展示一人台北服務如何用 RAG-enabled LINE chatbot 回答外籍生與交換生的報到生活問題。",
  alternates: { canonical: "/case-studies/taipei101" },
};

const problemItems = [
  "報到流程不清楚",
  "機場到學校路線不熟",
  "ARC、健保、住宿、手機、銀行資訊分散",
  "學校行政與學生社群常被問重複問題",
  "很多資訊其實已經存在官方網站，但不容易被快速找到",
];

const answerCards: Array<{ title: string; icon: LucideIcon }> = [
  { title: "Before Arrival", icon: Plane },
  { title: "Enrollment / Registration", icon: ClipboardCheck },
  { title: "Visa / ARC / Insurance", icon: ShieldCheck },
  { title: "Housing / Daily Life", icon: Home },
  { title: "Transportation", icon: Bus },
  { title: "SIM Card / Bank Account", icon: Smartphone },
  { title: "Human Help", icon: UsersRound },
];

const solutionCards: Array<{ title: string; icon: LucideIcon }> = [
  { title: "官方頁面", icon: FileSearch },
  { title: "學校文件", icon: GraduationCap },
  { title: "在地指南", icon: Landmark },
  { title: "LINE 問答", icon: MessageCircle },
];

const exampleQuestions = [
  "What should I do after arriving at Taoyuan Airport?",
  "How do I get from Taoyuan Airport to NTUT?",
  "What documents should I bring for enrollment?",
  "Where can I buy a SIM card?",
  "Do I need ARC?",
  "What is EasyCard?",
  "Where is the international office?",
];

const proofItems = [
  "將公開資料與整理過的文件變成知識庫",
  "用 LINE 作為自然入口",
  "回答時提供來源依據",
  "遇到不確定或個人化問題時轉交人工協助",
  "一人也可以管理大量重複詢問",
];

const revenueItems = [
  "免費 LINE 問答",
  "付費抵達台北 checklist",
  "30 分鐘線上諮詢",
  "60 分鐘抵達規劃",
  "學校 / 社團客製 AI 問答 PoC",
];

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm font-semibold leading-7 text-slate-700">
          <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function IconCard({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-black leading-tight text-slate-950">{title}</h3>
    </article>
  );
}

export default function Taipei101CaseStudyPage() {
  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="inline-flex rounded-lg bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              微型商業案例 / 開發中 Demo
            </p>
            <p className="mt-5 text-sm font-black text-slate-500">
              Taipei101 Chatbot｜台北留學生報到生活 AI 助理
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight tracking-[0] text-slate-950 sm:text-5xl">
              用 LINE 幫新生快速搞懂台北報到與生活大小事
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
              Taipei101 Chatbot 是一個以外籍生與交換生為對象的 AI 知識助理 Demo，展示如何將官方資訊、學校文件與在地生活指南整理成可在 LINE 查詢的問答服務。
            </p>
            <p className="mt-4 max-w-3xl text-sm font-bold leading-7 text-slate-500">
              此案例用來展示 LINE101Chat 的導入方式，不是 LINE101Chat 主服務本身。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/free-assessment">預約免費評估</ButtonLink>
              <ButtonLink href="/case-studies" variant="secondary">
                回到成功案例
              </ButtonLink>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#06c755]/10 text-[#06c755]">
                <MessageCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-950">LINE Demo Entry</h2>
                <p className="mt-1 text-sm font-semibold text-slate-600">Taipei student arrival Q&A</p>
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-5 text-center">
              <div className="mx-auto w-44 rounded-lg border border-emerald-100 bg-white p-3 shadow-sm">
                <Image
                  src={taipei101QrImage}
                  alt="Taipei101 Chatbot LINE QR Code"
                  width={180}
                  height={180}
                  className="h-auto w-full"
                />
              </div>
              <p className="mt-4 text-sm font-black text-slate-900">掃描加入 Taipei101 Chatbot</p>
              <p className="mt-2 text-xs font-bold leading-6 text-slate-600">
                LINE ID {taipei101LineId}｜Demo Channel {taipei101LineChannelId}
              </p>
              <ButtonLink
                href={taipei101LineAddFriendUrl}
                variant="line"
                icon={MessageCircle}
                external
                className="mt-4"
              >
                加入 LINE 試用
              </ButtonLink>
            </div>
            <div className="mt-5 grid gap-3 rounded-lg bg-emerald-50 p-4">
              <div className="flex gap-3">
                <SearchCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                <p className="text-sm font-bold leading-7 text-slate-700">
                  Demo 重點是證明 RAG-enabled LINE AI Knowledge Assistant 可用於真實台北情境。
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading eyebrow="1. Problem" title="外籍生剛到台北，常常不知道該問誰" />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <CheckList items={problemItems} />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="2. Solution"
            title="把官方資訊與生活指南變成 LINE AI 助理"
            description="Taipei101 Chatbot 透過 RAG 文件問答方式，讓學生用 LINE 詢問問題。系統會優先從官方頁面與整理過的指南中找資料，再產生簡潔回答。"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {solutionCards.map(({ title, icon: Icon }) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <PresenterCallout
              imageKey="rag"
              label="Demo Note"
              title="這不是主服務，而是一個可複製的微型案例"
              body="Taipei101 Chatbot 用留學生抵達台北的高頻問題，展示 LINE101Chat 如何把資料整理、檢索、回答與人工轉接做成一個可理解的 AI 知識助理流程。"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="3. What it can answer"
            title="可以先回答哪些主題"
            description="學生抵達前後最常遇到的問題，可以先被整理成可查詢的主題。"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {answerCards.map((card) => (
              <IconCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="4. Example questions"
            title="學生可以這樣問"
            description="外籍生可以用自然英文問題詢問，系統再從文件與指南中找出可回答的內容。"
          />
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {exampleQuestions.map((question) => (
              <div key={question} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <HelpCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                <p className="text-sm font-bold leading-7 text-slate-700">{question}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="5. Why this demonstrates LINE101Chat"
            title="為什麼這能代表 LINE101Chat"
            description="這個 Demo 展示了 LINE101Chat 的核心能力："
          />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <CheckList items={proofItems} />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="6. Small-profit model" title="微型服務如何產生小額收入" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {revenueItems.map((item) => (
              <article key={item} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <CreditCard className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <h3 className="mt-4 text-base font-black leading-7 text-slate-950">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="7. Disclaimer" title="Demo 用途與資訊邊界" />
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-amber-700" aria-hidden="true" />
              <p className="text-sm font-bold leading-7 text-slate-800">
                Taipei101 Chatbot 不是官方學校或政府服務。簽證、ARC、健保、入學與學籍相關事項，仍應以學校、政府機關與官方公告為準。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-700 px-5 py-12 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black text-emerald-100">8. CTA</p>
            <h2 className="text-3xl font-black leading-tight tracking-[0]">
              想為你的學校、社群或公司建立類似的 AI 知識助理？
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-emerald-50">
              從一組常見問題與 20-40 頁正式文件開始，就能判斷 LINE AI 知識助理是否值得進入 PoC。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
            <ButtonLink href="/free-assessment" variant="secondary">
              預約免費評估
            </ButtonLink>
            <ButtonLink href="/case-studies" variant="dark">
              回到成功案例
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
