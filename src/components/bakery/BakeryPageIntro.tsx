import Link from "next/link";

import { type Locale, withLocale } from "@/lib/i18n/config";

type BakeryAction = {
  label: string;
  href: string;
};

type BakeryPageIntroProps = {
  locale: Locale;
  kicker: string;
  title: string;
  description: string;
  actions?: BakeryAction[];
};

export function BakeryPageIntro({
  locale,
  kicker,
  title,
  description,
  actions = [],
}: BakeryPageIntroProps) {
  return (
    <section className="overflow-hidden rounded-[2.2rem] border border-amber-200/80 bg-gradient-to-br from-[#fffaf0] via-[#fff4e0] to-[#f4e8d8] p-7 shadow-[0_20px_55px_rgba(120,79,32,0.12)] md:p-10">
      <p className="text-xs uppercase tracking-[0.18em] text-amber-900/70">{kicker}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-amber-950 md:text-6xl md:leading-[1.12]">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-amber-950/78 md:text-lg">{description}</p>

      {actions.length > 0 ? (
        <div className="mt-7 flex flex-wrap gap-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={withLocale(locale, action.href)}
              className="rounded-full border border-amber-800/70 bg-amber-900 px-5 py-2.5 text-sm font-medium text-amber-50 transition hover:bg-amber-800"
            >
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
