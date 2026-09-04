import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { updateMember, getMember, deleteMember } from '@/lib/db';
import { syncConvexPassword } from '@/lib/convexAuthSync';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { email } = await params;
  const decoded = decodeURIComponent(email);
  const body = await req.json();

  // Team accounts can't grant admin/team access to anyone (including
  // themselves) via edit — same restriction as creating new members.
  if (auth.role === 'team' && (body.role === 'admin' || body.role === 'team')) {
    delete body.role;
  }

  if (body.password) {
    await syncConvexPassword(decoded, body.password);
    // no-op for member row updateMember path; legacy updatePassword removed
  }

  if (Object.keys(body).length > 0) {
    await updateMember(decoded, body);
  }

  const updated = await getMember(decoded);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { email } = await params;
  const decoded = decodeURIComponent(email);
  await deleteMember(decoded);
  return NextResponse.json({ ok: true });
}
