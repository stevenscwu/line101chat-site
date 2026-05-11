import type { MetadataRoute } from "next";

const baseUrl = "https://line101chat.com";

const routes = [
  "",
  "/services",
  "/rag-chatbot",
  "/translation-chatbot",
  "/case-studies",
  "/pricing",
  "/contact",
  "/line",
  "/about",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) => {
    const englishRoute = route === "" ? "/en" : `/en${route}`;

    return [
      {
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: {
            "zh-Hant-TW": `${baseUrl}${route}`,
            en: `${baseUrl}${englishRoute}`,
          },
        },
      },
      {
        url: `${baseUrl}${englishRoute}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 0.9 : 0.7,
        alternates: {
          languages: {
            "zh-Hant-TW": `${baseUrl}${route}`,
            en: `${baseUrl}${englishRoute}`,
          },
        },
      },
    ];
  });
}
