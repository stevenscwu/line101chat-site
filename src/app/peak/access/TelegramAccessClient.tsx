"use client";

import { useEffect, useState } from "react";

import { telegramLoginFragmentStatus } from "@/lib/peak/login-copy";

export function TelegramAccessClient() {
  const [message, setMessage] = useState("正在驗證 Telegram 一次性登入連結…");

  useEffect(() => {
    const token = window.location.hash.slice(1);
    window.history.replaceState(null, "", "/peak/access");
    const fragmentStatus = telegramLoginFragmentStatus(token);
    if (fragmentStatus === "expired") {
      window.location.replace("/peak/login?error=link-expired");
      return;
    }
    if (fragmentStatus === "invalid") {
      window.location.replace("/peak/login?error=link");
      return;
    }

    void fetch("/api/peak/v1/telegram-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      credentials: "same-origin",
      cache: "no-store",
    }).then((response) => {
      if (!response.ok) throw new Error(response.status >= 500 ? "server" : "rejected");
      setMessage("登入成功，正在開啟唯讀 Peak OS 儀表板…");
      window.location.replace("/peak-os");
    }).catch((error: unknown) => {
      window.location.replace(error instanceof Error && error.message === "server"
        ? "/peak/login?error=server"
        : "/peak/login?error=link");
    });
  }, []);

  return <p className="text-sm text-slate-300" aria-live="polite">{message}</p>;
}
