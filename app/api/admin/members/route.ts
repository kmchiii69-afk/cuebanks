import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getAllMembers, createMember, memberExists, Plan } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';

async function requireAdmin() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== 'admin') return null;
  return auth;
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const members = await getAllMembers();
  return NextResponse.json(members.map(({ password_hash: _, ...m }) => m));
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { email, password, name, role, cohort, plan, skip_contract } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const exists = await memberExists(email);
  if (exists) return NextResponse.json({ error: 'Member already exists' }, { status: 409 });

  const validPlans: Plan[] = ['5k', '7.5k', '15k', 'low_ticket'];
  const memberPlan: Plan = validPlans.includes(plan) ? plan : '5k';
  const member = await createMember({ email, password, name, role, cohort, plan: memberPlan, skip_contract: !!skip_contract });

  // Send welcome email (non-blocking — don't fail the request if email fails)
  if (role !== 'admin') {
    sendWelcomeEmail({ to: email, name: name || '', password, plan: memberPlan, skipContract: !!skip_contract })
      .catch(err => console.error('[admin] Welcome email error:', err));
  }

  const { password_hash: _, ...safe } = member;
  return NextResponse.json(safe, { status: 201 });
}
