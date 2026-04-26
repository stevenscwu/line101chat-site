# LINE101 Chat Landing Page

A simple landing page for the LINE Indonesian ↔ Traditional Chinese translation chatbot at `https://line101chat.com/`.

The page explains the service, shows the “Add LINE Friend” QR code, and encourages users to add the LINE bot for quick daily conversation translation inside LINE.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/`.

Production checks:

```bash
npm run lint
npm run build
```

## Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts
public/
  line-qr.png
```

## QR Code

The LINE add-friend QR code lives at:

```text
public/line-qr.png
```

To update the QR code, replace that file and keep the same filename so the page continues to reference `/line-qr.png`.

The “Add on LINE” button URL is defined in `src/app/page.tsx` as `lineAddFriendUrl`.

## SEO

The root layout defines:

- Title: `LINE Indonesian Chinese Translator`
- Description: `A LINE chatbot for quick Indonesian and Traditional Chinese daily conversation translation.`
- Open Graph metadata for `https://line101chat.com/`
- `robots.ts` and `sitemap.ts`

## Deployment

The repository is deployed on Vercel. Vercel auto-detects the Next.js app and uses:

```bash
npm install
npm run build
```

The included `vercel.json` keeps the framework preset and build command explicit.
