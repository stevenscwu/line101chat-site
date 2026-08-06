import { afterEach, describe, expect, it } from "vitest";
import { createHmac, randomBytes } from "node:crypto";
import { NextRequest } from "next/server";

import sitemap from "@/app/sitemap";
import { POST as ingestSnapshot } from "@/app/api/peak/v1/snapshot/route";
import { GET as readSummary } from "@/app/api/peak/v1/summary/route";
import { POST as localLogin } from "@/app/api/peak/v1/local-login/route";
import { POST as updatePassword } from "@/app/api/peak/v1/password/route";
import { POST as passwordLogin } from "@/app/api/peak/v1/login/route";
import { POST as passwordLogout } from "@/app/api/peak/v1/logout/route";
import { GET as executiveHealth } from "@/app/api/peak/v1/health/route";
import { GET as readExecutive, POST as ingestExecutive } from "@/app/api/peak/v1/executive-state/route";
import { POST as bootstrapPassword } from "@/app/api/peak/v1/password/bootstrap/route";
import {
  PEAK_SESSION_COOKIE,
  createPasswordHash,
  createSession,
  inspectSession,
  loginAttemptKey,
  verifyPassword,
  verifySubmittedPassword,
  verifySession,
} from "@/lib/peak/auth";
import { getSingleOwnerEmail, hasPeakPrivateBlobConfig } from "@/lib/peak/config";
import { createLocalLoginToken } from "@/lib/peak/local-login";
import { parseExecutiveState } from "@/lib/peak/executive-validation";
import { allowAttempt, resetPeakStoreForTests, resolveOwnerPasswordState } from "@/lib/peak/store";
import { parsePeakSnapshot } from "@/lib/peak/validation";

const original = { ...process.env };

afterEach(() => {
  process.env = { ...original };
  resetPeakStoreForTests();
});

function configureAuth() {
  process.env.PEAK_DASHBOARD_ENABLED = "true";
  process.env.PEAK_DASHBOARD_OWNER_EMAILS = "owner@example.com";
  process.env.PEAK_DASHBOARD_SESSION_SECRET = "s".repeat(64);
  process.env.PEAK_DASHBOARD_PASSWORD_HASH = createPasswordHash("correct horse battery staple");
}

function executiveState() {
  const evidence = { source: "Peak OS", summary: "No current evidence", status: "missing", observed_at: null, record_id: null };
  const domain = { status: "unknown", score: null, summary: "No current evidence.", evidence: [evidence], last_successful_activity_at: null, warnings: [], next_action: "Collect current evidence." };
  return {
    schema_version: "1.0",
    state_hash: "a".repeat(64),
    generated_at: "2026-08-06T01:00:00Z",
    timezone: "Asia/Taipei",
    overall: { score: null, status: "unknown", summary: "Current state is incomplete." },
    health: { ...domain, risk_flags: [], recommendation: "Complete a check-in before changing workload." },
    research: { ...domain, current_focus: "Dissertation", progress: [], blockers: [], last_successful_run: null },
    japanese: { ...domain, recent_activity: [] },
    business: { ...domain, opportunities: [] },
    system: { ...domain, agents: [{ name: "Research PM", state: "scheduled_not_run", last_scheduled_run: "2026-08-06T00:00:00Z", last_actual_run: null, last_success: null, duration_seconds: null, latest_result: "Awaiting run.", failure_reason: null, next_scheduled_run: "2026-08-06T06:00:00Z" }], audits: [{ audit_id: "research-20260806", status: "scheduled", scheduled_for: "2026-08-06T06:00:00Z", completed_at: null }], failures: [] },
    today: { primary_focus: "Dissertation evidence", rationale: "Highest strategic priority.", estimated_effort_minutes: null, recommended_actions: ["Complete one verified research action."], schedule: [{ label: "Research audit", scheduled_at: "06:00", state: "scheduled_not_run" }], biggest_risk: "Missing current evidence", biggest_opportunity: "Complete one verified research action" },
    changes_since_previous: [{ domain: "research", kind: "changed", summary: "Focus recorded.", previous: null, current: "Dissertation", observed_at: "2026-08-06T01:00:00Z" }],
    risks: ["Evidence inputs are incomplete."],
    opportunities: [],
    confidence: { overall: 0.55, missing_inputs: ["health check-in"], stale_inputs: [] },
  };
}

