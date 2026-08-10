import { NextRequest, NextResponse } from "next/server";

import { clearSessionCookie, hasValidOrigin } from "@/lib/peak/auth";

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  const response = NextResponse.redirect(new URL("/peak/login", request.url), 303);
  clearSessionCookie(response);
  return response;
}
