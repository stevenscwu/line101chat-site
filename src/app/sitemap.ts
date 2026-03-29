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
  "/work/simple-bakery",
  "/work/simple-bakery/products",
  "/work/simple-bakery/products/classic-milk-toast",
  "/work/simple-bakery/products/brown-sugar-cinnamon-roll",
  "/work/simple-bakery/products/sea-salt-butter-roll",
  "/work/simple-bakery/products/red-bean-brioche",
  "/work/simple-bakery/about",
  "/work/simple-bakery/group-order",
  "/work/simple-bakery/delivery",
  "/work/simple-bakery/news",
  "/work/simple-bakery/faq",
  "/work/simple-bakery/contact",
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
