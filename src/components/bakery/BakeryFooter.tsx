import Link from "next/link";

import { bakeryBrand, bakeryContact } from "@/lib/bakery/content";
import { type Locale, withLocale } from "@/lib/i18n/config";

type BakeryFooterProps = {
  locale: Locale;
};

export function BakeryFooter({ locale }: BakeryFooterProps) {
  return (
    <footer className="border-t border-amber-200 bg-amber-100/70">
      <div className="mx-auto grid w-full max-w-[1180px] gap-6 px-5 py-10 text-sm text-amber-950/88 md:grid-cols-[1.3fr_1fr_1fr] md:px-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-amber-900/70">{bakeryBrand.enName}</p>
          <p className="text-lg font-semibold tracking-tight">{bakeryBrand.zhName}</p>
          <p className="max-w-md leading-relaxed text-amber-900/75">{bakeryBrand.intro}</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.14em] text-amber-900/70">聯絡資訊</p>
          <p>電話：{bakeryContact.phone}</p>
          <p>Email：{bakeryContact.email}</p>
          <p>LINE：{bakeryContact.line}</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.14em] text-amber-900/70">快速前往</p>
          <p>
            <Link href={withLocale(locale, "/work/simple-bakery/products")} className="underline underline-offset-4">
              產品列表
            </Link>
          </p>
          <p>
            <Link href={withLocale(locale, "/work/simple-bakery/group-order")} className="underline underline-offset-4">
              團購方案
            </Link>
          </p>
          <p>
            <Link href={withLocale(locale, "/work/simple-bakery/contact")} className="underline underline-offset-4">
              門市與聯絡
            </Link>
          </p>
        </div>
      </div>
      <div className="border-t border-amber-200/80 px-5 py-4 text-center text-xs text-amber-900/70 md:px-10">
        © 2026 {bakeryBrand.zhName}. Bakery demo for portfolio showcase.
      </div>
    </footer>
  );
}
