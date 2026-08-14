import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { updateCueInstruction, deleteCueInstruction } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdminAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const updates: { active?: boolean; instruction?: string } = {};
  if (typeof body.active === 'boolean') updates.active = body.active;
  if (typeof body.instruction === 'string' && body.instruction.trim()) {
    if (body.instruction.trim().length > 500) return NextResponse.json({ error: 'too long' }, { status: 400 });
    updates.instruction = body.instruction.trim();
  }
  const row = await updateCueInstruction(id, updates);
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdminAuth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await deleteCueInstruction(id);
  return NextResponse.json({ ok: true });
}
