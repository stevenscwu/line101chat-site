import {
  createHmac,
  pbkdf2Sync,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import type { NextRequest, NextResponse } from "next/server";

import { requirePeakServerConfig } from "@/lib/peak/config";

export const PEAK_SESSION_COOKIE = "peak_owner_session";
const SESSION_SECONDS = 8 * 60 * 60;

type SessionPayload = { v: 1; email: string; iat: number; exp: number; jti: string };

function safeEqual(left: Buffer, right: Buffer) {
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyPassword(password: string, encoded: string) {
  const [algorithm, iterationsText, saltText, expectedText] = encoded.split("$");
  const iterations = Number(iterationsText);
  if (
    algorithm !== "pbkdf2-sha512" ||
    !Number.isInteger(iterations) ||
    iterations < 210_000 ||
    !saltText ||
    !expectedText ||
    password.length > 256
  ) return false;
  try {
    const salt = Buffer.from(saltText, "base64url");
    const expected = Buffer.from(expectedText, "base64url");
    const actual = pbkdf2Sync(password, salt, iterations, expected.length, "sha512");
    return safeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function verifySubmittedPassword(password: string, encoded: string) {
  if (verifyPassword(password, encoded)) return true;
  const trimmed = password.trim();
  return trimmed !== password && verifyPassword(trimmed, encoded);
}

export function createPasswordHash(password: string) {
  const salt = randomBytes(24);
  const iterations = 310_000;
  const digest = pbkdf2Sync(password, salt, iterations, 64, "sha512");
  return `pbkdf2-sha512$${iterations}$${salt.toString("base64url")}$${digest.toString("base64url")}`;
}

function sign(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

export function createSession(email: string, now = Date.now()) {
  const { sessionSecret } = requirePeakServerConfig();
  const issuedAt = Math.floor(now / 1_000);
  const payload: SessionPayload = {
    v: 1,
    email: email.toLowerCase(),
    iat: issuedAt,
    exp: issuedAt + SESSION_SECONDS,
    jti: randomBytes(16).toString("hex"),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, sessionSecret)}`;
}

export function verifySession(token?: string, now = Date.now()): SessionPayload | null {
  if (!token) return null;
  try {
    const { ownerEmails, sessionSecret } = requirePeakServerConfig();
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    if (!safeEqual(Buffer.from(signature), Buffer.from(sign(encoded, sessionSecret)))) return null;
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    const current = Math.floor(now / 1_000);
    if (
      payload.v !== 1 ||
      !ownerEmails.has(payload.email) ||
      payload.iat > current + 60 ||
      payload.exp <= current ||
      payload.exp - payload.iat > SESSION_SECONDS
    ) return null;
    return payload;
  } catch {
    return null;
  }
}

export function requestSession(request: NextRequest) {
  return verifySession(request.cookies.get(PEAK_SESSION_COOKIE)?.value);
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: PEAK_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: PEAK_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export function hasValidOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
