# How It Works Section Handoff

Generated: 2026-05-27

## Summary

Added a new homepage section for LINE101Chat explaining how a LINE AI knowledge assistant is built in business-friendly language.

Customer-facing title:

`AI 知識助理是怎麼建立的？`

Internal label:

`How the Chatbot Works`

The section is designed for managers, schools, SMEs, service businesses, and potential clients who want to understand the technical process before trusting the service. It keeps the tone business-oriented and avoids turning the homepage into a developer article.

## Access

- Traditional Chinese homepage: `https://line101chat.com/`
- English homepage: `https://line101chat.com/en`
- Placement: after the homepage trust/maintenance section and before the Taiwan market trust section.
- There is no direct anchor yet, such as `/#how-it-works`. Add a stable section `id` if future navigation or campaign links need to jump directly to this section.

## Implemented Files

- `src/components/how-it-works-section.tsx`
  - Reusable `HowItWorksSection` component.
  - Includes a responsive process diagram, six step cards, trust note, and CTA.
  - Desktop diagram is horizontal; mobile stacks vertically.

- `src/app/page.tsx`
  - Imports and renders `HowItWorksSection`.
  - Current placement is immediately after `DataConfidentialitySection`.

- `src/data/site.ts`
  - Traditional Chinese content lives under:
    - `siteContent.zh.pages.home.howItWorks`
  - English content lives under:
    - `siteContent.en.pages.home.howItWorks`
  - CTA currently links to:
    - `/free-assessment`

## Content Intent

The section explains:

1. 整理文件
2. 建立知識庫
3. 接上 LINE 入口
4. 根據來源回答
5. 權限與資料邊界
6. 測試、修正與維護

The trust message to preserve:

`重點不是讓 AI 自由發揮，而是讓 AI 在指定文件與權限範圍內回答。這樣才能兼顧速度、可追溯性與資料安全。`

The section should continue to emphasize source-grounded answers, permission boundaries, maintainability, and practical business value. Do not claim perfect accuracy or expose implementation secrets.

## Deployment Record

Code commit:

- `4f8dc11 Add homepage AI assistant build process section`
- `https://github.com/stevenscwu/line101chat-site/commit/4f8dc11`

Vercel production deployment:

- Deployment ID: `dpl_4SaHroYu65e5cEFXQxmui3FaLAZq`
- Deployment URL: `https://line101chat-site-5pwlzhste-line101chats-projects.vercel.app`
- Production alias: `https://line101chat.com`
- Status: Ready
- Created: 2026-05-27 09:49:49 Taiwan time

Verification completed:

- `npm run lint`
- `npm run build`
- Live Traditional Chinese homepage contains the section title, flow heading, and CTA.
- Live English homepage contains the English title, flow heading, and CTA.

## Future Development Notes

- If direct access is needed, add `id="how-it-works"` to the section and optionally add links from navigation or campaign pages.
- Keep copy edits in `src/data/site.ts` instead of scattering text through the component.
- Keep the CTA conversion-oriented. The current button text is `用一份文件試做 Demo`.
- Keep the content business-friendly. Use technical terms only when they help, such as `RAG / 向量搜尋`.
- Do not expose API keys, passcodes, private file paths, tunnel URLs, or private LINE channel credentials in this section.
- Do not promise `100% accurate`, `完全不會出錯`, or similar guarantees.
- If adding screenshots or diagrams later, avoid private admin screens, credentials, or internal logs.

