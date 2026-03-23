# 50+ IT Man Learning Japanese - Creator Website

A Next.js site focused on this exact identity:

- Senior man learning Japanese
- 50+ IT background
- Building a brand-new social media presence
- Creating stable income to support family

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Chart.js via `react-chartjs-2`
- API Route scaffold for RAG-style creator coach demo

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Environment Variables

Create `.env.local` as needed:

```env
LLM_PROVIDER=placeholder
OPENAI_API_KEY=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_DEPLOYMENT=
```

## Project Structure

```text
app/
  api/chat/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  footer.tsx
  navbar.tsx
  theme-toggle.tsx
  sections/
    hero-section.tsx
    foundations-section.tsx
    thesis-section.tsx
    chatbot-section.tsx
    enterprise-section.tsx
    about-contact-section.tsx
  ui/
    reveal.tsx
    section.tsx
lib/
  ingest.ts
  llm.ts
  retrieval.ts
vercel.json
```

## Deployment

### Vercel

1. Push repository to GitHub.
2. Import project in Vercel.
3. Set environment variables in project settings.
4. Deploy with Next.js framework settings (or use the included `vercel.json`).

## Notes

- Chatbot backend currently uses placeholder retrieval and generation logic for demo.
- Replace `lib/retrieval.ts` with real vector search and `lib/llm.ts` with real OpenAI/Azure OpenAI integration when ready.
