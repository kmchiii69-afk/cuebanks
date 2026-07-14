import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getAllFreebieLeads, getAllFreebieQA } from '@/lib/db';

export async function GET() {
  const user = await getAuthUser();
  if (!user || (user.role !== 'admin' && user.role !== 'team')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const [leads, qa] = await Promise.all([getAllFreebieLeads(), getAllFreebieQA()]);
    return NextResponse.json({ leads, qa });
  } catch {
    return NextResponse.json({ leads: [], qa: [] });
  }
}
