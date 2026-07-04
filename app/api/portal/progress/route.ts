import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { updateMember } from '@/lib/db';

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { phase } = await req.json();
  if (typeof phase !== 'number' || phase < 0 || phase > 8) {
    return NextResponse.json({ error: 'Invalid phase' }, { status: 400 });
  }

  await updateMember(user.email, { current_phase: phase });
  return NextResponse.json({ ok: true });
}
