import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getWebinars } from '@/lib/db';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const webinars = await getWebinars();
    return NextResponse.json(webinars);
  } catch {
    return NextResponse.json([]);
  }
}
