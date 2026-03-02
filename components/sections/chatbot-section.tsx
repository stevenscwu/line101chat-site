"use client";

import { useState } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

// Replace this file when the LINE QR code changes.
const qrCodeImagePath = "/images/chatbot-line-qr.svg";

const prompts = [
  "Explain the pipeline / 說明流程架構",
  "What is DevSecOps? / 什麼是 DevSecOps？",
  "Summarize results / 摘要實驗結果",
  "Compare SAST and DAST / 比較 SAST 與 DAST",
  "Security implications / 安全影響分析"
];

export function ChatbotSection() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Ask about the thesis architecture, cloud technologies, SAST/DAST triage, or enterprise adoption. / 你可以詢問論文架構、雲端技術、SAST/DAST 分流，或企業導入情境。"
    }
  ]);

  const ask = async (text?: string) => {
    const userInput = (text ?? query).trim();
    if (!userInput) return;

    setMessages((prev) => [...prev, { role: "user", text: userInput }]);
    setQuery("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userInput })
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer ?? "No answer generated. / 尚未產生回答。" }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "The demo API is unavailable. Check local server and environment settings. / 目前示範 API 無法使用，請檢查本機伺服器與環境設定。"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      id="chatbot"
      eyebrow="AI Thesis Assistant / AI 論文助理"
      title="Interactive Chatbot Demo / 互動式聊天機器人展示"
      description="This interface demonstrates a retrieval-augmented assistant grounded in thesis materials, and includes a dedicated LINE QR code area for adding the chatbot. / 本介面展示以論文資料為基礎之檢索增強助理，並提供 LINE 加好友 QR Code 專區。"
      className="bg-slate-50 dark:bg-slate-950"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal>
          <aside className="glass-card rounded-2xl p-6 lg:col-span-1">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              Suggested Prompts / 建議提問
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => ask(prompt)}
                  className="rounded-full border border-brand-200 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50 dark:border-brand-500/40 dark:text-brand-300 dark:hover:bg-brand-500/10"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                RAG Placeholder Stack / RAG 示意流程
              </p>
              <ul className="mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                <li>1. Document ingestion and chunking / 文件匯入與切塊</li>
                <li>2. Embedding generation / 向量嵌入生成</li>
                <li>3. Vector retrieval / 向量檢索</li>
                <li>4. LLM response synthesis / 語言模型回應合成</li>
              </ul>
            </div>
            <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50/60 p-4 text-sm dark:border-brand-500/40 dark:bg-brand-500/10">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                LINE Chatbot QR Code / LINE 聊天機器人加好友 QR Code
              </p>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Scan the QR code below to befriend the chatbot. Replace the image file when your official LINE QR code
                changes. / 掃描下方 QR Code 即可加入聊天機器人；若 LINE 官方 QR Code 變更，請直接替換該圖片檔案。
              </p>
              <div className="mt-3 flex justify-center rounded-lg bg-white p-3 dark:bg-slate-900">
                <Image
                  src={qrCodeImagePath}
                  alt="LINE chatbot QR code / LINE 聊天機器人 QR Code"
                  width={176}
                  height={176}
                  className="h-44 w-44 rounded-md border border-slate-200 object-contain dark:border-slate-700"
                />
              </div>
            </div>
          </aside>
        </Reveal>

        <Reveal>
          <div className="glass-card rounded-2xl p-4 lg:col-span-2">
            <div className="h-[28rem] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              {messages.map((message, idx) => (
                <div key={`${message.role}-${idx}`} className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <p
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-7 ${
                      message.role === "user"
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
              {loading && <p className="text-sm text-slate-500">Generating answer... / 正在產生回答...</p>}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void ask();
              }}
              className="mt-3 flex gap-2"
            >
              <label htmlFor="chat-input" className="sr-only">
                Ask thesis assistant / 詢問論文助理
              </label>
              <input
                id="chat-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask a question about the thesis... / 請輸入論文相關問題..."
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send / 送出
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
