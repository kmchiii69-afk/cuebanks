import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_TYPEFORM!;
const CLOSE_API_KEY = process.env.CLOSE_API_KEY!;

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

// Extracts answers keyed by field title, plus four guaranteed reserved keys
// that are captured by TYPE/VALUE signature — never by question wording.
//
//   __name__   → first `text` answer (name is always the first open-ended field)
//   __email__  → the `email` type answer
//   __phone__  → the `phone_number` type answer
//   __budget__ → first `choice`/`choices` answer whose label contains "$"
//                (budget is the only choice in this form that uses dollar amounts)
//
// These four keys are ALWAYS shown in the Discord embed and Close lead.
// They never depend on question titles, so renaming questions in Typeform
// can never break them.
function extractAnswers(payload: TFPayload): Record<string, string> {
  const { definition, answers } = payload.form_response;
  const fieldMap: Record<string, string> = {};
  for (const f of definition.fields) fieldMap[f.id] = f.title;

  const out: Record<string, string> = {};
  let nameSet = false;

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

      // Reserved keys — title-independent
      if (a.type === 'email')        out['__email__']  = val;
      if (a.type === 'phone_number') out['__phone__']  = val;
      // First text answer is always the name field
      if (a.type === 'text' && !nameSet) { out['__name__'] = val; nameSet = true; }
      // Any choice with a dollar sign is the investment/budget question
      if ((a.type === 'choice' || a.type === 'choices') && val.includes('$') && !out['__budget__']) {
        out['__budget__'] = val;
      }
    }
  }
  return out;
}

// ── Determine outcome ──────────────────────────────────────────────────────────
type Outcome = 'group_call' | 'oneonone_call' | 'stepdown_group' | 'not_qualified_budget' | 'not_qualified_early' | 'incomplete';

function getOutcome(a: Record<string, string>): Outcome {
  const vals   = Object.values(a).join('|').toLowerCase();
  // Use the raw budget label for exact matching (lowercased)
  const budget = (a['__budget__'] || '').toLowerCase();

  // ── Too Early ──────────────────────────────────────────────────────────────
  if (
    vals.includes('less than a month') ||
    vals.includes('just started')      ||
    vals.includes('1–3 months')        ||
    vals.includes('1-3 months')        ||
    vals.includes('under 3 months')
  ) return 'not_qualified_early';

  // No budget answer + not too-early = partial drop-off
  if (!a['__budget__']) return 'incomplete';

  // ── Access type ────────────────────────────────────────────────────────────
  const wants1on1 =
    vals.includes('working with me directly') ||
    vals.includes('highest level of access')  ||
    vals.includes('1-on-1')                   ||
    vals.includes('1–on–1')                   ||
    vals.includes('directly');

  // ── Route by path ──────────────────────────────────────────────────────────
  if (wants1on1) {
    // 8b options: $3,000–$5,000 | Under $10,000 | $10,000–$15,000 | $15,000+
    // startsWith avoids "under $10,000" matching '$10,000'
    if (budget.startsWith('$10,000') || budget.startsWith('$15,000')) return 'oneonone_call';
    return 'stepdown_group';
  } else {
    // 8a options: $3,000–$5,000 | Under $5,000 | $5,000–$7,500 | $7,500–$12,000 | $12,000+
    if (budget.includes('under $5,000') || budget.startsWith('$3,000')) return 'not_qualified_budget';
    return 'group_call';
  }
}

const OUTCOME_CONFIG: Record<Outcome, { label: string; emoji: string; color: number }> = {
  group_call:           { label: 'GROUP CALL Lead',          emoji: '✅', color: 0x22c55e },
  oneonone_call:        { label: '1-ON-1 Lead',              emoji: '💎', color: 0xf9ff3c },
  stepdown_group:       { label: 'STEP DOWN — Group Call',   emoji: '↘️', color: 0x3b82f6 },
  not_qualified_budget: { label: '5K TICKET — Low Budget',   emoji: '📦', color: 0xf97316 },
  not_qualified_early:  { label: '5K TICKET — Too Early',    emoji: '📦', color: 0xf97316 },
  incomplete:           { label: 'Partial — No Budget Data', emoji: '⏸️', color: 0x4b5563 },
};

