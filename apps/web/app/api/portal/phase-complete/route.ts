import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getMember, updateMember } from '@/lib/db';
import { getPhase, isPhaseComplete, isPhaseUnlocked, furthestUnlockedPhase, TOTAL_PHASES } from '@/lib/phases';

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { phaseId, homeworkConfirmed } = await req.json();
  if (typeof phaseId !== 'number' || phaseId < 1 || phaseId > TOTAL_PHASES) {
    return NextResponse.json({ error: 'Invalid phase' }, { status: 400 });
  }

  const member = await getMember(user.email);
  if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

  const progress = member.phase_progress || {};

  // Already complete — idempotent no-op so a double-click isn't an error.
  if (isPhaseComplete(progress, phaseId)) {
    return NextResponse.json({ ok: true, current_phase: member.current_phase });
  }

  // Server-side order enforcement — even though the UI hides the control for
  // locked phases, a raw API call must not be able to skip ahead.
  if (!isPhaseUnlocked(progress, phaseId)) {
    return NextResponse.json({ error: 'Complete the previous phase first' }, { status: 409 });
  }

  const phase = getPhase(phaseId)!;
  if (phase.hasHomework && !homeworkConfirmed) {
    return NextResponse.json({ error: 'Homework confirmation required' }, { status: 400 });
  }

  const merged = {
    ...progress,
    [String(phaseId)]: {
      status: 'complete' as const,
      completedAt: new Date().toISOString(),
      completedBy: 'member' as const,
      ...(phase.hasHomework ? { homeworkConfirmed: true } : {}),
    },
  };

  const current_phase = furthestUnlockedPhase(merged);
  const updated = await updateMember(user.email, { phase_progress: merged, current_phase });
  if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 500 });

  return NextResponse.json({ ok: true, phase_progress: updated.phase_progress, current_phase: updated.current_phase });
}
