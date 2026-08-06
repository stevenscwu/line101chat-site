import { NextRequest, NextResponse } from "next/server";

import { createPasswordHash, hasValidOrigin, loginAttemptKey, requestSession, verifyPassword } from "@/lib/peak/auth";
import { loadOwnerPasswordHash, resetAttempts, saveOwnerPasswordHash } from "@/lib/peak/store";
import { requirePeakServerConfig } from "@/lib/peak/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

export async function POST(request: NextRequest) {
  if (!requestSession(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers });
  if (!hasValidOrigin(request)) return NextResponse.json({ error: "Request rejected." }, { status: 403, headers });
  let password = "";
  let confirmation = "";
  try {
    const body = await request.json() as { password?: unknown; confirmation?: unknown };
    password = typeof body.password === "string" ? body.password : "";
    confirmation = typeof body.confirmation === "string" ? body.confirmation : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400, headers });
  }
  if (password.length < 12 || password.length > 256 || password !== confirmation) {
    return NextResponse.json({ error: "Passwords must match and contain 12–256 characters." }, { status: 400, headers });
  }
  let config: ReturnType<typeof requirePeakServerConfig>;
  try {
    const hash = createPasswordHash(password);
    await saveOwnerPasswordHash(hash);
    config = requirePeakServerConfig();
    const persisted = await loadOwnerPasswordHash(config.passwordHash);
    if (persisted !== hash || !verifyPassword(password, persisted)) throw new Error("read_after_write_failed");
  } catch {
    console.error("peak_owner_password_update_failed", { reason: "durable_store_verification" });
    return NextResponse.json({ error: "Password storage unavailable." }, { status: 503, headers });
  }
  try { await resetAttempts(loginAttemptKey(request, config.sessionSecret)); } catch {
    console.warn("peak_owner_password_rate_reset_failed");
  }
  console.info("peak_owner_password_updated", { storage: "durable", verified: true });
  return NextResponse.json({ updated: true }, { headers });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405, headers });
}
