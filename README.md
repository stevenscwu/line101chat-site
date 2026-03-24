# Japanese After 50

Official website for `line101chat.com`  
Brand identity: `50後學日語 / 50+ 日本語修行中`

This project is a full rebrand from old chatbot-business positioning to a Japanese learning journey platform.

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Run

```bash
npm install
npm run dev
```

## Main Routes
- `/` 首頁
- `/dashboard` 儀表板
- `/learn` 學習路徑
- `/pronunciation` 發音練習
- `/vocabulary` 單字複習
- `/materials` 學習素材
- `/journal` 學習日誌
- `/social-ideas` 社群靈感
- `/achievements` 成就牆
- `/about` 關於計畫
- `/settings` 設定

## Content + Locale Architecture

- UI dictionaries:
  - `src/locales/zh-TW/ui.json`
  - `src/locales/zh-TW/brand.json`
  - `src/locales/zh-TW/pages.json`
  - `src/locales/ja-JP/ui.json`
  - `src/locales/ja-JP/brand.json`
- Learning content:
  - `src/content/phrases/restaurant.ts`
  - `src/content/vocab/unit-001.ts`
- Language and design docs:
  - `CONTENT_LANGUAGE_GUIDE.md`
  - `DESIGN.md`
  - `UI_COMPONENT_SPEC.md`
  - `SITE_MAP.md`
  - `CONTENT_STRATEGY.md`
