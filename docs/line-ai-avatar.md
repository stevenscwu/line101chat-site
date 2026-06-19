# LINE AI Avatar Setup

This feature adds **Celine**, a clearly disclosed AI conversational persona
with a young-adult feminine voice, plus website chat, privacy-controlled memory,
and a LINE Messaging API webhook.

Production routes:

```text
https://line101chat.com/ai-avatar
https://line101chat.com/api/celine/chat
https://line101chat.com/api/line/avatar-webhook
```

Celine's current public LINE account information:

```text
Display name: AICeline
Basic ID: @821jpehj
Add friend: https://line.me/R/ti/p/%40821jpehj
Website QR asset: /celine-line-qr.png
```

Use a new or explicitly approved LINE Official Account / Messaging API channel
for this avatar. Do not replace the webhook or credentials for the existing
LINE101Chat business chatbot (`2007691019`) or iFIRST / NTUT demo
(`2007782998`).

## Architecture

```text
LINE user
  → LINE Messaging API webhook
  → signature verification
  → HMAC-pseudonymous identity and bounded memory
  → Celine persona and safety rules
  → mock or Ollama LLM adapter
  → LINE reply API
  → real-person handoff when needed
```

Website users follow the same flow through `/api/celine/chat`, using an
HTTP-only cookie as the external session identifier.

The memory layer supports:

- local atomic JSON storage at `.data/celine-memory.json`;
- durable Upstash Redis storage on Vercel;
- HMAC-SHA256 pseudonymous subject IDs instead of raw LINE IDs;
- bounded messages and configurable retention;
- simple extraction of user-stated name, interests, and explicit preferences;
- `你記得我什麼？` / `what do you remember about me`;
- `忘記我` / `forget me` deletion.

## Local Development

Install dependencies and create a local environment file:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000/ai-avatar
```

`.env.local` is ignored by Git. Never commit channel secrets, access tokens,
private keys, tunnels with embedded credentials, or private server passwords.

### Mock Mode

Mock mode returns deterministic Traditional Chinese or English demo responses
and does not call an external model:

```env
LLM_PROVIDER=mock
```

Use this mode first for LINE webhook verification and MVP demonstrations.

### Local Ollama Mode

Start Ollama and make sure the configured model is available:

```powershell
ollama pull gemma4:26b
ollama serve
```

Configure:

```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma4:26b
OLLAMA_TIMEOUT_MS=45000
CELINE_MEMORY_SECRET=replace-with-a-long-random-local-value
```

The adapter calls Ollama `/api/chat`, uses a configurable timeout (45 seconds by
default, capped at 55 seconds), includes
recent memory and user-stated preferences, and returns a safe reply if
generation fails.

Model tags depend on the Ollama registry or private model server. If
`gemma4:26b` is not available on the selected endpoint, publish or select the
correct compatible tag and update `OLLAMA_MODEL`.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `LINE_AVATAR_CHANNEL_SECRET` | Yes | Verifies the `x-line-signature` header. |
| `LINE_AVATAR_CHANNEL_ACCESS_TOKEN` | Yes | Sends replies through the LINE Messaging API. |
| `LLM_PROVIDER` | Yes | `mock` or `ollama`. Defaults to `mock`. |
| `OLLAMA_BASE_URL` | Ollama only | Local HTTP URL in development; public HTTPS URL in production. |
| `OLLAMA_MODEL` | Ollama only | Defaults to `gemma4:26b`. |
| `OLLAMA_TIMEOUT_MS` | Ollama only | Defaults to 45,000 ms; local 26B models may need a longer first response. |
| `AVATAR_NAME` | Recommended | Defaults to `Celine`. |
| `AVATAR_OWNER_NAME` | Recommended | Defaults to `LINE101Chat`. |
| `AVATAR_CONTACT_URL` | Recommended | Real-person handoff URL. |
| `AVATAR_SYSTEM_PROMPT` | Optional | Additional owner-approved persona rules. |
| `CELINE_MEMORY_SECRET` | Production: Yes | HMAC key used to pseudonymize LINE IDs and web session IDs. |
| `CELINE_MEMORY_FILE` | Local only | Local file database path. Defaults to `.data/celine-memory.json`. |
| `CELINE_MEMORY_RETENTION_DAYS` | Optional | Defaults to 90 days. |
| `CELINE_MEMORY_MAX_MESSAGES` | Optional | Defaults to the latest 40 messages per person. |
| `UPSTASH_REDIS_REST_URL` | Vercel memory | Durable Redis REST endpoint. |
| `UPSTASH_REDIS_REST_TOKEN` | Vercel memory | Server-only Redis REST token. |
| `NEXT_PUBLIC_LINE_AVATAR_QR_URL` | Optional | Public QR image URL or site asset path. |
| `NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL` | Optional | Public LINE add-friend URL used by CTAs. |

The starter persona is Celine: warm, intelligent, curious, natural, opinionated,
lightly playful, and Traditional Chinese-first. Her writing resembles a young
Taiwanese adult woman's conversational style, but she identifies herself as AI
and does not invent a human age, body, biography, private life, or lived
experience. She does not force business promotion into unrelated conversations.

The built-in public business knowledge pack is maintained in:

```text
src/lib/avatar/knowledge.ts
```

It supports useful deterministic replies even in `LLM_PROVIDER=mock` mode and
is included in the system context when Ollama mode is enabled. It covers public
LINE101Chat service information only; it is not a replacement for a
customer-specific production RAG index.

## LINE Developers Setup

1. Create or select a dedicated LINE Official Account.
2. Enable the Messaging API for that account.
3. In LINE Developers, open the Messaging API channel.
4. Copy the channel secret into `LINE_AVATAR_CHANNEL_SECRET`.
5. Issue a channel access token and store it in
   `LINE_AVATAR_CHANNEL_ACCESS_TOKEN`.
6. Set the webhook URL to:

   ```text
   https://line101chat.com/api/line/avatar-webhook
   ```

7. Enable **Use webhook**.
8. Click **Verify** and confirm that LINE reports success.
9. Disable conflicting LINE Official Account auto-replies if they would answer
   the same messages twice.
10. Add the account QR image and add-friend URL to the two public environment
    variables, then redeploy the website.

LINE webhook verification sends a signed POST request with an empty event list.
The route returns HTTP 200 after the signature is verified.

## Vercel Setup

1. Open the `line101chat-site` project in the
   `line101chats-projects` Vercel team.
2. Go to **Settings → Environment Variables**.
3. Add the variables from `.env.example` to Preview and Production as needed.
4. Keep secrets server-only. Only the two `NEXT_PUBLIC_` values are exposed to
   the browser.
5. In **Vercel Marketplace**, add **Upstash Redis**, create or select a
   database, and link it to the site project. Confirm that
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are available.
6. Add a long random `CELINE_MEMORY_SECRET`; do not reuse a LINE secret or
   access token.
7. Push the Git branch and confirm that the GitHub-connected Preview Deployment
   passes.
8. Merge or deploy to Production.
9. Confirm:

   ```text
   https://line101chat.com/ai-avatar
   https://line101chat.com/api/line/avatar-webhook
   ```

### Production Ollama Constraint

Vercel cannot call `http://localhost:11434` on a Windows workstation. Production
must use an Ollama-compatible endpoint that:

