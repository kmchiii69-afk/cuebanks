import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { updateMember } from '@/lib/db';

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { goal } = body as { goal?: string };
  if (!goal || typeof goal !== 'string' || !goal.trim()) {
    return NextResponse.json({ error: 'goal required' }, { status: 400 });
  }

  await updateMember(user.email, { goal: goal.trim(), onboarded: true });
  return NextResponse.json({ ok: true });
}
