import { NextRequest, NextResponse } from "next/server";

import { createSession, hasValidOrigin, setSessionCookie } from "@/lib/peak/auth";
import {
  isPeakDashboardEnabled,
  requireLoginSecret,
  requirePeakSessionConfig,
} from "@/lib/peak/config";
import { consumeReplayNonce } from "@/lib/peak/store";
import { verifyTelegramLoginToken } from "@/lib/peak/telegram-login";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function reject(status = 401) {
  return NextResponse.json({ error: "Telegram sign-in rejected." }, { status, headers });
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
  let ownerEmail: string;
  try {
    const config = requirePeakSessionConfig();
    const owners = [...config.ownerEmails];
    if (owners.length !== 1) return reject(503);
    ownerEmail = owners[0];
    secret = requireLoginSecret();
  } catch {
    console.error("peak_telegram_login_unavailable", { reason: "configuration" });
    return reject(503);
  }

  const claims = verifyTelegramLoginToken(token, secret);
  if (!claims) return reject();
  try {
    if (!(await consumeReplayNonce(`telegram-login:${claims.nonce}`))) return reject();
  } catch {
    console.error("peak_telegram_login_unavailable", { reason: "replay_store" });
    return reject(503);
  }

  const response = NextResponse.json({ accepted: true }, { headers });
  setSessionCookie(response, createSession(ownerEmail, Date.now(), "cockpit"));
  console.info("peak_telegram_login_success", { scope: "cockpit" });
  return response;
}

export async function GET() {
  return reject(405);
}
