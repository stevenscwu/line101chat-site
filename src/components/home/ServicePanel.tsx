import Link from "next/link";

import { Section } from "@/components/layout/Section";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { type Locale, withLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type ServicePanelProps = {
  locale: Locale;
  panel: Dictionary["home"]["servicePanels"][number];
  index: number;
};

const panelTones: Array<"light" | "dark" | "neutral"> = ["light", "dark", "neutral"];

export function ServicePanel({ locale, panel, index }: ServicePanelProps) {
  const tone = panelTones[index % panelTones.length];

  return (
    <Section tone={tone} className="py-18 md:py-24">
      <div
        className={cn(
          "grid gap-8 rounded-[2rem] border p-7 md:grid-cols-[1.06fr_0.94fr] md:items-center md:p-10",
          tone === "light" &&
            "border-slate-200 bg-[linear-gradient(150deg,#ffffff,#f3f8ff)] shadow-[0_20px_40px_rgba(15,23,42,0.06)]",
          tone === "dark" &&
            "border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))]",
          tone === "neutral" &&
            "border-slate-200 bg-[linear-gradient(152deg,#f8fafc,#eef3f9)] shadow-[0_20px_40px_rgba(15,23,42,0.05)]",
        )}
      >
        <div className="space-y-5">
          <p
            className={cn(
              "text-xs uppercase tracking-[0.14em]",
              tone === "dark" ? "text-white/58" : "text-slate-500",
            )}
          >
            {`0${index + 1}`}
          </p>

          <h2
            className={cn(
              "max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl",
              tone === "dark" ? "text-white" : "text-slate-900",
            )}
          >
            {panel.title}
          </h2>

          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed md:text-lg",
              tone === "dark" ? "text-white/76" : "text-slate-600",
            )}
          >
            {panel.subtitle}
          </p>

          <Link
            href={withLocale(locale, panel.href)}
            className={cn(
              "inline-flex rounded-full px-6 py-3 text-sm font-medium transition",
              tone === "dark"
                ? "border border-white/28 text-white hover:bg-white/10"
                : "border border-slate-300 text-slate-800 hover:bg-white",
            )}
          >
            {panel.cta}
          </Link>
        </div>

        <div
          className={cn(
            "relative min-h-[220px] overflow-hidden rounded-[1.5rem] border p-5 md:min-h-[260px]",
            tone === "dark" ? "border-white/12 bg-white/6" : "border-slate-200 bg-white/70",
          )}
        >
          {index === 0 ? (
            <div className="space-y-3">
              <div className="h-2.5 w-28 rounded-full bg-slate-900/80" />
              <div className="h-2 w-48 rounded-full bg-slate-400/50" />
              <div className="h-28 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-100" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 rounded-xl bg-slate-200/80" />
                <div className="h-10 rounded-xl bg-slate-100" />
              </div>
            </div>
          ) : null}

          {index === 1 ? (
            <div className="space-y-3">
              <div className="ml-auto h-8 w-28 rounded-2xl bg-white/14" />
              <div className="h-10 w-3/4 rounded-2xl border border-white/14 bg-white/8" />
              <div className="ml-auto h-10 w-4/5 rounded-2xl border border-white/14 bg-white/12" />
              <div className="h-10 w-2/3 rounded-2xl border border-white/14 bg-white/8" />
              <div className="mt-3 h-16 rounded-2xl border border-white/14 bg-white/6" />
            </div>
          ) : null}

          {index === 2 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-2 h-10 rounded-xl bg-slate-900/12" />
                <div className="col-span-1 h-10 rounded-xl bg-slate-900/7" />
                <div className="col-span-2 h-10 rounded-xl bg-slate-900/10" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-24 rounded-2xl border border-slate-200 bg-white" />
                <div className="h-24 rounded-2xl border border-slate-200 bg-slate-50" />
              </div>
              <div className="h-12 rounded-xl bg-slate-900/8" />
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
