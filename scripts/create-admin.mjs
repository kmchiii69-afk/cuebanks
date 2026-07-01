import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('/Users/kimchi/cuebanks/.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => {
      const [k, ...vs] = l.split('=');
      const v = vs.join('=').trim().replace(/^["']|["']$/g, '');
      return [k.trim(), v];
    })
);

const BASE = `${env.SUPABASE_URL}/rest/v1/wsa_members`;
const HEADERS = {
  'Content-Type': 'application/json',
  'apikey': env.SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
};

const email = 'wsaadmin@gmail.com';
const password = '123456';
const hash = await bcrypt.hash(password, 12);

// Check if exists
const checkRes = await fetch(`${BASE}?email=eq.${encodeURIComponent(email)}&select=email`, { headers: HEADERS });
const existing = await checkRes.json();

if (existing.length > 0) {
  const res = await fetch(`${BASE}?email=eq.${encodeURIComponent(email)}`, {
    method: 'PATCH',
    headers: { ...HEADERS, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ password_hash: hash, role: 'admin', active: true }),
  });
  if (!res.ok) { console.error('Update failed:', await res.text()); process.exit(1); }
  console.log('✅ Updated wsaadmin@gmail.com — role: admin, password: 123456');
} else {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { ...HEADERS, 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      email, password_hash: hash, name: 'WSA Admin', role: 'admin',
      active: true, cohort: '', discord_id: '', notes: '',
      created_at: Date.now(), last_login: 0,
    }),
  });
  if (!res.ok) { console.error('Insert failed:', await res.text()); process.exit(1); }
  console.log('✅ Created wsaadmin@gmail.com — role: admin, password: 123456');
}
