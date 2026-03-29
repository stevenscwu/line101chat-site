import type { Metadata } from "next";

import { BakeryPageIntro } from "@/components/bakery/BakeryPageIntro";
import { BakerySection } from "@/components/bakery/BakerySection";
import { bakeryContact } from "@/lib/bakery/content";
import { resolveLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

type BakeryContactPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: BakeryContactPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return createPageMetadata({
    locale,
    path: "/work/simple-bakery/contact",
    title: "簡單純麵包｜聯絡門市",
    description: "簡單純麵包門市地址、營業時段與聯絡方式。",
  });
}

export default async function BakeryContactPage({ params }: BakeryContactPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return (
    <div className="space-y-8">
      <BakeryPageIntro
        locale={locale}
        kicker="Contact"
        title="門市與聯絡"
        description="歡迎來店選購，也可以透過電話、Email 或 LINE 先行預訂。"
      />

      <BakerySection title="聯絡資訊">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-amber-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-amber-950">基本資訊</h2>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              <li>地址：{bakeryContact.address}</li>
              <li>電話：{bakeryContact.phone}</li>
              <li>Email：{bakeryContact.email}</li>
              <li>LINE：{bakeryContact.line}</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-amber-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-amber-950">營業時段</h2>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              {bakeryContact.hours.map((hour) => (
                <li key={hour}>{hour}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-stone-700">{bakeryContact.contactReminder}</p>
          </article>
        </div>
      </BakerySection>

      <BakerySection title="快速聯絡">
        <div className="flex flex-wrap gap-3">
          <a
            href={`tel:${bakeryContact.phone.replace(/-/g, "")}`}
            className="rounded-full border border-amber-800/70 bg-amber-900 px-5 py-2.5 text-sm font-medium text-amber-50 transition hover:bg-amber-800"
          >
            撥打電話
          </a>
          <a
            href={`mailto:${bakeryContact.email}`}
            className="rounded-full border border-amber-800/70 px-5 py-2.5 text-sm font-medium text-amber-900 transition hover:bg-amber-900 hover:text-amber-50"
          >
            寄送 Email
          </a>
          <a
            href={`https://line.me/R/ti/p/${bakeryContact.line.replace("@", "")}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-amber-800/70 px-5 py-2.5 text-sm font-medium text-amber-900 transition hover:bg-amber-900 hover:text-amber-50"
          >
            開啟 LINE
          </a>
        </div>
      </BakerySection>
    </div>
  );
}
