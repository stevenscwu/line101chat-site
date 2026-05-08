import Link from "next/link";
import { CalendarDays, Menu, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { navItems, primaryCtas, site } from "@/data/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="LINE101Chat 首頁">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-lg font-black text-white">
            L
          </span>
          <span className="min-w-0">
            <span className="block text-base font-black tracking-[0] text-slate-950">
              LINE101Chat
            </span>
            <span className="block text-xs font-semibold text-slate-500">
              AI Knowledge Assistant
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="主要導覽">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href={primaryCtas.demo.href} icon={CalendarDays} variant="secondary">
            {primaryCtas.demo.label}
          </ButtonLink>
          <ButtonLink
            href={primaryCtas.line.href}
            icon={MessageCircle}
            variant="line"
            external
          >
            {primaryCtas.line.label}
          </ButtonLink>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">開啟選單</span>
          </summary>
          <div className="absolute right-0 top-[3.5rem] w-[min(88vw,340px)] rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
            <nav className="grid gap-1" aria-label="手機導覽">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-emerald-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid gap-2 border-t border-slate-200 pt-3">
              <ButtonLink href={primaryCtas.demo.href} icon={CalendarDays} variant="primary">
                {primaryCtas.demo.label}
              </ButtonLink>
              <ButtonLink
                href={site.lineAddFriendUrl}
                icon={MessageCircle}
                variant="line"
                external
              >
                {primaryCtas.line.label}
              </ButtonLink>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
