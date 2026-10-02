"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowRight, Check, ChevronRight, FileText, FolderOpen, Globe2, Layers3, Link2, Pencil, Plus, Search, Smartphone, Trash2, Upload, X } from "lucide-react";
import { createLesson, LEVELS, MAX_LESSON_BYTES, parseLesson, SAMPLE_LESSONS, validateLesson, type Lesson, type LessonSentence, type TargetLanguage } from "@/lib/materials";
import { LessonPractice } from "./lesson-practice";

const LIBRARY_KEY = "daily-practice-library-v1";
const langName = (lang: TargetLanguage) => lang === "ja-JP" ? "Japanese" : "English";
function message(error: unknown) { return error instanceof Error ? error.message : "Something went wrong. Please try again."; }
function download(lesson: Lesson) {
  const blob = new Blob([JSON.stringify(validateLesson(lesson))], { type: "application/json" });
  if (blob.size > MAX_LESSON_BYTES) throw new Error("The lesson is too large to export. Shorten its text or notes.");
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = `${lesson.title.replace(/[^\p{L}\p{N} _-]/gu, "").slice(0, 65) || "lesson"}.json`;
  a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function StudyDesk() {
  const [library, setLibrary] = useState<Lesson[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("");
  const [language, setLanguage] = useState<TargetLanguage>("ja-JP");
  const [source, setSource] = useState("");
  const [title, setTitle] = useState("");
  const [draft, setDraft] = useState<Lesson | null>(null);
  const [practising, setPractising] = useState<Lesson | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [reading, setReading] = useState(false);
  const [transfer, setTransfer] = useState<Lesson | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLElement>(null);
  const editorRef = useRef<HTMLElement>(null);
  const libraryReadable = useRef(false);
  const librarySnapshot = useRef<string | null>(null);
  const draftId = draft?.id;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LIBRARY_KEY);
      if (stored && new Blob([stored]).size > 1024 * 1024) throw new Error("Library is too large.");
      const saved = JSON.parse(stored || "[]");
      if (!Array.isArray(saved) || saved.length > 20) throw new Error("Invalid library.");
      const lessons = saved.map(validateLesson);
      if (new Set(lessons.map(lesson => lesson.id)).size !== lessons.length) throw new Error("Duplicate lesson IDs.");
      librarySnapshot.current = stored;
      libraryReadable.current = true;
      setLibrary(lessons);
    } catch { setError("Your saved library could not be read. Existing browser data has been left in place. Download any lessons you can open before resetting browser data."); }
    setLoaded(true);
  }, []);
  useEffect(() => { if (draftId) editorRef.current?.focus(); }, [draftId]); // Move focus only when opening a different draft.

  function save(next: Lesson[]) {
    if (!libraryReadable.current) throw new Error("Your saved library could not be read, so it has not been overwritten. Download this draft to keep your work before recovering browser data.");
    if (localStorage.getItem(LIBRARY_KEY) !== librarySnapshot.current) throw new Error("Your library changed in another tab. Download this draft, then reload this page before saving to avoid losing those changes.");
    const data = JSON.stringify(next);
    if (next.length > 20 || new Blob([data]).size > 1024 * 1024) throw new Error("This browser library holds 20 lessons / 1 MB. Download and remove an older lesson first.");
    localStorage.setItem(LIBRARY_KEY, data); librarySnapshot.current = data; setLibrary(next);
  }
  function prepare(lesson: Lesson) {
    if (draft && !window.confirm("Replace the open draft and discard its unsaved changes? Download it first if you want to keep it.")) return;
    setError(""); setNotice(""); setDraft(structuredClone(lesson));
  }
  async function readFile(file?: File) {
    if (!file) return;
    setError(""); setReading(true);
    try {
      if (file.size > MAX_LESSON_BYTES) throw new Error("Choose a text or lesson file under 256 KB.");
      const text = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
      prepare(parseLesson(text, file.name, language));
    } catch (e) { setError(message(e)); } finally { setReading(false); if (fileInput.current) fileInput.current.value = ""; }
  }
  function commitDraft() {
    if (!draft) return;
    try {
      const previous = library.find(item => item.id === draft.id);
      const lesson = validateLesson({ ...draft, sentences: draft.sentences.map(line => {
        const before = previous?.sentences.find(item => item.id === line.id);
        return before && (before.text !== line.text || previous?.targetLanguage !== draft.targetLanguage)
          ? { ...line, id: crypto.randomUUID() } : line;
      }) });
      const index = library.findIndex(item => item.id === lesson.id);
      save(index < 0 ? [lesson, ...library] : library.map(item => item.id === lesson.id ? lesson : item));
      setDraft(null); setSource(""); setTitle(""); setError(""); setNotice(`“${lesson.title}” is saved in this browser. It is ready to practise.`);
      document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
    } catch (e) { setError(message(e)); }
  }
  function remove(lesson: Lesson) {
    if (!window.confirm(`Remove “${lesson.title}” from this browser? Download a copy first if you want to keep it.`)) return;
    try { save(library.filter(item => item.id !== lesson.id)); setNotice("Lesson removed from this browser."); setError(""); } catch (e) { setError(message(e)); }
  }
  function splitLine(index: number, position: number) {
    if (!draft) return;
    const line = draft.sentences[index];
    const first = line.text.slice(0, position).trim();
    const second = line.text.slice(position).trim();
    if (!first || !second) { setError("Place the cursor between two parts of a line before splitting."); return; }
    if (draft.sentences.length >= 200) { setError("A lesson can contain up to 200 lines."); return; }
    const rows = [...draft.sentences];
    rows.splice(index, 1, { ...line, text: first }, { ...line, id: crypto.randomUUID(), text: second, english: "", chinese: "", japaneseTranslation: "" });
    setDraft({ ...draft, sentences: rows });
    setError("");
    setNotice(line.english || line.chinese || line.japaneseTranslation ? "Line split. Existing meanings stay with the first part; review them and add meanings for the second part." : "Line split. Speaker and context are kept on both parts.");
  }
  function mergeLine(index: number) {
    if (!draft) return;
    const line = draft.sentences[index], next = draft.sentences[index + 1];
    if (!next) return;
    if ((line.speaker && next.speaker && line.speaker !== next.speaker) || (line.topic && next.topic && line.topic !== next.topic)) {
      setError("These lines have different speakers or context. Edit those labels before joining them."); return;
    }
    const combined: LessonSentence = {
      ...line,
      text: `${line.text} ${next.text}`.trim(),
      english: [line.english, next.english].filter(Boolean).join(" "),
      chinese: [line.chinese, next.chinese].filter(Boolean).join(" "),
      japaneseTranslation: [line.japaneseTranslation, next.japaneseTranslation].filter(Boolean).join(" "),
      speaker: line.speaker || next.speaker,
      topic: line.topic || next.topic,
    };
    if (Array.from(combined.text).length > 300) { setError("Combined lines must fit within 300 characters."); return; }
    if ([combined.english, combined.chinese, combined.japaneseTranslation].some(value => value.length > 2000)) {
      setError("Combined meanings must fit within 2,000 characters each. Shorten them before joining these lines."); return;
    }
    const rows = [...draft.sentences]; rows.splice(index, 2, combined);
    setDraft({ ...draft, sentences: rows }); setError("");
  }
  const visible = library.filter(lesson => (filter === "all" || lesson.targetLanguage === filter) && (!levelFilter || lesson.level === levelFilter) && `${lesson.title} ${lesson.topic} ${lesson.level}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const totalLines = library.reduce((sum, lesson) => sum + lesson.sentences.length, 0);

  return <main id="main" className="desk">
    <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> YOUR EVERYDAY LANGUAGE COMPANION</div><h1>A little language.<br /><em>A little every day.</em></h1><p>Your notes, your stories, your next conversation.<br className="desktop-break" /> Turn the things you want to learn into lessons you’ll return to.</p><div className="hero-actions"><button className="primary" onClick={() => { importRef.current?.scrollIntoView({ behavior: "smooth" }); document.getElementById("source-title")?.focus({ preventScroll: true }); }}><Plus size={18} /> Add your material</button><button className="text-button" onClick={() => setPractising(SAMPLE_LESSONS[0])}>Try a sample lesson <ArrowRight size={17} /></button></div><div className="language-tags"><span><i className="japan-dot" /> Japanese <span className="native">日本語</span></span><span><Globe2 size={14} /> English</span><span className="quiet">Made for your own pace.</span></div></div>
      <div className="hero-art" aria-label="Preview of a Japanese practice card"><div className="paper-back" /><div className="lesson-preview"><div className="preview-top"><span>今日のひとこと</span><span>01 / 04</span></div><span className="preview-label">A LITTLE CONVERSATION</span><p className="preview-japanese" lang="ja">週末は何を<br />したいですか。</p><p className="preview-translation">What would you like to do this weekend?</p><div className="preview-bottom"><span className="waveform" aria-hidden="true">▂ ▅ ▃ ▇ ▄ ▆ ▂ ▅ ▃ ▆ ▄ ▂</span><span>Listen. Repeat. Make it yours.</span></div></div><div className="floating-note"><Check size={16} /><span>One sentence at a time.</span></div><span className="art-caption">A SMALL STEP IS STILL A STEP.</span></div>
    </section>
    <div className="desk-divider"><span>YOUR STUDY DESK</span><span>Prepare here. Practise anywhere.</span></div>
    {error && <div className="form-message error" role="alert">{error}<button aria-label="Dismiss error" onClick={() => setError("")}><X size={16} /></button></div>}
    {notice && <div className="form-message success" role="status"><Check size={18} />{notice}<button aria-label="Dismiss message" onClick={() => setNotice("")}><X size={16} /></button></div>}
    <div className="workspace-grid">
      <section id="library" className="library-panel"><div className="section-heading"><div><span className="eyebrow">COLLECT · ORGANIZE · RETURN</span><h2>Your lesson library</h2></div><span className="count-badge">{library.length} {library.length === 1 ? "lesson" : "lessons"}</span></div>
        <div className="library-toolbar"><div className="filter-tabs" role="group" aria-label="Filter by language">{[["all", "All lessons"], ["ja-JP", "Japanese"], ["en-US", "English"]].map(([value, label]) => <button key={value} aria-pressed={filter === value} className={filter === value ? "active" : ""} onClick={() => { setFilter(value); setLevelFilter(""); }}>{label}</button>)}</div><label className="search"><Search size={16} /><input aria-label="Search lessons by title, topic or level" value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a lesson…" /></label></div>
        <div className="library-subline"><span><Layers3 size={14} /> {totalLines} practice lines in your library</span><select aria-label="Filter by level" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}><option value="">All levels</option>{[...new Set(library.filter(l => filter === "all" || l.targetLanguage === filter).map(l => l.level).filter(Boolean))].sort().map(level => <option key={level}>{level}</option>)}</select></div>
        {!loaded ? <div className="empty-library">Loading your browser library…</div> : visible.length ? <div className="lesson-list">{visible.map(lesson => <article className="library-card" key={lesson.id}><div className={`lesson-symbol ${lesson.targetLanguage === "en-US" ? "english-symbol" : ""}`}>{lesson.targetLanguage === "ja-JP" ? "あ" : "Aa"}</div><div className="lesson-card-content"><div className="lesson-meta">{langName(lesson.targetLanguage)}<span>·</span>{lesson.level || "Your level"}{lesson.topic && <><span>·</span>{lesson.topic}</>}</div><h3>{lesson.title}</h3><p>{lesson.sentences.length} lines <span>·</span> About {Math.max(1, Math.ceil(lesson.sentences.length * 0.5))} min</p><div className="card-actions"><button className="practice-link" onClick={() => setPractising(lesson)}>Start practice <ArrowRight size={15} /></button><button aria-label={`Edit ${lesson.title}`} title="Edit lesson" onClick={() => prepare(lesson)}><Pencil size={16} /></button><button aria-label={`Download ${lesson.title}`} title="Download JSON" onClick={() => { try { download(lesson); } catch (e) { setError(message(e)); } }}><ArrowDownToLine size={16} /></button><button aria-label={`Send ${lesson.title} to Android`} title="Send to Android" onClick={() => setTransfer(lesson)}><Smartphone size={16} /></button><button aria-label={`Remove ${lesson.title}`} title="Remove from browser" onClick={() => remove(lesson)}><Trash2 size={16} /></button></div></div></article>)}</div> : <div className="empty-library"><div className="empty-icon"><FolderOpen size={30} strokeWidth={1.3} /></div><h3>{library.length ? "No matching lessons" : "A fresh page for your learning."}</h3><p>{library.length ? "Try a different language, level or search." : "Add your first material, or make yourself at home with a sample below."}</p></div>}
        <div className="local-note"><span className="live-dot" /> Saved on this browser · Download a copy to keep your lessons.</div>
        <div className="samples-heading"><h3>A place to begin</h3><span>Two small lessons, on us.</span></div><div className="sample-grid">{SAMPLE_LESSONS.map(sample => <button className="sample-card" key={sample.id} onClick={() => prepare({ ...sample, id: crypto.randomUUID() })}><span className={`sample-script ${sample.targetLanguage === "en-US" ? "english" : ""}`}>{sample.targetLanguage === "ja-JP" ? "週末" : "Hello."}</span><span><small>{langName(sample.targetLanguage)} · {sample.level}</small><strong>{sample.title}</strong><small>{sample.sentences.length} lines · Preview & add</small></span><ChevronRight size={17} /></button>)}</div>
      </section>
      <aside className="upload-panel" ref={importRef}><div className="upload-heading"><div className="icon-tile"><Upload size={21} /></div><div><h2>Bring your material</h2><p>Make something worth practising.</p></div></div><label className="field-label" htmlFor="source-language">I’m learning</label><div className="language-switch" id="source-language" role="group" aria-label="Material language"><button className={language === "ja-JP" ? "selected" : ""} aria-pressed={language === "ja-JP"} onClick={() => setLanguage("ja-JP")}>日本語 <span>Japanese</span></button><button className={language === "en-US" ? "selected" : ""} aria-pressed={language === "en-US"} onClick={() => setLanguage("en-US")}>Aa <span>English</span></button></div>
        <input ref={fileInput} type="file" accept=".txt,.md,.json,text/plain,text/markdown,application/json" className="visually-hidden" aria-label="Choose learning material" onChange={e => void readFile(e.target.files?.[0])} />
        <button disabled={reading} className={`drop-zone ${dragging ? "dragging" : ""}`} onClick={() => fileInput.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length !== 1) setError("Add one lesson file at a time."); else void readFile(e.dataTransfer.files[0]); }}><FileText size={28} strokeWidth={1.4} /><strong>{reading ? "Reading your material…" : "Drop a file, or browse"}</strong><span>TXT, Markdown or lesson JSON · up to 256 KB</span></button>
        <div className="or-divider"><span />or paste your text<span /></div><label htmlFor="source-title" className="field-label">Lesson title <span>optional</span></label><input id="source-title" value={title} maxLength={120} onChange={e => setTitle(e.target.value)} placeholder="e.g. A conversation at the café" /><label htmlFor="source-text" className="visually-hidden">Your learning material</label><textarea id="source-text" value={source} onChange={e => setSource(e.target.value)} placeholder={language === "ja-JP" ? "今日、何をしましたか。\nPaste a passage, a dialogue, or your notes…" : "Could I have a coffee, please?\nPaste a passage, a dialogue, or your notes…"} rows={5} /><button className="primary full-width" disabled={!source.trim()} onClick={() => { try { prepare(createLesson(source, title.trim() || "Untitled lesson", language)); } catch (e) { setError(message(e)); } }}>Organize into a lesson <ArrowRight size={16} /></button><p className="upload-footnote">Preview and edit every line before saving.<br />For PDF or Word, copy and paste the text.</p>
      </aside>
    </div>
    {draft && <section className="lesson-editor" tabIndex={-1} ref={editorRef} aria-label="Lesson editor"><div className="section-heading"><div><span className="eyebrow">MAKE IT YOURS</span><h2>Shape your lesson</h2><p>Short lines are easier to listen to, say aloud and remember.</p></div><button className="icon-button" aria-label="Close lesson editor" onClick={() => { if (window.confirm("Discard this draft and its unsaved changes?")) setDraft(null); }}><X size={20} /></button></div><div className="editor-fields"><label>Lesson title<input value={draft.title} maxLength={120} onChange={e => setDraft({ ...draft, title: e.target.value })} /></label><label>Language<select value={draft.targetLanguage} onChange={e => setDraft({ ...draft, targetLanguage: e.target.value as TargetLanguage, level: "" })}><option value="ja-JP">Japanese</option><option value="en-US">English</option></select></label><label>Level<select value={draft.level} onChange={e => setDraft({ ...draft, level: e.target.value })}>{LEVELS[draft.targetLanguage].map(level => <option key={level} value={level}>{level || "Not set"}</option>)}</select></label><label>Topic<input value={draft.topic} maxLength={80} placeholder="Travel, everyday life…" onChange={e => setDraft({ ...draft, topic: e.target.value })} /></label></div><div className="editor-subheading"><strong>{draft.sentences.length} practice lines</strong><span>Up to 300 characters each · Labels and meanings are supplied by you.</span></div><div className="editor-lines">{draft.sentences.map((line, index) => <LineEditor key={line.id} line={line} index={index} language={draft.targetLanguage} canMerge={index + 1 < draft.sentences.length} onChange={next => setDraft({ ...draft, sentences: draft.sentences.map((row, i) => i === index ? next : row) })} onRemove={() => setDraft({ ...draft, sentences: draft.sentences.filter((_, i) => i !== index) })} onSplit={position => splitLine(index, position)} onMerge={() => mergeLine(index)} />)}</div><button className="secondary" disabled={draft.sentences.length >= 200} onClick={() => setDraft({ ...draft, sentences: [...draft.sentences, { id: crypto.randomUUID(), text: "", english: "", chinese: "", japaneseTranslation: "", speaker: "", topic: "" }] })}><Plus size={16} /> Add a line</button><details className="original-text"><summary>View original material</summary><pre>{draft.originalText}</pre></details><div className="editor-save"><span>Save to your library on this browser.</span><button className="secondary" onClick={() => { try { download(draft); } catch (e) { setError(message(e)); } }}><ArrowDownToLine size={16} /> Download draft JSON</button><button className="primary" onClick={commitDraft}><Check size={17} /> Save lesson</button></div></section>}
    <section className="companion-strip"><div className="companion-icon"><Smartphone size={26} /></div><div><span className="eyebrow">A BIGGER SCREEN. THE SAME SMALL STEPS.</span><h2>Prepare here. Keep practising on Android.</h2><p>Send a private lesson link to your phone, or download a lesson file. Your recordings stay on your device.</p></div><a href="/guide#android">See how it works <ArrowUpRightIcon /></a></section>
    {practising && <LessonPractice lesson={practising} onClose={() => setPractising(null)} />}
    {transfer && <TransferDialog lesson={transfer} onClose={() => setTransfer(null)} />}
  </main>;
}

function ArrowUpRightIcon() { return <ArrowRight size={17} style={{ transform: "rotate(-35deg)" }} />; }
function LineEditor({ line, index, language, canMerge, onChange, onRemove, onSplit, onMerge }: { line: LessonSentence; index: number; language: TargetLanguage; canMerge: boolean; onChange: (line: LessonSentence) => void; onRemove: () => void; onSplit: (position: number) => void; onMerge: () => void }) {
  const input = useRef<HTMLTextAreaElement>(null);
  return <div className="line-editor"><span className="line-number">{String(index + 1).padStart(2, "0")}</span><div className="line-fields"><textarea ref={input} aria-label={`Practice line ${index + 1}`} lang={language} value={line.text} rows={2} onChange={e => onChange({ ...line, text: e.target.value })} /><div className="line-actions"><span className={Array.from(line.text).length > 300 ? "text-error" : ""}>{Array.from(line.text).length}/300</span><button onClick={() => onSplit(input.current?.selectionStart || 0)}>Split at cursor</button><button disabled={!canMerge} onClick={onMerge}>Join next</button><button onClick={onRemove} aria-label={`Remove line ${index + 1}`}><Trash2 size={14} /></button></div><details><summary>Meanings, speaker & context</summary><div className="translation-fields"><label>{language === "ja-JP" ? "English meaning" : "Japanese meaning"}<input value={language === "ja-JP" ? line.english : line.japaneseTranslation} maxLength={2000} onChange={e => onChange({ ...line, [language === "ja-JP" ? "english" : "japaneseTranslation"]: e.target.value })} /></label><label>Chinese meaning<input value={line.chinese} maxLength={2000} onChange={e => onChange({ ...line, chinese: e.target.value })} /></label><label>Speaker<input value={line.speaker} maxLength={2000} onChange={e => onChange({ ...line, speaker: e.target.value })} /></label><label>Context<input value={line.topic} maxLength={80} onChange={e => onChange({ ...line, topic: e.target.value })} /></label></div></details></div></div>;
}

function TransferDialog({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [result, setResult] = useState<{ url: string; token: string; expiresAt: string } | null>(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [status, setStatus] = useState("");
  const dialog = useRef<HTMLElement>(null);
  useEffect(() => {
    const old = document.activeElement as HTMLElement; dialog.current?.focus();
    const controller = new AbortController();
    fetch("/api/transfers", { signal: controller.signal, cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Unavailable");
        const data = await response.json();
        if (!controller.signal.aborted) setAvailable(data.available === true);
      }).catch(() => { if (!controller.signal.aborted) setAvailable(false); });
    return () => { controller.abort(); old?.focus(); };
  }, []);
  async function create() {
    setBusy(true); setError(""); setStatus("");
    try {
      const body = JSON.stringify({ lesson: validateLesson(lesson) });
      if (new Blob([body]).size > MAX_LESSON_BYTES) throw new Error("This lesson is too close to the 256 KB transfer limit. Download its JSON file, or shorten its text or notes.");
      const res = await fetch("/api/transfers", { method: "POST", headers: { "Content-Type": "application/json" }, body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Transfer unavailable. Please download the lesson instead.");
      if (typeof data.token !== "string" || !/^[a-f0-9]{64}$/.test(data.token) || typeof data.expiresAt !== "string" || !Number.isFinite(Date.parse(data.expiresAt))) throw new Error("The transfer response was incomplete. Download the lesson instead.");
      setResult({ token: data.token, expiresAt: data.expiresAt, url: `${window.location.origin}/transfer#${data.token}` });
    } catch (e) { setError(message(e)); } finally { setBusy(false); }
  }
  async function revoke() { if (!result) return; setBusy(true); setError(""); try { const res = await fetch(`/api/transfers/${result.token}`, { method: "DELETE" }); if (!res.ok) throw new Error("Could not revoke the link. Please try again."); setResult(null); setStatus("Transfer link revoked. The server copy is deleted."); } catch (e) { setError(message(e)); } finally { setBusy(false); } }
  return <div className="modal-backdrop"><section className="transfer-modal" ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="transfer-title" onKeyDown={e => { if (e.key === "Escape" && !busy) onClose(); if (e.key === "Tab") { const items = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input'); if (!items?.length) return; const first = items[0], last = items[items.length - 1]; if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } }}><div className="section-heading"><div><span className="eyebrow">TAKE IT WITH YOU</span><h2 id="transfer-title">Send to Android</h2></div><button className="icon-button" disabled={busy} onClick={onClose} aria-label="Close transfer"><X size={20} /></button></div><p><strong>{lesson.title}</strong> · {lesson.sentences.length} lines</p><p className="muted">Create a private link valid for 48 hours. Your lesson, original text and notes will be uploaded. Anyone with the link can read or delete it.</p>{error && <p className="form-message error" role="alert">{error}</p>}{status && <p role="status" className="form-message success">{status}</p>}{result ? <div className="transfer-result"><label>Private lesson link<input readOnly value={result.url} onFocus={e => e.target.select()} /></label><p className="muted">Expires {new Date(result.expiresAt).toLocaleString()}. In the updated Android app, choose My materials → Import companion link, paste this link, then choose Download and preview.</p><div className="button-row"><button className="primary" onClick={() => { if (!navigator.clipboard) { setError("Select and copy the link manually."); return; } navigator.clipboard.writeText(result.url).then(() => setStatus("Link copied.")).catch(() => setError("Select and copy the link manually.")); }}><Link2 size={16} /> Copy link</button><button className="secondary" disabled={busy} onClick={() => void revoke()}>Revoke link</button></div><p className="muted">Keep this window open if you want to revoke the link. Closing it does not revoke access.</p></div> : <><button className="primary" disabled={!available || busy} onClick={() => void create()}><Smartphone size={16} />{busy ? "Creating link…" : "Create transfer link"}</button>{available === null && <p className="muted">Checking transfer availability…</p>}{available === false && <p className="muted">Private transfers are not available right now. Download the lesson file and import it on your phone.</p>}</>}<div className="transfer-download"><button className="secondary" onClick={() => { try { download(lesson); } catch (e) { setError(message(e)); } }}><ArrowDownToLine size={16} /> Download lesson JSON</button><a href="/guide#android">Android import guide</a></div></section></div>;
}
