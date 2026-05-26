# LINE101Chat Codex Marketing Workflow

Purpose: use Codex weekly to create on-brand Traditional Chinese-first content for LINE101Chat without drifting away from the business positioning.

Core phrase:

> 台灣在地 LINE AI 知識助理

## Current Website Implementation Map

Use this map before asking Codex to update public pages.

Homepage:

- Route: `src/app/page.tsx`
- Hero component: `src/components/hero-section.tsx`
- Shared content source: `src/data/site.ts`
- Final homepage CTA: `PresenterCTA` in `src/components/presenter.tsx`

Case studies:

- Listing route: `src/app/case-studies/page.tsx`
- NTUT iFIRST detail: `src/app/case-studies/ntut-ifirst-rag/page.tsx`
- 101recipe detail: `src/app/case-studies/101recipe/page.tsx`
- Video helper: `src/components/case-studies/DemoVideoSection.tsx`
- QR helper: `src/components/case-studies/ChatbotQrGuide.tsx`
- Growth copy source: `src/data/growth.ts`

Contact and conversion:

- Contact route: `src/app/contact/page.tsx`
- Contact form: `src/components/contact-form.tsx`
- Free assessment route: `src/app/free-assessment/page.tsx`
- Book demo route: `src/app/book-demo/page.tsx`
- Book demo form: `src/components/book-demo-form.tsx`
- LINE inquiry route: `src/app/line/page.tsx`

Navigation and CTAs:

- Header CTAs: `src/components/layout/header.tsx`
- Footer CTAs: `src/components/layout/footer.tsx`
- CTA labels and URLs: `primaryCtas` in `src/data/site.ts`
- Generic CTA section: `CTASection` in `src/components/cards.tsx`

Presenter/avatar images:

- Directory: `public/presenter`
- Mapping: `src/data/presenter.ts`
- Components: `src/components/presenter.tsx`

Important rule:

> Do not change production pages unless the weekly task explicitly asks for implementation. Draft content first, then decide where it belongs.

## Weekly Codex Routine

### Monday: Content Planning

Ask Codex:

```text
Using BRAND_IDENTITY.md, SOCIAL_MEDIA_KIT.md, and CONTENT_CALENDAR_30_DAYS.md, create this week's LINE101Chat content plan. Focus on Taiwan SMEs and LINE AI knowledge assistant education. Include 5 social posts, 1 short video script, and 1 blog topic. Keep Traditional Chinese first and avoid overusing technical terms.
```

Output to request:

- Weekly theme
- 5 social captions
- 1 carousel outline
- 1 short video script
- 1 blog outline
- CTA for each item

### Tuesday: Blog Draft

Ask Codex:

```text
Draft a Traditional Chinese blog article for LINE101Chat based on this topic: [topic]. Use the brand tone from BRAND_IDENTITY.md. Target Taiwan SMEs, schools, HR, clinics, tourism, or service teams. Include a practical intro, clear sections, examples, and a CTA to free assessment. Avoid heavy technical terms unless a technical section is needed.
```

Recommended blog structure:

- Title
- SEO description
- Opening pain point
- Who this applies to
- What documents to prepare
- What the first PoC should test
- Data boundary reminder
- CTA

Before implementation:

- Confirm whether this is only a draft or should become a new Next.js route.
- If implementing, follow existing blog pattern in `src/app/blog/rag-chatbot-document-preparation/page.tsx` and content source conventions in `src/data/growth.ts`.

### Wednesday: Social Caption Batch

Ask Codex:

```text
Create 5 platform-specific social captions for LINE101Chat from this blog draft. Platforms: Facebook, LinkedIn, Instagram, Threads, YouTube Shorts. Use Traditional Chinese first. Add occasional English subtitle lines only where useful. Include visual direction and CTA for each.
```

Review checklist:

- Does each caption say what LINE101Chat does clearly?
- Is the CTA specific?
- Are technical terms minimized?
- Does it avoid promising perfect answers?
- Does it avoid prominent phone exposure?

### Thursday: Case Study Repurposing

Ask Codex:

```text
Repurpose the LINE101Chat case study [NTUT iFIRST / 101recipe] into:
1. a 45-second short video script,
2. a 5-slide Instagram carousel,
3. a LinkedIn post,
4. a Threads post,
5. a website CTA paragraph.
Keep it clear that demos are proof-of-capability, not official school or government services.
```

For NTUT iFIRST:

- Emphasize public documents becoming a searchable knowledge assistant.
- Mention source-backed answers.
- Avoid implying official NTUT endorsement unless separately confirmed.

For 101recipe:

- Emphasize authorized recipe PDF retrieval through LINE and web.
- Include the disclaimer that passcodes, credentials, and unauthorized file names must not be exposed.
- Do not confuse the recipe demo QR with the business inquiry LINE account.

### Friday: Publish Prep

Ask Codex:

```text
Create a publishing checklist for this week's LINE101Chat content. Include final caption, visual asset note, destination URL, CTA, hashtags, and risk checks for accuracy, privacy, and brand consistency.
```

Checklist:

- CTA URL is correct.
- Demo QR and business inquiry QR are not mixed.
- Public copy does not include private phone number unless approved.
- Claims are grounded and not exaggerated.
- Traditional Chinese is primary.
- English is used only as subtitle or international context.
- Visual uses presenter image consistently.