// Maps outcome → price tier tag attached in Close + opportunity value
const OUTCOME_TO_TIER: Partial<Record<Outcome, string>> = {
  group_call:           '7.5K',
  oneonone_call:        '15K',
  stepdown_group:       '7.5K',
  not_qualified_budget: '5K',
  not_qualified_early:  '5K',
};
const TIER_VALUE: Record<string, number> = { '5K': 5000, '7.5K': 7500, '15K': 15000 };

// ── Close CRM pipeline (cached across warm invocations) ────────────────────────
// "NEW LEAD" lead-status ID (the status shown on the lead row in Close)
let cachedLeadStatusId: string | null | undefined = undefined;
// "New lead" opportunity status ID inside the Sales pipeline
let cachedOpportunityStatusId: string | null | undefined = undefined;

function closeAuth() {
  return `Basic ${Buffer.from(`${CLOSE_API_KEY}:`).toString('base64')}`;
}

async function getNewLeadStatusId(): Promise<string | null> {
  if (cachedLeadStatusId !== undefined) return cachedLeadStatusId;
  try {
    const res = await fetch('https://api.close.com/api/v1/status/lead/', {
      headers: { Authorization: closeAuth() },
    });
    if (!res.ok) { cachedLeadStatusId = null; return null; }
    const data = await res.json() as { data: { id: string; label: string }[] };
    // Match "NEW LEAD" (case-insensitive) — fall back to any status with "new" in the name
    const pick = data.data.find(s => s.label.toLowerCase() === 'new lead')
      || data.data.find(s => s.label.toLowerCase().includes('new'));
    cachedLeadStatusId = pick?.id ?? null;
    return cachedLeadStatusId;
  } catch (e) {
    console.error('Close lead status error:', e);
    cachedLeadStatusId = null;
    return null;
  }
}

async function getSalesPipelineNewLeadStatusId(): Promise<string | null> {
  if (cachedOpportunityStatusId !== undefined) return cachedOpportunityStatusId;
  try {
    const res = await fetch('https://api.close.com/api/v1/pipeline/', {
      headers: { Authorization: closeAuth() },
    });
    if (!res.ok) { cachedOpportunityStatusId = null; return null; }
    const data = await res.json() as {
      data: { id: string; name: string; statuses: { id: string; label: string }[] }[];
    };
    // Use "Sales" pipeline; fall back to first pipeline available
    const pipeline = data.data.find(p => p.name.toLowerCase() === 'sales') || data.data[0];
    // Use "New lead" status; fall back to first active-looking status
    const pick = pipeline?.statuses?.find(s => s.label.toLowerCase().includes('new lead'))
      || pipeline?.statuses?.[0];
    cachedOpportunityStatusId = pick?.id ?? null;
    return cachedOpportunityStatusId;
  } catch (e) {
    console.error('Close pipeline error:', e);
    cachedOpportunityStatusId = null;
    return null;
  }
}

// ── Create Close CRM lead ──────────────────────────────────────────────────────
type CloseLinks = { leadUrl: string; contactUrl: string | null };

