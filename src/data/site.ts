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
  LogOut,
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
  demo: { label: "預約 AI 助理 Demo", href: "/book-demo" },
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

export type Locale = "zh" | "en";

export const localeLabels = {
  zh: "中文",
  en: "English",
};

export const localeHtmlLang = {
  zh: "zh-Hant-TW",
  en: "en",
};

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "zh";
}

export function localizePath(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) {
    return href;
  }

  const cleanHref = href === "/en" ? "/" : href.replace(/^\/en(?=\/|$)/, "") || "/";

  if (locale === "en") {
    return cleanHref === "/" ? "/en" : `/en${cleanHref}`;
  }

  return cleanHref;
}

export function alternateLocalePath(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  return localizePath(pathname, locale === "en" ? "zh" : "en");
}

export const siteContent = {
  zh: {
    site,
    navItems,
    primaryCtas,
    problemCards,
    coreServices,
    teamHighlights,
    audienceSegments,
    processSteps,
    benefits,
    securityPrinciples,
    packages,
    pricingPlans,
    deploymentOptions,
    smeRolloutSchedule,
    faqItems,
    ragUseCases,
    acceptedFormats,
    readinessScores,
    demoCases,
    trustPoints,
    emailAccounts,
    labels: {
      brandTagline: "LINE AI knowledge assistant",
      navAria: "主要導覽",
      mobileNavAria: "手機導覽",
      openMenu: "開啟選單",
      switchLanguage: "English",
      switchLanguageAria: "Switch to English",
      readMore: "了解更多",
      recommendedPoc: "建議 PoC 起點",
      timeline: "時程：",
      bestFor: "適合：",
      faqTitle: "常見問題",
      nextStep: "下一步",
      ctaBubble: "先釐清文件與場景，再決定是否值得做 PoC。",
      websiteNav: "網站導覽",
      resources: "資源",
      contact: "聯絡",
      footerDescription:
        "北科大工程背景團隊，協助台灣中小企業、學校與組織，把公司文件整理成可透過 LINE 查詢、可追溯來源、可依資料敏感度部署的企業 AI 知識助理。",
      privacyPolicy: "Privacy policy",
      contactPlan: "AI 助理 PoC / 雲端或本地端部署：",
      addLine: "加入 LINE 詢問",
      directContact: "直接聯絡",
      pros: "優點",
      cons: "限制",
    },
    hero: {
      features: ["企業 AI 助理", "LINE 快速查詢", "來源引用", "資料保密邊界"],
      eyebrow: "台灣中小企業 AI 助理 / 北科大工程團隊",
      title: "LINE101Chat 企業 AI 助理，讓公司知識保密又好查",
      description:
        "把 SOP、合約摘要、產品手冊、FAQ 與內部制度整理成可透過 LINE 搜尋的 AI 助理。依資料敏感度規劃雲端、本地端或私有雲部署，讓答案好找，也讓公司資訊留在可控範圍。",
      speech:
        "我是 LINE101Chat 的 AI 解決方案顧問，會先協助你盤點文件敏感度與查詢場景，再規劃 LINE 入口、來源引用與部署方式。",
      stats: [
        ["30 分鐘", "先做需求評估"],
        ["2-3 週", "AI 助理 Starter PoC"],
        ["雲端 / 本地端", "依資料敏感度部署"],
      ],
    },
    pages: {
      home: {
        metadata: {
          title: site.title,
          description: site.description,
          canonical: "/",
        },
        sections: {
          problems: {
            eyebrow: "導入痛點",
            title: "我們解決的問題",
            description:
              "不是每個組織都需要大型 AI 平台。很多時候，先把文件整理好、把資料邊界定義清楚，讓同仁在 LINE 裡查得到答案，就能立即減少團隊壓力。",
          },
          core: {
            eyebrow: "核心服務",
            title: "企業 AI 知識助理是主服務，翻譯只是選配",
            description:
              "先把正式文件變成能追溯來源、能在 LINE 快速查詢、能依資料敏感度部署的 AI 助理。確認成效後，再視現場需求加上翻譯或其他模組。",
          },
          security: {
            eyebrow: "資料保密",
            title: "讓公司資訊留在可控邊界，也能被 LINE 快速搜尋",
            description:
              "LINE101Chat 的重點不是把所有資料丟進公開模型，而是先界定資料範圍、部署方式與更新流程，讓公司知識變得好查、可追溯、可維護。",
          },
          trust: {
            eyebrow: "台灣市場信任",
            title: "北科大工程背景，為台灣 SME 做務實導入",
            description:
              "導入 AI 不只是 demo 漂亮，更要符合台灣公司對預算、維護、資料安全與可追溯答案的要求。",
          },
          audiences: {
            eyebrow: "適用對象",
            title: "適合誰使用？",
            description: "LINE101Chat 特別適合已經累積大量文件、表單、FAQ 或日常 LINE 溝通量的台灣組織。",
          },
          process: {
            eyebrow: "導入流程",
            title: "導入流程",
            description:
              "先用小範圍 AI 助理 PoC 驗證文件品質、LINE 查詢體驗與效益，再依資料敏感度決定雲端、本地端或私有化部署。",
          },
          benefits: {
            eyebrow: "可衡量效益",
            title: "可以帶來什麼效益？",
            description: "成效會依文件品質與問題量而不同。我們會以實際問題測試，避免只看展示效果。",
          },
          maintenance: {
            eyebrow: "信任與維護",
            title: "把 AI 導入做得務實、可追溯、可維護",
            description:
              "企業 AI 助理與 LINE chatbot 的價值不只在會聊天，而是在能否回答得準、能否追溯來源、能否保護資料邊界，並被團隊長期維護。",
          },
        },
        cta: {
          title: "想知道你的公司適不適合導入 AI 聊天助理？",
          body: "先從 30 分鐘需求評估開始，我們會協助你確認文件狀況、適合的使用場景，以及 PoC 需要準備的資料。",
          buttonLabel: "預約 30 分鐘需求評估",
        },
      },
      services: {
        metadata: {
          title: "服務項目｜企業 AI 知識助理與 LINE 文件查詢",
          description:
            "了解 LINE101Chat 的企業 AI 知識助理、LINE 文件查詢、資料保密部署、SME Cloud RAG、Local / Private RAG 與翻譯選配模組。",
          canonical: "/services",
        },
        hero: {
          eyebrow: "服務項目",
          title: "服務項目",
          description:
            "LINE101Chat 的主軸是企業 AI 知識助理：讓 AI 根據正式文件回答問題、附上來源、透過 LINE 快速搜尋，並依資料敏感度規劃雲端、本地端或私有雲。翻譯 chatbot 僅作為選配模組。",
        },
        bullets: [
          "從需求評估開始，先確認是否真的適合導入。",
          "AI 助理 PoC 範圍明確，避免一開始投入過大。",
          "重視文件品質、來源引用、權限邊界與資料保密。",
          "可依場景選擇 LINE、網站、雲端、本地端或私有雲部署。",
        ],
        presenterQuote:
          "不確定該做雲端還是本地端？可以先從 AI 助理需求評估開始，我們會協助你用文件敏感度、預算與維運能力判斷導入路徑。",
        comparison: {
          eyebrow: "服務比較",
          title: "先讓公司知識變好查，再看是否需要翻譯選配",
          description:
            "如果問題主要來自公司文件查找、重複問答與資訊保密，企業 AI 知識助理是第一優先；如果上線後還有跨語言日常溝通，再加上 LINE 翻譯模組。",
          headers: ["項目", "企業 AI 知識助理", "LINE 翻譯選配模組"],
          rows: [
            ["定位", "核心導入服務", "企業 AI 助理或 LINE chatbot 上線後的選配模組"],
            ["適合對象", "學校、系所、SME、客服、HR、IT、製造業", "已有跨語言 LINE 溝通量的團隊"],
            ["主要解決問題", "公司知識查找、重複問答、來源追溯、內部知識保存、資料保密邊界", "印尼文與繁體中文日常溝通、現場指示、照護與工作對話"],
            ["使用資料", "FAQ、SOP、規章、產品手冊、招生資訊、內部文件", "LINE 文字訊息、翻譯紀錄、額度與使用量設定"],
            ["部署方式", "LINE chatbot、網站 chatbot、雲端、本地端或私有雲", "LINE chatbot、本地端或私有化 LLM backend"],
            ["收費模式", "AI 助理 PoC、建置費、維護費、客製整合", "選配建置費、月費、使用量或額度制"],
            ["最適合的第一步", "準備 20-40 頁正式文件與真實問題做 AI Assistant Starter PoC", "先確認是否已有 LINE 使用流程與實際翻譯量"],
          ],
        },
        plans: {
          eyebrow: "導入方案",
          title: "台灣 SME 導入方案",
          description:
            "以中小企業可承擔的節奏安排：先用 Starter PoC 驗證 LINE 查詢體驗、來源引用與資料邊界，再依敏感度選擇 SME Cloud RAG 或 Local / Private RAG。",
          noteBefore: "詳細價格請參考",
          noteLink: "價格方案",
          noteAfter: "，或寄信至",
          noteBook: "預約",
        },
      },
      rag: {
        metadata: {
          title: "企業 AI 知識助理｜LINE 文件查詢、資料保密與來源引用",
          description:
            "LINE101Chat 企業 AI 知識助理可將 FAQ、SOP、規章、產品手冊與內部文件轉為 LINE 或網站 AI 問答助理，支援來源引用、資料保密邊界、雲端代管與本地端部署。",
          canonical: "/rag-chatbot",
        },
        hero: {
          eyebrow: "Core Service / Enterprise AI Knowledge Assistant",
          title: "企業 AI 知識助理：公司資料保密，也能在 LINE 一問就找到",
          description:
            "LINE101Chat 不是讓 AI 憑空回答，而是先從你的文件中找出相關內容，再根據這些內容產生答案。企業可以依資料敏感度規劃雲端、本地端或私有雲，讓同仁用熟悉的 LINE 快速查 SOP、產品手冊、內部制度與客服知識庫。",
        },
        callout: {
          label: "顧問提醒",
          title: "先定義資料邊界，再談導入規模",
          body: "AI 助理成敗通常取決於文件是否正式、最新、結構清楚，以及哪些資料可以進 PoC。雲端或本地端部署會依敏感度一起評估。",
        },
        reasonsHeading: {
          eyebrow: "為什麼選文件檢索式 AI",
          title: "為什麼文件檢索式 AI 比一般聊天機器人更適合商務場景？",
          description:
            "中小企業與學校最在意的通常不是 AI 說得多漂亮，而是答案是否符合正式文件、是否能追溯來源、資料是否在可控邊界內，以及是否能長期維護。",
        },
        reasons: [
          "回答前先查找你的正式文件，而不是只依賴模型記憶。",
          "可附上來源段落或文件名稱，方便使用者追溯。",
          "使用者可透過 LINE 問問題，不必知道文件放在哪個資料夾。",
          "可依文件敏感度規劃雲端、本地端或私有雲部署。",
          "當文件更新時，可透過知識庫更新改善答案。",
          "比一般聊天機器人更適合招生規章、SOP、內部制度與客服知識庫。",
        ],
        useCasesHeading: {
          eyebrow: "使用場景",
          title: "常見使用場景",
          description: "只要有正式文件、重複問題與明確使用者，就很適合先做小範圍 PoC。",
        },
        deploymentHeading: {
          eyebrow: "部署架構",
          title: "雲端代管或本地端部署，依資料敏感度決定",
          description:
            "企業 AI 助理的價格與時程會受到部署方式影響。多數 SME 可先用雲端快速驗證 ROI；敏感資料、內規或研發文件則可評估本地端或私有雲。",
        },
        documentsHeading: {
          eyebrow: "文件準備",
          title: "文件準備方式",
          description:
            "PoC 階段建議先準備 20-40 頁乾淨、正式、最新的文件。資料越清楚，越容易評估 AI 助理的真實效果。",
        },
        quote: "PoC 階段建議先準備 20-40 頁乾淨、正式、最新的文件。",
        readinessHeading: {
          eyebrow: "Data Readiness",
          title: "Data Readiness Score",
          description: "這五項可以快速判斷你的文件是否適合進入 PoC。若分數偏低，先整理文件會比直接導入更有效。",
        },
        scheduleHeading: {
          eyebrow: "導入節奏",
          title: "適合 SME 的 AI 助理導入時程",
          description: "用可控範圍快速驗證 LINE 查詢體驗、來源引用與資料邊界，再把預算花在確定有價值的正式導入與維護。",
        },
      },
      translation: {
        metadata: {
          title: "翻譯選配模組｜LINE 印尼文繁體中文雙向翻譯",
          description:
            "LINE101Chat 翻譯選配模組支援 Indonesian ⇄ Traditional Chinese，可在企業 AI 知識助理或 LINE chatbot 上線後視需求加購。",
          canonical: "/translation-chatbot",
        },
        hero: {
          eyebrow: "Optional Add-on / LINE Translation Assistant",
          title: "翻譯選配模組：需要時再讓 LINE 支援印尼文繁體中文",
          description:
            "LINE101Chat 的主服務是企業 AI 知識助理與 LINE 文件查詢；若你的現場還需要跨語言溝通，才加購印尼文與繁體中文雙向翻譯，讓雇主、移工、看護、工廠管理者、仲介與家庭用熟悉的 LINE 溝通。",
        },
        callout: {
          label: "適合日常使用",
          title: "先把核心 AI 助理做穩，再依需求加上翻譯",
          body: "適合已經有 LINE 使用流程、需要頻繁跨語言溝通，但又希望操作方式簡單的場景。",
        },
        featuresHeading: {
          eyebrow: "服務能力",
          title: "為台灣現場情境保留的選配能力",
          description:
            "翻譯助理不取代企業 AI 知識助理，而是在核心文件查詢流程完成後，補上日常句子、提醒、工作安排與照護溝通的跨語言需求。",
        },
        features: [
          "定位為企業 AI 助理之後的選配模組",
          "Indonesian ⇄ Traditional Chinese",
          "直接在 LINE 裡使用",
          "適合移工、看護、工廠、仲介與家庭",
          "可評估本地端 / 私有化 LLM backend",
          "可搭配使用量紀錄",
          "可規劃額度與付費使用模式",
        ],
        demo: {
          title: "LINE 對話示意",
          description:
            "使用者只要把訊息貼到 LINE，bot 會回傳另一種語言的自然翻譯。正式導入時可接在既有 LINE chatbot 後方，並加上紀錄、額度與使用者管理。",
          conversation: [
            { speaker: "User", text: "Saya akan tiba jam 8 pagi." },
            { speaker: "Bot", text: "我早上 8 點會到。" },
            { speaker: "User", text: "今天請記得帶健保卡。" },
            { speaker: "Bot", text: "Hari ini jangan lupa membawa kartu asuransi kesehatan." },
          ],
        },
      },
      caseStudies: {
        metadata: {
          title: "成功案例 / Demo｜LINE101Chat",
          description:
            "查看 LINE101Chat 的核心企業 AI 文件問答助理 Demo，以及可選配的 Indonesian ⇄ Traditional Chinese 翻譯模組 Demo。",
          canonical: "/case-studies",
        },
        heading: {
          eyebrow: "成功案例 / Demo",
          title: "成功案例 / Demo",
          description:
            "目前展示重點是能引用來源、可透過 LINE 查詢的企業 AI 文件問答助理；印尼文繁體中文翻譯則只作為選配模組 Demo。",
        },
        cards: [
          ["PoC 重點", "先選一個可衡量的場景，例如招生 FAQ、SOP 查詢或跨語言溝通。"],
          ["驗證方式", "使用真實問題測試回答準確度、來源引用、LINE 使用體驗、資料邊界與維護流程。"],
          ["下一步", "若 AI 助理 PoC 成效明確，再擴充文件、使用者、權限、雲端或本地端部署。"],
        ],
        cta: {
          title: "想用你的文件做第一個 Demo？",
          body: "準備一份乾淨文件與真實問題，我們可以協助判斷是否適合做企業 AI 助理 Starter PoC。",
          label: "取得 AI 助理 PoC 評估",
        },
      },
      pricing: {
        metadata: {
          title: "價格方案｜LINE101Chat",
          description:
            "LINE101Chat 提供企業 AI 知識助理 Starter PoC、SME Cloud RAG、Local / Private RAG 與翻譯選配模組，適合台灣中小企業導入 LINE 文件查詢。",
          canonical: "/pricing",
        },
        heading: {
          eyebrow: "價格方案",
          title: "符合台灣 SME 節奏的企業 AI 助理價格方案",
          description:
            "先用小額 PoC 驗證 LINE 查詢體驗、來源引用與資料保密邊界，再決定正式導入、雲端代管或本地端私有化。翻譯 chatbot 不是主方案，而是可在 LINE 流程成熟後選配。",
        },
        maintenanceTitle: "月維護費",
        maintenanceBody:
          "維護費依文件更新頻率、使用量、部署位置與整合複雜度而定。雲端代管通常從 NT$12,000-35,000 / 月起；本地端或私有雲因需維運、資安與效能調校，通常從 NT$35,000-90,000 / 月起。",
        scheduleHeading: {
          eyebrow: "導入時程",
          title: "從 30 分鐘評估到正式上線",
          description: "台灣中小企業通常需要先看到可驗證成果，再逐步擴大預算與導入範圍。",
        },
        deploymentHeading: {
          eyebrow: "部署選擇",
          title: "AI 助理可以雲端代管，也可以本地端 / 私有雲",
          description: "部署方式會直接影響價格、時程、維護責任與資料安全邊界。",
        },
      },
      contact: {
        metadata: {
          title: "聯絡我們｜預約 Demo 與 PoC 評估",
          description:
            "聯絡 LINE101Chat，預約 30 分鐘企業 AI 知識助理需求評估、LINE 文件查詢 Demo、資料保密部署或本地端私有化部署討論。",
          canonical: "/contact",
        },
        heading: {
          eyebrow: "聯絡我們",
          title: "聯絡我們",
          description:
            "如果你正在評估企業 AI 知識助理、LINE 文件查詢、雲端代管或本地端部署，歡迎先用一封信描述目前的文件、使用場景與資料敏感度。",
        },
        callout: {
          label: "30 分鐘需求評估",
          title: "先聊清楚，再決定是否做 AI 助理 PoC",
          body: "我們會協助確認文件狀況、資料敏感度、使用者場景、LINE 或網站入口、雲端或本地端部署方向，以及 PoC 需要準備的資料。",
        },
        qrAlt: "加入 LINE101Chat LINE 官方帳號 QR Code",
      },
      about: {
        metadata: {
          title: "關於 LINE101Chat｜北科大工程團隊打造企業 AI 知識助理",
          description:
            "LINE101Chat 由 NTUT（國立台北科技大學 / 北科大）工程背景團隊打造，專注於台灣中小企業可以實際落地的企業 AI 知識助理與 LINE 文件查詢。",
          canonical: "/about",
        },
        heading: {
          eyebrow: "關於我們",
          title: "關於 LINE101Chat",
          description:
            "LINE101Chat 專注於台灣中小企業、學校與組織可以實際落地的企業 AI 知識助理。工程團隊來自 NTUT（國立台北科技大學 / 北科大），重視文件品質、公司資料保密、來源引用、LINE 使用體驗與可衡量的工作效率改善。",
        },
        values: [
          ["務實", "先確認場景、資料與效益，再決定導入範圍。"],
          ["可信任", "回答需要能追溯來源，敏感資料需要明確處理方式。"],
          ["可維護", "AI chatbot 必須能隨文件更新與組織流程長期調整。"],
        ],
        teamHeading: {
          eyebrow: "工程團隊",
          title: "北科大工程背景，貼近台灣企業採購信任",
          description:
            "對台灣 SME 來說，AI 導入必須兼顧預算、時程、維護責任與資料安全。北科大工程背景讓我們更適合用務實方式把 AI 助理做進既有 LINE 與文件流程。",
        },
        callout: {
          label: "品牌體驗",
          title: "有人味的 AI 服務體驗",
          body: "我們希望 AI 服務不只是冷冰冰的技術工具，而是由清楚的導入流程、可信任的顧問角色、可控的資料邊界與穩定的系統設計組成。網站中的品牌顧問形象，代表 LINE101Chat 希望帶給客戶的溫度與專業感。",
          actionLabel: "預約需求評估",
        },
      },
      line: {
        metadata: {
          title: "加入 LINE 詢問｜LINE101Chat",
          description: `掃描 LINE101Chat LINE 官方帳號 QR Code，或寄信至 ${site.email} 洽詢企業 AI 知識助理。`,
          canonical: "/line",
        },
        eyebrow: "LINE101Chat Official LINE",
        title: "加入 LINE 詢問",
        description: "掃描 QR Code，詢問企業 AI 知識助理、LINE 文件查詢、資料保密部署或 PoC 評估。",
        contactLabel: "聯絡我們",
        subject: "LINE101Chat 需求評估",
        qrAlt: "加入 LINE101Chat LINE 官方帳號 QR Code",
      },
      privacy: {
        metadata: {
          title: "Privacy Policy｜LINE101Chat",
          description: "LINE101Chat 隱私權政策，說明聯絡資料、客戶文件、LINE 訊息紀錄與資料刪除請求的處理方式。",
          canonical: "/privacy",
        },
        eyebrow: "隱私權",
        title: "LINE101Chat 隱私權政策",
        intro: "本政策說明 LINE101Chat 在網站聯絡、需求評估、PoC 與 chatbot 服務過程中，如何處理客戶提供的資料與文件。",
        sections: [
          {
            title: "1. 我們收集的資料",
            body: "我們只收集客戶透過聯絡表單、Email、LINE 或諮詢過程主動提供的資訊，例如姓名、公司或組織、Email、電話 / LINE ID、服務需求與訊息內容。",
          },
          {
            title: "2. 客戶文件使用方式",
            body: "客戶提供的文件只會用於約定的 chatbot 開發、測試、調整與維護。文件可能包含 FAQ、SOP、規章、產品手冊、招生資訊或內部知識資料。",
          },
          {
            title: "3. 敏感文件",
            body: "若文件包含個資、營業秘密、法務資料、醫療照護內容或其他敏感資訊，應在專案開始前另行確認資料處理方式、保密約定與部署環境。",
          },
          {
            title: "4. 本地端與私有化部署",
            body: "若客戶有較高資料安全需求，LINE101Chat 可依專案需求評估本地端或私有雲部署，包含 Local LLM、Ollama 或其他私有化架構。",
          },
          {
            title: "5. LINE 訊息與使用紀錄",
            body: "當客戶啟用 chatbot 服務時，LINE 訊息可能會在客戶同意的範圍內被記錄，用於除錯、使用量分析、服務改善、額度管理或客戶支援。",
          },
          {
            title: "6. 資料刪除請求",
            body: "客戶可要求刪除聯絡資料、測試文件或專案資料。我們會依實際專案狀態、備份週期與法律或合約要求處理。",
          },
          {
            title: "7. 不販售客戶資料",
            body: "LINE101Chat 不會有意將客戶資料、文件內容或訊息紀錄出售給廣告商。",
          },
          {
            title: "8. 政策更新",
            body: "本政策可能依服務內容與法規需求更新。若更新涉及重大資料處理方式變更，會以適當方式通知客戶。",
          },
        ],
      },
      feiz: {
        metadata: {
          title: "私人信箱登入｜LINE101Chat",
          description: "LINE101Chat 私人信箱登入入口。",
          canonical: "/feiz",
        },
        tips: [
          {
            title: "使用無痕視窗登入",
            detail: "如果瀏覽器已登入其他 Zoho 帳號，請用無痕視窗開啟，避免自動連到錯的信箱。",
            icon: ShieldCheck,
          },
          {
            title: "先登出其他 Zoho 帳號",
            detail: "若 Zoho Mail 直接進入其他信箱，請從右上角頭像登出後，再輸入 Steven 帳號。",
            icon: LogOut,
          },
          {
            title: "密碼不放在網站",
            detail: "密碼、兩階段驗證與恢復方式請只在 Zoho 帳號內管理，網站只保留登入捷徑。",
            icon: KeyRound,
          },
        ],
        eyebrow: "LINE101Chat Private Email Access",
        title: "私人信箱登入",
        descriptionPrefix: "這個頁面只提供",
        descriptionSuffix: "的 Zoho Mail 快速入口。密碼與兩階段驗證請在 Zoho 帳號內管理，不會存放在網站中。",
        primaryLogin: "主要登入網址",
        openZoho: "開啟 Zoho Mail",
        accountLabel: "Steven",
        purpose: "LINE101Chat 主要商務往來、網站詢問與客戶回覆信箱。",
        useAccount: "使用此帳號登入",
      },
    },
    contactForm: {
      copyIdle: "複製信件內容",
      copySuccess: "已複製",
      copyError: "複製失敗",
      emailHeader: "LINE101Chat 需求評估",
      fallbackSubjectName: "網站詢問",
      subjectPrefix: "LINE101Chat 需求評估",
      labels: {
        name: "Name",
        organization: "Company / Organization",
        email: "Email",
        phone: "Phone / LINE ID",
        service: "Service interest",
        message: "Message",
      },
      placeholders: {
        name: "王小明",
        organization: "公司、學校或單位名稱",
        email: "name@example.com",
        phone: "手機或 LINE ID",
        service: "請選擇感興趣的服務",
        message: "請簡單描述你的文件類型、使用對象、希望接 LINE 或網站、資料是否敏感，以及目前遇到的問題。",
      },
      serviceOptions: [
        "企業 AI 助理 Starter PoC",
        "SME Cloud RAG",
        "Local / Private RAG",
        "翻譯選配模組",
        "還不確定，需要先評估",
      ],
      recipientLabel: "收件信箱：",
      submitLabel: "開啟 Email 送出",
    },
  },
  en: {
    site: {
      ...site,
      title: "LINE101Chat | Enterprise AI Knowledge Assistant and LINE Document Search",
      description:
        "LINE101Chat helps Taiwan SMEs turn company documents, SOPs, and internal knowledge into a confidential, source-grounded AI assistant that employees can search through LINE.",
      keywords: [
        "AI chatbot",
        "LINE chatbot",
        "enterprise AI assistant",
        "RAG",
        "knowledge assistant",
        "company data confidentiality",
        "Taiwan SMEs",
        "NTUT",
        "SOP chatbot",
        "admissions FAQ",
        "local deployment",
        "cloud deployment",
        "Indonesian translation",
        "Ollama",
        "local LLM",
      ],
    },
    navItems: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "AI Knowledge Assistant", href: "/rag-chatbot" },
      { label: "Case Studies / Demo", href: "/case-studies" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
    primaryCtas: {
      demo: { label: "Book an AI Assistant Demo", href: "/book-demo" },
      poc: { label: "Get an AI Assistant PoC Review", href: "/contact" },
      line: { label: "Ask on LINE", href: site.linePageUrl },
      services: { label: "View AI Assistant Plans", href: "/services" },
    },
    problemCards: [
      { title: "Too many repeated questions", description: "Admin, support, and frontline teams answer the same questions every day, fragmenting their time.", icon: MessageCircle },
      { title: "Documents are scattered", description: "FAQs, SOPs, forms, and policies live in different folders, making answers expensive to find.", icon: FileSearch },
      { title: "Training new staff is costly", description: "Processes and experience are hard to transfer quickly, so new teammates keep asking senior staff.", icon: GraduationCap },
      { title: "LINE replies are slow", description: "Customers and users already prefer LINE, but human teams cannot respond 24/7.", icon: Headphones },
      { title: "Data cannot flow anywhere", description: "Contracts, SOPs, customer information, and internal knowledge need clear access boundaries.", icon: LockKeyhole },
      { title: "Key knowledge stays in senior employees' heads", description: "Critical know-how is not organized into a searchable system and can disappear when people move roles.", icon: UsersRound },
    ],
    coreServices: [
      {
        title: "Enterprise AI Knowledge Assistant (Core Service)",
        href: "/rag-chatbot",
        icon: DatabaseZap,
        description:
          "Turn FAQs, SOPs, policies, product manuals, and internal documents into an AI assistant searchable through LINE, with source citations and deployment boundaries planned around data sensitivity.",
      },
      {
        title: "LINE Translation Add-on Module",
        href: "/translation-chatbot",
        icon: Languages,
        description:
          "If cross-language field communication is still needed after the AI knowledge assistant goes live, add Indonesian and Traditional Chinese two-way translation as an optional module.",
      },
    ],
    teamHighlights: [
      {
        title: "NTUT engineering background",
        description:
          "The engineering team comes from NTUT (National Taipei University of Technology), with a practical understanding of Taiwan organizations' expectations for stable, maintainable systems.",
        icon: GraduationCap,
      },
      {
        title: "Rollout pace for Taiwan SMEs",
        description:
          "Start with a focused 2-3 week PoC, then move into a 4-6 week production rollout so SMEs do not take on too much implementation risk at the beginning.",
        icon: Building2,
      },
      {
        title: "Cloud and local deployment planning",
        description:
          "Choose cloud hosting, local servers, or private cloud based on document sensitivity, budget, IT operations capacity, and expected usage.",
        icon: ShieldCheck,
      },
    ],
    audienceSegments: [
      { label: "Schools / departments / graduate programs", icon: GraduationCap },
      { label: "Cram schools and education providers", icon: ClipboardCheck },
      { label: "Manufacturing SMEs", icon: Factory },
      { label: "E-commerce and support teams", icon: Headphones },
      { label: "HR / admin / IT support", icon: Building2 },
      { label: "Migrant worker agencies and employers", icon: UsersRound },
      { label: "Long-term care and caregiver families", icon: MessageCircle },
    ],
    processSteps: [
      "Discovery interview",
      "Document inventory",
      "Data cleanup",
      "Build AI knowledge base",
      "Connect LINE / web chatbot",
      "Test and refine",
      "Launch and maintain",
    ],
    benefits: [
      "Reduce repeated inquiry workload by 30-70%",
      "Let teammates search company knowledge inside LINE",
      "Improve response speed",
      "Reduce new employee training time",
      "Preserve organizational knowledge",
      "Help staff focus on higher-value work",
      "Avoid immediate headcount increases for support and admin teams",
      "Let users find information 24/7",
      "Validate quickly in the cloud, then assess local deployment for sensitive data",
    ],
    securityPrinciples: [
      {
        title: "Define data boundaries first",
        description: "Identify which documents can enter the PoC, which data must be masked, and which scenarios need local or private-cloud deployment.",
        icon: LockKeyhole,
      },
      {
        title: "LINE entry, controlled backend",
        description: "Users ask questions in familiar LINE conversations while document indexes, permissions, and logs are managed in an environment chosen for the organization.",
        icon: MessageCircle,
      },
      {
        title: "Source citations and correction flow",
        description: "Answers cite document sources so managers can trace, correct, and update the knowledge base instead of trusting a black box.",
        icon: SearchCheck,
      },
      {
        title: "Cloud or local deployment",
        description: "Use cloud for faster validation, or evaluate local servers, private cloud, permission controls, and audit logs for sensitive material.",
        icon: ServerCog,
      },
    ],
    packages: [
      {
        title: "AI Assistant Starter PoC",
        price: "NT$50,000-90,000",
        description: "Validate LINE search experience, document quality, answer accuracy, and data boundaries with one clear scenario.",
        items: ["2-3 weeks", "1 service scenario", "20-40 clean pages", "LINE or website interface", "Basic accuracy check"],
        highlighted: true,
      },
      {
        title: "SME Cloud RAG",
        price: "NT$120,000-260,000",
        description: "For production rollout in support, admin, admissions, internal helpdesk, or product knowledge workflows.",
        items: ["4-6 weeks", "Multi-category knowledge base", "LINE + web integration", "Admin update flow", "Usage records and maintenance plan"],
      },
      {
        title: "Local / Private RAG",
        price: "From NT$350,000",
        description: "For organizations that need local hosting, private cloud, permission controls, or system integration.",
        items: ["6-10 weeks", "Local LLM / Ollama", "Local or private-cloud deployment", "Custom permissions and logs", "Advanced security and integration"],
      },
    ],
    pricingPlans: [
      {
        name: "Free Needs Assessment",
        price: "NT$0",
        summary: "Confirm use cases, data readiness, and implementation feasibility first.",
        timeline: "30 minutes",
        bestFor: "SMEs still evaluating whether AI is worth adopting",
        includes: ["30-minute consultation", "Use-case discussion", "Document preparation advice", "Rough implementation assessment"],
      },
      {
        name: "AI Assistant Starter PoC",
        price: "NT$50,000-90,000",
        summary: "Validate in a small scope whether a LINE AI assistant can reduce repeated Q&A and document lookup work.",
        timeline: "2-3 weeks",
        bestFor: "SMEs adopting an AI knowledge assistant for the first time",
        highlighted: true,
        includes: [
          "1 AI assistant use case",
          "20-40 clean document pages",
          "Up to 50 test questions",
          "Basic AI knowledge base and index",
          "LINE or website chat interface",
          "Source citations",
          "Basic accuracy check",
        ],
      },
      {
        name: "SME Cloud RAG",
        price: "NT$120,000-260,000",
        summary: "Move into a department, support, or admissions workflow with cloud hosting to reduce operations load.",
        timeline: "4-6 weeks",
        bestFor: "SMEs that want to launch quickly without dedicated IT operations staff",
        includes: [
          "100-300 document pages",
          "LINE + web integration",
          "Admin update workflow",
          "Usage logs and question review",
          "Monthly maintenance from NT$12,000-35,000",
        ],
      },
      {
        name: "Local / Private RAG",
        price: "From NT$350,000",
        summary: "For organizations with sensitive data that need local or private-cloud deployment.",
        timeline: "6-10 weeks",
        bestFor: "Organizations with internal IT, sensitive data, or permission-control requirements",
        includes: [
          "Local or private-cloud deployment",
          "Local LLM / Ollama assessment",
          "Permission controls and audit logs",
          "Custom system integration",
          "Monthly maintenance from NT$35,000-90,000",
        ],
      },
      {
        name: "Translation Optional Module",
        price: "NT$30,000-80,000",
        summary: "Add Indonesian and Traditional Chinese two-way translation after a LINE chatbot or enterprise AI assistant is in place.",
        timeline: "1-2 weeks",
        bestFor: "Field teams that already use LINE and need cross-language communication",
        includes: [
          "Indonesian ⇄ Traditional Chinese",
          "LINE text message translation",
          "Usage records",
          "Quota or paid-use planning",
          "Can sit behind the AI assistant or LINE chatbot",
        ],
      },
    ],
    deploymentOptions: [
      {
        name: "Cloud-hosted RAG",
        priceSignal: "Build NT$120,000-260,000; maintenance from NT$12,000-35,000 / month",
        timeline: "Production launch in about 4-6 weeks",
        pros: ["Fast launch", "No GPU or server ownership required", "Lower operations burden", "Good for validating ROI first"],
        cons: ["Sensitive documents need careful review", "Large long-term usage creates cloud costs", "Data processing and access boundaries must be planned"],
      },
      {
        name: "Local / Private RAG",
        priceSignal: "Build from NT$350,000; maintenance from NT$35,000-90,000 / month",
        timeline: "About 6-10 weeks, depending on hardware and permission integration",
        pros: ["Data stays in the customer environment", "Stronger permissions and audit controls", "Suitable for internal rules, contracts, or R&D data", "Local LLM / Ollama can be assessed"],
        cons: ["Higher initial cost", "Requires IT operations and hardware planning", "Model updates and performance tuning need ongoing management"],
      },
    ],
    smeRolloutSchedule: [
      {
        phase: "Phase 0",
        title: "Free needs assessment",
        duration: "30 minutes",
        detail: "Confirm pain points, document status, users, and whether cloud or local deployment is needed.",
      },
      {
        phase: "Phase 1",
        title: "AI Assistant Starter PoC",
        duration: "2-3 weeks",
        detail: "Use 20-40 document pages and 30-50 real questions to validate answer quality, source citations, data boundaries, and LINE / web experience.",
      },
      {
        phase: "Phase 2",
        title: "SME production rollout",
        duration: "4-6 weeks",
        detail: "Expand document categories, admin update flows, usage records, and maintenance mechanisms so the team can use it daily.",
      },
      {
        phase: "Phase 3",
        title: "Private deployment or add-ons",
        duration: "Scope-based",
        detail: "Upgrade to local / private cloud by data sensitivity, or add translation, permissions, audit logs, and system integration.",
      },
    ],
    faqItems: [
      {
        question: "What is RAG?",
        answer:
          "RAG means Retrieval-Augmented Generation. The system first retrieves relevant content from your documents, then asks AI to answer based on that content. It fits SOPs, FAQs, policies, product manuals, and internal knowledge bases.",
      },
      {
        question: "How is this different from a normal ChatGPT chatbot?",
        answer:
          "A normal chatbot may answer from the model's general knowledge, which may not match your company documents. An enterprise AI knowledge assistant prioritizes the official materials you provide and can include source citations.",
      },
      {
        question: "Can it connect to LINE?",
        answer:
          "Yes. LINE101Chat can plan a LINE chatbot or website chat interface. In the PoC stage, we usually choose one primary entry point to keep the first scope focused.",
      },
      {
        question: "Can it be deployed locally?",
        answer:
          "Yes. Local or private-cloud deployment can be assessed, including Local LLM options such as Ollama. Cloud deployment is faster and lower maintenance; local deployment costs more up front but keeps data in the customer environment.",
      },
      {
        question: "What documents should customers prepare?",
        answer:
          "Start with current, official, selectable-text FAQs, SOPs, policies, admissions information, or product documents. A PoC is easiest to validate with 20-40 clean pages and 30-50 real questions.",
      },
      {
        question: "How long does a PoC take?",
        answer:
          "If the documents are clear and the scope is focused, an AI Assistant Starter PoC usually takes 2-3 weeks. Production cloud rollout is often 4-6 weeks; local or private-cloud deployment usually takes 6-10 weeks or more.",
      },
      {
        question: "Will this replace employees?",
        answer:
          "Early adoption usually reduces repeated Q&A, document lookup, and training work rather than fully replacing staff. With enough question volume and good documents, it can save roughly 0.3-1.5 FTE-equivalent workload.",
      },
      {
        question: "Will document content leak?",
        answer:
          "Customer documents are used only for the agreed chatbot development, testing, and maintenance. Sensitive data should be covered by separate data-processing and confidentiality agreements, and local or private deployment can be assessed.",
      },
      {
        question: "Can it support English, Indonesian, or Japanese?",
        answer:
          "Yes, depending on the use case. The enterprise AI knowledge assistant focuses first on document Q&A; Indonesian and Traditional Chinese translation is positioned as an optional add-on after the core LINE search flow is stable.",
      },
      {
        question: "How is pricing calculated?",
        answer:
          "Pricing depends on document volume, number of use cases, LINE or web integration, deployment location, usage records, permission controls, and maintenance frequency. Taiwan SMEs are encouraged to start with the free assessment or the NT$50,000-90,000 Starter PoC.",
      },
      {
        question: "Why emphasize the NTUT engineering background?",
        answer:
          "The engineering team comes from NTUT (National Taipei University of Technology), giving us a closer understanding of practical AI rollout, maintenance cost, security, and document workflows in Taiwan organizations.",
      },
    ],
    ragUseCases: [
      "Admissions FAQ assistant",
      "Manufacturing SOP assistant",
      "Internal HR / IT Q&A",
      "Product support knowledge base",
      "DevSecOps / SonarQube report assistant",
      "Regulation and form lookup assistant",
    ],
    acceptedFormats: ["Word", "PDF", "Markdown", "TXT", "Excel / CSV", "Website pages"],
    readinessScores: [
      { title: "Are documents current?", detail: "Remove outdated policies, expired forms, and processes no longer in use." },
      { title: "Is the structure clear?", detail: "Clear headings, paragraphs, tables, and categories make answer quality more stable." },
      { title: "Is the text selectable?", detail: "Scanned images need OCR first; otherwise AI cannot reliably read the content." },
      { title: "Are duplicates and outdated content removed?", detail: "Repeated or conflicting content makes answers unstable, so clean it before the PoC." },
      { title: "Can you provide real questions?", detail: "Testing with real user questions reveals the actual value after rollout." },
    ],
    demoCases: [
      {
        title: "NTUT iFIRST AI Document Q&A",
        description:
          "A LINE AI document Q&A assistant built from public documents from NTUT's College of Innovation and Frontier Technology. It answers by Artificial Intelligence, Information Security, and Semiconductor program categories with source citations.",
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
        title: "LINE Translation Add-on Demo",
        description:
          "An optional translation module that can be added after the core LINE AI assistant is live, supporting Indonesian and Traditional Chinese two-way translation with usage records and quota management.",
        features: ["Text-only translation", "LINE webhook", "Local Ollama model", "Usage records", "Quota and paid user support"],
        icon: Bot,
      },
    ],
    trustPoints: [
      { title: "Source citations", description: "Show users which document the answer came from, making review and correction easier.", icon: CheckCircle2 },
      { title: "NTUT engineering background", description: "An NTUT engineering team suited to Taiwan SMEs that need local trust and practical implementation.", icon: GraduationCap },
      { title: "Data confidentiality", description: "Sensitive documents can be assessed for local servers, private cloud, and permission controls to reduce leakage risk.", icon: ShieldCheck },
      { title: "Measurable value", description: "Evaluate results through question volume, response speed, human handling time, and usage records.", icon: LineChart },
      { title: "Clear rollout pace", description: "Start with needs assessment and PoC, then expand scenarios and documents gradually.", icon: CalendarDays },
    ],
    emailAccounts: [
      {
        address: site.email,
        label: "Steven",
        purpose: "Primary LINE101Chat business, website inquiry, and customer reply mailbox",
        icon: KeyRound,
      },
    ],
    labels: {
      brandTagline: "LINE AI knowledge assistant",
      navAria: "Primary navigation",
      mobileNavAria: "Mobile navigation",
      openMenu: "Open menu",
      switchLanguage: "中文",
      switchLanguageAria: "切換至中文",
      readMore: "Learn more",
      recommendedPoc: "Recommended PoC starting point",
      timeline: "Timeline: ",
      bestFor: "Best for: ",
      faqTitle: "Frequently Asked Questions",
      nextStep: "Next step",
      ctaBubble: "Clarify documents and scenarios first, then decide whether a PoC is worthwhile.",
      websiteNav: "Navigation",
      resources: "Resources",
      contact: "Contact",
      footerDescription:
        "An NTUT engineering team helping Taiwan SMEs, schools, and organizations turn company documents into a LINE-searchable, source-grounded enterprise AI knowledge assistant with deployment boundaries based on data sensitivity.",
      privacyPolicy: "Privacy policy",
      contactPlan: "AI assistant PoC / cloud or local deployment:",
      addLine: "Ask on LINE",
      directContact: "Direct contact",
      pros: "Pros",
      cons: "Constraints",
    },
    hero: {
      features: ["Enterprise AI assistant", "Fast LINE search", "Source citations", "Data boundaries"],
      eyebrow: "AI assistant for Taiwan SMEs / NTUT engineering team",
      title: "LINE101Chat keeps company knowledge confidential and easy to find",
      description:
        "Turn SOPs, contract summaries, product manuals, FAQs, and internal policies into an AI assistant searchable through LINE. Plan cloud, local, or private-cloud deployment by data sensitivity so answers are easy to find while company information stays controlled.",
      speech:
        "I am LINE101Chat's AI solution consultant. I help you assess document sensitivity and search scenarios before planning the LINE entry point, source citations, and deployment model.",
      stats: [
        ["30 minutes", "Start with needs assessment"],
        ["2-3 weeks", "AI Assistant Starter PoC"],
        ["Cloud / local", "Deploy by data sensitivity"],
      ],
    },
    pages: {
      home: {
        metadata: {
          title: "LINE101Chat | Enterprise AI Knowledge Assistant and LINE Document Search",
          description:
            "LINE101Chat helps Taiwan SMEs turn SOPs, FAQs, and internal documents into a confidential, source-grounded AI knowledge assistant searchable through LINE.",
          canonical: "/en",
        },
        sections: {
          problems: {
            eyebrow: "Implementation Pain Points",
            title: "Problems We Solve",
            description:
              "Not every organization needs a large AI platform. Often, organizing documents, defining data boundaries, and making answers searchable in LINE is enough to relieve team pressure right away.",
          },
          core: {
            eyebrow: "Core Service",
            title: "The enterprise AI knowledge assistant is the core service; translation is optional",
            description:
              "First, turn official documents into a source-grounded AI assistant that can be searched quickly in LINE and deployed according to data sensitivity. Add translation or other modules only after the core flow proves useful.",
          },
          security: {
            eyebrow: "Data Confidentiality",
            title: "Keep company information within controlled boundaries while making it searchable in LINE",
            description:
              "LINE101Chat is not about dropping all data into a public model. We define data scope, deployment model, and update workflows so company knowledge becomes searchable, traceable, and maintainable.",
          },
          trust: {
            eyebrow: "Taiwan Market Trust",
            title: "An NTUT engineering background for practical Taiwan SME rollouts",
            description:
              "AI adoption needs more than a good demo. It must fit Taiwan companies' expectations for budget, maintenance, data security, and traceable answers.",
          },
          audiences: {
            eyebrow: "Audience",
            title: "Who is it for?",
            description: "LINE101Chat is especially useful for Taiwan organizations with many documents, forms, FAQs, or frequent LINE-based communication.",
          },
          process: {
            eyebrow: "Rollout Process",
            title: "Implementation Process",
            description:
              "Use a small AI assistant PoC to validate document quality, LINE search experience, and business value, then decide whether cloud, local, or private deployment fits the data sensitivity.",
          },
          benefits: {
            eyebrow: "Measurable Benefits",
            title: "What value can it create?",
            description: "Results depend on document quality and question volume. We test with real questions instead of relying only on demo impressions.",
          },
          maintenance: {
            eyebrow: "Trust and Maintenance",
            title: "Make AI adoption practical, traceable, and maintainable",
            description:
              "The value of an enterprise AI assistant is not just conversation. It must answer accurately, cite sources, protect data boundaries, and be maintained by the team over time.",
          },
        },
        cta: {
          title: "Want to know whether your company is ready for an AI chat assistant?",
          body: "Start with a 30-minute needs assessment. We will help confirm document status, suitable use cases, and the data needed for a PoC.",
          buttonLabel: "Book a 30-minute needs assessment",
        },
      },
      services: {
        metadata: {
          title: "Services | Enterprise AI Knowledge Assistant and LINE Document Search",
          description:
            "Learn about LINE101Chat's enterprise AI knowledge assistant, LINE document search, confidential deployment planning, SME Cloud RAG, Local / Private RAG, and optional translation module.",
          canonical: "/en/services",
        },
        hero: {
          eyebrow: "Services",
          title: "Services",
          description:
            "LINE101Chat centers on the enterprise AI knowledge assistant: AI answers from official documents, cites sources, searches quickly through LINE, and plans cloud, local, or private-cloud deployment according to data sensitivity. Translation is only an optional add-on.",
        },
        bullets: [
          "Start with needs assessment to confirm whether adoption is truly worthwhile.",
          "Keep the AI assistant PoC focused so the first investment stays controlled.",
          "Prioritize document quality, source citations, permission boundaries, and confidentiality.",
          "Choose LINE, web, cloud, local, or private-cloud deployment based on the scenario.",
        ],
        presenterQuote:
          "Not sure whether to choose cloud or local deployment? Start with an AI assistant needs assessment; we will use document sensitivity, budget, and operations capacity to recommend a rollout path.",
        comparison: {
          eyebrow: "Service Comparison",
          title: "Make company knowledge searchable first, then decide whether translation is needed",
          description:
            "If the main problem is document lookup, repeated Q&A, and information confidentiality, the enterprise AI knowledge assistant comes first. If cross-language daily communication remains after launch, add the LINE translation module.",
          headers: ["Item", "Enterprise AI Knowledge Assistant", "LINE Translation Add-on Module"],
          rows: [
            ["Positioning", "Core implementation service", "Optional module after the enterprise AI assistant or LINE chatbot is live"],
            ["Best for", "Schools, departments, SMEs, support, HR, IT, manufacturing", "Teams that already have cross-language LINE communication volume"],
            ["Main problems solved", "Company knowledge lookup, repeated Q&A, source traceability, organizational knowledge preservation, data boundaries", "Indonesian and Traditional Chinese daily communication, field instructions, care and work conversations"],
            ["Data used", "FAQs, SOPs, policies, product manuals, admissions information, internal documents", "LINE text messages, translation logs, quota and usage settings"],
            ["Deployment", "LINE chatbot, website chatbot, cloud, local, or private cloud", "LINE chatbot, local or private LLM backend"],
            ["Pricing model", "AI assistant PoC, build fee, maintenance fee, custom integration", "Optional build fee, monthly fee, usage or quota model"],
            ["Best first step", "Prepare 20-40 pages of official documents and real questions for an AI Assistant Starter PoC", "Confirm whether a LINE workflow and real translation volume already exist"],
          ],
        },
        plans: {
          eyebrow: "Implementation Plans",
          title: "Rollout Plans for Taiwan SMEs",
          description:
            "Use a pace that SMEs can manage: validate LINE search experience, source citations, and data boundaries with a Starter PoC, then choose SME Cloud RAG or Local / Private RAG based on sensitivity.",
          noteBefore: "For detailed pricing, see",
          noteLink: "Pricing",
          noteAfter: ", or email",
          noteBook: "to book",
        },
      },
      rag: {
        metadata: {
          title: "Enterprise AI Knowledge Assistant | LINE Document Search, Confidentiality, and Source Citations",
          description:
            "LINE101Chat turns FAQs, SOPs, policies, product manuals, and internal documents into a LINE or web AI Q&A assistant with source citations, data boundaries, cloud hosting, and local deployment options.",
          canonical: "/en/rag-chatbot",
        },
        hero: {
          eyebrow: "Core Service / Enterprise AI Knowledge Assistant",
          title: "Enterprise AI Knowledge Assistant: keep company data private and searchable in LINE",
          description:
            "LINE101Chat does not let AI answer from nowhere. It first retrieves relevant content from your documents, then generates answers based on those materials. Organizations can plan cloud, local, or private-cloud deployment by data sensitivity while teammates search SOPs, product manuals, internal policies, and support knowledge through familiar LINE conversations.",
        },
        callout: {
          label: "Consultant Note",
          title: "Define data boundaries before sizing the rollout",
          body: "AI assistant success usually depends on whether documents are official, current, clearly structured, and appropriate for the PoC. Cloud or local deployment is assessed alongside sensitivity.",
        },
        reasonsHeading: {
          eyebrow: "Why Retrieval-Based AI",
          title: "Why document-retrieval AI fits business workflows better than a generic chatbot",
          description:
            "SMEs and schools usually care less about impressive language and more about whether answers match official documents, cite sources, stay within controlled data boundaries, and can be maintained over time.",
        },
        reasons: [
          "It searches your official documents before answering instead of relying only on model memory.",
          "It can attach source sections or document names for easier traceability.",
          "Users can ask questions in LINE without knowing which folder holds the document.",
          "Cloud, local, or private-cloud deployment can be planned by document sensitivity.",
          "When documents change, updating the knowledge base improves answers.",
          "It fits admissions rules, SOPs, internal policies, and support knowledge bases better than a generic chatbot.",
        ],
        useCasesHeading: {
          eyebrow: "Use Cases",
          title: "Common Use Cases",
          description: "If you have official documents, repeated questions, and clear users, a focused PoC is a strong first step.",
        },
        deploymentHeading: {
          eyebrow: "Deployment Architecture",
          title: "Choose cloud hosting or local deployment based on data sensitivity",
          description:
            "The price and timeline of an enterprise AI assistant are affected by deployment model. Most SMEs can validate ROI quickly in the cloud; sensitive data, internal rules, or R&D documents may require local or private-cloud deployment.",
        },
        documentsHeading: {
          eyebrow: "Document Preparation",
          title: "How to Prepare Documents",
          description:
            "For the PoC stage, prepare 20-40 clean, official, current pages. Clearer data makes it easier to evaluate the real impact of the AI assistant.",
        },
        quote: "For the PoC stage, prepare 20-40 clean, official, current pages.",
        readinessHeading: {
          eyebrow: "Data Readiness",
          title: "Data Readiness Score",
          description: "These five checks quickly show whether your documents are ready for a PoC. If the score is low, cleaning documents first is more effective than jumping into implementation.",
        },
        scheduleHeading: {
          eyebrow: "Rollout Pace",
          title: "An AI assistant rollout timeline for SMEs",
          description: "Validate LINE search experience, source citations, and data boundaries in a controlled scope before spending budget on production rollout and maintenance.",
        },
      },
      translation: {
        metadata: {
          title: "Translation Add-on Module | LINE Indonesian and Traditional Chinese Translation",
          description:
            "LINE101Chat's optional translation module supports Indonesian ⇄ Traditional Chinese and can be added after an enterprise AI knowledge assistant or LINE chatbot is live.",
          canonical: "/en/translation-chatbot",
        },
        hero: {
          eyebrow: "Optional Add-on / LINE Translation Assistant",
          title: "Translation Add-on: add Indonesian and Traditional Chinese support to LINE when needed",
          description:
            "LINE101Chat's core service is the enterprise AI knowledge assistant and LINE document search. If your field workflow also needs cross-language communication, add Indonesian and Traditional Chinese two-way translation so employers, migrant workers, caregivers, factory managers, agencies, and families can communicate in familiar LINE conversations.",
        },
        callout: {
          label: "Built for Daily Use",
          title: "Stabilize the core AI assistant first, then add translation as needed",
          body: "This fits scenarios that already use LINE, need frequent cross-language communication, and require a simple operating model.",
        },
        featuresHeading: {
          eyebrow: "Capabilities",
          title: "Optional capability for Taiwan field communication",
          description:
            "The translation assistant does not replace the enterprise AI knowledge assistant. It adds cross-language support for daily sentences, reminders, work instructions, and care communication after the core document-search flow is ready.",
        },
        features: [
          "Positioned as an add-on after the enterprise AI assistant",
          "Indonesian ⇄ Traditional Chinese",
          "Used directly inside LINE",
          "Suitable for migrant workers, caregivers, factories, agencies, and families",
          "Local / private LLM backend can be assessed",
          "Can include usage records",
          "Quota and paid-use models can be planned",
        ],
        demo: {
          title: "LINE Conversation Example",
          description:
            "Users paste a message into LINE and the bot returns a natural translation in the other language. In production, it can sit behind an existing LINE chatbot and include logs, quotas, and user management.",
          conversation: [
            { speaker: "User", text: "Saya akan tiba jam 8 pagi." },
            { speaker: "Bot", text: "I will arrive at 8 a.m." },
            { speaker: "User", text: "Please remember to bring your health insurance card today." },
            { speaker: "Bot", text: "Hari ini jangan lupa membawa kartu asuransi kesehatan." },
          ],
        },
      },
      caseStudies: {
        metadata: {
          title: "Case Studies / Demo | LINE101Chat",
          description:
            "See LINE101Chat's core enterprise AI document Q&A assistant demo and the optional Indonesian ⇄ Traditional Chinese translation module demo.",
          canonical: "/en/case-studies",
        },
        heading: {
          eyebrow: "Case Studies / Demo",
          title: "Case Studies / Demo",
          description:
            "The current focus is an enterprise AI document Q&A assistant that cites sources and can be searched through LINE. Indonesian and Traditional Chinese translation is shown only as an optional module demo.",
        },
        cards: [
          ["PoC focus", "Choose one measurable scenario first, such as admissions FAQs, SOP lookup, or cross-language communication."],
          ["Validation method", "Test with real questions to check answer accuracy, source citations, LINE experience, data boundaries, and maintenance workflow."],
          ["Next step", "If the AI assistant PoC shows clear value, expand documents, users, permissions, cloud hosting, or local deployment."],
        ],
        cta: {
          title: "Want to build the first demo with your own documents?",
          body: "Prepare one clean document and real questions. We can help judge whether it is a good fit for an enterprise AI Assistant Starter PoC.",
          label: "Get an AI Assistant PoC Review",
        },
      },
      pricing: {
        metadata: {
          title: "Pricing | LINE101Chat",
          description:
            "LINE101Chat offers Enterprise AI Knowledge Assistant Starter PoC, SME Cloud RAG, Local / Private RAG, and optional translation modules for Taiwan SMEs adopting LINE document search.",
          canonical: "/en/pricing",
        },
        heading: {
          eyebrow: "Pricing",
          title: "Enterprise AI assistant pricing that fits Taiwan SME rollout pace",
          description:
            "Validate LINE search experience, source citations, and confidentiality boundaries with a small PoC before deciding on production rollout, cloud hosting, or local/private deployment. Translation is an optional module after the LINE workflow matures.",
        },
        maintenanceTitle: "Monthly Maintenance",
        maintenanceBody:
          "Maintenance fees depend on document update frequency, usage, deployment location, and integration complexity. Cloud hosting usually starts at NT$12,000-35,000 / month; local or private cloud usually starts at NT$35,000-90,000 / month because it includes operations, security, and performance tuning.",
        scheduleHeading: {
          eyebrow: "Rollout Timeline",
          title: "From a 30-minute assessment to production launch",
          description: "Taiwan SMEs usually need verifiable results first, then gradually expand budget and implementation scope.",
        },
        deploymentHeading: {
          eyebrow: "Deployment Choice",
          title: "AI assistants can be cloud-hosted or deployed locally / privately",
          description: "Deployment model directly affects price, timeline, maintenance responsibility, and data-security boundaries.",
        },
      },
      contact: {
        metadata: {
          title: "Contact | Book a Demo and PoC Review",
          description:
            "Contact LINE101Chat to book a 30-minute enterprise AI knowledge assistant needs assessment, LINE document search demo, confidential deployment discussion, or local/private deployment review.",
          canonical: "/en/contact",
        },
        heading: {
          eyebrow: "Contact",
          title: "Contact",
          description:
            "If you are evaluating an enterprise AI knowledge assistant, LINE document search, cloud hosting, or local deployment, start by describing your documents, users, and data sensitivity in one email.",
        },
        callout: {
          label: "30-minute needs assessment",
          title: "Clarify the situation before deciding on an AI assistant PoC",
          body: "We help confirm document status, data sensitivity, user scenarios, LINE or web entry points, cloud or local deployment direction, and the materials needed for a PoC.",
        },
        qrAlt: "QR Code for adding LINE101Chat's official LINE account",
      },
      about: {
        metadata: {
          title: "About LINE101Chat | Enterprise AI Knowledge Assistant Built by an NTUT Engineering Team",
          description:
            "LINE101Chat is built by an NTUT engineering-background team focused on practical enterprise AI knowledge assistants and LINE document search for Taiwan SMEs.",
          canonical: "/en/about",
        },
        heading: {
          eyebrow: "About",
          title: "About LINE101Chat",
          description:
            "LINE101Chat focuses on enterprise AI knowledge assistants that Taiwan SMEs, schools, and organizations can actually adopt. The engineering team comes from NTUT (National Taipei University of Technology), with attention to document quality, company data confidentiality, source citations, LINE experience, and measurable productivity gains.",
        },
        values: [
          ["Practical", "Confirm scenario, data, and expected value before deciding implementation scope."],
          ["Trustworthy", "Answers must be traceable to sources, and sensitive data needs a clear handling model."],
          ["Maintainable", "An AI chatbot must evolve with document updates and organizational workflows."],
        ],
        teamHeading: {
          eyebrow: "Engineering Team",
          title: "NTUT engineering background aligned with Taiwan enterprise buying trust",
          description:
            "For Taiwan SMEs, AI adoption must balance budget, timeline, maintenance ownership, and data security. Our NTUT engineering background helps us bring AI assistants into existing LINE and document workflows pragmatically.",
        },
        callout: {
          label: "Brand Experience",
          title: "An AI service experience with a human touch",
          body: "We believe AI service should be more than a cold technical tool. It should combine a clear rollout process, a trustworthy consultant role, controlled data boundaries, and stable system design. The brand consultant imagery on the site represents the warmth and professionalism LINE101Chat aims to bring to customers.",
          actionLabel: "Book a needs assessment",
        },
      },
      line: {
        metadata: {
          title: "Ask on LINE | LINE101Chat",
          description: `Scan the LINE101Chat official LINE QR Code or email ${site.email} to ask about enterprise AI knowledge assistants.`,
          canonical: "/en/line",
        },
        eyebrow: "LINE101Chat Official LINE",
        title: "Ask on LINE",
        description: "Scan the QR Code to ask about enterprise AI knowledge assistants, LINE document search, confidential deployment, or PoC review.",
        contactLabel: "Contact us",
        subject: "LINE101Chat Needs Assessment",
        qrAlt: "QR Code for adding LINE101Chat's official LINE account",
      },
      privacy: {
        metadata: {
          title: "Privacy Policy | LINE101Chat",
          description:
            "LINE101Chat privacy policy covering contact information, customer documents, LINE message records, and data deletion requests.",
          canonical: "/en/privacy",
        },
        eyebrow: "Privacy",
        title: "LINE101Chat Privacy Policy",
        intro: "This policy explains how LINE101Chat handles information and documents provided during website contact, needs assessment, PoC, and chatbot service work.",
        sections: [
          {
            title: "1. Information We Collect",
            body: "We collect only information that customers voluntarily provide through the contact form, email, LINE, or consultations, such as name, company or organization, email, phone / LINE ID, service needs, and message content.",
          },
          {
            title: "2. How Customer Documents Are Used",
            body: "Customer documents are used only for the agreed chatbot development, testing, adjustment, and maintenance. Documents may include FAQs, SOPs, policies, product manuals, admissions information, or internal knowledge materials.",
          },
          {
            title: "3. Sensitive Documents",
            body: "If documents include personal data, trade secrets, legal materials, medical or care content, or other sensitive information, data handling, confidentiality terms, and deployment environment should be confirmed separately before the project begins.",
          },
          {
            title: "4. Local and Private Deployment",
            body: "For customers with higher data-security needs, LINE101Chat can assess local or private-cloud deployment according to project requirements, including Local LLM, Ollama, or other private architectures.",
          },
          {
            title: "5. LINE Messages and Usage Records",
            body: "When customers enable chatbot services, LINE messages may be recorded within the customer's agreed scope for debugging, usage analysis, service improvement, quota management, or customer support.",
          },
          {
            title: "6. Data Deletion Requests",
            body: "Customers may request deletion of contact information, test documents, or project data. We handle requests according to actual project status, backup cycles, and legal or contractual requirements.",
          },
          {
            title: "7. We Do Not Sell Customer Data",
            body: "LINE101Chat does not intentionally sell customer data, document content, or message records to advertisers.",
          },
          {
            title: "8. Policy Updates",
            body: "This policy may be updated according to service content and legal requirements. If an update involves major changes to data handling, customers will be notified appropriately.",
          },
        ],
      },
      feiz: {
        metadata: {
          title: "Private Email Login | LINE101Chat",
          description: "Private LINE101Chat email login shortcut.",
          canonical: "/en/feiz",
        },
        tips: [
          {
            title: "Use an incognito window",
            detail: "If the browser is already signed into another Zoho account, open an incognito window to avoid landing in the wrong mailbox.",
            icon: ShieldCheck,
          },
          {
            title: "Sign out of other Zoho accounts first",
            detail: "If Zoho Mail opens another mailbox directly, sign out from the top-right avatar, then enter the Steven account.",
            icon: LogOut,
          },
          {
            title: "Passwords are not stored on the website",
            detail: "Passwords, two-factor authentication, and recovery methods should be managed only inside the Zoho account. The website only keeps a login shortcut.",
            icon: KeyRound,
          },
        ],
        eyebrow: "LINE101Chat Private Email Access",
        title: "Private Email Login",
        descriptionPrefix: "This page only provides a Zoho Mail shortcut for",
        descriptionSuffix: ". Passwords and two-factor authentication are managed inside Zoho and are not stored on this website.",
        primaryLogin: "Primary login URL",
        openZoho: "Open Zoho Mail",
        accountLabel: "Steven",
        purpose: "Primary LINE101Chat business, website inquiry, and customer reply mailbox.",
        useAccount: "Log in with this account",
      },
    },
    contactForm: {
      copyIdle: "Copy email content",
      copySuccess: "Copied",
      copyError: "Copy failed",
      emailHeader: "LINE101Chat Needs Assessment",
      fallbackSubjectName: "Website inquiry",
      subjectPrefix: "LINE101Chat Needs Assessment",
      labels: {
        name: "Name",
        organization: "Company / Organization",
        email: "Email",
        phone: "Phone / LINE ID",
        service: "Service interest",
        message: "Message",
      },
      placeholders: {
        name: "Your name",
        organization: "Company, school, or organization",
        email: "name@example.com",
        phone: "Phone or LINE ID",
        service: "Choose the service you are interested in",
        message: "Briefly describe your document types, target users, LINE or website needs, data sensitivity, and current pain points.",
      },
      serviceOptions: [
        "Enterprise AI Assistant Starter PoC",
        "SME Cloud RAG",
        "Local / Private RAG",
        "Translation optional module",
        "Not sure yet; need an assessment first",
      ],
      recipientLabel: "Recipient: ",
      submitLabel: "Open email app",
    },
  },
};

export function getSiteContent(locale: Locale = "zh") {
  return siteContent[locale];
}
