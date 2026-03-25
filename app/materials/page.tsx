import type { Metadata } from "next";
import { MaterialsWorkspace } from "@/components/materials/MaterialsWorkspace";
import { listMaterials } from "@/lib/materials";

export const metadata: Metadata = {
  title: "學習素材 | Japanese After 50",
  description:
    "學習素材管理 v2：拖曳上傳、版本控管、檔案指紋與版本歷史，讓素材演進可追蹤。"
};

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  const materials = await listMaterials();

  return (
    <main className="space-y-6">
      <header className="surface-card">
        <p className="chip-label">學習素材</p>
        <h1 className="mt-2 text-3xl font-black text-white">學習素材 v2</h1>
        <p className="mt-2 text-sm text-slate-300">
          現在可直接拖曳上傳，並自動建立版本歷史，讓每次修訂都能追蹤與回溯。
        </p>
      </header>

      <MaterialsWorkspace initialMaterials={materials} />
    </main>
  );
}
