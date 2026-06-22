import { randomUUID } from "node:crypto";

import { type NextRequest, NextResponse } from "next/server";

import { generateAvatarReply } from "@/lib/avatar/avatarEngine";
import {
  buildMemorySummaryReply,
  deleteAvatarMemory,
  deleteAvatarMemoryRecord,
  isForgetMemoryCommand,
  isMemorySummaryCommand,
  linkWebMemoryToCode,
  loadAvatarWebMemory,
  saveAvatarConversationTurn,
} from "@/lib/avatar/memory";

const SESSION_COOKIE = "line101_avatar_session";
const PERSON_COOKIE = "line101_avatar_person";
const MAX_MESSAGE_LENGTH = 1_000;
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

type ChatRequestBody = {
  message?: unknown;
};

type LinkRequestBody = {
  code?: unknown;
};

function withIdentityCookies(
  response: NextResponse,
  sessionId: string,
  personToken?: string,
) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  if (personToken) {
    response.cookies.set({
      name: PERSON_COOKIE,
      value: personToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  }

  return response;
}

function clearPersonCookie(response: NextResponse) {
  response.cookies.set({
    name: PERSON_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
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
    return withIdentityCookies(
      NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }),
      sessionId,
    );
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return withIdentityCookies(
      NextResponse.json({ ok: false, error: "請先輸入訊息。" }, { status: 400 }),
      sessionId,
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return withIdentityCookies(
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
    let memory: Awaited<ReturnType<typeof loadAvatarWebMemory>> | null = null;

    try {
      memory = await loadAvatarWebMemory(
        sessionId,
        request.cookies.get(PERSON_COOKIE)?.value,
      );
      if (memory.context.linkedToLine) {
        await deleteAvatarMemoryRecord(memory.record);
      } else {
        await deleteAvatarMemory("web", sessionId);
      }
    } catch (error) {
      logMemoryError("memory deletion unavailable", error);
    }

    return clearPersonCookie(
      withIdentityCookies(
      NextResponse.json({
        ok: true,
        reply: "好，我已清除這個瀏覽器可用的 Celine 對話記憶。我們可以重新認識。",
        memoryDurable: false,
        memoryMode: "cleared",
        leadIntent: false,
        sources: [],
      }),
      sessionId,
      ),
    );
  }

  let memory: Awaited<ReturnType<typeof loadAvatarWebMemory>> | null = null;
  try {
    memory = await loadAvatarWebMemory(
      sessionId,
      request.cookies.get(PERSON_COOKIE)?.value,
    );
  } catch (error) {
    logMemoryError("memory unavailable; continuing without memory", error);
  }

  if (memory && isMemorySummaryCommand(message)) {
    return withIdentityCookies(
      NextResponse.json({
        ok: true,
        reply: buildMemorySummaryReply(memory.record),
        memoryDurable: memory.context.durable,
        memoryMode: memory.context.storageMode,
        linkedToLine: memory.context.linkedToLine,
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
  const reply = result.reply;

  if (memory) {
    try {
      await saveAvatarConversationTurn(memory.record, message, reply);
    } catch (error) {
      logMemoryError("memory save unavailable", error);
    }
  }

  return withIdentityCookies(
    NextResponse.json({
      ok: true,
      reply,
      provider: result.provider,
      leadIntent: result.leadIntent,
      shouldHandoff: result.shouldHandoff,
      sources: result.sources,
      memoryDurable: memory?.context.durable || false,
      memoryMode: memory?.context.storageMode || "unavailable",
      linkedToLine: memory?.context.linkedToLine || false,
    }),
    sessionId,
  );
}

export async function handleAvatarWebLink(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value || randomUUID();
  let body: LinkRequestBody;

  try {
    body = (await request.json()) as LinkRequestBody;
  } catch {
    return withIdentityCookies(
      NextResponse.json({ ok: false, error: "連結碼格式不正確。" }, { status: 400 }),
      sessionId,
    );
  }

  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!/^[A-Za-z0-9 -]{6,16}$/u.test(code)) {
    return withIdentityCookies(
      NextResponse.json(
        { ok: false, error: "請輸入 Celine 在 LINE 提供的連結碼。" },
        { status: 400 },
      ),
      sessionId,
    );
  }

  try {
    const linked = await linkWebMemoryToCode(sessionId, code);

    if (!linked) {
      return withIdentityCookies(
        NextResponse.json(
          { ok: false, error: "連結碼無效或已過期，請回 LINE 重新取得。" },
          { status: 400 },
        ),
        sessionId,
      );
    }

    return withIdentityCookies(
      NextResponse.json({
        ok: true,
        message: "已連結 LINE。之後 Celine 可以在網站與 LINE 接續同一段脈絡。",
        memoryDurable: linked.context.durable,
        memoryMode: linked.context.storageMode,
        linkedToLine: true,
      }),
      sessionId,
      linked.token,
    );
  } catch (error) {
    logMemoryError("LINE linking unavailable", error);
    return withIdentityCookies(
      NextResponse.json(
        {
          ok: false,
          error: "目前無法完成連結。請稍後再試，或先繼續使用 LINE 對話。",
        },
        { status: 503 },
      ),
      sessionId,
    );
  }
}
