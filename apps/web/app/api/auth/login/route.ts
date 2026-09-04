// POST /api/auth/login
//
// Validates email/password via `authSession.validateCredentials` (Convex Auth,
// then live Supabase bcrypt if no Auth account exists yet), then records the
// login timestamp on the member row.
//
// Sets a legacy `wsa_auth_token` cookie so the existing proxy middleware
// keeps working during the migration window. After proxy.ts is rewritten to
// use Convex Auth's middleware, this cookie becomes vestigial and can be
// removed in favor of the Convex Auth cookie set by the client signIn flow.

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { SignJWT } from "jose";
import { api } from "@/convex/_generated/api";
import { rateLimit } from "@/lib/rate-limit";

const LEGACY_COOKIE = "wsa_auth_token";

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(s);
}

async function signLegacyToken(payload: { email: string; role: "member" | "admin" | "team" }) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function POST(req: NextRequest) {
  // 10 attempts per IP per 15 minutes
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  const bootstrap = process.env.AUTH_BOOTSTRAP_SECRET;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!bootstrap || !convexUrl) {
    console.error("[auth/login] Missing AUTH_BOOTSTRAP_SECRET or NEXT_PUBLIC_CONVEX_URL");
    return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
  }

  let email = "";
  let password = "";
  try {
    const body = await req.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  try {
    const client = new ConvexHttpClient(convexUrl);
    const result = (await client.action(api.authSession.validateCredentials, {
      secret: bootstrap,
      email,
      password,
    })) as
      | {
          email: string;
          role: "member" | "admin" | "team";
          name: string;
          active: boolean;
          cohort: string;
        }
      | null;

    if (!result || !result.active) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Record login (best-effort).
    try {
      await client.mutation(api.members.recordLogin, { secret: bootstrap, email: result.email });
    } catch (err) {
      console.error("[auth/login] recordLogin failed:", err);
    }

    const token = await signLegacyToken({ email: result.email, role: result.role });
    const res = NextResponse.json({
      email: result.email,
      role: result.role,
      name: result.name,
      cohort: result.cohort,
    });
    res.cookies.set(LEGACY_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
