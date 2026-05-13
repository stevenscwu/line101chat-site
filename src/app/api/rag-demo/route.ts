import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({
    answer:
      "本網頁 Demo 已改為純前端預先回答，不會呼叫 RAG 後端。請使用頁面右側建議問題；若要測試真實查詢速度、自由提問與完整回答品質，請掃描 QR code 加入 LINE chatbot。",
    sources: [],
    demo_fallback: true,
  });
}
