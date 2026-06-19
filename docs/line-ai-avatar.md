# LINE AI Avatar Setup

This feature adds **Celine**, LINE101Chat's AI avatar and business knowledge
guide, plus a dedicated product page and LINE Messaging API webhook.

Production routes:

```text
https://line101chat.com/ai-avatar
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
  → avatar persona and safety rules
  → mock or Ollama LLM adapter
  → LINE reply API
  → real-person handoff when needed
```

The MVP is stateless. The adapter accepts conversation history so a database or
memory service can be added later without changing the webhook contract.

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
```

The adapter calls Ollama `/api/chat`, uses an eight-second timeout, and returns a
safe LINE handoff reply if generation fails.

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
| `AVATAR_NAME` | Recommended | Defaults to `Celine`. |
| `AVATAR_OWNER_NAME` | Recommended | Defaults to `LINE101Chat`. |
| `AVATAR_CONTACT_URL` | Recommended | Real-person handoff URL. |
| `AVATAR_SYSTEM_PROMPT` | Optional | Additional owner-approved persona rules. |
| `NEXT_PUBLIC_LINE_AVATAR_QR_URL` | Optional | Public QR image URL or site asset path. |
| `NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL` | Optional | Public LINE add-friend URL used by CTAs. |

The starter persona is Celine: professional, warm, careful, calm, practical,
Traditional Chinese-first, and gently curious. She identifies herself as an AI,
does not invent a human biography, and routes quotations, custom projects,
cooperation, and technical setup questions to the real team.

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
5. Push the Git branch and confirm that the GitHub-connected Preview Deployment
   passes.
6. Merge or deploy to Production.
7. Confirm:

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
- Do not reuse or overwrite the two existing chatbot channel credentials.
- Do not let the avatar claim to be the real person.
- Route medical, legal, financial, quotation, cooperation, and formal
  commitment questions to an appropriate professional or real team member.
- Protect any public Ollama endpoint with HTTPS and access controls.

## Test Checklist

- [ ] `LLM_PROVIDER=mock` returns a deterministic reply.
- [ ] LINE Developers webhook verification succeeds.
- [ ] A text message receives a LINE reply.
- [ ] Adding the account as a friend receives Celine's AI identity greeting.
- [ ] An image, sticker, audio, or other unsupported message receives the
      polite text-only MVP fallback.
- [ ] A model timeout or model error receives the safe handoff reply.
- [ ] Invalid signatures return HTTP 401.
- [ ] `/ai-avatar` renders correctly on mobile and desktop.
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
src/lib/avatar/types.ts
src/app/api/line/avatar-webhook/route.ts
```

Future additions can provide conversation memory, customer-specific persona
records, RAG retrieval, CRM lead capture, voice messages, or animated-avatar
presentation without changing the existing LINE signature and reply modules.
