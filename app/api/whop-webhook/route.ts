import { NextRequest, NextResponse } from 'next/server';
import { memberExists, createMember } from '@/lib/db';
import type { Plan } from '@/lib/db';
import { generatePassword, sendWelcomeEmail } from '@/lib/email';

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

function detectPlan(productName: string, planName?: string): Plan {
  const s = `${productName} ${planName ?? ''}`.toLowerCase();
  if (s.includes('15k') || s.includes('15,000') || s.includes('15000')) return '15k';
  if (s.includes('7.5k') || s.includes('7,500') || s.includes('7500')) return '7.5k';
  if (s.includes('low') || s.includes('ticket')) return 'low_ticket';
  return '5k';
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

    const name         = user?.name || user?.username || '';
    const email        = user?.email || '';
    const product_name = product?.name || product?.title || d?.plan?.name || 'WSA';
    const rawAmount    = d?.final_amount ?? d?.checkout?.final_amount ?? d?.amount ?? d?.subtotal;
    const currency     = d?.currency ?? d?.checkout?.currency ?? 'usd';
    const amount       = rawAmount != null ? formatAmount(rawAmount, currency) : '—';

    // Auto-create member account + send welcome email if we have a real email
    if (email && email !== '—') {
      try {
        const exists = await memberExists(email);
        if (!exists) {
          const plan = detectPlan(product_name, d?.plan?.name);
          const password = generatePassword();
          await createMember({ email, password, name: name || '', plan });
          await sendWelcomeEmail({ to: email, name: name || '', password, plan });
          console.log('[whop] Created member + sent welcome email:', email, plan);
        } else {
          console.log('[whop] Member already exists, skipping creation:', email);
        }
      } catch (err) {
        // Don't fail the webhook if member creation or email fails
        console.error('[whop] Member creation / email error:', err);
      }
    }

    const embed = {
      embeds: [{
        title: `💸 Payment Received`,
        description: [
          `**Name:** ${name || 'Unknown'}`,
          `**Email:** ${email || '—'}`,
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
