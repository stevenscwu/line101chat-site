import { NextRequest, NextResponse } from "next/server";

import { requestSession } from "@/lib/peak/auth";
import { isPeakDashboardEnabled } from "@/lib/peak/config";
import { loadExecutiveState } from "@/lib/peak/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

export async function GET(request: NextRequest) {
  if (!isPeakDashboardEnabled()) return NextResponse.json({ status: "disabled" }, { status: 404, headers });
  if (!requestSession(request)) return NextResponse.json({ status: "unauthorized" }, { status: 401, headers });
  try {
    const record = await loadExecutiveState();
    return NextResponse.json({
      status: record ? "available" : "offline",
      schema_version: record?.state.schema_version ?? null,
      generated_at: record?.state.generated_at ?? null,
      received_at: record?.received_at ?? null,
    }, { status: record ? 200 : 503, headers });
  } catch {
    console.error("peak_health_check_failed", { reason: "private_store" });
    return NextResponse.json({ status: "error" }, { status: 503, headers });
  }
}
