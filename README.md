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
- `/services`
- `/rag-chatbot`
- `/translation-chatbot`
- `/case-studies`
- `/case-studies/ntut-ifirst-rag`
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

## Future Integrations

The contact form opens the visitor's email app with a prefilled message to `steven@line101chat.com` and provides a copy fallback. The site has no backend, database, CRM, server-side email sender, booking system, or LINE official account API integration. Email hosting is expected to be managed in Zoho Mail Admin and DNS records in Vercel DNS.
