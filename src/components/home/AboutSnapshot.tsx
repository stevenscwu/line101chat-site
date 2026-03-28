import Link from "next/link";

import { Section } from "@/components/layout/Section";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { type Locale, withLocale } from "@/lib/i18n/config";

type AboutSnapshotProps = {
  locale: Locale;
  content: Dictionary["home"]["aboutSnapshot"];
};

export function AboutSnapshot({ locale, content }: AboutSnapshotProps) {
  return (
    <Section tone="neutral">
      <div className="grid gap-8 rounded-[2.2rem] border border-slate-200 bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.06)] md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[2.45rem] md:leading-[1.18]">
            {content.title}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600">{content.description}</p>
          <Link
            href={withLocale(locale, content.href)}
            className="inline-flex rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {content.cta}
          </Link>
        </div>

        <ul className="space-y-3">
          {content.points.map((point) => (
            <li
              key={point}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
