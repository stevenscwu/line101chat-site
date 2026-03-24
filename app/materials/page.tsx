import type { Metadata } from "next";
import { FileText, Image as ImageIcon, LoaderCircle } from "lucide-react";
import { MaterialInsightCard } from "@/components/materials/MaterialInsightCard";
import { UploadStudyMaterialCard } from "@/components/materials/UploadStudyMaterialCard";
import { materialFiles } from "@/data/site-data";

export const metadata: Metadata = {
  title: "學習素材 | Japanese After 50",
  description:
    "學習素材管理：上傳檔案、查看處理狀態、預覽抽取單字與句型，快速轉成練習內容。"
};

export default function MaterialsPage() {
  return (
    <main className="space-y-6">
      <header className="surface-card">
        <p className="chip-label">學習素材</p>
        <h1 className="mt-2 text-3xl font-black text-white">學習素材</h1>
        <p className="mt-2 text-sm text-slate-300">
          把每天看到的日文素材整理成可以開口練、可以複習、可以分享的學習資源。
        </p>
      </header>

      <UploadStudyMaterialCard />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="surface-card">
          <h2 className="text-lg font-semibold text-white">最近上傳檔案</h2>
          <div className="mt-4 space-y-3">
            {materialFiles.map((file) => (
              <article key={file.id} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {file.type === "pdf" ? (
                      <FileText className="mt-1 h-5 w-5 text-rose-300" />
                    ) : file.type === "image" ? (
                      <ImageIcon className="mt-1 h-5 w-5 text-cyan-300" />
                    ) : (
                      <FileText className="mt-1 h-5 w-5 text-amber-300" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">{file.fileName}</p>
                      <p className="mt-1 text-xs text-slate-400">上傳時間：{file.uploadedAt}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      file.status === "processed"
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "bg-amber-500/20 text-amber-200"
                    }`}
                  >
                    {file.status === "processed" ? "已處理" : "處理中"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  {file.status === "processed" ? `已抽取 ${file.extractedItems} 個學習項目` : "正在抽取文字與句型..."}
                </p>
              </article>
            ))}
          </div>
        </article>

        <div className="space-y-4">
          <MaterialInsightCard extractedVocabulary={42} extractedPhrases={16} generatedDrills={9} />
          <article className="surface-card">
            <h3 className="text-lg font-semibold text-white">處理輸出預覽</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="rounded-xl bg-slate-800/70 px-3 py-2">抽取單字：継続、改善、挑戦、記録</li>
              <li className="rounded-xl bg-slate-800/70 px-3 py-2">抽取句子：辛さは控えめにしていただけますか。</li>
              <li className="rounded-xl bg-slate-800/70 px-3 py-2">發音練習卡：4 張已生成</li>
            </ul>
            <button type="button" className="mt-4 pill">
              <LoaderCircle className="mr-2 h-4 w-4" />
              重新抽取
            </button>
          </article>
        </div>
      </section>
    </main>
  );
}
