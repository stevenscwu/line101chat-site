"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { bakeryBrand, bakeryNavigation } from "@/lib/bakery/content";
import { type Locale, withLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type BakeryNavProps = {
  locale: Locale;
};

export function BakeryNav({ locale }: BakeryNavProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-amber-200/70 bg-amber-50/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 px-5 py-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Link href={withLocale(locale, "/work/simple-bakery")} className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-800/70">Bakery Showcase</p>
            <p className="text-2xl font-semibold tracking-tight text-amber-950">
              {bakeryBrand.zhName}
              <span className="ml-2 text-sm font-medium text-amber-900/70">{bakeryBrand.enName}</span>
            </p>
          </Link>
          <p className="max-w-xl text-sm leading-relaxed text-amber-900/70">{bakeryBrand.tagline}</p>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Bakery navigation">
          {bakeryNavigation.map((item) => {
            const href = withLocale(locale, item.href);
            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
                  isActive
                    ? "border-amber-800 bg-amber-900 text-amber-50"
                    : "border-amber-300 bg-amber-100/70 text-amber-900 hover:bg-amber-200/80",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
