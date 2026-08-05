import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { PEAK_SESSION_COOKIE, verifySession } from "@/lib/peak/auth";
import { getSingleOwnerEmail, isPeakDashboardEnabled } from "@/lib/peak/config";

import { PasswordInput } from "./PasswordInput";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Peak OS 擁有者登入",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PeakLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!isPeakDashboardEnabled()) notFound();
  const token = (await cookies()).get(PEAK_SESSION_COOKIE)?.value;
  if (verifySession(token)) redirect("/peak");
  const ownerEmail = getSingleOwnerEmail();
  const error = (await searchParams).error;
  const message = error === "limited"
    ? "嘗試次數過多，請稍後再試。"
    : error === "unavailable"
      ? "擁有者驗證尚未完成設定。"
      : error
        ? "登入資料無效。電子郵件已保留；密碼基於安全考量不會保留，請重新輸入或貼上。"
        : null;
  return (
    <main className="min-h-[72vh] bg-slate-950 px-5 py-16 text-slate-100">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-7 shadow-2xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-emerald-300">OWNER ONLY</p>
        <h1 className="mt-3 text-3xl font-bold">Peak OS</h1>
        <p className="mt-2 text-sm text-slate-300">這是私人的執行儀表板。登入資訊只送往 LINE101Chat 伺服器，不會儲存在瀏覽器。</p>
        {message ? <p role="alert" className="mt-5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">{message}</p> : null}
        <form action="/api/peak/v1/login" method="post" className="mt-7 space-y-5">
          <label className="block text-sm font-medium">擁有者電子郵件
            <input name="email" type="email" autoComplete="username" required maxLength={254} defaultValue={ownerEmail} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" />
          </label>
          <PasswordInput />
          <button type="submit" className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-slate-900">安全登入</button>
        </form>
      </section>
    </main>
  );
}
