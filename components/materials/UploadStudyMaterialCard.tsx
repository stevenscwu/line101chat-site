import { UploadCloud } from "lucide-react";
import { PrimaryActionButton } from "@/components/shared/PrimaryActionButton";

export function UploadStudyMaterialCard() {
  return (
    <section className="rounded-3xl border border-dashed border-cyan-400/40 bg-cyan-500/10 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-cyan-100">上傳學習素材</p>
          <p className="mt-1 text-sm text-slate-300">
            支援 PDF、圖片、純文字。系統會抽取句型、單字與可練習片段。
          </p>
        </div>
        <UploadCloud className="h-9 w-9 text-cyan-200" />
      </div>
      <div className="mt-4 rounded-2xl border border-cyan-400/40 bg-slate-900/60 p-5 text-center">
        <p className="text-sm text-cyan-100">拖曳檔案到這裡，或點擊選擇檔案</p>
        <PrimaryActionButton className="mt-4">選擇檔案</PrimaryActionButton>
      </div>
    </section>
  );
}
