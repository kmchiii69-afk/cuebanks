import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { updateMember, updatePassword, getMember } from '@/lib/db';

async function requireAdmin() {
  const auth = await getAuthUser();
  if (!auth || auth.role !== 'admin') return null;
  return auth;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { email } = await params;
  const decoded = decodeURIComponent(email);
  const body = await req.json();

  if (body.password) {
    await updatePassword(decoded, body.password);
    delete body.password;
  }

  if (Object.keys(body).length > 0) {
    await updateMember(decoded, body);
  }

  const updated = await getMember(decoded);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { password_hash: _, ...safe } = updated;
  return NextResponse.json(safe);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { email } = await params;
  const decoded = decodeURIComponent(email);
  await updateMember(decoded, { active: false });
  return NextResponse.json({ ok: true });
}
