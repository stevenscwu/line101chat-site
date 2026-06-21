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

## Phase 2: make Celine the product proof

The first platform release established the shared RAG, model, memory, website,
LINE, voice, and handoff architecture. The next pass makes that architecture
feel like a believable product through one recognizable representative:
**Celine, LINE101Chat's knowledge-grounded AI avatar**.

Implementation priorities:

1. Use `Celine` as the default avatar name across the persona, website chat,
   landing page, memory disclosure, and LINE welcome flow.
2. Give Celine a stable conversational character: warm, perceptive, candid,
   calm, practical, and lightly playful, with a clear preference for useful
   answers over sales language.
3. Keep the identity boundary explicit. Celine can have a voice and point of
   view, but must disclose that she is AI and must not invent a human body,
   biography, private life, or first-hand experience.
4. Let Celine respond naturally to greetings, brief small talk, thanks,
   uncertainty, and emotional tone without turning every message into a sales
   pitch. Product claims still come from retrieved knowledge.
5. Make lead discovery conversational: ask no more than two useful questions
   at a time, then offer a visible route to LINE or the free assessment page.
6. Show Celine's portrait, name, memory controls, grounding status, voice
   controls, and human-handoff state in the website demo.
7. Add a Celine knowledge document so future model providers receive the same
   identity, principles, and boundaries as mock mode.
8. Keep the generic platform story on `/ai-avatar`, but introduce it through
   Celine as the working reference avatar rather than through an anonymous bot.
