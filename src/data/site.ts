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
  KeyRound,
  Languages,
  LineChart,
  LockKeyhole,
  MessageCircle,
  SearchCheck,
  ServerCog,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

export const site = {
  name: "LINE101Chat",
  url: "https://line101chat.com",
  email: "steven@line101chat.com",
  founderEmail: "steven@line101chat.com",
  mailLoginUrl: "https://mail.zoho.com",
  mailAdminUrl: "https://mailadmin.zoho.com",
  linePageUrl: "/line",
  lineQrImage: "/service.jpg",
  title: "LINE101Chat｜企業 AI 知識助理與 LINE 文件查詢",
  description:
    "LINE101Chat 協助台灣中小企業把公司文件、SOP 與內部知識整理成可保密、可追溯來源、可透過 LINE 快速搜尋的企業 AI 助理。",
  keywords: [
    "AI 聊天機器人",
    "LINE chatbot",
    "企業 AI 助理",
    "RAG",
    "知識助理",
    "公司資料保密",
    "台灣中小企業",
    "北科大",
    "NTUT",
    "SOP chatbot",
    "招生 FAQ",
    "本地端部署",
    "雲端部署",
    "印尼文翻譯",
    "Ollama",
    "本地端 LLM",
  ],
};

export const navItems = [
  { label: "首頁", href: "/" },
  { label: "服務項目", href: "/services" },
  { label: "AI 知識助理", href: "/rag-chatbot" },
  { label: "成功案例 / Demo", href: "/case-studies" },
  { label: "價格方案", href: "/pricing" },
  { label: "聯絡我們", href: "/contact" },
];

export const primaryCtas = {
  demo: { label: "預約 AI 助理 Demo", href: "/contact" },
  poc: { label: "取得 AI 助理 PoC 評估", href: "/contact" },
  line: { label: "加入 LINE 詢問", href: site.linePageUrl },
  services: { label: "查看 AI 助理方案", href: "/services" },
};

export const problemCards = [
  { title: "重複問題太多", description: "行政、客服與窗口每天回答同樣問題，時間被切得很碎。", icon: MessageCircle },
  { title: "文件散落各處", description: "FAQ、SOP、表單與規章分散在不同資料夾，查找成本高。", icon: FileSearch },
  { title: "新人訓練成本高", description: "制度與經驗難以快速傳承，新人需要反覆問資深同仁。", icon: GraduationCap },
  { title: "LINE 客服回覆慢", description: "客戶與使用者都習慣用 LINE，但人力無法 24/7 回覆。", icon: Headphones },
  { title: "資料不適合隨便外流", description: "合約、SOP、客戶資料與內部知識需要清楚的存取邊界。", icon: LockKeyhole },
  { title: "重要知識只存在資深員工腦中", description: "關鍵知識沒有被整理成可查詢的系統，離職或調動就流失。", icon: UsersRound },
];

export const coreServices = [
  {
    title: "企業 AI 知識助理（核心服務）",
    href: "/rag-chatbot",
    icon: DatabaseZap,
    description:
      "將 FAQ、SOP、規章、產品手冊與內部文件轉換成可透過 LINE 查詢、可追溯來源、可依資料敏感度規劃保密邊界的 AI 助理。",
  },
  {
    title: "LINE 翻譯選配模組",
    href: "/translation-chatbot",
    icon: Languages,
    description:
      "若 AI 知識助理上線後仍有跨語言現場溝通需求，可再加上印尼文與繁體中文雙向翻譯；它不是主服務，而是選配模組。",
  },
];

