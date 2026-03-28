import Link from "next/link";

import { Section } from "@/components/layout/Section";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { type Locale, withLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type PricingCardsProps = {
  locale: Locale;
  content: Dictionary["home"]["pricingPreview"];
  startingFromLabel: string;
  bestForLabel: string;
  recommendedLabel: string;
};

export function PricingCards({
  locale,
  content,
  startingFromLabel,
  bestForLabel,
  recommendedLabel,
}: PricingCardsProps) {
  return (
    <Section tone="light">
      <div className="space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              {content.title}
            </h2>
            <p className="text-base leading-relaxed text-slate-600 md:text-lg">{content.description}</p>
          </div>
          <Link
            href={withLocale(locale, "/pricing")}
            className="inline-flex rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white"
          >
            {content.viewAllCta}
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {content.packages.map((pkg, index) => {
            const featured = index === 1;

            return (
              <article
                key={pkg.name}
                className={cn(
                  "relative rounded-[1.75rem] border p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]",
                  featured
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-[linear-gradient(176deg,#ffffff,#f4f8ff)] text-slate-900",
                )}
              >
                {featured ? (
                  <span className="absolute right-5 top-5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-white/90">
                    {recommendedLabel}
                  </span>
                ) : null}

                <h3 className={cn("text-2xl font-semibold", featured ? "text-white" : "text-slate-900")}>
                  {pkg.name}
                </h3>
                <p
                  className={cn(
                    "mt-3 text-sm leading-relaxed",
                    featured ? "text-white/78" : "text-slate-600",
                  )}
                >
                  {pkg.description}
                </p>

                <p
                  className={cn(
                    "mt-5 text-xs uppercase tracking-[0.12em]",
                    featured ? "text-white/60" : "text-slate-500",
                  )}
                >
                  {bestForLabel}
                </p>
                <p className={cn("mt-1 text-sm", featured ? "text-white/90" : "text-slate-700")}>{pkg.idealFor}</p>

                <ul className="mt-5 space-y-2 text-sm">
                  {pkg.includes.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        "rounded-xl px-3 py-2",
                        featured ? "bg-white/10 text-white/88" : "bg-slate-100/80 text-slate-600",
                      )}
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <p
                  className={cn(
                    "mt-6 text-xs uppercase tracking-[0.12em]",
                    featured ? "text-white/60" : "text-slate-500",
                  )}
                >
                  {startingFromLabel}
                </p>
                <p className={cn("mt-1 text-2xl font-semibold", featured ? "text-white" : "text-slate-900")}>
                  {pkg.startingFrom}
                </p>

                <Link
                  href={withLocale(locale, "/contact")}
                  className={cn(
                    "mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition",
                    featured
                      ? "bg-white text-slate-900 hover:bg-slate-100"
                      : "border border-slate-300 text-slate-800 hover:bg-white",
                  )}
                >
                  {pkg.cta}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
