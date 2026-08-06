import { NextRequest, NextResponse } from "next/server";

import { requestSession } from "@/lib/peak/auth";
import { isPeakDashboardEnabled } from "@/lib/peak/config";
import { loadExecutiveState, loadPeakSnapshot } from "@/lib/peak/store";
import { allowAttempt } from "@/lib/peak/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

export async function GET(request: NextRequest) {
  if (!isPeakDashboardEnabled()) return NextResponse.json({ error: "Not found." }, { status: 404, headers });
  const session = requestSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers });
  if (!(await allowAttempt(`summary:${session.jti}`, 60, 60))) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429, headers });
  }
  try {
    const executive = await loadExecutiveState();
    if (executive) return NextResponse.json(executive, { headers });
    const record = await loadPeakSnapshot();
    if (!record) return NextResponse.json({ state: "unavailable", reason: "No synchronized snapshot." }, { status: 503, headers });
    return NextResponse.json(record, { headers });
  } catch {
    console.error("peak_api_unavailable");
    return NextResponse.json({ state: "error", reason: "Peak OS data is temporarily unavailable." }, { status: 503, headers });
  }
}

export async function POST() {
  return NextResponse.json({ error: "Read-only endpoint." }, { status: 405, headers });
}
