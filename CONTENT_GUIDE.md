# CONTENT GUIDE

This project keeps all marketing copy in locale JSON files.

## Where to Edit Copy

## Core locale files

- `src/locales/zh-TW/ui.json`
- `src/locales/zh-TW/home.json`
- `src/locales/zh-TW/services.json`
- `src/locales/zh-TW/pages.json`
- `src/locales/en/ui.json`
- `src/locales/en/home.json`
- `src/locales/en/services.json`
- `src/locales/en/pages.json`

## File responsibilities

- `ui.json`
  - Header navigation
  - Footer labels
  - Shared button text
  - Contact form labels/options/messages
- `home.json`
  - Homepage hero
  - Service panels
  - Why Us, Process, Showcase, Pricing preview
  - About snapshot + Final CTA
- `services.json`
  - Services overview page
  - 3 detailed service pages (`websites`, `rag-chatbots`, `apps`)
- `pages.json`
  - Work, Process, Pricing, About, Contact page content
  - Metadata titles/descriptions for these pages

## Editing Workflow

1. Update `zh-TW` and `en` in parallel for the same key path.
2. Keep key names unchanged unless also updating component usage.
3. Run:

```bash
npm run lint
npm run build
```

4. Verify:
- `/zh-TW` copy reads naturally for Taiwan business audiences.
- `/en` copy feels polished for international visitors.

## Content Quality Rules

- Keep tone premium, concise, calm, and credible.
- Avoid aggressive sales language.
- Avoid long paragraphs; prefer short, intentional blocks.
- Keep placeholders clearly labeled for concept/demo work until real cases exist.

## Future CMS Migration

Current JSON key namespaces are already split by domain (`ui`, `home`, `services`, `pages`) to map directly to future CMS collections.
