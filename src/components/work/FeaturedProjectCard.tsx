import Link from "next/link";

import { ProjectMetaLine } from "@/components/work/ProjectMetaLine";
import { ProjectTag } from "@/components/work/ProjectTag";
import type { WorkFeaturedProject } from "@/components/work/types";
import { type Locale, withLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type FeaturedProjectCardProps = {
  locale: Locale;
  project: WorkFeaturedProject;
  reverse?: boolean;
};

const coverToneClasses: Record<WorkFeaturedProject["coverTone"], string> = {
  indigo:
    "bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.25),transparent_45%),linear-gradient(145deg,#111b37,#172a54_52%,#0e1630)]",
  emerald:
    "bg-[radial-gradient(circle_at_18%_12%,rgba(45,212,191,0.22),transparent_45%),linear-gradient(145deg,#0f2433,#16364a_52%,#0a1b27)]",
  amber:
    "bg-[radial-gradient(circle_at_18%_12%,rgba(245,158,11,0.22),transparent_45%),linear-gradient(145deg,#2c1f13,#47301d_52%,#26180f)]",
  slate:
    "bg-[radial-gradient(circle_at_18%_12%,rgba(148,163,184,0.2),transparent_45%),linear-gradient(145deg,#182131,#253246_52%,#131a29)]",
};

export function FeaturedProjectCard({ locale, project, reverse = false }: FeaturedProjectCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
      <div className={cn("grid items-stretch lg:grid-cols-[1.03fr_0.97fr]", reverse ? "lg:[&>*:first-child]:order-2" : "") }>
        <div className={cn("relative min-h-[260px] overflow-hidden p-6 md:min-h-[340px] md:p-9", coverToneClasses[project.coverTone])}>
          <div className="pointer-events-none absolute -right-20 top-8 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-4 h-44 w-44 rounded-full bg-cyan-200/18 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between">
            <p className="text-xs uppercase tracking-[0.16em] text-white/58">{project.coverLabel}</p>

            <div className="space-y-4">
              <h3 className="max-w-sm text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {project.coverTitle}
              </h3>
              <div className="grid grid-cols-6 gap-2">
                <div className="col-span-4 h-20 rounded-2xl border border-white/20 bg-white/10" />
                <div className="col-span-2 h-20 rounded-2xl border border-white/18 bg-white/8" />
                <div className="col-span-2 h-10 rounded-xl bg-white/16" />
                <div className="col-span-4 h-10 rounded-xl bg-white/8" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-9">
          <div className="space-y-4">
            <ProjectTag>{project.category}</ProjectTag>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{project.title}</h2>
            <p className="text-sm leading-relaxed text-slate-600 md:text-base">{project.summary}</p>
            <ul className="space-y-2.5 pt-1 text-sm text-slate-700">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2.5">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
            <ProjectMetaLine value={project.stack} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale, project.href)}
              className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              {project.cta}
            </Link>
            {project.secondaryHref && project.secondaryCta ? (
              <Link
                href={withLocale(locale, project.secondaryHref)}
                className="inline-flex rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {project.secondaryCta}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
