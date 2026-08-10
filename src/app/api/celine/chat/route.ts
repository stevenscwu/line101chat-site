import type { NextRequest } from "next/server";

import { handleAvatarWebChat } from "@/lib/avatar/webChat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  return handleAvatarWebChat(request);
}
