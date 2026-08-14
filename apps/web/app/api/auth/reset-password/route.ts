import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { syncConvexPassword } from "@/lib/convexAuthSync";

function hashesMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  let email = "";
  let token = "";
  let password = "";
  try {
    const body = await req.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    token = typeof body.token === "string" ? body.token : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!email || !token || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const bootstrap = process.env.AUTH_BOOTSTRAP_SECRET;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!bootstrap || !convexUrl) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const client = new ConvexHttpClient(convexUrl);

  const member = await client.query(api.members.getByEmail, { email, secret: bootstrap });
  if (!member || !member.reset_token_hash || !member.reset_token_expires) {
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
  }
  if (Date.now() > member.reset_token_expires) {
    await client.mutation(api.members.update, {
      secret: bootstrap,
      email,
      resetTokenHash: null,
      resetTokenExpires: null,
    });
    return NextResponse.json({ error: "This reset link has expired" }, { status: 400 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  if (!hashesMatch(tokenHash, member.reset_token_hash)) {
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
  }

  // Set the new password in Convex Auth, then clear the reset token on the
  // member row. The legacy updatePassword path is a no-op now.
  await client.action(api.authMigrate.syncPassword, {
    secret: bootstrap,
    email,
    password,
  });
  void syncConvexPassword(email, password);

  await client.mutation(api.members.update, {
    secret: bootstrap,
    email,
    resetTokenHash: null,
    resetTokenExpires: null,
  });

  return NextResponse.json({ ok: true });
}
