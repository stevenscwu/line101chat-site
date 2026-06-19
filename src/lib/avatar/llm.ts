import { findBusinessKnowledgeReply } from "@/lib/avatar/knowledge";
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

function createMockReply(message: string, persona: AvatarPersona) {
  return findBusinessKnowledgeReply(message, persona);
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
