import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { randomBytes, createHash } from "crypto";
import { api } from "@/convex/_generated/api";
import { sendPasswordResetEmail } from "@/lib/email";

const RESET_URL_BASE = "https://wallstreetacademyfx.com/reset-password";
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: NextRequest) {
  let email = "";
  try {
    const body = await req.json();
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const bootstrap = process.env.AUTH_BOOTSTRAP_SECRET;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!bootstrap || !convexUrl) {
    console.error("[forgot-password] Missing env");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  // Always respond the same way regardless of whether the account exists,
  // so this endpoint can't be used to enumerate registered emails.
  const client = new ConvexHttpClient(convexUrl);
  const member = await client.query(api.members.getByEmail, { email, secret: bootstrap });
  if (member && member.active) {
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await client.mutation(api.members.update, {
      secret: bootstrap,
      email,
      resetTokenHash: tokenHash,
      resetTokenExpires: Date.now() + TOKEN_TTL_MS,
    });

    const resetUrl = `${RESET_URL_BASE}?email=${encodeURIComponent(member.email)}&token=${token}`;
    sendPasswordResetEmail({ to: member.email, name: member.name || "", resetUrl })
      .catch((err) => console.error("[forgot-password] email error:", err));
  }

  return NextResponse.json({ ok: true });
}
