import { NextResponse } from "next/server";
import { uploadMaterialVersion } from "@/lib/materials";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const materialIdValue = formData.get("materialId");
    const materialId =
      typeof materialIdValue === "string" && materialIdValue.trim()
        ? materialIdValue.trim()
        : undefined;

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "請先選擇要上傳的檔案。" },
        { status: 400 }
      );
    }

    const result = await uploadMaterialVersion(file, { materialId });
    return NextResponse.json(result, { status: result.duplicate ? 200 : 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "上傳失敗，請稍後再試。";
    return NextResponse.json({ message }, { status: 500 });
  }
}
