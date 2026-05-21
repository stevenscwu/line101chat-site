# LINE101Chat Brand Identity

## Brand Snapshot

LINE101Chat is a Taiwan-focused LINE AI knowledge assistant business for SMEs, schools, tourism teams, HR/admin teams, clinics, service businesses, and other organizations that rely on repeated answers, scattered documents, and LINE-based communication.

Main phrase:

> 台灣在地 LINE AI 知識助理

Website:

> line101chat.com

Internal contact note:

> Dedicated business phone: +886963792434. Use this for direct business development, proposals, partner handoffs, or private sales material only. Do not place it prominently on public pages or public social bios unless a specific campaign requires phone-first contact.

## Current Website Structure Scan

The current site is a Next.js App Router project. Marketing copy is mostly centralized in `src/data/site.ts`, with newer growth pages in `src/data/growth.ts`.

Important routes:

- Homepage: `src/app/page.tsx`
- Services overview: `src/app/services/page.tsx`
- AI knowledge assistant page: `src/app/rag-chatbot/page.tsx`
- Case studies listing: `src/app/case-studies/page.tsx`
- NTUT iFIRST case study: `src/app/case-studies/ntut-ifirst-rag/page.tsx`
- Taipei101 case study: `src/app/case-studies/taipei101/page.tsx`
- Free assessment page: `src/app/free-assessment/page.tsx`
- Book demo page: `src/app/book-demo/page.tsx`
- Contact page: `src/app/contact/page.tsx`
- LINE inquiry page: `src/app/line/page.tsx`
- Blog listing and article: `src/app/blog/page.tsx`, `src/app/blog/rag-chatbot-document-preparation/page.tsx`
- English routes: `src/app/en/...`

Key shared implementation points:

- Global content, CTAs, pricing, audiences, FAQs: `src/data/site.ts`
- Growth content for book-demo, checklist, case study, blog: `src/data/growth.ts`
- Presenter image mapping: `src/data/presenter.ts`
- Homepage hero: `src/components/hero-section.tsx`
- Presenter visuals and main CTA block: `src/components/presenter.tsx`
- Header CTAs: `src/components/layout/header.tsx`
- Footer CTAs and contact links: `src/components/layout/footer.tsx`
- CTA section component: `src/components/cards.tsx`
- Contact form: `src/components/contact-form.tsx`
- Book demo form: `src/components/book-demo-form.tsx`
- Case study video and QR helpers: `src/components/case-studies/`

## Brand Mission

協助台灣中小企業、學校與服務型組織，把 FAQ、SOP、規章、產品資料與內部知識整理成可在 LINE 查詢、能附來源、可維護的 AI 知識助理。

LINE101Chat does not sell abstract AI. It helps organizations turn existing knowledge into a practical support experience that staff, students, customers, and partners can use inside the communication channel they already know: LINE.

## Target Customers

Primary customer groups:

- 台灣中小企業: 客服、人資、行政、IT、業務支援、產品知識查詢。
- 學校與教育單位: 招生 FAQ、系所規章、表單說明、學生服務、國際學生支援。
- 觀光與在地服務: 景點、旅宿、導覽、交通、常見問題、多語支援延伸。
- 診所與健康服務: 預約流程、衛教 FAQ、注意事項、非診斷型資訊查詢。
- HR 與內部支援團隊: 新人訓練、請假規則、福利制度、IT 常見問題。
- 製造與營運團隊: SOP、設備操作注意事項、內部表單、品質流程。
- 小型專業服務: 法律、會計、顧問、補習班、顧客服務流程。

Decision makers:

- 老闆、創辦人、總經理
- 行政主管、客服主管、HR 主管、教務或招生窗口
- IT 或數位轉型窗口
- 對 LINE 官方帳號已有基本使用經驗的營運者

Pain points:

- 重複問題太多，人工一直回答一樣內容。
- 文件散落在網站、PDF、Word、雲端資料夾與同仁腦中。
- 新人訓練依賴口耳相傳。
- 客戶、學生或員工都習慣用 LINE，但官方回覆速度跟不上。
- 希望導入 AI，但不想一開始就做大型昂貴系統。
- 擔心 AI 亂回答、沒有來源、資料外流或後續無法維護。

