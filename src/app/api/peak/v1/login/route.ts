import { NextRequest, NextResponse } from "next/server";

import { createSession, hasValidOrigin, loginAttemptKey, setSessionCookie, verifySubmittedPassword } from "@/lib/peak/auth";
import { isPeakDashboardEnabled, requirePeakServerConfig } from "@/lib/peak/config";
import { allowAttempt, loadOwnerPasswordHash, resetAttempts } from "@/lib/peak/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function loginUrl(request: NextRequest, error?: string) {
  const url = new URL("/peak/login", request.url);
  if (error) url.searchParams.set("error", error);
  return url;
}

export async function POST(request: NextRequest) {
  if (!isPeakDashboardEnabled()) return NextResponse.redirect(new URL("/", request.url), 303);
  if (!hasValidOrigin(request)) {
    console.warn("peak_owner_login_rejected", { reason: "origin" });
    return NextResponse.redirect(loginUrl(request, "request"), 303);
  }
  let config: ReturnType<typeof requirePeakServerConfig>;
  try { config = requirePeakServerConfig(); } catch {
    console.error("peak_owner_login_unavailable", { reason: "configuration" });
    return NextResponse.redirect(loginUrl(request, "configuration"), 303);
  }
  const rateKey = loginAttemptKey(request, config.sessionSecret);
  try {
    if (!(await allowAttempt(rateKey, 5, 15 * 60))) return NextResponse.redirect(loginUrl(request, "limited"), 303);
  } catch {
    console.error("peak_owner_login_unavailable", { reason: "rate_store" });
    return NextResponse.redirect(loginUrl(request, "server"), 303);
  }
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const emailAllowed = config.ownerEmails.has(email);
  let passwordHash: string;
  try { passwordHash = await loadOwnerPasswordHash(config.passwordHash); } catch {
    console.error("peak_owner_login_unavailable", { reason: "password_store" });
    return NextResponse.redirect(loginUrl(request, "server"), 303);
  }
  const passwordValid = verifySubmittedPassword(password, passwordHash);
  if (!emailAllowed || !passwordValid) {
    console.warn("peak_owner_login_failed", { reason: "credentials" });
    return NextResponse.redirect(loginUrl(request, "invalid"), 303);
  }
  try { await resetAttempts(rateKey); } catch {
    console.warn("peak_owner_login_rate_reset_failed");
  }
  const response = NextResponse.redirect(new URL("/peak-os", request.url), 303);
  setSessionCookie(response, createSession(email));
  console.info("peak_owner_login_success");
  return response;
}
