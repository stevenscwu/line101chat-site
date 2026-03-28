import type { Metadata } from "next";

import { type Locale, withLocale } from "@/lib/i18n/config";

const siteName = "LINE101 Studio";
const defaultTitle = "Premium Digital Studio in Taiwan";
const defaultDescription =
  "A Taiwan-based premium digital studio building websites, RAG chatbots, and custom apps.";

const baseUrl = "https://line101.studio";

export type PageMetadataInput = {
  locale: Locale;
  path: string;
  title?: string;
  description?: string;
};

export function createPageMetadata({
  locale,
  path,
  title,
  description,
}: PageMetadataInput): Metadata {
  const finalTitle = title ? `${title} | ${siteName}` : `${defaultTitle} | ${siteName}`;
  const finalDescription = description ?? defaultDescription;
  const localePath = withLocale(locale, path);

  return {
    metadataBase: new URL(baseUrl),
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: localePath,
      languages: {
        "zh-TW": withLocale("zh-TW", path),
        en: withLocale("en", path),
      },
    },
    openGraph: {
      type: "website",
      title: finalTitle,
      description: finalDescription,
      url: localePath,
      siteName,
      locale: locale === "zh-TW" ? "zh_TW" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
    },
  };
}
