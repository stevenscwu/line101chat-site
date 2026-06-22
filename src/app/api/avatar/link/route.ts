import type { NextRequest } from "next/server";

import { handleAvatarWebLink } from "@/lib/avatar/webChat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return handleAvatarWebLink(request);
}
