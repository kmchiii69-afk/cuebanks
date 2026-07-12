import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET() {
  try {
    const r = await fetch('https://api.frankfurter.dev/v1/latest?from=USD&to=GBP,EUR,AUD,CAD,CHF,JPY', {
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return NextResponse.json({ rates: { USD: 1 }, error: 'upstream' });
    const data: { rates: Record<string, number> } = await r.json();
    return NextResponse.json({ rates: { USD: 1, ...data.rates } });
  } catch {
    return NextResponse.json({ rates: { USD: 1 }, error: 'fetch_failed' });
  }
}
