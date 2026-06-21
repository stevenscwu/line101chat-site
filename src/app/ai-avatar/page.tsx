import type { Metadata } from "next";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  FileSearch,
  GraduationCap,
  Handshake,
  Headphones,
  HeartPulse,
  Home,
  MessageCircle,
  Mic2,
  Network,
  School,
  ShieldCheck,
  Sparkles,
  Store,
  UserRound,
  UsersRound,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AvatarDemoChat } from "@/components/avatar/AvatarDemoChat";
import { ButtonLink } from "@/components/button-link";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: {
    absolute: "AI分身 for LINE｜讓你的 LINE、網站與語音都能自然回覆",
  },
  description:
    "LINE101 Avatar 是為台灣 LINE-first 企業打造的知識型 AI分身平台，結合 persona、RAG、網站 chat、LINE chatbot、語音與真人交接。",
  alternates: { canonical: "/ai-avatar" },
  openGraph: {
    title: "LINE101 Avatar｜Knowledge-Grounded AI Avatar Platform",
    description:
      "讓個人、品牌、學校、顧問、門市或公司，用核准知識與語氣在 LINE、網站與語音中自然回覆。",
    url: "/ai-avatar",
  },
};

type IconCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const audiences: IconCard[] = [
  { title: "學校與系所", description: "招生、課程、活動與行政問答。", icon: School },
  { title: "顧問", description: "先介紹服務、理解需求，再交由本人接手。", icon: BriefcaseBusiness },
  { title: "老師", description: "回答課程與公開內容，保留老師的教學語氣。", icon: GraduationCap },
  { title: "診所", description: "處理一般服務資訊，高風險問題轉專業人員。", icon: HeartPulse },
  { title: "房仲", description: "物件與流程說明、需求初步分類。", icon: Home },
  { title: "零售門市", description: "商品、活動、營業與到店前問答。", icon: Store },
  { title: "客服團隊", description: "統一 FAQ 與服務說法，必要時轉真人。", icon: Headphones },
  { title: "創作者與 B2B", description: "建立可延伸到內容與商務的品牌分身。", icon: UsersRound },
];

const useCases = [
  "FAQ answering",
  "Service introduction",
  "Lead qualification",
  "Customer support",
  "Admissions inquiry",
  "Event inquiry",
  "Product explanation",
  "Internal knowledge assistant",
  "AI front desk / AI concierge",
];

const differentiators: IconCard[] = [
  { title: "有 persona", description: "有清楚角色、邊界與一致的回覆方式。", icon: UserRound },
  { title: "用擁有者的語氣", description: "依核准 tone of voice 回答，不是假裝成真人。", icon: Mic2 },
  { title: "根據可信知識", description: "先從 FAQ、PDF、網站與 SOP 找資料，再生成回答。", icon: FileSearch },
  { title: "跨 LINE、網站與語音", description: "同一個 AI brain 可延伸到不同互動入口。", icon: Network },
  { title: "能交接真人", description: "正式承諾、例外或高風險問題不硬答。", icon: Handshake },
];

const whyLine101Chat = [
  "LINE-first for Taiwan",
  "繁體中文與台灣商務語境優先",
  "RAG-grounded answers",
  "Google Drive／PDF／網站知識支援",
  "可評估 Ollama 本地／私有模型",
  "網站 + LINE + 語音擴充路線",
  "適合台灣 SME、學校與專業服務",
];

const flow = [
  ["1", "使用者提問", "從 LINE、網站或語音輸入問題"],
  ["2", "通道接收", "Webhook 或網站 API 安全接收訊息"],
  ["3", "Persona 判斷", "決定角色、語氣與回答邊界"],
  ["4", "RAG 檢索", "從核准知識找出可信片段"],
  ["5", "LLM 回答", "生成精簡、grounded 的回覆"],
  ["6", "回覆或交接", "直接回答，必要時轉真人團隊"],
];