function snapshot() {
  const metric = {
    value: null,
    unit: null,
    scaleMaximum: null,
    state: "unknown",
    source: null,
    observedAt: null,
    reason: "No current evidence",
  };
  return {
    schemaVersion: 1,
    generatedAt: "2026-08-04T08:00:00Z",
    timezone: "Asia/Taipei",
    freshness: { state: "unavailable", latestEvidenceAt: null, reason: "No evidence" },
    guidingQuestion: "What action matters?",
    wellbeing: { sleep: metric, energy: metric, workload: metric, exercise: metric },
    sustainability: {
      state: "unknown",
      reasons: [],
      evidenceFreshness: "unavailable",
      recommendation: "Complete a check-in.",
      uncertainty: "Missing remains unknown.",
    },
    highestLeverageAction: null,
    priorities: [],
    deferredTaskCount: 0,
    projects: [],
    latestReflection: null,
    week: [],
    backup: {
      state: "not_configured",
      configured: false,
      lastAttemptAt: null,
      lastEncryptedAt: null,
      lastCloudVerifiedAt: null,
      lastRestoreTestAt: null,
      restoreDueAt: null,
      errorCode: null,
    },
    system: {
      peakWorker: "running",
      database: "available",
      schemaVersion: 12,
      telegram: "configured",
      lastScheduledProcessAt: null,
      lastErrorCode: null,
    },
  };
}

