import type { Metadata } from "next";
import Image from "next/image";
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
import { CelineChat } from "@/components/celine/CelineChat";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: {
    absolute: "Celine｜會記得你的 LINE 與網站 AI 對話夥伴",
  },
  description:
    "認識 Celine：一位具有年輕女性聊天風格、能延續對話記憶的 AI 角色，可透過 LINE 與網站自然互動。",
  alternates: { canonical: "/ai-avatar" },
  openGraph: {
    title: "Celine｜會記得你的 LINE 與網站 AI 對話夥伴",
    description:
      "和 Celine 聊日常、工作、學習與想法；她會清楚表明自己是 AI，並在你允許的範圍內延續對話脈絡。",
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
    description: "在忙碌時先接住日常對話、想法整理與基本詢問，需要本人判斷時再交接。",
    icon: BriefcaseBusiness,
  },
  {
    title: "老師與講師",
    description: "延續學生的學習脈絡、回答一般問題，也能陪使用者把問題問得更清楚。",
    icon: GraduationCap,
  },
  {
    title: "創作者與個人品牌",
    description: "建立有辨識度的 AI persona，分享公開資訊，也能成為作品之外的互動入口。",
    icon: Mic2,
  },
  {
    title: "業務與客服團隊",
    description: "商務詢問只是其中一種能力；Celine 也能先理解對方、記住脈絡，再自然分流。",
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
    title: "自然日常對話",
    description: "能聊工作、學習、生活與正在思考的事，不會每句話都導向產品或銷售。",
    icon: MessagesSquare,
  },
  {
    title: "記得每位使用者",
    description: "用去識別化 ID 保存有限的近期對話、稱呼與主動提供的偏好。",
    icon: Sparkles,
  },
  {
    title: "延續上次話題",
    description: "下一次見面時能接回相關脈絡，而不是每次都像第一次認識。",
    icon: CheckCircle2,
  },
  {
    title: "穩定的女性風格 persona",
    description: "溫暖、聰明、自然、有主見，像年輕女性聊天，但不假裝擁有真人身分。",
    icon: UserRound,
  },
  {
    title: "使用者可控制記憶",
    description: "可以詢問「你記得我什麼」，也能隨時輸入「忘記我」刪除對話記憶。",
    icon: Handshake,
  },
  {
    title: "必要時使用專業知識",
    description: "Celine 熟悉 LINE101Chat、AI 分身與 RAG，但只在話題相關時自然提供。",
    icon: Bot,
  },
];

const whyLine101Chat = [
  ["LINE-native", "使用者不必下載新 App，直接在台灣最熟悉的 LINE 對話。"],
  ["繁體中文優先", "以台灣繁體中文、自然聊天節奏與在地語感設計。"],
  ["有界線的對話記憶", "只保存有限脈絡，使用者可以查看摘要並要求刪除。"],
  ["可接 RAG 知識庫", "需要專業回答時，可擴充 PDF、SOP、規章與服務資料。"],
  ["可評估私有模型", "依資料敏感度評估 Ollama、本地端或私有環境，不把技術選型硬塞給客戶。"],
  ["有清楚身分界線", "Celine 會揭露自己是 AI，不編造真人年齡、身體或生活經驗。"],
];

const flow = [
  ["1", "LINE / 網站", "使用熟悉的入口傳送文字訊息"],
  ["2", "安全 Webhook", "驗證 LINE 簽章並接收事件"],
  ["3", "個人記憶", "用雜湊識別碼讀取有限對話脈絡"],
  ["4", "Celine Persona", "套用個性、語氣、身分與安全邊界"],
  ["5", "LLM / RAG", "由 Ollama、模型或專屬知識庫產生回答"],
  ["6", "自然回覆", "保存有限脈絡；不確定或高風險問題轉真人"],
];

