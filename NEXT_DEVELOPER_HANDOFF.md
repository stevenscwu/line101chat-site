# Next Developer Handoff

Generated: 2026-05-14  
Last updated: 2026-05-19

## Project

- Local path: `C:\line101chat-site`
- Production site: `https://line101chat.com/`
- GitHub repo: `https://github.com/stevenscwu/line101chat-site`
- Current branch: `main`
- Latest product commit: `be9fe29 Add iFIRST demo video package`
- Latest production deployment: `dpl_F5wMX6fEtAVYpCvYUVHX4oiHN3MX`
- Vercel production alias: `https://line101chat.com`

## Current Business Positioning

LINE101Chat should be positioned as an AI Knowledge Assistant service, not a generic chatbot company.

Core customer-facing sentence:

> 幫台灣中小企業與學校，把文件、FAQ、SOP 變成可在 LINE 查詢、能附來源的 AI 知識助理。

Main service:

- `AI 知識助理`
- `LINE AI 助理`
- `文件問答`
- `來源引用`
- `免費評估`
- `PoC`
- `本地端 / 私有化部署` when needed

Avoid making translation chatbot the main product. Translation can remain a secondary optional module only.

## Three LINE Chatbots

Do not mix these channels, QR codes, LINE IDs, webhooks, or credentials.

### Business Inquiry Chatbot

- Purpose: answer customer questions about LINE101Chat service, free assessment, PoC, document preparation, and pricing logic.
- Local project: `C:\line101chat\chatbots\line101-business`
- LINE channel ID: `2007691019`
- Website QR asset: `public/line101-business-qr.png`
- Source QR asset: `C:\line101chat\chatbots\line101-business\assets\line101_business.PNG`
- Website route: `/line`
- Label: `詢問 LINE101Chat 服務`

### NTUT iFIRST RAG Demo Chatbot

- Purpose: demonstrate RAG document Q&A using public NTUT iFIRST / 北科大創新學院 documents.
- Local project: `C:\FirstRAG`
- LINE channel ID: `2007782998`
- Website QR asset: `public/ntut-ifirst-demo-qr.png`
- Website routes: `/case-studies`, `/demo/ifirst-rag`
- Label: `試用北科大創新學院文件問答 Demo`
- Disclaimer: `本 Demo 僅供技術展示與商業案例說明，正式學校規定仍以官方公告與辦公室回覆為準。`

### Taipei101 Student Arrival Demo Chatbot

- Purpose: demonstrate a microbusiness case study for international students and exchange students arriving in Taipei.
- Local project: `C:\line101chat\chatbots\taipei101-student`
- LINE channel ID: `2007764825`
- Public LINE Basic ID: `@138hrqii`
- Public add-friend URL: `https://line.me/R/ti/p/%40138hrqii`
- Official LINE QR source used for the website asset: `https://qr-official.line.me/sid/M/138hrqii.png`
- Website QR asset: `public/taipei101-chatbot-qr.png`
- Website route: `/case-studies/taipei101`
- Label: `微型商業案例 / 開發中 Demo`
- Main page title: `Taipei101 Chatbot｜台北留學生報到生活 AI 助理`
- Disclaimer: `Taipei101 Chatbot 不是官方學校或政府服務。簽證、ARC、健保、入學與學籍相關事項，仍應以學校、政府機關與官方公告為準。`
- Credentials remain only in the Taipei101 local `.env`; do not copy channel secret or access token into website code, docs, screenshots, commits, or prompts.

## Recent Published Work

### Commit `1539159` - Fix LINE QR routing and demo labels

- Replaced ambiguous business QR usage on NTUT demo surfaces.
- Added distinct QR assets:
  - `public/line101-business-qr.png`
  - `public/ntut-ifirst-demo-qr.png`
- Updated `/line` to use the business inquiry QR.
- Updated `/case-studies` and `/demo/ifirst-rag` to use the NTUT demo QR.
- Added channel labels on visible QR blocks.

### Commit `6f9c8f8` - Refine case studies conversion flow

