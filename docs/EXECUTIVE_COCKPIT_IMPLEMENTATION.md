# Peak OS Executive Cockpit — website implementation

## Architecture found

LINE101Chat runs Next.js 16.3 on Vercel. The original `/peak` view receives a sanitized HMAC-signed
snapshot from the Windows Peak OS worker and stores it in private Vercel Blob. The browser has no
network path to the local SQLite database. This outbound synchronization design remains the
simplest reliable option because it opens no inbound Windows port and retains a last-known-good
view while the PC is unavailable.

## Implemented vertical slice

`/api/peak/v1/executive-state` accepts the signed Executive State 1.0 and exposes it only to an
authenticated owner. `/api/peak/v1/health` exposes minimal authenticated freshness metadata.
The legacy `/api/peak/v1/snapshot`, `/api/peak/v1/summary`, and `/peak` routes remain compatible;
the snapshot route also accepts Executive State during backend migration.

`/peak-os` is a protected responsive cockpit. It leads with today's status and highest-leverage
action, then shows domain evidence, meaningful changes, separate risks/opportunities, and agent
run drill-downs. Receipt age and source-generation age produce live, cached, stale, or offline
warnings. Missing evidence is displayed as unknown.

## Deployment verification

```powershell
cd C:\line101chat-site
npm run lint
npm test
npm run build
```

After deployment, initialize the durable password, synchronize one valid Executive State, and
verify `/api/peak/v1/health`, `/peak-os`, logout, and a second normal password login. Do not report
production success until these live checks complete.
