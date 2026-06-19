import { randomUUID } from "node:crypto";

import { type NextRequest, NextResponse } from "next/server";

import { generateAvatarReply } from "@/lib/avatar/llm";
import {
  buildMemorySummaryReply,
  deleteAvatarMemory,
  getMemoryDisclosure,
  isForgetMemoryCommand,
  isMemorySummaryCommand,
  loadAvatarMemory,
  saveAvatarConversationTurn,
} from "@/lib/avatar/memory";
import { getAvatarPersona, getSafeFallbackReply } from "@/lib/avatar/persona";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SESSION_COOKIE = "celine_session";
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

function logError(label: string, error: unknown) {
  console.error(`[celine-web] ${label}`, {
    errorType: error instanceof Error ? error.name : "UnknownError",
  });
}

export async function POST(request: NextRequest) {
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

  const message =
    typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    return withSessionCookie(
      NextResponse.json(
        { ok: false, error: "請先輸入訊息。" },
        { status: 400 },
      ),
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

  try {
    if (isForgetMemoryCommand(message)) {
      const existingMemory = await loadAvatarMemory("web", sessionId);
      await deleteAvatarMemory("web", sessionId);
      return withSessionCookie(
        NextResponse.json({
          ok: true,
          reply:
            "好，我已經清除這個瀏覽器在 Celine 記憶庫中的對話與偏好。我們可以重新認識。",
          memoryDurable: existingMemory.context.durable,
          memoryMode: "cleared",
        }),
        sessionId,
      );
    }

    const memory = await loadAvatarMemory("web", sessionId);
    const isFirstReply = !memory.record.disclosureSentAt;
    let reply = isMemorySummaryCommand(message)
      ? buildMemorySummaryReply(memory.record)
      : await generateAvatarReply({
          message,
          history: memory.record.messages,
          memory: memory.context,
        });

    if (isFirstReply) {
      reply = `${getMemoryDisclosure(memory.context.durable)}\n\n${reply}`;
    }

    await saveAvatarConversationTurn(memory.record, message, reply);

    return withSessionCookie(
      NextResponse.json({
        ok: true,
        reply,
        memoryDurable: memory.context.durable,
        memoryMode: memory.context.storageMode,
      }),
      sessionId,
    );
  } catch (error) {
    logError("chat request failed", error);
    const persona = getAvatarPersona();
    return withSessionCookie(
      NextResponse.json({
        ok: true,
        reply: getSafeFallbackReply(persona),
        memoryDurable: false,
        memoryMode: "unavailable",
      }),
      sessionId,
    );
  }
}
