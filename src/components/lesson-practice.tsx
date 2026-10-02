"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Eye, EyeOff, Volume2, Square, X } from "lucide-react";
import type { Lesson } from "@/lib/materials";

const PROGRESS_KEY = "daily-practice-progress-v1";
const MAX_PROGRESS_BYTES = 1024 * 1024;
type LessonPracticeProps = {
  lesson: Lesson;
  onClose: () => void;
  onProgress?: (completed: number) => void;
};

function readProgress(): Record<string, string[]> {
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (!stored) return {};
  if (new TextEncoder().encode(stored).byteLength > MAX_PROGRESS_BYTES) throw new Error("Progress storage is too large");
  const value: unknown = JSON.parse(stored);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid progress");
  for (const ids of Object.values(value)) {
    if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) throw new Error("Invalid progress IDs");
  }
  return value as Record<string, string[]>;
}

export function LessonPractice({ lesson, onClose, onProgress }: LessonPracticeProps) {
  const titleId = useId();
  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [rate, setRate] = useState(1);
  const [completed, setCompleted] = useState<string[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [speech, setSpeech] = useState<{ supported: boolean; voices: SpeechSynthesisVoice[] } | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onCloseRef = useRef(onClose);
  const onProgressRef = useRef(onProgress);
  const row = lesson.sentences[Math.min(index, lesson.sentences.length - 1)];
  const currentIds = new Set(lesson.sentences.map((sentence) => sentence.id));
  const completedCount = new Set(completed.filter((id) => currentIds.has(id))).size;
  const finished = completedCount === lesson.sentences.length;
  const voice = speech?.voices.find((item) => item.lang.toLowerCase() === lesson.targetLanguage.toLowerCase())
    ?? speech?.voices.find((item) => item.lang.toLowerCase().startsWith(lesson.targetLanguage.slice(0, 2)));

  useEffect(() => {
    onCloseRef.current = onClose;
    onProgressRef.current = onProgress;
  }, [onClose, onProgress]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setIndex(0);
      setShowMeaning(false);
      setSpeaking(false);
      setSpeechError(null);
      try {
        const saved = readProgress();
        const allowed = new Set(lesson.sentences.map((sentence) => sentence.id));
        const ids = [...new Set((Object.hasOwn(saved, lesson.id) ? saved[lesson.id] : []).filter((id) => allowed.has(id)))];
        setCompleted(ids);
        setStorageError(null);
        onProgressRef.current?.(ids.length);
      } catch {
        setCompleted([]);
        setStorageError("Saved progress couldn't be read. You can practise now; progress may only last for this session.");
      }
    });
    return () => {
      active = false;
      utteranceRef.current = null;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [lesson]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function trapFocus(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hidden && element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) {
        event.preventDefault();
        dialogRef.current.focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", trapFocus);
    return () => {
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  useEffect(() => {
    let active = true;
    const supported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    const updateVoices = () => {
      if (active) setSpeech({ supported, voices: supported ? window.speechSynthesis.getVoices() : [] });
    };
    queueMicrotask(updateVoices);
    if (supported) window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    return () => {
      active = false;
      if (supported) window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
    };
  }, []);

  function stopPlayback() {
    utteranceRef.current = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function listen() {
    if (speaking) { stopPlayback(); return; }
    if (!speech?.supported) {
      setSpeechError("This browser doesn't support spoken playback. You can still read and practise each line.");
      return;
    }
    const availableVoices = window.speechSynthesis.getVoices();
    const selected = availableVoices.find((item) => item.lang.toLowerCase() === lesson.targetLanguage.toLowerCase())
      ?? availableVoices.find((item) => item.lang.toLowerCase().startsWith(lesson.targetLanguage.slice(0, 2)));
    if (!selected) {
      setSpeechError(`No ${lesson.targetLanguage === "ja-JP" ? "Japanese" : "English"} voice is available yet. Enable a voice for this language in your device's speech settings, then reopen practice.`);
      return;
    }
    try {
      stopPlayback();
      const utterance = new SpeechSynthesisUtterance(row.text);
      utterance.lang = lesson.targetLanguage;
      utterance.voice = selected;
      utterance.rate = rate;
      utteranceRef.current = utterance;
      utterance.onend = () => {
        if (utteranceRef.current === utterance) { utteranceRef.current = null; setSpeaking(false); }
      };
      utterance.onerror = (event) => {
        if (utteranceRef.current !== utterance) return;
        utteranceRef.current = null;
        setSpeaking(false);
        if (event.error !== "canceled" && event.error !== "interrupted") {
          setSpeechError("Playback couldn't finish. Check your device's sound and speech settings, then try Listen again. Some voices need an internet connection.");
        }
      };
      setSpeechError(null);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      utteranceRef.current = null;
      setSpeaking(false);
      setSpeechError("Playback couldn't start. Try another browser or check your device's speech settings.");
    }
  }

  function moveTo(next: number) {
    stopPlayback();
    setSpeechError(null);
    setShowMeaning(false);
    setIndex(Math.max(0, Math.min(next, lesson.sentences.length - 1)));
  }

  function markPractised() {
    const ids = [...new Set([...completed, row.id])].filter((id) => currentIds.has(id));
    try {
      const saved = readProgress();
      const previousIds = Object.hasOwn(saved, lesson.id) ? saved[lesson.id] : [];
      const merged = [...new Set([...previousIds, ...ids])].filter((id) => currentIds.has(id));
      const serialized = JSON.stringify({ ...saved, [lesson.id]: merged });
      if (new TextEncoder().encode(serialized).byteLength > MAX_PROGRESS_BYTES) throw new Error("Progress storage is full");
      localStorage.setItem(PROGRESS_KEY, serialized);
      setCompleted(merged);
      setStorageError(null);
      onProgressRef.current?.(merged.length);
    } catch {
      setCompleted(ids);
      setStorageError("Marked for this session only. Browser storage is unavailable, full, or unreadable; this progress couldn't be saved.");
      onProgressRef.current?.(ids.length);
    }
  }

  const hasMeaning = Boolean(row.english || row.chinese || row.japaneseTranslation || row.topic);

  return (
    <div className="modal-backdrop">
      <section ref={dialogRef} className="practice-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <header className="practice-header">
          <div><p className="eyebrow">A LITTLE EVERY DAY</p><h2 id={titleId}>{lesson.title}</h2></div>
          <button ref={closeRef} className="icon-button" onClick={onClose} aria-label="Close practice"><X size={21} aria-hidden="true" /></button>
        </header>
        <div className="practice-progress">
          <span>{lesson.targetLanguage === "ja-JP" ? "Japanese" : "English"}{lesson.level ? ` · ${lesson.level}` : ""}</span>
          <span aria-live="polite">{completedCount} of {lesson.sentences.length} practised</span>
          <progress value={completedCount} max={lesson.sentences.length} aria-label="Lesson practice progress" />
        </div>
        <div className="practice-sentence" aria-live="polite" aria-atomic="true">
          <p className="eyebrow">LINE {index + 1} OF {lesson.sentences.length}{row.speaker ? ` · ${row.speaker}` : ""}</p>
          <p className="practice-text" lang={lesson.targetLanguage}>{row.text}</p>
          <p className="muted">Listen, pause, and say it in your own voice.</p>
        </div>
        <div className="practice-controls">
          <button className="button primary" onClick={listen} disabled={speech?.supported === false} aria-pressed={speaking}>
            {speaking ? <Square size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}{speaking ? "Stop" : "Listen"}
          </button>
          <div className="speed-control" role="group" aria-label="Playback speed">
            {[0.75, 1].map((speed) => <button key={speed} className={`button secondary ${rate === speed ? "active" : ""}`} aria-pressed={rate === speed} onClick={() => { stopPlayback(); setRate(speed); }}>{speed === 1 ? "1× Normal" : "0.75× Slow"}</button>)}
          </div>
        </div>
        <p className="muted speech-status" role="status">{speech === null ? "Checking spoken playback…" : !speech.supported ? "Spoken playback is not supported in this browser. Read each line aloud to practise." : voice ? `Voice: ${voice.name}. Availability depends on your device.` : `No ${lesson.targetLanguage === "ja-JP" ? "Japanese" : "English"} voice is available yet. Try Listen after voices load, or enable one in your device's speech settings.`}</p>
        {speechError && <p className="form-message error" role="alert">{speechError}</p>}
        <button className="button secondary meaning-toggle" onClick={() => setShowMeaning(!showMeaning)} aria-expanded={showMeaning} aria-controls={`${titleId}-meaning`}>
          {showMeaning ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}{showMeaning ? "Hide meaning & context" : "Show meaning & context"}
        </button>
        <div id={`${titleId}-meaning`} className="practice-translations" hidden={!showMeaning}>
          {row.english && <div><span>English</span><p lang="en">{row.english}</p></div>}
          {row.chinese && <div><span>中文</span><p lang="zh-Hant">{row.chinese}</p></div>}
          {row.japaneseTranslation && <div><span>日本語</span><p lang="ja">{row.japaneseTranslation}</p></div>}
          {row.topic && <div><span>Context</span><p>{row.topic}</p></div>}
          {!hasMeaning && <p className="muted">No translations or context were added to this line. You can add them in the lesson editor.</p>}
        </div>
        <div className="practice-mark">
          <button className="button primary" disabled={completed.includes(row.id)} onClick={markPractised}><Check size={18} aria-hidden="true" />{completed.includes(row.id) ? "Practised" : "Mark as practised"}</button>
          <p className="muted">{storageError ? "Progress is tracked for this session." : "Progress is saved in this browser."}</p>
        </div>
        {storageError && <p className="form-message error" role="alert">{storageError}</p>}
        {finished && <div className="practice-complete form-message success" role="status"><CheckCircle2 size={22} aria-hidden="true" /><div><strong>A little progress, made.</strong><p>You&apos;ve practised every line. Repeat a favourite or come back tomorrow.</p></div></div>}
        <footer className="practice-footer">
          <button className="button secondary" onClick={() => moveTo(index - 1)} disabled={index === 0}><ChevronLeft size={17} aria-hidden="true" /> Previous</button>
          {index < lesson.sentences.length - 1
            ? <button className="button secondary" onClick={() => moveTo(index + 1)}>Next line <ChevronRight size={17} aria-hidden="true" /></button>
            : <button className="button secondary" onClick={onClose}>Back to library <Check size={17} aria-hidden="true" /></button>}
        </footer>
      </section>
    </div>
  );
}
