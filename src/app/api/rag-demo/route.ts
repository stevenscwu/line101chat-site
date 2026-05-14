import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({
    answer:
      "本網頁 Demo 已改為純前端預先回答，不會呼叫 RAG 後端。請使用頁面右側建議問題；若要測試真實查詢速度、自由提問與完整回答品質，請使用北科大創新學院 Demo chatbot（Channel 2007782998）。",
    sources: [],
    demo_fallback: true,
  });
}
