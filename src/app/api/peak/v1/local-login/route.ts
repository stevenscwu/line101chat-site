import { NextRequest, NextResponse } from "next/server";

import { createSession, hasValidOrigin, loginAttemptKey, setSessionCookie } from "@/lib/peak/auth";
import { isPeakDashboardEnabled, requirePeakSessionConfig, requireSyncSecret } from "@/lib/peak/config";
import { verifyLocalLoginToken } from "@/lib/peak/local-login";
import { consumeReplayNonce, resetAttempts } from "@/lib/peak/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const responseHeaders = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function reject(status = 401) {
  return NextResponse.json({ error: "One-time sign-in rejected." }, { status, headers: responseHeaders });
}

export async function POST(request: NextRequest) {
  if (!isPeakDashboardEnabled()) return reject(404);
  if (!hasValidOrigin(request)) return reject();
  const length = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(length) && length > 2_048) return reject(413);
  let token = "";
  try {
    const body = await request.json() as { token?: unknown };
    token = typeof body.token === "string" ? body.token : "";
  } catch {
    return reject(400);
  }
  let secret: string;
  let config: ReturnType<typeof requirePeakSessionConfig>;
  try {
    secret = requireSyncSecret();
    config = requirePeakSessionConfig();
  } catch {
    return reject(503);
  }
  const payload = verifyLocalLoginToken(token, secret);
  if (!payload || !config.ownerEmails.has(payload.email)) return reject();
  if (!(await consumeReplayNonce(`local-login:${payload.nonce}`))) return reject();
  try { await resetAttempts(loginAttemptKey(request, config.sessionSecret)); } catch {
    console.warn("peak_local_login_rate_reset_failed");
  }
  const response = NextResponse.json({ accepted: true }, { headers: responseHeaders });
  setSessionCookie(response, createSession(payload.email));
  console.info("peak_local_login_success");
  return response;
}

export async function GET() {
  return reject(405);
}
