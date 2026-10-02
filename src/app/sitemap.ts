import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/guide", "/privacy"].map(path => ({ url: `https://line101chat.com${path}`, changeFrequency: "monthly", priority: path ? 0.5 : 1 })); }
