'use client';

import { Suspense, useState, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const BLUE = '#2563eb';

const inp: React.CSSProperties = {
  width: 280, height: 44,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '0 16px',
  fontSize: 13,
  color: '#fff',
  outline: 'none',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  letterSpacing: '0.02em',
  transition: 'border-color 0.2s, background 0.2s',
  boxSizing: 'border-box',
};

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || '';
  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const linkValid = !!email && !!token;
  const canSubmit = linkValid && password.length >= 8 && password === confirm && !loading;

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });
      if (res.ok) {
        setDone(true);
        setTimeout(() => router.replace('/login'), 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Connection error');
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(37,99,235,0.09) 0%, transparent 70%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        padding: '2rem',
      }}>
        <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wsa/home/1.png"
            alt="Wall Street Academy"
            style={{
              width: 88, height: 88, borderRadius: '50%', objectFit: 'cover',
              border: `2px solid rgba(37,99,235,0.3)`,
              boxShadow: `0 0 40px rgba(37,99,235,0.25), 0 0 80px rgba(37,99,235,0.1)`,
            }}
          />
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
            letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
          }}>Wall Street Academy</span>
        </div>

        {!linkValid ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 280, textAlign: 'center' }}>
            <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>
              This reset link is invalid or incomplete. Request a new one from the login page.
            </p>
            <a href="/login" style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
              padding: '10px 22px', fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
            }}>
              ← Back to Sign In
            </a>
          </div>
        ) : done ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 280, textAlign: 'center' }}>
            <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>
              Password updated. Redirecting you to sign in…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: '0 0 6px', width: 280, textAlign: 'center' }}>
              Choose a new password for <span style={{ color: '#fff' }}>{email}</span>.
            </p>
            <input
              className="wsa-inp"
              type="password"
              placeholder="New password (min. 8 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
              autoFocus
              style={inp}
            />
            <input
              className="wsa-inp"
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
              style={inp}
            />
            {password && confirm && password !== confirm && (
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(37,99,235,0.9)', letterSpacing: '0.08em', margin: '2px 0 0' }}>
                Passwords don&apos;t match
              </p>
            )}
            {error && (
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(37,99,235,0.9)', letterSpacing: '0.08em', margin: '2px 0 0' }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                marginTop: 8, width: 280, height: 44,
                background: canSubmit ? BLUE : 'rgba(37,99,235,0.08)',
                border: canSubmit ? '1px solid transparent' : `1px solid rgba(37,99,235,0.18)`,
                borderRadius: 8,
                fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: canSubmit ? '#fff' : 'rgba(37,99,235,0.4)',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              {loading ? '· · ·' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
