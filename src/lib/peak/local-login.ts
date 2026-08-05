import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_LIFETIME_SECONDS = 120;

export type LocalLoginPayload = {
  v: 1;
  email: string;
  iat: number;
  exp: number;
  nonce: string;
};

function signature(encoded: string, secret: string) {
  return createHmac("sha256", secret).update(encoded).digest("hex");
}

export function createLocalLoginToken(email: string, secret: string, now = Date.now()) {
  const issuedAt = Math.floor(now / 1_000);
  const payload: LocalLoginPayload = {
    v: 1,
    email: email.trim().toLowerCase(),
    iat: issuedAt,
    exp: issuedAt + TOKEN_LIFETIME_SECONDS,
    nonce: randomBytes(16).toString("hex"),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signature(encoded, secret)}`;
}

export function verifyLocalLoginToken(token: string, secret: string, now = Date.now()) {
  if (token.length > 1_024 || !/^[A-Za-z0-9_-]+\.[a-f0-9]{64}$/u.test(token)) return null;
  try {
    const [encoded, supplied] = token.split(".");
    const expected = signature(encoded, secret);
    if (!timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as LocalLoginPayload;
    const current = Math.floor(now / 1_000);
    if (
      payload.v !== 1 ||
      typeof payload.email !== "string" ||
      payload.email !== payload.email.trim().toLowerCase() ||
      !Number.isInteger(payload.iat) ||
      !Number.isInteger(payload.exp) ||
      payload.iat > current + 30 ||
      payload.exp <= current ||
      payload.exp - payload.iat !== TOKEN_LIFETIME_SECONDS ||
      !/^[a-f0-9]{32}$/u.test(payload.nonce)
    ) return null;
    return payload;
  } catch {
    return null;
  }
}
