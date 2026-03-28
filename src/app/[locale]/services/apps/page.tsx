import type { Metadata } from "next";

import { ServiceDetailContent } from "@/components/shared/ServiceDetailContent";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type AppServicePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: AppServicePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);
  const content = dictionary.services.details.apps;

  return createPageMetadata({
    locale,
    path: "/services/apps",
    title: content.metadata.title,
    description: content.metadata.description,
  });
}

export default async function AppServicePage({ params }: AppServicePageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);
  const backLabel =
    dictionary.ui.navigation.find((item) => item.href === "/services")?.label ??
    dictionary.ui.buttons.exploreServices;

  return (
    <ServiceDetailContent
      locale={locale}
      content={dictionary.services.details.apps}
      backToServicesLabel={backLabel}
    />
  );
}