export const teamHighlights = [
  {
    title: "北科大工程背景",
    description:
      "工程團隊來自 NTUT（國立台北科技大學 / 北科大），熟悉台灣企業對務實、穩定與可維護系統的期待。",
    icon: GraduationCap,
  },
  {
    title: "台灣 SME 導入節奏",
    description:
      "先做 2-3 週小範圍 PoC，再用 4-6 週正式上線，避免中小企業一開始就承擔過大的導入風險。",
    icon: Building2,
  },
  {
    title: "雲端與本地端都可規劃",
    description:
      "可依文件敏感度、預算、IT 維運能力與使用量，選擇雲端代管、本地端主機或私有雲部署，讓資料留在可控範圍。",
    icon: ShieldCheck,
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
  "建立 AI 知識庫",
  "LINE / Web Chatbot 串接",
  "測試與修正",
  "上線與維護",
];

export const benefits = [
  "降低 30-70% 重複查詢工作量",
  "讓同仁在 LINE 裡快速查公司知識",
  "提升回覆速度",
  "減少新人訓練時間",
  "保留組織知識",
  "讓員工專注處理高價值任務",
  "讓客服與行政團隊不用立刻增聘人力",
  "讓使用者可以 24/7 查詢資訊",
  "先用雲端快速驗證，再依敏感度評估本地端部署",
];

export const securityPrinciples = [
  {
    title: "資料邊界先定義",
    description: "先盤點哪些文件可進 PoC、哪些資料需遮蔽、哪些場景必須本地端或私有雲。",
    icon: LockKeyhole,
  },
  {
    title: "LINE 入口，後端可控",
    description: "使用者在熟悉的 LINE 提問，文件索引、權限與紀錄則依企業需求放在可管理的環境。",
    icon: MessageCircle,
  },
  {
    title: "來源引用與修正流程",
    description: "答案附上文件來源，管理者可以追查、修正與更新知識庫，避免黑箱回答。",
    icon: SearchCheck,
  },
  {
    title: "雲端或本地端部署",
    description: "一般資料可用雲端快速驗證，敏感資料可評估本地端、私有雲、權限控管與稽核紀錄。",
    icon: ServerCog,
  },
];

export const packages = [
  {
    title: "AI Assistant Starter PoC",
    price: "NT$50,000-90,000",
    description: "用一個明確場景驗證 LINE 查詢體驗、文件品質、問答準確度與資料邊界。",
    items: ["2-3 週", "1 個服務場景", "20-40 頁乾淨文件", "LINE 或網站介面", "基礎準確度檢查"],
    highlighted: true,
  },
  {
    title: "SME Cloud RAG",
    price: "NT$120,000-260,000",
    description: "適合正式導入客服、行政、招生、內部支援或產品知識庫。",
    items: ["4-6 週", "多分類知識庫", "LINE + Web 整合", "管理者更新流程", "使用紀錄與維護方案"],
  },
  {
    title: "Local / Private RAG",
    price: "NT$350,000 起",
    description: "適合需要本地端、私有雲、權限控管或系統整合的組織。",
    items: ["6-10 週", "Local LLM / Ollama", "本地端或私有雲部署", "客製權限與紀錄", "進階安全與整合"],
  },
];

export const pricingPlans = [
  {
    name: "免費需求評估",
    price: "NT$0",
    summary: "先確認場景、資料狀況與導入可行性。",
    timeline: "30 分鐘",
    bestFor: "還在評估是否要導入 AI 的 SME",
    includes: ["30 分鐘諮詢", "使用場景討論", "文件準備建議", "粗略導入評估"],
  },
  {
    name: "AI Assistant Starter PoC",
    price: "NT$50,000-90,000",
    summary: "用最小範圍驗證 LINE AI 助理是否真的能降低重複問答與文件查找成本。",
    timeline: "2-3 週",
    bestFor: "第一次導入 AI 知識助理的中小企業",
    highlighted: true,
    includes: [
      "1 個 AI 助理使用場景",
      "20-40 頁乾淨文件",
      "最多 50 個測試問題",
      "基礎 AI 知識庫與索引",
      "LINE 或網站聊天介面",
      "來源引用",
      "基礎準確度檢查",
    ],
  },
  {
    name: "SME Cloud RAG",
    price: "NT$120,000-260,000",
    summary: "正式導入到部門、客服或招生流程，由雲端代管降低維運負擔。",
    timeline: "4-6 週",
    bestFor: "希望快速上線、沒有專職 IT 維運人力的 SME",
    includes: [
      "100-300 頁文件建置",
      "LINE + Web 整合",
      "管理者更新流程",
      "使用紀錄與問題回顧",
      "月維護費 NT$12,000-35,000 起",
    ],
  },
  {
    name: "Local / Private RAG",
    price: "NT$350,000 起",
    summary: "適合資料敏感、需要本地端或私有雲部署的組織。",
    timeline: "6-10 週",
    bestFor: "有內部 IT、資料不適合外流或需權限控管的組織",
    includes: [
      "本地端或私有雲部署",
      "Local LLM / Ollama 可評估",
      "權限控管與稽核紀錄",
      "客製系統整合",
      "月維護費 NT$35,000-90,000 起",
    ],
  },
  {
    name: "Translation Optional Module",
    price: "NT$30,000-80,000",
    summary: "在既有 LINE chatbot 或企業 AI 助理導入後，加上印尼文繁體中文雙向翻譯。",
    timeline: "1-2 週",
    bestFor: "已有 LINE 使用流程，另需跨語言溝通的現場團隊",
    includes: [
      "Indonesian ⇄ Traditional Chinese",
      "LINE 文字訊息翻譯",
      "使用量紀錄",
      "額度或付費模式規劃",
      "可接在 AI 助理或 LINE chatbot 後方",
    ],
  },
];

export const deploymentOptions = [
  {
    name: "Cloud-hosted RAG",
    priceSignal: "建置 NT$120,000-260,000；維護 NT$12,000-35,000 / 月起",
    timeline: "約 4-6 週正式上線",
    pros: ["上線速度快", "不用自備 GPU 或伺服器", "維運負擔低", "適合先驗證 ROI"],
    cons: ["敏感文件需審慎評估", "長期大量使用會有雲端費用", "需規劃資料處理與存取邊界"],
  },
  {
    name: "Local / Private RAG",
    priceSignal: "建置 NT$350,000 起；維護 NT$35,000-90,000 / 月起",
    timeline: "約 6-10 週，視硬體與權限整合而定",
    pros: ["資料留在客戶環境", "可做更嚴格權限與稽核", "適合內規、合約或研發資料", "可評估 Local LLM / Ollama"],
    cons: ["初期成本較高", "需要 IT 維運與硬體規劃", "模型更新與效能調校需要長期管理"],
  },
];

export const smeRolloutSchedule = [
  {
    phase: "Phase 0",
    title: "免費需求評估",
    duration: "30 分鐘",
    detail: "確認痛點、文件狀況、使用者與是否需要雲端或本地端部署。",
  },
  {
    phase: "Phase 1",
    title: "AI Assistant Starter PoC",
    duration: "2-3 週",
    detail: "以 20-40 頁文件與 30-50 個真實問題驗證回答品質、來源引用、資料邊界與 LINE / Web 體驗。",
  },
  {
    phase: "Phase 2",
    title: "SME 正式導入",
    duration: "4-6 週",
    detail: "擴充文件分類、管理者更新流程、使用紀錄與維護機制，讓團隊開始日常使用。",
  },
  {
    phase: "Phase 3",
    title: "私有化或加值服務",
    duration: "依範圍評估",
    detail: "依資料敏感度升級本地端 / 私有雲，或加購翻譯、權限、稽核與系統整合。",
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
      "一般聊天機器人容易依照模型既有知識回答，內容不一定符合你的公司文件。企業 AI 知識助理會優先查找你提供的正式資料，並可附上來源，比較適合商務與行政場景。",
  },
  {
    question: "可以接 LINE 嗎？",
    answer:
      "可以。LINE101Chat 可規劃 LINE chatbot 或網站聊天介面，PoC 階段通常會先選一個最常用的入口，避免一開始整合範圍過大。",
  },
  {
    question: "可以部署在本地端嗎？",
    answer:
      "可以依需求評估本地端或私有雲部署，也可使用 Ollama 等 Local LLM 方案。雲端上線快、維護成本較低；本地端初期成本較高，但資料可留在客戶環境。",
  },
  {
    question: "客戶需要準備什麼文件？",
    answer:
      "建議先準備最新、正式、可選取文字的 FAQ、SOP、規章、招生資訊或產品文件。PoC 階段以 20-40 頁乾淨資料與 30-50 個真實問題最容易驗證成效。",
  },
  {
    question: "PoC 通常需要多久？",
    answer:
      "若文件清楚、範圍明確，AI Assistant Starter PoC 通常 2-3 週可完成第一版。正式雲端導入多為 4-6 週；本地端或私有雲因硬體、權限與資安流程，通常需 6-10 週以上。",
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
      "可以依使用場景評估。企業 AI 知識助理會先以文件問答為主；印尼文與繁體中文雙向翻譯則定位為選配模組，可在核心 LINE 查詢流程穩定後加購。",
  },
  {
    question: "價格怎麼計算？",
    answer:
      "主要依文件量、使用場景數、LINE 或 Web 整合、部署位置、使用量紀錄、權限控管與維護頻率計算。台灣中小企業建議先從免費需求評估或 NT$50,000-90,000 的 AI Assistant Starter PoC 開始。",
  },
  {
    question: "為什麼強調北科大工程背景？",
    answer:
      "工程團隊來自 NTUT（國立台北科技大學 / 北科大），對台灣企業常見的務實導入、維護成本、資安與文件流程有更貼近市場的理解。",
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
    title: "北科大創新前瞻科技學院 iFIRST AI 文件問答",
    description:
      "使用北科大創新前瞻科技學院公開文件建立的 LINE AI 文件問答助理，可依照人工智慧、資訊安全、半導體三個學程分類回答問題，並附上資料來源。",
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
    title: "LINE 翻譯選配模組 Demo",
    description:
      "一個可在核心 LINE AI 助理上線後選配的翻譯模組，支援印尼文與繁體中文雙向翻譯，可搭配使用量紀錄與額度管理。",
    features: ["Text-only translation", "LINE webhook", "Local Ollama model", "Usage records", "Quota and paid user support"],
    icon: Bot,
  },
];

export const trustPoints = [
  { title: "來源引用", description: "讓使用者知道答案根據哪份文件，方便追溯與修正。", icon: CheckCircle2 },
  { title: "北科大工程背景", description: "NTUT（國立台北科技大學 / 北科大）工程團隊，適合需要在地信任感的台灣 SME 市場。", icon: GraduationCap },
  { title: "資料保密", description: "敏感文件可評估本地端、私有雲與權限控管，降低公司資訊外流風險。", icon: ShieldCheck },
  { title: "可衡量效益", description: "以問題量、回覆速度、人工處理時間與使用紀錄判斷成效。", icon: LineChart },
  { title: "導入節奏清楚", description: "先從需求評估與 PoC 開始，再逐步擴充場景與文件。", icon: CalendarDays },
];

export const emailAccounts = [
  {
    address: site.email,
    label: "Steven",
    purpose: "LINE101Chat 主要商務往來與網站詢問",
    icon: KeyRound,
  },
];
