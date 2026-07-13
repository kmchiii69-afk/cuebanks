import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { validateCredentials, updatePassword } from '@/lib/db';

export async function POST(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
  }

  const member = await validateCredentials(auth.email, currentPassword);
  if (!member) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });

  await updatePassword(auth.email, newPassword);
  return NextResponse.json({ ok: true });
}
