"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { createAccountController, type AccountController, type AccountSnapshot, type AccountLessonRecord } from "@/lib/account-client";
import { createSupabaseBrowserAuth } from "@/lib/supabase-browser-auth";
import type { AccountLibraryUsage } from "@/lib/account-contract";
import type { PublicAccountConfig } from "@/lib/account-config";
import { createLesson, LEVELS, MAX_LESSON_BYTES, parseLesson, validateLesson, type Lesson } from "@/lib/materials";
import { LessonPractice } from "./lesson-practice";

function downloadDraft(lesson: Lesson) {
  const blob = new Blob([JSON.stringify(validateLesson(lesson))], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${lesson.title.replace(/[^\p{L}\p{N} _-]/gu, "").slice(0, 65) || "japanese-lesson"}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function AccountLibraryPage({ config }: { config: PublicAccountConfig | null }) {
  const [controller, setController] = useState<AccountController | null>(null);
  useEffect(() => {
    if (!config) return;
    let active = true;
    const instance = createAccountController({ auth: createSupabaseBrowserAuth(config) });
    queueMicrotask(() => { if (active) setController(instance); });
    const restore = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload(); };
    window.addEventListener("pageshow", restore);
    return () => { active = false; instance.dispose(); window.removeEventListener("pageshow", restore); };
  }, [config]);

  return <main id="main" className="account-page" lang="zh-Hant">
    <div className="account-heading"><p className="account-kicker">說日語 · 一句一句，慢慢練習</p><h1>個人教材庫</h1><p>使用自己的帳號，保存自己的日語教材。</p></div>
    {!config ? <section className="account-card account-unavailable" aria-labelledby="account-setup-title">
      <span className="account-status-label">尚未啟用</span><h2 id="account-setup-title">正在準備安全的登入與儲存</h2>
      <p>個人教材庫的連線尚未完成，目前不能登入或上傳。你原本在這個瀏覽器的教材不會改變。</p>
      <Link className="account-primary" href="/">返回離線教材庫</Link>
      <p className="account-note">設定完成後，請回到這一頁。這裡不會使用示範帳號或假登入。</p>
    </section> : controller ? <AccountExperience controller={controller} /> : <p className="account-card" role="status">正在準備登入…</p>}
    <aside className="account-local-note"><h2>原本的離線教材呢？</h2><p>不會自動搬移或上傳。請先在<Link href="/">離線教材庫</Link>下載你要保留的 JSON，再登入這裡、選擇檔案、預覽並確認上傳。只有在你有權使用這份教材時才匯入。</p></aside>
  </main>;
}

function AccountExperience({ controller }: { controller: AccountController }) {
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  if (!state.account) return <SignInForm key={state.generation} controller={controller} state={state} />;
  return <AccountWorkspace key={state.generation} controller={controller} state={state} />;
}

function SignInForm({ controller, state }: { controller: AccountController; state: AccountSnapshot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function signIn(event: FormEvent) {
    event.preventDefault();
    try { await controller.signIn(email.trim(), password); } finally { setPassword(""); }
  }
  return <section className="account-card account-signin" aria-labelledby="signin-title">
    <div><span className="account-status-label">私人帳號</span><h2 id="signin-title">登入你的教材庫</h2><p>使用已建立的帳號。教材不會與其他學員共用。</p></div>
    {state.error && <p className="account-error" role="alert">{state.error}</p>}
    <form onSubmit={signIn}>
      <label htmlFor="account-email">電子郵件</label><input id="account-email" name="email" type="email" autoComplete="username" inputMode="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} disabled={state.signInBusy || state.signOutBusy} />
      <label htmlFor="account-password">密碼</label><input id="account-password" name="password" type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={(event) => setPassword(event.target.value)} disabled={state.signInBusy || state.signOutBusy} />
      <button className="account-primary" type="submit" disabled={state.signInBusy || state.signOutBusy}>{state.signOutBusy ? "正在完成登出…" : state.signInBusy ? "正在登入…" : "登入"}</button>
    </form>
    <p className="account-note">登入狀態只保留在這一頁的記憶體。重新整理或離開後，需要再次登入。這個網站不會儲存你的密碼。</p>
    <p className="account-note">目前僅供已建立的帳號使用。公開註冊與寄送密碼重設信的功能尚未開放。</p>
  </section>;
}

function AccountWorkspace({ controller, state }: { controller: AccountController; state: AccountSnapshot }) {
  const [draft, setDraft] = useState<Lesson | null>(null);
  const [importVersion, setImportVersion] = useState(0);
  const [draftAttempt, setDraftAttempt] = useState(0);
  const [editorVersion, setEditorVersion] = useState(0);
  const [editorDirty, setEditorDirty] = useState(false);
  const [practising, setPractising] = useState<Lesson | null>(null);
  const [notice, setNotice] = useState("");
  const busy = state.workBusy;
  useEffect(() => {
    let lastRefresh = Date.now();
    const synchronize = () => {
      const current = controller.getSnapshot();
      if (document.visibilityState !== "visible" || current.workBusy || current.errorCode === "WRITE_UNCERTAIN" || Date.now() - lastRefresh < 30000) return;
      lastRefresh = Date.now();
      void controller.refresh();
    };
    window.addEventListener("focus", synchronize);
    document.addEventListener("visibilitychange", synchronize);
    return () => { window.removeEventListener("focus", synchronize); document.removeEventListener("visibilitychange", synchronize); };
  }, [controller]);
  function allowDiscard() { return (!draft && !editorDirty) || window.confirm("還有未儲存的草稿。要放棄變更並繼續嗎？你也可以先取消，下載草稿後再繼續。"); }
  async function open(id: string) {
    if (!allowDiscard()) return;
    setPractising(null); setNotice("");
    if (await controller.open(id)) {
      setDraft(null); setEditorDirty(false); setEditorVersion((value) => value + 1);
    }
  }
  async function signOut() {
    if (!allowDiscard()) return;
    setPractising(null); setDraft(null); setEditorDirty(false); setNotice("");
    await controller.signOut();
  }
  async function saveDraft(lesson: Lesson) {
    const success = await controller.create(lesson);
    if (success) { setDraft(null); setImportVersion((value) => value + 1); setNotice("教材已儲存到你的私人帳號。"); await controller.refresh(); }
  }
  return <div id="account-private-content">
    <div className="account-session-bar"><div><span>目前登入</span><strong>{state.account?.email || "你的私人帳號"}</strong></div><button className="account-secondary" onClick={() => void signOut()}>登出</button></div>
    {state.error && <div className="account-error" role="alert"><p>{state.error}</p><button className="account-secondary" disabled={busy} onClick={() => void controller.refresh()}>重新整理教材清單</button></div>}
    {notice && <p className="account-success" role="status">{notice}</p>}
    {state.usage && <AccountUsagePanel usage={state.usage} />}
    <div className="account-grid">
      <section className="account-card account-library-list" aria-labelledby="private-lessons-title">
        <div className="account-section-header"><h2 id="private-lessons-title">我的日語教材</h2><button className="account-text-button" disabled={busy} onClick={() => void controller.refresh()}>重新整理</button></div>
        <p className="account-note">已載入 {state.summaries.length} 份{state.usage ? `，共 ${state.usage.usage.lessons} 份` : ""}。音檔上傳尚未啟用。</p>
        {state.status === "loading" && <p role="status">正在讀取你的教材…</p>}
        {!busy && state.status === "ready" && state.summaries.length === 0 ? <div className="account-empty"><h3>從一份教材開始</h3><p>貼上日語內容或選擇文字檔。先看過預覽，確認後才會上傳。</p></div> : <ul>{state.summaries.map((summary) => <li key={summary.id}>
          <button disabled={busy} aria-pressed={state.selected?.id === summary.id && !draft} onClick={() => void open(summary.id)}><strong>{summary.title}</strong><span>{summary.level || "未設定程度"} · {summary.sentenceCount} 句{summary.topic ? ` · ${summary.topic}` : ""}</span></button>
        </li>)}</ul>}
        {state.nextCursor && <button className="account-secondary account-load-more" disabled={busy} onClick={() => void controller.loadMore()}>載入更多教材</button>}
      </section>
      <section className="account-card" aria-labelledby="account-add-title"><h2 id="account-add-title">加入日語教材</h2><AccountImport key={importVersion} disabled={busy} onPrepare={(lesson) => {
        if (!allowDiscard()) return;
        controller.closeSelection(); setEditorDirty(false); setNotice(""); setDraftAttempt((value) => value + 1); setDraft(lesson);
      }} /></section>
    </div>
    {draft && <NewLessonPreview key={`${draft.id}:${draftAttempt}`} lesson={draft} disabled={busy} errorCode={state.errorCode} quotaFull={Boolean(state.usage?.atLimit.length || state.usage?.overLimit.length)} onSave={saveDraft} onCancel={() => setDraft(null)} />}
    {!draft && state.selected && <AccountLessonEditor key={`${state.selected.id}:${state.selected.revision}:${editorVersion}`} record={state.selected} disabled={busy} writeUncertain={state.errorCode === "WRITE_UNCERTAIN"} onDirty={setEditorDirty} onSave={async (lesson) => {
      const saved = await controller.replace(state.selected!.id, state.selected!.revision, lesson);
      if (saved) { setEditorDirty(false); setNotice("修改已儲存。"); await controller.refresh(); }
      return saved;
    }} onReload={() => open(state.selected!.id)} onClose={() => { if (allowDiscard()) { setEditorDirty(false); controller.closeSelection(); } }} onPractice={(lesson) => setPractising(lesson)} />}
    {practising && <LessonPractice lesson={practising} persistProgress={false} onClose={() => setPractising(null)} />}
    <p className="account-note account-progress-note">這一版的雲端教材可以在登入後讀取。練習紀錄暫時只保留在本次練習，不會寫入共用的離線紀錄，也尚未同步到其他裝置。</p>
  </div>;
}

function AccountUsagePanel({ usage }: { usage: AccountLibraryUsage }) {
  const formatBytes = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KiB` : `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
  const warning = usage.overLimit.length ? "目前用量已超過額度。仍可讀取及下載教材；新增或增加用量的變更會暫停，不會自動刪除資料。"
    : usage.atLimit.length ? "目前已達額度。仍可讀取及下載教材；減少用量的修改可以儲存，不會自動刪除資料。"
    : usage.criticalLimit.length ? `用量已達 ${usage.criticalThresholdPercent}% 以上，接近上限。`
    : usage.nearLimit.length ? `用量已達 ${usage.warningThresholdPercent}% 以上，請留意剩餘空間。` : "";
  return <section className="account-card account-usage" aria-labelledby="account-usage-title"><h2 id="account-usage-title">我的儲存用量</h2>
    <dl><div><dt>教材</dt><dd>{usage.usage.lessons.toLocaleString("zh-TW")}／{usage.limits.lessons.toLocaleString("zh-TW")} 份</dd></div>
      <div><dt>練習句數</dt><dd>{usage.usage.sentences.toLocaleString("zh-TW")}／{usage.limits.sentences.toLocaleString("zh-TW")} 句</dd></div>
      <div><dt>教材容量</dt><dd>{formatBytes(usage.usage.bytes)}／{formatBytes(usage.limits.bytes)}</dd></div></dl>
    {usage.plan.provisional && <p className="account-note">目前顯示暫定的技術安全額度，尚不是正式免費或付費方案。</p>}
    {warning && <p className="account-quota-warning" role="status">{warning}</p>}
    <p className="account-note">用量由伺服器計算。升級方案與付款尚未開放。</p>
  </section>;
}

function AccountImport({ disabled, onPrepare }: { disabled: boolean; onPrepare: (lesson: Lesson) => void }) {
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  async function readFile(file?: File) {
    if (!file) return;
    setReading(true); setError("");
    try {
      if (file.size > MAX_LESSON_BYTES) throw new Error("請選擇小於 256 KB 的教材。");
      const text = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
      const lesson = parseLesson(text, file.name, "ja-JP");
      if (lesson.targetLanguage !== "ja-JP") throw new Error("個人教材庫目前只開放日語教材。");
      onPrepare(lesson);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "無法讀取教材，請檢查格式。"); }
    finally { setReading(false); if (fileRef.current) fileRef.current.value = ""; }
  }
  function preview(event: FormEvent) {
    event.preventDefault(); setError("");
    try { onPrepare(createLesson(source, title, "ja-JP")); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "請檢查教材名稱與日語內容。"); }
  }
  return <>
    <form onSubmit={preview}><label htmlFor="account-lesson-title">教材名稱</label><input id="account-lesson-title" required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} disabled={disabled || reading} />
      <label htmlFor="account-lesson-source">日語內容</label><textarea id="account-lesson-source" required rows={5} value={source} onChange={(event) => setSource(event.target.value)} disabled={disabled || reading} placeholder="在這裡貼上你想練習的日語…" />
      <button className="account-secondary" disabled={disabled || reading}>先預覽內容</button>
    </form>
    <div className="account-or">或選擇檔案</div><input ref={fileRef} id="account-lesson-file" className="account-file" type="file" accept=".txt,.md,.json,text/plain,text/markdown,application/json" aria-label="選擇日語教材檔案" disabled={disabled || reading} onChange={(event) => void readFile(event.target.files?.[0])} />
    <p className="account-note">支援 UTF-8 TXT、Markdown、教材 JSON，最多 256 KB／200 句。PDF、圖片及音檔暫不支援。</p>
    {reading && <p role="status">正在讀取檔案…</p>}{error && <p className="account-error" role="alert">{error}</p>}
  </>;
}

