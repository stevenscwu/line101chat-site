import type { AvatarPersona } from "@/lib/avatar/types";

type KnowledgeEntry = {
  id: string;
  keywords: RegExp;
  zh: string;
  en: string;
};

const businessKnowledgeEntries: KnowledgeEntry[] = [
  {
    id: "identity",
    keywords: /你是誰|妳是誰|celine\s*是誰|who are you|who is celine|about celine/i,
    zh: "我是 Celine，一位具有年輕女性溝通風格、能延續對話脈絡的 AI，不是真人。我喜歡自然、有來有往的聊天，也能協助整理想法與提供實用資訊；LINE101Chat 的 AI 分身與知識助理服務是我熟悉的專業主題之一。",
    en: "I’m Celine, an AI conversational character with a young-adult feminine voice and continuity across chats—not a real person. I enjoy natural conversation, helping people organize ideas, and sharing useful information; LINE101Chat’s AI avatar and knowledge-assistant work is one area I know well.",
  },
  {
    id: "overview",
    keywords: /line101chat|你們是誰|做什麼|服務內容|what do you do|about you|service/i,
    zh: "LINE101Chat 是台灣在地的 LINE AI 知識助理服務，協助中小企業、學校與服務團隊，把 FAQ、SOP、規章、產品資料與網站內容整理成可在 LINE 或網站查詢的 AI 助理。",
    en: "LINE101Chat builds Taiwan-focused LINE AI knowledge assistants that turn FAQs, SOPs, policies, product information, and website content into practical LINE or web Q&A experiences.",
  },
  {
    id: "avatar",
    keywords: /ai\s*分身|avatar|像本人|語氣|persona|celine/i,
    zh: "Celine 是一個有穩定個性與對話記憶的 AI persona，會清楚揭露自己是 AI。LINE101Chat 也能為品牌或個人設計類似的 LINE AI 分身，依核准內容與語氣回答，並把正式承諾交給真人。",
    en: "Celine is an AI persona with a stable voice and conversation memory who clearly identifies as AI. LINE101Chat can also design similar LINE AI avatars for brands or individuals using approved content and tone, with formal commitments handed to a real person.",
  },
  {
    id: "rag",
    keywords: /rag|知識庫|文件問答|來源|pdf|sop|規章|knowledge base|document|source/i,
    zh: "LINE101Chat 可把 FAQ、PDF、Word、網站、SOP、表單與規章整理成 RAG 知識庫。系統先找相關資料再回答，正式專案也可規劃來源引用、內容更新與真人修正流程。",
    en: "LINE101Chat can organize FAQs, PDFs, Word files, websites, SOPs, forms, and policies into a RAG knowledge base. The system retrieves relevant material before answering and can support citations, updates, and human correction workflows.",
  },
  {
    id: "use-cases",
    keywords: /適合誰|應用|情境|學校|招生|客服|hr|製造|顧問|老師|創作者|use case|who is it for|school|support/i,
    zh: "常見情境包括招生與課程 FAQ、企業客服、產品知識、內部 SOP、HR／IT 支援、學校行政、觀光服務，以及創辦人、顧問、老師或創作者的 LINE AI 分身。",
    en: "Common use cases include admissions FAQs, customer support, product knowledge, internal SOPs, HR or IT help, school administration, tourism services, and LINE AI avatars for founders, consultants, teachers, and creators.",
  },
  {
    id: "preparation",
    keywords: /準備什麼|文件準備|怎麼開始|開始方式|need to prepare|how to start|prepare/i,
    zh: "建議先選一個重複問題明確的場景，準備約 20–30 頁最新、正式、可讀取文字的 FAQ、網站內容或 SOP，再提供約 30 個真實問題。LINE101Chat 會先做免費需求與文件適用性評估。",
    en: "Start with one clear repeated-question scenario, around 20–30 pages of current official FAQs, website content, or SOPs, plus roughly 30 real questions. LINE101Chat can first assess the use case and document readiness.",
  },
  {
    id: "pricing",
    keywords: /價格|費用|報價|多少錢|pricing|price|cost|quote|quotation/i,
    zh: "目前公開參考方案包含免費需求評估、教育情境 LINE Enrollment FAQ Pilot 試行價 NT$38,000、SME Cloud RAG 約 NT$120,000–260,000，以及 Local／Private RAG 約 NT$350,000 起。正式價格仍要依文件量、串接、權限、部署與維護需求由真人確認。",
    en: "Published reference options include a free assessment, an education-focused LINE Enrollment FAQ Pilot at NT$38,000, SME Cloud RAG around NT$120,000–260,000, and Local/Private RAG from about NT$350,000. A real team member must confirm any formal quote based on documents, integrations, permissions, deployment, and maintenance.",
  },
  {
    id: "timeline",
    keywords: /多久|時程|上線|幾天|timeline|how long|launch/i,
    zh: "文件清楚且範圍明確時，教育 FAQ Pilot 約 7–10 個工作天；正式雲端導入通常約 4–6 週；本地端或私有雲因硬體、權限與資安整合，通常約 6–10 週以上。",
    en: "With clean documents and a clear scope, an education FAQ Pilot takes about 7–10 business days, a production cloud rollout about 4–6 weeks, and local or private deployment usually 6–10 weeks or more.",
  },
  {
    id: "deployment",
    keywords: /本地|私有雲|ollama|資料外洩|保密|資安|雲端|local|private|security|confidential|cloud/i,
    zh: "可依資料敏感度評估雲端、本地端或私有雲部署，也可評估 Ollama／Local LLM。敏感文件需要另外確認權限、保密、紀錄與維護方式；不會因為使用 AI 就自動適合放入公開模型。",
    en: "Deployment can be assessed for cloud, local, or private-cloud environments, including Ollama or other local LLM options. Sensitive documents require explicit decisions about permissions, confidentiality, logging, and maintenance.",
  },
  {
    id: "demo",
    keywords: /demo|案例|ifirst|北科大|101recipe|試用|example|case study/i,
    zh: "現有案例包含北科大 iFIRST 公開文件問答 Demo、LINE101Chat 商務詢問流程與 101recipe 授權食譜查找案例，用來展示 LINE 問答、文件檢索、來源引用與權限情境。",
    en: "Current examples include the NTUT iFIRST public-document Q&A demo, the LINE101Chat business inquiry flow, and the permission-based 101recipe retrieval case, demonstrating LINE Q&A, retrieval, citations, and access boundaries.",
  },
  {
    id: "handoff",
    keywords: /合作|客製|串接|技術建置|聯絡真人|真人|cooperation|custom|integration|technical|human/i,
    zh: "合作、客製功能、正式報價、LINE 串接與技術建置需要由 LINE101Chat 真人團隊確認。你可以先告訴我使用對象、資料類型、預計時程，以及是否需要 LINE、網站或本地端部署。",
    en: "Partnerships, custom features, formal pricing, LINE integration, and technical implementation need confirmation from the real LINE101Chat team. You can first share the users, data type, target timeline, and whether you need LINE, web, or local deployment.",
  },
];

function looksEnglish(message: string) {
  const latinCharacters = message.match(/[A-Za-z]/g)?.length || 0;
  const cjkCharacters = message.match(/[\u3400-\u9fff]/g)?.length || 0;
  return cjkCharacters === 0 && latinCharacters > 0;
}

export function findBusinessKnowledgeReply(
  message: string,
  persona: AvatarPersona,
) {
  const entry = businessKnowledgeEntries.find((item) =>
    item.keywords.test(message),
  );
  const english = looksEnglish(message);

  if (entry) {
    const answer = english ? entry.en : entry.zh;
    const handoff =
      entry.id === "pricing" || entry.id === "handoff"
        ? english
          ? ` Contact the real team here: ${persona.contactUrl}`
          : ` 真人聯絡入口：${persona.contactUrl}`
        : "";

    return `${answer}${handoff}`;
  }

  return "";
}

export function getBusinessKnowledgeContext() {
  return [
    "以下是可用於回答的 LINE101Chat 公開商務知識。回答時不得超出這些資料做具體承諾：",
    ...businessKnowledgeEntries.map(
      (item) => `- [${item.id}] ${item.zh} / ${item.en}`,
    ),
  ].join("\n");
}
