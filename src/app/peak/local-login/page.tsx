import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isPeakDashboardEnabled } from "@/lib/peak/config";

import { LocalLoginClient } from "./LocalLoginClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Peak OS 本機登入",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default function PeakLocalLoginPage() {
  if (!isPeakDashboardEnabled()) notFound();
  return (
    <main className="min-h-[72vh] bg-slate-950 px-5 py-16 text-slate-100">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-7 shadow-2xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-emerald-300">LOCAL ONE-TIME SIGN-IN</p>
        <h1 className="mt-3 text-3xl font-bold">Peak OS</h1>
        <div className="mt-5"><LocalLoginClient /></div>
      </section>
    </main>
  );
}
