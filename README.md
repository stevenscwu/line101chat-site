# LINE101Chat — Knowledge-Grounded AI Avatar Platform

LINE101Chat is evolving from a Taiwan-focused RAG LINE chatbot service into a
Knowledge-Grounded AI Avatar Platform for LINE-first businesses, schools,
consultants, stores, creators, and service teams.

The current investor-facing MVP is **LINE101 Avatar / LINE101 AI分身**:

- Celine as the named, knowledge-grounded reference avatar
- One knowledge-grounded avatar brain for website chat and LINE
- A natural persona with quiet profile-level transparency and truthful direct answers
- Friend-first conversation powered by Gemma, with product promotion only when contextually useful
- Pseudonymous memory with optional LINE-to-website identity linking
- Lightweight markdown RAG with a future vector-database extension point
- Mock, Ollama (`gemma4:26b`), and OpenAI-compatible model adapters
- Browser-native optional voice input and read-aloud
- Lead qualification and human handoff
- A future path to short-form video and real-time avatars

The existing RAG and LINE knowledge-assistant capabilities remain the
intelligence foundation:

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
- `/ai-avatar` investor-facing LINE101 Avatar product page with website chat,
  LINE integration, optional browser voice controls, and future video roadmap

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
OLLAMA_API_KEY=
```

The live Celine deployment can use the local `gemma4:26b` model through a
bearer-protected HTTPS proxy. Do not expose port `11434` directly. If the
temporary tunnel hostname changes, update `OLLAMA_BASE_URL` in Vercel and
redeploy; the application falls back to deterministic friend-first replies
while the model host is unavailable.

Test the avatar page and API:

```text
http://localhost:3000/ai-avatar
POST http://localhost:3000/api/avatar/chat
```

Full setup instructions are in
[`docs/line101-ai-avatar.md`](docs/line101-ai-avatar.md).

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

## LINE101 Avatar

Public routes:

```text
GET  /ai-avatar
POST /api/avatar/chat
POST /api/avatar/link
POST /api/line/avatar-webhook
```

The earlier `POST /api/celine/chat` route remains as a compatibility alias.
Website and LINE requests both call the same `generateAvatarReply` engine.

Required variables depend on the selected channel and model:

```text
LLM_PROVIDER
OLLAMA_BASE_URL
OLLAMA_MODEL
OLLAMA_API_KEY
LINE_AVATAR_CHANNEL_SECRET
LINE_AVATAR_CHANNEL_ACCESS_TOKEN
NEXT_PUBLIC_LINE_AVATAR_QR_URL
NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL
OPENAI_COMPATIBLE_BASE_URL
OPENAI_COMPATIBLE_API_KEY
OPENAI_COMPATIBLE_MODEL
CELINE_MEMORY_SECRET
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Use `LLM_PROVIDER=mock` for a deployment-safe deterministic demo. Vercel cannot
call a private Windows `localhost:11434`; production Ollama needs a protected
HTTPS endpoint, private server, secure tunnel, or hosted compatible provider.

For durable production memory, connect an Upstash Redis database and provide
the REST URL/token variables. LINE user IDs are HMAC-pseudonymized before they
are used as memory keys. A user can send `連結網站` to Celine on LINE, then
enter the one-time code on `/ai-avatar` to let the website continue the same
conversation. Codes expire after 10 minutes and are consumed once.

Never commit `.env`, LINE credentials, API keys, Vercel tokens, private keys, or
local credentials.

## Future Integrations

The contact form opens the visitor's email app with a prefilled message to `steven@line101chat.com` and provides a copy fallback. Beyond the optional Upstash-backed Celine memory, LINE AI avatar webhook, and existing local proxy/payment routes, the site has no general CRM, server-side email sender, or booking system. Email hosting is expected to be managed in Zoho Mail Admin and DNS records in Vercel DNS.

## Private Peak OS Dashboard

`/peak` is an owner-authenticated, dynamically rendered executive dashboard. It receives a
privacy-minimized snapshot through signed outbound synchronization from the local Peak OS worker;
it never opens the live SQLite database or exposes a Windows inbound port. The feature is disabled
by default and is not included in navigation or the sitemap. See
[`docs/peak-os-dashboard.md`](docs/peak-os-dashboard.md) for setup, security, testing, first login,
rotation, incident response, and rollback.
