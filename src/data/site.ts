import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  FileSearch,
  GraduationCap,
  Headphones,
  KeyRound,
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
  lineQrImage: "/line-qr.png",
  title: "LINE101Chat｜企業 AI 知識助理與 LINE 文件問答",
  description:
    "LINE101Chat 協助台灣中小企業、學校與組織，把 FAQ、SOP、規章與內部文件轉換成可在 LINE 或網站查詢的 AI 知識助理，支援來源引用、文件整理、雲端與本地端部署評估。",
  keywords: [
    "AI 知識助理",
    "LINE AI 助理",
    "文件問答",
    "RAG",
    "企業知識庫",
    "SOP 問答",
    "招生 FAQ",
    "台灣中小企業 AI",
    "本地端 LLM",
    "LINE chatbot",
  ],
};

export const navItems = [
  { label: "首頁", href: "/" },
  { label: "服務說明", href: "/services" },
  { label: "AI 助理", href: "/rag-chatbot" },
  { label: "Demo", href: "/case-studies" },
  { label: "免費評估", href: "/free-assessment" },
  { label: "聯絡我們", href: "/contact" },
];

export const primaryCtas = {
  assessment: { label: "免費評估", href: "/free-assessment" },
  demo: { label: "預約 AI 助理 Demo", href: "/book-demo" },
  demoPage: { label: "看 Demo", href: "/case-studies" },
  poc: { label: "免費評估", href: "/free-assessment" },
  line: { label: "加入 LINE 詢問", href: site.linePageUrl },
  services: { label: "服務說明", href: "/services" },
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
    title: "文件問答助理",
    href: "/rag-chatbot",
    icon: FileSearch,
    description:
      "將 PDF、Word、網頁、FAQ、SOP 轉成可查詢知識庫。",
  },
  {
    title: "LINE AI 助理",
    href: "/line",
    icon: MessageCircle,
    description:
      "讓員工、學生或客戶直接在 LINE 裡查詢常見問題。",
  },
  {
    title: "來源引用與修正流程",
    href: "/rag-chatbot",
    icon: SearchCheck,
    description:
      "每次回答盡量附上來源，方便追查、修正與更新文件。",
  },
  {
    title: "雲端 / 本地端部署",
    href: "/rag-chatbot",
    icon: ServerCog,
    description:
      "依資料敏感度選擇快速雲端 PoC、本地端或私有雲部署。",
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
  { label: "中小企業", icon: Building2 },
  { label: "製造業", icon: Factory },
  { label: "電商與客服團隊", icon: Headphones },
  { label: "HR / 行政 / IT 內部支援", icon: Building2 },
];

export const processSteps = [
  "需求訪談",
  "文件盤點",
  "資料整理",
  "建立 AI 知識庫",
  "LINE / Web 入口串接",
  "測試與修正",
  "上線與維護",
];

