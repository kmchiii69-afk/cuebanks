import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_TYPEFORM!;
const CLOSE_API_KEY = process.env.CLOSE_CRM_API_KEY!;

// ── Parse Typeform payload ─────────────────────────────────────────────────────
interface TFField { id: string; title: string; type: string }
interface TFAnswer {
  field: { id: string; type: string };
  type: string;
  text?: string;
  email?: string;
  phone_number?: string;
  choice?: { label: string };
  choices?: { labels: string[] };
}
interface TFPayload {
  form_response: {
    submitted_at: string;
    definition: { fields: TFField[] };
    answers: TFAnswer[];
  };
}

function extractAnswers(payload: TFPayload): Record<string, string> {
  const { definition, answers } = payload.form_response;
  const fieldMap: Record<string, string> = {};
  for (const f of definition.fields) fieldMap[f.id] = f.title;

  const out: Record<string, string> = {};
  for (const a of answers) {
    const title = fieldMap[a.field.id] || a.field.id;
    let val = '';
    if (a.type === 'text' && a.text) val = a.text;
    else if (a.type === 'email' && a.email) val = a.email;
    else if (a.type === 'phone_number' && a.phone_number) val = a.phone_number;
    else if (a.type === 'choice' && a.choice) val = a.choice.label;
    else if (a.type === 'choices' && a.choices) val = a.choices.labels.join(', ');
    if (val) out[title] = val;
  }
  return out;
}

// ── Determine outcome ──────────────────────────────────────────────────────────
type Outcome = 'group_call' | 'oneonone_call' | 'stepdown_group' | 'not_qualified_budget' | 'not_qualified_early';

function getOutcome(a: Record<string, string>): Outcome {
  const vals = Object.values(a).join('|').toLowerCase();

  if (vals.includes('just curious') || vals.includes("studying but haven't") || vals.includes("studying / watching but hasn't")) {
    return 'not_qualified_early';
  }

  const isOneonone = vals.includes('1-on-1') || vals.includes('1 on 1') || vals.includes('directly');
  const underGroupBudget = vals.includes('under $5,000') || vals.includes('under $5k');
  const underOneonOneBudget = vals.includes('under $10,000') || vals.includes('under $10k');

  if (!isOneonone && underGroupBudget) return 'not_qualified_budget';
  if (isOneonone && underOneonOneBudget) return 'stepdown_group';
  if (isOneonone) return 'oneonone_call';
  return 'group_call';
}

const OUTCOME_CONFIG: Record<Outcome, { label: string; emoji: string; color: number }> = {
  group_call:             { label: 'GROUP CALL Lead',          emoji: '✅', color: 0x22c55e },
  oneonone_call:          { label: '1-ON-1 Lead',              emoji: '💎', color: 0xf9ff3c },
  stepdown_group:         { label: 'STEP DOWN — Group Call',   emoji: '↘️', color: 0x3b82f6 },
  not_qualified_budget:   { label: 'NOT QUALIFIED — Budget',   emoji: '❌', color: 0xef4444 },
  not_qualified_early:    { label: 'NOT QUALIFIED — Too Early', emoji: '⏳', color: 0xef4444 },
};

// ── Create Close CRM lead ──────────────────────────────────────────────────────
async function createCloseLead(answers: Record<string, string>, outcome: Outcome): Promise<string | null> {
  if (!CLOSE_API_KEY) return null;

  const get = (keywords: string[]): string => {
    for (const [title, val] of Object.entries(answers)) {
      if (keywords.some(k => title.toLowerCase().includes(k))) return val;
    }
    return '';
  };

  const name   = get(['name', 'who am i']) || 'Unknown';
  const email  = get(['email']);
  const phone  = get(['phone']);
  const budget = get(['invest', 'budget', 'ready to invest']);

  const notes = Object.entries(answers)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const contact: Record<string, unknown> = { name };
  if (email) contact.emails = [{ email, type: 'office' }];
  if (phone && phone !== '—') contact.phones = [{ phone, type: 'office' }];

  const body = {
    name,
    contacts: [contact],
    description: `Outcome: ${outcome}\nBudget: ${budget}\n\n${notes}`,
  };

  try {
    const res = await fetch('https://api.close.com/api/v1/lead/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${CLOSE_API_KEY}:`).toString('base64')}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error('Close CRM error:', await res.text());
      return null;
    }
    const data = await res.json() as { id: string };
    return `https://app.close.com/leads/${data.id}/`;
  } catch (e) {
    console.error('Close CRM error:', e);
    return null;
  }
}

// ── Build Discord embed ────────────────────────────────────────────────────────
function buildEmbed(answers: Record<string, string>, outcome: Outcome, submittedAt: string, closeUrl: string | null) {
  const cfg = OUTCOME_CONFIG[outcome];

  const get = (keywords: string[]): string => {
    for (const [title, val] of Object.entries(answers)) {
      if (keywords.some(k => title.toLowerCase().includes(k))) return val;
    }
    return '—';
  };

  const name   = get(['name', 'who am i']);
  const email  = get(['email']);
  const phone  = get(['phone']);
  const budget = get(['invest', 'budget', 'ready to invest']);

  // Primary contact block
  let desc = '';
  if (closeUrl) desc += `👉 [View in Close](${closeUrl})\n\n`;
  desc += `**Name:** ${name}\n`;
  desc += `**Email:** ${email}\n`;
  desc += `**Phone:** ${phone}\n`;
  desc += `**Investment tier:** ${budget}\n`;

  // Secondary fields as bullet points
  const SKIP_KEYS = ['name', 'email', 'phone', 'who am i', 'reach you', 'invest', 'budget', 'ready to invest'];
  const extras = Object.entries(answers).filter(
    ([title]) => !SKIP_KEYS.some(k => title.toLowerCase().includes(k))
  );

  if (extras.length > 0) {
    desc += '\n';
    for (const [title, val] of extras) {
      desc += `• **${title}:** ${val}\n`;
    }
  }

  desc += '\n' + '—'.repeat(28);

  const date = new Date(submittedAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });

  return {
    embeds: [{
      title: `${cfg.emoji} ${cfg.label}`,
      description: desc,
      color: cfg.color,
      footer: { text: `Submitted ${date}` },
    }],
  };
}

// ── Route handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json() as TFPayload;
    if (!payload?.form_response) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }

    const answers = extractAnswers(payload);
    const outcome = getOutcome(answers);

    // Create Close lead first so we can embed the link
    const closeUrl = await createCloseLead(answers, outcome);

    const body = buildEmbed(answers, outcome, payload.form_response.submitted_at, closeUrl);

    const discordRes = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!discordRes.ok) {
      const err = await discordRes.text();
      console.error('Discord webhook error:', err);
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true, closeUrl });
  } catch (e) {
    console.error('Typeform webhook error:', e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
