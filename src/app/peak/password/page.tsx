import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PEAK_SESSION_COOKIE, verifySession } from "@/lib/peak/auth";

import { PasswordChangeForm } from "./PasswordChangeForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Peak OS 密碼設定", robots: { index: false, follow: false, nocache: true } };

export default async function PeakPasswordPage() {
  const token = (await cookies()).get(PEAK_SESSION_COOKIE)?.value;
  if (!verifySession(token)) redirect("/peak/login");
  return <main className="min-h-[72vh] bg-slate-950 px-5 py-16 text-slate-100"><section className="mx-auto max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-7 shadow-2xl"><p className="text-sm font-semibold tracking-[0.2em] text-emerald-300">OWNER SECURITY</p><h1 className="mt-3 text-3xl font-bold">設定登入密碼</h1><p className="mt-2 text-sm text-slate-300">密碼只會在瀏覽器中送出；伺服器僅將單向雜湊存入私人儲存空間。</p><PasswordChangeForm /><Link href="/peak" className="mt-5 inline-block text-sm font-semibold text-emerald-300">返回儀表板</Link></section></main>;
}
