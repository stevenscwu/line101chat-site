import { NextResponse } from "next/server";
import { listMaterials } from "@/lib/materials";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const materials = await listMaterials();
    return NextResponse.json({ materials });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "讀取素材清單失敗，請稍後再試。";
    return NextResponse.json({ message }, { status: 500 });
  }
}
