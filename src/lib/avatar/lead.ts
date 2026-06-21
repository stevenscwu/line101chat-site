import { isEnglishMessage } from "@/lib/avatar/persona";

const LEAD_INTENT_PATTERN =
  /報價|估價|預約|想了解|合作|可以幫我做|幫我做|導入|試用|demo|consultation|quote|pricing|book|contact|talk to sales|合作方案/iu;

export function detectLeadIntent(message: string) {
  return LEAD_INTENT_PATTERN.test(message);
}

export function getLeadCapturePrompt(message: string) {
  if (isEnglishMessage(message)) {
    return [
      "To help the LINE101Chat team assess your project, please share:",
      "• Name and company / organization",
      "• Industry and intended use case",
      "• Existing documents or knowledge sources",
      "• Preferred channel: LINE, website, voice, or video",
      "• Whether you need a local / private model",
      "• Preferred contact method",
      "I can organize the requirements here, but please use LINE or the website contact form to send contact details to the team.",
    ].join("\n");
  }

  return [
    "為了讓 LINE101Chat 團隊快速評估，請提供：",
    "• 姓名與公司／組織",
    "• 產業與預計使用情境",
    "• 是否已有 FAQ、PDF、網站或其他文件",
    "• 偏好通道：LINE／網站／語音／影片",
    "• 是否需要本地端或私有模型",
    "• 希望團隊使用的聯絡方式",
    "我可以先整理您的需求，請透過 LINE 或網站表單與團隊聯繫。",
  ].join("\n");
}
