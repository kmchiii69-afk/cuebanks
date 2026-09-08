import { NextRequest } from "next/server";
import { getConvexSiteUrl } from "@/lib/convexSite";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const site = getConvexSiteUrl();
  if (!site) {
    return new Response(JSON.stringify({ error: "Cue AI is not configured" }), { status: 503 });
  }

  const body = await req.text();
  const res = await fetch(`${site}/freebie-cue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "text/plain; charset=utf-8",
    },
  });
}
