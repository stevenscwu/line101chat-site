import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "LINE101Chat 費用 | LINE 招生 FAQ Pilot",
  description:
    "LINE101Chat 給台灣教育團隊的 LINE 招生 FAQ Pilot 費用，協助將招生 FAQ、課程頁與 SOP 變成有來源的 LINE AI 知識助理。",
  alternates: { canonical: "/pricing" },
};

const pilotIncludes = [
  "一個招生、課程或櫃台 FAQ 使用情境",
  "20-30 頁 FAQ、課程頁、PDF 或 SOP",
  "30 題與客戶確認過的真實測試問題",
  "LINE 或網站 Demo 入口",
  "有來源線索的繁體中文回答",
  "不確定或高風險問題的人工作業交接文案",
  "一份測試報告與正式導入建議",
];

const exclusions = [
  "不提供法律、醫療、移民、金融或正式學籍決策等受管制建議",
  "不處理敏感個資、付款資料、密碼或學生私人文件",
  "Pilot 不包含完整 CRM 串接、多分校上線或 24/7 正式 SLA",
  "不保證 AI 100% 正確；Pilot 衡量的是流程品質、文件品質與回答邊界",
];

const packages = [
  {
    name: "LINE Enrollment FAQ Pilot",
    price: "NT$38,000",
    timeline: "7-10 個工作天",
    bestFor: "已經用 LINE 回覆招生、報名或課程問題的補習班、課程單位與教育服務團隊",
    highlighted: true,
    items: [
      "最小可銷售 Pilot",
      "30 題核准測試問題",
      "潛在學生 / 家長轉真人流程",
      "Pilot 報告與下一步建議",
    ],
  },
  {
    name: "Pilot 後維護",
    price: "NT$8,000-12,000 / 月",
    timeline: "Pilot 後",
    bestFor: "需要每月小幅更新、問題回顧與回答品質檢查的團隊",
    highlighted: false,
    items: ["小幅 FAQ 更新", "每月問題回顧", "基礎品質檢查", "轉真人文案調整"],
  },
  {
    name: "正式導入",
    price: "Pilot 後報價",
    timeline: "通常 4-6 週以上",
    bestFor: "需要擴充更多課程、部門、分校或私有資料處理的團隊",
    highlighted: false,
    items: ["更多文件與課程", "更多使用情境", "管理者更新流程", "代管、紀錄與資料處理評估"],
  },
];

export default function PricingPage() {
  return (
    <main>
      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex rounded-lg bg-[#06c755]/15 px-3 py-1 text-sm font-black text-[#8df5ad]">
            費用
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
            先做一個 LINE 招生 FAQ Pilot，不要一開始就買大型 AI 專案。
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-200">
            第一個方案刻意縮小：一個教育或課程詢問情境、一批文件、30 題真實問題，以及一份清楚的 go / no-go 報告，再決定是否擴大。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/ai-knowledge-assistant#start-small-poc" variant="primary">
              申請 Pilot 評估
            </ButtonLink>
            <ButtonLink href="/line" variant="line" icon={MessageCircle}>
              用 LINE 詢問
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Packages"
            title="讓客戶可以快速判斷是否值得聊的第一個方案"
            description="費用公開，避免客戶不知道預算門檻，也避免銷售對話一開始就太模糊。"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {packages.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-lg border p-6 shadow-sm ${
                  plan.highlighted ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"
                }`}
              >
                <h2 className="text-2xl font-black leading-tight text-slate-950">{plan.name}</h2>
                <p className="mt-4 text-3xl font-black text-emerald-700">{plan.price}</p>
                <p className="mt-2 text-sm font-bold text-slate-500">{plan.timeline}</p>
                <p className="mt-4 text-sm leading-7 text-slate-700">{plan.bestFor}</p>
                <ul className="mt-5 grid gap-3">
                  {plan.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm font-semibold leading-7 text-slate-700">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Pilot 包含</h2>
            <ul className="mt-5 grid gap-3">
              {pilotIncludes.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-semibold leading-7 text-slate-700">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-700" aria-hidden="true" />
              <h2 className="text-2xl font-black text-slate-950">Pilot 不包含</h2>
            </div>
            <ul className="mt-5 grid gap-3">
              {exclusions.map((item) => (
                <li key={item} className="flex gap-3 text-sm font-semibold leading-7 text-slate-700">
                  <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-emerald-700 px-5 py-14 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-100">下一步</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-[0] sm:text-4xl">
              準備一份 FAQ、課程頁或 PDF，我們先判斷是否適合做 Pilot。
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-emerald-50">
              如果文件太亂、太舊或太敏感，正確下一步可能是先整理文件，而不是立刻建立 chatbot。
            </p>
          </div>
          <ButtonLink href="/ai-knowledge-assistant#start-small-poc" variant="secondary">
            免費檢查 FAQ
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