## How To Create Blog Posts With Codex

Step 1: Choose one business question.

Good topics:

- 中小企業導入 AI 知識助理前，需要準備哪些文件？
- LINE AI 助理和一般聊天機器人有什麼不同？
- 學校招生 FAQ 適合怎麼做 AI 問答 PoC？
- HR 內部知識助理第一版可以回答哪些問題？
- 診所與服務業導入 LINE AI 問答要注意哪些資訊邊界？
- 觀光服務如何把常見問題變成 LINE 問答助理？

Step 2: Ask for an outline first.

Prompt:

```text
Create an SEO blog outline for LINE101Chat on: [topic]. Audience: Taiwan [SMEs/schools/HR/clinics/tourism/service businesses]. Tone: practical, trustworthy, Traditional Chinese-first. Include title options, meta description, section headings, CTA, and internal links to /free-assessment, /case-studies, /line, and /book-demo where appropriate.
```

Step 3: Draft the article.

Prompt:

```text
Now draft the full article from this outline. Keep it clear and practical. Mention RAG only briefly if needed, and explain it as "先從文件找資料，再根據資料回答". End with a free assessment CTA.
```

Step 4: Convert into implementation only after approval.

Prompt:

```text
Implement this approved blog article in the existing Next.js site using the current blog patterns. Do not change unrelated production pages. Add metadata and update the blog listing if needed.
```

## How To Generate Social Captions

Use one source idea per batch. Do not ask Codex to create generic posts from nowhere.

Caption prompt:

```text
Using this source idea: [paste idea or blog section], create social captions for LINE101Chat:
- Facebook: practical and slightly educational
- LinkedIn: professional and buyer-aware
- Instagram: carousel-friendly
- Threads: concise and conversational
- YouTube Shorts/TikTok: 30-45 second script
Use Traditional Chinese primarily. Include CTA, visual suggestion, and 3-6 hashtags.
```

Caption quality rules:

- One clear pain point per post.
- One clear service connection.
- One clear CTA.
- Avoid "100% correct", "replace staff", "fully automated everything".
- Avoid heavy technical acronyms unless the audience is technical.

## How To Repurpose Case Studies Into Shorts/Reels

Short video structure:

1. Hook: name the repeated pain.
2. Situation: who has the problem.
3. Solution: documents become LINE AI knowledge assistant.
4. Trust point: answers can cite sources or hand off to human.
5. CTA: free assessment or view demo.

Prompt:

```text
Create a 45-second vertical video script for LINE101Chat based on [case study]. Include on-screen text, voiceover, visual direction, and CTA. Use Traditional Chinese. Add one English subtitle line if useful. Keep the tone practical and trustworthy.
```

Example short script frame:

- 0-3s: "每天都在回一樣的問題？"
- 3-10s: Show document stack and LINE chat.
- 10-25s: Explain how FAQ/SOP becomes searchable answers.
- 25-35s: Show source label and human handoff note.
- 35-45s: CTA to free assessment.

Visual assets:

- Presenter `3.png` for brand intro.
- Presenter `4.png` for explainer.
- Presenter `1.png` for CTA and consultation.
- Case study screenshots or safe mockups.
- Avoid exposing private LINE messages, user IDs, console screens, tokens, or customer documents.

## How To Maintain Brand Consistency

Always include:

- LINE101Chat
- 台灣在地 LINE AI 知識助理
- A concrete customer group
- A concrete document type
- A practical next step

Preferred customer groups:

- 台灣中小企業
- 學校 / 系所 / 教育單位
- HR / 行政 / IT
- 客服團隊
- 診所與健康服務
- 觀光與在地服務
- 製造業與 SOP 團隊

Preferred document examples:

- FAQ
- SOP
- 規章
- 產品手冊
- 招生資訊
- 表單說明
- HR 制度
- IT 常見問題
- 服務流程

Preferred CTAs:

- 免費評估你的文件
- 預約 30 分鐘需求評估
- 看案例 / Demo
- 用 LINE 詢問服務
- 先從 20-40 頁文件開始

Avoid:

- Overusing "vector database", "embeddings", "LangChain", "LLM".
- Publicly foregrounding the phone number.
- Confusing demo chatbots with the business inquiry account.
- Presenting AI as official legal, medical, government, or school authority.
- Using English as the primary voice for Taiwan-facing content.

## Monthly Review With Codex

Ask Codex once a month:

```text
Review the last month of LINE101Chat posts against BRAND_IDENTITY.md. Identify off-brand language, missing CTAs, repeated themes, risky claims, and opportunities for the next 30-day content calendar. Then propose the next month's content themes.
```

Monthly review output:

- Best performing themes to repeat
- Underused customer segments
- CTA performance notes
- New blog ideas
- New short video ideas
- Website copy improvements to consider

## Suggested Next Implementation Step

When ready to change the public website, the lowest-risk first step is to update centralized brand language in `src/data/site.ts`:

- Align homepage eyebrow with "台灣在地 LINE AI 知識助理".
- Add one or two slogan-tested hero variants.
- Keep `primaryCtas` stable unless changing conversion strategy.
- Keep presenter mappings in `src/data/presenter.ts` consistent.

Do this only after approving the public copy direction from the new brand documents.
