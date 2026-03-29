import type { Metadata } from "next";

import { BakeryPageIntro } from "@/components/bakery/BakeryPageIntro";
import { BakerySection } from "@/components/bakery/BakerySection";
import { bakeryGroupOrder } from "@/lib/bakery/content";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type BakeryGroupOrderPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: BakeryGroupOrderPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return createPageMetadata({
    locale,
    path: "/work/simple-bakery/group-order",
    title: "簡單純麵包｜團購方案",
    description: "辦公室、企業活動與節慶禮盒團購方案。",
  });
}

export default async function BakeryGroupOrderPage({ params }: BakeryGroupOrderPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return (
    <div className="space-y-8">
      <BakeryPageIntro
        locale={locale}
        kicker="Group Order"
        title="企業與團體團購"
        description={bakeryGroupOrder.intro}
        actions={[{ label: "聯絡討論需求", href: "/work/simple-bakery/contact" }]}
      />

      <BakerySection title="方案選擇" description="以下為常見團購組合，實際內容可依人數與預算調整。">
        <div className="grid gap-4 md:grid-cols-3">
          {bakeryGroupOrder.plans.map((plan) => (
            <article key={plan.name} className="rounded-2xl border border-amber-200 bg-white p-5">
              <h2 className="text-xl font-semibold tracking-tight text-amber-950">{plan.name}</h2>
              <p className="mt-2 text-sm text-amber-900/75">{plan.target}</p>
              <p className="mt-3 text-lg font-semibold text-amber-950">{plan.priceRange}</p>
              <ul className="mt-4 space-y-2 text-sm text-stone-700">
                {plan.includes.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </BakerySection>

      <BakerySection title="排程提醒">
        <p className="text-sm leading-relaxed text-stone-700 md:text-base">{bakeryGroupOrder.leadTime}</p>
      </BakerySection>
    </div>
  );
}
