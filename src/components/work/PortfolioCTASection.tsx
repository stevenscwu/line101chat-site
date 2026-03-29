import Link from "next/link";

import { type Locale, withLocale } from "@/lib/i18n/config";

type PortfolioCTASectionProps = {
  locale: Locale;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export function PortfolioCTASection({
  locale,
  title,
  description,
  primaryLabel,
  secondaryLabel,
}: PortfolioCTASectionProps) {
  return (
    <section className="border-t border-white/10 bg-[linear-gradient(160deg,#0a1325,#09162d_55%,#071122)] py-18 md:py-24">
      <div className="mx-auto w-full max-w-[1240px] px-5 md:px-10 lg:px-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),rgba(255,255,255,0.03)_55%,rgba(255,255,255,0.04))] p-8 md:p-12">
          <div className="pointer-events-none absolute -right-16 -top-14 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="relative max-w-3xl space-y-5">
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
            <p className="text-base leading-relaxed text-white/74 md:text-lg">{description}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={withLocale(locale, "/contact")}
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                {primaryLabel}
              </Link>
              <Link
                href={withLocale(locale, "/services")}
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
