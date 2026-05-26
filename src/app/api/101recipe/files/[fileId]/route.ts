import { getRecipeBotApiBaseUrl } from "@/lib/recipe-bot-api";

export async function GET(request: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const botUrl = new URL(`${getRecipeBotApiBaseUrl()}/api/101recipe/files/${encodeURIComponent(fileId)}`);
  if (token) botUrl.searchParams.set("token", token);

  const response = await fetch(botUrl, {
    headers: {
      authorization: request.headers.get("authorization") || "",
    },
    cache: "no-store",
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") || "application/octet-stream",
      "content-disposition": response.headers.get("content-disposition") || "inline",
    },
  });
}
