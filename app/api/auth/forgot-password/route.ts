import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';
import { getMember, setResetToken } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';

const RESET_URL_BASE = 'https://wallstreetacademyfx.com/reset-password';
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  // Always respond the same way regardless of whether the account exists,
  // so this endpoint can't be used to enumerate registered emails.
  const member = await getMember(email);
  if (member && member.active) {
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    await setResetToken(member.email, tokenHash, Date.now() + TOKEN_TTL_MS);

    const resetUrl = `${RESET_URL_BASE}?email=${encodeURIComponent(member.email)}&token=${token}`;
    sendPasswordResetEmail({ to: member.email, name: member.name || '', resetUrl })
      .catch(err => console.error('[forgot-password] email error:', err));
  }

  return NextResponse.json({ ok: true });
}
