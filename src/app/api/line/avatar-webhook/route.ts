import { NextResponse } from "next/server";

import { generateAvatarReply } from "@/lib/avatar/llm";
import { replyToLine, verifyLineSignature } from "@/lib/avatar/line";
import {
  getAvatarPersona,
  getSafeFallbackReply,
  getUnsupportedMessageReply,
} from "@/lib/avatar/persona";
import type {
  LineWebhookBody,
  LineWebhookEvent,
} from "@/lib/avatar/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

function logError(label: string, error: unknown) {
  const details =
    error instanceof Error
      ? { errorType: error.name }
      : { errorType: "UnknownError" };
  console.error(`[line-avatar] ${label}`, details);
}

async function handleEvent(event: LineWebhookEvent, index: number) {
  const persona = getAvatarPersona();

  console.info("[line-avatar] event received", {
    index,
    type: event.type,
    messageType: event.message?.type || null,
    textLength: event.message?.text?.length || 0,
    hasReplyToken: Boolean(event.replyToken),
  });

  if (!event.replyToken) {
    return;
  }

  if (event.type === "follow") {
    await replyToLine(
      event.replyToken,
      `你好，我是 ${persona.name}，LINE101Chat 的 AI 分身兼商務知識助理，不是真人本人。你可以問我 AI 分身、LINE 知識助理、RAG、費用區間、導入方式或案例。`,
    );
    return;
  }

  if (event.type !== "message") {
    return;
  }

  let reply: string;

  if (event.message?.type !== "text") {
    reply = getUnsupportedMessageReply(persona);
  } else {
    try {
      reply = await generateAvatarReply({
        message: event.message.text || "",
        // MVP is intentionally stateless. A future memory store can populate this history.
        history: [],
      });
    } catch (error) {
      logError("LLM reply failed; using safe fallback", error);
      reply = getSafeFallbackReply(persona);
    }
  }

  await replyToLine(event.replyToken, reply);
}

export async function POST(request: Request) {
  const channelSecret = process.env.LINE_AVATAR_CHANNEL_SECRET?.trim();

  if (!channelSecret) {
    console.error("[line-avatar] webhook unavailable: channel secret is not configured");
    return NextResponse.json(
      { ok: false, error: "Webhook unavailable" },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-line-signature") || "";

  if (!verifyLineSignature(rawBody, signature, channelSecret)) {
    console.warn("[line-avatar] rejected request with invalid signature");
    return NextResponse.json(
      { ok: false, error: "Invalid signature" },
      { status: 401 },
    );
  }

  let payload: LineWebhookBody;

  try {
    payload = JSON.parse(rawBody) as LineWebhookBody;
  } catch {
    console.warn("[line-avatar] rejected malformed JSON payload");
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 },
    );
  }

  const events = Array.isArray(payload.events) ? payload.events : [];
  const results = await Promise.allSettled(
    events.map((event, index) => handleEvent(event, index)),
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      logError(`event ${index} failed`, result.reason);
    }
  });

  return NextResponse.json({
    ok: true,
    processed: events.length,
  });
}
