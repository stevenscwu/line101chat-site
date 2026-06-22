import { NextResponse } from "next/server";

import { generateAvatarReply } from "@/lib/avatar/avatarEngine";
import { replyToLine, verifyLineSignature } from "@/lib/avatar/line";
import {
  buildMemorySummaryReply,
  createAvatarWebLinkCode,
  deleteAvatarMemory,
  isCreateWebLinkCommand,
  isForgetMemoryCommand,
  isMemorySummaryCommand,
  loadAvatarMemory,
  saveAvatarConversationTurn,
} from "@/lib/avatar/memory";
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
    if (lineUserId) {
      try {
        await loadAvatarMemory("line", lineUserId);
      } catch (error) {
        logError("could not initialize conversation memory", error);
      }
    }

    await replyToLine(
      event.replyToken,
      `嗨，我是 ${persona.name}，很高興認識你。你可以直接跟我聊工作、整理想法，或問 LINE101Chat、AI 分身、RAG 和 LINE／網站串接。你現在最想弄清楚什麼？`,
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
          "好，我已清除這個 LINE 帳號可用的 Celine 對話記憶。下次我們就重新認識。";
      } catch (error) {
        logError("could not delete conversation memory", error);
        reply = "我剛剛沒能完成刪除，請稍後再輸入一次「忘記我」。";
      }
      await replyToLine(event.replyToken, reply);
      return;
    }

    if (isCreateWebLinkCommand(message)) {
      if (!lineUserId) {
        reply =
          "網站記憶連結需要一對一 LINE 身分。請先到 Celine 的 LINE 好友聊天室，再傳一次「連結網站」。";
      } else {
        try {
          const link = await createAvatarWebLinkCode("line", lineUserId);
          reply = link.durable
            ? `可以。請在 10 分鐘內回到 line101chat.com/ai-avatar，在「連結 LINE 記憶」輸入這組碼：\n\n${link.code}\n\n連結後，網站和 LINE 就能接續同一段對話。`
            : `我已產生暫時連結碼：${link.code}。不過目前伺服器尚未啟用持久資料庫，服務重啟後可能失效；建議稍後再試或先繼續在 LINE 聊。`;
        } catch (error) {
          logError("could not create website link code", error);
          reply = "目前無法產生網站連結碼，請稍後再傳一次「連結網站」。";
        }
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
        try {
          await saveAvatarConversationTurn(
            memory.record,
            message,
            reply,
          );
        } catch (error) {
          logError("memory save unavailable", error);
        }
      }
    } catch (error) {
      logError("LLM reply failed; using safe fallback", error);
      reply = getSafeFallbackReply();
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
