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
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
