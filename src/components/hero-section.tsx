import { CalendarDays } from "lucide-react";

import { ButtonLink } from "@/components/button-link";
import { PresenterHero } from "@/components/presenter";
import { getSiteContent, localizePath } from "@/data/site";
import type { Locale } from "@/data/site";

export function HeroSection({ locale = "zh" }: { locale?: Locale }) {
  const { hero, primaryCtas } = getSiteContent(locale);

  return (
    <section className="bg-gradient-to-b from-slate-50 to-emerald-50 px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="lg:self-end">
          <p className="inline-flex rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-sm">
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[0] text-slate-950 sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-600 sm:text-xl">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={localizePath(primaryCtas.demo.href, locale)} icon={CalendarDays}>
              {primaryCtas.demo.label}
            </ButtonLink>
            <ButtonLink href={localizePath(primaryCtas.services.href, locale)} variant="secondary">
              {primaryCtas.services.label}
            </ButtonLink>
          </div>
        </div>

        <div className="lg:row-span-2">
          <PresenterHero
            featureCards={hero.features}
            speech={hero.speech}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:self-start">
          {hero.stats.map(([value, label]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-2xl font-black text-slate-950">{value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
