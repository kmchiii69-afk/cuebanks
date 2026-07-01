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
  current_phase: number;
}

const PHASES = [
  { num: '01', title: 'Foundation & Mindset',    duration: 'Week 1–2'   },
  { num: '02', title: 'Reading Price Action',     duration: 'Week 2–3'   },
  { num: '03', title: 'Structure + Levels',       duration: 'Week 3–4'   },
  { num: '04', title: 'The Confluence System',    duration: 'Week 4–7'   },
  { num: '05', title: 'Advanced Execution',       duration: 'Week 7–10'  },
  { num: '06', title: 'Live & Consistent',        duration: 'Week 10–16' },
];

function fmt(ts: number) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const mono: React.CSSProperties = { fontFamily: "'Space Mono', monospace" };
const sans: React.CSSProperties = { fontFamily: "'DM Sans', system-ui, sans-serif" };
const sora: React.CSSProperties = { fontFamily: "'Sora', system-ui, sans-serif" };

export default function PortalPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [savingPhase, setSavingPhase] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) { router.replace('/login'); return null; } return r.json(); })
      .then(data => { if (data) { setMember(data); setLoading(false); } })
      .catch(() => router.replace('/login'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function logout() {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  }

  async function setPhase(phase: number) {
    if (!member || savingPhase) return;
    setSavingPhase(true);
    await fetch('/api/portal/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phase }),
    });
    setMember(m => m ? { ...m, current_phase: phase } : m);
    setSavingPhase(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...mono, fontSize: 11, color: 'rgba(249,255,60,0.4)', letterSpacing: '0.2em' }}>LOADING</div>
      </div>
    );
  }

  const phase = member?.current_phase ?? 0;
  const isAdmin = member?.role === 'admin';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f9ff3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ ...mono, fontWeight: 700, fontSize: 14, color: '#000' }}>W</span>
          </div>
          <span style={{ ...mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Portal</span>
          {isAdmin && (
            <a href="/admin" style={{
              ...mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#f9ff3c', textDecoration: 'none',
              background: 'rgba(249,255,60,0.08)', border: '1px solid rgba(249,255,60,0.2)',
              borderRadius: 5, padding: '4px 10px',
            }}>Admin Panel</a>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {member?.name && <span style={{ ...sans, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{member.name}</span>}
          <button onClick={logout} disabled={loggingOut} style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '6px 14px',
            ...mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
          >{loggingOut ? '...' : 'Sign out'}</button>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ ...mono, fontSize: 10, letterSpacing: '0.28em', color: 'rgba(249,255,60,0.5)', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Wall Street Academy
          </p>
          <h1 style={{ ...sora, fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 8px' }}>
            {member?.name ? `Welcome back, ${member.name.split(' ')[0]}.` : 'Welcome back.'}
          </h1>
          <p style={{ ...sans, fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {member?.cohort ? `Cohort ${member.cohort}` : 'WSA Member'} · Joined {fmt(member?.created_at ?? 0)}
          </p>
        </div>

        {/* Action Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isAdmin ? 3 : 2}, 1fr)`, gap: 12, marginBottom: 52 }}>
          {[
            { label: 'Course Roadmap', desc: 'Your full 16-week curriculum', href: '/roadmap', accent: true },
            { label: 'Cue AI',         desc: 'Ask anything about the course', href: '/cue',     accent: false },
            ...(isAdmin ? [{ label: 'Admin Panel', desc: 'Members, progress, access', href: '/admin', accent: false, admin: true }] : []),
          ].map(card => (
            <a key={card.label} href={card.href} style={{
              display: 'block',
              background: card.accent ? 'rgba(249,255,60,0.05)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${'admin' in card && card.admin ? 'rgba(249,255,60,0.15)' : card.accent ? 'rgba(249,255,60,0.2)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 10, padding: '20px 20px', textDecoration: 'none', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = card.accent ? 'rgba(249,255,60,0.09)' : 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = card.accent ? 'rgba(249,255,60,0.05)' : 'rgba(255,255,255,0.03)'; }}
            >
              <div style={{ ...sora, fontWeight: 600, fontSize: 15, color: card.accent || ('admin' in card && card.admin) ? '#f9ff3c' : '#fff', marginBottom: 4 }}>{card.label}</div>
              <div style={{ ...sans, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{card.desc}</div>
            </a>
          ))}
        </div>

        {/* Phase Progress */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ ...mono, fontSize: 9, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
            Your Progress · 16-Week Curriculum
          </span>
          <span style={{ ...mono, fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
            {phase === 0 ? 'Not started' : phase >= 6 ? 'Completed' : `Phase ${phase} of 6`}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(phase / 6) * 100}%`, background: '#f9ff3c', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16 }}>
          {PHASES.map((ph, i) => {
            const phaseNum = i + 1;
            const isActive = phase === phaseNum;
            const isDone   = phase > phaseNum;
            return (
              <div
                key={ph.num}
                onClick={() => setPhase(isActive ? 0 : phaseNum)}
                style={{
                  background: isActive ? 'rgba(249,255,60,0.06)' : isDone ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isActive ? 'rgba(249,255,60,0.25)' : isDone ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: 8, padding: '14px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = isDone ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ ...mono, fontSize: 10, fontWeight: 700, color: isActive ? '#f9ff3c' : isDone ? '#22c55e' : 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', flexShrink: 0, width: 20 }}>
                    {isDone ? '✓' : ph.num}
                  </span>
                  <span style={{ ...sans, fontSize: 14, fontWeight: 500, color: isActive ? '#fff' : isDone ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.5)' }}>{ph.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {isActive && <span style={{ ...mono, fontSize: 9, color: '#f9ff3c', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Current</span>}
                  <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', flexShrink: 0 }}>{ph.duration}</span>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ ...sans, fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0, textAlign: 'center' }}>
          Click a phase to mark it as your current progress
        </p>

        {/* Roadmap CTA */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <a href="/roadmap" style={{
            display: 'inline-block', ...mono, fontSize: 10,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(249,255,60,0.6)', textDecoration: 'none',
            padding: '10px 0', borderBottom: '1px solid rgba(249,255,60,0.2)', transition: 'color 0.15s, border-color 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f9ff3c'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,255,60,0.6)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(249,255,60,0.6)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,255,60,0.2)'; }}
          >Open Full Roadmap →</a>
        </div>
      </main>
    </div>
  );
}
