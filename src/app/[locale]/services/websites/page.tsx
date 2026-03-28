import type { Metadata } from "next";

import { ServiceDetailContent } from "@/components/shared/ServiceDetailContent";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type WebsiteServicePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: WebsiteServicePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);
  const content = dictionary.services.details.websites;

  return createPageMetadata({
    locale,
    path: "/services/websites",
    title: content.metadata.title,
    description: content.metadata.description,
  });
}

export default async function WebsiteServicePage({ params }: WebsiteServicePageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);
  const backLabel =
    dictionary.ui.navigation.find((item) => item.href === "/services")?.label ??
    dictionary.ui.buttons.exploreServices;

  return (
    <ServiceDetailContent
      locale={locale}
      content={dictionary.services.details.websites}
      backToServicesLabel={backLabel}
    />
  );
}
