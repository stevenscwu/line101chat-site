"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, Clock3, Download, LoaderCircle, Save } from "lucide-react";
import { MAX_LESSON_BYTES, validateLesson, type Lesson } from "@/lib/materials";

const LIBRARY_KEY = "daily-practice-library-v1";
const MAX_LIBRARY_BYTES = 1024 * 1024;
type TransferState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; lesson: Lesson; expiresAt: Date };

function downloadLesson(lesson: Lesson) {
  const blob = new Blob([JSON.stringify(validateLesson(lesson))], { type: "application/json;charset=utf-8" });
  if (blob.size > MAX_LESSON_BYTES) throw new Error("Lesson exceeds the file size limit.");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const title = lesson.title.normalize("NFKC").replace(/[^\p{L}\p{N}._ -]/gu, "").trim().slice(0, 80) || "lesson";
  anchor.href = url;
  anchor.download = `${title}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function TransferReceiver() {
  const [state, setState] = useState<TransferState>({ status: "loading" });
  const [notice, setNotice] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let controller: AbortController | undefined;
    async function receive() {
      controller?.abort();
      const request = new AbortController();
      controller = request;
      setState({ status: "loading" });
      setNotice(null);
      const token = window.location.hash.slice(1);
      if (!/^[a-f0-9]{64}$/.test(token)) {
        setState({ status: "error", message: "This transfer link is incomplete or invalid. Open the entire link shared from the lesson editor, including the part after #." });
        return;
      }
      try {
        const response = await fetch(`/api/transfers/${token}`, { cache: "no-store", credentials: "omit", signal: request.signal });
        if (request.signal.aborted) return;
        if (!response.ok) {
          const message = response.status === 404 || response.status === 410
            ? "This lesson link has expired or is no longer available. Ask the sender to create a new transfer link."
            : response.status === 429
              ? "There have been too many requests. Wait a moment, then reload this page."
              : "The lesson could not be received right now. Try reloading this page, or ask the sender for the lesson JSON file.";
          setState({ status: "error", message });
          return;
        }
        const text = await response.text();
        if (request.signal.aborted) return;
        if (new TextEncoder().encode(text).byteLength > MAX_LESSON_BYTES + 4096) throw new Error("Invalid transfer size");
        const payload: unknown = JSON.parse(text);
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("Invalid transfer");
        const input = payload as Record<string, unknown>;
        const lesson = validateLesson(input.lesson);
        if (typeof input.expiresAt !== "string" && typeof input.expiresAt !== "number") throw new Error("Missing expiry");
        const expiresAt = new Date(input.expiresAt);
        if (!Number.isFinite(expiresAt.getTime())) throw new Error("Invalid expiry");
        if (expiresAt.getTime() <= Date.now()) {
          setState({ status: "error", message: "This lesson link has expired. Ask the sender to create a new transfer link." });
          return;
        }
        if (!request.signal.aborted) setState({ status: "ready", lesson, expiresAt });
      } catch {
        if (!request.signal.aborted) {
          setState({ status: "error", message: "We couldn't open this lesson. Check your connection and try again, or ask the sender for a new link or lesson JSON file." });
        }
      }
    }
    const onHashChange = () => { void receive(); };
    window.addEventListener("hashchange", onHashChange);
    void receive();
    return () => {
      controller?.abort();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  function saveToLibrary() {
    if (state.status !== "ready") return;
    try {
      const stored = localStorage.getItem(LIBRARY_KEY);
      if (stored && new TextEncoder().encode(stored).byteLength > MAX_LIBRARY_BYTES) {
        setNotice({ kind: "error", message: "Your browser library is too large to update safely. Download this lesson and manage your library from the home page." });
        return;
      }
      const decoded: unknown = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(decoded)) throw new Error("Invalid library");
      const lessons = decoded.map(validateLesson);
      if (lessons.length > 20 || new Set(lessons.map(lesson => lesson.id)).size !== lessons.length) throw new Error("Invalid library");
      const replacesExisting = lessons.some((lesson) => lesson.id === state.lesson.id);
      const previous = lessons.find((lesson) => lesson.id === state.lesson.id);
      if (previous && JSON.stringify(previous) !== JSON.stringify(state.lesson) && !window.confirm(`Replace the saved copy of “${previous.title}” with this received lesson? Download the saved copy first if you want to keep both versions.`)) return;
      const next = [state.lesson, ...lessons.filter((lesson) => lesson.id !== state.lesson.id)];
      if (next.length > 20) {
        setNotice({ kind: "error", message: "Your browser library holds up to 20 lessons. Remove a lesson from the home page, or download this one to keep it." });
        return;
      }
      const serialized = JSON.stringify(next);
      if (new TextEncoder().encode(serialized).byteLength > MAX_LIBRARY_BYTES) {
        setNotice({ kind: "error", message: "This lesson would exceed the browser library's 1 MB limit. Download it, or remove an older lesson first." });
        return;
      }
      localStorage.setItem(LIBRARY_KEY, serialized);
      setNotice({ kind: "success", message: `Saved to this browser's library. Open your library to start practising.${replacesExisting ? " The existing lesson with the same ID has been replaced." : ""}` });
    } catch {
      setNotice({ kind: "error", message: "We couldn't update your browser library. Browser storage may be blocked, full, or contain unreadable data. Your existing library has been kept; download the lesson instead." });
    }
  }

  return (
    <main className="transfer-page">
      <Link href="/" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> Back to Daily Practice</Link>
      <section className="transfer-card" aria-labelledby="transfer-title">
        <div className="transfer-icon"><BookOpen size={28} aria-hidden="true" /></div>
        <p className="eyebrow">YOUR NEXT LESSON</p>
        <h1 id="transfer-title">Receive a little progress.</h1>
        {state.status === "loading" && <p className="form-message" role="status"><LoaderCircle size={18} aria-hidden="true" /> Opening your lesson…</p>}
        {state.status === "error" && <p className="form-message error" role="alert">{state.message}</p>}
        {state.status === "ready" && <>
          <h2>{state.lesson.title}</h2>
          <div className="transfer-meta">
            <span>{state.lesson.targetLanguage === "ja-JP" ? "Japanese" : "English"}</span>
            {state.lesson.level && <span>{state.lesson.level}</span>}
            <span>{state.lesson.sentences.length} practice {state.lesson.sentences.length === 1 ? "line" : "lines"}</span>
          </div>
          {state.lesson.topic && <p className="muted">{state.lesson.topic}</p>}
          <p className="muted"><Clock3 size={15} aria-hidden="true" /> Link expires {state.expiresAt.toLocaleString()} (your local time).</p>
          <p>Save this lesson to practise in this browser, or download its JSON file and import it in the Android app.</p>
          <div className="transfer-actions">
            <button className="button primary" onClick={saveToLibrary}><Save size={17} aria-hidden="true" /> Save to browser library</button>
            <button className="button secondary" onClick={() => {
              try { downloadLesson(state.lesson); } catch { setNotice({ kind: "error", message: "The download couldn't start. Try a different browser or save the lesson to your browser library." }); }
            }}><Download size={17} aria-hidden="true" /> Download lesson JSON</button>
          </div>
          <p className="muted">This page does not save the lesson until you choose an action. Browser saves stay on this device and can be lost if you clear site data.</p>
        </>}
        {notice && <p className={`form-message ${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"}>
          {notice.kind === "success" && <CheckCircle2 size={17} aria-hidden="true" />}{notice.message}
        </p>}
        {notice?.kind === "success" && <Link href="/" className="button secondary">Open my library <ArrowLeft size={16} aria-hidden="true" /></Link>}
      </section>
    </main>
  );
}
