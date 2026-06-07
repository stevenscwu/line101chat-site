export type LegalDocument = {
  title: string;
  shortTitle: string;
  purpose: string;
  href: string;
  mustUseBefore: string;
};

export const legalDocuments: LegalDocument[] = [
  {
    title: "LINE101Chat 客戶法律文件索引",
    shortTitle: "文件索引",
    purpose: "說明文件包使用順序、文件狀態、簽約主體提醒與主要法規參考。",
    href: "/legal/line101chat-legal-documents-index-zh-tw.md",
    mustUseBefore: "開始使用整包文件前",
  },
  {
    title: "Mutual NDA 雙向保密協議",
    shortTitle: "NDA",
    purpose: "客戶提供非公開 FAQ、SOP、截圖、文件、營運資料或技術資訊前使用。",
    href: "/legal/line101chat-mutual-nda-zh-tw.md",
    mustUseBefore: "接收 confidential files 前",
  },
  {
    title: "Master Service Agreement 主服務契約",
    shortTitle: "MSA",
    purpose: "作為付費 Pilot、PoC、正式導入與維護服務的主約，搭配 SOW 使用。",
    href: "/legal/line101chat-master-service-agreement-zh-tw.md",
    mustUseBefore: "簽署付費專案前",
  },
  {
    title: "Pilot Statement of Work 範本",
    shortTitle: "Pilot SOW",
    purpose: "定義 LINE Enrollment FAQ Pilot 的範圍、交付項目、時程、費用、驗收與排除項目。",
    href: "/legal/line101chat-pilot-sow-template-zh-tw.md",
    mustUseBefore: "啟動 Pilot 前",
  },
  {
    title: "Data Processing Addendum 資料處理附約",
    shortTitle: "DPA",
    purpose: "規範個資、LINE 訊息、lead 資料、客戶文件、子處理者與跨境處理。",
    href: "/legal/line101chat-data-processing-addendum-zh-tw.md",
    mustUseBefore: "處理個資或 LINE 訊息前",
  },
  {
    title: "AI Output and Acceptable Use Policy",
    shortTitle: "AI 使用政策",
    purpose: "定義 AI 回答限制、高風險問題、禁止用途、真人覆核與驗收邊界。",
    href: "/legal/line101chat-ai-output-acceptable-use-policy-zh-tw.md",
    mustUseBefore: "公開 Demo 或 Pilot 前",
  },
  {
    title: "Support and SLA Terms 支援與 SLA 條款",
    shortTitle: "支援 SLA",
    purpose: "定義 Pilot 與維護支援時段、事件等級、回應目標與排除項目。",
    href: "/legal/line101chat-support-sla-zh-tw.md",
    mustUseBefore: "承諾支援或維護前",
  },
  {
    title: "Data Retention and Deletion Policy",
    shortTitle: "保存刪除",
    purpose: "規範免費評估、Pilot、維護與終止後的資料保存、刪除、返還與備份限制。",
    href: "/legal/line101chat-data-retention-deletion-policy-zh-tw.md",
    mustUseBefore: "接收測試文件或聊天紀錄前",
  },
  {
    title: "End-User Privacy Notice Template",
    shortTitle: "使用者告知",
    purpose: "提供客戶放在 LINE、網站或表單的使用者個資告知範本。",
    href: "/legal/line101chat-end-user-privacy-notice-template-zh-tw.md",
    mustUseBefore: "客戶開放使用者互動前",
  },
  {
    title: "Incident Response Policy 事件應變政策",
    shortTitle: "事件應變",
    purpose: "定義服務異常、資安、個資、金鑰外洩與錯誤回答事件處理流程。",
    href: "/legal/line101chat-incident-response-policy-zh-tw.md",
    mustUseBefore: "正式上線或維護前",
  },
  {
    title: "Proposal and Quotation Terms 報價與提案條款",
    shortTitle: "報價條款",
    purpose: "規範報價有效期、付款、稅務、變更需求、取消與不保證事項。",
    href: "/legal/line101chat-proposal-quotation-terms-zh-tw.md",
    mustUseBefore: "送出報價或收款前",
  },
];

export const legalReferenceLinks = [
  {
    label: "個人資料保護法 / Personal Data Protection Act",
    href: "https://mojlaw.moj.gov.tw/EngLawContent.aspx?id=29",
  },
  {
    label: "電子簽章法",
    href: "https://law.moda.gov.tw/LawContent.aspx?id=FL011349&media=print",
  },
  {
    label: "Civil Code",
    href: "https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351&media=print",
  },
  {
    label: "Consumer Protection Act",
    href: "https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0170001",
  },
];