## Core Positioning

Positioning statement:

> LINE101Chat 是為台灣組織打造的 LINE AI 知識助理服務，協助把正式文件與常見問題變成可查詢、可追溯、可維護的 LINE 問答體驗。

Short positioning:

> 把公司文件變成 LINE 裡的 AI 知識助理。

What LINE101Chat is:

- Practical AI assistant implementation service.
- LINE-first knowledge access experience.
- Document preparation, PoC, rollout, and maintenance partner.
- Taiwan-local service with Traditional Chinese-first communication.
- A bridge between existing documents and daily user questions.

What LINE101Chat is not:

- Not a generic chatbot template shop.
- Not a purely technical AI lab brand.
- Not a replacement for all customer service staff.
- Not a public search engine for private company information.
- Not a promise that AI can answer without reviewed source material.

## Chinese Slogan Options

Recommended primary:

1. 台灣在地 LINE AI 知識助理

Additional slogan options:

2. 把公司文件，變成 LINE 裡的即時助理
3. 讓 FAQ、SOP、規章，用 LINE 就查得到
4. 少一點重複回答，多一點有根據的服務
5. 用 LINE 查文件，用來源建立信任
6. 從文件到回答，讓組織知識真正被用起來
7. 給台灣 SME 的務實 AI 知識助理
8. 不改變使用習慣，先改善找答案的速度
9. 讓員工、學生與客戶，在 LINE 找到正確資訊
10. 從 20 頁文件開始，驗證你的 AI 知識助理
11. 文件整理好，AI 才回答得穩
12. 先做小 PoC，再決定是否正式導入

## English Slogan Options

Use English as a subtitle, not the primary voice.

1. Taiwan-local LINE AI knowledge assistants.
2. Turn documents into answers inside LINE.
3. Practical AI support for Taiwan SMEs.
4. Source-grounded answers for everyday operations.
5. A LINE-first knowledge assistant for teams, schools, and services.
6. From FAQs and SOPs to searchable LINE support.
7. Make internal knowledge easier to find, trust, and maintain.
8. Start small, prove value, then scale responsibly.

## Visual Identity Recommendation

Overall visual direction:

- Professional, trustworthy, practical, Taiwan-local.
- Traditional Chinese-first.
- Human consultant imagery should feel calm and helpful, not overly futuristic.
- Visuals should communicate documents, LINE conversation, source-backed answers, and local service.

Recommended palette:

- LINE green: `#06C755` for LINE-specific CTAs.
- Emerald: `#059669` / `#047857` for primary trust and action.
- Deep slate: `#0F172A` for authority, headers, footer, and contrast.
- Soft slate: `#F8FAFC` / `#F1F5F9` for clean backgrounds.
- Warm document accent: `#FFF7ED` for process and document preparation sections.
- Sky accent: `#0284C7` for demo and proof-of-capability moments.
- Amber accent: `#F59E0B` for caution, limitations, or "開發中" notes.

Typography and layout:

- Keep the current strong, bold heading system.
- Prefer short, scannable sections and practical card grids.
- Use 8px radius or existing `rounded-lg` style.
- Avoid overly decorative gradients, vague tech illustrations, or futuristic neon looks.
- Make the main product signal visible quickly: LINE, documents, source-backed answers, Taiwan SME use cases.

Graphic motifs:

- LINE chat bubbles.
- Document cards with source labels.
- Checklist marks.
- QR code and mobile conversation frames.
- Taiwan-local cues through language, examples, and customer scenarios rather than flags or tourist cliches.

## Avatar Usage Guide

Available image directory:

> `public/presenter`

Current presenter mapping in `src/data/presenter.ts`:

- Homepage hero: `public/presenter/3.png`
- AI knowledge assistant page: `public/presenter/4.png`
- About page: `public/presenter/1.png`
- Contact page: `public/presenter/1.png`
- CTA sections: `public/presenter/1.png`

Recommended usage:

