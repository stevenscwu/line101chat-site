# LINE101 Avatar Phase 1

Phase 1 is intentionally small. It proves that **Celine**, the LINE101Chat
reference avatar, can run as a deployable website demo and connect to a
dedicated LINE Messaging API channel.

## Phase 1 scope

- Website landing page: `GET /ai-avatar`
- One website demo flow: `POST /api/avatar/chat`
- Dedicated LINE webhook check: `GET/POST /api/line/avatar-webhook`
- Vercel preview deployment with `LLM_PROVIDER=mock`

Out of scope for Phase 1:

- Multi-avatar admin
- Vector database or embeddings
- Paid voice API
- Real-time video avatar
- CRM/email automation
- Translation payment changes
- 101recipe changes

## Main files

```text
src/app/ai-avatar/page.tsx
src/components/avatar/AvatarDemoChat.tsx
src/app/api/avatar/chat/route.ts
src/app/api/line/avatar-webhook/route.ts
src/lib/avatar/avatarEngine.ts
src/lib/avatar/persona.ts
src/lib/avatar/rag.ts
src/lib/avatar/llm.ts
src/lib/avatar/line.ts
content/avatar/knowledge/*.md
```

`POST /api/celine/chat` remains as a compatibility alias, but the public Phase
1 demo should use `POST /api/avatar/chat`.

## Local setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000/ai-avatar
```

Use mock mode first:

```env
LLM_PROVIDER=mock
```

Test the website chat API:

```powershell
$body = @{ message = "你是真人嗎？" } | ConvertTo-Json
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/api/avatar/chat `
  -ContentType "application/json" `
  -Body $body
```

## LINE check

The webhook route has two checks:

1. `GET /api/line/avatar-webhook` returns a public smoke-check response for
   deployment verification.
2. `POST /api/line/avatar-webhook` is the real LINE webhook. It verifies
   `x-line-signature` against the raw request body before parsing JSON.

Dedicated avatar channel variables:

```env
LINE_AVATAR_CHANNEL_SECRET=
LINE_AVATAR_CHANNEL_ACCESS_TOKEN=
NEXT_PUBLIC_LINE_AVATAR_QR_URL=
NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL=
```

Do not modify or reuse these existing channels for the avatar test:

- Business chatbot channel: `2007691019`
- iFIRST / NTUT demo channel: `2007782998`

LINE Developers setup:

1. Create or select the dedicated Celine LINE Official Account.
2. Enable Messaging API.
3. Set webhook URL to:

   ```text
   https://line101chat.com/api/line/avatar-webhook
   ```

4. Enable **Use webhook**.
5. Click **Verify** after Vercel deployment is ready.
6. Send a text message to confirm Celine replies.
7. Send a sticker/image to confirm the text-only fallback.
8. Send `連結網站` only as a smoke check for the existing link-code path.

## Vercel deployment

Required for Phase 1 preview:

```env
LLM_PROVIDER=mock
CELINE_MEMORY_SECRET=<long random value>
LINE_AVATAR_CHANNEL_SECRET=<dedicated avatar channel secret>
LINE_AVATAR_CHANNEL_ACCESS_TOKEN=<dedicated avatar channel token>
NEXT_PUBLIC_LINE_AVATAR_QR_URL=<public QR asset or URL>
NEXT_PUBLIC_LINE_AVATAR_ADD_FRIEND_URL=<LINE add-friend URL>
```

Optional for durable memory:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Deployment order:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Deploy a Vercel Preview.
4. Open `/ai-avatar`.
5. Call `POST /api/avatar/chat`.
6. Open `GET /api/line/avatar-webhook` to confirm the route is deployed.
7. Configure the LINE webhook to the preview or production URL.
8. Run LINE Developers webhook verification.
9. Promote to production only after the website demo and LINE check pass.

## Phase 1 test script

- Greeting: `你好`
- Identity boundary: `你是真人嗎？`
- Product answer: `LINE101Chat 的 AI 分身適合什麼情境？`
- Handoff: `我想做一個 LINE 客服 AI 分身，價格怎麼算？`
- Memory reset: `忘記我`

Expected behavior:

- Celine answers naturally.
- Direct human/AI questions receive a truthful answer.
- Product claims stay grounded in approved knowledge.
- Pricing questions do not invent exact AI avatar pricing.
- Commercial intent shows handoff CTAs.
- LINE invalid signatures return `401`.
- Missing LINE config returns `503` on POST, not a successful webhook.

## Security notes

- Never commit `.env`, LINE tokens, API keys, Vercel tokens, private keys, or
  tunnel credentials.
- Do not log tokens, signatures, raw LINE user IDs, or full message content.
- Keep `LLM_PROVIDER=mock` until a production model endpoint is ready.
- Production Ollama must use a protected HTTPS endpoint. Do not expose
  unauthenticated Ollama to the public internet.