export default function AiAvatarPage() {
  const qrUrl = process.env.NEXT_PUBLIC_LINE_AVATAR_QR_URL?.trim() || "";
  const addFriendUrl =
    process.env.NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL?.trim() || "";
  const lineCtaUrl = addFriendUrl || "/line";

  return (
    <main>
      <section className="overflow-hidden bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#06c755]/30 bg-[#06c755]/10 px-4 py-2 text-sm font-black text-[#8df5ad]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              LINE101 Avatar · LINE101 AI分身
            </p>
            <h1 className="mt-6 max-w-5xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              AI分身 for LINE
              <span className="block text-[#55e486]">
                讓你的 LINE、網站與語音都能自然回覆
              </span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-300">
              把一個人、品牌、學校、顧問、門市或公司的可信知識與說話方式，
              變成能在 LINE 與網站持續服務、收集需求並交接真人的 AI分身。
            </p>
            <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-400">
              Knowledge-grounded AI avatars for Taiwan’s LINE-first businesses.
              AI 會清楚揭露身分，不冒充真人。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="#avatar-demo" variant="line" icon={Bot}>
                立即試用 AI 分身
              </ButtonLink>
              <ButtonLink
                href={lineCtaUrl}
                external={Boolean(addFriendUrl)}
                variant="secondary"
                icon={MessageCircle}
              >
                加入 LINE 試用
              </ButtonLink>
              <ButtonLink href="/free-assessment" variant="secondary">
                預約免費評估
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/5 p-5 shadow-[0_32px_100px_rgba(0,0,0,0.45)] backdrop-blur sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-300">
                  One brain, many channels
                </p>
                <h2 className="mt-2 text-2xl font-black">知識型 AI分身架構</h2>
              </div>
              <Bot className="h-9 w-9 text-[#55e486]" aria-hidden="true" />
            </div>
            <div className="mt-6 grid gap-3">
              {[
                ["Knowledge Base", "FAQ · PDF · Website · Google Drive"],
                ["RAG + Persona", "可信知識 · 品牌語氣 · 安全邊界"],
                ["LLM Response", "Mock · Ollama · OpenAI-compatible"],
                ["Channels", "Website · LINE · Voice · Future Video"],
                ["Handoff", "Lead capture · Human follow-up"],
              ].map(([title, description], index) => (
                <div
                  key={title}
                  className="relative rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm font-black text-white">{title}</p>
                  <p className="mt-1 text-xs font-semibold leading-6 text-slate-400">
                    {description}
                  </p>
                  {index < 4 ? (
                    <ArrowRight
                      className="absolute -bottom-4 left-1/2 z-10 h-5 w-5 rotate-90 text-emerald-400"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 px-5 py-14 sm:px-8 lg:px-10">
        <blockquote className="mx-auto max-w-5xl text-center text-2xl font-black leading-relaxed text-slate-950 sm:text-3xl">
          “Use LINE as the wedge, RAG as the moat, and avatar as the
          investor-facing story.”
        </blockquote>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Not Just A Chatbot"
            title="不是換一個聊天視窗，而是替組織建立可控的 AI 代表"
            description="LINE101 AI分身把角色、知識、通道與真人交接放在同一套架構中。外觀可以變，但可信知識與服務流程才是核心。"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {differentiators.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <Icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-black text-slate-950">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Who It Is For"
            title="從學校、顧問到門市，先處理重複但重要的互動"
            description="AI分身適合知識明確、問題重複、又需要維持品牌語氣與真人關係的場景。"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <Icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-black text-slate-950">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow="Core Use Cases"
            title="一個 AI brain，服務不同前台與內部情境"
            description="先從一個高頻、資料清楚的問題場景開始，再逐步增加知識、角色與通道。"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <div
                key={useCase}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                <p className="text-sm font-black text-slate-800">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5faf7] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <AvatarDemoChat />
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="How It Works"
            title="從使用者提問，到有根據的回答與真人交接"
            description="LINE 與網站共用同一套 avatar engine，避免每個通道各自長出不同答案。"
          />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {flow.map(([number, title, description], index) => (
              <li
                key={title}
                className="relative rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                  {number}
                </span>
                <h2 className="mt-4 font-black text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
                {index < flow.length - 1 ? (
                  <ArrowRight
                    className="absolute -right-3 top-7 z-10 hidden h-5 w-5 text-emerald-500 xl:block"
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-emerald-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Why LINE101Chat"
            title="RAG 是智慧基礎，LINE 是台灣市場入口，AI分身是可擴張的產品故事"
            description="保留現有 LINE AI 知識助理能力，再向 persona、語音、內容與多客戶 avatar 平台延伸。"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {whyLine101Chat.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-xl border border-emerald-200 bg-white p-5"
              >
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                <p className="text-sm font-black leading-7 text-slate-800">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-300">
              Technical Credibility
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              MVP 已具備可驗證、可替換、可擴充的產品骨架
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
              本版使用本地 Markdown 知識、輕量檢索、persona prompt、model
              adapter 與 channel adapter。未來可把檢索替換成 embeddings／vector
              DB，也能加入多客戶 avatar 設定，不必重寫 LINE webhook。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["模型", "Mock / Ollama gemma4:26b / OpenAI-compatible"],
              ["知識", "Markdown MVP，可替換向量資料庫"],
              ["通道", "Website + LINE，Voice MVP"],
              ["安全", "LINE 簽章、AI 身分揭露、無 secrets logging"],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <h3 className="font-black text-emerald-300">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">
              下一步：影片型 AI 分身
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              先把同一套知識與 persona 變成短影音腳本
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              同一個 RAG／persona brain 可以生成 YouTube Shorts、Instagram、
              Threads、Facebook 與網站 hero video 的短腳本。MVP
              先服務行銷與投資人展示；即時影音 avatar 留在後續 roadmap。
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["AI分身 for LINE", "客戶在 LINE 問問題，不必再等人工。"],
              ["RAG-grounded answers", "先找 PDF、FAQ 與網站資料，再生成回答。"],
              ["Website + LINE + Voice", "同一個 AI分身，跨入口維持一致知識與語氣。"],
            ].map(([title, description], index) => (
              <article
                key={title}
                className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  {index === 0 ? (
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  ) : index === 1 ? (
                    <FileSearch className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Video className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <h3 className="font-black text-slate-950">{title}</h3>
                  <p className="mt-1 text-sm leading-7 text-slate-600">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">
              Start With One Avatar
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              用一個真實情境，驗證你的 AI分身 MVP
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              準備現有 FAQ、PDF、網站或 SOP，告訴我們要代表誰、回答什麼、希望先上
              LINE 還是網站。我們會一起縮小成可驗證的第一版。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="#avatar-demo" variant="line" icon={Bot}>
                立即試用 AI 分身
              </ButtonLink>
              <ButtonLink
                href={lineCtaUrl}
                external={Boolean(addFriendUrl)}
                variant="secondary"
                icon={MessageCircle}
              >
                加入 LINE 試用
              </ButtonLink>
              <ButtonLink href="/free-assessment" variant="dark">
                預約免費評估
              </ButtonLink>
            </div>
          </div>

          <aside className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-emerald-700">
              LINE AI分身 Demo
            </p>
            <div className="mt-4 flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-dashed border-emerald-300 bg-emerald-50">
              {qrUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrUrl}
                  alt="加入 LINE101Chat AI分身 Demo 的 QR Code"
                  className="h-full w-full object-contain p-3"
                />
              ) : (
                <div className="px-8 text-center">
                  <MessageCircle
                    className="mx-auto h-12 w-12 text-[#06c755]"
                    aria-hidden="true"
                  />
                  <p className="mt-4 text-lg font-black text-slate-950">
                    LINE QR Code
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    設定 NEXT_PUBLIC_LINE_AVATAR_QR_URL 後顯示。
                  </p>
                </div>
              )}
            </div>
            <ButtonLink
              href={lineCtaUrl}
              external={Boolean(addFriendUrl)}
              variant="line"
              icon={MessageCircle}
              className="mt-4 w-full"
            >
              加入 LINE 試用
            </ButtonLink>
          </aside>
        </div>
      </section>
    </main>
  );
}
