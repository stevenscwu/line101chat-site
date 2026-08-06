import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/translation-service/admin",
          "/api/translation-payments",
          "/peak",
          "/peak-os",
          "/api/peak",
        ],
      },
    ],
    sitemap: "https://line101chat.com/sitemap.xml",
  };
}
