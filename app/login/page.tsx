'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const BLUE = '#2563eb';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hadError, setHadError] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
    fetch('/api/auth/me').then(r => {
      if (r.ok) router.replace('/portal');
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (!email.trim() || !password || loading) return;
    setLoading(true);
    setError(false);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (res.ok) {
        router.replace('/portal');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || 'Invalid credentials');
        setError(true);
        setHadError(true);
        setPassword('');
        setTimeout(() => { setError(false); setErrorMsg(''); }, 1800);
      }
    } catch {
      setErrorMsg('Connection error');
      setError(true);
      setHadError(true);
      setTimeout(() => { setError(false); setErrorMsg(''); }, 1800);
    }
    setLoading(false);
  }

  const canSubmit = !loading && !!email && !!password;

  const inp: React.CSSProperties = {
    width: 280, height: 44,
    background: error ? 'rgba(37,99,235,0.05)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${error ? 'rgba(37,99,235,0.5)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 8,
    padding: '0 16px',
    fontSize: 13,
    color: '#fff',
    outline: 'none',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    letterSpacing: '0.02em',
    transition: 'border-color 0.2s, background 0.2s',
    animation: error ? 'wsa-shake 0.4s ease' : 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />
      {/* Center glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(37,99,235,0.09) 0%, transparent 70%)',
      }} />

      <style>{`
        @keyframes wsa-shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}80%{transform:translateX(4px)}
        }
        @keyframes wsa-fade-up {
          from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)}
        }
        .wsa-fade-up { animation: wsa-fade-up 0.6s ease forwards; }
        .wsa-inp::placeholder { color: rgba(255,255,255,0.22); }
        .wsa-inp:focus {
          border-color: rgba(37,99,235,0.55) !important;
          background: rgba(37,99,235,0.04) !important;
        }
        .wsa-btn:hover:not(:disabled) {
          opacity: 0.88;
        }
      `}</style>

      <div className="wsa-fade-up" style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        padding: '2rem',
      }}>
        {/* WSA Logo */}
        <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wsa/home/1.png"
            alt="Wall Street Academy"
            style={{
              width: 88, height: 88,
              borderRadius: '50%',
              objectFit: 'cover',
              border: `2px solid rgba(37,99,235,0.3)`,
              boxShadow: `0 0 40px rgba(37,99,235,0.25), 0 0 80px rgba(37,99,235,0.1)`,
            }}
          />
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
            letterSpacing: '0.35em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}>Wall Street Academy</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <input
            ref={emailRef}
            className="wsa-inp"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(false); }}
            autoComplete="email"
            disabled={loading}
            style={inp}
          />
          <div style={{ position: 'relative', width: 280 }}>
            <input
              className="wsa-inp"
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              autoComplete="current-password"
              disabled={loading}
              style={{ ...inp, width: '100%', paddingRight: hadError ? 38 : 16 }}
            />
            {hadError && (
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                  color: showPass ? `rgba(37,99,235,0.9)` : 'rgba(255,255,255,0.25)',
                  fontSize: 14, lineHeight: 1, transition: 'color 0.2s',
                }}
              >
                {showPass ? '●' : '○'}
              </button>
            )}
          </div>

          {errorMsg && (
            <p style={{
              fontFamily: "'Space Mono', monospace", fontSize: 10,
              color: `rgba(37,99,235,0.9)`, letterSpacing: '0.08em',
              margin: '2px 0 0',
            }}>{errorMsg}</p>
          )}

          <button
            className="wsa-btn"
            type="submit"
            disabled={!canSubmit}
            style={{
              marginTop: 8,
              width: 280, height: 44,
              background: canSubmit ? BLUE : 'rgba(37,99,235,0.08)',
              border: canSubmit ? '1px solid transparent' : `1px solid rgba(37,99,235,0.18)`,
              borderRadius: 8,
              fontFamily: "'Space Mono', monospace",
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: canSubmit ? '#fff' : 'rgba(37,99,235,0.4)',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            {loading ? '· · ·' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