- Reframed `/case-studies` so the NTUT iFIRST demo reads as proof of a repeatable AI 知識助理 service, not just a school project.
- Added a case-study video section with a safe placeholder for future video:
  - `src/components/case-studies/DemoVideoSection.tsx`
  - Future MP4 path: `public/videos/ifirst-rag-demo.mp4`
- Added a chatbot QR guide:
  - `src/components/case-studies/ChatbotQrGuide.tsx`
  - Clear separation between demo chatbot and business inquiry chatbot.
- Added video planning content under:
  - `content/video/ifirst-rag-demo/`
- Strengthened conversion CTAs:
  - `預約免費評估`
  - `詢問導入方式`
  - Free assessment path uses `20-30 頁正式文件` and `30-50 個常見問題`.

### 2026-05-18 - Add Taipei 101 Chatbot case-study demo

- Added new route:
  - `src/app/case-studies/taipei101/page.tsx`
  - Public path: `/case-studies/taipei101`
- Page positioning:
  - `Taipei 101 Chatbot｜台北留學生報到生活 AI 助理`
  - Demo microbusiness proving LINE101Chat can build a RAG-enabled LINE AI Knowledge Assistant for a practical Taipei international-student arrival use case.
  - This is a case-study / demo, not the main LINE101Chat service.
- Page sections added:
  - Problem: international students arriving in Taipei do not know who to ask.
  - Solution: official information and local guides become a LINE AI assistant.
  - Answer categories: arrival, registration, ARC / insurance, housing, transport, SIM / bank, human help.
  - English sample questions for student-facing Q&A.
  - LINE101Chat proof points, small-profit model, disclaimer, and CTA.
- Added a visible TODO placeholder for a future Taipei 101 Chatbot LINE QR code.
  - No fake QR code was added.
- Updated:
  - `src/app/case-studies/page.tsx`
  - Added a new Taipei 101 Chatbot card linking to `/case-studies/taipei101`.
- Updated:
  - `src/app/sitemap.ts`
  - Added `/case-studies/taipei101` as a Traditional Chinese route without inventing a missing English alternate.
- Validation run locally:
  - `npm run build` passed.
  - `npm run lint` passed.
  - Local HTTP check for `/case-studies/taipei101` returned `200`.
  - Local `/case-studies` output contains `Taipei 101 Chatbot`.

### 2026-05-20 - Save Taipei101 QR and deployment state

- Public LINE metadata confirmed through the Taipei101 channel token without exposing secrets:
  - LINE display name: `Taipei101`
  - Channel ID: `2007764825`
  - Basic ID: `@138hrqii`
  - Add-friend URL: `https://line.me/R/ti/p/%40138hrqii`
- Added real Taipei101 QR asset:
  - `public/taipei101-chatbot-qr.png`
  - Source: `https://qr-official.line.me/sid/M/138hrqii.png`
  - Size: `180x180`, `image/png`, `983 bytes`
- Updated website:
  - `src/app/case-studies/taipei101/page.tsx`
  - `src/app/case-studies/page.tsx`
  - `src/components/cards.tsx`
- The Taipei101 case-study page now shows:
  - Real QR image instead of the TODO placeholder.
  - LINE ID `@138hrqii`.
  - Demo Channel `2007764825`.
  - External button text: `加入 LINE 試用`.
  - CTA remains `預約免費評估` for LINE101Chat service inquiries.
- The `/case-studies` listing shows:
  - `Taipei101 Chatbot｜台北留學生報到生活 AI 助理`
  - Badge: `開發中案例`
  - Link: `/case-studies/taipei101`
- GitHub:
  - Commit: `7c86ef0 Add Taipei101 chatbot QR case study`
  - Full SHA: `7c86ef0ed53e549e7e1038f21c4dd279de901a9b`
  - Repository: `https://github.com/stevenscwu/line101chat-site`
- Vercel:
  - GitHub integration deployed the commit successfully.
  - `Vercel - line101chat-site`: success.
  - `Vercel - line101chat`: success.
  - Production alias: `https://line101chat.com`
