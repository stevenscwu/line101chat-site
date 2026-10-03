import { dispatchAccountRequest } from "@/lib/server/account-runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) { return dispatchAccountRequest(request, "usage"); }
