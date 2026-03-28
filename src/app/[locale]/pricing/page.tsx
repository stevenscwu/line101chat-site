import type { Metadata } from "next";

import { Section } from "@/components/layout/Section";
import { CTASection } from "@/components/shared/CTASection";
import { PageHero } from "@/components/shared/PageHero";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type PricingPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);

  return createPageMetadata({
    locale,
    path: "/pricing",
    title: dictionary.pages.pricing.metadata.title,
    description: dictionary.pages.pricing.metadata.description,
  });
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);
  const content = dictionary.pages.pricing;

  return (
    <div className="animate-fade-scale">
      <PageHero
        kicker={content.hero.kicker}
        title={content.hero.title}
        description={content.hero.description}
      />

      <Section tone="light">
        <div className="grid gap-4 lg:grid-cols-2">
          {content.offerings.map((offering) => (
            <article
              key={offering.name}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
            >
              <h2 className="text-2xl font-semibold text-slate-900">{offering.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{offering.description}</p>

              <p className="mt-5 text-xs uppercase tracking-[0.12em] text-slate-500">
                {dictionary.ui.common.bestFor}
              </p>
              <p className="mt-1 text-sm text-slate-700">{offering.bestFor}</p>

              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {offering.includes.map((item) => (
                  <li key={item} className="rounded-xl bg-slate-100 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-xs uppercase tracking-[0.12em] text-slate-500">
                {dictionary.ui.common.startingFrom}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{offering.startingFrom}</p>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm text-slate-600">{content.note}</p>
      </Section>

      <CTASection
        locale={locale}
        title={dictionary.home.finalCta.title}
        description={dictionary.home.finalCta.description}
        primary={dictionary.home.finalCta.primary}
        secondary={dictionary.home.finalCta.secondary}
      />
    </div>
  );
}
