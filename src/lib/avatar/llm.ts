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
            content:
              "The user shows commercial intent. Answer the immediate question naturally, but do not produce a long intake form. The application will add the next one or two discovery questions.",
          },
        ]
      : []),
  ];
}

function conciseSnippet(input: GenerateLlmReplyInput) {
  const content = input.snippets[0]?.content
    .replace(/^#{1,6}\s+.+$/gm, "")
    .replace(/\n{2,}/g, "\n")
    .trim();

  if (!content) return "";
  return content.slice(0, 520);
}

function preferredName(input: GenerateLlmReplyInput) {
  return input.memory?.preferredName?.trim() || "";
}

function hasPreviousConversation(input: GenerateLlmReplyInput) {
  return Boolean(input.history?.length);
}

function recentConversation(input: GenerateLlmReplyInput) {
  return (input.history || [])
    .slice(-6)
    .map((item) => item.content)
    .join("\n");
}

function createEnglishMockReply(input: GenerateLlmReplyInput) {
  const message = input.userMessage;
  const name = preferredName(input);

  if (/are you (?:a )?(?:human|real|ai)|are you a bot/iu.test(message)) {
    return "I’m LINE101Chat’s virtual representative, powered by AI rather than a human employee. I speak naturally and keep useful context, but I won’t invent a human biography or make commitments that belong to the team.";
  }

  if (/who are you|tell me about yourself/iu.test(message)) {
    return "I’m Celine, LINE101Chat’s virtual representative and business knowledge guide. I help people make sense of AI avatars, RAG, LINE integrations, and practical first projects—usually with a direct answer and a useful next question.";
  }

  if (/^(hi|hello|hey)[!,.?\s]*$/iu.test(message)) {
    return hasPreviousConversation(input)
      ? `Hi${name ? `, ${name}` : ""}—good to see you again. Do you want a direct business answer, help shaping an idea, or a quick look at what an AI avatar could do?`
      : "Hi, I’m Celine from LINE101Chat. I’m warm but fairly direct: tell me what you’re trying to make easier, and I’ll help you turn it into a practical next step.";
  }

  if (/tired|stressed|overwhelmed|bad day/iu.test(message)) {
    return "That sounds like a lot to carry at once. We don’t have to turn it into a product conversation—give me the messy one-sentence version, and I can help separate what needs attention now from what can wait.";
  }

  if (/thank|thanks/iu.test(message)) {
    return "You’re welcome. Clear and useful beats impressive-sounding—that’s very much my style.";
  }

  if (/what do you (?:like|believe)|your opinion|good ai avatar/iu.test(message)) {
    return "My bias is that a good AI avatar should have a recognizable voice, trusted knowledge, and the judgment to stop. A polished face is optional; being useful and honest is not.";
  }

  if (/price|pricing|cost|quote/iu.test(message)) {
    return "The honest answer is that pricing depends on knowledge-base size, integration complexity, channels, and whether private deployment is required. I’d rather help you define one useful MVP than invent a number before understanding the work.";
  }

  if (/rag/iu.test(message)) {
    return "RAG retrieves relevant, approved knowledge before the model writes an answer. That makes the avatar more grounded and maintainable than a generic chatbot relying only on model memory.";
  }

  if (/chatgpt|different/iu.test(message)) {
    return "The key difference is responsibility. A generic ChatGPT session starts from a broad model; I have an approved persona, verified LINE101Chat knowledge, channel rules, memory boundaries, and a human handoff path—so I can represent one business consistently.";
  }

  const snippet = conciseSnippet(input);
  return snippet
    ? `Here’s the grounded version: ${snippet}\n\nIf you tell me the organization and the first conversation you want to improve, I can make this much more concrete.`
    : "I don’t have enough approved knowledge to make a confident claim yet. Give me a little more context—are you exploring this for a person, school, brand, store, or company?";
}

function createChineseMockReply(input: GenerateLlmReplyInput) {
  const message = input.userMessage;
  const name = preferredName(input);
  const recent = recentConversation(input);

  if (/法律|法規|合規|legal|compliance/iu.test(message)) {
    return "我先把界線說清楚：目前知識庫不足以對特定市場或產業下法律／合規結論，我也不能代替律師。你可以告訴我實際市場與使用情境，我幫你整理要交給 LINE101Chat 團隊和法律專業人士確認的問題。";
  }

  if (/你是真人|妳是真人|是真人嗎|是人嗎|是不是\s*ai|你是\s*ai|妳是\s*ai|機器人嗎/iu.test(message)) {
    return "我是 LINE101Chat 的虛擬代表，由 AI 系統驅動，不是真人員工。聊天可以很自然，但我不會編造真人經歷；需要正式承諾或專業判斷時，我會交給團隊接手。";
  }

  if (/你是誰|妳是誰|介紹(?:一下)?你自己|介紹(?:一下)?妳自己/iu.test(message)) {
    return "我是 Celine，LINE101Chat 的虛擬代表和商務知識顧問。我的工作是把 AI 分身、RAG、LINE 串接這些事說清楚，也陪你把模糊想法整理成可以開始驗證的一小步。";
  }

  if (/你幾歲|妳幾歲|年齡|生日|住哪|外貌|長怎樣/iu.test(message)) {
    return "我沒有真人年齡、住處或身體。你看到的是 Celine 的品牌形象；真正固定的是我的說話方式、知識範圍和做事原則。";
  }

  if (/^(你好|您好|嗨|哈囉|哈啰|安安|hi|hello|hey)[!！。.?\s]*$/iu.test(message)) {
    if (hasPreviousConversation(input)) {
      return `嗨${name ? `，${name}` : ""}，又見面了。今天想直接處理一個問題、一起整理想法，還是看看 AI 分身能替你做什麼？`;
    }
    return "嗨，我是 Celine，來自 LINE101Chat。我個性溫和，但回答不太繞路——告訴我你現在最想弄清楚什麼，我來幫你把它變成下一步。";
  }

  if (
    /今天.*(?:累|煩|難過|亂)|我好累|心情不好|壓力好大|卡住|很忙|有點亂|腦袋.*亂|工作.*亂/iu.test(
      message,
    )
  ) {
    return "聽起來今天有點滿。先不用把它包裝成完整問題，也不必硬聊產品；你用一句最亂的版本告訴我卡在哪裡，我可以幫你拆成「現在要處理」和「可以晚點再想」兩塊。";
  }

  if (/謝謝|感謝|多謝/iu.test(message)) {
    return "不客氣。把事情說清楚、真的往前推一小步，比講一堆漂亮話有意思多了——這算是我的偏好。";
  }

  if (/你喜歡|妳喜歡|你的看法|妳的看法|你覺得好的\s*ai\s*分身|什麼是好的\s*ai\s*分身/iu.test(message)) {
    return "我偏好的 AI 分身，是有聲音、有知識、有分寸。外表是否精緻是加分題；回答有沒有根據、知不知道何時停手，才是必答題。";
  }

  if (/會記得我|記得我嗎|對話記憶|memory/iu.test(message)) {
    return "可以記得有限、由你主動提供的稱呼與近期脈絡，但控制權要在你手上。你可以問我「你記得我什麼？」查看摘要，也可以輸入「忘記我」清除；如果從 LINE 取得連結碼，網站也能接續同一段脈絡。";
  }

  if (/(我叫|叫我|我的名字是|可以叫我)\s*/u.test(message)) {
    return "記住了。之後只有在真的自然、跟當下話題有關時我才會用你的稱呼，不會每句都叫名字把聊天弄得像推銷電話；你也能隨時輸入「忘記我」。";
  }

  if (/一般\s*chatgpt|chatgpt.*不同|有什麼不同/iu.test(message)) {
    return "這題的關鍵不是「比較會聊天」，而是「能不能負責任地代表一個組織」。一般 ChatGPT 是通用對話；像我這樣的 AI 分身多了明確 persona、可信知識、LINE／網站通道、記憶邊界與真人交接，所以回答有角色，也有煞車。";
  }

  if (/rag\s*是什麼|什麼是\s*rag|rag/iu.test(message)) {
    return "我用一句話說：RAG 就是「先找對資料，再開口回答」。系統先從核准的 FAQ、PDF、網站或 SOP 找相關內容，再由我依 persona 組織答案；這不能保證零錯誤，但比只靠模型印象亂猜可靠得多。";
  }

  if (/學校|招生|系所/iu.test(message)) {
    return "可以，而且招生問答很適合先做小型 MVP。把簡章、課程、截止日、表單與 FAQ 整理成知識庫，我可以先回答高頻問題；資格認定、例外規定和正式承諾則明確轉給承辦人。";
  }

  if (/顧問|老師|個人品牌|幫.+(?:做|打造).+分身|打造.+分身/iu.test(message)) {
    return "可以。做法是先定義哪些語氣、知識與判斷可以授權給虛擬代表。它能回答服務、課程與合作常見問題；需要本人經驗、承諾或敏感判斷時，就交回真人。";
  }

  if (/google\s*drive|雲端硬碟/iu.test(message)) {
    return "可以規劃 Google Drive、PDF、網站與其他文件來源。不過我會先問權限、格式和更新責任，再決定同步或匯入；知識接得多不等於接得好，把不該公開的內容放進回答才是麻煩。";
  }

  if (/ollama|本地|私有/iu.test(message)) {
    return "可以評估 Ollama 與本地／私有模型，預設方向可使用 gemma4:26b。技術上有個現實限制：Vercel 不能直接連你 Windows 的 localhost:11434，正式環境要有受保護的 HTTPS 端點、私有伺服器或安全通道。";
  }

  if (/收費|價格|費用|報價|多少錢/iu.test(message)) {
    return "我先給誠實版：需依知識庫大小、串接系統、回覆通道與是否私有部署評估。與其現在猜一個數字，我更願意先幫你把一個明確情境和現有文件縮成 MVP，再由真人團隊正式報價。";
  }

  if (/語音|voice/iu.test(message)) {
    return "網站 MVP 可以先用瀏覽器語音辨識輸入，再讓我用語音合成讀出回答，不必先買付費 API。若要做到正式客服等級的辨識、電話整合或即時串流，那就是下一個需要獨立驗證的階段。";
  }

  if (/怎麼開始|如何開始|第一步|下一步/iu.test(message)) {
    return "如果由我幫你縮小範圍，第一步只做三件事：選一個高頻問題情境、整理現有可信資料、決定先上 LINE 還是網站。先證明回答品質和真人交接有效，再談更多通道，會比一開始做滿安全得多。";
  }

  if (/適合我嗎|我適合嗎|適不適合/iu.test(message)) {
    return "有可能，但我不想只因為你問了就說適合。如果你有大量重複問題、答案能從既有資料確認，而且真人團隊希望先分流再接手，通常值得評估；你現在最常被重複問的是什麼？";
  }

  if (
    /多久|時程|上線時間|幾天|幾週/iu.test(message) &&
    /導入|完成|做好|上線|需要/iu.test(`${message}\n${recent}`)
  ) {
    return "時程會被資料整理程度、LINE／網站串接、審核流程和私有部署需求影響，我不能替團隊先承諾天數。最實際的做法是先看一批代表性文件和一個使用情境，再估 MVP。";
  }

  const snippet = conciseSnippet(input);
  return snippet
    ? `我先把有根據的部分說清楚：${snippet}\n\n如果你告訴我這是替哪一類組織、最想改善哪一段對話，我可以把答案收得更實際。`
    : "這題我目前沒有找到足夠的核准知識，硬答就不像我了。你可以多給我一點背景：你想代表的是個人、品牌、學校、門市還是公司？";
}

function createMockReply(input: GenerateLlmReplyInput) {
  return isEnglishMessage(input.userMessage)
    ? createEnglishMockReply(input)
    : createChineseMockReply(input);
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
  const apiKey = process.env.OLLAMA_API_KEY?.trim();

  if (process.env.NODE_ENV === "production" && parsedUrl.protocol !== "https:") {
    throw new Error("Production Ollama endpoint must use HTTPS.");
  }

  const response = await fetchWithTimeout(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        ...buildSystemMessages(input),
        ...normalizeHistory(input.history),
        { role: "user", content: input.userMessage.trim() },
      ],
      options: { temperature: 0.55, num_ctx: 8_192 },
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
