export type AvatarConversationMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

export type AvatarChannel = "line" | "web";

export type AvatarMemoryProfile = {
  preferredName?: string;
  language?: "zh-TW" | "en";
  interests: string[];
  facts: string[];
};

export type AvatarMemoryRecord = {
  version: 1;
  subjectId: string;
  channel: AvatarChannel;
  createdAt: string;
  updatedAt: string;
  disclosureSentAt?: string;
  profile: AvatarMemoryProfile;
  messages: AvatarConversationMessage[];
};

export type AvatarMemoryContext = {
  preferredName?: string;
  interests: string[];
  facts: string[];
  storageMode: "local" | "upstash" | "ephemeral";
  durable: boolean;
};

export type GenerateAvatarReplyInput = {
  message: string;
  history?: AvatarConversationMessage[];
  memory?: AvatarMemoryContext;
};

export type AvatarPersona = {
  name: string;
  ownerName: string;
  contactUrl: string;
  systemPrompt: string;
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
