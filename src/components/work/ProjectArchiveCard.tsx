import Link from "next/link";

import { ProjectTag } from "@/components/work/ProjectTag";
import type { WorkArchiveProject } from "@/components/work/types";
import { type Locale, withLocale } from "@/lib/i18n/config";

const coverToneClasses: Record<WorkArchiveProject["coverTone"], string> = {
  indigo:
    "bg-[radial-gradient(circle_at_25%_10%,rgba(56,189,248,0.22),transparent_46%),linear-gradient(150deg,#101a33,#1a2d52_55%,#0d1630)]",
  emerald:
    "bg-[radial-gradient(circle_at_25%_10%,rgba(45,212,191,0.2),transparent_46%),linear-gradient(150deg,#102838,#174156_55%,#0d2230)]",
  amber:
    "bg-[radial-gradient(circle_at_25%_10%,rgba(245,158,11,0.2),transparent_46%),linear-gradient(150deg,#2b1f14,#4a341d_55%,#25180f)]",
  slate:
    "bg-[radial-gradient(circle_at_25%_10%,rgba(148,163,184,0.2),transparent_46%),linear-gradient(150deg,#1a2536,#27364b_55%,#131c2a)]",
};

type ProjectArchiveCardProps = {
  locale: Locale;
  project: WorkArchiveProject;
};

export function ProjectArchiveCard({ locale, project }: ProjectArchiveCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(15,23,42,0.08)]">
      <div className="p-4 pb-0">
        <div className={`${coverToneClasses[project.coverTone]} relative aspect-[16/10] overflow-hidden rounded-[1.2rem] border border-white/15`}>
          <div className="pointer-events-none absolute inset-x-4 top-4 h-10 rounded-xl bg-white/12" />
          <div className="pointer-events-none absolute inset-x-4 bottom-4 grid grid-cols-6 gap-2">
            <div className="col-span-4 h-16 rounded-xl border border-white/18 bg-white/10" />
            <div className="col-span-2 h-16 rounded-xl border border-white/14 bg-white/8" />
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <ProjectTag>{project.category}</ProjectTag>
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{project.title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{project.summary}</p>

        {project.href ? (
          <Link
            href={withLocale(locale, project.href)}
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 transition group-hover:text-slate-900"
          >
            {project.cta}
            <span aria-hidden>→</span>
          </Link>
        ) : (
          <p className="text-sm font-medium text-slate-400">{project.cta}</p>
        )}
      </div>
    </article>
  );
}
