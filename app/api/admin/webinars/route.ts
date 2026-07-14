import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getAllWebinars, createWebinar } from '@/lib/db';

export async function GET() {
  const user = await getAuthUser();
  if (!user || (user.role !== 'admin' && user.role !== 'team')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const webinars = await getAllWebinars();
    return NextResponse.json(webinars);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || (user.role !== 'admin' && user.role !== 'team')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const { title, description, scheduled_at, join_link, recording_url, is_published } = body;
  if (!title?.trim() || !scheduled_at) {
    return NextResponse.json({ error: 'title and scheduled_at are required' }, { status: 400 });
  }
  try {
    const webinar = await createWebinar({
      title: title.trim(),
      description: description?.trim() ?? '',
      scheduled_at,
      join_link: join_link?.trim() ?? '',
      recording_url: recording_url?.trim() ?? '',
      is_published: is_published ?? true,
      created_by: user.email,
    });
    return NextResponse.json(webinar, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create webinar' }, { status: 500 });
  }
}
