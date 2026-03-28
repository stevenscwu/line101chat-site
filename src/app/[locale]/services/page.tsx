import Link from "next/link";
import type { Metadata } from "next";

import { Section } from "@/components/layout/Section";
import { CTASection } from "@/components/shared/CTASection";
import { PageHero } from "@/components/shared/PageHero";
import { withLocale } from "@/lib/i18n/config";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type ServicesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);

  return createPageMetadata({
    locale,
    path: "/services",
    title: dictionary.services.overview.metadata.title,
    description: dictionary.services.overview.metadata.description,
  });
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);
  const content = dictionary.services.overview;

  return (
    <div className="animate-fade-scale">
      <PageHero
        kicker={content.hero.kicker}
        title={content.hero.title}
        description={content.hero.description}
      />

      <Section tone="light">
        <div className="grid gap-4 md:grid-cols-3">
          {content.cards.map((card) => (
            <article
              key={card.slug}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{card.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.summary}</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {card.includes.map((item) => (
                  <li key={item} className="rounded-xl bg-slate-100/80 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={withLocale(locale, card.href)}
                className="mt-6 inline-flex rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {card.cta}
              </Link>
            </article>
          ))}
        </div>
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
