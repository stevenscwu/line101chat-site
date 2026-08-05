"use client";

import { useEffect, useState } from "react";

export function LocalLoginClient() {
  const [message, setMessage] = useState("正在驗證本機一次性登入連結…");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("next");
    const destination = requested === "/peak/password" ? requested : "/peak";
    const token = window.location.hash.slice(1);
    window.history.replaceState(null, "", "/peak/local-login");
    if (!token) {
      window.location.replace("/peak/login?error=link");
      return;
    }
    void fetch("/api/peak/v1/local-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      credentials: "same-origin",
      cache: "no-store",
    }).then((response) => {
      if (!response.ok) throw new Error("rejected");
      setMessage("登入成功，正在開啟 Peak OS…");
      window.location.replace(destination);
    }).catch(() => {
      window.location.replace("/peak/login?error=link");
    });
  }, []);

  return <p className="text-sm text-slate-300" aria-live="polite">{message}</p>;
}
