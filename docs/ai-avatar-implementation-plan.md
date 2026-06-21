# LINE101 AI 分身 MVP Implementation Plan

## Current project findings

- Framework: Next.js 16 App Router under `src/app`
- Language: TypeScript with strict type checking
- Styling: Tailwind CSS v4 plus the existing LINE101Chat emerald, slate, and white visual system
- Package manager: npm (`package-lock.json`)
- Homepage: composed from reusable sections in `src/components` and localized content in `src/data/site.ts`
- API routes: Next.js Route Handlers under `src/app/api`
- Deployment: Vercel project linked through `.vercel/project.json`; `vercel.json` uses `npm install` and `npm run build`
- Existing avatar foundation: `/ai-avatar`, Celine website chat, a dedicated avatar LINE webhook, persona/LLM/LINE/memory modules
- Existing LINE channels: the business and iFIRST channel identifiers remain in `src/data/site.ts`; their routes and credentials will not be changed

## Implementation approach

1. Reframe the existing Celine demo as the investor-facing `LINE101 Avatar / LINE101 AI分身` product while preserving the current site design and existing pages.
2. Add a shared avatar engine that composes persona, lightweight markdown retrieval, lead-intent handling, model generation, and channel-aware replies.
3. Add the canonical website endpoint at `/api/avatar/chat` and keep `/api/celine/chat` as a compatibility route.
4. Keep the dedicated `/api/line/avatar-webhook` endpoint, signature verification, and LINE reply module, but route replies through the same avatar engine used by the website.
5. Add markdown knowledge files and keyword-based retrieval with a clear future replacement point for embeddings or a vector database.
6. Support `mock`, `ollama`, and `openai-compatible` providers with timeouts and a safe handoff fallback.
7. Build a mobile-first `/ai-avatar` landing page with a working web chat, optional browser voice input/output, LINE QR/add-friend CTAs, target markets, use cases, architecture, technical credibility, and video-avatar roadmap.
8. Add the AI avatar product to homepage and navigation without removing the existing RAG knowledge-assistant positioning.
9. Update README, environment template, and operator documentation with local, LINE Developers, Vercel, security, and testing instructions.
10. Run lint, production build, API checks, browser verification, and a focused React/accessibility review before publishing only the in-scope files.

## Compatibility and security boundaries

- Do not modify or reuse credentials for LINE channel `2007691019` or `2007782998`.
- Do not commit `.env`, tokens, keys, Vercel credentials, LINE secrets, or local model credentials.
- Keep `LLM_PROVIDER=mock` as the deployment-safe default.
- Do not claim exact AI avatar pricing; use assessment-based pricing language.
- Do not implement a vector database, paid voice service, or real-time video engine in this MVP.
- Preserve the existing Celine memory layer as an optional enhancement, while keeping the core avatar platform modular and channel-independent.
