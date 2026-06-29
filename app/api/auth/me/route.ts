import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getMember } from '@/lib/db';

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const member = await getMember(auth.email);
  if (!member || !member.active) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { password_hash: _, ...safe } = member;
  return NextResponse.json(safe);
}
