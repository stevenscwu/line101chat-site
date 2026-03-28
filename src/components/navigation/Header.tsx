"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { type Locale, withLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type HeaderProps = {
  locale: Locale;
  ui: Dictionary["ui"];
};

export function Header({ locale, ui }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const links = ui.navigation;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[color:color-mix(in_oklab,var(--surface-dark)_90%,transparent)]/95 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-5 py-4 md:px-10 lg:px-16">
        <Link href={withLocale(locale, "/")} className="group flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/18 bg-white/6 text-sm font-semibold tracking-[0.16em] text-white">
            L1
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-[0.13em] text-white">{ui.brand.name}</p>
            <p className="text-[11px] uppercase tracking-[0.1em] text-white/55">{ui.brand.tagline}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
          {links.map((item) => {
            const target = withLocale(locale, item.href);
            const active = pathname === target;

            return (
              <Link
                key={item.href}
                href={target}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition",
                  active
                    ? "bg-white/14 text-white"
                    : "text-white/74 hover:bg-white/8 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher locale={locale} label={ui.language.switch} />
          <Link
            href={withLocale(locale, "/contact")}
            className="inline-flex items-center rounded-full border border-white/24 bg-white px-5 py-2 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            {ui.header.bookConsultation}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center rounded-full border border-white/16 px-3.5 py-2 text-xs text-white/85 md:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? ui.header.close : ui.header.menu}
        >
          {mobileOpen ? ui.header.close : ui.header.menu}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/10 bg-[var(--surface-dark)]/98 transition-[max-height] duration-300 md:hidden",
          mobileOpen ? "max-h-[520px]" : "max-h-0",
        )}
      >
        <nav className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-5">
          {links.map((item) => (
            <Link
              key={`mobile-${item.href}`}
              href={withLocale(locale, item.href)}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/88"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <LanguageSwitcher
              locale={locale}
              label={ui.language.switch}
              className="w-full justify-center"
            />
          </div>
          <Link
            href={withLocale(locale, "/contact")}
            onClick={() => setMobileOpen(false)}
            className="mt-2 rounded-full bg-white px-4 py-3 text-center text-sm font-medium text-slate-900"
          >
            {ui.header.bookConsultation}
          </Link>
        </nav>
      </div>
    </header>
  );
}
