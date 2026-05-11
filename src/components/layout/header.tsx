"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CalendarDays, Languages, Menu, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import {
  alternateLocalePath,
  getLocaleFromPathname,
  getSiteContent,
  localeHtmlLang,
  localizePath,
} from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const content = getSiteContent(locale);
  const { labels, navItems, primaryCtas } = content;
  const alternatePath = alternateLocalePath(pathname);

  useEffect(() => {
    document.documentElement.lang = localeHtmlLang[locale];
  }, [locale]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
        <Link href={localizePath("/", locale)} className="flex items-center gap-3" aria-label="LINE101Chat home">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-lg font-black text-white">
            L
          </span>
          <span className="min-w-0">
            <span className="block text-base font-black tracking-[0] text-slate-950">
              LINE101Chat
            </span>
            <span className="block text-xs font-semibold text-slate-500">
              {labels.brandTagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label={labels.navAria}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={localizePath(item.href, locale)}
              className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={alternatePath}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
            aria-label={labels.switchLanguageAria}
          >
            <Languages className="h-4 w-4" aria-hidden="true" />
            {labels.switchLanguage}
          </Link>
          <ButtonLink href={localizePath(primaryCtas.demo.href, locale)} icon={CalendarDays} variant="secondary">
            {primaryCtas.demo.label}
          </ButtonLink>
          <ButtonLink
            href={localizePath(primaryCtas.line.href, locale)}
            icon={MessageCircle}
            variant="line"
          >
            {primaryCtas.line.label}
          </ButtonLink>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">{labels.openMenu}</span>
          </summary>
          <div className="absolute right-0 top-[3.5rem] w-[min(88vw,340px)] rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
            <nav className="grid gap-1" aria-label={labels.mobileNavAria}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={localizePath(item.href, locale)}
                  className="rounded-lg px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-emerald-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid gap-2 border-t border-slate-200 pt-3">
              <Link
                href={alternatePath}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:border-emerald-500 hover:text-emerald-700"
                aria-label={labels.switchLanguageAria}
              >
                <Languages className="h-4 w-4" aria-hidden="true" />
                {labels.switchLanguage}
              </Link>
              <ButtonLink href={localizePath(primaryCtas.demo.href, locale)} icon={CalendarDays} variant="primary">
                {primaryCtas.demo.label}
              </ButtonLink>
              <ButtonLink
                href={localizePath(primaryCtas.line.href, locale)}
                icon={MessageCircle}
                variant="line"
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
