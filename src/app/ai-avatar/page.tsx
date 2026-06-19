import type { Metadata } from "next";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Handshake,
  Headphones,
  MessageCircle,
  MessagesSquare,
  Mic2,
  School,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: {
    absolute: "AI分身 for LINE｜讓你的 LINE 替你自然回覆",
  },
  description:
    "LINE101Chat 為台灣創辦人、顧問、老師、創作者與服務團隊打造可揭露身分、能轉真人的 LINE AI 分身。",
  alternates: { canonical: "/ai-avatar" },
  openGraph: {
    title: "AI分身 for LINE｜讓你的 LINE 替你自然回覆",
    description:
      "用你的服務內容、說話方式與常見問題，建立能在 LINE 回覆、蒐集需求並轉交真人的 AI 分身。",
    url: "/ai-avatar",
  },
};

type IconCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const audiences: IconCard[] = [
  {
    title: "創辦人與顧問",
    description: "先回答服務範圍、合作方式與常見問題，把需要本人判斷的對話留下來。",
    icon: BriefcaseBusiness,
  },
  {
    title: "老師與講師",
    description: "介紹課程、報名方式與教學理念，複雜個案再轉由老師親自回覆。",
    icon: GraduationCap,
  },
  {
    title: "創作者與個人品牌",
    description: "維持一致語氣介紹作品、合作方向與公開資訊，不假裝是真人本人。",
    icon: Mic2,
  },
  {
    title: "業務與客服團隊",
    description: "先做需求分流、FAQ 回覆與聯絡資訊蒐集，再交給適合的真人窗口。",
    icon: Headphones,
  },
  {
    title: "學校與辦公室",
    description: "回覆行政流程、活動、課程與公開規定，正式承諾仍由承辦人確認。",
    icon: School,
  },
  {
    title: "服務型團隊",
    description: "讓多位同仁共享一致的服務說法，減少重複回答與資訊落差。",
    icon: UsersRound,
  },
];

const capabilities: IconCard[] = [
  {
    title: "回答常見問題",
    description: "用整理過的 FAQ、網站內容與服務資料，先處理高頻、低風險問題。",
    icon: MessagesSquare,
  },
  {
    title: "自然介紹服務",
    description: "依擁有者設定的語氣，清楚說明服務特色、適合對象與下一步。",
    icon: Sparkles,
  },
  {
    title: "蒐集使用者需求",
    description: "詢問使用情境、預計時程與需要協助的範圍，讓真人接手更有效率。",
    icon: CheckCircle2,
  },
  {
    title: "模擬偏好語氣",
    description: "維持專業、溫暖或簡潔等品牌語調，但清楚表明自己是 AI 分身。",
    icon: UserRound,
  },
  {
    title: "需要時轉真人",
    description: "報價、合作、客製建置與正式承諾，自動引導至真人團隊確認。",
    icon: Handshake,
  },
  {
    title: "擴充專屬知識庫",
    description: "未來可加上 RAG，讓 AI 分身依正式文件回答並建立可維護的知識範圍。",
    icon: Bot,
  },
];

const whyLine101Chat = [
  ["LINE-native", "使用者不必下載新 App，直接在台灣最熟悉的 LINE 對話。"],
  ["繁體中文優先", "以台灣繁體中文、在地商務語感與常見服務情境設計。"],
  ["可接 RAG 知識庫", "從 FAQ MVP 開始，之後可擴充 PDF、SOP、規章與服務資料。"],
  ["可評估私有模型", "依資料敏感度評估 Ollama、本地端或私有環境，不把技術選型硬塞給客戶。"],
  ["有清楚身分界線", "AI 會在適當時機揭露身分，不假裝是真人或做未授權承諾。"],
  ["真人交接優先", "把 AI 當作前線助理，而不是取代關係、專業判斷與最後決策。"],
];

const flow = [
  ["1", "LINE 使用者", "使用熟悉的 LINE 傳送文字訊息"],
  ["2", "安全 Webhook", "驗證 LINE 簽章並接收事件"],
  ["3", "分身 Persona", "套用身分、語氣與回答邊界"],
  ["4", "LLM / RAG", "由模型或專屬知識庫產生回答"],
  ["5", "安全回覆", "簡潔回覆；不確定或高風險問題轉真人"],
];

