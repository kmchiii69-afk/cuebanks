import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { updateMember } from '@/lib/db';
import { furthestUnlockedPhase, TOTAL_PHASES } from '@/lib/phases';
import type { PhaseProgress } from '@/lib/phases';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { email } = await params;
  const decoded = decodeURIComponent(email);

  const body = await req.json().catch(() => ({}));
  const { phaseId, action } = body as { phaseId?: number; action?: string };
  if (typeof phaseId !== 'number' || phaseId < 1 || phaseId > TOTAL_PHASES) {
    return NextResponse.json({ error: 'Invalid phase' }, { status: 400 });
  }
  if (action !== 'complete' && action !== 'reopen') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  // We need the prior progress so we can extend it correctly. The simplest
  // path: fetch the current row, mutate, write back via updateMember.
  const { getMember } = await import('@/lib/db');
  const member = await getMember(decoded);
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const progress: PhaseProgress = { ...(member.phase_progress || {}) };

  if (action === 'complete') {
    for (let id = 1; id <= phaseId; id++) {
      if (!progress[String(id)] || progress[String(id)].status !== 'complete') {
        progress[String(id)] = {
          status: 'complete',
          completedAt: new Date().toISOString(),
          completedBy: 'admin',
        };
      }
    }
  } else {
    for (let id = phaseId; id <= TOTAL_PHASES; id++) {
      delete progress[String(id)];
    }
  }

  const current_phase = furthestUnlockedPhase(progress);
  const updated = await updateMember(decoded, { phase_progress: progress, current_phase });
  if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 500 });

  return NextResponse.json(updated);
}