- is reachable from Vercel;
- uses HTTPS;
- has appropriate authentication or network controls;
- does not expose an unauthenticated model server directly to the public
  internet.

Possible deployment patterns include a secured tunnel for a temporary demo, a
private server with an HTTPS reverse proxy, or a hosted Ollama-compatible
service. The current adapter intentionally rejects non-HTTPS Ollama URLs when
`NODE_ENV=production`.

If a secure endpoint is not ready, deploy with:

```env
LLM_PROVIDER=mock
```

## Security Checklist

- Verify every webhook request with `LINE_AVATAR_CHANNEL_SECRET`.
- Verify the raw request body before JSON parsing.
- Keep channel secrets and access tokens out of Git and browser bundles.
- Do not commit `.env.local` or any real `.env` file.
- Do not log tokens, signatures, full user IDs, or full message content.
- Do not store raw LINE user IDs; only store HMAC-derived subject IDs.
- Keep memory bounded and delete it when the user sends `忘記我`.
- Do not ask users to send passwords, tokens, credit cards, or unnecessary
  sensitive information.
- Do not reuse or overwrite the two existing chatbot channel credentials.
- Do not let the avatar claim to be the real person.
- Route medical, legal, financial, quotation, cooperation, and formal
  commitment questions to an appropriate professional or real team member.
- Protect any public Ollama endpoint with HTTPS and access controls.

## Test Checklist

- [ ] `LLM_PROVIDER=mock` returns a deterministic reply.
- [ ] LINE Developers webhook verification succeeds.
- [ ] A text message receives a LINE reply.
- [ ] The same LINE user receives a context-aware reply on a later message.
- [ ] `你記得我什麼？` reports only a concise profile summary.
- [ ] `忘記我` deletes the user's conversation and preferences.
- [ ] Adding the account as a friend receives Celine's AI identity greeting.
- [ ] An image, sticker, audio, or other unsupported message receives the
      polite text-only MVP fallback.
- [ ] A model timeout or model error receives the safe handoff reply.
- [ ] Invalid signatures return HTTP 401.
- [ ] `/ai-avatar` renders correctly on mobile and desktop.
- [ ] Website chat at `/ai-avatar` receives a live API reply.
- [ ] A second website message uses the same HTTP-only session memory.
- [ ] Upstash is linked before claiming durable production memory.
- [ ] QR and add-friend CTAs use the configured public values.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] The Vercel Preview Deployment is Ready before production promotion.

## Extension Points

The code is split into:

```text
src/lib/avatar/persona.ts
src/lib/avatar/llm.ts
src/lib/avatar/line.ts
src/lib/avatar/memory.ts
src/lib/avatar/types.ts
src/app/api/celine/chat/route.ts
src/app/api/line/avatar-webhook/route.ts
```

Future additions can provide richer profile summaries, vector memory,
customer-specific persona records, RAG retrieval, voice messages, or
animated-avatar presentation without changing the existing LINE signature and
reply modules.
