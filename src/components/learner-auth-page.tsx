"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { PublicAccountConfig } from "@/lib/account-config";
import { authReturnUrl, createLearnerAuth, LearnerAuthError, NEW_PASSWORD_MIN_LENGTH, NEW_PASSWORD_MAX_LENGTH, type LearnerAuthPort } from "@/lib/learner-auth";

type Mode = "signup" | "recover" | "return";
const titles: Record<Mode, string> = { signup: "建立學員帳號", recover: "忘記密碼", return: "確認電子郵件連結" };
const errors: Record<string, string> = {
  INVALID_EMAIL: "請輸入完整的電子郵件地址。",
  WEAK_PASSWORD: "請使用至少 12 個字元的新密碼，避免與舊密碼相同。伺服器也會檢查密碼是否符合安全要求。",
  RATE_LIMITED: "寄信或操作次數已達暫時上限。請稍候再試，並先查看收件匣及垃圾郵件。",
  INVALID_LINK: "這個連結已失效、已使用或無法驗證。請重新申請確認信或密碼重設信。",
  UNAVAILABLE: "目前無法完成要求。請檢查網路後重試；若仍失敗，電子郵件服務可能尚未完成設定。",
  BUSY: "正在處理，請稍候。",
};
function errorMessage(error: unknown) {
  return errors[error instanceof LearnerAuthError ? error.code : "UNAVAILABLE"] ?? errors.UNAVAILABLE;
}

export function LearnerAuthPage({ config, mode }: { config: PublicAccountConfig | null; mode: Mode }) {
  return <LearnerAuthExperience key={mode} config={config} mode={mode} />;
}

