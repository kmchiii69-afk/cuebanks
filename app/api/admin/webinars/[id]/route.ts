import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { updateWebinar, deleteWebinar } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'admin' && user.role !== 'team')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { title, description, scheduled_at, join_link, recording_url, is_published } = body;
  try {
    const updated = await updateWebinar(id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(scheduled_at !== undefined && { scheduled_at }),
      ...(join_link !== undefined && { join_link: join_link.trim() }),
      ...(recording_url !== undefined && { recording_url: recording_url.trim() }),
      ...(is_published !== undefined && { is_published }),
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'admin' && user.role !== 'team')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  try {
    await deleteWebinar(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
