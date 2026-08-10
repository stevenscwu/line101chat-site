"use client";

import { useState } from "react";

export function PasswordInput() {
  const [visible, setVisible] = useState(false);
  const [length, setLength] = useState(0);

  return (
    <div>
      <label className="block text-sm font-medium">
        密碼
        <input
          name="password"
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          required
          minLength={12}
          maxLength={256}
          onChange={(event) => setLength(event.currentTarget.value.length)}
          className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
        />
      </label>
      <div className="mt-2 flex items-center justify-between gap-4 text-xs text-slate-400">
        <span aria-live="polite">已輸入 {length} 個字元</span>
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="font-semibold text-emerald-300 hover:text-emerald-200"
        >
          {visible ? "隱藏密碼" : "顯示密碼"}
        </button>
      </div>
    </div>
  );
}
