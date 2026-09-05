import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getMember } from "@/lib/db";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const member = await getMember(auth.email);
    if (!member || !member.active) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      email: member.email,
      name: member.name,
      role: auth.role,
      cohort: member.cohort,
      created_at: member.created_at,
      current_phase: member.current_phase,
      phase_progress: member.phase_progress,
      plan: member.plan,
      expires_at: member.expires_at,
      goal: member.goal,
      onboarded: member.onboarded,
      portal_unlocked: member.portal_unlocked,
      skip_contract: member.skip_contract,
    });
  } catch (err) {
    console.error("[auth/me] failed:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
