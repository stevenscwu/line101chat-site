import type { Metadata } from "next";
import Image from "next/image";
import {
  CheckCircle2,
  ChefHat,
  ClipboardCheck,
  Database,
  FileSearch,
  FileText,
  HelpCircle,
  KeyRound,
  LockKeyhole,
  MessageCircle,
  SearchCheck,
  ServerCog,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { PresenterCallout } from "@/components/presenter";
import { SectionHeading } from "@/components/section-heading";

const recipeQrImage = "/101recipe-chatbot-qr.png";

export const metadata: Metadata = {
  title: "101recipe LINE 食譜 PDF 查找助理｜授權通行碼與本機 RAG 案例",
  description:
    "101recipe 是一個 LINE 與網站雙入口的食譜 PDF 查找助理，使用通行碼、SQLite、Ollama 與本機食譜索引，讓授權使用者快速找到可下載的食譜檔案。",
  alternates: { canonical: "/case-studies/101recipe" },
};

const problemItems = [
  "食譜 PDF 與課程檔案散在資料夾裡，使用者很難靠記憶找到正確檔名",
  "LINE 上常出現簡短查詢，例如「叉燒」、「胡桃塔」或「Cheese cake」",
  "不同使用者可看的食譜範圍不同，不能把未授權檔名直接露出",
  "下載連結需要再次檢查登入狀態、通行碼有效期限與權限範圍",
  "本機資料與網站入口需要串起來，又不能把 LINE credentials 或 passcode 寫進前端",
];

const answerCards: Array<{ title: string; icon: LucideIcon }> = [
  { title: "Passcode Login", icon: KeyRound },
  { title: "Authorized PDF Search", icon: FileSearch },
  { title: "Filename-first Matching", icon: SearchCheck },
  { title: "Local Recipe Index", icon: Database },
  { title: "LINE Webhook", icon: MessageCircle },
  { title: "Website Proxy", icon: ServerCog },
  { title: "PDF Download Gate", icon: LockKeyhole },
  { title: "Access Logs", icon: ClipboardCheck },
];

const solutionCards: Array<{ title: string; icon: LucideIcon }> = [
  { title: "本機 recipes 資料夾", icon: FileText },
  { title: "SQLite 權限與紀錄", icon: ShieldCheck },
  { title: "Ollama 輔助判斷", icon: ServerCog },
  { title: "LINE / Web 雙入口", icon: Smartphone },
];

const exampleQuestions = [
  "叉燒",
  "起司蛋糕",
  "Cheese cake",
  "我要胡桃塔的 PDF",
  "有沒有水果三明治的食譜？",
  "南瓜濃湯無酒版",
  "檸檬餅乾",
];

const proofItems = [
  "通行碼以 bcrypt hash 儲存，前端只拿短期 session token",
  "每次 PDF 下載前都重新檢查 session、通行碼、到期日與 scope",
  "一般查詢採 filename-first deterministic search，降低語意搜尋漂移",
  "LINE 回覆只從授權候選檔案產生下載連結",
  "網站 `/101recipe` 透過 Vercel API routes proxy 到後端服務",
  "測試已覆蓋中文、英文、直接食譜名稱與無關結果防漂移情境",
];

const revenueItems = [
  "課程食譜授權查找",
  "付費會員資料庫",
  "LINE 售後支援",
  "內部文件庫 PoC",
  "小型教材下載平台",
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

export default function RecipeCaseStudyPage() {
  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="inline-flex rounded-lg bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              LINE 食譜案例 / 可試用 Demo
            </p>
            <p className="mt-5 text-sm font-black text-slate-500">
              101recipe Chatbot｜授權食譜 PDF 查找助理
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight tracking-[0] text-slate-950 sm:text-5xl">
              用 LINE 幫授權使用者快速找到正確食譜 PDF
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600">
              101recipe 是一個以食譜課程與 PDF 資料庫為情境的 LINE AI 助理。使用者先輸入通行碼，再用自然語言或食譜名稱查找檔案；系統只會從授權範圍內回傳可下載的 PDF。
            </p>
            <p className="mt-4 max-w-3xl text-sm font-bold leading-7 text-slate-500">
              此案例展示 LINE101Chat 如何把本機資料、權限控管、網站 proxy 與 LINE 對話串成可維護的小型知識服務。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/101recipe">開啟網站版</ButtonLink>
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
                <p className="mt-1 text-sm font-semibold text-slate-600">101recipe authorized PDF retrieval</p>
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-5 text-center">
              <div className="mx-auto w-44 rounded-lg border border-emerald-100 bg-white p-3 shadow-sm">
                <Image
                  src={recipeQrImage}
                  alt="101recipe LINE Chatbot QR Code"
                  width={180}
                  height={180}
                  className="h-auto w-full"
                />
              </div>
              <p className="mt-4 text-sm font-black text-slate-900">掃描加入 101recipe LINE Chatbot</p>
              <p className="mt-2 text-xs font-bold leading-6 text-slate-600">
                通行碼授權後，才能查找與下載可存取的食譜 PDF。
              </p>
              <ButtonLink href="/101recipe" variant="line" icon={ChefHat} className="mt-4">
                開啟網站版
              </ButtonLink>
            </div>
            <div className="mt-5 grid gap-3 rounded-lg bg-emerald-50 p-4">
              <div className="flex gap-3">
                <SearchCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                <p className="text-sm font-bold leading-7 text-slate-700">
                  Demo 重點是證明 LINE AI 助理也能處理「授權檔案查找」這類需要權限邊界的實用流程。
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading eyebrow="1. Problem" title="食譜資料越多，越需要可授權的查找入口" />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <CheckList items={problemItems} />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="2. Solution"
            title="把本機 PDF 索引、通行碼與 LINE 對話接成一個查找助理"
            description="101recipe 先同步本機 recipes 資料夾，將 PDF 檔名與必要 metadata 建立成可查詢索引。使用者通過 passcode 後，才能查找與下載授權範圍內的檔案。"
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
              title="這是一個權限控管比聊天更重要的 AI 助理案例"
              body="101recipe 不讓模型決定誰能下載檔案。AI 可以協助理解問題，但授權、候選檔案與下載連結都由 deterministic backend 檢查，適合教材、內部文件與會員資料庫情境。"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="3. What it handles"
            title="食譜查找助理需要處理的核心模組"
            description="這個案例把聊天入口、搜尋品質與授權下載拆開處理，避免 AI 回覆越界。"
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
            title="使用者可以這樣問"
            description="系統優先用檔名與食譜概念做穩定比對，避免單靠向量搜尋產生不相關結果。"
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
            description="101recipe 展示的是一個小型但完整的 LINE AI 知識服務流程："
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
                <ChefHat className="h-6 w-6 text-emerald-700" aria-hidden="true" />
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
                101recipe 是授權查找與下載流程展示。食譜內容、課程授權、會員資格與實際交付規則，仍應以服務提供者公告與約定為準；網站與 LINE 端不應公開 passcode、LINE credentials 或未授權檔案資訊。
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
              想把你的教材、會員資料或內部文件變成 LINE 授權查找助理？
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-emerald-50">
              從一組檔案、明確的使用者權限與 30-50 個真實查詢開始，就能評估 LINE AI 查找助理是否適合你的服務。
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