- Live verification:
  - `https://line101chat.com/case-studies/taipei101` returned `200`.
  - Page contains `Taipei101 Chatbot`, `@138hrqii`, `加入 LINE 試用`, and `/taipei101-chatbot-qr.png`.
  - `https://line101chat.com/taipei101-chatbot-qr.png` returned `200`, `image/png`, `983 bytes`.
  - Live QR hash matched the local asset.
  - `https://line101chat.com/case-studies` returned `200` and contains the Taipei101 card, `開發中案例`, and `/case-studies/taipei101`.
- Build verification:
  - `npm run build` passed before commit and deploy.
- Future warning:
  - The QR/add-friend flow is now public, but broad promotion should still wait for stable webhook hosting, RAG-backed answers, golden question tests, safety fallback tests, and privacy/data-safety messaging.

### 2026-05-19 - Add and deploy iFIRST demo video package

- Prepared the 60-90 second Traditional Chinese demo video package under:
  - `content/video/ifirst-rag-demo/`
- Updated the video section on `/case-studies`:
  - `src/components/case-studies/DemoVideoSection.tsx`
  - Exact title: `北科大創新學院 iFIRST AI 文件問答 Demo`
  - Exact subtitle: `用公開文件建立可在 LINE 查詢的 AI 知識助理`
  - Uses local video path: `/videos/ifirst-rag-demo.mp4`
  - Shows a placeholder only when the MP4 file is missing.
- Added TODO comments in QR-related UI for future approved public LINE add-friend links / QR assets:
  - `src/components/case-studies/DemoVideoSection.tsx`
  - `src/components/case-studies/ChatbotQrGuide.tsx`
- Generated and committed the final MP4:
  - `public/videos/ifirst-rag-demo.mp4`
  - Size: about `2.35 MB`
  - Format: `video/mp4`
  - Resolution: `1920x1080`
  - Duration: about `90 seconds`
  - Includes visible captions and an embedded subtitle track generated from `captions.zh-TW.srt`.
- The MP4 uses safe public/web assets and a clean LINE-style demo scene.
  - It does not automate-record the private LINE desktop window.
  - This avoids exposing private LINE chats, notifications, user IDs, or console/admin screens.
- GitHub:
  - Commit: `be9fe29 Add iFIRST demo video package`
  - URL: `https://github.com/stevenscwu/line101chat-site/commit/be9fe29190e81f184995a40911e8bc7afef73852`
- Vercel:
  - Deployment: `dpl_F5wMX6fEtAVYpCvYUVHX4oiHN3MX`
  - Production alias: `https://line101chat.com`
  - Live page: `https://line101chat.com/case-studies`
  - Live MP4: `https://line101chat.com/videos/ifirst-rag-demo.mp4`
- Live verification:
  - `/case-studies` contains `<video>` with source `/videos/ifirst-rag-demo.mp4`.
  - Placeholder text `Demo 影片準備中` is no longer present when the video file exists.
  - `HEAD /videos/ifirst-rag-demo.mp4` returned `200 OK`, `video/mp4`, content length `2354111`.

## Video Planning Assets

Folder:

`content/video/ifirst-rag-demo/`

Files:

- `README.md`
- `script.zh-TW.md`
- `storyboard.zh-TW.md`
- `captions.zh-TW.srt`
- `voiceover.zh-TW.txt`
- `shot-list.zh-TW.md`
- `video-page-copy.zh-TW.md`
- `ollama-script-polish-prompt.md`
- `video-production-guide.md`

Video title:

`北科大創新學院 iFIRST AI 文件問答 Demo`

Video subtitle:

`用公開文件建立可在 LINE 查詢的 AI 知識助理`

Final video location:

`public/videos/ifirst-rag-demo.mp4`

The current MP4 is committed because it is small, about `2.35 MB`. If a future replacement video is large, prefer YouTube unlisted or external video hosting instead of committing a large video to the repo/Vercel.

## Important Website Files

