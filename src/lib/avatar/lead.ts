import { isEnglishMessage } from "@/lib/avatar/persona";
import type { AvatarConversationMessage } from "@/lib/avatar/types";

const LEAD_INTENT_PATTERN =
  /報價|估價|預約|想了解|想做|打造|建置|合作|可以幫我做|幫我做|導入|試用|demo|consultation|quote|pricing|book|contact|talk to sales|合作方案/iu;

export function detectLeadIntent(message: string) {
  return LEAD_INTENT_PATTERN.test(message);
}

function getUserConversationText(
  message: string,
  history: AvatarConversationMessage[],
) {
  return [
    ...history
      .filter((item) => item.role === "user")
      .slice(-6)
      .map((item) => item.content),
    message,
  ].join("\n");
}

export function getLeadCapturePrompt(
  message: string,
  history: AvatarConversationMessage[] = [],
) {
  const conversation = getUserConversationText(message, history);
  const hasOrganization =
    /公司|組織|學校|系所|診所|門市|品牌|團隊|顧問|老師|房仲|創作者|agency|company|organization|school|clinic|brand|team/iu.test(
      conversation,
    );
  const hasUseCase =
    /客服|招生|問答|faq|介紹|預約|內部知識|導購|名單|lead|support|admission|sales|concierge|assistant/iu.test(
      conversation,
    );
  const hasKnowledge =
    /pdf|文件|網站|google\s*drive|faq|sop|簡章|資料|document|website|drive|knowledge/iu.test(
      conversation,
    );
  const hasChannel =
    /line|網站|語音|影片|voice|video|web(?:site)?/iu.test(conversation);

  if (isEnglishMessage(message)) {
    if (!hasOrganization || !hasUseCase) {
      return "Absolutely. I won’t make you fill out a long form here—first, what organization or business is this for, and what is the one conversation you most want Celine to handle?";
    }

    if (!hasKnowledge || !hasChannel) {
      return "That gives me a useful starting point. What knowledge do you already have—FAQ, PDF, website, SOP, or Drive files—and would you launch first on LINE or the website?";
    }

    return [
      "I have enough context to help the team start the assessment.",
      "Please use LINE or the free assessment page to share your name, organization, preferred contact method, and whether you need a local/private model. I’ll leave final scope, timeline, and pricing to the human team.",
    ].join("\n");
  }

  if (!hasOrganization || !hasUseCase) {
    return "可以，我先不丟一張長表單給你。先告訴我兩件事：這是替哪一類公司／組織做的？最想先讓 Celine 這類 AI 分身處理哪一種對話？";
  }

  if (!hasKnowledge || !hasChannel) {
    return "這樣我已經抓到方向了。你目前有 FAQ、PDF、網站、SOP 或 Drive 文件嗎？第一個入口想先放在 LINE 還是網站？";
  }

  return [
    "我已經能把這個方向整理成初步評估。",
    "接下來請透過 LINE 或免費評估頁留下姓名、組織與聯絡方式；如果需要本地／私有模型也一起註明。正式範圍、時程與報價會由真人團隊確認。",
  ].join("\n");
}
