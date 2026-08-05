import { createHmac, timingSafeEqual } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { isPeakDashboardEnabled, requireSyncSecret } from "@/lib/peak/config";
import { consumeReplayNonce } from "@/lib/peak/store";
import { savePeakSnapshot } from "@/lib/peak/store";
import { parsePeakSnapshot } from "@/lib/peak/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 256 * 1_024;
const MAX_CLOCK_SKEW_SECONDS = 300;
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

function reject(status = 401) {
  return NextResponse.json({ error: "Request rejected." }, { status, headers });
}

export async function POST(request: NextRequest) {
  if (!isPeakDashboardEnabled()) return reject(404);
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BYTES) return reject(413);
  const timestamp = request.headers.get("x-peak-timestamp") || "";
  const nonce = request.headers.get("x-peak-nonce") || "";
  const signature = request.headers.get("x-peak-signature") || "";
  if (!/^\d{10}$/u.test(timestamp) || !/^[a-f0-9]{32}$/u.test(nonce) || !/^[a-f0-9]{64}$/u.test(signature)) return reject();
  const age = Math.abs(Math.floor(Date.now() / 1_000) - Number(timestamp));
  if (age > MAX_CLOCK_SKEW_SECONDS) return reject();
  const body = await request.text();
  if (Buffer.byteLength(body) > MAX_BYTES) return reject(413);
  let secret: string;
  try { secret = requireSyncSecret(); } catch { return reject(503); }
  const expected = createHmac("sha256", secret).update(`${timestamp}.${nonce}.${body}`).digest("hex");
  const valid = signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid || !(await consumeReplayNonce(nonce))) return reject();
  let parsed: unknown;
  try { parsed = JSON.parse(body); } catch { return reject(400); }
  const snapshot = parsePeakSnapshot(parsed);
  if (!snapshot) {
    console.warn("peak_payload_validation_failed");
    return reject(400);
  }
  try {
    await savePeakSnapshot(snapshot);
    console.info("peak_snapshot_sync_success");
    return NextResponse.json({ accepted: true, schemaVersion: 1 }, { headers });
  } catch {
    console.error("peak_snapshot_storage_unavailable");
    return reject(503);
  }
}

export async function GET() {
  return reject(405);
}
