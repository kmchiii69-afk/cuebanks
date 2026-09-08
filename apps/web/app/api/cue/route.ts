import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getConvexSiteUrl } from "@/lib/convexSite";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const site = getConvexSiteUrl();
  const secret = process.env.AUTH_BOOTSTRAP_SECRET;
  if (!site || !secret) {
    return new Response(JSON.stringify({ error: "Cue AI is not configured" }), { status: 503 });
  }

  const body = await req.text();
  const res = await fetch(`${site}/cue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-WSA-Bootstrap": secret,
      "X-WSA-Email": authUser.email,
    },
    body,
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "text/plain; charset=utf-8",
    },
  });
}
