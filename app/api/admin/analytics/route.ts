import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getChatAnalytics } from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const plan = new URL(req.url).searchParams.get('plan') ?? 'all';
  try {
    const rows = await getChatAnalytics(plan === 'all' ? undefined : plan);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}
