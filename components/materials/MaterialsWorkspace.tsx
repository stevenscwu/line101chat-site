"use client";

import { useMemo, useState } from "react";
import { FileText, Image as ImageIcon, FileCode2, Clock3 } from "lucide-react";
import { EmptyStateCard } from "@/components/shared/EmptyStateCard";
import { MaterialInsightCard } from "@/components/materials/MaterialInsightCard";
import { UploadStudyMaterialCard } from "@/components/materials/UploadStudyMaterialCard";
import type { MaterialRecord, MaterialUploadResult } from "@/lib/materials/types";

interface MaterialsWorkspaceProps {
  initialMaterials: MaterialRecord[];
}

function formatDateTime(dateIso: string): string {
  return new Date(dateIso).toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function iconForKind(kind: MaterialRecord["kind"]) {
  if (kind === "pdf") {
    return <FileText className="mt-1 h-5 w-5 text-rose-300" />;
  }
  if (kind === "image") {
    return <ImageIcon className="mt-1 h-5 w-5 text-cyan-300" />;
  }
  if (kind === "text") {
    return <FileCode2 className="mt-1 h-5 w-5 text-amber-300" />;
  }
  return <FileText className="mt-1 h-5 w-5 text-slate-300" />;
}

function mergeUploadedMaterial(
  current: MaterialRecord[],
  uploaded: MaterialRecord
): MaterialRecord[] {
  const withoutCurrent = current.filter((item) => item.id !== uploaded.id);
  return [uploaded, ...withoutCurrent].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function MaterialsWorkspace({ initialMaterials }: MaterialsWorkspaceProps) {
  const [materials, setMaterials] = useState(initialMaterials);

  const insight = useMemo(() => {
    const extractedVocabulary = materials.reduce(
      (sum, item) => sum + item.extractedItems,
      0
    );
    const extractedPhrases = Math.max(
      0,
      Math.round(extractedVocabulary * 0.35)
    );
    const generatedDrills = Math.max(0, materials.length * 3);

    return {
      extractedVocabulary,
      extractedPhrases,
      generatedDrills
    };
  }, [materials]);

  function onUploadComplete(result: MaterialUploadResult) {
    setMaterials((current) => mergeUploadedMaterial(current, result.material));
  }

  return (
    <div className="space-y-4">
      <UploadStudyMaterialCard onUploaded={onUploadComplete} />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="surface-card">
          <h2 className="text-lg font-semibold text-white">最近上傳檔案（版本化）</h2>

          {materials.length === 0 ? (
            <div className="mt-4">
              <EmptyStateCard
                title="還沒有素材"
                description="先上傳第一份 PDF、圖片或文字，系統就會建立 v1 版本。"
              />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {materials.map((material) => {
                const latest = material.versions[0];

                return (
                  <article
                    key={material.id}
                    className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {iconForKind(material.kind)}
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {material.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            更新時間：{formatDateTime(material.updatedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-100">
                          v{material.latestVersion}
                        </span>
                        <span className="rounded-full bg-slate-700 px-2 py-1 text-xs text-slate-300">
                          {material.versions.length} 個版本
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                      <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                      最新上傳：{latest ? formatDateTime(latest.uploadedAt) : "-"}
                    </div>

                    {latest ? (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <a
                          href={latest.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="pill"
                        >
                          下載最新版本
                        </a>
                        <span className="text-xs text-slate-400">
                          SHA256: {latest.sha256.slice(0, 10)}...
                        </span>
                      </div>
                    ) : null}

                    <details className="mt-3 rounded-xl border border-slate-700 bg-slate-900/55 p-3">
                      <summary className="cursor-pointer text-sm text-cyan-100">
                        查看版本歷史
                      </summary>
                      <ul className="mt-2 space-y-2 text-xs text-slate-300">
                        {material.versions.map((version) => (
                          <li
                            key={`${material.id}-v${version.version}`}
                            className="rounded-lg bg-slate-800/80 px-2 py-2"
                          >
                            v{version.version} • {version.originalFilename} •{" "}
                            {Math.max(1, Math.round(version.sizeBytes / 1024))}KB
                          </li>
                        ))}
                      </ul>
                    </details>
                  </article>
                );
              })}
            </div>
          )}
        </article>

        <div className="space-y-4">
          <MaterialInsightCard
            extractedVocabulary={insight.extractedVocabulary}
            extractedPhrases={insight.extractedPhrases}
            generatedDrills={insight.generatedDrills}
          />
          <article className="surface-card">
            <h3 className="text-lg font-semibold text-white">v2 版本控管說明</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="rounded-xl bg-slate-800/70 px-3 py-2">
                相同素材主題（同檔名基底）會自動累積版本 v1, v2, v3...
              </li>
              <li className="rounded-xl bg-slate-800/70 px-3 py-2">
                每次上傳都保留 SHA256 指紋，避免重複版本污染。
              </li>
              <li className="rounded-xl bg-slate-800/70 px-3 py-2">
                檔案採不可變版本儲存，可隨時回看舊版本內容。
              </li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