export default function AiAvatarPage() {
  const qrUrl =
    process.env.NEXT_PUBLIC_LINE_AVATAR_QR_URL?.trim() ||
    "/celine-line-qr.png";
  const addFriendUrl =
    process.env.NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL?.trim() ||
    "https://line.me/R/ti/p/%40821jpehj";
  const primaryCtaUrl = addFriendUrl;

  return (
    <main>
      <section className="overflow-hidden bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-lg border border-[#06c755]/30 bg-[#06c755]/10 px-4 py-2 text-sm font-black text-[#8df5ad]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Meet Celine · AI分身 for LINE
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl lg:text-6xl">
              我是 Celine
              <span className="block text-[#55e486]">一位會記得你的 AI 對話夥伴</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-300">
              我能透過 LINE 和網站跟你自然聊天，記得你主動告訴我的稱呼與偏好，也能接續之前聊過的工作、學習與生活脈絡。
              LINE101Chat 的 AI 分身與 RAG 服務，是我熟悉的專業之一，不是每段對話的主角。
            </p>
            <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-400">
              Celine 是具有年輕女性溝通風格的 AI，不是真人。她不會編造真人身分、身體或親身經驗；你也能隨時查看或刪除記憶。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#talk-to-celine" variant="line" icon={MessagesSquare}>
                先在網站和 Celine 聊
              </ButtonLink>
              <ButtonLink
                href={primaryCtaUrl}
                external
                variant="secondary"
                icon={MessageCircle}
              >
                加入 LINE
              </ButtonLink>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[430px]">
            <div className="rounded-[2rem] border border-white/15 bg-slate-900 p-3 shadow-[0_32px_100px_rgba(0,0,0,0.45)]">
              <div className="rounded-[1.5rem] bg-[#eef6f2] p-4 text-slate-950">
                <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#06c755]">
                    <Image
                      src="/presenter/4.png"
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="font-black">Celine</p>
                    <p className="text-xs font-bold text-emerald-700">AI 對話角色 · 有記憶 · 不是真人</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 text-sm leading-6">
                  <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-[#06c755] px-4 py-3 font-semibold text-white">
                    嗨，我是 Mia。今天開會有點累。
                  </div>
                  <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-slate-700 shadow-sm">
                    嗨 Mia，我是 Celine，一位 AI。聽起來今天消耗不少——是會議太多，還是有一場特別難處理？
                  </div>
                  <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-[#06c755] px-4 py-3 font-semibold text-white">
                    下次你還會記得我嗎？
                  </div>
                  <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-slate-700 shadow-sm">
                    會，我會用去識別方式保存有限的近期脈絡和你主動告訴我的偏好。你也可以問我記得什麼，或隨時說「忘記我」。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5faf7] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Talk To Celine"
            title="現在就從網站開始一段對話"
            description="網站與 LINE 使用相同的 Celine persona、模型介面與記憶規則。網站以安全 Cookie 辨識這個瀏覽器；LINE 則使用雜湊後的使用者 ID。"
          />
          <div className="mt-8">
            <CelineChat />
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[320px_1fr] lg:items-center">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm">
            <Image
              src="/presenter/4.png"
              alt="Celine，LINE101Chat 的 AI 分身與商務知識助理視覺形象"
              fill
              sizes="(min-width: 1024px) 320px, 80vw"
              className="object-cover object-top"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Celine's Persona"
              title="像一位年輕女性自然聊天，但不假裝自己是真人"
              description="Celine 有穩定、可辨識的聲音：溫暖、聰明、好奇、有主見，偶爾帶點輕鬆幽默。同時，她會坦白自己是 AI。"
            />
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                ["她的個性", "溫暖、聰明、自然、有主見，會認真聽，也敢提出不同角度。"],
                ["她會記得", "近期對話、你主動告訴她的稱呼、興趣與偏好，而且只在相關時自然使用。"],
                ["她不會假裝", "不編造真人年齡、外貌、身體、私生活或親身經歷，也不冒充真人。"],
                ["她熟悉的專業", "日常想法整理之外，也熟悉 LINE AI 分身、知識助理、RAG 與本地 Ollama。"],
              ].map(([title, description]) => (
                <article key={title} className="rounded-lg border border-emerald-200 bg-white p-5">
                  <h2 className="font-black text-slate-950">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What It Is"
            title="Celine 是有個性、有記憶、跨 LINE 與網站的 AI persona"
            description="她先是一位能建立連續對話的 AI 角色；當話題真的涉及 AI 分身、知識庫或導入需求時，才會自然使用 LINE101Chat 的專業內容。"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["有自己的說話方式", "不是套一句「您好」，而是有穩定語感、好奇心與回應節奏。"],
              ["有可控制的記憶", "以去識別方式保存有限脈絡，並提供查看摘要與刪除指令。"],
              ["有清楚安全界線", "高風險專業判斷不硬答，也不鼓勵使用者把 AI 當成真人替代品。"],
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
            title="MVP 先把「認識一個人」這件事做好"
            description="外觀不是重點。真正讓 Celine 有連續感的，是穩定 persona、相關記憶、自然回覆，以及使用者能控制資料。"
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
            title="從台灣 LINE 使用情境出發，也保留本地模型與知識庫能力"
            description="Celine 本身不只是 LINE101Chat 的銷售角色；她同時示範一個 persona 如何擁有記憶、資料邊界，以及未來可擴充的專業知識。"
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
            title="從訊息、記憶到自然回覆"
            description="LINE 與網站共用同一個 persona、記憶介面與 LLM adapter，方便未來加入 RAG、語音或動畫分身。"
          />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
            LINE / Web 使用者 → 安全入口 → 去識別記憶 → Celine persona → Ollama / RAG → 自然回覆
          </p>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-300">Try The MVP</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              先認識 Celine，再決定你想把 AI persona 帶到哪裡
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              你可以直接在網站聊，也可以加入 LINE。若之後想為品牌、團隊或自己建立有記憶的 AI persona，再由 LINE101Chat 協助評估資料、模型與部署方式。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={primaryCtaUrl}
                external={Boolean(addFriendUrl)}
                variant="line"
                icon={MessageCircle}
              >
                加入 LINE 與 Celine 對話
              </ButtonLink>
              <ButtonLink href="/free-assessment" variant="secondary">
                預約免費評估
              </ButtonLink>
            </div>
          </div>

          <aside className="rounded-lg border border-white/15 bg-white p-5 text-slate-950 shadow-xl">
            <p className="text-sm font-black text-emerald-700">Celine LINE Demo</p>
            <div className="mt-4 flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-emerald-100 bg-emerald-50">
              {qrUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrUrl}
                  alt="加入 Celine LINE AI分身 Demo 的 QR Code"
                  className="h-full w-full object-contain p-3"
                />
              ) : (
                <div className="px-8 text-center">
                  <MessageCircle className="mx-auto h-12 w-12 text-[#06c755]" aria-hidden="true" />
                  <p className="mt-4 text-lg font-black">QR Code 準備中</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    設定公開環境變數後，這裡會顯示 Celine 的 LINE 加入好友 QR Code。
                  </p>
                </div>
              )}
            </div>
            <ButtonLink
              href={primaryCtaUrl}
              external
              variant="line"
              icon={MessageCircle}
              className="mt-4 w-full"
            >
              加入 Celine 好友
            </ButtonLink>
          </aside>
        </div>
      </section>
    </main>
  );
}
