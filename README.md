# Daily Practice companion website

A Japanese learning study desk built with Next.js. Prepare learning material,
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

The `/account` interface supports managed sign-in, learner signup, email confirmation,
and email password recovery, plus an isolated
private lesson library, explicit uploads and downloads, and storage-usage limits.
Browser-local lessons are never uploaded automatically. Account sessions and
fetched account lessons stay in memory and clear on reload or sign-out.

Account routes return HTTP 503 until the deployment has all three non-secret
configuration values:

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

## Learner signup and recovery

- `/account/signup`: email/password signup and confirmation resend.
- `/account/recover`: request a password reset email with a generic response.
- `/account/auth-return`: verifies the managed Auth callback, confirms signup or
  accepts a new password, then directs the learner to sign in explicitly.
- New-password forms require 12–256 characters. Provider checks still apply.
- Callback tokens and sessions stay in isolated memory; the callback strips its
  URL fragment before contacting Auth. No application tables store passwords.
- Production callbacks are fixed to `https://line101chat.com/account/auth-return`.
  Other deployment origins fail closed unless deliberately added to the code
  and the provider redirect allowlist in a reviewed change. Local HTTP test
  origins are supported for development.

Before opening registration beyond project-team testing, configure an approved
SMTP service and verify delivery to an authorized learner address. Supabase’s
default SMTP restricts delivery to project-team addresses and has a low sending
limit. A successful unit test or generic form response does not establish email
delivery. See the [official SMTP guide](https://supabase.com/docs/guides/auth/auth-smtp)
and [password Auth guide](https://supabase.com/docs/guides/auth/passwords).

No real email or password-reset operation runs in the test suite. These tests
exercise the real SDK against mocked transport plus DOM interaction and lifecycle
checks. A learner must privately enter their own password for live acceptance.
