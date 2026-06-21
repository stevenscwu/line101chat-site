import { getLeadCapturePrompt } from "@/lib/avatar/lead";
import { isEnglishMessage } from "@/lib/avatar/persona";
import { formatKnowledgeContext } from "@/lib/avatar/rag";
import type {
  AvatarConversationMessage,
  GenerateLlmReplyInput,
  LlmProvider,
} from "@/lib/avatar/types";

const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_OLLAMA_MODEL = "gemma4:26b";
const DEFAULT_OPENAI_COMPATIBLE_MODEL = "gpt-4.1-mini";
const DEFAULT_TIMEOUT_MS = 20_000;
const MAX_TIMEOUT_MS = 55_000;
const MAX_REPLY_LENGTH = 4_500;

type OllamaChatResponse = {
  message?: { content?: string };
  response?: string;
};

type OpenAiCompatibleResponse = {
  choices?: Array<{
    message?: { content?: string };
  }>;
};

function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function validateHttpUrl(value: string, name: string) {
  const parsed = new URL(value);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`${name} must use HTTP or HTTPS.`);
  }
  return parsed;
}

export function getLlmProvider(): LlmProvider {
  const value = (process.env.LLM_PROVIDER || "mock").trim().toLowerCase();

  if (
    value === "mock" ||
    value === "ollama" ||
    value === "openai-compatible"
  ) {
    return value;
  }

  throw new Error(`Unsupported LLM_PROVIDER: ${value}`);
}