export const benefits = [
  "減少重複問答與文件搜尋時間",
  "讓同仁在 LINE 裡快速查公司知識",
  "提升回覆速度",
  "降低新人查制度與問流程的負擔",
  "保留組織知識",
  "讓行政、客服與窗口少做重複查找",
  "讓常見問題有一致的文件依據",
  "讓使用者在非上班時間也能先查詢公開或授權資訊",
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
    price: "NT$50,000-100,000",
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
    price: "NT$50,000-100,000",
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
    name: "PoC 後正式導入",
    price: "需求評估後報價",
    summary: "依文件量、LINE / Web 串接、權限、部署方式與維護需求規劃。",
    timeline: "約 4-10 週",
    bestFor: "PoC 已確認適合擴大的組織",
    includes: [
      "多分類知識庫",
      "LINE / Web 整合",
      "管理者更新流程",
      "使用紀錄與問題回顧",
      "雲端、本地端或私有雲部署評估",
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
    title: "正式導入與維護",
    duration: "依範圍評估",
    detail: "依資料敏感度規劃雲端、本地端或私有雲，並建立更新、修正、權限與維護流程。",
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
      "可以。LINE101Chat 可規劃 LINE AI 助理或網站聊天介面，PoC 階段通常會先選一個最常用的入口，避免一開始整合範圍過大。",
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
      "不建議用取代員工作為初期目標。比較務實的做法，是先減少重複問答、文件查找與新人訓練工作，讓同仁把時間用在需要判斷與服務品質的工作上。",
  },
  {
    question: "文件內容會不會外洩？",
    answer:
      "客戶文件只會用於約定的 AI 助理開發、測試與維護。敏感資料建議另外簽訂資料處理與保密約定，也可評估本地端或私有化部署。",
  },
  {
    question: "可以擴充其他模組嗎？",
    answer:
      "可以依使用場景評估，但 LINE101Chat 的主服務仍是 AI 知識助理與文件問答系統。如有跨語言現場溝通需求，可另行評估翻譯模組。",
  },
  {
    question: "價格怎麼計算？",
    answer:
      "主要依文件量、使用場景數、LINE 或 Web 整合、部署位置、使用量紀錄、權限控管與維護頻率計算。台灣中小企業建議先從免費評估或 NT$50,000-100,000 的 Starter PoC 開始。",
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
    title: "北科大創新前瞻科技學院 iFIRST AI 文件問答 Demo",
    description:
      "使用公開文件建立的 AI 知識助理 Demo，可查詢人工智慧、資訊安全與半導體學程的部分規章、表單與修業資訊，並附上資料來源。",
    features: [
      "Official document retrieval",
      "Three knowledge collections",
      "Source citations",
      "Traditional Chinese answers",
      "LINE / Web demo ready",
      "Local Ollama backend option",
    ],
    icon: SearchCheck,
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
      privacyPolicy: "隱私政策",
      contactPlan: "AI 助理 PoC / 雲端或本地端部署：",
      addLine: "加入 LINE 詢問",
      directContact: "直接聯絡",
      pros: "優點",
      cons: "限制",
    },
    hero: {
      features: ["企業 AI 助理", "LINE 快速查詢", "來源引用", "資料保密邊界"],
      eyebrow: "台灣中小企業 AI 助理 / 北科大工程團隊",
      title: "企業 AI 知識助理，真人回答水準，公司機密資料不外流",
      description:
        "把 SOP、FAQ、規章、產品手冊與內部制度整理成可透過 LINE 或網站查詢的 AI 助理。回答時附上文件來源，並可依資料敏感度規劃雲端、本地端或私有雲部署。",
      speech:
        "我是 LINE101Chat 的 AI 解決方案顧問，會先協助你盤點文件、常見問題與查詢場景，再評估是否適合做 AI 知識助理 PoC。",
      stats: [
        ["20-30 頁", "先用正式文件評估"],
        ["2-3 週", "小範圍 Starter PoC"],
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
            title: "我們專注做一件事：讓公司文件變成可靠的 AI 知識助理",
            description:
              "不是做一個會聊天的玩具，而是把正式文件、FAQ、SOP 與內部規章整理成可查詢、可追溯、可維護的 AI 問答系統。",
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
              "企業 AI 知識助理的價值不只在會回答，而是在能否回答得準、能否追溯來源、能否保護資料邊界，並被團隊長期維護。",
          },
        },
        cta: {
          title: "想知道你的文件適不適合做 AI 知識助理？",
          body: "先用 20-30 頁正式文件做免費評估，我們會協助判斷文件品質、使用場景、LINE 或網站入口，以及是否值得做 PoC。",
          buttonLabel: "免費評估",
        },
      },
      services: {
        metadata: {
          title: "服務說明｜企業 AI 知識助理與 LINE 文件問答",
          description:
            "了解 LINE101Chat 如何協助台灣中小企業、學校與組織，把 FAQ、SOP、規章、產品手冊與內部文件導入成可引用來源的 AI 知識助理。",
          canonical: "/services",
        },
        hero: {
          eyebrow: "服務說明",
          title: "服務說明",
          description:
            "LINE101Chat 專注於 AI 知識助理與文件問答系統。AI 會先從你的文件中找資料，再根據文件內容回答，適合用在 SOP、FAQ、規章、產品手冊、表單與內部支援。",
        },
        bullets: [
          "把正式文件整理成可查詢、可追溯來源的 AI 問答系統。",
          "先用 20-30 頁文件評估，再決定是否做 2-3 週 PoC。",
          "讓員工、學生或客戶可在 LINE 或網站查詢常見問題。",
          "依資料敏感度評估雲端、本地端或私有雲部署。",
        ],
        presenterQuote:
          "不確定該做雲端還是本地端？可以先從 AI 助理需求評估開始，我們會協助你用文件敏感度、預算與維運能力判斷導入路徑。",
        sections: [
          {
            title: "服務核心",
            items: [
              "盤點文件、FAQ、SOP、規章與產品手冊。",
              "建立可查詢的知識庫與問答流程。",
              "回答時盡量附上來源，方便追查與修正。",
            ],
          },
          {
            title: "適合場景",
            items: [
              "招生 FAQ、系所規章與表單查詢。",
              "客服常見問題與產品手冊查詢。",
              "HR、行政、IT 內部支援與新人查詢。",
            ],
          },
          {
            title: "文件準備",
            items: [
              "先準備 20-30 頁正式、最新、可選取文字的文件。",
              "整理 30-50 個真實常見問題。",
              "指定文件負責人確認答案與後續修正。",
            ],
          },
          {
            title: "LINE / Web 入口",
            items: [
              "台灣使用者熟悉 LINE，適合員工、學生與客戶快速提問。",
              "也可提供網站聊天入口，方便放在官網或內部入口。",
              "PoC 階段通常先選一個主要入口，避免範圍過大。",
            ],
          },
          {
            title: "部署方式",
            items: [
              "一般資料可先用雲端快速驗證。",
              "敏感資料可評估本地端或私有雲部署。",
              "依需求規劃權限、紀錄與資料處理邊界。",
            ],
          },
          {
            title: "PoC 導入流程",
            items: [
              "免費評估文件與使用場景。",
              "用 2-3 週建立小範圍 PoC。",
              "以真實問題測試回答品質、來源引用與使用體驗。",
            ],
          },
          {
            title: "後續維護",
            items: [
              "建立文件更新與答案修正流程。",
              "定期回顧常見問題與未命中問題。",
              "依使用量與資料敏感度調整部署與維護方式。",
            ],
          },
        ],
        optionalModule: {
          title: "可客製擴充模組",
          body: "如有跨語言現場溝通需求，可另行評估翻譯模組。但 LINE101Chat 的主服務仍是 AI 知識助理與文件問答系統。",
        },
      },
      rag: {
        metadata: {
          title: "AI 知識助理｜LINE 文件問答、來源引用與部署評估",
          description:
            "LINE101Chat 企業 AI 知識助理可將 FAQ、SOP、規章、產品手冊與內部文件轉為 LINE 或網站 AI 問答助理，支援來源引用、資料保密邊界、雲端代管與本地端部署。",
          canonical: "/rag-chatbot",
        },
        hero: {
          eyebrow: "Core Service / Enterprise AI Knowledge Assistant",
          title: "AI 知識助理",
          description:
            "AI 會先從你的文件中找資料，再根據文件內容回答。這種做法適合把 SOP、FAQ、規章、產品手冊與內部知識做成可在 LINE 或網站查詢、能附來源的 AI 知識助理。",
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
      caseStudies: {
        metadata: {
          title: "成功案例 / Demo｜LINE101Chat",
          description:
            "查看 LINE101Chat 的北科大 iFIRST AI 文件問答 Demo，了解如何用公開文件建立可查詢、可引用來源的 AI 知識助理。",
          canonical: "/case-studies",
        },
        heading: {
          eyebrow: "成功案例 / Demo",
          title: "成功案例 / Demo",
          description:
            "目前主展示為北科大創新前瞻科技學院 iFIRST AI 文件問答 Demo，可查詢部分公開規章、表單與修業資訊，並附上資料來源。",
        },
        cards: [
          ["PoC 重點", "先選一個可衡量的場景，例如招生 FAQ、SOP 查詢或客服知識庫。"],
          ["驗證方式", "使用真實問題測試回答準確度、來源引用、LINE 使用體驗、資料邊界與維護流程。"],
          ["下一步", "若 AI 助理 PoC 成效明確，再擴充文件、使用者、權限、雲端或本地端部署。"],
        ],
        secondaryNote: "其他技術展示：LINE 翻譯模組可依需求客製。",
        cta: {
          title: "想用你的文件做第一個 Demo？",
          body: "準備一份乾淨文件與真實問題，我們可以協助判斷是否適合做企業 AI 助理 Starter PoC。",
          label: "免費評估",
        },
      },
      pricing: {
        metadata: {
          title: "免費 AI 知識助理導入評估｜LINE101Chat",
          description:
            "先用 20-30 頁正式文件，讓 LINE101Chat 協助判斷是否適合做 AI 知識助理 PoC，並取得文件整理、導入範圍、時程與費用區間建議。",
          canonical: "/free-assessment",
        },
        heading: {
          eyebrow: "免費評估",
          title: "免費 AI 知識助理導入評估",
          description:
            "先不用急著做大型系統。你可以先用 20-30 頁正式文件，讓我們協助判斷是否適合做 AI 知識助理 PoC。",
        },
        sections: [
          {
            title: "適合誰申請免費評估？",
            items: [
              "學校 / 系所 / 研究所",
              "補習班與教育機構",
              "中小企業",
              "製造業",
              "電商與客服團隊",
              "HR / 行政 / IT 內部支援",
            ],
          },
          {
            title: "免費評估會看什麼？",
            items: [
              "文件是否清楚、最新",
              "是否有重複問題",
              "是否適合用 LINE 或網站查詢",
              "是否需要資料保密或本地端部署",
              "是否適合先做 2-3 週 PoC",
            ],
          },
          {
            title: "你需要準備什麼？",
            items: [
              "20-30 頁正式文件",
              "30-50 個常見問題",
              "一個明確使用場景",
              "文件負責人或可確認答案的人",
            ],
          },
          {
            title: "評估後你會得到什麼？",
            items: [
              "適不適合做 AI 知識助理",
              "建議的 PoC 範圍",
              "文件整理建議",
              "大約導入時間",
              "大約費用區間",
            ],
          },
        ],
        pricingNote: {
          title: "如果評估後適合，再進入 PoC",
          body: "Starter PoC 通常從 NT$50,000-100,000 起，依文件數量、是否需要 LINE 串接、是否需要本地端部署而調整。正式導入與維護費用會在需求評估後再報價。",
        },
      },
      contact: {
        metadata: {
          title: "聯絡我們｜免費 AI 知識助理文件評估",
          description:
            "聯絡 LINE101Chat，免費評估 FAQ、SOP、規章與內部文件是否適合做 AI 知識助理、LINE 文件問答、雲端或本地端部署。",
          canonical: "/contact",
        },
        heading: {
          eyebrow: "聯絡我們",
          title: "聯絡我們",
          description:
            "如果你正在評估 AI 知識助理、LINE 文件問答、雲端代管或本地端部署，歡迎先描述目前的文件、重複問題與資料敏感度。",
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
          ["可維護", "AI 助理必須能隨文件更新與組織流程長期調整。"],
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
        intro: "本政策說明 LINE101Chat 在網站聯絡、需求評估、PoC 與 AI 助理服務過程中，如何處理客戶提供的資料與文件。",
        sections: [
          {
            title: "1. 我們收集的資料",
            body: "我們只收集客戶透過聯絡表單、Email、LINE 或諮詢過程主動提供的資訊，例如姓名、公司或組織、Email、電話 / LINE ID、服務需求與訊息內容。",
          },
          {
            title: "2. 客戶文件使用方式",
            body: "客戶提供的文件只會用於約定的 AI 助理開發、測試、調整與維護。文件可能包含 FAQ、SOP、規章、產品手冊、招生資訊或內部知識資料。",
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
            body: "當客戶啟用 AI 助理服務時，LINE 訊息可能會在客戶同意的範圍內被記錄，用於除錯、使用量分析、服務改善或客戶支援。",
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
      emailHeader: "LINE101Chat 免費 AI 知識助理導入評估",
      fallbackSubjectName: "網站詢問",
      subjectPrefix: "LINE101Chat 免費評估",
      labels: {
        name: "姓名",
        organization: "公司 / 單位",
        email: "Email",
        phone: "LINE ID / 電話",
        problem: "想解決的問題",
        documentPages: "文件大約幾頁？",
        hasFaq: "是否已經有 FAQ / SOP / 規章？",
        needsLine: "是否需要 LINE 串接？",
        confidentiality: "是否有資料保密需求？",
        message: "留言",
      },
      placeholders: {
        name: "王小明",
        organization: "公司、學校或單位名稱",
        email: "name@example.com",
        phone: "手機或 LINE ID",
        problem: "例如：客服重複問答、SOP 難找、新人訓練、招生 FAQ、內部制度查詢...",
        documentPages: "例如：20-30 頁、50 頁以上、還不確定",
        hasFaq: "請選擇",
        needsLine: "請選擇",
        confidentiality: "請選擇",
        message: "可補充文件類型、使用對象、目前流程、希望接 LINE 或網站，以及預計導入時程。",
      },
      yesNoOptions: ["是", "否", "不確定，需要先評估"],
      confidentialityOptions: ["有，需評估本地端或私有雲", "有，但可先討論資料範圍", "沒有明顯保密需求", "不確定，需要先評估"],
      recipientLabel: "收件信箱：",
      submitLabel: "免費評估我的文件是否適合做 AI 知識助理",
    },
  },
  en: {
    site: {
      ...site,
      title: "LINE101Chat | Enterprise AI Knowledge Assistant and LINE Document Search",
      description:
        "LINE101Chat helps Taiwan SMEs, schools, and organizations turn FAQs, SOPs, policies, and internal documents into a LINE or web AI knowledge assistant with source citations and cloud or local deployment assessment.",
      keywords: [
        "AI knowledge assistant",
        "LINE AI assistant",
        "document Q&A",
        "RAG",
        "enterprise knowledge base",
        "SOP Q&A",
        "admissions FAQ",
        "Taiwan SME AI",
        "local LLM",
        "LINE chatbot",
      ],
    },
    navItems: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "AI Assistant", href: "/rag-chatbot" },
      { label: "Demo", href: "/case-studies" },
      { label: "Free Assessment", href: "/free-assessment" },
      { label: "Contact", href: "/contact" },
    ],
    primaryCtas: {
      assessment: { label: "Free Assessment", href: "/free-assessment" },
      demo: { label: "Book an AI Assistant Demo", href: "/book-demo" },
      demoPage: { label: "View Demo", href: "/case-studies" },
      poc: { label: "Free Assessment", href: "/free-assessment" },
      line: { label: "Ask on LINE", href: site.linePageUrl },
      services: { label: "Services", href: "/services" },
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
        title: "Document Q&A Assistant",
        href: "/rag-chatbot",
        icon: FileSearch,
        description:
          "Turn PDFs, Word files, web pages, FAQs, and SOPs into a searchable knowledge base.",
      },
      {
        title: "LINE AI Assistant",
        href: "/line",
        icon: MessageCircle,
        description:
          "Let employees, students, or customers ask common questions directly inside LINE.",
      },
      {
        title: "Source Citations and Correction Flow",
        href: "/rag-chatbot",
        icon: SearchCheck,
        description:
          "Attach sources where possible so teams can trace, correct, and update documents.",
      },
      {
        title: "Cloud / Local Deployment",
        href: "/rag-chatbot",
        icon: ServerCog,
        description:
          "Choose a fast cloud PoC, local deployment, or private cloud based on data sensitivity.",
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
      { label: "SMEs", icon: Building2 },
      { label: "Manufacturing", icon: Factory },
      { label: "E-commerce and support teams", icon: Headphones },
      { label: "HR / admin / IT support", icon: Building2 },
    ],
    processSteps: [
      "Discovery interview",
      "Document inventory",
      "Data cleanup",
      "Build AI knowledge base",
      "Connect LINE / web entry",
      "Test and refine",
      "Launch and maintain",
    ],
    benefits: [
      "Reduce repeated Q&A and document search time",
      "Let teammates search company knowledge inside LINE",
      "Improve response speed",
      "Reduce onboarding questions about rules and workflows",
      "Preserve organizational knowledge",
      "Help admin and support teams spend less time searching",
      "Ground common answers in the same document source",
      "Let users first check authorized information outside office hours",
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
        price: "NT$50,000-100,000",
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
        price: "NT$50,000-100,000",
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
        name: "Production Rollout After PoC",
        price: "Quoted after assessment",
        summary: "Planned by document volume, LINE / web integration, permissions, deployment model, and maintenance needs.",
        timeline: "About 4-10 weeks",
        bestFor: "Organizations whose PoC is ready to expand",
        includes: [
          "Multi-category knowledge base",
          "LINE / web integration",
          "Admin update workflow",
          "Usage records and question review",
          "Cloud, local, or private-cloud deployment assessment",
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
        title: "Production rollout and maintenance",
        duration: "Scope-based",
        detail: "Plan cloud, local, or private-cloud deployment by data sensitivity, then establish update, correction, permission, and maintenance workflows.",
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
          "Yes. LINE101Chat can plan a LINE AI assistant or website chat interface. In the PoC stage, we usually choose one primary entry point to keep the first scope focused.",
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
          "Replacement is not the right first goal. A practical rollout reduces repeated Q&A, document lookup, and onboarding work so staff can spend more time on judgment and service quality.",
      },
      {
        question: "Will document content leak?",
        answer:
          "Customer documents are used only for the agreed AI assistant development, testing, and maintenance. Sensitive data should be covered by separate data-processing and confidentiality agreements, and local or private deployment can be assessed.",
      },
      {
        question: "Can other modules be added later?",
        answer:
          "Yes, depending on the use case, but LINE101Chat's main service remains the AI knowledge assistant and document Q&A system. If cross-language field communication is needed, a translation module can be assessed separately.",
      },
      {
        question: "How is pricing calculated?",
        answer:
          "Pricing depends on document volume, number of use cases, LINE or web integration, deployment location, usage records, permission controls, and maintenance frequency. Taiwan SMEs are encouraged to start with the free assessment or the NT$50,000-100,000 Starter PoC.",
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
        title: "NTUT iFIRST AI Document Q&A Demo",
        description:
          "An AI knowledge assistant demo built from public documents. It can answer selected questions about Artificial Intelligence, Information Security, and Semiconductor program rules, forms, and study information with source citations.",
        features: [
          "Official document retrieval",
          "Three knowledge collections",
          "Source citations",
          "Traditional Chinese answers",
          "LINE / Web demo ready",
          "Local Ollama backend option",
        ],
        icon: SearchCheck,
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
      title: "LINE101Chat turns company documents into a source-grounded AI knowledge assistant",
      description:
        "Turn SOPs, FAQs, policies, product manuals, and internal rules into an AI assistant searchable through LINE or a website. Answers can include document sources, with cloud, local, or private-cloud deployment assessed by data sensitivity.",
      speech:
        "I am LINE101Chat's AI solution consultant. I help assess documents, repeated questions, and search scenarios before recommending whether an AI knowledge assistant PoC makes sense.",
      stats: [
        ["20-30 pages", "Start with official documents"],
        ["2-3 weeks", "Focused Starter PoC"],
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
            title: "We focus on one thing: turning company documents into a reliable AI knowledge assistant",
            description:
              "This is not a toy chatbot. It organizes official documents, FAQs, SOPs, and internal rules into a searchable, traceable, maintainable AI Q&A system.",
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
          title: "Want to know whether your documents are suitable for an AI knowledge assistant?",
          body: "Start with 20-30 pages of official documents. We will assess document quality, use cases, LINE or web entry points, and whether a PoC is worthwhile.",
          buttonLabel: "Free Assessment",
        },
      },
      services: {
        metadata: {
          title: "Services | Enterprise AI Knowledge Assistant and LINE Document Search",
          description:
            "Learn how LINE101Chat helps Taiwan SMEs, schools, and organizations turn FAQs, SOPs, policies, product manuals, and internal documents into source-grounded AI knowledge assistants.",
          canonical: "/en/services",
        },
        hero: {
          eyebrow: "Services",
          title: "Services",
          description:
            "LINE101Chat focuses on AI knowledge assistants and document Q&A systems. The AI first searches your documents, then answers based on that content.",
        },
        bullets: [
          "Turn official documents into searchable, source-grounded AI Q&A.",
          "Start with 20-30 pages before deciding on a 2-3 week PoC.",
          "Let employees, students, or customers ask questions in LINE or on the web.",
          "Assess cloud, local, or private-cloud deployment based on data sensitivity.",
        ],
        presenterQuote:
          "Not sure whether to choose cloud or local deployment? Start with an AI assistant needs assessment; we will use document sensitivity, budget, and operations capacity to recommend a rollout path.",
        sections: [
          {
            title: "Service Core",
            items: [
              "Inventory documents, FAQs, SOPs, policies, and product manuals.",
              "Build a searchable knowledge base and Q&A flow.",
              "Attach sources where possible so answers can be traced and corrected.",
            ],
          },
          {
            title: "Suitable Scenarios",
            items: [
              "Admissions FAQs, department rules, and form lookup.",
              "Support FAQs and product manual lookup.",
              "HR, admin, IT support, and onboarding questions.",
            ],
          },
          {
            title: "Document Preparation",
            items: [
              "Start with 20-30 pages of official, current, selectable-text documents.",
              "Prepare 30-50 real common questions.",
              "Assign a document owner to confirm answers and corrections.",
            ],
          },
          {
            title: "LINE / Web Entry",
            items: [
              "LINE fits Taiwan employees, students, and customers who need quick answers.",
              "A web chat entry can also sit on a website or internal portal.",
              "The PoC usually starts with one main entry point to keep scope focused.",
            ],
          },
          {
            title: "Deployment Model",
            items: [
              "Use cloud deployment for a fast first validation.",
              "Assess local or private-cloud deployment for sensitive documents.",
              "Plan permissions, records, and data-processing boundaries as needed.",
            ],
          },
          {
            title: "PoC Rollout",
            items: [
              "Assess documents and use case fit first.",
              "Build a focused 2-3 week PoC.",
              "Test answer quality, source citations, and user experience with real questions.",
            ],
          },
          {
            title: "Maintenance",
            items: [
              "Set up document updates and answer correction workflows.",
              "Review common questions and missed questions regularly.",
              "Adjust deployment and maintenance based on usage and data sensitivity.",
            ],
          },
        ],
        optionalModule: {
          title: "Custom Add-on Modules",
          body: "If cross-language field communication is needed, a translation module can be assessed separately. LINE101Chat's main service remains the AI knowledge assistant and document Q&A system.",
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
      caseStudies: {
        metadata: {
          title: "Case Studies / Demo | LINE101Chat",
          description:
            "See LINE101Chat's NTUT iFIRST AI document Q&A demo and how public documents can become a source-grounded AI knowledge assistant.",
          canonical: "/en/case-studies",
        },
        heading: {
          eyebrow: "Case Studies / Demo",
          title: "Case Studies / Demo",
          description:
            "The main demo is the NTUT iFIRST AI document Q&A assistant, built from selected public rules, forms, and study information with source citations.",
        },
        cards: [
          ["PoC focus", "Choose one measurable scenario first, such as admissions FAQs, SOP lookup, or support knowledge base."],
          ["Validation method", "Test with real questions to check answer accuracy, source citations, LINE experience, data boundaries, and maintenance workflow."],
          ["Next step", "If the AI assistant PoC shows clear value, expand documents, users, permissions, cloud hosting, or local deployment."],
        ],
        secondaryNote: "Other technical demo: a LINE translation module can be customized when needed.",
        cta: {
          title: "Want to build the first demo with your own documents?",
          body: "Prepare one clean document and real questions. We can help judge whether it is a good fit for an enterprise AI Assistant Starter PoC.",
          label: "Free Assessment",
        },
      },
      pricing: {
        metadata: {
          title: "Free AI Knowledge Assistant Assessment | LINE101Chat",
          description:
            "Use 20-30 pages of official documents so LINE101Chat can assess whether your organization is a good fit for an AI knowledge assistant PoC.",
          canonical: "/en/free-assessment",
        },
        heading: {
          eyebrow: "Free Assessment",
          title: "Free AI Knowledge Assistant Implementation Assessment",
          description:
            "You do not need to start with a large system. Start with 20-30 pages of official documents and let us assess whether an AI knowledge assistant PoC makes sense.",
        },
        sections: [
          {
            title: "Who should apply?",
            items: [
              "Schools / departments / graduate programs",
              "Cram schools and education providers",
              "SMEs",
              "Manufacturing",
              "E-commerce and support teams",
              "HR / admin / IT support",
            ],
          },
          {
            title: "What will we assess?",
            items: [
              "Whether documents are clear and current",
              "Whether repeated questions exist",
              "Whether LINE or web search fits the workflow",
              "Whether confidentiality or local deployment matters",
              "Whether a 2-3 week PoC is a good next step",
            ],
          },
          {
            title: "What should you prepare?",
            items: [
              "20-30 pages of official documents",
              "30-50 common questions",
              "One clear use case",
              "A document owner who can confirm answers",
            ],
          },
          {
            title: "What will you get?",
            items: [
              "Whether an AI knowledge assistant is a good fit",
              "Recommended PoC scope",
              "Document cleanup suggestions",
              "Rough implementation timeline",
              "Rough cost range",
            ],
          },
        ],
        pricingNote: {
          title: "If the assessment fits, move into a PoC",
          body: "Starter PoCs usually begin from NT$50,000-100,000, adjusted by document volume, LINE integration, and whether local deployment is needed. Production rollout and maintenance fees are quoted after the needs assessment.",
        },
      },
      contact: {
        metadata: {
          title: "Contact | Free AI Knowledge Assistant Document Assessment",
          description:
            "Contact LINE101Chat for a free assessment of whether your FAQs, SOPs, policies, and internal documents fit an AI knowledge assistant, LINE document Q&A, cloud, or local deployment.",
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
          ["Maintainable", "An AI assistant must evolve with document updates and organizational workflows."],
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
        intro: "This policy explains how LINE101Chat handles information and documents provided during website contact, needs assessment, PoC, and AI assistant service work.",
        sections: [
          {
            title: "1. Information We Collect",
            body: "We collect only information that customers voluntarily provide through the contact form, email, LINE, or consultations, such as name, company or organization, email, phone / LINE ID, service needs, and message content.",
          },
          {
            title: "2. How Customer Documents Are Used",
            body: "Customer documents are used only for the agreed AI assistant development, testing, adjustment, and maintenance. Documents may include FAQs, SOPs, policies, product manuals, admissions information, or internal knowledge materials.",
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
            body: "When customers enable AI assistant services, LINE messages may be recorded within the customer's agreed scope for debugging, usage analysis, service improvement, or customer support.",
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
        problem: "Problem to solve",
        documentPages: "Approximate document pages",
        hasFaq: "Do you already have FAQs / SOPs / policies?",
        needsLine: "Need LINE integration?",
        confidentiality: "Any data confidentiality needs?",
        message: "Message",
      },
      placeholders: {
        name: "Your name",
        organization: "Company, school, or organization",
        email: "name@example.com",
        phone: "Phone or LINE ID",
        problem: "Repeated support questions, hard-to-find SOPs, onboarding, admissions FAQs, internal policy lookup...",
        documentPages: "Example: 20-30 pages, 50+ pages, not sure yet",
        hasFaq: "Choose one",
        needsLine: "Choose one",
        confidentiality: "Choose one",
        message: "Add document types, target users, current workflow, LINE or web needs, and expected timeline.",
      },
      yesNoOptions: ["Yes", "No", "Not sure; need assessment"],
      confidentialityOptions: ["Yes, local or private cloud may be needed", "Yes, but the scope can be discussed first", "No obvious confidentiality needs", "Not sure; need assessment"],
      recipientLabel: "Recipient: ",
      submitLabel: "Assess whether my documents fit an AI knowledge assistant",
    },
  },
};

export function getSiteContent(locale: Locale = "zh") {
  return siteContent[locale];
}
