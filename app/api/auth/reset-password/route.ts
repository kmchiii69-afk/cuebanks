import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { getMember, updatePassword, clearResetToken } from '@/lib/db';

function hashesMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  const { email, token, password } = await req.json();
  if (!email || !token || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const member = await getMember(email);
  if (!member || !member.reset_token_hash || !member.reset_token_expires) {
    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
  }
  if (Date.now() > member.reset_token_expires) {
    await clearResetToken(member.email);
    return NextResponse.json({ error: 'This reset link has expired' }, { status: 400 });
  }

  const tokenHash = createHash('sha256').update(token).digest('hex');
  if (!hashesMatch(tokenHash, member.reset_token_hash)) {
    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
  }

  await updatePassword(member.email, password);
  await clearResetToken(member.email);
  return NextResponse.json({ ok: true });
}
