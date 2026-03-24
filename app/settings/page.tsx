import type { Metadata } from "next";
import { SettingsPanel } from "@/components/shared/SettingsPanel";

export const metadata: Metadata = {
  title: "設定 | Japanese After 50",
  description: "顯示模式與學習偏好設定（v1 placeholder）。"
};

export default function SettingsPage() {
  return (
    <main className="space-y-6">
      <header className="surface-card">
        <p className="chip-label">設定</p>
        <h1 className="mt-2 text-3xl font-black text-white">設定</h1>
        <p className="mt-2 text-sm text-slate-300">
          v1 先提供顯示模式與提醒偏好，後續會加入更多個人化學習設定。
        </p>
      </header>
      <SettingsPanel />
    </main>
  );
}
