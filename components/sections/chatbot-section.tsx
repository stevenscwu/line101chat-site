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
  "Give me a 30-minute Japanese study plan for tonight.",
  "Rewrite this post in a warm 50+ creator voice.",
  "Turn today's lesson into a Reel + Shorts script.",
  "How can I monetize this week with my IT background?",
  "Draft a channel bio for a senior man learning Japanese."
];

export function ChatbotSection() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "I can help you with Japanese study routines, content scripts, social messaging, and weekly monetization actions for your 50+ IT creator identity."
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
        { role: "assistant", text: data.answer ?? "No answer generated yet." }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "The demo API is unavailable. Check local server and environment settings."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      id="chatbot"
      eyebrow="AI Creator Coach"
      title="Japanese Learning + Content + Monetization Assistant"
      description="Use this coach to draft scripts, plan study sessions, create platform-specific posts, and map your weekly actions to family-support income goals."
      className="bg-slate-50 dark:bg-slate-950"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal>
          <aside className="glass-card rounded-2xl p-6 lg:col-span-1">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
              Suggested Prompts
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
                Coaching Stack
              </p>
              <ul className="mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                <li>1. Japanese study planning</li>
                <li>2. Content idea conversion</li>
                <li>3. Platform-tailored messaging</li>
                <li>4. Monetization action suggestions</li>
              </ul>
            </div>
            <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50/60 p-4 text-sm dark:border-brand-500/40 dark:bg-brand-500/10">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                LINE Community QR Code
              </p>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Scan to join the learning community and receive weekly updates. Replace this image when your official
                LINE QR code changes.
              </p>
              <div className="mt-3 flex justify-center rounded-lg bg-white p-3 dark:bg-slate-900">
                <Image
                  src={qrCodeImagePath}
                  alt="LINE community QR code"
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
              {loading && <p className="text-sm text-slate-500">Generating answer...</p>}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void ask();
              }}
              className="mt-3 flex gap-2"
            >
              <label htmlFor="chat-input" className="sr-only">
                Ask AI creator coach
              </label>
              <input
                id="chat-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask about Japanese learning, content, or monetization..."
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
