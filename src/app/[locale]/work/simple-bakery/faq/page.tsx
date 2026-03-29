import type { Metadata } from "next";

import { BakeryFaqList } from "@/components/bakery/BakeryFaqList";
import { BakeryPageIntro } from "@/components/bakery/BakeryPageIntro";
import { BakerySection } from "@/components/bakery/BakerySection";
import { bakeryFaq } from "@/lib/bakery/content";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type BakeryFaqPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: BakeryFaqPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return createPageMetadata({
    locale,
    path: "/work/simple-bakery/faq",
    title: "簡單純麵包｜常見問題",
    description: "簡單純麵包訂購、保存與配送常見問題。",
  });
}

export default async function BakeryFaqPage({ params }: BakeryFaqPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return (
    <div className="space-y-8">
      <BakeryPageIntro
        locale={locale}
        kicker="FAQ"
        title="常見問題"
        description="訂購前可先查看這些常見問題，快速了解預訂、保存與配送方式。"
      />

      <BakerySection title="問題清單">
        <BakeryFaqList items={bakeryFaq} />
      </BakerySection>
    </div>
  );
}
