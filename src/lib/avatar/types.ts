export type AvatarConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type GenerateAvatarReplyInput = {
  message: string;
  history?: AvatarConversationMessage[];
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
