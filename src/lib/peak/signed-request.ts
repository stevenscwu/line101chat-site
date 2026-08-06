import { createHmac, timingSafeEqual } from "node:crypto";

import type { NextRequest } from "next/server";

import { requireSyncSecret } from "@/lib/peak/config";
import { consumeReplayNonce } from "@/lib/peak/store";

const MAX_CLOCK_SKEW_SECONDS = 300;

export async function readSignedPeakBody(request: NextRequest, maximumBytes = 256 * 1_024) {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) return { ok: false as const, status: 413 };
  const timestamp = request.headers.get("x-peak-timestamp") || "";
  const nonce = request.headers.get("x-peak-nonce") || "";
  const signature = request.headers.get("x-peak-signature") || "";
  if (!/^\d{10}$/u.test(timestamp) || !/^[a-f0-9]{32}$/u.test(nonce) || !/^[a-f0-9]{64}$/u.test(signature)) return { ok: false as const, status: 401 };
  if (Math.abs(Math.floor(Date.now() / 1_000) - Number(timestamp)) > MAX_CLOCK_SKEW_SECONDS) return { ok: false as const, status: 401 };
  const body = await request.text();
  if (Buffer.byteLength(body) > maximumBytes) return { ok: false as const, status: 413 };
  let secret: string;
  try { secret = requireSyncSecret(); } catch { return { ok: false as const, status: 503 }; }
  const expected = createHmac("sha256", secret).update(`${timestamp}.${nonce}.${body}`).digest("hex");
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return { ok: false as const, status: 401 };
  try {
    if (!(await consumeReplayNonce(nonce))) return { ok: false as const, status: 401 };
  } catch {
    return { ok: false as const, status: 503 };
  }
  return { ok: true as const, body };
}
