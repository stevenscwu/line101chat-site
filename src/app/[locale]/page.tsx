import type { Metadata } from "next";

import { AboutSnapshot } from "@/components/home/AboutSnapshot";
import { FeatureCards } from "@/components/home/FeatureCards";
import { Hero } from "@/components/home/Hero";
import { PricingCards } from "@/components/home/PricingCards";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { ServicePanel } from "@/components/home/ServicePanel";
import { ShowcaseGrid } from "@/components/home/ShowcaseGrid";
import { CTASection } from "@/components/shared/CTASection";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);

  return createPageMetadata({
    locale,
    path: "/",
    title: dictionary.home.metadata.title,
    description: dictionary.home.metadata.description,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);

  return (
    <div className="animate-rise-in">
      <Hero locale={locale} hero={dictionary.home.hero} />

      {dictionary.home.servicePanels.map((panel, index) => (
        <ServicePanel key={panel.id} locale={locale} panel={panel} index={index} />
      ))}

      <FeatureCards content={dictionary.home.whyUs} />
      <ProcessTimeline content={dictionary.home.process} />
      <ShowcaseGrid content={dictionary.home.showcase} />
      <PricingCards
        locale={locale}
        content={dictionary.home.pricingPreview}
        startingFromLabel={dictionary.ui.common.startingFrom}
        bestForLabel={dictionary.ui.common.bestFor}
        recommendedLabel={dictionary.ui.common.recommended}
      />
      <AboutSnapshot locale={locale} content={dictionary.home.aboutSnapshot} />
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
