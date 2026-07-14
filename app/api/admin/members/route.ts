import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getAllMembers, createMember, memberExists, Plan } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';

async function requireAdmin() {
  const auth = await getAuthUser();
  if (!auth || (auth.role !== 'admin' && auth.role !== 'team')) return null;
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

  const body = await req.json();
  const { email, password, name, cohort, skip_contract, plan } = body;
  let { role } = body;
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const exists = await memberExists(email);
  if (exists) return NextResponse.json({ error: 'Member already exists' }, { status: 409 });

  const validRoles = ['member', 'admin', 'team'];
  if (!validRoles.includes(role)) role = 'member';

  const validPlans: Plan[] = ['5k', '7.5k', '15k', 'low_ticket'];
  let memberPlan: Plan = validPlans.includes(plan) ? plan : '5k';

  // Team accounts can only ever create low-ticket members, and can't grant
  // admin/team access to anyone — this is the whole point of the tag.
  if (auth.role === 'team') {
    memberPlan = 'low_ticket';
    role = 'member';
  }

  const member = await createMember({ email, password, name, role, cohort, plan: memberPlan, skip_contract: !!skip_contract });

  // Send welcome email (non-blocking — don't fail the request if email fails)
  // Staff accounts (admin/team) don't get the customer-facing welcome email.
  if (role !== 'admin' && role !== 'team') {
    sendWelcomeEmail({ to: email, name: name || '', password, plan: memberPlan, skipContract: !!skip_contract })
      .catch(err => console.error('[admin] Welcome email error:', err));
  }

  const { password_hash: _, ...safe } = member;
  return NextResponse.json(safe, { status: 201 });
}
