import type { Metadata } from "next";
import { ExternalLink, KeyRound, LogOut, ShieldCheck, UserRoundCheck } from "lucide-react";

import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "私人信箱登入｜LINE101Chat",
  description: "LINE101Chat 私人信箱登入入口。",
  alternates: { canonical: "/feiz" },
  robots: {
    index: false,
    follow: false,
  },
};

const loginTips = [
  {
    title: "使用無痕視窗登入",
    detail: "如果瀏覽器已登入其他 Zoho 帳號，請用無痕視窗開啟，避免自動連到錯的信箱。",
    icon: ShieldCheck,
  },
  {
    title: "先登出其他 Zoho 帳號",
    detail: "若 Zoho Mail 直接進入其他信箱，請從右上角頭像登出後，再輸入 Steven 帳號。",
    icon: LogOut,
  },
  {
    title: "密碼不放在網站",
    detail: "密碼、兩階段驗證與恢復方式請只在 Zoho 帳號內管理，網站只保留登入捷徑。",
    icon: KeyRound,
  },
];

export default function FeizMailPage() {
  return (
    <main>
      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="inline-flex rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200">
              LINE101Chat Private Email Access
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
              私人信箱登入
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-300">
              這個頁面只提供 {site.email} 的 Zoho Mail 快速入口。密碼與兩階段驗證請在 Zoho
              帳號內管理，不會存放在網站中。
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-black text-slate-200">主要登入網址</p>
            <a
              href={site.mailLoginUrl}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-black text-white hover:bg-emerald-600"
              target="_blank"
              rel="noreferrer"
            >
              開啟 Zoho Mail
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <UserRoundCheck className="h-8 w-8 text-emerald-600" aria-hidden="true" />
            <p className="mt-5 text-sm font-black uppercase tracking-[0] text-slate-500">Steven</p>
            <h2 className="mt-2 break-words text-xl font-black text-slate-950 sm:text-2xl">{site.email}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              LINE101Chat 主要商務往來、網站詢問與客戶回覆信箱。
            </p>
            <a
              href={site.mailLoginUrl}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
              target="_blank"
              rel="noreferrer"
            >
              使用此帳號登入
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>

          <div className="grid gap-4">
            {loginTips.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex gap-4">
                  <item.icon className="mt-1 h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
