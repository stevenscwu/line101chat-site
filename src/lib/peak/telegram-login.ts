import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_LIFETIME_SECONDS = 120;

export type TelegramLoginClaims = {
  v: 2;
  sub: "telegram_owner";
  purpose: "cockpit_read";
  aud: "peak_dashboard";
  iat: number;
  exp: number;
  nonce: string;
};

function signature(encoded: string, secret: string) {
  return createHmac("sha256", secret).update(encoded).digest("hex");
}

export function createTelegramLoginToken(secret: string, now = Date.now()) {
  const issuedAt = Math.floor(now / 1_000);
  const claims: TelegramLoginClaims = {
    v: 2,
    sub: "telegram_owner",
    purpose: "cockpit_read",
    aud: "peak_dashboard",
    iat: issuedAt,
    exp: issuedAt + TOKEN_LIFETIME_SECONDS,
    nonce: randomBytes(16).toString("hex"),
  };
  const encoded = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `${encoded}.${signature(encoded, secret)}`;
}

export function verifyTelegramLoginToken(token: string, secret: string, now = Date.now()) {
  if (token.length > 1_024 || !/^[A-Za-z0-9_-]+\.[a-f0-9]{64}$/u.test(token)) return null;
  try {
    const [encoded, supplied] = token.split(".");
    const expected = signature(encoded, secret);
    if (!timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return null;
    const claims = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as TelegramLoginClaims;
    const current = Math.floor(now / 1_000);
    const keys = Object.keys(claims).sort();
    const expectedKeys = ["aud", "exp", "iat", "nonce", "purpose", "sub", "v"];
    if (
      keys.length !== expectedKeys.length || keys.some((key, index) => key !== expectedKeys[index]) ||
      claims.v !== 2 || claims.sub !== "telegram_owner" ||
      claims.purpose !== "cockpit_read" || claims.aud !== "peak_dashboard" ||
      !Number.isInteger(claims.iat) || !Number.isInteger(claims.exp) ||
      claims.iat > current + 30 || claims.exp <= current ||
      claims.exp <= claims.iat || claims.exp - claims.iat > TOKEN_LIFETIME_SECONDS ||
      !/^[a-f0-9]{32}$/u.test(claims.nonce)
    ) return null;
    return claims;
  } catch {
    return null;
  }
}
