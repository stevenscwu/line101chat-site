import { proxyRecipeBotJson } from "@/lib/recipe-bot-api";

export async function POST(request: Request) {
  return proxyRecipeBotJson("/api/101recipe/login", {
    method: "POST",
    body: await request.text(),
  });
}