- `src/data/site.ts`
  - Centralized positioning copy, nav labels, CTAs, QR paths, case-study copy.
  - `site.lineQrImage = "/line101-business-qr.png"`
  - `site.ntutDemoQrImage = "/ntut-ifirst-demo-qr.png"`
  - `site.businessLineChannelId = "2007691019"`
  - `site.ntutDemoLineChannelId = "2007782998"`

- `src/app/case-studies/page.tsx`
  - Main case-study page.
  - Imports `DemoVideoSection` and `ChatbotQrGuide`.

- `src/components/case-studies/DemoVideoSection.tsx`
  - Shows a video if `public/videos/ifirst-rag-demo.mp4` exists.
  - Otherwise shows `Demo 影片準備中` placeholder.
  - Includes TODO comments for future public LINE add-friend links.

- `src/components/case-studies/ChatbotQrGuide.tsx`
  - Explains the two chatbot purposes and channel IDs.
  - Uses customer-facing Traditional Chinese and English copy.
  - Does not expose LINE Developers Console URLs.

- `src/app/line/page.tsx`
  - Business inquiry QR page.
  - Uses `site.lineQrImage`.

- `src/components/rag-demo/RagDemoChat.tsx`
  - Web demo prepared-answer component.
  - Uses the NTUT demo QR, not the business inquiry QR.

## Validation Already Run

Local:

- `npm run build` passed after QR changes.
- `npm run build` passed after video section and conversion copy changes.

Vercel:

- Production build passed for deployment `dpl_EJBVjz269wxnP1PfK88TinUoh6B8`.
- Production build passed for deployment `dpl_F5wMX6fEtAVYpCvYUVHX4oiHN3MX`.
- Production alias updated to `https://line101chat.com`.

Live no-cache checks confirmed `/case-studies` includes:

- `從北科大 iFIRST Demo，看文件如何變成 LINE AI 知識助理`
- `這個 Demo 對客戶代表什麼`
- `不只是學校 Demo`
- `先試 Demo`
- `預約免費評估`
- `詢問導入方式`

Live QR verification from the previous deployment confirmed:

- `https://line101chat.com/line101-business-qr.png` matches `C:\line101chat\chatbots\line101-business\assets\line101_business.PNG`.
- `https://line101chat.com/ntut-ifirst-demo-qr.png` matches `C:\line101chat-site\public\ntut-ifirst-demo-qr.png`.

Live video verification from 2026-05-19 confirmed:

- `https://line101chat.com/case-studies` includes `/videos/ifirst-rag-demo.mp4`.
- `https://line101chat.com/videos/ifirst-rag-demo.mp4` returns `200 OK`, `video/mp4`, and content length `2354111`.

## Remaining Manual Work

- Optional future replacement: record a true live LINE demo clip manually if needed.
  - Use Do Not Disturb.
  - Hide private LINE IDs, other chats, notifications, and any unrelated personal content.
  - Keep iFIRST demo chatbot separate from the LINE101Chat business chatbot.
  - Do not show LINE Developers Console, Channel Secret, Webhook URL, Access Token, or admin pages.
- If a future replacement video is large, use YouTube unlisted or external hosting and update `DemoVideoSection`.
- Add public LINE add-friend URLs if available and approved.
  - Keep LINE Developers Console URLs private; do not use them as public CTA links.

## Security And Data Notes

- Do not edit or commit `.env` files.
- Do not commit LINE private logs or user IDs.
- Do not commit FirstRAG conversation DB, vector DB, logs, or generated test outputs.
- Keep business chatbot credentials separate from NTUT demo chatbot credentials.

## Current Local Worktree Gotchas

There are unrelated untracked local files in `C:\line101chat-site`. Do not stage them unless explicitly requested:

- `proposal20260508v1.txt`
- `service.jpg`
- `summary20260509v1.txt`
- `summary20260511v1.txt`
- `summary20260511v2.txt`
- `summary20260512v1.txt`
- `summary20260512v2.txt`

There are also local dev logs such as `.next-dev*.log`. These should remain uncommitted.

## Known Follow-Up

Vercel install output reports `1 high severity vulnerability` from `npm audit`. This was not part of the case-study/QR/video work and should be handled separately with a dependency audit before running any forced fix.
