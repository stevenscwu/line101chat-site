export type AvatarConversationMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

export type AvatarChannel = "website" | "line" | "voice" | "video";

export type AvatarMemoryChannel = "line" | "web";

export type AvatarMemoryProfile = {
  preferredName?: string;
  language?: "zh-TW" | "en";
  interests: string[];
  facts: string[];
};

export type AvatarMemoryRecord = {
  version: 1;
  subjectId: string;
  channel: AvatarMemoryChannel;
  linkedChannels?: AvatarMemoryChannel[];
  createdAt: string;
  updatedAt: string;
  profile: AvatarMemoryProfile;
  messages: AvatarConversationMessage[];
};

export type AvatarMemoryContext = {
  subjectId?: string;
  preferredName?: string;
  interests: string[];
  facts: string[];
  storageMode: "local" | "upstash" | "ephemeral";
  durable: boolean;
  linkedToLine?: boolean;
};

export type GenerateAvatarReplyInput = {
  userMessage: string;
  channel: AvatarChannel;
  userId?: string;
  context?: Record<string, string | number | boolean | null>;
  history?: AvatarConversationMessage[];
  memory?: AvatarMemoryContext;
};

export type AvatarReply = {
  reply: string;
  provider: LlmProvider;
  leadIntent: boolean;
  shouldHandoff: boolean;
  sources: string[];
};

export type AvatarPersona = {
  name: string;
  ownerName: string;
  role: string;
  language: string;
  tone: string;
  contactUrl: string;
  systemPrompt: string;
};

export type RagDocument = {
  id: string;
  title: string;
  source: string;
  content: string;
};

export type RagSnippet = {
  id: string;
  title: string;
  source: string;
  content: string;
  score: number;
};

export type LlmProvider = "mock" | "ollama" | "openai-compatible";

export type GenerateLlmReplyInput = GenerateAvatarReplyInput & {
  persona: AvatarPersona;
  snippets: RagSnippet[];
  leadIntent: boolean;
};

export type LineMessage = {
  id?: string;
  type: string;
  text?: string;
};

export type LineWebhookEvent = {
  type: string;
  replyToken?: string;
  timestamp?: number;
  mode?: "active" | "standby";
  message?: LineMessage;
  source?: {
    type?: string;
    userId?: string;
    groupId?: string;
    roomId?: string;
  };
};

export type LineWebhookBody = {
  destination?: string;
  events?: LineWebhookEvent[];
};
