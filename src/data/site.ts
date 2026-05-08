import {
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  DatabaseZap,
  Factory,
  FileSearch,
  GraduationCap,
  Headphones,
  Languages,
  LineChart,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export const site = {
  name: "LINE101Chat",
  url: "https://line101chat.com",
  email: "contact@line101chat.com",
  lineAddFriendUrl: "https://line.me/R/ti/p/@539iuksp",
  title: "LINE101Chat｜台灣中小企業 AI 聊天機器人與 RAG 知識助理",
  description:
    "LINE101Chat 幫助台灣中小企業、學校與組織建置 LINE 與網站 AI 聊天機器人，支援 RAG 文件問答、來源引用、SOP 知識庫、招生 FAQ 與印尼文繁體中文翻譯。",
  keywords: [
    "AI 聊天機器人",
    "LINE chatbot",
    "RAG",
    "知識助理",
    "台灣中小企業",
    "SOP chatbot",
    "招生 FAQ",
    "印尼文翻譯",
    "Ollama",
    "本地端 LLM",
  ],
};

export const navItems = [
  { label: "首頁", href: "/" },
  { label: "服務項目", href: "/services" },
  { label: "RAG 知識助理", href: "/rag-chatbot" },
  { label: "LINE 翻譯助理", href: "/translation-chatbot" },
  { label: "成功案例 / Demo", href: "/case-studies" },
  { label: "價格方案", href: "/pricing" },
  { label: "聯絡我們", href: "/contact" },
];

export const primaryCtas = {
  demo: { label: "預約 Demo", href: "/contact" },
  poc: { label: "取得 PoC 評估", href: "/contact" },
  line: { label: "加入 LINE 詢問", href: site.lineAddFriendUrl },
  services: { label: "了解服務方案", href: "/services" },
};

export const problemCards = [
  { title: "重複問題太多", description: "行政、客服與窗口每天回答同樣問題，時間被切得很碎。", icon: MessageCircle },
  { title: "文件散落各處", description: "FAQ、SOP、表單與規章分散在不同資料夾，查找成本高。", icon: FileSearch },
  { title: "新人訓練成本高", description: "制度與經驗難以快速傳承，新人需要反覆問資深同仁。", icon: GraduationCap },
  { title: "LINE 客服回覆慢", description: "客戶與使用者都習慣用 LINE，但人力無法 24/7 回覆。", icon: Headphones },
  { title: "跨語言溝通困難", description: "雇主、移工、看護與工廠現場需要簡單可靠的雙向翻譯。", icon: Languages },
  { title: "重要知識只存在資深員工腦中", description: "關鍵知識沒有被整理成可查詢的系統，離職或調動就流失。", icon: UsersRound },
];

export const coreServices = [
  {
    title: "RAG 知識助理",
    href: "/rag-chatbot",
    icon: DatabaseZap,
    description:
      "將 FAQ、SOP、招生資訊、規章、產品手冊與內部文件轉換成可查詢的 AI 助理。回答時可附上來源，降低錯誤與重複工作。",
  },
  {
    title: "LINE 翻譯助理",
    href: "/translation-chatbot",
    icon: Languages,
    description:
      "針對台灣雇主、移工、看護、工廠與仲介場景，提供印尼文與繁體中文之間的自然翻譯，協助日常溝通。",
  },
];

export const audienceSegments = [
  { label: "學校 / 系所 / 研究所", icon: GraduationCap },
  { label: "補習班與教育機構", icon: ClipboardCheck },
  { label: "製造業中小企業", icon: Factory },
  { label: "電商與客服團隊", icon: Headphones },
  { label: "HR / 行政 / IT 內部支援", icon: Building2 },
  { label: "移工仲介與雇主", icon: UsersRound },
  { label: "長照與看護家庭", icon: MessageCircle },
];

export const processSteps = [
  "需求訪談",
  "文件盤點",
  "資料整理",
  "建立 RAG 知識庫",
  "LINE / Web Chatbot 串接",
  "測試與修正",
  "上線與維護",
];

export const benefits = [
  "降低 30-70% 重複查詢工作量",
  "提升回覆速度",
  "減少新人訓練時間",
  "保留組織知識",
  "讓員工專注處理高價值任務",
  "讓客服與行政團隊不用立刻增聘人力",
  "讓使用者可以 24/7 查詢資訊",
];

export const packages = [
  {
    title: "Starter PoC",
    description: "用一個明確場景驗證文件品質、問答準確度與使用流程。",
    items: ["1 個服務場景", "20-30 頁乾淨文件", "LINE 或網站介面", "基礎準確度檢查"],
  },
  {
    title: "Standard Business Assistant",
    description: "適合正式導入客服、行政、招生、內部支援或產品知識庫。",
    items: ["多分類知識庫", "LINE + Web 整合", "管理者更新流程", "使用紀錄與維護方案"],
  },
  {
    title: "Custom Enterprise / Private Deployment",
    description: "適合需要本地端、私有雲、權限控管或系統整合的組織。",
    items: ["Local LLM / Ollama", "私有化部署", "客製權限與紀錄", "進階安全與整合"],
  },
];

export const pricingPlans = [
  {
    name: "免費需求評估",
    price: "NT$0",
    summary: "先確認場景、資料狀況與導入可行性。",
    includes: ["30 分鐘諮詢", "使用場景討論", "文件準備建議", "粗略導入評估"],
  },
  {
    name: "Starter PoC",
    price: "NT$80,000 起",
    summary: "用最小範圍驗證 RAG 或翻譯助理是否適合。",
    highlighted: true,
    includes: [
      "1 個聊天機器人使用場景",
      "最多 30 頁乾淨文件",
      "最多 50 個測試問題",
      "基礎 RAG 知識庫",
      "LINE 或網站聊天介面",
      "來源引用",
      "基礎準確度檢查",
    ],
  },
  {
    name: "Business Plan",
    price: "NT$200,000 起",
    summary: "正式導入到部門或客服流程，支援維護與擴充。",
    includes: ["更多文件與分類", "LINE + Web 整合", "管理者更新流程", "使用紀錄", "維護方案選項"],
  },
  {
    name: "Custom / Private Deployment",
    price: "專案報價",
    summary: "適合資料敏感、需要本地端或私有雲部署的組織。",
    includes: ["本地端或私有雲部署", "Local LLM", "權限控管", "客製系統整合", "進階安全與紀錄"],
  },
];

export const faqItems = [
  {
    question: "什麼是 RAG？",
    answer:
      "RAG 是 Retrieval-Augmented Generation，也就是先從你的文件中找出相關內容，再讓 AI 根據找到的內容回答。它適合用在 SOP、FAQ、規章、產品手冊與內部知識庫。",
  },
  {
    question: "和一般 ChatGPT 聊天機器人有什麼不同？",
    answer:
      "一般聊天機器人容易依照模型既有知識回答，內容不一定符合你的公司文件。RAG 知識助理會優先查找你提供的正式資料，並可附上來源，比較適合商務與行政場景。",
  },
  {
    question: "可以接 LINE 嗎？",
    answer:
      "可以。LINE101Chat 可規劃 LINE chatbot 或網站聊天介面，PoC 階段通常會先選一個最常用的入口，避免一開始整合範圍過大。",
  },
  {
    question: "可以部署在本地端嗎？",
    answer:
      "可以依需求評估本地端或私有雲部署，也可使用 Ollama 等 Local LLM 方案。實際架構會依資料敏感度、使用量、硬體與維護能力決定。",
  },
  {
    question: "客戶需要準備什麼文件？",
    answer:
      "建議先準備最新、正式、可選取文字的 FAQ、SOP、規章、招生資訊或產品文件。PoC 階段以 20-30 頁乾淨資料與 30-50 個真實問題最容易驗證成效。",
  },
  {
    question: "PoC 通常需要多久？",
    answer:
      "若文件清楚、範圍明確，通常 2-4 週可完成第一版 PoC。若需要大量文件清理、權限設計或系統整合，時程會再拉長。",
  },
  {
    question: "可以取代員工嗎？",
    answer:
      "初期通常不是完全取代員工，而是先減少重複問答、文件查找與新人訓練工作。當問題量夠大、文件品質夠好時，可節省約 0.3-1.5 人力等值的工作量。",
  },
  {
    question: "文件內容會不會外洩？",
    answer:
      "客戶文件只會用於約定的聊天機器人開發、測試與維護。敏感資料建議另外簽訂資料處理與保密約定，也可評估本地端或私有化部署。",
  },
  {
    question: "可以支援英文、印尼文或日文嗎？",
    answer:
      "可以依使用場景評估。現有翻譯助理以印尼文與繁體中文雙向溝通為主，RAG 知識助理則可依文件語言與模型能力規劃多語支援。",
  },
  {
    question: "價格怎麼計算？",
    answer:
      "主要依文件量、使用場景數、LINE 或 Web 整合、是否需要本地端部署、使用量紀錄、權限控管與維護頻率計算。建議先從免費需求評估或 Starter PoC 開始。",
  },
];

export const ragUseCases = [
  "招生 FAQ 助理",
  "製造業 SOP 助理",
  "內部 HR / IT 問答",
  "產品客服知識庫",
  "DevSecOps / SonarQube 報告助理",
  "法規與表單查詢助理",
];

export const acceptedFormats = ["Word", "PDF", "Markdown", "TXT", "Excel / CSV", "Website pages"];

export const readinessScores = [
  { title: "文件是否最新", detail: "是否已移除舊版規章、過期表單與不再使用的流程。" },
  { title: "結構是否清楚", detail: "標題、段落、表格與分類越清楚，回答品質越穩定。" },
  { title: "是否為可選取文字", detail: "掃描圖檔需先 OCR，否則 AI 無法可靠讀取內容。" },
  { title: "是否移除重複與過期內容", detail: "重複、矛盾資料會讓答案不穩，PoC 前建議先整理。" },
  { title: "是否提供真實問題", detail: "用實際使用者問題測試，才能看出導入後的真實價值。" },
];

export const demoCases = [
  {
    title: "北科大創新前瞻科技學院 iFIRST RAG Q&A",
    description:
      "使用北科大創新前瞻科技學院公開文件建立的 LINE RAG 問答助理，可依照人工智慧、資訊安全、半導體三個學程分類回答問題，並附上資料來源。",
    features: [
      "Official document retrieval",
      "Three knowledge collections",
      "Source citations",
      "Traditional Chinese LINE answers",
      "Local Ollama LLM backend",
    ],
    icon: SearchCheck,
  },
  {
    title: "Indonesian ⇄ Traditional Chinese LINE Translation Bot",
    description:
      "一個用於日常溝通的 LINE 翻譯助理，支援印尼文與繁體中文雙向翻譯，可搭配使用量紀錄與額度管理。",
    features: ["Text-only translation", "LINE webhook", "Local Ollama model", "Usage records", "Quota and paid user support"],
    icon: Bot,
  },
];

export const trustPoints = [
  { title: "來源引用", description: "讓使用者知道答案根據哪份文件，方便追溯與修正。", icon: CheckCircle2 },
  { title: "資料安全", description: "敏感文件可評估本地端或私有化部署，降低資料外流風險。", icon: ShieldCheck },
  { title: "可衡量效益", description: "以問題量、回覆速度、人工處理時間與使用紀錄判斷成效。", icon: LineChart },
  { title: "導入節奏清楚", description: "先從需求評估與 PoC 開始，再逐步擴充場景與文件。", icon: CalendarDays },
];
