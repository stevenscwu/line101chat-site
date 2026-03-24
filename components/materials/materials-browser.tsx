"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useState } from "react";
import { MATERIAL_TYPES, StudyMaterial } from "@/lib/content/types";

interface MaterialsBrowserProps {
  materials: StudyMaterial[];
}

const FILTER_OPTIONS = ["all", ...MATERIAL_TYPES] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

function toTitleCase(value: string): string {
  return value.replace(/(^\w|\s\w)/gu, (match) => match.toUpperCase());
}

export function MaterialsBrowser({ materials }: MaterialsBrowserProps) {
  const [activeType, setActiveType] = useState<FilterOption>("all");

  const filtered = useMemo(() => {
    if (activeType === "all") {
      return materials;
    }
    return materials.filter((material) => material.type === activeType);
  }, [activeType, materials]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setActiveType(option)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              activeType === option
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {option === "all" ? "All" : toTitleCase(option)}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((material) => (
          <article key={material.id} className="panel">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{toTitleCase(material.type)}</p>
                <h2 className="mt-1 text-xl font-semibold">{material.title}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{material.topic}</p>
              </div>
              <p className="text-xs text-slate-500">Updated {material.updatedAt}</p>
            </div>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{material.japaneseText}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {material.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/materials/${material.id}` as Route}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Open
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
