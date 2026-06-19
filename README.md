# LINE101Chat Business Website

LINE101Chat is a Taiwan-focused enterprise AI knowledge assistant website for SMEs, schools, education organizations, manufacturers, HR/admin/IT teams, and LINE-based customer service teams.

The site now presents confidential company knowledge search through LINE as the core service and translation as an optional module:

- Enterprise AI Knowledge Assistant for official-document Q&A with source-grounded answers
- LINE-based company knowledge search with cloud, local, or private deployment options
- Confidentiality positioning around data boundaries, source citation, and controlled deployment
- SME Cloud RAG and Local / Private RAG deployment options
- LINE Translation Optional Module for Indonesian ⇄ Traditional Chinese communication
- NTUT / National Taipei University of Technology engineering team positioning for the Taiwan market

Production domain:

```text
https://line101chat.com/
```

Repository:

```text
https://github.com/stevenscwu/line101chat-site
```

## Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS v4
- Static pages suitable for Vercel
- Local presenter images from `public/presenter`
- LINE service QR code from `public/service.jpg`
- `next/image` for local images
- Traditional Chinese pages at the root routes with matching English pages under `/en`
- Header language switcher that maps each page to its Chinese or English counterpart
- Structured `/book-demo` flow with seven PoC qualification questions and email/LINE fallback
- `/document-readiness-checklist` lead magnet page that can be printed or saved as PDF
- SEO blog and detailed NTUT iFIRST RAG case-study pages
- `/101recipe` local recipe PDF retrieval page, proxied to the 101recipe bot backend
- `/ai-avatar` interactive Celine AI persona page with LINE/web chat and privacy-controlled conversation memory

## Presenter Assets

Presenter files inspected in `public/presenter`:

```text
1.png
2.png
3.png
4.png
5.png
6.png
7.png
8.png
host-main.png
```

Chosen images are configured in:

```text
src/data/presenter.ts
```

Current assignment:

- Home hero: `3.png`
- Home CTA: `1.png`
- RAG page: `4.png`
- Translation page: `2.png`
- About page: `1.png`
- Contact page: `1.png`

Only the business-suit presenter images are used on the website to keep the identity consistent and professional.

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000/
```

For the LINE AI avatar webhook, copy the example configuration without committing
the resulting local file:

```powershell
Copy-Item .env.example .env.local
```

Use `LLM_PROVIDER=mock` for a deterministic demo without a running model. For
local Ollama, use:

```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma4:26b
OLLAMA_TIMEOUT_MS=45000
```

Full setup instructions are in [`docs/line-ai-avatar.md`](docs/line-ai-avatar.md).

For the 101recipe page, run the bot backend first:

```bash
cd C:\line101chat\chatbots\101recipe
npm run dev
```

Then run the site on another port:

```bash
cd C:\line101chat-site
npm run dev -- -p 3001
```

Open:

```text
http://localhost:3001/101recipe
```

The site proxies `/api/101recipe/*` to the bot backend. Configure the backend URL with:

```env
RECIPE_BOT_API_BASE_URL=http://127.0.0.1:3000
```

## Production Checks

```bash
npm run build
```

Optional lint check:

```bash
npm run lint
```

## Deployment

Vercel deploys from GitHub. Typical workflow:

```bash
npm install
npm run dev
npm run build
git add .
git commit -m "Build LINE101Chat business website"
git push
```

Vercel auto deploys from GitHub after push.

Vercel project:

```text
https://vercel.com/line101chats-projects?repo=https://github.com/stevenscwu/line101chat-site
```

## Pages

- `/`
- `/ai-avatar`
- `/services`
- `/rag-chatbot`
- `/translation-chatbot`
- `/case-studies`
- `/case-studies/ntut-ifirst-rag`
- `/101recipe`
- `/pricing`
- `/book-demo`
- `/document-readiness-checklist`
- `/blog`
- `/blog/rag-chatbot-document-preparation`
- `/contact`
- `/line`
- `/translation-service`
- `/about`
- `/privacy`
- `/feiz` noindexed private shortcut for Zoho Mail access
- English equivalents under `/en`, for example `/en/services`, `/en/pricing`, `/en/book-demo`, and `/en/contact`

## Translation Bot Payments

The `/translation-service` page supports the Chinese ⇄ Indonesian LINE Translation Bot subscription flow:

- `POST /api/translation-payments/create`
- `GET /api/translation-payments/confirm`
- `POST /api/translation-payments/reconcile`
- Admin table at `/translation-service/admin`

Required LINE Pay environment variables:

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

Payment records are stored through the local file-backed store in `.data/translation-payments.json` during local development. For production billing, replace the store with a durable database or configure durable storage before accepting real payments.

## LINE AI Avatar

The starter persona is **Celine**, a clearly disclosed AI conversational
character with a young-adult feminine voice. She is warm, curious, natural,
thoughtful, and lightly playful without pretending to be human. Everyday
conversation and continuity are her primary role; LINE101Chat services, AI
avatars, and RAG are one area of expertise rather than the subject of every
conversation.

The App Router endpoints are:

```text
POST /api/line/avatar-webhook
POST /api/celine/chat
```

It verifies the LINE signature before parsing events, handles text messages,
supports deterministic mock replies and Ollama `/api/chat`, persists bounded
conversation history, and falls back safely when model generation fails.

Local development stores Celine memory in
`.data/celine-memory.json`. Raw LINE IDs are never stored: the server derives a
pseudonymous subject key with HMAC-SHA256 and `CELINE_MEMORY_SECRET`. Users can
send `你記得我什麼？` to inspect the profile summary and `忘記我` to delete
their stored conversation and preferences.

Vercel's filesystem is ephemeral, so durable production memory requires an
Upstash Redis integration. Without Upstash variables the deployed app keeps
only best-effort in-process memory and tells website users that memory is
temporary.

Required environment variables:

```text
LINE_AVATAR_CHANNEL_SECRET
LINE_AVATAR_CHANNEL_ACCESS_TOKEN
LLM_PROVIDER
OLLAMA_BASE_URL
OLLAMA_MODEL
OLLAMA_TIMEOUT_MS
AVATAR_NAME
AVATAR_OWNER_NAME
AVATAR_CONTACT_URL
AVATAR_SYSTEM_PROMPT
CELINE_MEMORY_SECRET
CELINE_MEMORY_FILE
CELINE_MEMORY_RETENTION_DAYS
CELINE_MEMORY_MAX_MESSAGES
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_LINE_AVATAR_QR_URL
NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL
```

Vercel cannot call a private Windows `localhost` Ollama server. When
`LLM_PROVIDER=ollama` in production, `OLLAMA_BASE_URL` must be an HTTPS endpoint
reachable from Vercel. Keep `LLM_PROVIDER=mock` until that endpoint is ready.

## Future Integrations

The contact form opens the visitor's email app with a prefilled message to `steven@line101chat.com` and provides a copy fallback. Beyond the LINE AI avatar webhook and existing local proxy/payment routes, the site has no general CRM, server-side email sender, booking system, or durable production database. Email hosting is expected to be managed in Zoho Mail Admin and DNS records in Vercel DNS.
