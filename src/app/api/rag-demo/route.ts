import { NextResponse } from "next/server";

const MAX_QUESTION_LENGTH = 300;
const REQUEST_TIMEOUT_MS = 30000;

export const runtime = "nodejs";

const allowedPrograms = ["auto", "ai_program", "security_program", "semi_program"] as const;

type RagDemoProgram = (typeof allowedPrograms)[number];

const backendProgramMap: Record<Exclude<RagDemoProgram, "auto">, string> = {
  ai_program: "人工智慧科技",
  security_program: "資訊安全",
  semi_program: "半導體科技",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isAllowedProgram(value: string): value is RagDemoProgram {
  return (allowedPrograms as readonly string[]).includes(value);
}

function backendChatUrl(rawUrl: string) {
  const url = new URL(rawUrl);
  if (url.pathname === "" || url.pathname === "/") {
    url.pathname = "/web-demo/chat";
  }
  return url;
}

function forwardedClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
  const clientIp = forwardedFor.split(",", 1)[0]?.trim() || "";
  return clientIp.length <= 128 ? clientIp : "";
}

function isWebDemoEndpoint(url: URL) {
  return url.pathname.replace(/\/+$/, "").endsWith("/web-demo/chat");
}

function normalizeSources(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((source) => ({
    source_file: stringValue(source.source_file) || stringValue(source.title),
    heading: stringValue(source.heading) || stringValue(source.title),
    source_url: stringValue(source.source_url) || stringValue(source.url),
  }));
}

function normalizeBackendResponse(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }

  return {
    answer: stringValue(value.answer),
    needs_clarification: value.needs_clarification === true || stringValue(value.confidence) === "needs_clarification",
    choices: Array.isArray(value.choices) ? value.choices.filter((choice): choice is string => typeof choice === "string") : [],
    collection: stringValue(value.collection) || stringValue(value.program) || null,
    department: stringValue(value.department) || null,
    sources: normalizeSources(value.sources),
  };
}

async function readRequestBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await readRequestBody(request);

  if (!isRecord(body)) {
    return NextResponse.json({ error: "請以 JSON 格式送出問題。" }, { status: 400 });
  }

  const question = stringValue(body.question);
  const program = stringValue(body.program) || "auto";

  if (!question) {
    return NextResponse.json({ error: "請輸入想查詢的問題。" }, { status: 400 });
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json({ error: `問題最多 ${MAX_QUESTION_LENGTH} 個字。` }, { status: 400 });
  }

  if (!isAllowedProgram(program)) {
    return NextResponse.json(
      { error: "學程參數不正確，請選擇 auto、ai_program、security_program 或 semi_program。" },
      { status: 400 },
    );
  }

  const rawApiUrl = process.env.RAG_DEMO_API_URL?.trim();
  const apiKey = process.env.RAG_DEMO_API_KEY?.trim();

  if (!rawApiUrl) {
    return NextResponse.json({ error: "Demo 後端尚未設定，請稍後再試。" }, { status: 503 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: "Demo API 金鑰尚未設定，請稍後再試。" }, { status: 503 });
  }

  let apiUrl: URL;
  try {
    apiUrl = backendChatUrl(rawApiUrl);
  } catch {
    return NextResponse.json({ error: "Demo 後端網址設定不正確，請稍後再試。" }, { status: 503 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const backendPayload: { question: string; program?: string } = { question };
  const clientIp = forwardedClientIp(request);
  const backendHeaders: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Demo-Api-Key": apiKey,
  };

  if (clientIp) {
    backendHeaders["X-Demo-Client-IP"] = clientIp;
  }

  if (program !== "auto") {
    backendPayload.program = isWebDemoEndpoint(apiUrl) ? program : backendProgramMap[program];
  }

  try {
    const backendResponse = await fetch(apiUrl, {
      method: "POST",
      headers: backendHeaders,
      body: JSON.stringify(backendPayload),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          error:
            backendResponse.status >= 500
              ? "RAG 後端暫時無法完成查詢，請稍後再試。"
              : "RAG 後端拒絕了這次查詢，請調整問題後再試。",
        },
        { status: 502 },
      );
    }

    const backendJson = await backendResponse.json().catch(() => null);
    const normalized = normalizeBackendResponse(backendJson);

    if (!normalized) {
      return NextResponse.json({ error: "RAG 後端回傳格式不正確，請稍後再試。" }, { status: 502 });
    }

    return NextResponse.json(normalized);
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "RAG 後端回應逾時，請稍後再試。"
        : "目前無法連線到 RAG 後端，請稍後再試。";

    return NextResponse.json({ error: message }, { status: 503 });
  } finally {
    clearTimeout(timeout);
  }
}
