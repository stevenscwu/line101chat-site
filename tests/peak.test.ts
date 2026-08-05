import { afterEach, describe, expect, it } from "vitest";
import { createHmac, randomBytes } from "node:crypto";
import { NextRequest } from "next/server";

import sitemap from "@/app/sitemap";
import { POST as ingestSnapshot } from "@/app/api/peak/v1/snapshot/route";
import { GET as readSummary } from "@/app/api/peak/v1/summary/route";
import {
  PEAK_SESSION_COOKIE,
  createPasswordHash,
  createSession,
  verifyPassword,
  verifySession,
} from "@/lib/peak/auth";
import { hasPeakPrivateBlobConfig } from "@/lib/peak/config";
import { parsePeakSnapshot } from "@/lib/peak/validation";

const original = { ...process.env };

afterEach(() => {
  process.env = { ...original };
});

function configureAuth() {
  process.env.PEAK_DASHBOARD_ENABLED = "true";
  process.env.PEAK_DASHBOARD_OWNER_EMAILS = "owner@example.com";
  process.env.PEAK_DASHBOARD_SESSION_SECRET = "s".repeat(64);
  process.env.PEAK_DASHBOARD_PASSWORD_HASH = createPasswordHash("correct horse battery staple");
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
  it("verifies the server-side password hash without exposing the password", () => {
    const encoded = createPasswordHash("correct horse battery staple");
    expect(verifyPassword("correct horse battery staple", encoded)).toBe(true);
    expect(verifyPassword("wrong password", encoded)).toBe(false);
    expect(encoded).not.toContain("correct horse");
  });

  it("accepts only allowlisted, unexpired signed sessions", () => {
    configureAuth();
    const now = Date.parse("2026-08-04T08:00:00Z");
    const token = createSession("owner@example.com", now);
    expect(verifySession(token, now + 60_000)?.email).toBe("owner@example.com");
    expect(verifySession(token, now + 9 * 60 * 60 * 1_000)).toBeNull();
    process.env.PEAK_DASHBOARD_OWNER_EMAILS = "someone-else@example.com";
    expect(verifySession(token, now + 60_000)).toBeNull();
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
