import { createHmac } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { createSession, hasValidOrigin, setSessionCookie, verifySubmittedPassword } from "@/lib/peak/auth";
import { isPeakDashboardEnabled, requirePeakServerConfig } from "@/lib/peak/config";
import { allowAttempt } from "@/lib/peak/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function loginUrl(request: NextRequest, error?: string) {
  const url = new URL("/peak/login", request.url);
  if (error) url.searchParams.set("error", error);
  return url;
}

export async function POST(request: NextRequest) {
  if (!isPeakDashboardEnabled()) return NextResponse.redirect(new URL("/", request.url), 303);
  if (!hasValidOrigin(request)) return NextResponse.redirect(loginUrl(request, "invalid"), 303);
  let config: ReturnType<typeof requirePeakServerConfig>;
  try { config = requirePeakServerConfig(); } catch { return NextResponse.redirect(loginUrl(request, "unavailable"), 303); }
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateKey = createHmac("sha256", config.sessionSecret).update(forwarded).digest("hex").slice(0, 24);
  if (!(await allowAttempt(rateKey, 5, 15 * 60))) return NextResponse.redirect(loginUrl(request, "limited"), 303);
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const emailAllowed = config.ownerEmails.has(email);
  const passwordValid = verifySubmittedPassword(password, config.passwordHash);
  if (!emailAllowed || !passwordValid) {
    console.warn("peak_owner_login_failed", {
      emailAllowed,
      passwordValid,
      hadSurroundingWhitespace: password !== password.trim(),
    });
    return NextResponse.redirect(loginUrl(request, "invalid"), 303);
  }
  const response = NextResponse.redirect(new URL("/peak", request.url), 303);
  setSessionCookie(response, createSession(email));
  console.info("peak_owner_login_success");
  return response;
}