function getTimeoutMs() {
  const configured = Number(
    process.env.LLM_TIMEOUT_MS || process.env.OLLAMA_TIMEOUT_MS,
  );
  return Number.isFinite(configured) && configured > 0
    ? Math.min(configured, MAX_TIMEOUT_MS)
    : DEFAULT_TIMEOUT_MS;
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

function buildMemoryContext(input: GenerateLlmReplyInput) {
  const memory = input.memory;
  if (!memory) return "";

  return [
    memory.preferredName ? `Preferred name: ${memory.preferredName}` : "",
    memory.interests.length
      ? `User-stated interests: ${memory.interests.join("、")}`
      : "",
    memory.facts.length
      ? `User-stated context: ${memory.facts.join("；")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildSystemMessages(input: GenerateLlmReplyInput) {
  return [
    { role: "system", content: input.persona.systemPrompt },
    {
      role: "system",
      content: formatKnowledgeContext(input.snippets),
    },
    ...(buildMemoryContext(input)
      ? [{ role: "system", content: buildMemoryContext(input) }]
      : []),
    ...(input.leadIntent
      ? [
          {
            role: "system",
            content: `The user shows commercial intent. Include this concise lead handoff request:\n${getLeadCapturePrompt(input.userMessage)}`,
          },
        ]
      : []),
  ];
}

function conciseSnippet(input: GenerateLlmReplyInput) {
  const content = input.snippets[0]?.content
    .replace(/^#+\s+/gm, "")
    .replace(/\n{2,}/g, "\n")
    .trim();

  if (!content) return "";
  return content.slice(0, 520);
}

function createEnglishMockReply(input: GenerateLlmReplyInput) {
  const message = input.userMessage;

  if (/price|pricing|cost|quote/iu.test(message)) {
    return "Pricing depends on knowledge-base size, integration complexity, response channels, and whether private deployment is required. The LINE101Chat team can scope a focused MVP after reviewing your use case and documents.";
  }

  if (/rag/iu.test(message)) {
    return "RAG retrieves relevant, approved knowledge before the model writes an answer. That makes the avatar more grounded and maintainable than a generic chatbot relying only on model memory.";
  }

  if (/chatgpt|different/iu.test(message)) {
    return "A generic ChatGPT session starts from a broad model. LINE101 Avatar adds an approved persona, verified business knowledge, LINE and website channels, plus human handoff—so it can represent a specific organization without pretending to be a real person.";
  }

  const snippet = conciseSnippet(input);
  return snippet
    ? `${snippet}\n\nWould you like to evaluate this for LINE, a website, voice, or a future video avatar?`
    : "I’m the LINE101Chat AI avatar. I can explain knowledge-grounded avatars, LINE integration, RAG, private-model options, and implementation planning. Which organization or use case are you evaluating?";
}

function createChineseMockReply(input: GenerateLlmReplyInput) {
  const message = input.userMessage;

  if (/法律|法規|合規|legal|compliance/iu.test(message)) {
    return "目前知識庫沒有足夠資料對特定國家、產業或情境做法律／合規結論，我也不能提供最終法律意見。請先說明實際市場與使用情境，再由 LINE101Chat 團隊和合格法律專業人士一起確認。";
  }

  if (/一般\s*chatgpt|chatgpt.*不同|有什麼不同/iu.test(message)) {
    return "一般 ChatGPT 是通用對話模型；LINE101 AI分身會加上明確 persona、品牌語氣、經過整理的可信知識、LINE／網站通道與真人交接。重點不是只會聊天，而是能在可控資料範圍內代表一個人或組織回覆。";
  }

  if (/rag\s*是什麼|什麼是\s*rag|rag/iu.test(message)) {
    return "RAG 是「先找資料，再生成回答」的流程。AI 會先從核准的 FAQ、PDF、網站或 SOP 找到相關內容，再依 persona 組織答案，降低只靠模型記憶亂猜的風險。";
  }

  if (/學校|招生|系所/iu.test(message)) {
    return "可以。學校或系所可把招生簡章、課程、截止日、表單與常見問題整理成知識庫，讓 AI分身在 LINE 或網站先回答；遇到資格認定、例外規定或正式承諾時，再轉交承辦人。";
  }

  if (/顧問|老師|個人品牌|幫.+(?:做|打造).+分身|打造.+分身/iu.test(message)) {
    return "可以。顧問、老師或創作者可建立有明確身分揭露的 AI分身，使用本人核准的語氣與知識回答服務、課程或合作問題，但不會假裝就是真人本人。";
  }

  if (/google\s*drive|雲端硬碟/iu.test(message)) {
    return "可以規劃 Google Drive、PDF、網站與其他文件來源。MVP 會先盤點資料權限、格式與更新方式，再決定同步、匯入或定期更新流程，避免把不該公開的內容直接放進回答。";
  }

  if (/ollama|本地|私有/iu.test(message)) {
    return "可以評估 Ollama 與本地／私有模型，預設方向可使用 gemma4:26b。若網站部署在 Vercel，不能直接連到 Windows 的 localhost:11434，正式環境需要可由 Vercel 安全連線的 HTTPS 端點、私有伺服器或受控通道。";
  }

  if (/收費|價格|費用|報價|多少錢/iu.test(message)) {
    return "需依知識庫大小、串接系統、回覆通道與是否私有部署評估。建議先用一個明確情境與現有文件做免費評估，再確認 MVP 範圍與正式報價。";
  }

  if (/語音|voice/iu.test(message)) {
    return "網站 MVP 可先用瀏覽器語音辨識輸入，再用語音合成讀出回答，不需要付費語音 API。正式客服若要更穩定的辨識、電話整合或即時串流，會再獨立評估。";
  }

  if (/你好|嗨|哈囉|hello|hi/iu.test(message)) {
    return `您好，我是 ${input.persona.name}，由 LINE101Chat 建立的 AI 產品代表，不是真人。您可以問我 AI分身、RAG、LINE 串接、學校招生問答、本地 Ollama 或導入方式。`;
  }

  const snippet = conciseSnippet(input);
  return snippet
    ? `${snippet}\n\n如果您願意，我可以再依產業、資料來源與預計通道幫您縮小 MVP 範圍。`
    : "目前沒有找到足夠的核准知識可以直接下結論。您想代表的是個人、品牌、學校、門市還是公司？也請告訴我主要希望用在 LINE、網站、語音或影片。";
}

function createMockReply(input: GenerateLlmReplyInput) {
  const baseReply = isEnglishMessage(input.userMessage)
    ? createEnglishMockReply(input)
    : createChineseMockReply(input);

  return input.leadIntent
    ? `${baseReply}\n\n${getLeadCapturePrompt(input.userMessage)}`
    : baseReply;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = getTimeoutMs(),
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function callOllama(input: GenerateLlmReplyInput) {
  const baseUrl = normalizeBaseUrl(
    process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL,
  );
  const parsedUrl = validateHttpUrl(baseUrl, "OLLAMA_BASE_URL");
  const model = process.env.OLLAMA_MODEL?.trim() || DEFAULT_OLLAMA_MODEL;

  if (process.env.NODE_ENV === "production" && parsedUrl.protocol !== "https:") {
    throw new Error("Production Ollama endpoint must use HTTPS.");
  }

  const response = await fetchWithTimeout(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        ...buildSystemMessages(input),
        ...normalizeHistory(input.history),
        { role: "user", content: input.userMessage.trim() },
      ],
      options: { temperature: 0.35, num_ctx: 8_192 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as OllamaChatResponse;
  const content = payload.message?.content || payload.response;
  if (!content?.trim()) throw new Error("Ollama returned an empty reply.");
  return content.trim().slice(0, MAX_REPLY_LENGTH);
}

async function callOpenAiCompatible(input: GenerateLlmReplyInput) {
  const baseUrl = normalizeBaseUrl(
    process.env.OPENAI_COMPATIBLE_BASE_URL || "",
  );
  const apiKey = process.env.OPENAI_COMPATIBLE_API_KEY?.trim();
  const model =
    process.env.OPENAI_COMPATIBLE_MODEL?.trim() ||
    DEFAULT_OPENAI_COMPATIBLE_MODEL;

  if (!baseUrl || !apiKey) {
    throw new Error("OpenAI-compatible endpoint is not configured.");
  }

  validateHttpUrl(baseUrl, "OPENAI_COMPATIBLE_BASE_URL");
  const response = await fetchWithTimeout(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      messages: [
        ...buildSystemMessages(input),
        ...normalizeHistory(input.history),
        { role: "user", content: input.userMessage.trim() },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `OpenAI-compatible request failed with status ${response.status}.`,
    );
  }

  const payload = (await response.json()) as OpenAiCompatibleResponse;
  const content = payload.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new Error("OpenAI-compatible provider returned an empty reply.");
  }
  return content.trim().slice(0, MAX_REPLY_LENGTH);
}

export async function generateLlmReply(input: GenerateLlmReplyInput) {
  const provider = getLlmProvider();

  if (provider === "mock") {
    return { text: createMockReply(input), provider };
  }

  if (provider === "ollama") {
    return { text: await callOllama(input), provider };
  }

  return { text: await callOpenAiCompatible(input), provider };
}

export const avatarLlmDefaults = {
  provider: "mock" as const,
  ollamaBaseUrl: DEFAULT_OLLAMA_BASE_URL,
  ollamaModel: DEFAULT_OLLAMA_MODEL,
  timeoutMs: DEFAULT_TIMEOUT_MS,
};
