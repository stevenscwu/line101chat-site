import type { MetadataRoute } from "next";

import { locales, withLocale } from "@/lib/i18n/config";

const baseUrl = "https://line101.studio";

const pages = [
  "/",
  "/services",
  "/services/websites",
  "/services/rag-chatbots",
  "/services/apps",
  "/work",
  "/process",
  "/pricing",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}${withLocale(locale, page)}`,
      lastModified: now,
      changeFrequency: page === "/" ? "weekly" : "monthly",
      priority: page === "/" ? 1 : 0.7,
    })),
  );
}
