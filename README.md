# AI-Augmented DevSecOps Thesis Website

Professional research website for the thesis:

**AI-Augmented DevSecOps: Integrating SonarQube and GPT-4.1 for Intelligent Vulnerability Triage**

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Chart.js via react-chartjs-2
- API Route scaffold for RAG chatbot demo

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
```

## Deployment

### Vercel

1. Push repository to GitHub.
2. Import project in Vercel.
3. Set environment variables in project settings.
4. Deploy using default Next.js build configuration.

### Azure Static Web Apps

1. Create Azure Static Web App linked to your GitHub repo.
2. Set app location to `/` and output location to `.next` for Next.js workflow support.
3. Configure environment variables in Azure portal.
4. Use Azure-managed workflow to build and deploy on push.

## Notes

- Chatbot backend currently uses a placeholder retrieval and generation pipeline for demonstration.
- Replace `lib/retrieval.ts` with real vector DB integration and `lib/llm.ts` with Azure OpenAI/OpenAI client logic.
