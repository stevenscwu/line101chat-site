import Link from "next/link";

import { Section } from "@/components/layout/Section";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { type Locale, withLocale } from "@/lib/i18n/config";

type HeroProps = {
  locale: Locale;
  hero: Dictionary["home"]["hero"];
};

export function Hero({ locale, hero }: HeroProps) {
  return (
    <Section tone="dark" className="pb-22 pt-24 md:pb-26 md:pt-32">
      <div className="relative">
        <div className="pointer-events-none absolute -left-28 -top-10 h-72 w-72 rounded-full bg-cyan-200/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-24 h-80 w-80 rounded-full bg-indigo-300/12 blur-3xl" />

        <div className="relative grid items-center gap-14 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="space-y-8">
            <p className="inline-flex rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-white/72">
              {hero.eyebrow}
            </p>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl md:leading-[1.05] lg:text-[4.25rem]">
                {hero.headline}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/74 md:text-xl">{hero.subheadline}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={withLocale(locale, hero.primaryCta.href)}
                className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                {hero.primaryCta.label}
              </Link>
              <Link
                href={withLocale(locale, hero.secondaryCta.href)}
                className="inline-flex rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {hero.secondaryCta.label}
              </Link>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {hero.trustPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-white/16 bg-white/7 px-3.5 py-1.5 text-xs text-white/74"
                >
                  {point}
                </span>
              ))}
            </div>

            <div className="grid gap-3 pt-3 sm:grid-cols-3">
              {hero.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/12 bg-white/6 p-4 backdrop-blur"
                >
                  <p className="text-[11px] uppercase tracking-[0.1em] text-white/54">{stat.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/82">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[400px] rounded-[2rem] border border-white/14 bg-[linear-gradient(158deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03)_55%,rgba(255,255,255,0.08))] p-4 shadow-[0_34px_80px_rgba(0,0,0,0.32)] md:min-h-[500px] md:p-6">
            <div className="absolute left-4 right-4 top-4 h-20 rounded-2xl border border-white/10 bg-white/[0.05] md:left-6 md:right-6 md:top-6" />

            <div className="relative mt-20 grid gap-4 md:mt-24 md:grid-cols-[1.15fr_0.85fr]">
              <article className="rounded-3xl border border-white/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.26),rgba(255,255,255,0.05))] p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-white/58">{hero.visualLabels.website}</p>
                <div className="mt-6 space-y-3">
                  <div className="h-2.5 w-26 rounded-full bg-white/72" />
                  <div className="h-2 w-36 rounded-full bg-white/34" />
                  <div className="h-2 w-28 rounded-full bg-white/28" />
                  <div className="mt-8 h-24 rounded-2xl border border-white/12 bg-white/[0.08]" />
                </div>
              </article>

              <article className="rounded-3xl border border-white/14 bg-white/[0.06] p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-white/58">{hero.visualLabels.chatbot}</p>
                <div className="mt-5 space-y-2">
                  <div className="h-2 w-20 rounded-full bg-white/58" />
                  <div className="h-2 w-full rounded-full bg-white/30" />
                  <div className="h-2 w-4/5 rounded-full bg-white/25" />
                  <div className="h-2 w-11/12 rounded-full bg-white/22" />
                </div>
              </article>
            </div>

            <article className="relative mt-4 rounded-3xl border border-white/14 bg-white/[0.06] p-5 md:mt-5">
              <p className="text-xs uppercase tracking-[0.14em] text-white/58">{hero.visualLabels.app}</p>
              <div className="mt-4 grid grid-cols-5 gap-2">
                <div className="col-span-2 h-10 rounded-xl bg-white/18" />
                <div className="col-span-1 h-10 rounded-xl bg-white/12" />
                <div className="col-span-2 h-10 rounded-xl bg-white/10" />
                <div className="col-span-3 h-18 rounded-2xl border border-white/12 bg-white/[0.08]" />
                <div className="col-span-2 h-18 rounded-2xl border border-white/12 bg-white/[0.05]" />
              </div>
            </article>
          </div>
        </div>
      </div>
    </Section>
  );
}
