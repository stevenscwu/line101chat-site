# Next Developer Handoff

Generated: 2026-05-14  
Last updated: 2026-05-20

## Project

- Local path: `C:\line101chat-site`
- Production site: `https://line101chat.com/`
- GitHub repo: `https://github.com/stevenscwu/line101chat-site`
- Current branch: `main`
- Latest product commit: `6302e54 Add translation payment flow`
- Latest production deployment: `dpl_FZRUG4wkNzxT6A3WpTN7kWnvFUUw`
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

## LINE Translation Bot Subscription Flow

Date implemented and deployed: 2026-05-20

Customer-facing route:

- `https://line101chat.com/translation-service`

Admin route:

- `/translation-service/admin`
- Requires `TRANSLATION_PAYMENTS_ADMIN_TOKEN` in production.
- Open as `/translation-service/admin?token=<admin-token>` after the token is configured in Vercel.
- If the admin token is not configured, local development allows access but production denies access.

GitHub and Vercel:

- GitHub commit: `6302e54443ca5b826ed1e095ebab91c58facd314`
- Commit message: `Add translation payment flow`
- GitHub URL: `https://github.com/stevenscwu/line101chat-site/commit/6302e54443ca5b826ed1e095ebab91c58facd314`
- Vercel deployment ID: `dpl_FZRUG4wkNzxT6A3WpTN7kWnvFUUw`
- Vercel deployment URL: `https://line101chat-site-36h596lw5-line101chats-projects.vercel.app`
- Vercel inspector: `https://vercel.com/line101chats-projects/line101chat-site/FZRUG4wkNzxT6A3WpTN7kWnvFUUw`
- Production alias: `https://line101chat.com`

### Product Scope

The new page is for a Chinese `<->` Indonesian LINE Translation Bot subscription.

Plans:

- Free: `NT$0`, `30 translations/month`
- Basic: `NT$99/month`, `300 translations`
- Plus: `NT$199/month`, `1000 translations`

The public page explains:

- What the translation bot does.
- Pricing and monthly quota.
- `Pay with LINE Pay` buttons for Basic and Plus.
- Activation only happens after server-side LINE Pay confirmation.
- Real activation codes are not shown on public pages.
- LINE Pay secrets are not exposed to the browser.

### Implemented Routes

Public page:

- `src/app/translation-service/page.tsx`
- Route: `/translation-service`
- Uses `public/presenter/2.png`.
- Accepts optional query params:
  - `lineUserId`
  - `payment`
  - `orderId`
- Basic and Plus submit HTML forms to `POST /api/translation-payments/create`.

Admin page:

- `src/app/translation-service/admin/page.tsx`
- Route: `/translation-service/admin`
- Dynamic server page.
- Shows payments table:
  - `orderId`
  - `lineUserId`
  - `plan`
  - `amount`
  - `status`
  - `transactionId`
  - `activationCode`
  - `createdAt`
  - `paidAt`
- Includes manual `Recheck payment` form that posts to `POST /api/translation-payments/reconcile`.
- Noindex metadata is set.
- `robots.ts` also disallows `/translation-service/admin` and `/api/translation-payments`.

API routes:

- `src/app/api/translation-payments/create/route.ts`
  - `POST /api/translation-payments/create`
  - Requires `plan` and `lineUserId`.
  - Only accepts Basic or Plus for payment creation.
  - Creates a local pending order with a unique `orderId`.
  - Calls LINE Pay Payment Request API.
  - Stores `transactionId` and `paymentUrl`.
  - Redirects HTML form requests to LINE Pay payment URL.
  - Returns JSON for JSON clients.

- `src/app/api/translation-payments/confirm/route.ts`
  - `GET /api/translation-payments/confirm`
  - Confirm URL for LINE Pay return.
  - Locates order by `orderId` or `transactionId`.
  - Calls LINE Pay Confirm Payment API with `transactionId`, `amount`, and `currency`.
  - Only marks paid after LINE Pay returns `0000` and local verification passes.
  - Generates/stores activation code after server-side verification only.
  - Redirects back to `/translation-service?payment=<status>&orderId=<orderId>`.

- `src/app/api/translation-payments/reconcile/route.ts`
  - `POST /api/translation-payments/reconcile`
  - Admin-only.
  - Uses `orderId` or `transactionId`.
  - Calls LINE Pay Retrieve Payment Details API.
  - Compares `amount`, `currency`, `orderId`, and `transactionId`.
  - Never activates quota unless server-side LINE Pay verification succeeds.

### Payment Library Files

- `src/lib/translation-payments/plans.ts`
  - Central plan data and TypeScript plan types.

- `src/lib/translation-payments/store.ts`
  - Local file-backed payment store.
  - Default local path: `.data/translation-payments.json`.
  - `.data/` is ignored by git.
  - Uses OS temp directory on Vercel if no durable directory is configured.
  - Generates:
    - `orderId` like `L101T-YYYYMMDDHHMMSS-XXXXXXXX`
    - `activationCode` like `TR-XXXXXXXXXXXXXXXX`

- `src/lib/translation-payments/line-pay.ts`
  - Server-only LINE Pay API client.
  - Reads LINE Pay credentials from environment variables at request time.
  - Uses HMAC SHA256 signing for `X-LINE-Authorization`.
  - Keeps LINE Pay `transactionId` as string to avoid JavaScript 64-bit integer precision loss.
  - Calls:
    - `POST /v3/payments/request`
    - `POST /v3/payments/{transactionId}/confirm`
    - `GET /v3/payments`
  - Verifies payment details before activation.