async function createCloseLead(answers: Record<string, string>, outcome: Outcome, source: string): Promise<CloseLinks | null> {
  if (!CLOSE_API_KEY) return null;

  const get = (keys: string[]): string => {
    for (const [t, v] of Object.entries(answers)) {
      if (keys.some(k => t.toLowerCase().includes(k))) return v;
    }
    return '';
  };

  const name   = answers['__name__']   || get(['name', 'full name', 'your name']) || 'Unknown';
  const email  = answers['__email__']  || get(['email']);
  const phone  = answers['__phone__']  || get(['phone', 'mobile']);
  const budget = answers['__budget__'] || get(['invest', 'budget', 'range', 'tier']);

  const notes = Object.entries(answers)
    .filter(([k]) => !k.startsWith('__'))
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const contact: Record<string, unknown> = { name };
  if (email) contact.emails = [{ email, type: 'office' }];
  if (phone) contact.phones = [{ phone, type: 'office' }];

  const tier = OUTCOME_TO_TIER[outcome];
  // Tags: [source, tier] — e.g. ['Instagram', '7.5K'] or ['Wall Street Academy Community', '15K']
  // Partial drop-offs get [source, 'Partial Form'] instead
  const tags = outcome === 'incomplete'
    ? [source, 'Partial Form']
    : [source, ...(tier ? [tier] : [])];

  try {
    const auth = closeAuth();
    const leadStatusId = await getNewLeadStatusId();

    const res = await fetch('https://api.close.com/api/v1/lead/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': auth },
      body: JSON.stringify({
        name,
        ...(leadStatusId ? { status_id: leadStatusId } : {}),
        contacts: [contact],
        description: `Source: ${source}\nOutcome: ${outcome}\nBudget: ${budget}\n\n${notes}`,
        tags,
      }),
    });
    if (!res.ok) { console.error('Close CRM error:', await res.text()); return null; }
    const data = await res.json() as { id: string; contacts?: { id: string }[] };
    const leadUrl    = `https://app.close.com/leads/${data.id}/`;
    const contactId  = data.contacts?.[0]?.id;
    const contactUrl = contactId ? `https://app.close.com/contacts/${contactId}/` : null;

    // Add every lead to Sales pipeline at "New lead" stage
    // Partials get $0 value; qualified leads get their tier value
    try {
      const statusId = await getSalesPipelineNewLeadStatusId();
      if (statusId) {
        const oppRes = await fetch('https://api.close.com/api/v1/opportunity/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': auth },
          body: JSON.stringify({
            lead_id:      data.id,
            status_id:    statusId,
            value:        tier ? TIER_VALUE[tier] : 0,
            value_period: 'one_time',
          }),
        });
        if (!oppRes.ok) console.error('Close opportunity error:', await oppRes.text());
      } else {
        console.error('Close pipeline: could not resolve Sales pipeline status ID');
      }
    } catch (e) { console.error('Close opportunity error:', e); }

    return { leadUrl, contactUrl };
  } catch (e) {
    console.error('Close CRM error:', e);
    return null;
  }
}

// ── Build Discord embed ────────────────────────────────────────────────────────
function buildEmbed(answers: Record<string, string>, outcome: Outcome, submittedAt: string, closeLinks: CloseLinks | null, source: string) {
  const cfg = OUTCOME_CONFIG[outcome];

  const get = (keys: string[]): string => {
    for (const [t, v] of Object.entries(answers)) {
      if (keys.some(k => t.toLowerCase().includes(k))) return v;
    }
    return '—';
  };

  // Reserved keys first (title-independent), keyword search as last resort
  const name   = answers['__name__']   || get(['name', 'full name', 'your name']) || '—';
  const email  = answers['__email__']  || get(['email'])                          || '—';
  const phone  = answers['__phone__']  || get(['phone', 'mobile'])                || '—';
  const budget = answers['__budget__'] || get(['invest', 'budget', 'range', 'tier']) || '—';

  let desc = '';
  if (closeLinks) {
    desc += `👉 [View Lead in Close](${closeLinks.leadUrl})`;
    if (closeLinks.contactUrl) desc += `  ·  [View Contact](${closeLinks.contactUrl})`;
    desc += '\n\n';
  }
  desc += `**Source:** ${source}\n`;
  desc += `**Name:** ${name}\n`;
  desc += `**Email:** ${email || '—'}\n`;
  desc += `**Phone:** ${phone || '—'}\n`;
  desc += `**Investment tier:** ${budget}\n`;

  // Every Q&A as bullets — skip only the internal reserved keys (__name__, __email__, etc.)
  // Nothing else is filtered so every answer they filled in appears
  const extras = Object.entries(answers).filter(([t]) => !t.startsWith('__'));

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

    const source     = req.nextUrl.searchParams.get('source') || 'Instagram';
    const answers    = extractAnswers(payload);
    const outcome    = getOutcome(answers);
    const closeLinks = await createCloseLead(answers, outcome, source);
    const body       = buildEmbed(answers, outcome, payload.form_response.submitted_at, closeLinks, source);

    // Discord rate-limit retry: if we get 429, wait retry_after ms then try once more
    let discordRes = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (discordRes.status === 429) {
      const rateLimitBody = await discordRes.json().catch(() => ({})) as { retry_after?: number };
      const waitMs = (rateLimitBody.retry_after ?? 1) * 1000;
      await new Promise(r => setTimeout(r, waitMs));
      discordRes = await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    if (!discordRes.ok) {
      const err = await discordRes.text();
      console.error('Discord webhook error:', err);
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true, closeLinks });
  } catch (e) {
    console.error('Typeform webhook error:', e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
