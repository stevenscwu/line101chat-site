import { getAvatarPersona } from "@/lib/avatar/persona";
import type {
  AvatarConversationMessage,
  AvatarPersona,
  GenerateAvatarReplyInput,
} from "@/lib/avatar/types";

const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_OLLAMA_MODEL = "gemma4:26b";
const OLLAMA_TIMEOUT_MS = 8_000;
const MAX_REPLY_LENGTH = 4_500;

type OllamaChatResponse = {
  message?: {
    content?: string;
  };
  response?: string;
};

function getProvider() {
  return (process.env.LLM_PROVIDER || "mock").trim().toLowerCase();
}

function getOllamaConfig() {
  const baseUrl = (process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL)
    .trim()
    .replace(/\/+$/, "");
  const model = process.env.OLLAMA_MODEL?.trim() || DEFAULT_OLLAMA_MODEL;
  const parsedUrl = new URL(baseUrl);

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("OLLAMA_BASE_URL must use HTTP or HTTPS.");
  }

  if (process.env.NODE_ENV === "production" && parsedUrl.protocol !== "https:") {
    throw new Error("Production Ollama endpoint must use HTTPS.");
  }

  return { baseUrl, model };
}

function looksEnglish(message: string) {
  const latinCharacters = message.match(/[A-Za-z]/g)?.length || 0;
  const cjkCharacters = message.match(/[\u3400-\u9fff]/g)?.length || 0;
  return latinCharacters > cjkCharacters;
}

function createMockReply(message: string, persona: AvatarPersona) {
  const normalized = message.toLowerCase();
  const needsHandoff =
    /報價|價格|費用|合作|客製|建置|技術|串接|quotation|quote|pricing|custom|cooperat|technical|integration/.test(
      normalized,
    );

  if (looksEnglish(message)) {
    if (needsHandoff) {
      return `I’m ${persona.name}, an AI avatar for ${persona.ownerName}. For pricing, custom projects, partnerships, or technical setup, please contact the real team here: ${persona.contactUrl}`;
    }

    return `Hi, I’m ${persona.name}, an AI avatar—not the real person. I can explain the LINE AI avatar service, answer basic questions, collect your needs, and hand the conversation to the ${persona.ownerName} team when needed.`;
  }

  if (needsHandoff) {
    return `我是 ${persona.name}，是 AI 分身，不是真人本人。報價、客製專案、合作或技術建置需要由真人團隊確認，請前往 ${persona.contactUrl}，並簡單留下你的使用情境與預計上線時間。`;
  }

  return `您好，我是 ${persona.name}，是 ${persona.ownerName} 的 AI 分身，不是真人本人。我可以介紹 LINE AI 分身服務、回答基本問題、協助整理需求，並在需要時轉交真人團隊。`;
}

function normalizeHistory(history: AvatarConversationMessage[] = []) {
  return history
    .filter((item) => item.content.trim())
    .slice(-8)
    .map((item) => ({
      role: item.role,
      content: item.content.trim(),
    }));
}

async function callOllama(
  input: GenerateAvatarReplyInput,
  persona: AvatarPersona,
) {
  const { baseUrl, model } = getOllamaConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: persona.systemPrompt },
          ...normalizeHistory(input.history),
          { role: "user", content: input.message.trim() },
        ],
        options: {
          temperature: 0.4,
        },
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as OllamaChatResponse;
    const content = payload.message?.content || payload.response;

    if (!content?.trim()) {
      throw new Error("Ollama returned an empty reply.");
    }

    return content.trim().slice(0, MAX_REPLY_LENGTH);
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateAvatarReply(input: GenerateAvatarReplyInput) {
  const message = input.message.trim();
  const persona = getAvatarPersona();

  if (!message) {
    return `我是 ${persona.name}（AI 分身）。請用文字告訴我你想了解的服務或問題。`;
  }

  const provider = getProvider();

  if (provider === "mock") {
    return createMockReply(message, persona);
  }

  if (provider === "ollama") {
    return callOllama({ ...input, message }, persona);
  }

  throw new Error(`Unsupported LLM_PROVIDER: ${provider}`);
}

export const avatarLlmDefaults = {
  provider: "mock",
  ollamaBaseUrl: DEFAULT_OLLAMA_BASE_URL,
  ollamaModel: DEFAULT_OLLAMA_MODEL,
};
