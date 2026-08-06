import { NextRequest, NextResponse } from "next/server";

import { requestSession } from "@/lib/peak/auth";
import { isPeakDashboardEnabled } from "@/lib/peak/config";
import { parseExecutiveState } from "@/lib/peak/executive-validation";
import { readSignedPeakBody } from "@/lib/peak/signed-request";
import { allowAttempt, loadExecutiveState, saveExecutiveState } from "@/lib/peak/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };
const reject = (status: number, error = "Request rejected.") => NextResponse.json({ error }, { status, headers });

export async function POST(request: NextRequest) {
  if (!isPeakDashboardEnabled()) return reject(404);
  const signed = await readSignedPeakBody(request);
  if (!signed.ok) return reject(signed.status);
  let value: unknown;
  try { value = JSON.parse(signed.body); } catch { return reject(400); }
  const state = parseExecutiveState(value);
  if (!state) {
    console.warn("peak_executive_state_rejected", { reason: "schema_validation" });
    return reject(400);
  }
  try {
    const stored = await saveExecutiveState(state);
    console.info("peak_executive_state_sync_success", { schema_version: state.schema_version });
    return NextResponse.json({ accepted: true, schema_version: state.schema_version, received_at: stored.received_at }, { headers });
  } catch {
    console.error("peak_executive_state_sync_failed", { reason: "private_store" });
    return reject(503);
  }
}

export async function GET(request: NextRequest) {
  if (!isPeakDashboardEnabled()) return reject(404, "Not found.");
  const session = requestSession(request);
  if (!session) return reject(401, "Unauthorized.");
  try {
    if (!(await allowAttempt(`executive:${session.jti}`, 60, 60))) return reject(429, "Too many requests.");
    const record = await loadExecutiveState();
    if (!record) return reject(503, "No synchronized Executive State.");
    return NextResponse.json(record, { headers });
  } catch {
    console.error("peak_executive_state_read_failed", { reason: "private_store" });
    return reject(503, "Executive State is temporarily unavailable.");
  }
}
