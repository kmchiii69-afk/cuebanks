import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let currentPassword = "";
  let newPassword = "";
  try {
    const body = await req.json();
    currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const bootstrap = process.env.AUTH_BOOTSTRAP_SECRET;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!bootstrap || !convexUrl) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  try {
    const client = new ConvexHttpClient(convexUrl);
    await client.action(api.authMigrate.changePassword, {
      secret: bootstrap,
      email: auth.email,
      currentPassword,
      newPassword,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
