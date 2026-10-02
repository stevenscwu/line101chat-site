import { deleteTransfer, rateLimit, readTransfer, requireSameOrigin, transferErrorResponse, transferResponse } from "@/lib/transfers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ token: string }> };

export async function GET(request: Request, context: Context) {
  try {
    await rateLimit(request, "read");
    return transferResponse(await readTransfer((await context.params).token));
  } catch (error) { return transferErrorResponse(error); }
}

export async function DELETE(request: Request, context: Context) {
  try {
    requireSameOrigin(request);
    await rateLimit(request, "write");
    await deleteTransfer((await context.params).token);
    return transferResponse({ deleted: true });
  } catch (error) { return transferErrorResponse(error); }
}
