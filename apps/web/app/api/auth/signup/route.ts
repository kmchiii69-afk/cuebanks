import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { SignJWT } from "jose";
import { api } from "@/convex/_generated/api";
import { rateLimit } from "@/lib/rate-limit";
import { createMember, memberExists } from "@/lib/db";
import { isValidSignupInvite } from "@/lib/signup-invite";

const LEGACY_COOKIE = "wsa_auth_token";

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`signup:${ip}`, 8, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  let email = "";
  let password = "";
  let name = "";
  let invite = "";
  try {
    const body = await req.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body.password === "string" ? body.password : "";
    name = typeof body.name === "string" ? body.name.trim() : "";
    invite = typeof body.invite === "string" ? body.invite : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidSignupInvite(invite)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }

  const bootstrap = process.env.AUTH_BOOTSTRAP_SECRET;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!bootstrap || !convexUrl || !process.env.JWT_SECRET) {
    console.error("[auth/signup] Missing AUTH_BOOTSTRAP_SECRET, NEXT_PUBLIC_CONVEX_URL, or JWT_SECRET");
    return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
  }

  try {
    if (await memberExists(email)) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    await createMember({
      email,
      name,
      role: "member",
      plan: "5k",
      portal_unlocked: true,
    });

    const client = new ConvexHttpClient(convexUrl);
    await client.action(api.authMigrate.syncPassword, {
      email,
      password,
      secret: bootstrap,
    });
    try {
      await client.mutation(api.members.recordLogin, { secret: bootstrap, email });
    } catch (err) {
      console.error("[auth/signup] recordLogin failed:", err);
    }

    const token = await new SignJWT({ email, role: "member" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret());

    const res = NextResponse.json({ email, role: "member", name });
    res.cookies.set(LEGACY_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    if (message.toLowerCase().includes("already exists")) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    console.error("Signup error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
