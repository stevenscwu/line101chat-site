import { dispatchAccountRequest } from "@/lib/server/account-runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  return dispatchAccountRequest(request, "get", (await context.params).id);
}
export async function PUT(request: Request, context: Context) {
  return dispatchAccountRequest(request, "replace", (await context.params).id);
}