function NewLessonPreview({ lesson, disabled, errorCode, quotaFull, onSave, onCancel }: { lesson: Lesson; disabled: boolean; errorCode: string | null; quotaFull: boolean; onSave: (lesson: Lesson) => Promise<void>; onCancel: () => void }) {
  const [consent, setConsent] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <section className="account-card account-preview" aria-labelledby="account-preview-title"><h2 id="account-preview-title" ref={heading} tabIndex={-1}>確認要上傳的教材</h2><h3>{lesson.title}</h3><p>{lesson.sentences.length} 句 · 這份預覽尚未上傳</p>
    <ol className="account-sentence-preview">{lesson.sentences.map((sentence) => <li key={sentence.id} lang="ja">{sentence.text}</li>)}</ol>
    <label className="account-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} disabled={disabled} /><span>我確認要將這份教材、原文與附註儲存到目前登入的私人帳號。</span></label>
    {quotaFull && <p className="account-quota-warning" role="status">目前額度已滿，無法新增教材。請先重新整理確認用量；已儲存的教材仍可讀取與下載。</p>}
    <div className="account-actions"><button className="account-primary" disabled={!consent || disabled || quotaFull || errorCode === "WRITE_UNCERTAIN"} onClick={() => void onSave(lesson)}>{disabled ? "正在儲存…" : "確認上傳到我的帳號"}</button><button className="account-secondary" disabled={disabled} onClick={onCancel}>取消</button><button className="account-text-button" onClick={() => downloadDraft(lesson)}>下載這份草稿</button></div>
  </section>;
}

