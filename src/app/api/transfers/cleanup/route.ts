import { authorizeCleanup, cleanupTransfers, transferErrorResponse, transferResponse } from "@/lib/transfers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    authorizeCleanup(request);
    return transferResponse(await cleanupTransfers());
  } catch (error) { return transferErrorResponse(error); }
}
