import { createHmac, timingSafeEqual } from "node:crypto";

const LINE_REPLY_API_URL = "https://api.line.me/v2/bot/message/reply";
const LINE_REPLY_TIMEOUT_MS = 8_000;
const LINE_TEXT_LIMIT = 5_000;

export function verifyLineSignature(
  rawBody: string,
  signature: string,
  channelSecret: string,
) {
  if (!signature || !channelSecret) {
    return false;
  }

  const expectedSignature = createHmac("sha256", channelSecret)
    .update(rawBody)
    .digest("base64");
  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  );
}

function normalizeLineText(text: string) {
  const normalized = text.trim();
  return normalized.slice(0, LINE_TEXT_LIMIT) || "請再傳一次文字訊息，我會盡快協助。";
}

export async function replyToLine(replyToken: string, text: string) {
  const accessToken = process.env.LINE_AVATAR_CHANNEL_ACCESS_TOKEN?.trim();

  if (!accessToken) {
    throw new Error("LINE avatar channel access token is not configured.");
  }

  if (!replyToken) {
    throw new Error("LINE reply token is missing.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LINE_REPLY_TIMEOUT_MS);

  try {
    const response = await fetch(LINE_REPLY_API_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        replyToken,
        messages: [
          {
            type: "text",
            text: normalizeLineText(text),
          },
        ],
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`LINE reply API failed with status ${response.status}.`);
    }
  } finally {
    clearTimeout(timeout);
  }
}
