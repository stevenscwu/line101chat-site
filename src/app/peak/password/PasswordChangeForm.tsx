"use client";

import { useState } from "react";

export function PasswordChangeForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/peak/v1/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmation }),
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("rejected");
      setPassword("");
      setConfirmation("");
      setStatus("密碼已更新。現在可以登出，再使用這個密碼登入。");
    } catch {
      setStatus("密碼更新失敗。請確認兩次輸入相同且至少 12 個字元。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-5">
      <label className="block text-sm font-medium">新密碼
        <input value={password} onChange={(event) => setPassword(event.currentTarget.value)} type={visible ? "text" : "password"} autoComplete="new-password" required minLength={12} maxLength={256} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3" />
      </label>
      <label className="block text-sm font-medium">再次輸入新密碼
        <input value={confirmation} onChange={(event) => setConfirmation(event.currentTarget.value)} type={visible ? "text" : "password"} autoComplete="new-password" required minLength={12} maxLength={256} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3" />
      </label>
      <div className="flex items-center justify-between text-xs text-slate-400"><span>長度：{password.length}；兩次輸入：{password && password === confirmation ? "相同" : "尚未相同"}</span><button type="button" onClick={() => setVisible((value) => !value)} className="font-semibold text-emerald-300">{visible ? "隱藏密碼" : "顯示密碼"}</button></div>
      <button disabled={saving} className="w-full rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-50">{saving ? "儲存中…" : "更新密碼"}</button>
      {status ? <p role="status" className="rounded-xl border border-slate-600 p-3 text-sm">{status}</p> : null}
    </form>
  );
}
