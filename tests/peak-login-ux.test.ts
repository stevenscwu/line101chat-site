import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  PEAK_LOGIN_LINK_LIFETIME_MINUTES,
  PEAK_TELEGRAM_LOGIN_COMMAND,
  getPeakLoginNotice,
  localLoginFragmentStatus,
  telegramLoginFragmentStatus,
} from "@/lib/peak/login-copy";
import { createLocalLoginToken } from "@/lib/peak/local-login";
import { createTelegramLoginToken } from "@/lib/peak/telegram-login";

describe("Peak Telegram-first login UX", () => {
  it("presents Telegram before the collapsed emergency password fallback", () => {
    const source = readFileSync(join(process.cwd(), "src/app/peak/login/page.tsx"), "utf8");

    expect(source).toContain("TELEGRAM FIRST");
    expect(source).toContain("PEAK_TELEGRAM_LOGIN_COMMAND");
    expect(source).toContain("<details");
    expect(source.indexOf("建議登入方式")).toBeLessThan(source.indexOf("<details"));
    expect(source).toContain("緊急備用：使用密碼登入");
    expect(source).not.toContain("<details open");
    expect(source).not.toContain("Vercel");
  });

  it("does not prefill or expose the configured owner email", () => {
    const source = readFileSync(join(process.cwd(), "src/app/peak/login/page.tsx"), "utf8");

    expect(source).not.toContain("getSingleOwnerEmail");
    expect(source).not.toContain("PEAK_DASHBOARD_OWNER_EMAILS");
    expect(source).not.toContain("defaultValue=");
  });

  it("keeps invalid-link, expired-link, and expired-session messages distinct", () => {
    const invalidLink = getPeakLoginNotice("link");
    const expiredLink = getPeakLoginNotice("link-expired");
    const expiredSession = getPeakLoginNotice("session-expired");

    expect(PEAK_TELEGRAM_LOGIN_COMMAND).toBe("/peak_login");
    expect(PEAK_LOGIN_LINK_LIFETIME_MINUTES).toBe(2);
    expect(invalidLink?.message).toContain("無效或已使用");
    expect(expiredLink?.message).toContain("兩分鐘");
    expect(expiredLink?.message).toContain(PEAK_TELEGRAM_LOGIN_COMMAND);
    expect(expiredSession?.message).toContain("工作階段已過期");
    expect(new Set([invalidLink?.message, expiredLink?.message, expiredSession?.message]).size).toBe(3);
  });

  it("recognizes a current or expired one-time fragment without trusting it", () => {
    const issuedAt = Date.parse("2026-08-06T05:00:00Z");
    const token = createLocalLoginToken("owner@example.com", "s".repeat(64), issuedAt);
    const telegramToken = createTelegramLoginToken("t".repeat(64), issuedAt);

    expect(localLoginFragmentStatus(token, issuedAt + 60_000)).toBe("current");
    expect(localLoginFragmentStatus(token, issuedAt + 121_000)).toBe("expired");
    expect(localLoginFragmentStatus("malformed", issuedAt)).toBe("invalid");
    expect(telegramLoginFragmentStatus(telegramToken, issuedAt + 60_000)).toBe("current");
    expect(telegramLoginFragmentStatus(telegramToken, issuedAt + 121_000)).toBe("expired");
    expect(telegramLoginFragmentStatus("malformed", issuedAt)).toBe("invalid");
  });

  it("routes client-side expiry and temporary server failures to different notices", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/peak/local-login/LocalLoginClient.tsx"),
      "utf8",
    );

    expect(source).toContain("error=link-expired");
    expect(source).toContain("error=server");
    expect(source).toContain("error=link");
  });

  it("uses a fixed cockpit destination and hides admin controls for cockpit sessions", () => {
    const accessClient = readFileSync(
      join(process.cwd(), "src/app/peak/access/TelegramAccessClient.tsx"),
      "utf8",
    );
    const cockpit = readFileSync(join(process.cwd(), "src/app/peak-os/page.tsx"), "utf8");
    const legacyDashboard = readFileSync(join(process.cwd(), "src/app/peak/page.tsx"), "utf8");

    expect(accessClient).toContain('fetch("/api/peak/v1/telegram-login"');
    expect(accessClient).toContain('window.location.replace("/peak-os")');
    expect(accessClient).not.toContain("next=");
    expect(cockpit).toContain('session.payload.scope === "admin"');
    expect(legacyDashboard).toContain('session.scope === "admin"');
  });
});
