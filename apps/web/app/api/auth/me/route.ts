import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getMember } from "@/lib/db";
import { isStaffRole } from "@/lib/roles";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const member = await getMember(auth.email).catch(() => null);
    if ((!member || !member.active) && !isStaffRole(auth.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!member) {
      return NextResponse.json({
        email: auth.email,
        name: "",
        role: auth.role,
        cohort: "",
        created_at: 0,
        current_phase: 0,
        phase_progress: {},
        plan: "5k",
        expires_at: null,
        goal: "",
        onboarded: true,
        portal_unlocked: true,
        skip_contract: true,
      });
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
