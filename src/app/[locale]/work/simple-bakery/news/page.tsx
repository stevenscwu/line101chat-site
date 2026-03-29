import type { Metadata } from "next";

import { BakeryNewsCard } from "@/components/bakery/BakeryNewsCard";
import { BakeryPageIntro } from "@/components/bakery/BakeryPageIntro";
import { BakerySection } from "@/components/bakery/BakerySection";
import { bakeryNews } from "@/lib/bakery/content";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type BakeryNewsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: BakeryNewsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return createPageMetadata({
    locale,
    path: "/work/simple-bakery/news",
    title: "簡單純麵包｜最新消息",
    description: "最新檔期、出爐時段與團購活動消息。",
  });
}

export default async function BakeryNewsPage({ params }: BakeryNewsPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return (
    <div className="space-y-8">
      <BakeryPageIntro
        locale={locale}
        kicker="News"
        title="最新消息"
        description="同步發布新品、檔期、配送與門市營業資訊。"
      />

      <BakerySection title="公告列表">
        <div className="grid gap-4 md:grid-cols-3">
          {bakeryNews.map((item) => (
            <BakeryNewsCard key={item.slug} item={item} />
          ))}
        </div>
      </BakerySection>
    </div>
  );
}
