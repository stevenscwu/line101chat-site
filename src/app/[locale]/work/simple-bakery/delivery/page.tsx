import type { Metadata } from "next";

import { BakeryPageIntro } from "@/components/bakery/BakeryPageIntro";
import { BakerySection } from "@/components/bakery/BakerySection";
import { bakeryDelivery } from "@/lib/bakery/content";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type BakeryDeliveryPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: BakeryDeliveryPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return createPageMetadata({
    locale,
    path: "/work/simple-bakery/delivery",
    title: "簡單純麵包｜配送方式",
    description: "門市自取、雙北快送與全台冷凍宅配資訊。",
  });
}

export default async function BakeryDeliveryPage({ params }: BakeryDeliveryPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return (
    <div className="space-y-8">
      <BakeryPageIntro
        locale={locale}
        kicker="Delivery"
        title="配送與取貨"
        description="支援門市自取、雙北即時配送與全台冷凍宅配，適用一般訂單與團購訂單。"
      />

      <BakerySection title="配送方式">
        <div className="grid gap-4 md:grid-cols-3">
          {bakeryDelivery.methods.map((method) => (
            <article key={method.title} className="rounded-2xl border border-amber-200 bg-white p-5">
              <h2 className="text-xl font-semibold tracking-tight text-amber-950">{method.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">{method.detail}</p>
            </article>
          ))}
        </div>
      </BakerySection>

      <BakerySection title="注意事項">
        <ul className="space-y-2 text-sm leading-relaxed text-stone-700 md:text-base">
          {bakeryDelivery.notes.map((note) => (
            <li key={note}>- {note}</li>
          ))}
        </ul>
      </BakerySection>
    </div>
  );
}
