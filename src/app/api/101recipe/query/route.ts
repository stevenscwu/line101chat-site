import { proxyRecipeBotJson } from "@/lib/recipe-bot-api";

export async function POST(request: Request) {
  return proxyRecipeBotJson("/api/101recipe/query", {
    method: "POST",
    headers: {
      authorization: request.headers.get("authorization") || "",
    },
    body: await request.text(),
  });
}
