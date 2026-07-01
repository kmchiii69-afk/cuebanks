import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK_PAYMENTS = process.env.DISCORD_WEBHOOK_PAYMENTS!;

// Whop v1 + v2 webhook payload — fields may appear at different nesting levels
interface WhopUser { name?: string; username?: string; email?: string }
interface WhopProduct { name?: string; title?: string }
interface WhopPayload {
  action: string;
  data: {
    id?: string;
    final_amount?: number;
    amount?: number;
    subtotal?: number;
    currency?: string;
    // v2 nesting
    membership?: {
      user?: WhopUser;
      product?: WhopProduct;
    };
    checkout?: {
      final_amount?: number;
      currency?: string;
    };
    // v1 top-level
    user?: WhopUser;
    product?: WhopProduct;
    plan?: { name?: string };
  };
}

function formatAmount(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json() as WhopPayload;

    // Fire on any payment or membership activation event
    const PAYMENT_EVENTS = ['payment.succeeded', 'payment.completed', 'membership.went_valid', 'membership.created'];
    const isPaymentEvent = PAYMENT_EVENTS.includes(payload.action) || payload.action?.includes('payment');
    if (!isPaymentEvent) {
      console.log('Whop: skipped action', payload.action);
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Log the raw payload so we can see the exact shape Whop sends
    console.log('Whop payload:', JSON.stringify(payload));

    const d        = payload.data;
    const user     = d?.membership?.user ?? d?.user;
    const product  = d?.membership?.product ?? d?.product;

    const name         = user?.name || user?.username || 'Unknown';
    const email        = user?.email || '—';
    const product_name = product?.name || product?.title || d?.plan?.name || 'WSA';
    const rawAmount    = d?.final_amount ?? d?.checkout?.final_amount ?? d?.amount ?? d?.subtotal;
    const currency     = d?.currency ?? d?.checkout?.currency ?? 'usd';
    const amount       = rawAmount != null ? formatAmount(rawAmount, currency) : '—';

    const embed = {
      embeds: [{
        title: `💸 Payment Received`,
        description: [
          `**Name:** ${name}`,
          `**Email:** ${email}`,
          `**Product:** ${product_name}`,
          `**Amount:** ${amount}`,
        ].join('\n'),
        color: 0x22c55e,
        footer: { text: `Whop · ${payload.action}` },
      }],
    };

    const res = await fetch(DISCORD_WEBHOOK_PAYMENTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Discord payments webhook error:', err);
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Whop webhook error:', e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
