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

For a first deployment, configure and deploy the bootstrap verifier, then run
`scripts/Initialize-PeakDashboardPassword.ps1`. Initialization is create-only and cannot replace
an existing durable verifier.

For every routine change or recovery, run:

```powershell
cd C:\line101chat-site
.\scripts\Set-PeakDashboardPassword.ps1
```

The script asks for the new password twice, creates a short-lived signed recovery session from the
trusted Peak OS computer, updates the durable verifier, waits for server-side read-back
verification, and only then synchronizes the DPAPI-protected local credential. It does not update
the Vercel bootstrap variable and does not require a redeployment.

Alternatively, `scripts/Open-PeakDashboard.ps1 -Destination '/peak/password'` opens a two-minute,
single-use recovery session in the local browser. Enter the desired password twice on that page.
Then test login, navigation, logout, and login again.

The UI distinguishes invalid credentials, missing server configuration, a temporary server/store
failure, rate limiting, and an expired session without disclosing internal details.
