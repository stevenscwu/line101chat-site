import { findBusinessKnowledgeReply } from "@/lib/avatar/knowledge";
import { getAvatarPersona } from "@/lib/avatar/persona";
import type {
  AvatarConversationMessage,
  AvatarPersona,
  GenerateAvatarReplyInput,
} from "@/lib/avatar/types";

const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_OLLAMA_MODEL = "gemma4:26b";
const DEFAULT_OLLAMA_TIMEOUT_MS = 45_000;
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

function getOllamaTimeoutMs() {
  const configured = Number(process.env.OLLAMA_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 0
    ? Math.min(configured, 55_000)
    : DEFAULT_OLLAMA_TIMEOUT_MS;
}

function createMockReply(message: string, persona: AvatarPersona) {
  const businessReply = findBusinessKnowledgeReply(message, persona);

  if (businessReply) {
    return businessReply;
  }

  if (/^(嗨|哈囉|你好|安安|hey|hi|hello)[!！。.?\s]*$/iu.test(message)) {
    return `嗨，我是 ${persona.name}，一位會記得對話脈絡的 AI。很高興認識你——今天想聊點什麼？`;
  }

  if (/你幾歲|妳幾歲|你的年齡|妳的年齡|how old are you/iu.test(message)) {
    return "我沒有真人年齡喔，我是 AI。不過我的說話風格設定成一位年輕、成熟、好奇又有點幽默的女生。";
  }

  if (/今天.*(累|煩|難過)|我好累|心情不好|壓力好大|bad day|tired|stressed/iu.test(message)) {
    return "聽起來今天有點不好過。你不用一次整理得很完整，先告訴我是工作、人際，還是單純累積太多事，我陪你拆小一點。";
  }

  if (/謝謝|感謝|thanks|thank you/iu.test(message)) {
    return "不客氣呀。能真的幫你把事情想清楚，比只說漂亮話有意思多了。";
  }

  if (/(我叫|叫我|我的名字是|my name is|I'm|I am)\s*/iu.test(message)) {
    return "記住了，很高興正式認識你。下次聊天時，我會盡量接續這次的脈絡；你也可以隨時輸入「忘記我」清除記憶。";
  }

  return "我有在聽。這題如果多一點背景，我會回得更貼近你——你比較想要我陪你聊聊、一起整理想法，還是直接給一個實用建議？";
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

function buildMemoryContext(input: GenerateAvatarReplyInput) {
  const memory = input.memory;

  if (!memory) {
    return "";
  }

  const details = [
    memory.preferredName ? `使用者偏好的稱呼：${memory.preferredName}` : "",
    memory.interests.length
      ? `使用者曾主動提到的興趣：${memory.interests.join("、")}`
      : "",
    memory.facts.length
      ? `使用者請你記得的偏好或背景：${memory.facts.join("；")}`
      : "",
  ].filter(Boolean);

  return details.length
    ? [
        "以下是去識別化、由使用者主動提供的對話記憶。只在與當前問題相關時自然使用，不要逐條背誦：",
        ...details,
      ].join("\n")
    : "";
}

async function callOllama(
  input: GenerateAvatarReplyInput,
  persona: AvatarPersona,
) {
  const { baseUrl, model } = getOllamaConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getOllamaTimeoutMs());

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
          ...(buildMemoryContext(input)
            ? [{ role: "system", content: buildMemoryContext(input) }]
            : []),
          ...normalizeHistory(input.history),
          { role: "user", content: input.message.trim() },
        ],
        options: {
          temperature: 0.65,
          num_ctx: 8_192,
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
    const reply = createMockReply(message, persona);
    const preferredName = input.memory?.preferredName;
    return preferredName && !reply.includes(preferredName)
      ? `${preferredName}，${reply}`
      : reply;
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
  ollamaTimeoutMs: DEFAULT_OLLAMA_TIMEOUT_MS,
};