describe("Peak owner authentication", () => {
  it("prefills the sole owner email without choosing among multiple owners", () => {
    process.env.PEAK_DASHBOARD_OWNER_EMAILS = " Owner@Example.com ";
    expect(getSingleOwnerEmail()).toBe("owner@example.com");
    process.env.PEAK_DASHBOARD_OWNER_EMAILS = "owner@example.com,backup@example.com";
    expect(getSingleOwnerEmail()).toBe("");
  });

  it("verifies the server-side password hash without exposing the password", () => {
    const encoded = createPasswordHash("correct horse battery staple");
    expect(verifyPassword("correct horse battery staple", encoded)).toBe(true);
    expect(verifyPassword("wrong password", encoded)).toBe(false);
    expect(verifySubmittedPassword("  correct horse battery staple\r\n", encoded)).toBe(true);
    expect(encoded).not.toContain("correct horse");
  });

  it("accepts only allowlisted, unexpired signed sessions", () => {
    configureAuth();
    const now = Date.parse("2026-08-04T08:00:00Z");
    const token = createSession("owner@example.com", now);
    expect(verifySession(token, now + 60_000)?.email).toBe("owner@example.com");
    expect(verifySession(token, now + 9 * 60 * 60 * 1_000)).toBeNull();
    expect(inspectSession(token, now + 9 * 60 * 60 * 1_000).status).toBe("expired");
    process.env.PEAK_DASHBOARD_OWNER_EMAILS = "someone-else@example.com";
    expect(verifySession(token, now + 60_000)).toBeNull();
  });

  it("restores the durable verifier after a simulated fresh process and fails closed on corruption", () => {
    const bootstrap = createPasswordHash("bootstrap password");
    const durable = createPasswordHash("durable password");
    expect(resolveOwnerPasswordState(null, bootstrap)).toEqual({ hash: bootstrap, source: "bootstrap" });
    const serialized = JSON.parse(JSON.stringify({ version: 1, hash: durable, updatedAt: "2026-08-06T01:00:00Z" }));
    expect(resolveOwnerPasswordState(serialized, bootstrap)).toEqual({ hash: durable, source: "durable" });
    expect(() => resolveOwnerPasswordState({ version: 1, hash: "corrupt", updatedAt: "2026-08-06T01:00:00Z" }, bootstrap)).toThrow("owner_password_corrupt");
  });

  it("distinguishes invalid credentials, missing configuration, and private-store failure", async () => {
    configureAuth();
    const request = () => new NextRequest("https://line101chat.com/api/peak/v1/login", {
      method: "POST", headers: { origin: "https://line101chat.com", "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email: "owner@example.com", password: "incorrect password" }),
    });
    expect((await passwordLogin(request())).headers.get("location")).toContain("error=invalid");
    delete process.env.PEAK_DASHBOARD_SESSION_SECRET;
    expect((await passwordLogin(request())).headers.get("location")).toContain("error=configuration");
    configureAuth();
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    delete process.env.BLOB_READ_WRITE_TOKEN; delete process.env.VERCEL_OIDC_TOKEN; delete process.env.BLOB_STORE_ID;
    expect((await passwordLogin(request())).headers.get("location")).toContain("error=server");
  });

  it("accepts safe browser same-origin metadata when Origin is omitted", async () => {
    configureAuth();
    const response = await passwordLogin(new NextRequest("https://line101chat.com/api/peak/v1/login", {
      method: "POST",
      headers: {
        host: "line101chat.com",
        "sec-fetch-site": "same-origin",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: "owner@example.com",
        password: "correct horse battery staple",
      }),
    }));
    expect(response.headers.get("location")).toContain("/peak-os");
  });

  it("rejects cross-site form posts without calling them invalid credentials", async () => {
    configureAuth();
    const response = await passwordLogin(new NextRequest("https://line101chat.com/api/peak/v1/login", {
      method: "POST",
      headers: {
        host: "line101chat.com",
        "sec-fetch-site": "cross-site",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: "owner@example.com",
        password: "correct horse battery staple",
      }),
    }));
    expect(response.headers.get("location")).toContain("error=request");
  });

  it("accepts a short-lived local token once and rejects replay", async () => {
    configureAuth();
    process.env.PEAK_DASHBOARD_SYNC_SECRET = "y".repeat(64);
    const token = createLocalLoginToken("owner@example.com", process.env.PEAK_DASHBOARD_SYNC_SECRET);
    const request = () => new NextRequest("https://line101chat.com/api/peak/v1/local-login", {
      method: "POST",
      headers: { origin: "https://line101chat.com", "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const accepted = await localLogin(request());
    expect(accepted.status).toBe(200);
    expect(accepted.cookies.get(PEAK_SESSION_COOKIE)?.value).toBeTruthy();
    expect((await localLogin(request())).status).toBe(401);
  });

  it("clears the current address lockout after trusted recovery and successful login", async () => {
    configureAuth();
    process.env.PEAK_DASHBOARD_SYNC_SECRET = "y".repeat(64);
    const address = "203.0.113.44";
    const requestForKey = new NextRequest("https://line101chat.com/peak/login", {
      headers: { "x-forwarded-for": address },
    });
    const key = loginAttemptKey(requestForKey, process.env.PEAK_DASHBOARD_SESSION_SECRET as string);
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(await allowAttempt(key, 5, 900)).toBe(true);
    }
    expect(await allowAttempt(key, 5, 900)).toBe(false);

    const token = createLocalLoginToken("owner@example.com", process.env.PEAK_DASHBOARD_SYNC_SECRET);
    const recovered = await localLogin(new NextRequest("https://line101chat.com/api/peak/v1/local-login", {
      method: "POST",
      headers: {
        origin: "https://line101chat.com",
        "content-type": "application/json",
        "x-forwarded-for": address,
      },
      body: JSON.stringify({ token }),
    }));
    expect(recovered.status).toBe(200);

    const login = await passwordLogin(new NextRequest("https://line101chat.com/api/peak/v1/login", {
      method: "POST",
      headers: {
        origin: "https://line101chat.com",
        "content-type": "application/x-www-form-urlencoded",
        "x-forwarded-for": address,
      },
      body: new URLSearchParams({
        email: "owner@example.com",
        password: "correct horse battery staple",
      }),
    }));
    expect(login.headers.get("location")).toContain("/peak-os");
    expect(await allowAttempt(key, 5, 900)).toBe(true);
  });

  it("lets an authenticated owner set the durable dashboard password", async () => {
    configureAuth();
    const session = createSession("owner@example.com");
    const changed = await updatePassword(new NextRequest("https://line101chat.com/api/peak/v1/password", {
      method: "POST",
      headers: { origin: "https://line101chat.com", cookie: `${PEAK_SESSION_COOKIE}=${session}`, "content-type": "application/json" },
      body: JSON.stringify({ password: "my browser password", confirmation: "my browser password" }),
    }));
    expect(changed.status).toBe(200);
    const loggedIn = await passwordLogin(new NextRequest("https://line101chat.com/api/peak/v1/login", {
      method: "POST",
      headers: { origin: "https://line101chat.com", "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email: "owner@example.com", password: "my browser password" }),
    }));
    expect(loggedIn.status).toBe(303);
    expect(loggedIn.cookies.get(PEAK_SESSION_COOKIE)?.value).toBeTruthy();

    const logout = await passwordLogout(new NextRequest("https://line101chat.com/api/peak/v1/logout", {
      method: "POST", headers: { origin: "https://line101chat.com", cookie: `${PEAK_SESSION_COOKIE}=${loggedIn.cookies.get(PEAK_SESSION_COOKIE)?.value}` },
    }));
    expect(logout.status).toBe(303);
    expect(logout.cookies.get(PEAK_SESSION_COOKIE)?.value).toBe("");
  });

  it("bootstraps a durable hash once through a signed server-only request", async () => {
    configureAuth(); process.env.PEAK_DASHBOARD_SYNC_SECRET = "y".repeat(64);
    const durablePassword = "durable browser password"; const body = JSON.stringify({ password_hash: createPasswordHash(durablePassword) });
    const request = () => {
      const timestamp = String(Math.floor(Date.now() / 1_000)); const nonce = randomBytes(16).toString("hex");
      const signature = createHmac("sha256", process.env.PEAK_DASHBOARD_SYNC_SECRET as string).update(`${timestamp}.${nonce}.${body}`).digest("hex");
      return new NextRequest("https://line101chat.com/api/peak/v1/password/bootstrap", { method: "POST", body, headers: { "content-type": "application/json", "x-peak-timestamp": timestamp, "x-peak-nonce": nonce, "x-peak-signature": signature } });
    };
    expect((await bootstrapPassword(request())).status).toBe(200);
    expect((await bootstrapPassword(request())).status).toBe(409);
    const login = (password: string) => passwordLogin(new NextRequest("https://line101chat.com/api/peak/v1/login", { method: "POST", headers: { origin: "https://line101chat.com", "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ email: "owner@example.com", password }) }));
    expect((await login(durablePassword)).headers.get("location")).toContain("/peak-os");
    expect((await login("correct horse battery staple")).headers.get("location")).toContain("error=invalid");
  });
});

describe("Peak Executive State 1.0", () => {
  it("validates explicit unknowns, agent lifecycle states, hashes, and typed changes", () => {
    const parsed = parseExecutiveState(executiveState());
    expect(parsed?.health.score).toBeNull();
    expect(parsed?.system.agents[0].state).toBe("scheduled_not_run");
    expect(parsed?.system.audits[0].audit_id).toBe("research-20260806");
    expect(parsed?.confidence.overall).toBe(0.55);
    expect(parsed?.changes_since_previous[0].kind).toBe("changed");
    expect(parseExecutiveState({ ...executiveState(), state_hash: "not-a-hash" })).toBeNull();
  });

  it("accepts signed Executive State and serves the same last-known-good state to an owner", async () => {
    configureAuth(); process.env.PEAK_DASHBOARD_SYNC_SECRET = "y".repeat(64);
    const body = JSON.stringify(executiveState()); const timestamp = String(Math.floor(Date.now() / 1_000)); const nonce = randomBytes(16).toString("hex");
    const signature = createHmac("sha256", process.env.PEAK_DASHBOARD_SYNC_SECRET).update(`${timestamp}.${nonce}.${body}`).digest("hex");
    const accepted = await ingestExecutive(new NextRequest("https://line101chat.com/api/peak/v1/executive-state", { method: "POST", body, headers: { "content-type": "application/json", "x-peak-timestamp": timestamp, "x-peak-nonce": nonce, "x-peak-signature": signature } }));
    expect(accepted.status).toBe(200);
    const invalidBody = JSON.stringify({ ...executiveState(), state_hash: "invalid" }); const invalidTimestamp = String(Math.floor(Date.now() / 1_000)); const invalidNonce = randomBytes(16).toString("hex");
    const invalidSignature = createHmac("sha256", process.env.PEAK_DASHBOARD_SYNC_SECRET).update(`${invalidTimestamp}.${invalidNonce}.${invalidBody}`).digest("hex");
    expect((await ingestExecutive(new NextRequest("https://line101chat.com/api/peak/v1/executive-state", { method: "POST", body: invalidBody, headers: { "content-type": "application/json", "x-peak-timestamp": invalidTimestamp, "x-peak-nonce": invalidNonce, "x-peak-signature": invalidSignature } }))).status).toBe(400);
    const token = createSession("owner@example.com");
    const headers = { cookie: `${PEAK_SESSION_COOKIE}=${token}` };
    const response = await readExecutive(new NextRequest("https://line101chat.com/api/peak/v1/executive-state", { headers }));
    expect(response.status).toBe(200);
    expect((await response.json()).state.state_hash).toBe("a".repeat(64));
    expect((await executiveHealth(new NextRequest("https://line101chat.com/api/peak/v1/health", { headers }))).status).toBe(200);
  });
});

describe("Peak dashboard payload", () => {
  it("recognizes Vercel private Blob credentials without Upstash", () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.VERCEL_OIDC_TOKEN;
    delete process.env.BLOB_STORE_ID;
    expect(hasPeakPrivateBlobConfig()).toBe(false);
    process.env.BLOB_READ_WRITE_TOKEN = "vercel-managed-test-token";
    expect(hasPeakPrivateBlobConfig()).toBe(true);
  });

  it("preserves unknown wellbeing as null rather than zero", () => {
    const parsed = parsePeakSnapshot(snapshot());
    expect(parsed?.wellbeing.energy.value).toBeNull();
    expect(parsed?.wellbeing.energy.state).toBe("unknown");
    expect(parsed?.backup.state).toBe("not_configured");
  });

  it("rejects malformed or unsupported payloads", () => {
    expect(parsePeakSnapshot({ ...snapshot(), schemaVersion: 99 })).toBeNull();
    expect(parsePeakSnapshot({ ...snapshot(), wellbeing: { energy: { value: "five" } } })).toBeNull();
  });

  it("keeps private routes out of the public sitemap", () => {
    expect(sitemap().some((entry) => entry.url.includes("/peak"))).toBe(false);
  });
});

describe("Peak dashboard route boundary", () => {
  it("rejects unauthenticated browser reads", async () => {
    configureAuth();
    const response = await readSummary(new NextRequest("https://line101chat.com/api/peak/v1/summary"));
    expect(response.status).toBe(401);
  });

  it("accepts a signed snapshot and returns it only to an owner session", async () => {
    configureAuth();
    process.env.PEAK_DASHBOARD_SYNC_SECRET = "y".repeat(64);
    const body = JSON.stringify(snapshot());
    const timestamp = String(Math.floor(Date.now() / 1_000));
    const nonce = randomBytes(16).toString("hex");
    const signature = createHmac("sha256", process.env.PEAK_DASHBOARD_SYNC_SECRET)
      .update(`${timestamp}.${nonce}.${body}`)
      .digest("hex");
    const accepted = await ingestSnapshot(new NextRequest("https://line101chat.com/api/peak/v1/snapshot", {
      method: "POST",
      body,
      headers: {
        "content-type": "application/json",
        "x-peak-timestamp": timestamp,
        "x-peak-nonce": nonce,
        "x-peak-signature": signature,
      },
    }));
    expect(accepted.status).toBe(200);
    const replayed = await ingestSnapshot(new NextRequest("https://line101chat.com/api/peak/v1/snapshot", {
      method: "POST",
      body,
      headers: {
        "content-type": "application/json",
        "x-peak-timestamp": timestamp,
        "x-peak-nonce": nonce,
        "x-peak-signature": signature,
      },
    }));
    expect(replayed.status).toBe(401);
    const token = createSession("owner@example.com");
    const response = await readSummary(new NextRequest("https://line101chat.com/api/peak/v1/summary", {
      headers: { cookie: `${PEAK_SESSION_COOKIE}=${token}` },
    }));
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.snapshot.wellbeing.energy.value).toBeNull();
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
  });
});
