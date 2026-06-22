# LINE101 Avatar / LINE101 AI分身

LINE101Chat is evolving from a RAG-enabled LINE chatbot service into a
Knowledge-Grounded AI Avatar Platform.

Product positioning:

> Knowledge-grounded AI avatars for Taiwan’s LINE-first businesses.

The MVP turns approved knowledge and a defined persona into one reusable avatar
brain for website chat, LINE, optional browser voice interaction, lead capture,
human handoff, and future marketing-video avatars.

The default reference avatar is **Celine**, LINE101Chat's knowledge-grounded
virtual representative and product guide. Celine has a stable conversational
voice and product point of view. Ordinary conversation starts naturally rather
than with a repeated AI disclaimer; the interface identifies her as a virtual
representative, and direct questions about whether she is human or AI are
answered truthfully.

## Production routes

```text
https://line101chat.com/ai-avatar
https://line101chat.com/api/avatar/chat
https://line101chat.com/api/avatar/link
https://line101chat.com/api/line/avatar-webhook
```

`POST /api/celine/chat` remains as a compatibility alias for the earlier demo.

## Architecture

```text
Knowledge Base
  → lightweight RAG / retrieval
  → avatar persona and safety rules
  → mock, Ollama, or OpenAI-compatible LLM
  → website / LINE / future voice and video channels
  → lead capture and human handoff
```

Key modules:

```text
src/lib/avatar/types.ts
src/lib/avatar/persona.ts
src/lib/avatar/rag.ts
src/lib/avatar/lead.ts
src/lib/avatar/llm.ts
src/lib/avatar/line.ts
src/lib/avatar/avatarEngine.ts
```

The MVP knowledge pack is maintained in:

```text
content/avatar/knowledge/line101chat.md
content/avatar/knowledge/celine.md
content/avatar/knowledge/use-cases.md
content/avatar/knowledge/pricing-placeholder.md
content/avatar/knowledge/technical-process.md
```

The retrieval module performs lightweight keyword and topic matching. It is an
intentional extension point for embeddings or a vector database later.

## Local development

Install, create a private local environment file, and run Next.js:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000/ai-avatar
```

Test the website API:

```powershell
$body = @{ message = "RAG 是什麼？" } | ConvertTo-Json
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/api/avatar/chat `
  -ContentType "application/json" `
  -Body $body