export default function AiAvatarPage() {
  const qrUrl = process.env.NEXT_PUBLIC_LINE_AVATAR_QR_URL?.trim();
  const addFriendUrl =
    process.env.NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL?.trim();
  const primaryCtaUrl = addFriendUrl || "/contact";

  return (
    <main>
      <section className="overflow-hidden bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-lg border border-[#06c755]/30 bg-[#06c755]/10 px-4 py-2 text-sm font-black text-[#8df5ad]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              AI分身 for LINE
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl lg:text-6xl">
              讓你的 LINE
              <span className="block text-[#55e486]">替你自然回覆</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-300">
              用你的服務內容、常見問題與偏好語氣，建立一位能在 LINE
              介紹你、了解需求、回答基本問題，並在重要時刻轉交真人的 AI 分身。
            </p>
            <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-400">
              AI 分身會在適當時機清楚揭露身分，不冒充真人，也不替真人做未授權承諾。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={primaryCtaUrl}
                external={Boolean(addFriendUrl)}
                variant="line"
                icon={MessageCircle}
              >
                加入 LINE 試用 AI 分身
              </ButtonLink>
              <ButtonLink href="/free-assessment" variant="secondary">
                預約免費評估
              </ButtonLink>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[430px]">
            <div className="rounded-[2rem] border border-white/15 bg-slate-900 p-3 shadow-[0_32px_100px_rgba(0,0,0,0.45)]">
              <div className="rounded-[1.5rem] bg-[#eef6f2] p-4 text-slate-950">
                <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#06c755] text-white">
                    <Bot className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-black">LINE101Chat AI分身</p>
                    <p className="text-xs font-bold text-emerald-700">AI avatar · 可轉真人</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 text-sm leading-6">
                  <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-[#06c755] px-4 py-3 font-semibold text-white">
                    想了解你們能不能做一個像我本人語氣的 LINE 助理？
                  </div>
                  <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-slate-700 shadow-sm">
                    可以。我是 LINE101Chat 的 AI 分身，不是真人本人。我可以先協助整理你的
                    FAQ、服務內容與偏好語氣，再由真人團隊評估 LINE 串接與交接流程。
                  </div>
                  <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-[#06c755] px-4 py-3 font-semibold text-white">
                    那報價呢？
                  </div>
                  <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-slate-700 shadow-sm">
                    報價需要依資料量與功能範圍由真人確認。我可以先請你提供使用對象、常見問題數量與預計上線時間。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What It Is"
            title="不是複製一個真人，而是建立一個有邊界的數位助理"
            description="AI 分身把擁有者願意公開的內容、服務說法與溝通風格整理成可執行的 persona，讓 LINE 對話先被友善接住，再把重要決策交還真人。"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["有自己的說話方式", "依品牌或擁有者偏好設定專業、溫暖、簡潔等語氣。"],
              ["有清楚回答範圍", "只處理已授權的基本資訊，不知道時坦白說明。"],
              ["有真人交接出口", "報價、合作、個案與高風險問題不讓 AI 硬答。"],
            ].map(([title, description]) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <ShieldCheck className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-black text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Who It Is For"
            title="適合需要被認識，也需要保留真人關係的團隊"
            description="先讓 AI 分身處理重複、公開、可標準化的溝通；真正需要經驗、信任與承諾的部分，再由本人或團隊接手。"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-black text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Capabilities"
            title="MVP 先做好六件真正有用的事"
            description="不先追求複雜動畫或數位人外觀，而是先讓 LINE 裡的回覆品質、身分界線與真人交接流程可以實際測試。"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#06c755]/10 text-[#06c755]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-lg font-black text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Why LINE101Chat"
            title="從台灣 LINE 使用情境出發，不只是一段角色提示詞"
            description="我們把 AI 分身視為一個需要內容、邊界、交接與後續維護的服務流程，並保留未來擴充 RAG 與私有模型的空間。"
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {whyLine101Chat.map(([title, description]) => (
              <div key={title} className="flex gap-3 rounded-lg border border-emerald-200 bg-white p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <div>
                  <h2 className="font-black text-slate-950">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="How It Works"
            title="從 LINE 訊息到安全回覆"
            description="技術流程保持簡單、模組化，方便未來加入長期記憶、CRM、語音或動畫分身。"
          />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {flow.map(([number, title, description], index) => (
              <li key={title} className="relative rounded-lg border border-slate-200 bg-slate-50 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                  {number}
                </span>
                <h2 className="mt-4 font-black text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                {index < flow.length - 1 ? (
                  <ArrowRight
                    className="absolute -right-3 top-7 z-10 hidden h-5 w-5 text-emerald-500 lg:block"
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm font-bold leading-7 text-slate-500">
            LINE 使用者 → LINE webhook → persona prompt → LLM / RAG → 安全回覆 → 真人交接
          </p>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-300">Try The MVP</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              先用一個 LINE 情境，測試你的 AI 分身值不值得做
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              準備 20 個常見問題、一段服務介紹與你希望呈現的語氣。我們會協助確認回答範圍、真人交接與後續知識庫方向。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={primaryCtaUrl}
                external={Boolean(addFriendUrl)}
                variant="line"
                icon={MessageCircle}
              >
                加入 LINE 試用 AI 分身
              </ButtonLink>
              <ButtonLink href="/free-assessment" variant="secondary">
                預約免費評估
              </ButtonLink>
            </div>
          </div>

          <aside className="rounded-lg border border-white/15 bg-white p-5 text-slate-950 shadow-xl">
            <p className="text-sm font-black text-emerald-700">LINE AI分身 Demo</p>
            <div className="mt-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-emerald-100 bg-emerald-50">
              {qrUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrUrl}
                  alt="加入 LINE101Chat AI分身 Demo 的 QR Code"
                  className="h-full w-full object-contain p-3"
                />
              ) : (
                <div className="px-8 text-center">
                  <MessageCircle className="mx-auto h-12 w-12 text-[#06c755]" aria-hidden="true" />
                  <p className="mt-4 text-lg font-black">QR Code 準備中</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    設定公開環境變數後，這裡會顯示 AI 分身加入好友 QR Code。
                  </p>
                </div>
              )}
            </div>
            <ButtonLink
              href={primaryCtaUrl}
              external={Boolean(addFriendUrl)}
              variant="line"
              icon={MessageCircle}
              className="mt-4 w-full"
            >
              {addFriendUrl ? "直接加入好友" : "聯絡團隊取得 Demo"}
            </ButtonLink>
          </aside>
        </div>
      </section>
    </main>
  );
}
