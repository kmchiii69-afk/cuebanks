'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Member {
  email: string;
  name: string;
  role: 'member' | 'admin';
  cohort: string;
  created_at: number;
  last_login: number;
}

const PHASE_LABELS = [
  { num: '01', title: 'Foundation & Mindset', duration: 'Week 1–2' },
  { num: '02', title: 'Reading Price Action', duration: 'Week 2–3' },
  { num: '03', title: 'Structure + Levels', duration: 'Week 3–4' },
  { num: '04', title: 'The Confluence System', duration: 'Week 4–7' },
  { num: '05', title: 'Advanced Execution', duration: 'Week 7–10' },
  { num: '06', title: 'Live & Consistent', duration: 'Week 10–16' },
];

function fmt(ts: number) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PortalPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activePhase, setActivePhase] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => {
        if (!r.ok) { router.replace('/login'); return null; }
        return r.json();
      })
      .then(data => {
        if (data) { setMember(data); setLoading(false); }
      })
      .catch(() => router.replace('/login'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function logout() {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(249,255,60,0.4)', letterSpacing: '0.2em' }}>LOADING</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(249,255,60,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(249,255,60,0.015) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 60,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#f9ff3c',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 14, color: '#000' }}>W</span>
          </div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {member?.name && (
            <span style={{ fontFamily: "'DM Sans', system-ui", fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{member.name}</span>
          )}
          <button
            onClick={logout}
            disabled={loggingOut}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, padding: '6px 14px',
              fontFamily: "'Space Mono', monospace", fontSize: 10,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
          >
            {loggingOut ? '...' : 'Sign out'}
          </button>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.28em', color: 'rgba(249,255,60,0.5)', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Wall Street Academy
          </p>
          <h1 style={{ fontFamily: "'Sora', system-ui", fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 8px' }}>
            {member?.name ? `Welcome back, ${member.name.split(' ')[0]}.` : 'Welcome back.'}
          </h1>
          <p style={{ fontFamily: "'DM Sans', system-ui", fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {member?.cohort ? `Cohort ${member.cohort}` : 'WSA Member'} · Joined {fmt(member?.created_at ?? 0)}
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 48 }}>
          {[
            { label: 'Course Roadmap', desc: 'Your full 16-week curriculum', href: '/roadmap', acid: true },
            { label: 'Cue AI', desc: 'Ask anything about the course', href: '/roadmap', acid: false },
          ].map(card => (
            <a key={card.label} href={card.href} style={{
              display: 'block',
              background: card.acid ? 'rgba(249,255,60,0.05)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${card.acid ? 'rgba(249,255,60,0.2)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 10, padding: '20px 20px',
              textDecoration: 'none', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = card.acid ? 'rgba(249,255,60,0.09)' : 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = card.acid ? 'rgba(249,255,60,0.05)' : 'rgba(255,255,255,0.03)'; }}
            >
              <div style={{ fontFamily: "'Sora', system-ui", fontWeight: 600, fontSize: 15, color: card.acid ? '#f9ff3c' : '#fff', marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontFamily: "'DM Sans', system-ui", fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{card.desc}</div>
            </a>
          ))}
        </div>

        {/* Phase overview */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Your 16-Week Curriculum</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {PHASE_LABELS.map((ph, i) => (
            <div
              key={ph.num}
              onClick={() => setActivePhase(activePhase === i ? null : i)}
              style={{
                background: activePhase === i ? 'rgba(249,255,60,0.04)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${activePhase === i ? 'rgba(249,255,60,0.15)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 8, padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (activePhase !== i) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { if (activePhase !== i) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                  color: activePhase === i ? '#f9ff3c' : 'rgba(255,255,255,0.2)',
                  letterSpacing: '0.1em', flexShrink: 0,
                }}>{ph.num}</span>
                <span style={{ fontFamily: "'DM Sans', system-ui", fontSize: 14, fontWeight: 500, color: activePhase === i ? '#fff' : 'rgba(255,255,255,0.65)' }}>{ph.title}</span>
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', flexShrink: 0 }}>{ph.duration}</span>
            </div>
          ))}
        </div>

        {/* Roadmap CTA */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a href="/roadmap" style={{
            display: 'inline-block',
            fontFamily: "'Space Mono', monospace", fontSize: 10,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(249,255,60,0.6)', textDecoration: 'none',
            padding: '10px 0',
            borderBottom: '1px solid rgba(249,255,60,0.2)',
            transition: 'color 0.15s, border-color 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f9ff3c'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,255,60,0.6)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(249,255,60,0.6)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,255,60,0.2)'; }}
          >
            Open Full Roadmap →
          </a>
        </div>
      </main>
    </div>
  );
}
