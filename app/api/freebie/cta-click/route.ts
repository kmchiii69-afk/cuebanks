// POST /api/freebie/cta-click
//
// Fired via navigator.sendBeacon right as a /freebie visitor clicks through
// to /ig, so admin can see who followed through vs. who dropped off after
// their 3 free questions.

import { NextRequest, NextResponse } from "next/server";
import { markFreebieCtaClicked } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const email = (body as { email?: unknown })?.email;
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await markFreebieCtaClicked(email).catch(() => {});
  return NextResponse.json({ ok: true });
}
