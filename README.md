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
- `/pricing`
- `/contact`
- `/line`
- `/about`
- `/privacy`
- `/mail` noindexed internal shortcut for Zoho Mail access

## Future Integrations

The contact form opens the visitor's email app with a prefilled message to `service@line101chat.com` and provides a copy fallback. The site has no backend, database, CRM, server-side email sender, booking system, or LINE official account API integration. Email hosting is expected to be managed in Zoho Mail Admin and DNS records in Vercel DNS.
