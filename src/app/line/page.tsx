import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "加入 LINE 詢問｜LINE101Chat",
  description: "掃描 LINE101Chat LINE 官方帳號 QR Code，或寄信至 service@line101chat.com 洽詢企業 AI 知識助理。",
  alternates: { canonical: "/line" },
};

export default function LinePage() {
  return (
    <main>
      <section className="bg-slate-950 px-5 py-8 text-white sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="inline-flex rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200">
              LINE101Chat Official LINE
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
              加入 LINE 詢問
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-300">
              掃描 QR Code，詢問企業 AI 知識助理、LINE 文件查詢、資料保密部署或 PoC 評估。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-black text-white hover:bg-emerald-600"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                聯絡我們
              </Link>
              <a
                href={`mailto:${site.email}?subject=LINE101Chat%20需求評估`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-600 px-5 py-3 text-sm font-black text-slate-100 hover:border-emerald-400 hover:text-white"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {site.email}
              </a>
            </div>
          </div>

          <div className="order-1 mx-auto w-full max-w-[340px] rounded-lg border border-white/10 bg-white p-4 shadow-2xl lg:order-2 lg:max-w-none lg:p-5">
            <Image
              src={site.lineQrImage}
              alt="加入 LINE101Chat LINE 官方帳號 QR Code"
              width={612}
              height={612}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
