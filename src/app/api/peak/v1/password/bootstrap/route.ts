import { NextRequest, NextResponse } from "next/server";

import { isPeakDashboardEnabled } from "@/lib/peak/config";
import { readSignedPeakBody } from "@/lib/peak/signed-request";
import { getOwnerPasswordStorageStatus, isValidPasswordHash, loadOwnerPasswordHash, saveOwnerPasswordHash } from "@/lib/peak/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };
const response = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status, headers });

export async function POST(request: NextRequest) {
  if (!isPeakDashboardEnabled()) return response(404, { error: "Not found." });
  const signed = await readSignedPeakBody(request, 2_048);
  if (!signed.ok) return response(signed.status, { error: "Bootstrap request rejected." });
  let hash = "";
  try {
    const body = JSON.parse(signed.body) as { password_hash?: unknown };
    hash = typeof body.password_hash === "string" ? body.password_hash : "";
  } catch { return response(400, { error: "Invalid request." }); }
  if (hash.length > 512 || !isValidPasswordHash(hash)) return response(400, { error: "Invalid password verifier." });
  try {
    if (await getOwnerPasswordStorageStatus() !== "missing") return response(409, { error: "Owner password is already initialized." });
    await saveOwnerPasswordHash(hash);
    const verified = await loadOwnerPasswordHash("");
    if (verified !== hash) throw new Error("verification_failed");
    console.info("peak_owner_password_bootstrapped", { storage: "durable", verified: true });
    return response(200, { initialized: true });
  } catch {
    console.error("peak_owner_password_bootstrap_failed", { reason: "durable_store" });
    return response(503, { error: "Password initialization unavailable." });
  }
}
