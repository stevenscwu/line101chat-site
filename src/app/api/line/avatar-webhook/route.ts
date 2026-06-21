import { NextResponse } from "next/server";

import { generateAvatarReply } from "@/lib/avatar/avatarEngine";
import { replyToLine, verifyLineSignature } from "@/lib/avatar/line";
import {
  buildMemorySummaryReply,
  deleteAvatarMemory,
  getMemoryDisclosure,
  isForgetMemoryCommand,
  isMemorySummaryCommand,
  loadAvatarMemory,
  markMemoryDisclosure,
  saveAvatarConversationTurn,
} from "@/lib/avatar/memory";
import {
  getAvatarPersona,
  getSafeFallbackReply,
  getUnsupportedMessageReply,
  isEnglishMessage,
} from "@/lib/avatar/persona";
import type {
  LineWebhookBody,
  LineWebhookEvent,
} from "@/lib/avatar/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function logError(label: string, error: unknown) {
  const details =
    error instanceof Error
      ? { errorType: error.name }
      : { errorType: "UnknownError" };
  console.error(`[line-avatar] ${label}`, details);
}

async function handleEvent(event: LineWebhookEvent, index: number) {
  const persona = getAvatarPersona();
  const lineUserId = event.source?.userId?.trim() || "";

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
    let disclosure = getMemoryDisclosure(false);

    if (lineUserId) {
      try {
        const { context } = await loadAvatarMemory("line", lineUserId);
        disclosure = getMemoryDisclosure(context.durable);
        await markMemoryDisclosure("line", lineUserId);
      } catch (error) {
        logError("could not initialize conversation memory", error);
      }
    }

    await replyToLine(
      event.replyToken,
      `您好，我是 ${persona.name}，由 LINE101Chat 建立的 AI 產品代表，不是真人。您可以問我 AI分身、RAG、LINE／網站串接、學校與企業應用、本地 Ollama，或請我協助整理導入需求。\n\n${disclosure}`,
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
    const message = event.message.text || "";

    if (message.length > 1_000) {
      await replyToLine(
        event.replyToken,
        "訊息較長，請先縮短到 1,000 字內，或分成幾段傳送，我會逐步協助。",
      );
      return;
    }

    if (lineUserId && isForgetMemoryCommand(message)) {
      try {
        await deleteAvatarMemory("line", lineUserId);
        reply =
          "已清除這個 LINE 帳號可用的 AI分身對話記憶。下次可以重新開始。";
      } catch (error) {
        logError("could not delete conversation memory", error);
        reply = "我剛剛沒能完成刪除，請稍後再輸入一次「忘記我」。";
      }
      await replyToLine(event.replyToken, reply);
      return;
    }

    try {
      let memory: Awaited<ReturnType<typeof loadAvatarMemory>> | null = null;

      if (lineUserId) {
        try {
          memory = await loadAvatarMemory("line", lineUserId);
        } catch (error) {
          logError("memory unavailable; continuing without memory", error);
        }
      }

      if (memory && isMemorySummaryCommand(message)) {
        reply = buildMemorySummaryReply(memory.record);
      } else {
        const result = await generateAvatarReply({
          userMessage: message,
          channel: "line",
          userId: lineUserId || undefined,
          history: memory?.record.messages || [],
          memory: memory?.context,
        });
        reply = result.reply;
      }

      if (memory) {
        const isFirstReply = !memory.record.disclosureSentAt;
        const replyToStore = isFirstReply
          ? `${getMemoryDisclosure(
              memory.context.durable,
              isEnglishMessage(message),
            )}\n\n${reply}`
          : reply;

        try {
          await saveAvatarConversationTurn(
            memory.record,
            message,
            replyToStore,
          );
        } catch (error) {
          logError("memory save unavailable", error);
        }
        reply = replyToStore;
      }
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
