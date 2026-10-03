# Daily Practice companion website

A Japanese and English study desk built with Next.js. Prepare learning material,
practice listening and speaking, and keep a browser-local library.

## Run and verify

Use Node 22 or later:

```sh
npm ci
npm run dev
npm run lint
npm test
npx tsc --noEmit
npm run build
```

No credentials are required for file preparation, a browser-local library, JSON
downloads, or browser practice. Unsupported or missing text-to-speech voices show
an explicit message. Speech uses the browser provider and may require a network
connection.

## Learning workflow

- Upload UTF-8 TXT, Markdown, or lesson JSON, or paste a passage.
- Choose Japanese or English, review sentence boundaries, edit or split/join
  lines, and add a title, level, topic, or optional meanings.
- Save to a browser-local library, filter/search, listen, and mark practice progress.
- Download schema-v3 lesson JSON, or explicitly create a private transfer link
  when the host has enabled transfers.

PDF, Word, and OCR extraction are not implemented; paste extracted text instead.
Browser-local libraries and progress are separate per browser/device. Transfer
links are snapshots rather than automatic synchronization or an account backup.
Anyone with a transfer link can access its lesson until the link expires or is
revoked.

## Private account preview

The `/account` interface supports managed sign-in for existing users, an isolated
private lesson library, explicit uploads and downloads, and storage-usage limits.
Browser-local lessons are never uploaded automatically. Account sessions and
fetched account lessons stay in memory and clear on reload or sign-out.

This test branch is intended for Vercel Preview only. Account routes return HTTP
503 until the deployment has all three non-secret configuration values:

- `ACCOUNT_BACKEND=supabase`
- `SUPABASE_URL`: the approved HTTPS Supabase project URL
- `SUPABASE_PUBLISHABLE_KEY`: an `sb_publishable_...` browser-safe key

Never configure a service-role key or database password as an account credential.
The backend schema and authorization policies must be provisioned separately
before account operations can work. Real two-account sign-in and cross-client
isolation checks remain a release gate; unit tests do not establish live
authentication or hosted database behavior.

## Transfer configuration

The optional transfer service requires a private Vercel Blob store and durable
Redis rate limiting. Configure server-only values from `.env.example`. Missing
configuration disables transfers; there is no filesystem or memory persistence
fallback in production. Never expose transfer credentials using `NEXT_PUBLIC_`.

`POST /api/transfers` accepts `{lesson}` and returns `{token,url,expiresAt}`.
`GET /api/transfers/[token]` retrieves the lesson. `DELETE` revokes its link.
Access expires after 48 hours. The authenticated cleanup route removes expired
objects; configure a separate `CRON_SECRET` before enabling scheduled cleanup.

Keep environment files, credentials, personal lessons, and transfer links out of
source control. Configure Preview separately from Production, and verify the
intended environment before enabling backend services.
