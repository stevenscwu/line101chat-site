import type { ReactNode } from "react";

import type { Locale } from "@/lib/i18n/config";

import { BakeryFooter } from "./BakeryFooter";
import { BakeryNav } from "./BakeryNav";

type BakeryShellProps = {
  locale: Locale;
  children: ReactNode;
};

export function BakeryShell({ locale, children }: BakeryShellProps) {
  return (
    <div className="bg-[radial-gradient(circle_at_top_left,#fffdf7_0%,#fff7e8_40%,#f7eee0_100%)] text-stone-900">
      <BakeryNav locale={locale} />
      <main className="mx-auto w-full max-w-[1180px] px-5 py-8 md:px-10 md:py-12">{children}</main>
      <BakeryFooter locale={locale} />
    </div>
  );
}
