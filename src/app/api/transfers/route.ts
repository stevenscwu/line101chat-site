import { createTransfer, rateLimit, readJsonBody, requireSameOrigin, TRANSFER_HOURS, transferErrorResponse, transferResponse, transfersAvailable } from "@/lib/transfers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return transferResponse({ available: transfersAvailable(), expiresInHours: TRANSFER_HOURS });
}

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    await rateLimit(request, "write");
    const body = await readJsonBody(request);
    const lesson = body && typeof body === "object" && "lesson" in body ? body.lesson : undefined;
    const result = await createTransfer(lesson);
    const url = new URL("/transfer", request.url);
    url.hash = result.token;
    return transferResponse({ ...result, url: url.toString() }, 201);
  } catch (error) { return transferErrorResponse(error); }
}
