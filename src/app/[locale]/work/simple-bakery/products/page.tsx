import type { Metadata } from "next";

import { BakeryPageIntro } from "@/components/bakery/BakeryPageIntro";
import { BakeryProductCard } from "@/components/bakery/BakeryProductCard";
import { BakerySection } from "@/components/bakery/BakerySection";
import { bakeryProducts } from "@/lib/bakery/content";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type BakeryProductsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: BakeryProductsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return createPageMetadata({
    locale,
    path: "/work/simple-bakery/products",
    title: "簡單純麵包｜產品列表",
    description: "查看簡單純麵包經典吐司、捲類與季節麵包品項。",
  });
}

export default async function BakeryProductsPage({ params }: BakeryProductsPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return (
    <div className="space-y-8">
      <BakeryPageIntro
        locale={locale}
        kicker="Products"
        title="每日烘焙品項"
        description="以台灣飲食日常為核心，提供可早餐、可點心、可送禮的麵包選擇。"
        actions={[{ label: "查看配送方式", href: "/work/simple-bakery/delivery" }]}
      />

      <BakerySection
        title="品項總覽"
        description="每一款品項都有建議食用方式、保存條件與出爐日，方便門市與團購安排。"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {bakeryProducts.map((product) => (
            <BakeryProductCard key={product.slug} locale={locale} product={product} />
          ))}
        </div>
      </BakerySection>
    </div>
  );
}
