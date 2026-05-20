import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  Languages,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { translationPlans } from "@/lib/translation-payments/plans";

export const metadata: Metadata = {
  title: "LINE 翻譯 Bot 訂閱｜中文 印尼文雙向翻譯",
  description:
    "LINE101Chat 中文 ↔ 印尼文 LINE Translation Bot 訂閱頁，提供 Free、Basic、Plus 三種翻譯額度方案，透過 LINE Pay 完成付款後啟用。",
  alternates: { canonical: "/translation-service" },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const statusCopy: Record<string, { title: string; body: string; tone: string }> = {
  paid: {
    title: "付款已由 LINE Pay 確認",
    body: "系統已建立啟用資料。請回到 LINE bot 等候額度啟用通知；本頁不顯示啟用碼。",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  pending: {
    title: "付款仍在處理中",
    body: "LINE Pay 尚未回傳可完成確認的狀態，請稍後再由管理端重新檢查。",
    tone: "border-amber-200 bg-amber-50 text-amber-900",
  },
  cancelled: {
    title: "付款已取消或逾時",
    body: "沒有完成付款，因此不會啟用翻譯額度。你可以重新選擇方案付款。",
    tone: "border-slate-200 bg-slate-50 text-slate-800",
  },
  "missing-line-user": {
    title: "需要 LINE userId",
    body: "請從 LINE bot 付款連結進入，或填入 bot 提供的 LINE userId 後再送出付款。",
    tone: "border-rose-200 bg-rose-50 text-rose-900",
  },
  "request-failed": {
    title: "LINE Pay 付款請求失敗",
    body: "尚未建立可付款連結，因此不會啟用額度。請稍後再試或聯絡管理員檢查 LINE Pay 設定。",
    tone: "border-rose-200 bg-rose-50 text-rose-900",
  },
  "request-error": {
    title: "付款系統尚未完成設定",
    body: "伺服器無法建立 LINE Pay 付款，請確認環境變數與 LINE Pay 商家設定。",
    tone: "border-rose-200 bg-rose-50 text-rose-900",
  },
  "verification-failed": {
    title: "付款驗證未通過",
    body: "LINE Pay 回傳資料與本地訂單不一致，系統已阻擋啟用額度。",
    tone: "border-rose-200 bg-rose-50 text-rose-900",
  },
};

const flowSteps = [
  {
    title: "1. 取得 LINE userId",
    body: "建議從 LINE bot 內的付款連結開啟本頁，讓 userId 帶入付款表單。",
  },
  {
    title: "2. 建立本地訂單",
    body: "伺服器會建立唯一 orderId，保存 plan、金額、TWD 幣別與 pending 狀態。",
  },
  {
    title: "3. LINE Pay 付款",
    body: "付款請求由伺服器以 LINE Pay 憑證簽章，前端不接觸任何 channel secret。",
  },
  {
    title: "4. 付款確認後啟用",
    body: "回跳頁不被信任；伺服器必須再向 LINE Pay Confirm API 驗證成功，才會發放額度。",
  },
];

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TranslationServicePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const paymentStatus = firstParam(params.payment);
  const lineUserId = firstParam(params.lineUserId) ?? "";
  const orderId = firstParam(params.orderId);
  const status = paymentStatus ? statusCopy[paymentStatus] : null;
  const plans = [translationPlans.free, translationPlans.basic, translationPlans.plus];

  return (
    <main>
      <section className="bg-slate-950 px-5 py-10 text-white sm:px-8 sm:py-14 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200">
              <Languages className="h-4 w-4" aria-hidden="true" />
              中文 ↔ 印尼文 LINE Translation Bot
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
              在 LINE 裡完成中文與印尼文雙向翻譯，適合現場客服、工廠與跨語言溝通
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-300">
              LINE101Chat Translation Bot 讓使用者直接在 LINE 傳送中文或印尼文訊息，取得對方語言的翻譯結果。Free
              方案可先試用，每月固定翻譯量；Basic 與 Plus 透過 LINE Pay 付款，付款經伺服器確認後才啟用額度。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#plans"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#06c755] px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-[#05b54e]"
              >
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                選擇訂閱方案
              </a>
              <Link
                href="/line"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-600 px-5 py-3 text-sm font-black text-slate-100 hover:border-emerald-400 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                先加入 LINE 詢問
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-2xl">
            <Image
              src="/presenter/2.png"
              alt="LINE101Chat translation service consultant"
              width={1080}
              height={1456}
              priority
              className="aspect-[4/5] h-auto w-full object-cover object-top"
            />
          </div>
        </div>
      </section>

      {status ? (
        <section className="bg-white px-5 pt-8 sm:px-8 lg:px-10">
          <div className={`mx-auto max-w-7xl rounded-lg border p-5 ${status.tone}`}>
            <h2 className="text-lg font-black">{status.title}</h2>
            <p className="mt-2 text-sm leading-7">
              {status.body}
              {orderId ? <span className="font-mono"> Order: {orderId}</span> : null}
            </p>
          </div>
        </section>
      ) : null}

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">
              Service
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-[0] text-slate-950">
              為中文與印尼文現場溝通設計的 LINE 翻譯訂閱
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              這個服務適合需要頻繁處理雙語訊息的店家、宿舍管理、工廠行政、人力仲介、學校窗口與客服團隊。使用者不需要安裝新 App，只要在 LINE bot
              中輸入內容，即可使用當月翻譯額度。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "支援繁體中文與印尼文雙向翻譯",
              "用 LINE 對話完成，不改變既有溝通習慣",
              "每月額度清楚，適合小團隊先採用",
              "付款確認後才啟用，避免偽造成功頁面",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <p className="text-sm font-bold leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-[0] text-slate-950">
              選擇每月翻譯額度
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Basic 與 Plus 按鈕會先送出 LINE userId 與方案資料，由伺服器建立訂單並導向 LINE Pay。本站不在前端保存或顯示 LINE Pay
              channel secret，也不在公開頁面顯示啟用碼。
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`rounded-lg border p-5 ${
                  plan.id === "plus"
                    ? "border-emerald-300 bg-white shadow-lg shadow-emerald-900/10"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-950">{plan.name}</h3>
                    <p className="mt-2 text-sm font-bold text-slate-500">
                      {plan.translations.toLocaleString()} translations / month
                    </p>
                  </div>
                  {plan.id === "plus" ? (
                    <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                      高用量
                    </span>
                  ) : null}
                </div>

                <p className="mt-6 text-4xl font-black tracking-[0] text-slate-950">
                  {plan.billingLabel}
                </p>

                <ul className="mt-6 grid gap-3 text-sm leading-7 text-slate-700">
                  <li className="flex gap-2">
                    <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    中文與印尼文雙向翻譯
                  </li>
                  <li className="flex gap-2">
                    <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    每月 {plan.translations.toLocaleString()} 次翻譯額度
                  </li>
                  <li className="flex gap-2">
                    <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    {plan.paid ? "付款確認後啟用額度" : "適合先測試翻譯流程"}
                  </li>
                </ul>

                {plan.paid ? (
                  <form action="/api/translation-payments/create" method="post" className="mt-6 grid gap-3">
                    <input type="hidden" name="plan" value={plan.id} />
                    <label htmlFor={`line-user-${plan.id}`} className="text-sm font-black text-slate-800">
                      LINE userId
                    </label>
                    <input
                      id={`line-user-${plan.id}`}
                      name="lineUserId"
                      required
                      minLength={4}
                      maxLength={128}
                      defaultValue={lineUserId}
                      placeholder="由 LINE bot 付款連結帶入"
                      className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    <button
                      type="submit"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#06c755] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#05b54e] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      <CreditCard className="h-4 w-4" aria-hidden="true" />
                      Pay with LINE Pay
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/line"
                    className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-900 hover:border-emerald-500 hover:text-emerald-700"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    加入 LINE bot 試用
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-emerald-700">
              Payment Flow
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-[0] text-slate-950">
              啟用只看伺服器端 LINE Pay 驗證結果
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              使用者回到網站不代表付款成功。系統必須用 transactionId、金額與 TWD 幣別向 LINE Pay Confirm API
              完成驗證，並比對本地訂單資料後，才會產生啟用資料或升級 LINE userId。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {flowSteps.map((step) => (
              <div key={step.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-black text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-7xl gap-4 md:grid-cols-2">
          <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />
            <div>
              <h3 className="font-black text-slate-950">付款安全原則</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                LINE Pay credentials 只在伺服器端環境變數中使用；前端只送出 plan 與 LINE userId，不接觸任何 secret。
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <LockKeyhole className="mt-1 h-6 w-6 shrink-0 text-amber-700" aria-hidden="true" />
            <div>
              <h3 className="font-black text-slate-950">不公開啟用碼</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                付款成功後的啟用關聯只保存在伺服器資料中；公開頁面不顯示真實 activation code。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
