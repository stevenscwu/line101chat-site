# Peak OS Executive Cockpit — website implementation

## Architecture

LINE101Chat runs Next.js on Vercel. The Windows Peak OS worker sends a minimized, HMAC-signed
Executive State 2.0 to a server-only route. The website stores one last-known-good record in
private Vercel Blob. The browser has no path to local SQLite, Telegram credentials, or a Windows
inbound port.

## Implemented vertical slice

`POST /api/peak/v1/executive-state` accepts only the complete 2.0 contract. Authenticated owner
sessions can read that same record with `GET`. `/peak-os` renders the Portfolio Chief, today's
highest-leverage action, research, Japanese, business, system operations, changes, opportunities,
and evidence limitations without independently ranking them.

The old data contract and compatibility endpoints are absent. `/peak` is a route-only redirect to
`/peak-os`; it has no data loader or independent view. Receipt age and source-generation age
produce live, cached, stale, or offline warnings.

Owner authentication, password administration, replay protection, and rate limiting retain their
separate private Blob records. The Executive State data record uses the versioned path
`peak/executive/v2/latest.json`.

## Deployment verification

```powershell
npm ci
npm run lint
npm test
npm run build
```

Deploy this website contract before enabling a Peak OS worker that sends schema 2.0. Retain the
existing server-only dashboard, session, login, synchronization, and Blob configuration. After
deployment:

1. Confirm unauthenticated cockpit reads redirect to login and API reads return 401.
2. Request `/peak_login` in the authorized private Telegram chat and verify one successful,
   single-use, read-only cockpit session.
3. Send one valid signed Executive State 2.0 and verify both authenticated API read-back and
   `/peak-os` rendering.
4. Confirm a replayed nonce and a schema 1.0 or extra-field payload are rejected.
5. Verify `/peak` redirects to `/peak-os`, logout works, and password login remains an emergency
   administrative fallback.

Do not report production success until these live checks pass.