function AccountLessonEditor({ record, disabled, writeUncertain, onSave, onReload, onClose, onPractice, onDirty }: { record: AccountLessonRecord; disabled: boolean; writeUncertain: boolean; onSave: (lesson: Lesson) => Promise<boolean>; onReload: () => Promise<void>; onClose: () => void; onPractice: (lesson: Lesson) => void; onDirty: (dirty: boolean) => void }) {
  const [draft, setDraft] = useState<Lesson>(() => structuredClone(record.lesson));
  const [error, setError] = useState("");
  const dirty = JSON.stringify(draft) !== JSON.stringify(record.lesson);
  function change(next: Lesson) { setDraft(next); onDirty(JSON.stringify(next) !== JSON.stringify(record.lesson)); }
  function normalized() {
    const original = new Map(record.lesson.sentences.map((sentence) => [sentence.id, sentence]));
    const validated = validateLesson(draft);
    return validateLesson({ ...validated, sentences: validated.sentences.map((sentence) => original.get(sentence.id)?.text === sentence.text ? sentence : {
      ...sentence, id: crypto.randomUUID(), english: "", chinese: "", japaneseTranslation: "",
    }) });
  }
  async function save() { setError(""); try { await onSave(normalized()); } catch { setError("請檢查每句內容與長度，再儲存一次。"); } }
  return <section className="account-card account-editor" aria-labelledby="account-editor-title"><div className="account-section-header"><h2 id="account-editor-title">檢視與修改教材</h2><button className="account-text-button" disabled={disabled} onClick={onClose}>關閉</button></div>
    <p className="account-note">網頁朗讀使用瀏覽器語音，部分語音可能需要網路連線。</p><p className="account-note">版本 {record.revision}。修改日語句子後，原有翻譯會清除，避免意思不符。</p>
    <div className="account-editor-fields"><label>教材名稱<input value={draft.title} maxLength={120} disabled={disabled} onChange={(event) => change({ ...draft, title: event.target.value })} /></label><label>程度<select value={draft.level} disabled={disabled} onChange={(event) => change({ ...draft, level: event.target.value })}>{LEVELS["ja-JP"].map((level) => <option key={level} value={level}>{level || "未設定"}</option>)}</select></label><label>主題<input value={draft.topic} maxLength={80} disabled={disabled} onChange={(event) => change({ ...draft, topic: event.target.value })} /></label></div>
    <ol className="account-line-editors">{draft.sentences.map((sentence, index) => <li key={sentence.id}><label>第 {index + 1} 句<textarea lang="ja" rows={2} disabled={disabled} value={sentence.text} onChange={(event) => change({ ...draft, sentences: draft.sentences.map((item, row) => row === index ? { ...item, text: event.target.value } : item) })} /></label>{sentence.chinese && <p>{sentence.chinese}</p>}</li>)}</ol>
    {error && <p className="account-error" role="alert">{error}</p>}
    <div className="account-actions"><button className="account-primary" disabled={disabled || !dirty || writeUncertain} onClick={() => void save()}>{disabled ? "正在儲存…" : "儲存修改"}</button><button className="account-secondary" disabled={disabled} onClick={() => onPractice(record.lesson)}>聽與跟讀已儲存教材</button><button className="account-secondary" disabled={disabled} onClick={() => void onReload()}>重新載入雲端版本</button><button className="account-text-button" onClick={() => { try { downloadDraft(normalized()); } catch { setError("請先修正草稿內容，再下載。"); } }}>下載目前草稿</button></div>
  </section>;
}
