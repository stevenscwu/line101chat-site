# Daily Practice companion website

Japanese and English study desk for the Japanese Daily Android pilot. This replaces the unrelated LINE101Chat business site on the existing **line101chat-site** Vercel project and **line101chat.com** domain. The existing Next.js/npm architecture and lockfile are retained.

`C:\JPApp\companion-web` is the canonical source alongside the mobile app. `C:\line101chat-site` is the deployment checkout. Copy only companion source/configuration into that checkout; never restore legacy routes, content, business assets or API handlers. Previous working files are preserved outside either deployable source tree in an ignored recovery archive.

## Run and verify

Use Node 22 or later:

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
```

No credentials are required for file preparation, a browser-local library, JSON downloads or browser practice. Unsupported/missing TTS voices show an explicit message. Speech uses the browser provider and may require a network connection.

## Learning workflow

- Upload UTF-8 TXT, Markdown or lesson JSON, or paste a passage. PDF/Word/OCR extraction is not implemented; paste extracted text.
- Choose Japanese/English, review sentence boundaries, edit or split/join lines, add a title/level/topic and optional meanings.
- Save to a browser-local library (20 lessons / 1 MB), filter/search, listen and mark practice progress.
- Download compact schema-v3 JSON for Android 0.4.0+, or explicitly create a private transfer link.
- Libraries and progress are separate per browser/device. Transfers are snapshots, not automatic synchronization or an account backup.

Validation: 256 KB lesson JSON, 60,000 source characters, 1–200 lines, 1–300 Unicode characters per line. Optional translations are user-supplied. v1/v2 Japanese lesson files remain accepted. Cross-client fixtures live in the app repository's `examples/website-*-v3.json` and are imported by Dart tests.

## Private transfer configuration

Configure server-only variables from `.env.example` in the existing Vercel project:

| Variable | Purpose |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Existing **private** Vercel Blob store |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Durable atomic abuse limits; existing `KV_REST_API_URL`, `KV_REST_API_TOKEN` aliases work |
| `TRANSFER_SECRET` | Random HMAC secret, at least 32 characters; rotation invalidates existing links |
| `CRON_SECRET` | Separate random secret for the daily expired-transfer cleanup endpoint |

OIDC Blob credentials can instead use `BLOB_STORE_ID` and `VERCEL_OIDC_TOKEN`. Storage credentials stay on the server. Missing configuration disables transfers; there is no filesystem or memory persistence fallback in production. Existing unrelated cloud records are never read or deleted by this feature.

`POST /api/transfers` accepts `{lesson}` and returns `{token,url,expiresAt}`. `GET /api/transfers/[token]` returns `{lesson,expiresAt}`. `DELETE` revokes the link and deletes that object. Tokens are 256-bit random capabilities; their HMACs form private storage keys. The page URL carries the token in its fragment. Anyone with a token can read that lesson; this is not identity-based account authorization.

Access expires in 48 hours. `vercel.json` schedules authenticated `/api/transfers/cleanup` daily at 04:00 UTC; provision `CRON_SECRET` before deployment. Cleanup deletes only expired objects in `language-companion/transfers/v3/`. Expiry blocks access even if cleanup fails; it is not immediate physical erasure. Write limits: 10/hour/client and 500/day globally. Read limits: 60/minute/client and 10,000/day globally. Monitor usage before widening this public pilot.

After deployment, smoke-test a synthetic Japanese/English lesson through create → fetch → Android preview → revoke → unavailable. Verify old business pages/API routes/assets return 404, inspect mobile layout, and verify the cleanup invocation. Unit mocks do not prove live storage configuration or Android audio hardware.

## Deployment and provenance

Verified live on 2026-10-02 at https://line101chat.com. Final deployment:
`dpl_B4E1A2zCvdeKxYnB4ya2mojTaFdo` (Next.js 16.3.8). Validation passed: 35 unit/API
tests, lint/build, 12 browser workflow checks, 4 focused production-build browser
checks, and 13 live API/retired-route checks. Both actual synthetic language
transfers were created/read/revoked successfully. Full npm audit reported zero
advisories after compatible dependency patches. Physical Android audio/link-import
acceptance remains a device test; cross-client JSON fixtures passed Dart tests.

Deploy using the existing `.vercel/project.json` linkage; do not create a new hosting project. Retain the existing Git repository and Vercel domain. Credentials and `.vercel` are ignored. Source files are in Git; learner text, transfer links, browser profiles and APK binaries are not.

The thesis/NSTC research phase is documented in the app's `docs/research-roadmap.md`. This website does not invoke research agents, SAST scanners, model APIs or pronunciation scoring. Do not use learning material as a research dataset without a separate decision.
