import type { Metadata } from "next";

import { ServiceDetailContent } from "@/components/shared/ServiceDetailContent";
import { getLocaleDictionary } from "@/lib/i18n/get-dictionary";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type RagServicePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: RagServicePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);
  const content = dictionary.services.details["rag-chatbots"];

  return createPageMetadata({
    locale,
    path: "/services/rag-chatbots",
    title: content.metadata.title,
    description: content.metadata.description,
  });
}

export default async function RagServicePage({ params }: RagServicePageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const dictionary = await getLocaleDictionary(locale);
  const backLabel =
    dictionary.ui.navigation.find((item) => item.href === "/services")?.label ??
    dictionary.ui.buttons.exploreServices;

  return (
    <ServiceDetailContent
      locale={locale}
      content={dictionary.services.details["rag-chatbots"]}
      backToServicesLabel={backLabel}
    />
  );
}
