import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { getAllFreebieLeads, getAllFreebieQA } from '@/lib/db';

export async function GET() {
  const user = await requireAdminAuth();
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const [leads, qa] = await Promise.all([getAllFreebieLeads(), getAllFreebieQA()]);
    return NextResponse.json({ leads, qa });
  } catch {
    return NextResponse.json({ leads: [], qa: [] });
  }
}
