import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { PEAK_SESSION_COOKIE, verifySession } from "@/lib/peak/auth";
import { isPeakDashboardEnabled } from "@/lib/peak/config";
import {
  PEAK_LOGIN_LINK_LIFETIME_MINUTES,
  PEAK_TELEGRAM_LOGIN_COMMAND,
  getPeakLoginNotice,
} from "@/lib/peak/login-copy";

import { PasswordInput } from "./PasswordInput";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Peak OS 擁有者登入",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PeakLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!isPeakDashboardEnabled()) notFound();
  const token = (await cookies()).get(PEAK_SESSION_COOKIE)?.value;
  if (verifySession(token)) redirect("/peak-os");
  const error = (await searchParams).error;
  const notice = getPeakLoginNotice(error);
  return (
    <main className="min-h-[72vh] bg-slate-950 px-5 py-16 text-slate-100">
      <section className="mx-auto max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-7 shadow-2xl sm:p-9">
        <p className="text-sm font-semibold tracking-[0.2em] text-emerald-300">TELEGRAM FIRST · OWNER ONLY</p>
        <h1 className="mt-3 text-3xl font-bold">Peak OS</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">這是 Steven 的私人執行儀表板。一般登入由擁有者 Telegram 發起，不需要在此輸入密碼。</p>
        {notice ? (
          <p
            role={notice.tone === "warning" ? "alert" : "status"}
            className={`mt-5 rounded-xl border p-3 text-sm ${notice.tone === "warning" ? "border-amber-500/40 bg-amber-500/10 text-amber-100" : "border-sky-400/40 bg-sky-400/10 text-sky-100"}`}
          >
            {notice.message}
          </p>
        ) : null}

        <div className="mt-7 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
          <p className="text-xs font-bold tracking-[0.16em] text-emerald-300">建議登入方式</p>
          <h2 className="mt-2 text-xl font-bold">從擁有者 Telegram 登入</h2>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
            <li><span className="mr-2 font-bold text-emerald-300">1.</span>開啟 Peak OS 擁有者的 Telegram 對話。</li>
            <li><span className="mr-2 font-bold text-emerald-300">2.</span>傳送 <code className="rounded bg-slate-950 px-2 py-1 font-mono text-emerald-200">{PEAK_TELEGRAM_LOGIN_COMMAND}</code></li>
            <li><span className="mr-2 font-bold text-emerald-300">3.</span>點擊機器人回覆的一次性安全連結。</li>
          </ol>
          <p className="mt-4 text-xs leading-5 text-slate-400">連結有效 {PEAK_LOGIN_LINK_LIFETIME_MINUTES} 分鐘，成功使用一次後立即失效。若連結逾期，回到 Telegram 再傳送一次指令即可。</p>
        </div>

        <details className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
          <summary className="cursor-pointer font-semibold text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">緊急備用：使用密碼登入</summary>
          <p className="mt-3 text-xs leading-5 text-slate-400">僅在 Telegram 暫時無法使用時採用。密碼只送往伺服器驗證，不會儲存在瀏覽器。</p>
          <form action="/api/peak/v1/login" method="post" className="mt-5 space-y-5">
            <label className="block text-sm font-medium">擁有者電子郵件
              <input name="email" type="email" autoComplete="username" required maxLength={254} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" />
            </label>
            <PasswordInput />
            <button type="submit" className="w-full rounded-xl border border-slate-500 bg-slate-800 px-5 py-3 font-bold text-slate-100 transition hover:border-emerald-300 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-slate-900">使用緊急密碼登入</button>
          </form>
        </details>
      </section>
    </main>
  );
}
