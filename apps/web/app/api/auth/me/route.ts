import { NextResponse } from "next/server";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function GET() {
  try {
    const token = await convexAuthNextjsToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const member = await fetchQuery(api.members.me, {}, { token });
    if (!member || !member.active) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const viewer = await fetchQuery(api.users.viewer, {}, { token });
    const role = viewer?.role ?? member.role;
    return NextResponse.json({
      email: member.email,
      name: member.name,
      role,
      cohort: member.cohort,
    });
  } catch (err) {
    console.error("[auth/me] failed:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
