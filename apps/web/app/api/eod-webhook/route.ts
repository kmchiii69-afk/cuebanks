import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK_EOD = process.env.DISCORD_WEBHOOK_EOD!;

interface TFField  { id: string; title: string; type: string }
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
    definition: { fields: TFField[]; title?: string };
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
    if (a.type === 'text' && a.text)                      val = a.text;
    else if (a.type === 'email' && a.email)               val = a.email;
    else if (a.type === 'phone_number' && a.phone_number) val = a.phone_number;
    else if (a.type === 'choice' && a.choice)             val = a.choice.label;
    else if (a.type === 'choices' && a.choices)           val = a.choices.labels.join(', ');
    else if (a.type === 'number' && a.number != null)     val = String(a.number);
    else if (a.type === 'boolean' && a.boolean != null)   val = a.boolean ? 'Yes' : 'No';
    if (val) out[title] = val;
  }
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json() as TFPayload;
    if (!payload?.form_response) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }

    const answers = extractAnswers(payload);
    const submittedAt = payload.form_response.submitted_at;

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

    // First text answer is likely the closer's name
    const closerName = Object.values(answers)[0] || 'Closer';

    let desc = '';
    for (const [q, a] of Object.entries(answers)) {
      const truncated = a.length > 400 ? a.slice(0, 397) + '…' : a;
      desc += `**${q}**\n${truncated}\n\n`;
    }
    if (desc.length > 4000) desc = desc.slice(0, 3997) + '…';

    const body = {
      embeds: [{
        title: `📋 EOD Report — ${closerName}`,
        description: desc.trim(),
        color: 0x6366f1,
        footer: { text: `Submitted ${dateStr}` },
      }],
    };

    let discordRes = await fetch(DISCORD_WEBHOOK_EOD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (discordRes.status === 429) {
      const rl = await discordRes.json().catch(() => ({})) as { retry_after?: number };
      await new Promise(r => setTimeout(r, (rl.retry_after ?? 1) * 1000));
      discordRes = await fetch(DISCORD_WEBHOOK_EOD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    if (!discordRes.ok) {
      const err = await discordRes.text();
      console.error('EOD Discord error:', err);
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('EOD webhook error:', e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
