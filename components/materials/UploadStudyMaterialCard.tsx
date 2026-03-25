"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { LoaderCircle, UploadCloud } from "lucide-react";
import { PrimaryActionButton } from "@/components/shared/PrimaryActionButton";
import type { MaterialUploadResult } from "@/lib/materials/types";

interface UploadStudyMaterialCardProps {
  onUploaded?: (result: MaterialUploadResult) => void;
}

const acceptValue =
  ".pdf,.png,.jpg,.jpeg,.webp,.gif,.txt,.md,.csv,.json";

export function UploadStudyMaterialCard({ onUploaded }: UploadStudyMaterialCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    setMessage(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/materials/upload", {
        method: "POST",
        body: formData
      });

      const payload = (await response.json()) as
        | MaterialUploadResult
        | { message?: string };

      if (!response.ok || !("ok" in payload) || !payload.ok) {
        setError(payload.message ?? "上傳失敗，請稍後再試。");
        return;
      }

      setMessage(payload.message);
      onUploaded?.(payload);
    } catch {
      setError("上傳中斷，請確認網路後再試。");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      void uploadFile(file);
    }
  }

  function onChooseFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    void uploadFile(file);
    event.target.value = "";
  }

  return (
    <section className="rounded-3xl border border-cyan-400/35 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-black text-white">上傳學習素材</p>
          <p className="mt-1 text-base text-slate-300">
            支援 PDF、圖片、純文字。系統會抽取句型、單字與可練習片段。
          </p>
        </div>
        <UploadCloud className="h-9 w-9 text-cyan-200" />
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={onDrop}
        className={`mt-5 rounded-3xl border px-4 py-8 text-center transition ${
          dragActive
            ? "border-cyan-300 bg-cyan-500/20"
            : "border-cyan-400/35 bg-slate-950/55"
        }`}
      >
        <p className="text-3xl font-bold text-cyan-100">
          拖曳檔案到這裡，或點擊選擇檔案
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={acceptValue}
          onChange={onChooseFile}
          className="hidden"
          aria-label="選擇素材檔案"
        />

        <PrimaryActionButton
          className="mt-7 text-lg"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              上傳中...
            </span>
          ) : (
            "選擇檔案"
          )}
        </PrimaryActionButton>
      </div>

      {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}
