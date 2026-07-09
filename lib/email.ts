import { randomBytes } from 'crypto';
import type { Plan } from './db';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = 'Wall Street Academy <onboarding@wallstreetacademyfx.com>';
const LOGIN_URL = 'https://wallstreetacademyfx.com/login';

export function generatePassword(): string {
  return randomBytes(8).toString('base64url').slice(0, 12);
}

const PLAN_LABELS: Record<Plan, string> = {
  '5k':        '5K Inner Circle',
  '7.5k':      '7.5K Inner Circle',
  '15k':       '15K Inner Circle',
  'low_ticket': 'Low Ticket — Cue AI',
};

export async function sendWelcomeEmail(opts: {
  to: string;
  name: string;
  password: string;
  plan: Plan;
}): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping welcome email to', opts.to);
    return;
  }

  const planLabel = PLAN_LABELS[opts.plan] ?? opts.plan;
  const displayName = opts.name ? opts.name.split(' ')[0] : 'there';
  const isLowTicket = opts.plan === 'low_ticket';

  const nextSteps = isLowTicket
    ? `<p style="margin:0 0 8px;color:#94a3b8;">Once you're in, head to <strong style="color:#e2e8f0;">Cue AI</strong> to start getting answers about your trading.</p>`
    : `<p style="margin:0 0 8px;color:#94a3b8;">Once you're in, complete your onboarding steps:</p>
       <ol style="margin:8px 0 0;padding-left:20px;color:#94a3b8;line-height:1.8;">
         <li>Watch the welcome video</li>
         <li>Sign your member contract</li>
         <li>Join the members-only Discord</li>
         <li>Book your onboarding call</li>
         <li>Set your trading goal</li>
       </ol>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Welcome to Wall Street Academy</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

      <!-- Header -->
      <tr><td style="padding-bottom:32px;text-align:center;">
        <span style="display:inline-block;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#2563eb;font-family:monospace;">
          · Wall Street Academy ·
        </span>
      </td></tr>

      <!-- Card -->
      <tr><td style="background:#111118;border:1px solid #1e1e2e;border-top:2px solid #2563eb;padding:40px 36px;border-radius:2px;">

        <p style="margin:0 0 24px;font-size:22px;font-weight:700;color:#f8fafc;letter-spacing:-0.02em;">
          Welcome, ${displayName}.
        </p>

        <p style="margin:0 0 8px;color:#94a3b8;font-size:15px;line-height:1.6;">
          You're in. Your <strong style="color:#e2e8f0;">${planLabel}</strong> access is active.
          Here are your login credentials — save these somewhere safe.
        </p>

        <!-- Credentials box -->
        <div style="margin:28px 0;background:#0d0d14;border:1px solid #1e1e2e;border-left:3px solid #2563eb;padding:20px 24px;border-radius:2px;">
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#2563eb;font-family:monospace;">
            Your Login
          </p>
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;width:90px;font-family:monospace;">Email</td>
              <td style="padding:6px 0;color:#f1f5f9;font-size:14px;font-weight:600;font-family:monospace;">${opts.to}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;font-family:monospace;">Password</td>
              <td style="padding:6px 0;color:#f1f5f9;font-size:14px;font-weight:600;font-family:monospace;">${opts.password}</td>
            </tr>
          </table>
        </div>

        <!-- CTA -->
        <div style="margin:0 0 28px;text-align:center;">
          <a href="${LOGIN_URL}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.04em;padding:14px 40px;border-radius:2px;">
            Log In to Your Portal →
          </a>
        </div>

        <!-- Next steps -->
        <div style="border-top:1px solid #1e1e2e;padding-top:24px;font-size:14px;line-height:1.6;">
          ${nextSteps}
        </div>

      </td></tr>

      <!-- Footer -->
      <tr><td style="padding-top:28px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#334155;line-height:1.6;">
          Wall Street Academy LLC · ${LOGIN_URL}<br/>
          Questions? Reply to this email or contact <a href="mailto:alex@wsacademyfx.com" style="color:#334155;">alex@wsacademyfx.com</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [opts.to],
      subject: `Welcome to Wall Street Academy — Your ${planLabel} Access`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[email] Resend error:', err);
    throw new Error(`Email send failed: ${err}`);
  }

  const data = await res.json() as { id?: string };
  console.log('[email] Welcome email sent to', opts.to, '— id:', data.id);
}
