import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getMember, updateMember } from '@/lib/db';
import { isPhaseComplete, furthestUnlockedPhase, TOTAL_PHASES } from '@/lib/phases';
import type { PhaseProgress } from '@/lib/phases';

async function requireAdmin() {
  const auth = await getAuthUser();
  if (!auth || (auth.role !== 'admin' && auth.role !== 'team')) return null;
  return auth;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { email } = await params;
  const decoded = decodeURIComponent(email);

  const { phaseId, action } = await req.json();
  if (typeof phaseId !== 'number' || phaseId < 1 || phaseId > TOTAL_PHASES) {
    return NextResponse.json({ error: 'Invalid phase' }, { status: 400 });
  }
  if (action !== 'complete' && action !== 'reopen') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const member = await getMember(decoded);
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const progress: PhaseProgress = { ...(member.phase_progress || {}) };

  if (action === 'complete') {
    // Admin override — trusted human confirmation, so it bypasses the
    // homework-confirm requirement and can jump ahead. Backfill any earlier
    // incomplete phases so the "no gaps" invariant always holds; leave
    // already-complete phases' original completedAt/completedBy untouched.
    for (let id = 1; id <= phaseId; id++) {
      if (!isPhaseComplete(progress, id)) {
        progress[String(id)] = {
          status: 'complete',
          completedAt: new Date().toISOString(),
          completedBy: 'admin',
        };
      }
    }
  } else {
    // Reopen — clear this phase and everything after it, for the same
    // no-gaps reason (can't leave phase 5 done while phase 3 is reopened).
    for (let id = phaseId; id <= TOTAL_PHASES; id++) {
      delete progress[String(id)];
    }
  }

  const current_phase = furthestUnlockedPhase(progress);
  const updated = await updateMember(decoded, { phase_progress: progress, current_phase });
  if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 500 });

  const { password_hash: _, ...safe } = updated;
  return NextResponse.json(safe);
}
