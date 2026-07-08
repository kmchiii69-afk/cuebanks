import { NextResponse } from 'next/server';

interface FFEvent {
  title: string;
  country: string;
  date: string;
  impact: string;
  forecast: string;
  previous: string;
  actual: string;
}

export const revalidate = 1800;

export async function GET() {
  try {
    const r = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WSAPortal/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return NextResponse.json({ events: [], error: 'upstream' });
    const data: FFEvent[] = await r.json();
    const filtered = data.filter(e => e.impact === 'High' || e.impact === 'Medium');
    return NextResponse.json({ events: filtered });
  } catch {
    return NextResponse.json({ events: [], error: 'fetch_failed' });
  }
}
