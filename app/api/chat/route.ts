import { NextRequest, NextResponse } from "next/server";
import { retrieveRelevantChunks } from "@/lib/retrieval";
import { generateAnswer } from "@/lib/llm";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { query?: string };
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json({ error: "Query is required. / 必須提供查詢內容。" }, { status: 400 });
    }

    const context = await retrieveRelevantChunks(query);
    const answer = await generateAnswer({ query, context });

    return NextResponse.json({
      answer,
      contextCount: context.length,
      retrieved: context
    });
  } catch {
    return NextResponse.json({ error: "Unexpected server error. / 非預期伺服器錯誤。" }, { status: 500 });
  }
}
