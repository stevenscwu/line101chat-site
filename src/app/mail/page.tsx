import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ExternalLink, Mail, Settings, ShieldCheck } from "lucide-react";

import { emailAccounts, site } from "@/data/site";

export const metadata: Metadata = {
  title: "信箱登入｜LINE101Chat",
  description: "LINE101Chat 團隊信箱入口，提供 Zoho Mail 登入與管理捷徑。",
  alternates: { canonical: "/mail" },
  robots: {
    index: false,
    follow: false,
  },
};

const setupItems = [
  {
    title: "MX 已指向 Zoho Mail",
    detail: "line101chat.com 目前的 MX 記錄為 mx.zoho.com、mx2.zoho.com、mx3.zoho.com。",
    status: "已完成",
  },
  {
    title: "建立兩個 Zoho 使用者",
    detail: "Zoho Mail Admin Console 已顯示 service@line101chat.com 與 steven@line101chat.com。service 帳號仍需首次登入測試寄信。",
    status: "已建立",
  },
  {
    title: "補齊 SPF / DKIM / DMARC",
    detail: "目前公開 DNS 可看到 Zoho 驗證與 MX；寄信穩定度仍應在 Zoho Admin 取得 DKIM selector，並於 Vercel DNS 補齊驗證記錄。",
    status: "建議補強",
  },
  {
    title: "自訂 mail 子網域",
    detail: "mail.line101chat.com 需要在 Zoho White Labeling 取得 CNAME 值並產生憑證後才能作為客製登入網址。",
    status: "選配",
  },
];

const quickLinks = [
  {
    title: "Zoho Mail",
    description: "登入信箱收發郵件。",
    href: site.mailLoginUrl,
    icon: Mail,
  },
  {
    title: "Zoho Mail Admin",
    description: "建立使用者、重設密碼與檢查 DNS。",
    href: site.mailAdminUrl,
    icon: Settings,
  },
  {
    title: "聯絡頁",
    description: "回到網站公開聯絡資訊。",
    href: "/contact",
    icon: ShieldCheck,
  },
];

export default function MailPage() {
  return (
    <main>
      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200">
            LINE101Chat Email Access
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-[0] sm:text-5xl">
                團隊信箱登入
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-300">
                這裡是 LINE101Chat 內部信箱的快速入口。service@line101chat.com 與 steven@line101chat.com 使用 Zoho Mail 登入；密碼與兩階段驗證請在 Zoho 帳號內管理，不會存放在網站中。
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
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2">
            {emailAccounts.map((account) => (
              <article key={account.address} className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <account.icon className="h-8 w-8 text-emerald-600" aria-hidden="true" />
                <p className="mt-5 text-sm font-black uppercase tracking-[0] text-slate-500">{account.label}</p>
                <h2 className="mt-2 break-words text-2xl font-black text-slate-950">{account.address}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{account.purpose}</p>
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
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0] text-emerald-700">Shortcuts</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-[0] text-slate-950">
              常用入口
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              信箱收發使用 Zoho Mail。新增使用者、重設密碼、DKIM 與客製登入網址需要進入 Zoho Mail Admin Console。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {quickLinks.map((item) => (
              item.href.startsWith("http") ? (
                <a
                  key={item.title}
                  href={item.href}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                  target="_blank"
                  rel="noreferrer"
                >
                  <item.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </a>
              ) : (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                >
                  <item.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-black text-slate-950">設定狀態備忘</h2>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  網站只能提供登入入口；真正的信箱建立、密碼、兩階段驗證、DKIM 與客製登入憑證，需要在 Zoho Mail Admin Console 與 Vercel DNS 中完成。
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {setupItems.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  <p className="text-xs font-black uppercase tracking-[0] text-emerald-700">{item.status}</p>
                </div>
                <h3 className="mt-3 text-lg font-black text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
