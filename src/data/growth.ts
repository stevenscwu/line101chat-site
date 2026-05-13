import { site } from "@/data/site";
import type { Locale } from "@/data/site";

export const growthContent = {
  zh: {
    bookDemo: {
      metadata: {
        title: "預約 Demo｜LINE101Chat",
        description:
          "用 7 個問題預約 LINE101Chat 企業 AI 知識助理 Demo，協助確認文件量、使用場景、LINE 入口與本地端部署需求。",
      },
      eyebrow: "Book Demo",
      title: "預約 30 分鐘 AI 助理 Demo",
      description:
        "先用 7 個問題把場景說清楚，我們會依文件狀況、LINE 使用流程與資料敏感度，建議適合的 PoC 路徑。",
      sideTitle: "Demo 前建議先準備",
      sideItems: [
        "20-30 頁最常被問的正式文件",
        "5-10 個真實使用者問題",
        "目前客服、行政或 LINE 回覆流程",
        "是否有本地端或私有雲需求",
      ],
      flow: [
        "填寫 7 個問題",
        "用 Email 或 LINE 送出",
        "安排 30 分鐘需求評估",
        "確認是否適合 1-2 週 PoC",
      ],
      form: {
        copyIdle: "複製預約內容",
        copySuccess: "已複製",
        copyError: "複製失敗",
        emailHeader: "LINE101Chat Demo 預約",
        subject: "LINE101Chat Demo 預約",
        submitLabel: "開啟 Email 預約",
        lineLabel: "改用 LINE 詢問",
        recipientLabel: "收件信箱：",
        fields: [
          { key: "organization", label: "公司 / 單位名稱", placeholder: "例如：XX 製造、XX 系所、XX 補習班" },
          { key: "contact", label: "聯絡人", placeholder: "姓名 / 職稱" },
          { key: "email", label: "Email", placeholder: "name@example.com", type: "email" },
          { key: "problem", label: "想解決的問題", placeholder: "重複問答、文件難找、新人訓練、客服回覆慢..." },
          { key: "pages", label: "文件大約幾頁", placeholder: "例如：20-40 頁、100 頁以上、還不確定" },
          { key: "channel", label: "現在主要用什麼回覆？", placeholder: "LINE / 網站 / Email / 電話 / 內部群組" },
          { key: "localNeed", label: "是否需要本地端部署？", placeholder: "需要 / 不需要 / 不確定，想先評估" },
          { key: "time", label: "方便諮詢時間", placeholder: "例如：平日下午、週二上午、可先 Email 約時間" },
        ],
      },
    },
    checklist: {
      metadata: {
        title: "AI 知識助理文件準備檢查表｜LINE101Chat",
        description:
          "下載或列印 LINE101Chat AI 知識助理文件準備檢查表，確認 PoC 前需要整理的文件、問題與資料邊界。",
      },
      eyebrow: "Document Readiness Checklist",
      title: "AI 知識助理文件準備檢查表",
      description:
        "這份檢查表可以幫你判斷資料是否適合進入 LINE AI 知識助理 PoC。整理得越清楚，PoC 越容易在 2-3 週內看出成效。",
      printLabel: "列印 / 另存 PDF",
      bookLabel: "預約文件健檢",
      sections: [
        {
          title: "1. 文件品質",
          items: [
            "文件是最新版，沒有過期規章或舊表單。",
            "PDF / Word 文字可以選取，不只是掃描圖檔。",
            "標題、章節、表格與分類清楚。",
            "同一問題沒有多份互相矛盾的答案。",
          ],
        },
        {
          title: "2. PoC 範圍",
          items: [
            "先選一個明確場景，例如招生 FAQ、SOP 查詢或客服知識庫。",
            "第一版文件量控制在 20-40 頁乾淨資料。",
            "準備 30-50 個真實使用者問題。",
            "先定義誰會使用：客服、行政、HR、IT、學生或客戶。",
          ],
        },
        {
          title: "3. 資料邊界",
          items: [
            "標記哪些文件可以進 PoC。",
            "標記哪些內容含個資、合約、客戶資料或營業秘密。",
            "確認雲端即可，或需要本地端 / 私有雲評估。",
            "指定日後誰可以更新知識庫。",
          ],
        },
        {
          title: "4. 成效衡量",
          items: [
            "目前每週大約有多少重複問題。",
            "人工平均每次查資料或回覆需要幾分鐘。",
            "希望減少哪些工作：找文件、回覆 LINE、新人訓練或客服 FAQ。",
            "PoC 結束後用準確率、節省時間與使用者回饋判斷是否擴大。",
          ],
        },
      ],
      leadTitle: "需要我們協助判斷文件是否適合 PoC？",
      leadBody: "把文件類型與目前問題描述給我們，會先用 30 分鐘協助判斷導入路徑。",
    },
    ntutCaseStudy: {
      metadata: {
        title: "Case Study｜用北科大公開資料建立 RAG 問答助理",
        description:
          "LINE101Chat 案例研究：使用北科大 iFIRST 公開資料建立 LINE RAG 問答助理，說明問題、資料來源、系統設計、測試問題、成果與限制。",
      },
      eyebrow: "Case Study",
      title: "用北科大公開資料建立 RAG 問答助理",
      description:
        "這個 Demo 使用公開資料建立 LINE 文件問答助理，目標是驗證 RAG 是否能回答招生、學程與制度類問題，並附上來源供使用者追溯。",
      sections: [
        ["Problem", "學校與系所常有重複行政問題，例如學程差異、申請資格、表單與修業規定。人工回覆容易重複、耗時，也需要查找不同公告。"],
        ["Data source", "以北科大創新前瞻科技學院 iFIRST 相關公開文件與頁面作為資料來源，整理成人工智慧、資訊安全、半導體三個知識集合。"],
        ["System design", "使用文件切分、向量檢索、來源引用與 Local Ollama LLM backend，透過 LINE 入口讓使用者直接提問。"],
        ["Test questions", "測試問題包含學程分類、申請方式、課程資訊、FAQ 與文件來源追溯。測試重點不是回答漂亮，而是能否根據正式資料回答。"],
        ["Result", "Demo 可展示 LINE 問答、文件檢索、來源引用與多知識集合切換，適合作為教育單位或招生 FAQ PoC 的起點。"],
        ["Limitations", "公開資料不等於正式內部知識庫；若要正式上線，仍需由單位確認最新文件、權限、更新流程與錯誤修正機制。"],
        ["Next improvement", "加入管理者更新流程、使用紀錄、更多真實問題集與正式 demo 影片，讓單位更容易評估 ROI。"],
      ],
      ctaTitle: "想用你的公開文件或內部 FAQ 做類似 PoC？",
      ctaBody: "準備 20-40 頁文件與真實問題，我們可以先判斷是否適合做 1-2 週 AI 助理 PoC。",
    },
    blog: {
      metadata: {
        title: "LINE101Chat Blog｜AI 知識助理與 LINE 文件問答",
        description: "LINE101Chat 分享台灣中小企業導入 AI 知識助理、LINE 文件問答與文件準備的實務文章。",
      },
      eyebrow: "Blog",
      title: "AI 知識助理與 LINE 文件問答實務文章",
      description:
        "每篇文章聚焦一個導入問題，協助台灣 SME、學校與客服團隊用較低風險評估 AI 知識助理。",
      posts: [
        {
          title: "中小企業導入 AI 知識助理前，需要準備哪些文件？",
          href: "/blog/rag-chatbot-document-preparation",
          description:
            "第一篇 SEO 文章，說明 PoC 前要準備的文件、真實問題、資料邊界與成效衡量方式。",
          date: "2026-05-11",
        },
      ],
    },
    article: {
      metadata: {
        title: "中小企業導入 AI 知識助理前，需要準備哪些文件？",
        description:
          "台灣中小企業導入 AI 知識助理前，需要先準備哪些 FAQ、SOP、產品文件、真實問題與資料邊界。",
      },
      eyebrow: "RAG 文件準備",
      title: "中小企業導入 AI 知識助理前，需要準備哪些文件？",
      description:
        "不用一開始就做大型 AI 系統。先拿 20-30 頁最常被問的正式文件，用 1-2 週做 LINE AI 問答 PoC，通常就能判斷是否值得擴大。",
      sections: [
        {
          title: "先選一個高重複場景",
          body: "AI 知識助理最適合 FAQ、SOP、招生規章、產品手冊、客服知識庫與內部 HR / IT 問答。第一版不要放所有文件，先選一個最常被問、最容易衡量的場景。",
        },
        {
          title: "準備 20-40 頁乾淨文件",
          body: "PoC 不需要上百份資料。20-40 頁正式、最新、可選取文字的文件更容易做出穩定結果。掃描圖檔要先 OCR，過期或矛盾內容要先移除。",
        },
        {
          title: "準備 30-50 個真實問題",
          body: "用真實使用者問題測試，才能知道 AI 助理是否真的能節省客服、行政或新人訓練時間。不要只用理想化 demo 問題。",
        },
        {
          title: "先定義資料邊界",
          body: "標記哪些文件可以進 PoC、哪些內容含個資或營業秘密、是否需要本地端或私有雲。資料邊界越清楚，導入風險越低。",
        },
        {
          title: "用小 PoC 判斷 ROI",
          body: "PoC 成效可以用回答準確率、來源引用品質、每週減少多少重複問題、人工節省時間與使用者回饋來判斷。",
        },
      ],
    },
  },
  en: {
    bookDemo: {
      metadata: {
        title: "Book a Demo | LINE101Chat",
        description:
          "Book a LINE101Chat enterprise AI knowledge assistant demo with seven questions about documents, use cases, LINE workflow, and local deployment needs.",
      },
      eyebrow: "Book Demo",
      title: "Book a 30-minute AI Assistant Demo",
      description:
        "Answer seven questions first. We will use document status, LINE workflow, and data sensitivity to recommend a practical PoC path.",
      sideTitle: "Prepare before the demo",
      sideItems: [
        "20-30 pages of your most frequently asked official documents",
        "5-10 real user questions",
        "Current support, admin, or LINE reply workflow",
        "Whether local or private-cloud deployment may be needed",
      ],
      flow: [
        "Answer seven questions",
        "Send by email or LINE",
        "Schedule a 30-minute needs assessment",
        "Confirm whether a 1-2 week PoC makes sense",
      ],
      form: {
        copyIdle: "Copy booking content",
        copySuccess: "Copied",
        copyError: "Copy failed",
        emailHeader: "LINE101Chat Demo Booking",
        subject: "LINE101Chat Demo Booking",
        submitLabel: "Open email to book",
        lineLabel: "Ask on LINE instead",
        recipientLabel: "Recipient: ",
        fields: [
          { key: "organization", label: "Company / Organization", placeholder: "Example: manufacturing SME, department, school" },
          { key: "contact", label: "Contact person", placeholder: "Name / title" },
          { key: "email", label: "Email", placeholder: "name@example.com", type: "email" },
          { key: "problem", label: "Problem to solve", placeholder: "Repeated Q&A, hard-to-find documents, onboarding, slow support..." },
          { key: "pages", label: "Approximate document pages", placeholder: "Example: 20-40 pages, 100+ pages, not sure yet" },
          { key: "channel", label: "Current reply channel", placeholder: "LINE / website / email / phone / internal chat" },
          { key: "localNeed", label: "Need local deployment?", placeholder: "Yes / no / not sure, need assessment" },
          { key: "time", label: "Preferred consultation time", placeholder: "Example: weekday afternoons, Tuesday morning, coordinate by email" },
        ],
      },
    },
    checklist: {
      metadata: {
        title: "AI Knowledge Assistant Document Readiness Checklist | LINE101Chat",
        description:
          "Download or print LINE101Chat's AI Knowledge Assistant Document Readiness Checklist for PoC document, question, and data-boundary preparation.",
      },
      eyebrow: "Document Readiness Checklist",
      title: "AI Knowledge Assistant Document Readiness Checklist",
      description:
        "Use this checklist to judge whether your documents are ready for a RAG / LINE AI assistant PoC. Cleaner preparation makes it easier to see value within 1-2 weeks.",
      printLabel: "Print / Save as PDF",
      bookLabel: "Book a document readiness review",
      sections: [
        {
          title: "1. Document quality",
          items: [
            "Documents are current, with outdated rules and forms removed.",
            "PDF / Word text is selectable, not only scanned images.",
            "Headings, sections, tables, and categories are clear.",
            "The same question does not have conflicting answers across documents.",
          ],
        },
        {
          title: "2. PoC scope",
          items: [
            "Choose one clear scenario, such as admissions FAQ, SOP lookup, or support knowledge base.",
            "Keep the first document set to 20-40 clean pages.",
            "Prepare 30-50 real user questions.",
            "Define who will use it: support, admin, HR, IT, students, or customers.",
          ],
        },
        {
          title: "3. Data boundaries",
          items: [
            "Mark which documents can enter the PoC.",
            "Mark content containing personal data, contracts, customer data, or trade secrets.",
            "Decide whether cloud is acceptable or local / private-cloud deployment needs review.",
            "Name who will update the knowledge base later.",
          ],
        },
        {
          title: "4. Value measurement",
          items: [
            "Estimate how many repeated questions happen each week.",
            "Estimate the average minutes spent finding information or replying manually.",
            "Define what work should be reduced: document lookup, LINE replies, onboarding, or support FAQ.",
            "After the PoC, judge with accuracy, time saved, and user feedback.",
          ],
        },
      ],
      leadTitle: "Need help judging whether your documents are PoC-ready?",
      leadBody: "Send the document type and current pain points. We can use 30 minutes to recommend a rollout path.",
    },
    ntutCaseStudy: {
      metadata: {
        title: "Case Study | Building a RAG Q&A Assistant from NTUT Public Documents",
        description:
          "LINE101Chat case study: building a LINE RAG Q&A assistant from NTUT iFIRST public documents, including problem, data source, system design, test questions, results, and limitations.",
      },
      eyebrow: "Case Study",
      title: "Building a RAG Q&A Assistant from NTUT Public Documents",
      description:
        "This demo uses public documents to build a LINE document Q&A assistant, validating whether RAG can answer admissions, program, and policy questions with traceable sources.",
      sections: [
        ["Problem", "Schools and departments receive repeated administrative questions about program differences, application rules, forms, and graduation requirements. Manual replies are repetitive and require checking multiple announcements."],
        ["Data source", "The demo uses public documents and pages related to NTUT iFIRST, organized into Artificial Intelligence, Information Security, and Semiconductor knowledge collections."],
        ["System design", "The flow uses document chunking, vector retrieval, source citations, and a Local Ollama LLM backend, with LINE as the user entry point."],
        ["Test questions", "Questions cover program categories, application methods, course information, FAQ items, and source traceability. The test is not whether the answer sounds good, but whether it follows official materials."],
        ["Result", "The demo shows LINE Q&A, document retrieval, source citations, and multiple knowledge collections, making it a practical starting point for education or admissions FAQ PoCs."],
        ["Limitations", "Public data is not the same as a formal internal knowledge base. For production, the unit still needs to confirm current documents, permissions, update workflow, and error correction."],
        ["Next improvement", "Add admin update workflow, usage records, more real question sets, and formal demo videos so the organization can evaluate ROI more easily."],
      ],
      ctaTitle: "Want to build a similar PoC from your public documents or internal FAQs?",
      ctaBody: "Prepare 20-40 pages and real questions. We can first judge whether it fits a 1-2 week AI assistant PoC.",
    },
    blog: {
      metadata: {
        title: "LINE101Chat Blog | AI Knowledge Assistants and LINE Document Q&A",
        description: "Practical articles on AI knowledge assistants, LINE document Q&A, and document preparation for Taiwan SMEs.",
      },
      eyebrow: "Blog",
      title: "Practical Articles on AI Knowledge Assistants and LINE Document Q&A",
      description:
        "Each article focuses on one implementation question so Taiwan SMEs, schools, and support teams can evaluate AI knowledge assistants with lower risk.",
      posts: [
        {
          title: "What documents should SMEs prepare before adopting an AI knowledge assistant?",
          href: "/blog/rag-chatbot-document-preparation",
          description:
            "The first SEO article covering documents, real questions, data boundaries, and success measurement before a PoC.",
          date: "2026-05-11",
        },
      ],
    },
    article: {
      metadata: {
        title: "What documents should SMEs prepare before adopting an AI knowledge assistant?",
        description:
          "A practical guide for Taiwan SMEs preparing FAQs, SOPs, product documents, real questions, and data boundaries before an AI knowledge assistant PoC.",
      },
      eyebrow: "RAG Document Preparation",
      title: "What documents should SMEs prepare before adopting an AI knowledge assistant?",
      description:
        "You do not need a large AI system first. Start with 20-30 pages of frequently asked official documents and use a 1-2 week LINE AI Q&A PoC to judge whether expansion is worthwhile.",
      sections: [
        {
          title: "Choose one high-repetition scenario first",
          body: "AI knowledge assistants work best for FAQs, SOPs, admissions rules, product manuals, support knowledge bases, and internal HR / IT Q&A. Do not put every document into version one; start with one measurable scenario.",
        },
        {
          title: "Prepare 20-40 clean pages",
          body: "A PoC does not need hundreds of files. It needs 20-40 pages of current, official, selectable-text documents. Scanned images need OCR, and outdated or conflicting content should be removed first.",
        },
        {
          title: "Prepare 30-50 real questions",
          body: "Testing with real user questions shows whether the AI assistant can actually save support, admin, or onboarding time. Do not rely only on ideal demo questions.",
        },
        {
          title: "Define data boundaries first",
          body: "Mark which documents can enter the PoC, which contain personal data or trade secrets, and whether local or private-cloud deployment needs assessment. Clear boundaries reduce rollout risk.",
        },
        {
          title: "Use a small PoC to judge ROI",
          body: "Measure PoC value through answer accuracy, source citation quality, repeated questions reduced per week, manual time saved, and user feedback.",
        },
      ],
    },
  },
};

export function getGrowthContent(locale: Locale = "zh") {
  return growthContent[locale];
}

export function bookingMailto(locale: Locale, body: string) {
  const form = getGrowthContent(locale).bookDemo.form;
  return `mailto:${site.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
}
