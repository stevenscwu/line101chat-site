import { randomUUID } from "node:crypto";

import { type NextRequest, NextResponse } from "next/server";

import { generateAvatarReply } from "@/lib/avatar/avatarEngine";
import {
  buildMemorySummaryReply,
  deleteAvatarMemory,
  getMemoryDisclosure,
  isForgetMemoryCommand,
  isMemorySummaryCommand,
  loadAvatarMemory,
  saveAvatarConversationTurn,
} from "@/lib/avatar/memory";
import { isEnglishMessage } from "@/lib/avatar/persona";

const SESSION_COOKIE = "line101_avatar_session";
const MAX_MESSAGE_LENGTH = 1_000;
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

type ChatRequestBody = {
  message?: unknown;
};

function withSessionCookie(response: NextResponse, sessionId: string) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}

function logMemoryError(label: string, error: unknown) {
  console.warn(`[avatar-web] ${label}`, {
    errorType: error instanceof Error ? error.name : "UnknownError",
  });
}

export async function handleAvatarWebChat(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value || randomUUID();
  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return withSessionCookie(
      NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }),
      sessionId,
    );
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return withSessionCookie(
      NextResponse.json({ ok: false, error: "請先輸入訊息。" }, { status: 400 }),
      sessionId,
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return withSessionCookie(
      NextResponse.json(
        {
          ok: false,
          error: `訊息最多 ${MAX_MESSAGE_LENGTH} 個字，請縮短後再傳送。`,
        },
        { status: 400 },
      ),
      sessionId,
    );
  }

  if (isForgetMemoryCommand(message)) {
    try {
      await deleteAvatarMemory("web", sessionId);
    } catch (error) {
      logMemoryError("memory deletion unavailable", error);
    }

    return withSessionCookie(
      NextResponse.json({
        ok: true,
        reply: "已清除這個瀏覽器可用的 AI分身對話記憶。我們可以重新開始。",
        memoryDurable: false,
        memoryMode: "cleared",
        leadIntent: false,
        sources: [],
      }),
      sessionId,
    );
  }

  let memory: Awaited<ReturnType<typeof loadAvatarMemory>> | null = null;
  try {
    memory = await loadAvatarMemory("web", sessionId);
  } catch (error) {
    logMemoryError("memory unavailable; continuing without memory", error);
  }

  if (memory && isMemorySummaryCommand(message)) {
    return withSessionCookie(
      NextResponse.json({
        ok: true,
        reply: buildMemorySummaryReply(memory.record),
        memoryDurable: memory.context.durable,
        memoryMode: memory.context.storageMode,
        leadIntent: false,
        sources: [],
      }),
      sessionId,
    );
  }

  const result = await generateAvatarReply({
    userMessage: message,
    channel: "website",
    userId: sessionId,
    history: memory?.record.messages || [],
    memory: memory?.context,
  });
  let reply = result.reply;

  if (memory && !memory.record.disclosureSentAt) {
    reply = `${getMemoryDisclosure(
      memory.context.durable,
      isEnglishMessage(message),
    )}\n\n${reply}`;
  }

  if (memory) {
    try {
      await saveAvatarConversationTurn(memory.record, message, reply);
    } catch (error) {
      logMemoryError("memory save unavailable", error);
    }
  }

  return withSessionCookie(
    NextResponse.json({
      ok: true,
      reply,
      provider: result.provider,
      leadIntent: result.leadIntent,
      shouldHandoff: result.shouldHandoff,
      sources: result.sources,
      memoryDurable: memory?.context.durable || false,
      memoryMode: memory?.context.storageMode || "unavailable",
    }),
    sessionId,
  );
}