function LearnerAuthExperience({ config, mode }: { config: PublicAccountConfig | null; mode: Mode }) {
  const [auth, setAuth] = useState<LearnerAuthPort | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(mode === "return");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [complete, setComplete] = useState(false);
  const working = useRef(false);
  const fragment = useRef<string | null>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    // Never send fragments to the server, router, logs, state snapshots, or storage.
    // Strip all callback data before creating the SDK or making any Auth request.
    if (mode === "return") {
      if (fragment.current === null) fragment.current = window.location.hash;
      window.history.replaceState(null, "", window.location.pathname);
    }
    if (!config) return;
    let active = true;
    let instance: LearnerAuthPort;
    try { instance = createLearnerAuth(config, authReturnUrl(window.location.origin)); }
    catch (cause) { queueMicrotask(() => { if (active) { setError(errorMessage(cause)); setBusy(false); } }); return; }
    const clearPasswordFields = () => {
      form.current?.querySelectorAll<HTMLInputElement>('input[type="password"]').forEach((field) => { field.value = ""; });
    };
    const leave = () => { clearPasswordFields(); instance.dispose(); };
    const restore = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload(); };
    window.addEventListener("pagehide", leave);
    window.addEventListener("pageshow", restore);
    queueMicrotask(() => { if (active) setAuth(instance); });
    if (mode === "return") {
      void instance.acceptEmailLink(fragment.current ?? "").then((result) => {
        if (!active) return;
        fragment.current = null;
        setVerifiedEmail(result.email);
        setRecovery(result.kind === "recovery");
        if (result.kind === "signup") { setComplete(true); setNotice("電子郵件已確認。請使用電子郵件與密碼登入你的教材庫。"); }
      }).catch((cause) => { if (active) { fragment.current = null; setError(errorMessage(cause)); } })
        .finally(() => { if (active) setBusy(false); });
    }
    return () => { active = false; clearPasswordFields(); instance.dispose(); window.removeEventListener("pagehide", leave); window.removeEventListener("pageshow", restore); };
  }, [config, mode]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!auth || working.current || busy || complete) return;
    if ((mode === "signup" || recovery) && password !== confirmation) { setError("兩次輸入的密碼不同，請再確認一次。"); return; }
    working.current = true; setBusy(true); setError(""); setNotice("");
    try {
      if (recovery) {
        await auth.updatePassword(password); setRecovery(false); setComplete(true);
        setNotice("密碼已更新。請使用新密碼登入網站或 Android 應用程式。");
      } else if (mode === "signup") {
        await auth.signUp(email.trim(), password);
        setNotice("如果這個地址可以註冊，系統會寄出確認信。請查看收件匣及垃圾郵件，開啟信中的連結後再登入。若已有帳號，請直接登入或使用忘記密碼。");
      } else {
        await auth.requestPasswordReset(email.trim());
        setNotice("如果這個地址有可用的帳號，系統會寄出密碼重設信。請查看收件匣及垃圾郵件；這個訊息不代表帳號是否存在。");
      }
    } catch (cause) { setError(errorMessage(cause)); }
    finally { working.current = false; setBusy(false); setPassword(""); setConfirmation(""); }
  }
  async function resend() {
    if (!auth || working.current || busy) return;
    working.current = true; setBusy(true); setError(""); setNotice("");
    try {
      await auth.resendConfirmation(email.trim());
      setNotice("如果這個地址仍需要確認，系統會寄出新的確認信。請查看收件匣及垃圾郵件，並使用最新的一封。");
    } catch (cause) { setError(errorMessage(cause)); }
    finally { working.current = false; setBusy(false); }
  }
  const hasForm = mode !== "return" || recovery;
  return <main id="main" className="account-page" lang="zh-Hant">
    <div className="account-heading"><p className="account-kicker">說日語 · 私人教材庫</p><h1>{recovery ? "設定新密碼" : titles[mode]}</h1><p>每位學員使用自己的帳號，教材只屬於自己。</p></div>
    <section className="account-card account-signin" aria-labelledby="learner-auth-title">
      <h2 id="learner-auth-title">{recovery ? "為你的帳號建立新密碼" : mode === "signup" ? "第一次使用說日語" : mode === "recover" ? "用電子郵件找回帳號" : complete ? "已完成" : "驗證你的連結"}</h2>
      {!config ? <p role="status">帳號服務尚未完成設定。目前不能註冊或寄送重設信，請稍後回來。</p> : <>
        {error && <p className="account-error" role="alert">{error}</p>}
        {notice && <p className="account-success" role="status">{notice}</p>}
        {verifiedEmail && <p className="account-note">已確認的帳號：<strong>{verifiedEmail}</strong></p>}
        {mode === "return" && busy && <p role="status">正在安全地確認連結…</p>}
        {hasForm && !complete && <form ref={form} onSubmit={(event) => void submit(event)}>
          {!recovery && <><label htmlFor="learner-email">電子郵件</label><input id="learner-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254} value={email} disabled={busy || !auth} onChange={(event) => setEmail(event.target.value)} /></>}
          {(mode === "signup" || recovery) && <>
            <label htmlFor="learner-password">{recovery ? "新密碼" : "密碼"}</label><input id="learner-password" name="new-password" type="password" autoComplete="new-password" required minLength={NEW_PASSWORD_MIN_LENGTH} maxLength={NEW_PASSWORD_MAX_LENGTH} aria-describedby="learner-password-hint" value={password} disabled={busy || !auth} onChange={(event) => setPassword(event.target.value)} />
            <p id="learner-password-hint" className="account-note">至少 12 個字元。可以使用容易記住的長句，不需要透露給任何人。</p>
            <label htmlFor="learner-confirm">再輸入一次密碼</label><input id="learner-confirm" name="confirm-password" type="password" autoComplete="new-password" required minLength={NEW_PASSWORD_MIN_LENGTH} maxLength={NEW_PASSWORD_MAX_LENGTH} value={confirmation} disabled={busy || !auth} onChange={(event) => setConfirmation(event.target.value)} />
          </>}
          <button className="account-primary" type="submit" disabled={busy || !auth}>{busy ? "正在處理…" : recovery ? "儲存新密碼" : mode === "signup" ? "建立帳號並寄送確認信" : "寄送密碼重設信"}</button>
        </form>}
        {mode === "signup" && <button className="account-text-button" disabled={busy || !auth} onClick={() => void resend()}>重新寄送確認信</button>}
        {mode === "return" && !busy && !complete && !recovery && <div className="account-actions"><Link href="/account/recover" className="account-primary">重新申請重設信</Link><Link href="/account/signup" className="account-secondary">重新寄送確認信</Link></div>}
      </>}
      <div className="account-actions"><Link className="account-secondary" href="/account">返回登入</Link>{mode !== "signup" && <Link className="account-text-button" href="/account/signup">建立學員帳號</Link>}{mode !== "recover" && <Link className="account-text-button" href="/account/recover">忘記密碼</Link>}</div>
      <p className="account-note">密碼由 Supabase Auth 安全處理。網站不會將密碼存入教材或自訂資料表。管理員不能查看你的密碼。</p>
      <p className="account-note">請只開啟自己申請的最新電子郵件連結，並確認上方帳號是你自己。驗證後可以回到 Android 應用程式登入。</p>
      <p className="account-note">閱讀<Link href="/privacy">隱私權說明</Link>。建立帳號不會自動上傳原有的離線教材。</p>
    </section>
  </main>;
}