- `src/lib/translation-payments/admin.ts`
  - Admin token comparison with `timingSafeEqual`.
  - `TRANSLATION_PAYMENTS_ADMIN_TOKEN` is recommended and required for production admin access.

### Required Environment Variables

Do not commit values. Configure these in Vercel before using real payments:

```text
LINE_PAY_CHANNEL_ID
LINE_PAY_CHANNEL_SECRET
LINE_PAY_API_BASE_URL
LINE_PAY_CONFIRM_URL
LINE_PAY_CANCEL_URL
```

Recommended production admin variable:

```text
TRANSLATION_PAYMENTS_ADMIN_TOKEN
```

As of the 2026-05-20 production deployment, `vercel env ls` showed only:

```text
RAG_DEMO_API_KEY
RAG_DEMO_API_URL
```

This means the deployed LINE Pay flow is present, but real LINE Pay payment creation will fail until the LINE Pay env vars are added in Vercel.

Suggested production values:

- `LINE_PAY_API_BASE_URL`
  - Sandbox: `https://sandbox-api-pay.line.me`
  - Production: `https://api-pay.line.me`
- `LINE_PAY_CONFIRM_URL`
  - `https://line101chat.com/api/translation-payments/confirm`
- `LINE_PAY_CANCEL_URL`
  - A public cancellation route can be added later.
  - For now, it can point to `https://line101chat.com/translation-service?payment=cancelled`.

### LINE Pay API Notes

Official docs used:

- `https://developers-pay.line.me/online-api-v3`
- `https://developers-pay.line.me/online-api-v3/request-payment`
- `https://developers-pay.line.me/online-api-v3/confirm-payment`
- `https://developers-pay.line.me/online-api-v3/retrieve-payment-details`

Header/signature pattern:

- `X-LINE-ChannelId`
- `X-LINE-Authorization-Nonce`
- `X-LINE-Authorization`
- For `POST`: HMAC message is `channelSecret + apiPath + JSON.stringify(body) + nonce`.
- For `GET`: HMAC message is `channelSecret + apiPath + queryString + nonce`.
- Signature uses HMAC SHA256 and Base64 output.

Important result codes:

- `0000`: successful API processing.
- Confirm API `0000`: payment confirmation succeeded.
- Request-status API docs also define:
  - `0110`: customer completed LINE Pay authentication and confirm can proceed.
  - `0121`: cancelled or expired.
  - `0122`: payment failed.
  - `0123`: payment completed.

The implementation does not activate from redirects or client-side success pages. It always calls LINE Pay from the server.

### Storage Caveat Before Real Payments

Current storage is intentionally isolated and file-backed to match the existing site, which did not have a database layer.

This is acceptable for local development and integration scaffolding, but not enough for real production billing because Vercel serverless storage is not durable.

Before accepting real payments, replace `src/lib/translation-payments/store.ts` with durable storage, for example:

- Vercel Postgres/Neon
- Supabase Postgres
- PlanetScale
- Turso
- Upstash Redis plus durable export, only if the data model remains simple

Keep the public page and API route contracts stable when swapping storage.

### Security Rules To Preserve

- Do not expose LINE Pay channel secret in code, browser JS, HTML, logs, screenshots, docs, or prompts.
- Do not trust `/translation-service?payment=paid`.
- Do not activate based only on a LINE Pay redirect.
- Always confirm with LINE Pay server-side before quota upgrade or activation-code generation.
- Compare local `orderId`, `transactionId`, `amount`, and `currency` with LINE Pay response data.
- Keep real activation codes out of public pages.
- Keep admin page noindexed and token-gated.
- Do not commit `.data/translation-payments.json` if it is created locally.

### Validation And Deployment Checks

Local checks passed before deployment:

- `npm run lint`
- `npm run build`

Production deployment checks:

- Vercel production build passed.
- `https://line101chat.com/translation-service` returned `200`.
- Live page contained `Pay with LINE Pay`.
- Live page contained `NT$199 / month`.
- Vercel production error logs for the last hour returned no logs.

Browser verification note:

- `agent-browser` was not installed in the local environment, so browser automation could not run.
- Fallback HTTP/content/API checks were run instead.

Local development note:

- A dev server was started on `http://localhost:3002` because ports `3000` and `3001` were busy.
- That dev server was stopped after deployment.

### Follow-Up Tasks For This Flow

- Add the required LINE Pay env vars in Vercel.
- Add `TRANSLATION_PAYMENTS_ADMIN_TOKEN` in Vercel.
- Replace the file-backed store with durable storage before real payments.
- Add a dedicated cancel page or cancel API handler if LINE Pay cancellation UX needs to be cleaner.
- Connect successful paid orders to the real LINE bot quota system:
  - Either directly upgrade by `lineUserId`.
  - Or let the LINE bot consume the stored activation relation.
- Add admin authentication beyond a URL token if this becomes operationally important.
- Consider webhook/status polling only if LINE Pay flow needs additional resilience.
- Add integration tests with mocked LINE Pay responses before first real transaction.

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

- `businessReview20260519.docx`
- `proposal20260508v1.txt`
- `public/presenter/prompt.txt`
- `service.jpg`
- `summary20260509v1.txt`
- `summary20260511v1.txt`
- `summary20260511v2.txt`
- `summary20260512v1.txt`
- `summary20260512v2.txt`
- `~$sinessReview20260519.docx`

There are also local dev logs such as `.next-dev*.log`. These should remain uncommitted.

## Known Follow-Up

Vercel install output on 2026-05-20 reported `2 vulnerabilities (1 moderate, 1 high)` from `npm audit`. This was not part of the translation payment work and should be handled separately with a dependency audit before running any forced fix.
