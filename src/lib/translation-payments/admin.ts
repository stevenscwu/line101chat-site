import { timingSafeEqual } from "crypto";

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isTranslationPaymentAdminAllowed(token: string | null | undefined) {
  const configuredToken = process.env.TRANSLATION_PAYMENTS_ADMIN_TOKEN?.trim();

  if (!configuredToken) {
    return process.env.NODE_ENV !== "production";
  }

  if (!token) {
    return false;
  }

  return safeCompare(token, configuredToken);
}

export function isTranslationPaymentAdminConfigured() {
  return Boolean(process.env.TRANSLATION_PAYMENTS_ADMIN_TOKEN?.trim());
}
