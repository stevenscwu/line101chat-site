import {
  createHmac,
  pbkdf2Sync,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import type { NextRequest, NextResponse } from "next/server";

import { requirePeakSessionConfig } from "@/lib/peak/config";

export const PEAK_SESSION_COOKIE = "peak_owner_session";
const SESSION_SECONDS = 8 * 60 * 60;

export type SessionScope = "admin" | "cockpit";
type SessionPayload = {
  v: 2;
  aud: "peak_dashboard";
  purpose: "owner_session";
  scope: SessionScope;
  email: string;
  iat: number;
  exp: number;
  jti: string;
};
type LegacySessionPayload = {
  v: 1;
  email: string;
  iat: number;
  exp: number;
  jti: string;
};
type JsonRecord = Record<string, unknown>;
export type SessionInspection =
  | { status: "valid"; payload: SessionPayload }
  | { status: "missing" | "expired" | "invalid" | "configuration"; payload: null };

function safeEqual(left: Buffer, right: Buffer) {
  return left.length === right.length && timingSafeEqual(left, right);
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: JsonRecord, expected: string[]) {
  const keys = Object.keys(value).sort();
  return keys.length === expected.length && keys.every((key, index) => key === expected[index]);
}

function isCanonicalOwnerEmail(value: unknown, ownerEmails: Set<string>): value is string {
  return typeof value === "string" && value.length > 0 &&
    value === value.trim().toLowerCase() && ownerEmails.has(value);
}

function validSessionTimes(iat: unknown, exp: unknown, current: number) {
  return Number.isInteger(iat) && Number.isInteger(exp) &&
    Number(iat) >= 0 && Number(exp) > Number(iat) &&
    Number(exp) - Number(iat) <= SESSION_SECONDS && Number(iat) <= current + 60;
}

function validJti(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{32}$/u.test(value);
}

export function verifyPassword(password: string, encoded: string) {
  const [algorithm, iterationsText, saltText, expectedText] = encoded.split("$");
  const iterations = Number(iterationsText);
  if (
    algorithm !== "pbkdf2-sha512" ||
    !Number.isInteger(iterations) ||
    iterations < 210_000 ||
    iterations > 1_000_000 ||
    !saltText ||
    !expectedText ||
    password.length > 256
  ) return false;
  try {
    const salt = Buffer.from(saltText, "base64url");
    const expected = Buffer.from(expectedText, "base64url");
    if (salt.length < 16 || salt.length > 64 || expected.length < 32 || expected.length > 128) return false;
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

export function createSession(email: string, now = Date.now(), scope: SessionScope = "admin") {
  const { sessionSecret } = requirePeakSessionConfig();
  const issuedAt = Math.floor(now / 1_000);
  const payload: SessionPayload = {
    v: 2,
    aud: "peak_dashboard",
    purpose: "owner_session",
    scope,
    email: email.toLowerCase(),
    iat: issuedAt,
    exp: issuedAt + SESSION_SECONDS,
    jti: randomBytes(16).toString("hex"),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded, sessionSecret)}`;
}

export function inspectSession(token?: string, now = Date.now()): SessionInspection {
  if (!token) return { status: "missing", payload: null };
  try {
    const { ownerEmails, sessionSecret } = requirePeakSessionConfig();
    if (token.length > 4_096) return { status: "invalid", payload: null };
    const segments = token.split(".");
    if (segments.length !== 2) return { status: "invalid", payload: null };
    const [encoded, signature] = segments;
    if (!/^[A-Za-z0-9_-]+$/u.test(encoded) || !/^[A-Za-z0-9_-]{43}$/u.test(signature)) {
      return { status: "invalid", payload: null };
    }
    if (!safeEqual(Buffer.from(signature), Buffer.from(sign(encoded, sessionSecret)))) return { status: "invalid", payload: null };
    const raw: unknown = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!isJsonRecord(raw)) return { status: "invalid", payload: null };
    const current = Math.floor(now / 1_000);
    let payload: SessionPayload;
    if (raw.v === 1) {
      if (!hasExactKeys(raw, ["email", "exp", "iat", "jti", "v"]) ||
        !isCanonicalOwnerEmail(raw.email, ownerEmails) ||
        !validSessionTimes(raw.iat, raw.exp, current) || !validJti(raw.jti)) {
        return { status: "invalid", payload: null };
      }
      const legacy = raw as unknown as LegacySessionPayload;
      payload = {
        v: 2,
        aud: "peak_dashboard",
        purpose: "owner_session",
        scope: "admin",
        email: legacy.email,
        iat: legacy.iat,
        exp: legacy.exp,
        jti: legacy.jti,
      };
    } else {
      if (!hasExactKeys(raw, ["aud", "email", "exp", "iat", "jti", "purpose", "scope", "v"]) ||
        raw.v !== 2 || raw.aud !== "peak_dashboard" || raw.purpose !== "owner_session" ||
        (raw.scope !== "admin" && raw.scope !== "cockpit") ||
        !isCanonicalOwnerEmail(raw.email, ownerEmails) ||
        !validSessionTimes(raw.iat, raw.exp, current) || !validJti(raw.jti)) {
        return { status: "invalid", payload: null };
      }
      payload = raw as unknown as SessionPayload;
    }
    if (payload.exp <= current) return { status: "expired", payload: null };
    return { status: "valid", payload };
  } catch {
    try { requirePeakSessionConfig(); } catch { return { status: "configuration", payload: null }; }
    return { status: "invalid", payload: null };
  }
}

export function verifySession(token?: string, now = Date.now()): SessionPayload | null {
  const result = inspectSession(token, now);
  return result.status === "valid" ? result.payload : null;
}

export function verifyAdminSession(token?: string, now = Date.now()): SessionPayload | null {
  const session = verifySession(token, now);
  return session?.scope === "admin" ? session : null;
}

export function requestSession(request: NextRequest) {
  return verifySession(request.cookies.get(PEAK_SESSION_COOKIE)?.value);
}

export function requestAdminSession(request: NextRequest) {
  return verifyAdminSession(request.cookies.get(PEAK_SESSION_COOKIE)?.value);
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
  try {
    const expected = new URL(request.url);
    if (origin) return new URL(origin).origin === expected.origin;

    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const requestHost = (forwardedHost || request.headers.get("host") || "").toLowerCase();
    if (!requestHost || requestHost !== expected.host.toLowerCase()) return false;

    const referer = request.headers.get("referer");
    if (referer && new URL(referer).origin === expected.origin) return true;

    return request.headers.get("sec-fetch-site")?.toLowerCase() === "same-origin";
  } catch {
    return false;
  }
}

export function loginAttemptKey(request: NextRequest, sessionSecret: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return createHmac("sha256", sessionSecret).update(forwarded).digest("hex").slice(0, 24);
}
