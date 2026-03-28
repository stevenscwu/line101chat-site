"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  localeCookieName,
  localeLabels,
  locales,
  stripLocaleFromPath,
  type Locale,
  withLocale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: Locale;
  label?: string;
  className?: string;
};

export function LanguageSwitcher({ locale, label, className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const basePath = stripLocaleFromPath(pathname || "/");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 p-1 text-xs text-white/80 backdrop-blur",
        className,
      )}
      role="group"
      aria-label={label ?? "Language switcher"}
    >
      {locales.map((lang) => {
        const href = withLocale(lang, basePath);

        return (
          <Link
            key={lang}
            href={href}
            onClick={() => {
              document.cookie = `${localeCookieName}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
            }}
            className={cn(
              "rounded-full px-3 py-1.5 font-medium transition",
              locale === lang
                ? "bg-white text-slate-900"
                : "text-white/80 hover:bg-white/10 hover:text-white",
            )}
            aria-current={locale === lang ? "page" : undefined}
          >
            {localeLabels[lang]}
          </Link>
        );
      })}
    </div>
  );
}
