import { NextRequest, NextResponse } from "next/server";

import { createPasswordHash, hasValidOrigin, requestSession } from "@/lib/peak/auth";
import { saveOwnerPasswordHash } from "@/lib/peak/store";

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
  try {
    await saveOwnerPasswordHash(createPasswordHash(password));
    console.info("peak_owner_password_updated");
    return NextResponse.json({ updated: true }, { headers });
  } catch {
    console.error("peak_owner_password_update_failed");
    return NextResponse.json({ error: "Password storage unavailable." }, { status: 503, headers });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405, headers });
}