- Use `3.png` for high-trust first impressions, especially homepage hero and brand awareness posts.
- Use `4.png` for educational explainers about AI knowledge assistants, document preparation, and source-backed answers.
- Use `1.png` for contact, founder/presenter introduction, consultation invitation, and "book assessment" moments.
- Use `host-main.png` as a strong social avatar or video presenter thumbnail candidate after checking crop quality at small sizes.
- Use `2.png`, `5.png`, `6.png`, `7.png`, `8.png` only as secondary social variations after confirming they match the professional business-suit identity.

Profile photo crop:

- Crop chest-up or shoulder-up.
- Keep face centered with enough whitespace around the head.
- Use a white, slate, or emerald-tinted background.
- Test at 40px and 96px because most social avatars appear small.

Do:

- Use one presenter consistently per campaign.
- Pair presenter image with clear service copy.
- Add subtle LINE green or emerald accent.
- Use presenter as a trusted consultant, not a mascot.

Don't:

- Do not rotate every presenter image randomly.
- Do not use exaggerated speech bubbles, memes, or cartoon effects for primary business pages.
- Do not imply the avatar is a licensed human advisor, doctor, lawyer, or official school representative.
- Do not use presenter images in a way that suggests guaranteed AI accuracy.

## Tone Of Voice

Tone keywords:

- 專業
- 可信任
- 務實
- 台灣在地
- 清楚
- 不誇大
- 有同理心
- 先評估再導入

Writing style:

- Traditional Chinese first.
- Use short sentences and practical examples.
- Start from business pain, not technology.
- Explain AI through outcomes: fewer repeated questions, faster document search, source-backed answers.
- Use English only as supporting subtitle or international-facing copy.
- Mention technical terms only in technical pages, implementation notes, or buyer discussions where needed.

Preferred phrases:

- AI 知識助理
- LINE AI 助理
- 文件問答
- 來源引用
- 文件準備
- 免費需求評估
- 小範圍 PoC
- 雲端或本地端部署評估
- 讓同仁少做重複查找
- 用正式文件回答常見問題

Use sparingly:

- RAG
- 向量資料庫
- embeddings
- LangChain
- LLM
- 模型微調

Avoid in non-technical marketing:

- "用最先進 AI 革命你的企業"
- "完全取代客服"
- "100% 正確回答"
- "不用整理資料就能上線"
- "把所有公司資料丟進 AI"
- "一鍵建立企業知識庫"

## Messaging Rules

Do:

- Lead with the customer problem.
- Explain that the first step is document and use-case assessment.
- Use concrete examples: FAQ, SOP, admissions rules, product manuals, HR policies.
- Emphasize LINE because Taiwan users already know it.
- Emphasize source-backed answers and maintainability.
- Say "先從 20-40 頁文件與真實問題開始驗證".
- Set expectations that production rollout depends on document quality, usage, privacy, and maintenance needs.
- Keep phone number private or low-profile unless a sales context requires it.

Don't:

- Do not promise perfect answers.
- Do not say AI will replace all staff.
- Do not over-center model names or technical architecture in public-facing copy.
- Do not expose private phone prominently on website hero, footer, or public social bios.
- Do not mix business inquiry QR codes with demo chatbot QR codes.
- Do not present demo chatbots as official school, government, clinic, or legal advice services.
- Do not imply customer private documents are used for public training.

## Brand Proof Points

Use these repeatedly:

- Taiwan-focused, Traditional Chinese-first.
- Built around LINE, the channel customers already use.
- Starts with a small, measurable PoC.
- Helps organize documents before AI rollout.
- Answers can reference sources.
- Cloud, local, or private deployment can be assessed by data sensitivity.
- Suitable for SMEs, schools, HR, clinics, tourism, and service businesses.
- Existing demos show how public documents can become a usable LINE knowledge assistant.

## Brand Promise

> LINE101Chat helps Taiwan organizations make their existing knowledge easier to find, trust, and maintain inside LINE.

Traditional Chinese version:

> LINE101Chat 幫台灣組織把既有知識整理成可在 LINE 查詢、能追溯來源、後續可維護的 AI 知識助理。
