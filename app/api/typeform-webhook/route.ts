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
  number?: number;
  boolean?: boolean;
}
interface TFPayload {
  form_response: {
    submitted_at: string;
    definition: { fields: TFField[] };
    answers: TFAnswer[];
  };
}

// Extracts answers keyed by field title.
// Also stores __email__ and __phone__ by answer TYPE so we always capture them
// regardless of what the question title says.
function extractAnswers(payload: TFPayload): Record<string, string> {
  const { definition, answers } = payload.form_response;
  const fieldMap: Record<string, string> = {};
  for (const f of definition.fields) fieldMap[f.id] = f.title;

  const out: Record<string, string> = {};
  for (const a of answers) {
    const title = fieldMap[a.field.id] || a.field.id;
    let val = '';
    if (a.type === 'text' && a.text)                      val = a.text;
    else if (a.type === 'email' && a.email)               val = a.email;
    else if (a.type === 'phone_number' && a.phone_number) val = a.phone_number;
    else if (a.type === 'choice' && a.choice)             val = a.choice.label;
    else if (a.type === 'choices' && a.choices)           val = a.choices.labels.join(', ');
    else if (a.type === 'number' && a.number != null)     val = String(a.number);
    else if (a.type === 'boolean' && a.boolean != null)   val = a.boolean ? 'Yes' : 'No';

    if (val) {
      out[title] = val;
      // Type-based reserved keys — reliable regardless of question wording
      if (a.type === 'email')        out['__email__'] = val;
      if (a.type === 'phone_number') out['__phone__'] = val;
    }
  }
  return out;
}

// ── Determine outcome ──────────────────────────────────────────────────────────
type Outcome = 'group_call' | 'oneonone_call' | 'stepdown_group' | 'not_qualified_budget' | 'not_qualified_early';

function getOutcome(a: Record<string, string>): Outcome {
  const vals = Object.values(a).join('|').toLowerCase();

  if (vals.includes('just curious') || vals.includes("studying but haven't") || vals.includes('not yet') || vals.includes('just getting started')) {
    return 'not_qualified_early';
  }

  const isOneonone   = vals.includes('1-on-1') || vals.includes('1 on 1') || vals.includes('directly with cue') || vals.includes('personal');
  const tooLow       = vals.includes('under $5') || vals.includes('less than $5') || vals.includes('$2,500') || vals.includes('$1,');
  const midRange     = vals.includes('under $10') || vals.includes('$5,000') || vals.includes('$7,500');

  if (tooLow && !isOneonone) return 'not_qualified_budget';
  if (isOneonone && (tooLow || midRange)) return 'stepdown_group';
  if (isOneonone) return 'oneonone_call';
  return 'group_call';
}

const OUTCOME_CONFIG: Record<Outcome, { label: string; emoji: string; color: number }> = {
  group_call:             { label: 'GROUP CALL Lead',            emoji: '✅', color: 0x22c55e },
  oneonone_call:          { label: '1-ON-1 Lead',                emoji: '💎', color: 0xf9ff3c },
  stepdown_group:         { label: 'STEP DOWN — Group Call',     emoji: '↘️', color: 0x3b82f6 },
  not_qualified_budget:   { label: '5K TICKET — Low Budget',     emoji: '📦', color: 0xf97316 },
  not_qualified_early:    { label: '5K TICKET — Too Early',      emoji: '📦', color: 0xf97316 },
};

// ── Create Close CRM lead ──────────────────────────────────────────────────────
async function createCloseLead(answers: Record<string, string>, outcome: Outcome): Promise<string | null> {
  if (!CLOSE_API_KEY) return null;

  const get = (keys: string[]): string => {
    for (const [t, v] of Object.entries(answers)) {
      if (keys.some(k => t.toLowerCase().includes(k))) return v;
    }
    return '';
  };

  const name  = get(['name', 'who am i', 'full name', 'your name']) || 'Unknown';
  const email = answers['__email__'] || get(['email']);
  const phone = answers['__phone__'] || get(['phone', 'mobile', 'number']);
  const budget = get(['invest', 'budget', 'ready to invest', 'tier', 'level']);

  const notes = Object.entries(answers)
    .filter(([k]) => !k.startsWith('__'))
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const contact: Record<string, unknown> = { name };
  if (email) contact.emails = [{ email, type: 'office' }];
  if (phone) contact.phones = [{ phone, type: 'office' }];

  try {
    const res = await fetch('https://api.close.com/api/v1/lead/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${CLOSE_API_KEY}:`).toString('base64')}`,
      },
      body: JSON.stringify({
        name,
        contacts: [contact],
        description: `Outcome: ${outcome}\nBudget: ${budget}\n\n${notes}`,
      }),
    });
    if (!res.ok) { console.error('Close CRM error:', await res.text()); return null; }
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

  const get = (keys: string[]): string => {
    for (const [t, v] of Object.entries(answers)) {
      if (keys.some(k => t.toLowerCase().includes(k))) return v;
    }
    return '—';
  };

  // Use type-based reserved keys first, fall back to keyword search
  const name   = get(['name', 'who am i', 'full name', 'your name']);
  const email  = answers['__email__'] || get(['email']);
  const phone  = answers['__phone__'] || get(['phone', 'mobile', 'number']);
  const budget = get(['invest', 'budget', 'ready to invest', 'tier', 'level']);

  let desc = '';
  if (closeUrl) desc += `👉 [View in Close](${closeUrl})\n\n`;
  desc += `**Name:** ${name}\n`;
  desc += `**Email:** ${email || '—'}\n`;
  desc += `**Phone:** ${phone || '—'}\n`;
  desc += `**Investment tier:** ${budget}\n`;

  // All other fields as bullet points — skip contact + reserved keys
  const SKIP = ['name', 'who am i', 'full name', 'your name', 'email', 'phone', 'mobile', 'number', 'invest', 'budget', 'tier', 'level', 'reach you'];
  const extras = Object.entries(answers).filter(
    ([t]) => !t.startsWith('__') && !SKIP.some(k => t.toLowerCase().includes(k))
  );

  if (extras.length > 0) {
    desc += '\n';
    for (const [title, val] of extras) {
      const truncated = val.length > 300 ? val.slice(0, 297) + '…' : val;
      desc += `• **${title}:** ${truncated}\n`;
    }
  }

  desc += '\n' + '—'.repeat(28);

  // Safe date formatting — Typeform test webhooks send epoch-zero timestamps
  let dateStr = 'Unknown';
  try {
    const d = new Date(submittedAt);
    if (d.getFullYear() > 2000) {
      dateStr = d.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
      });
    }
  } catch { /* ignore */ }

  return {
    embeds: [{
      title: `${cfg.emoji} ${cfg.label}`,
      description: desc,
      color: cfg.color,
      footer: { text: dateStr !== 'Unknown' ? `Submitted ${dateStr}` : 'Test submission' },
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

    const answers  = extractAnswers(payload);
    const outcome  = getOutcome(answers);
    const closeUrl = await createCloseLead(answers, outcome);
    const body     = buildEmbed(answers, outcome, payload.form_response.submitted_at, closeUrl);

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
