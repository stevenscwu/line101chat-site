import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { navItems, site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:px-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-lg font-black text-white">
              L
            </span>
            <span>
              <span className="block text-lg font-black">LINE101Chat</span>
              <span className="block text-sm text-slate-300">
                AI Knowledge Assistant for Taiwan SMEs
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            協助台灣中小企業、學校與組織，把正式文件、LINE 對話與跨語言溝通整理成可落地的 AI 聊天助理。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-emerald-400 hover:text-white"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {site.email}
            </a>
            <ButtonLink href={site.lineAddFriendUrl} icon={MessageCircle} variant="line" external>
              加入 LINE 詢問
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-sm font-black text-white">網站導覽</h2>
            <div className="mt-4 grid gap-2">
              {navItems.slice(0, 4).map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-slate-300 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-white">資源</h2>
            <div className="mt-4 grid gap-2">
              {navItems.slice(4).map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-slate-300 hover:text-white">
                  {item.label}
                </Link>
              ))}
              <Link href="/about" className="text-sm text-slate-300 hover:text-white">
                關於我們
              </Link>
              <Link href="/privacy" className="text-sm text-slate-300 hover:text-white">
                Privacy policy
              </Link>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-white">聯絡</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Email placeholder:
              <br />
              {site.email}
            </p>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              Copyright © {new Date().getFullYear()} LINE101Chat. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
