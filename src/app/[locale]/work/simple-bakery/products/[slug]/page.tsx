import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BakeryPageIntro } from "@/components/bakery/BakeryPageIntro";
import { BakerySection } from "@/components/bakery/BakerySection";
import { bakeryProducts, getBakeryProductBySlug } from "@/lib/bakery/content";
import { withLocale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type BakeryProductDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return bakeryProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: BakeryProductDetailPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = resolveLocale(localeParam);
  const product = getBakeryProductBySlug(slug);

  if (!product) {
    return createPageMetadata({
      locale,
      path: "/work/simple-bakery/products",
      title: "找不到產品",
      description: "此產品不存在或已下架。",
    });
  }

  return createPageMetadata({
    locale,
    path: `/work/simple-bakery/products/${product.slug}`,
    title: `簡單純麵包｜${product.name}`,
    description: product.summary,
  });
}

export default async function BakeryProductDetailPage({ params }: BakeryProductDetailPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = resolveLocale(localeParam);
  const product = getBakeryProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <BakeryPageIntro
        locale={locale}
        kicker="Product Detail"
        title={product.name}
        description={`${product.subtitle}｜${product.summary}`}
        actions={[
          { label: "回到產品列表", href: "/work/simple-bakery/products" },
          { label: "洽詢團購", href: "/work/simple-bakery/group-order" },
        ]}
      />

      <BakerySection title="產品規格">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-amber-900/65">建議售價</p>
            <p className="mt-2 text-2xl font-semibold text-amber-950">{product.price}</p>
          </article>
          <article className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-amber-900/65">單顆重量</p>
            <p className="mt-2 text-2xl font-semibold text-amber-950">{product.weight}</p>
          </article>
          <article className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-amber-900/65">出爐日</p>
            <p className="mt-2 text-lg font-semibold text-amber-950">{product.bakingDays}</p>
          </article>
        </div>
      </BakerySection>

      <BakerySection title="風味與保存">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-amber-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-amber-950">主要原料</h2>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              {product.ingredients.map((ingredient) => (
                <li key={ingredient}>- {ingredient}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-amber-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-amber-950">品嚐筆記</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">{product.tastingNotes}</p>
            <h3 className="mt-5 text-base font-semibold text-amber-950">保存方式</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">{product.storage}</p>
            <h3 className="mt-5 text-base font-semibold text-amber-950">過敏原資訊</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">{product.allergens.join("、")}</p>
          </article>
        </div>
      </BakerySection>

      <BakerySection title="下一步" description="若需大量訂購或配送安排，可直接前往團購與聯絡頁。">
        <div className="flex flex-wrap gap-3">
          <Link
            href={withLocale(locale, "/work/simple-bakery/group-order")}
            className="rounded-full border border-amber-800/70 bg-amber-900 px-5 py-2.5 text-sm font-medium text-amber-50 transition hover:bg-amber-800"
          >
            團購詢問
          </Link>
          <Link
            href={withLocale(locale, "/work/simple-bakery/contact")}
            className="rounded-full border border-amber-800/70 px-5 py-2.5 text-sm font-medium text-amber-900 transition hover:bg-amber-900 hover:text-amber-50"
          >
            聯絡門市
          </Link>
        </div>
      </BakerySection>
    </div>
  );
}
