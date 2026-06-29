import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_TYPEFORM!;

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

// ── Determine outcome from answers ─────────────────────────────────────────────
type Outcome = 'group_call' | 'oneonone_call' | 'stepdown_group' | 'not_qualified_budget' | 'not_qualified_early';

function getOutcome(a: Record<string, string>): Outcome {
  const vals = Object.values(a).join('|').toLowerCase();

  // Too early (beginner, not yet started)
  if (vals.includes('just curious') || vals.includes("studying but haven't") || vals.includes("studying / watching but hasn't")) {
    return 'not_qualified_early';
  }

  // Budget / access routing
  const isOneonone = vals.includes('1-on-1') || vals.includes('1 on 1') || vals.includes('directly');
  const underGroupBudget = vals.includes('under $5,000') || vals.includes('under $5k');
  const underOneonOneBudget = vals.includes('under $10,000') || vals.includes('under $10k');

  if (!isOneonone && underGroupBudget) return 'not_qualified_budget';
  if (isOneonone && underOneonOneBudget) return 'stepdown_group';
  if (isOneonone) return 'oneonone_call';
  return 'group_call';
}

const OUTCOME_CONFIG: Record<Outcome, { label: string; emoji: string; color: number; note: string }> = {
  group_call:             { label: 'Book Group Call',      emoji: '✅', color: 0x22c55e, note: '$7,500 offer' },
  oneonone_call:          { label: 'Book 1-on-1 Call',     emoji: '🔥', color: 0xf9ff3c, note: '$15,000 offer' },
  stepdown_group:         { label: 'Step Down → Group Call', emoji: '↘️', color: 0x3b82f6, note: 'Wanted 1-on-1 but under $10k — route to group call' },
  not_qualified_budget:   { label: 'Not Qualified — Budget', emoji: '❌', color: 0xef4444, note: 'Under $5k — send to free course' },
  not_qualified_early:    { label: 'Not Qualified — Too Early', emoji: '⏳', color: 0xef4444, note: 'Just getting started — send to free course' },
};

// ── Build Discord embed ────────────────────────────────────────────────────────
function buildEmbed(answers: Record<string, string>, outcome: Outcome, submittedAt: string) {
  const cfg = OUTCOME_CONFIG[outcome];

  // Pull key fields (flexible matching on title keywords)
  const get = (keywords: string[]): string => {
    for (const [title, val] of Object.entries(answers)) {
      const t = title.toLowerCase();
      if (keywords.some(k => t.includes(k))) return val;
    }
    return '—';
  };

  const name   = get(['name', 'who am i']);
  const email  = get(['email']);
  const phone  = get(['phone']);
  const path   = get(['actively trading', 'getting into']);
  const budget = get(['invest', 'budget', 'ready to invest']);
  const access = get(['work with', 'inner circle', 'access']);
  const time   = get(['focused time', 'time can you']);

  const date = new Date(submittedAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });

  // All answers as fields (skip contact info already shown)
  const SKIP_KEYS = ['name', 'email', 'phone', 'who am i', 'reach you', 'phone number'];
  const extraFields = Object.entries(answers)
    .filter(([title]) => !SKIP_KEYS.some(k => title.toLowerCase().includes(k)))
    .map(([title, val]) => ({
      name: title,
      value: val.length > 200 ? val.slice(0, 197) + '…' : val,
      inline: false,
    }));

  return {
    embeds: [{
      title: `${cfg.emoji} ${cfg.label}`,
      description: `**${name}** · ${email} · ${phone}\n\n${cfg.note}`,
      color: cfg.color,
      fields: [
        { name: '📍 Path', value: path, inline: true },
        { name: '⏱ Time Available', value: time, inline: true },
        { name: '💰 Budget', value: budget, inline: true },
        { name: '🎯 Access Type', value: access, inline: true },
        ...extraFields,
      ].filter(f => f.value && f.value !== '—'),
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
    const body = buildEmbed(answers, outcome, payload.form_response.submitted_at);

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

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Typeform webhook error:', e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
