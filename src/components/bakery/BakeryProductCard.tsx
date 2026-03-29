import Link from "next/link";

import type { BakeryProduct } from "@/lib/bakery/content";
import { type Locale, withLocale } from "@/lib/i18n/config";

type BakeryProductCardProps = {
  locale: Locale;
  product: BakeryProduct;
  compact?: boolean;
};

export function BakeryProductCard({ locale, product, compact = false }: BakeryProductCardProps) {
  return (
    <article className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 shadow-[0_10px_24px_rgba(120,79,32,0.08)]">
      <div className="flex flex-wrap items-center gap-2">
        {product.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs text-amber-900/80">
            {tag}
          </span>
        ))}
      </div>

      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-amber-950">{product.name}</h3>
      <p className="mt-2 text-sm text-amber-950/72">{product.subtitle}</p>
      <p className="mt-3 text-sm leading-relaxed text-stone-700">{product.summary}</p>

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-amber-200 pt-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-amber-900/65">參考售價</p>
          <p className="text-lg font-semibold text-amber-950">{product.price}</p>
        </div>
        <Link
          href={withLocale(locale, `/work/simple-bakery/products/${product.slug}`)}
          className="rounded-full border border-amber-800/70 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-900 hover:text-amber-50"
        >
          {compact ? "查看" : "查看品項"}
        </Link>
      </div>
    </article>
  );
}
