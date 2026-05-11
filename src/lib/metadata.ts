import type { Metadata } from "next";

import { localizePath, siteContent } from "@/data/site";
import type { Locale } from "@/data/site";

type PageKey = keyof typeof siteContent.zh.pages;

export function localizedMetadata(locale: Locale, pageKey: PageKey): Metadata {
  const page = siteContent[locale].pages[pageKey];
  const canonical = page.metadata.canonical;

  return {
    title: page.metadata.title,
    description: page.metadata.description,
    alternates: {
      canonical,
      languages: {
        "zh-Hant-TW": localizePath(canonical, "zh"),
        en: localizePath(canonical, "en"),
      },
    },
    openGraph: {
      title: page.metadata.title,
      description: page.metadata.description,
      url: canonical,
      locale: locale === "en" ? "en_US" : "zh_TW",
      siteName: "LINE101Chat",
    },
    twitter: {
      card: "summary",
      title: page.metadata.title,
      description: page.metadata.description,
    },
  };
}