```

### Mock mode

Mock mode is deterministic, requires no external model, and works on Vercel:

```env
LLM_PROVIDER=mock
```

Use mock mode for the first local test, Vercel preview, and LINE webhook
verification.

### Local Ollama mode

Configure:

```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma4:26b
OLLAMA_TIMEOUT_MS=45000
OLLAMA_API_KEY=
```

Then ensure the configured Ollama-compatible model is available and the server
is running. Model tags depend on the selected registry or private server.

### OpenAI-compatible mode

Configure:

```env
LLM_PROVIDER=openai-compatible
OPENAI_COMPATIBLE_BASE_URL=https://provider.example/v1
OPENAI_COMPATIBLE_API_KEY=
OPENAI_COMPATIBLE_MODEL=provider-model-name
```

The adapter calls `{OPENAI_COMPATIBLE_BASE_URL}/chat/completions`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `LLM_PROVIDER` | Yes | `mock`, `ollama`, or `openai-compatible`. |
| `LLM_TIMEOUT_MS` | Optional | Shared external-model timeout. |
| `OLLAMA_BASE_URL` | Ollama only | Local HTTP URL in development or protected HTTPS production URL. |
| `OLLAMA_MODEL` | Ollama only | Defaults to `gemma4:26b`. |
| `OLLAMA_API_KEY` | Optional | Bearer token for a protected hosted Ollama-compatible endpoint. |
| `LINE_AVATAR_CHANNEL_SECRET` | LINE only | Verifies the raw LINE webhook body. |
| `LINE_AVATAR_CHANNEL_ACCESS_TOKEN` | LINE only | Sends LINE replies. |
| `NEXT_PUBLIC_LINE_AVATAR_QR_URL` | Optional | Public QR image URL or asset path. |
| `NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL` | Optional | Public LINE add-friend URL. |
| `OPENAI_COMPATIBLE_BASE_URL` | Compatible provider only | Provider `/v1`-style base URL. |
| `OPENAI_COMPATIBLE_API_KEY` | Compatible provider only | Server-only provider key. |
| `OPENAI_COMPATIBLE_MODEL` | Compatible provider only | Provider model name. |
| `AVATAR_NAME` | Optional | Persona display name; defaults to `Celine`. |
| `AVATAR_OWNER_NAME` | Optional | Persona owner. |
| `AVATAR_CONTACT_URL` | Recommended | Human handoff destination. |
| `AVATAR_SYSTEM_PROMPT` | Optional | Owner-approved persona additions. |
| `CELINE_MEMORY_SECRET` | Production memory | Long random server-only HMAC and cookie-signing secret. |
| `CELINE_MEMORY_RETENTION_DAYS` | Optional | Defaults to 90 days. |
| `CELINE_MEMORY_MAX_MESSAGES` | Optional | Defaults to 40 messages. |
| `UPSTASH_REDIS_REST_URL` | Durable memory | Upstash Redis REST endpoint. |
| `UPSTASH_REDIS_REST_TOKEN` | Durable memory | Server-only Upstash Redis REST token. |

The avatar still answers when durable memory storage is unavailable. Local
development uses `.data/celine-memory.json`; a Vercel deployment without
Upstash falls back to ephemeral process memory.

## Celine identity and memory design

Celine is designed to feel like a consistent representative, not a disclaimer
generator:

- Her avatar card and chat footer identify her as a LINE101 virtual
  representative.
- Greetings and ordinary answers are natural and do not begin with an AI
  disclosure.
- If someone directly asks whether Celine is human or AI, she answers that she
  is an AI-powered virtual representative and not a human employee.
- She never invents a human age, body, family, biography, physical experience,
  or authority to make commitments for the team.

Memory identity works in three layers:

1. Website visitors receive a secure, HTTP-only random session cookie.
2. LINE conversations use the LINE user ID only as input to an HMAC. Raw LINE
   user IDs are not stored as database keys or logged.
3. In a one-to-one LINE chat, send `連結網站`. Celine returns a one-time,
   eight-character code valid for 10 minutes. Entering it on `/ai-avatar`
   merges the website memory into the pseudonymous LINE record and sets a
   signed HTTP-only person token.

The link code is consumed once. Users can ask `你記得我什麼？` for a summary
or send `忘記我` to delete the linked memory record.

## LINE Developers setup

Use a new or explicitly approved LINE Official Account / Messaging API channel.
Do not replace credentials or webhook configuration for:

- Business chatbot channel: `2007691019`
- iFIRST / NTUT demo channel: `2007782998`

Setup:

1. Create or select the dedicated LINE Official Account.
2. Enable the Messaging API.
3. Open its channel in LINE Developers.
4. Copy the channel secret to `LINE_AVATAR_CHANNEL_SECRET`.
5. Issue a channel access token and store it in
   `LINE_AVATAR_CHANNEL_ACCESS_TOKEN`.
6. Set the webhook URL:

   ```text
   https://line101chat.com/api/line/avatar-webhook
   ```

7. Enable **Use webhook**.
8. Click **Verify**.
9. Disable conflicting Official Account auto-replies if they would duplicate
   webhook answers.
10. Add the account QR URL and add-friend URL to the two `NEXT_PUBLIC_`
    variables and redeploy.

The route verifies `x-line-signature` against the raw request body before JSON
parsing, supports text messages, sends a polite fallback for unsupported
message types, and never logs tokens or full message contents.

## Vercel setup

1. Open the `line101chat-site` Vercel project.
2. Go to **Settings → Environment Variables**.
3. Add server secrets only to the environments that need them.
4. Add the two `NEXT_PUBLIC_` values for the public QR and add-friend CTA.
5. Keep `LLM_PROVIDER=mock` until an external production model endpoint is
   ready.
6. Deploy the GitHub feature branch and confirm the Preview Deployment.
7. Verify `/ai-avatar` and `POST /api/avatar/chat`.
8. Configure and verify the LINE webhook only after the preview or production
   URL is ready.

### Ollama production warning

Vercel cannot access the Windows workstation URL
`http://localhost:11434`. Production Ollama requires one of:

- a protected public HTTPS Ollama-compatible endpoint;
- a private server reachable through secure networking;
- a temporary secure tunnel for a controlled demo;
- a hosted OpenAI-compatible provider.

Do not expose an unauthenticated Ollama server directly to the public internet.

## Security

- Never commit `.env`, `.env.local`, LINE tokens, API keys, Vercel tokens,
  private keys, tunnels with embedded credentials, or local credentials.
- Verify the LINE signature against the raw body.
- Do not log tokens, signatures, full LINE user IDs, or full message content.
- Keep the virtual-representative label visible in the interface and answer
  direct human/AI identity questions truthfully.
- Do not claim that Celine is the founder, a human employee, or a specific real
  person, and do not invent a human biography.
- HMAC-pseudonymize LINE identity, sign website person tokens, expire link
  codes, and never log raw LINE user IDs.
- Do not invent pricing, customer claims, implementation results, or timelines.
- Medical, legal, and financial content is general information only and should
  be handed to qualified professionals.
- Ask users not to provide unnecessary sensitive information.

## Testing checklist

- [ ] `LLM_PROVIDER=mock` returns deterministic answers.
- [ ] `/ai-avatar` renders on mobile and desktop.
- [ ] Website chat sends to `/api/avatar/chat` and renders the reply.
- [ ] A greeting is natural and does not inject an identity or memory notice.
- [ ] A direct “你是真人嗎？” question receives a truthful concise answer.
- [ ] LINE `連結網站` creates a one-use code and `/api/avatar/link` consumes it.
- [ ] Linked website and LINE conversations load the same memory record.
- [ ] `忘記我` deletes linked memory and clears the website person cookie.
- [ ] Browser voice controls degrade gracefully when unsupported.
- [ ] Pricing questions return assessment-based placeholder language.
- [ ] Lead intent asks for project and contact details without storing them.
- [ ] LINE valid-signature webhook requests return HTTP 200.
- [ ] Invalid LINE signatures return HTTP 401.
- [ ] Unsupported LINE message types receive the text-only fallback.
- [ ] Model failures return the safe human-handoff message.
- [ ] Existing pages and existing chatbot demos still render.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Vercel Preview Deployment is Ready before production promotion.
