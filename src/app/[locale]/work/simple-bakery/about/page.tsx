import type { Metadata } from "next";

import { BakeryPageIntro } from "@/components/bakery/BakeryPageIntro";
import { BakerySection } from "@/components/bakery/BakerySection";
import { bakeryAbout } from "@/lib/bakery/content";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type BakeryAboutPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: BakeryAboutPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return createPageMetadata({
    locale,
    path: "/work/simple-bakery/about",
    title: "簡單純麵包｜關於我們",
    description: "認識簡單純麵包的品牌故事與烘焙理念。",
  });
}

export default async function BakeryAboutPage({ params }: BakeryAboutPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return (
    <div className="space-y-8">
      <BakeryPageIntro
        locale={locale}
        kicker="About"
        title="關於簡單純麵包"
        description={bakeryAbout.story}
        actions={[{ label: "查看產品", href: "/work/simple-bakery/products" }]}
      />

      <BakerySection title="我們堅持的三件事">
        <div className="grid gap-4 md:grid-cols-3">
          {bakeryAbout.values.map((value) => (
            <article key={value.title} className="rounded-2xl border border-amber-200 bg-white p-5">
              <h2 className="text-xl font-semibold tracking-tight text-amber-950">{value.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-700">{value.description}</p>
            </article>
          ))}
        </div>
      </BakerySection>

      <BakerySection title="團隊說明">
        <p className="max-w-3xl text-sm leading-relaxed text-stone-700 md:text-base">{bakeryAbout.teamNote}</p>
      </BakerySection>
    </div>
  );
}
