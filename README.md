# LINE101 Studio Website

Premium bilingual (`zh-TW` + `en`) business website built with Next.js App Router, TypeScript, and Tailwind CSS for a Taiwan-based digital studio.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Locale routing with proxy-based redirects

## Local Development

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/` (auto-redirects by locale preference)
- `http://localhost:3000/zh-TW`
- `http://localhost:3000/en`

Production checks:

```bash
npm run lint
npm run build
```

## Project Structure

```text
src/
  app/
    [locale]/
      page.tsx
      services/
      work/
      process/
      pricing/
      about/
      contact/
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts
  components/
    forms/
    home/
    layout/
    navigation/
    shared/
  lib/
    i18n/
    seo.ts
  locales/
    zh-TW/
      ui.json
      home.json
      services.json
      pages.json
    en/
      ui.json
      home.json
      services.json
      pages.json
  proxy.ts
```

## Localization Architecture

- Route format: `/{locale}/...`
- Locales: `zh-TW` (default), `en`
- Root and non-localized routes are redirected via `src/proxy.ts`
- Language preference is persisted in `studio_locale` cookie
- Dictionaries are loaded from:
  - `src/locales/zh-TW/*.json`
  - `src/locales/en/*.json`

## SEO and Metadata

- Localized metadata per page (`title`, `description`, Open Graph)
- Canonical and language alternates generated via `createPageMetadata`
- `robots.ts` and `sitemap.ts` included

## Vercel Readiness

- Uses standard Next.js build output with no custom server.
- No non-default `vercel.json` is required.
- Ready for Vercel auto-detection (`Framework Preset: Next.js`).

## Notes for Expansion

- Content is centralized in locale JSON files for easy CMS migration later.
- Contact form is client-side with placeholder submission flow and ready for CRM/email API wiring.
- Work page is structured for future real case-study expansion.

See also:

- `CONTENT_GUIDE.md`
- `BRAND_GUIDE.md`
- `TODO_NEXT.md`
