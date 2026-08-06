# Peak OS dashboard authentication

## Diagnosis

The prototype had three competing password sources: a local DPAPI credential, a Vercel
environment verifier, and an optional private-Blob override. The live private store did not have
the override record, so login continued to use the deployment-time environment verifier. Editing
the local credential could never change the website. The original automated test used process
memory and therefore did not test production persistence.

## Current authority

`PEAK_DASHBOARD_PASSWORD_HASH` is a bootstrap verifier. When
`peak/security/owner-password.json` exists in private Vercel Blob, that durable record is the only
accepted verifier. Invalid JSON, an invalid verifier, or an unreadable store fails closed. It never
silently falls back. Password updates are accepted only from an active owner session and are read
back and verified before the API returns success.

The browser receives no password hash, session secret, synchronization secret, or Blob token.
Sessions are HMAC-signed for eight hours and stored in a production-`Secure`, HTTP-only,
`SameSite=Strict` cookie. Logout expires that cookie. State-changing browser routes require a
same-origin request.

## Required server-only variables

```dotenv
PEAK_DASHBOARD_ENABLED=true
PEAK_DASHBOARD_OWNER_EMAILS=owner@example.com
PEAK_DASHBOARD_PASSWORD_HASH=pbkdf2-sha512$310000$...
PEAK_DASHBOARD_SESSION_SECRET=<at-least-32-random-characters>
PEAK_DASHBOARD_SYNC_SECRET=<different-at-least-32-character-secret>
PEAK_DASHBOARD_STALE_AFTER_MINUTES=30
```

Vercel supplies `BLOB_READ_WRITE_TOKEN` for the connected private store. None of these variables
may use a `NEXT_PUBLIC_` prefix.

## Safe setup and recovery

1. Run `scripts/Set-PeakDashboardPassword.ps1` in an interactive protected console.
2. Deploy so the bootstrap verifier is present in the new production deployment.
3. Run `scripts/Initialize-PeakDashboardPassword.ps1`. It imports the DPAPI credential in memory,
   sends only a signed encoded verifier, and can initialize only an absent durable record.
4. Test correct login, incorrect login, navigation, logout, and a second login.
5. For routine changes, authenticate once (the local one-time link is supported), open
   `/peak/password`, and update the durable password.

The UI distinguishes invalid credentials, missing server configuration, a temporary server/store
failure, rate limiting, and an expired session without disclosing internal details.
