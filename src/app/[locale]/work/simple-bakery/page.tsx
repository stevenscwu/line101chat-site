import Link from "next/link";
import type { Metadata } from "next";

import { BakeryNewsCard } from "@/components/bakery/BakeryNewsCard";
import { BakeryPageIntro } from "@/components/bakery/BakeryPageIntro";
import { BakeryProductCard } from "@/components/bakery/BakeryProductCard";
import { BakerySection } from "@/components/bakery/BakerySection";
import {
  bakeryBrand,
  bakeryContact,
  bakeryFeaturedProductSlugs,
  bakeryNews,
  bakeryProducts,
} from "@/lib/bakery/content";
import { withLocale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type BakeryLandingPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: BakeryLandingPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return createPageMetadata({
    locale,
    path: "/work/simple-bakery",
    title: "簡單純麵包｜暖心烘焙展示站",
    description: "簡單純麵包品牌展示頁，包含產品、配送、團購與門市資訊。",
  });
}

export default async function BakeryLandingPage({ params }: BakeryLandingPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const featuredSlugSet = new Set<string>(bakeryFeaturedProductSlugs);
  const featuredProducts = bakeryProducts.filter((product) => featuredSlugSet.has(product.slug));

  return (
    <div className="space-y-8">
      <BakeryPageIntro
        locale={locale}
        kicker="簡單純麵包 / Simple Pure Bakery"
        title="一間給台灣日常的精品麵包店"
        description={bakeryBrand.intro}
        actions={[
          { label: "查看當季產品", href: "/work/simple-bakery/products" },
          { label: "了解團購方案", href: "/work/simple-bakery/group-order" },
        ]}
      />

      <BakerySection
        title="品牌語氣"
        description="Warm, editorial, premium bakery，帶有自然光感與台灣生活節奏。"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-amber-200 bg-white p-5">
            <p className="text-sm leading-relaxed text-stone-700">以早晨與傍晚兩個出爐節奏，讓社區居民可以在日常路線中自然買到好麵包。</p>
          </article>
          <article className="rounded-2xl border border-amber-200 bg-white p-5">
            <p className="text-sm leading-relaxed text-stone-700">視覺走向使用奶油白、烘焙焦糖與亞麻布紋理，保留手作與生活感。</p>
          </article>
          <article className="rounded-2xl border border-amber-200 bg-white p-5">
            <p className="text-sm leading-relaxed text-stone-700">文案主軸強調原料透明、發酵時間與適合送禮的細緻體驗。</p>
          </article>
        </div>
      </BakerySection>

      <BakerySection
        title="精選品項"
        description="展示站先以 3 款代表商品呈現品牌調性，完整清單可前往產品頁查看。"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <BakeryProductCard key={product.slug} locale={locale} product={product} compact />
          ))}
        </div>
      </BakerySection>

      <BakerySection title="最新消息" description="同步門市公告、檔期與團購方案。">
        <div className="grid gap-4 md:grid-cols-3">
          {bakeryNews.slice(0, 3).map((item) => (
            <BakeryNewsCard key={item.slug} item={item} />
          ))}
        </div>
      </BakerySection>

      <BakerySection title="門市資訊" description="提供門市自取、雙北快送與全台冷凍宅配。">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3 rounded-2xl border border-amber-200 bg-white p-5">
            <p className="text-sm text-stone-700">{bakeryContact.address}</p>
            <p className="text-sm text-stone-700">電話：{bakeryContact.phone}</p>
            <p className="text-sm text-stone-700">Email：{bakeryContact.email}</p>
            <p className="text-sm text-stone-700">LINE：{bakeryContact.line}</p>
          </div>
          <div className="space-y-3 rounded-2xl border border-amber-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-amber-900/70">營業時段</p>
            <ul className="space-y-2 text-sm text-stone-700">
              {bakeryContact.hours.map((hour) => (
                <li key={hour}>{hour}</li>
              ))}
            </ul>
            <Link
              href={withLocale(locale, "/work/simple-bakery/contact")}
              className="inline-flex rounded-full border border-amber-800/70 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-900 hover:text-amber-50"
            >
              前往聯絡頁
            </Link>
          </div>
        </div>
      </BakerySection>
    </div>
  );
}
