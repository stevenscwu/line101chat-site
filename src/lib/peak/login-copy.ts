export const PEAK_TELEGRAM_LOGIN_COMMAND = "/peak_login";
export const PEAK_LOGIN_LINK_LIFETIME_MINUTES = 2;

export type PeakLoginNotice = {
  tone: "warning" | "status";
  message: string;
};

export function getPeakLoginNotice(error?: string): PeakLoginNotice | null {
  switch (error) {
    case "limited":
      return { tone: "warning", message: "登入嘗試次數過多，請稍後再試，或從擁有者 Telegram 重新取得一次性連結。" };
    case "configuration":
      return { tone: "warning", message: "擁有者登入尚未完成安全設定，請檢查伺服器設定。" };
    case "server":
      return { tone: "warning", message: "登入服務暫時無法使用。請稍後從 Telegram 重新產生連結。" };
    case "expired":
    case "session-expired":
      return { tone: "status", message: "登入工作階段已過期。請從擁有者 Telegram 取得新的登入連結。" };
    case "link-expired":
      return { tone: "status", message: "一次性登入連結已超過兩分鐘有效期。請在 Telegram 再次傳送 /peak_login。" };
    case "link":
      return { tone: "warning", message: "一次性登入連結無效或已使用。請在 Telegram 再次傳送 /peak_login。" };
    case "request":
      return { tone: "warning", message: "瀏覽器未提供必要的同網站安全資訊。請重新整理後再試，或改用 Telegram 一次性連結。" };
    case "invalid":
      return { tone: "warning", message: "緊急備用登入資料無效。請重新輸入擁有者電子郵件與密碼。" };
    default:
      return error ? { tone: "warning", message: "登入未完成。請從 Telegram 重新取得一次性連結。" } : null;
  }
}

export function localLoginFragmentStatus(
  token: string,
  now = Date.now(),
): "current" | "expired" | "invalid" {
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra !== undefined) return "invalid";
  const payload = decodeFragmentPayload(encoded);
  if (!payload || !Number.isInteger(payload.exp)) return "invalid";
  return Number(payload.exp) <= Math.floor(now / 1_000) ? "expired" : "current";
}

export function telegramLoginFragmentStatus(
  token: string,
  now = Date.now(),
): "current" | "expired" | "invalid" {
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !/^[a-f0-9]{64}$/u.test(signature || "") || extra !== undefined) {
    return "invalid";
  }
  const payload = decodeFragmentPayload(encoded);
  if (
    !payload || payload.v !== 2 || payload.sub !== "telegram_owner" ||
    payload.purpose !== "cockpit_read" || payload.aud !== "peak_dashboard" ||
    !Number.isInteger(payload.iat) || !Number.isInteger(payload.exp) ||
    Number(payload.exp) <= Number(payload.iat) || Number(payload.exp) - Number(payload.iat) > 120
  ) return "invalid";
  return Number(payload.exp) <= Math.floor(now / 1_000) ? "expired" : "current";
}

function decodeFragmentPayload(encoded: string): Record<string, unknown> | null {
  try {
    const base64 = encoded.replaceAll("-", "+").replaceAll("_", "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
    const payload: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return payload && typeof payload === "object" && !Array.isArray(payload)
      ? payload as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}
