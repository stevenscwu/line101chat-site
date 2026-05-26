const defaultBotUrl = "http://127.0.0.1:3000";

export function getRecipeBotApiBaseUrl() {
  return (process.env.RECIPE_BOT_API_BASE_URL || defaultBotUrl).replace(/\/+$/, "");
}

export async function proxyRecipeBotJson(path: string, init: RequestInit) {
  const response = await fetch(`${getRecipeBotApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") || "application/json",
    },
  });
}
