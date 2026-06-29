import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, recordLogin } from '@/lib/db';
import { signToken, COOKIE_NAME, COOKIE_OPTS } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    const member = await validateCredentials(email, password);
    if (!member) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    await recordLogin(member.email);
    const token = await signToken({ email: member.email, role: member.role });
    const res = NextResponse.json({
      email: member.email,
      role: member.role,
      name: member.name,
      cohort: member.cohort,
    });
    res.cookies.set(COOKIE_NAME, token, COOKIE_OPTS);
    return res;
  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
