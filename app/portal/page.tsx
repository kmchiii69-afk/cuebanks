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
  { num: 'SET', title: 'Set',              duration: 'Week 1–2' },
  { num: 'EXE', title: 'Execute',          duration: 'Week 3–4' },
  { num: '01',  title: 'Phase 1',          duration: 'Week 5+'  },
  { num: '02',  title: 'Phase 2',          duration: 'Ongoing'  },
  { num: '03',  title: 'Phase 3',          duration: 'Ongoing'  },
  { num: '04',  title: 'Phase 4',          duration: 'Ongoing'  },
  { num: '★',   title: 'Bonus',            duration: 'Ongoing'  },
];

const SESSIONS = [
  { name: 'London',   utcOpen: 8,  utcClose: 17, overnight: false, color: '#3b82f6', pairs: ['EUR/USD', 'GBP/USD', 'EUR/GBP', 'EUR/JPY'] },
  { name: 'New York', utcOpen: 13, utcClose: 22, overnight: false, color: '#f9ff3c', pairs: ['USD/JPY', 'XAU/USD', 'EUR/USD', 'GBP/USD'] },
  { name: 'Tokyo',    utcOpen: 0,  utcClose: 9,  overnight: false, color: '#f97316', pairs: ['USD/JPY', 'AUD/JPY', 'GBP/JPY', 'NZD/JPY'] },
  { name: 'Sydney',   utcOpen: 22, utcClose: 7,  overnight: true,  color: '#22c55e', pairs: ['AUD/USD', 'NZD/USD', 'AUD/JPY'] },
];

const CUE_TIPS = [
  'Structure is always first. Before anything else, define the trend.',
  'If the market is above the MAs, focus on buys. Below the MAs, focus on sells.',
  'Draw trendlines from wick to wick. If you can\'t walk in it, it\'s invalid.',
  '38.2% is your first higher-low opportunity. Know which fib levels to trust.',
  'The London/NY overlap (1pm–5pm UTC) is the most volatile window. Use it.',
  'H4 for direction, M15 for entries. Never trade the lower TF without the higher TF.',
  'The most confident person in the room will make the most amount of money.',
  'Never have urgency for the market to go in your favor — that\'s how you close early.',
  '2+ No Trade boxes checked? Step away. The market will be there tomorrow.',
  'Top down every single session before you touch a lower timeframe entry.',
  'Study, backtest, apply, review, repeat. There\'s no shortcut.',
  'You can master one pair and make a profit from it every day for the rest of your life.',
];

function isSessionOpen(s: typeof SESSIONS[0], utcH: number, utcM: number): boolean {
  const t = utcH + utcM / 60;
  if (s.overnight) return t >= s.utcOpen || t < s.utcClose;
  return t >= s.utcOpen && t < s.utcClose;
}

function fmtH(h: number) {
  const suffix = h >= 12 && h < 24 ? 'pm' : 'am';
  const hh = h === 0 || h === 24 ? 12 : h > 12 ? h - 12 : h;
  return `${hh}${suffix}`;
}

function fmt(ts: number) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const M: React.CSSProperties = { fontFamily: "'Space Mono', monospace" };
const S: React.CSSProperties = { fontFamily: "'DM Sans', system-ui, sans-serif" };
const D: React.CSSProperties = { fontFamily: "'Sora', system-ui, sans-serif" };

export default function PortalPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [savingPhase, setSavingPhase] = useState(false);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [openSessions, setOpenSessions] = useState<boolean[]>([false, false, false, false]);
  const [nowUtc, setNowUtc] = useState('');
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) { router.replace('/login'); return null; } return r.json(); })
      .then(data => {
        if (data) {
          setMember(data);
          setNotes(localStorage.getItem(`wsa-notes-${data.email}`) || '');
          setLoading(false);
        }
      })
      .catch(() => router.replace('/login'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTipIndex(Math.floor(Date.now() / 1000 / 3600) % CUE_TIPS.length);
    function tick() {
      const now = new Date();
      const h = now.getUTCHours();
      const m = now.getUTCMinutes();
      setOpenSessions(SESSIONS.map(s => isSessionOpen(s, h, m)));
      setNowUtc(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} UTC`);
    }
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

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

  function saveNotes() {
    if (!member) return;
    localStorage.setItem(`wsa-notes-${member.email}`, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#040608', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...M, fontSize: 11, color: 'rgba(249,255,60,0.4)', letterSpacing: '0.2em' }}>LOADING</div>
      </div>
    );
  }

  const phase = member?.current_phase ?? 0;
  const isAdmin = member?.role === 'admin';
  const liveCount = openSessions.filter(Boolean).length;
  const londonNyOverlap = openSessions[0] && openSessions[1];

  return (
    <div style={{ minHeight: '100vh', background: '#040608', color: '#fff', position: 'relative' }}>
      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(249,255,60,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(249,255,60,0.015) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
      }} />

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(4,6,8,0.96)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: 64,
      }}>
        {/* Logo + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wsa/home/1.png" alt="Wall Street Academy" style={{ height: 42, width: 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.12)' }} />
          <div>
            <div style={{ ...M, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1 }}>Wall Street Academy</div>
            <div style={{ ...M, fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 3 }}>Member Portal</div>
          </div>
          {isAdmin && (
            <a href="/admin" style={{
              ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#f9ff3c', textDecoration: 'none',
              background: 'rgba(249,255,60,0.08)', border: '1px solid rgba(249,255,60,0.2)',
              borderRadius: 4, padding: '4px 10px', marginLeft: 6,
            }}>Admin</a>
          )}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: liveCount > 0 ? '#22c55e' : '#3a3a3a', flexShrink: 0, boxShadow: liveCount > 0 ? '0 0 8px #22c55e80' : 'none' }} />
            <span style={{ ...M, fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{liveCount} session{liveCount !== 1 ? 's' : ''} live</span>
          </div>
          {nowUtc && <span style={{ ...M, fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>{nowUtc}</span>}
          {member?.name && <span style={{ ...S, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{member.name.split(' ')[0]}</span>}
          <button onClick={logout} disabled={loggingOut} style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, padding: '6px 14px',
            ...M, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
          >{loggingOut ? '...' : 'Sign out'}</button>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1120, margin: '0 auto', padding: '36px 24px 80px' }}>

        {/* ── ROW 1: Welcome + Market Sessions ──────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginBottom: 16, alignItems: 'start' }}>

          {/* Welcome card */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '28px 28px 24px' }}>
            <p style={{ ...M, fontSize: 9, letterSpacing: '0.24em', color: 'rgba(249,255,60,0.5)', textTransform: 'uppercase', margin: '0 0 10px' }}>
              {member?.cohort ? `Cohort ${member.cohort}` : 'WSA Member'} · Joined {fmt(member?.created_at ?? 0)}
            </p>
            <h1 style={{ ...D, fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 22px' }}>
              {member?.name ? `Welcome back, ${member.name.split(' ')[0]}.` : 'Welcome back.'}
            </h1>

            {/* Progress bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ ...M, fontSize: 8, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Curriculum Progress</span>
              <span style={{ ...M, fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
                {phase === 0 ? 'Not started' : phase >= 7 ? 'Complete ✓' : `Phase ${phase} of 7`}
              </span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(phase / 7) * 100}%`, background: 'linear-gradient(90deg, #f9ff3c, #d4f700)', borderRadius: 2, transition: 'width 0.5s ease' }} />
            </div>

            {/* Cue's tip */}
            <div style={{ background: 'rgba(249,255,60,0.04)', border: '1px solid rgba(249,255,60,0.12)', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ ...M, fontSize: 8, fontWeight: 700, color: 'rgba(249,255,60,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>· Cue's Rule of the Day ·</div>
              <div style={{ ...S, fontSize: 13.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, fontStyle: 'italic' }}>
                &ldquo;{CUE_TIPS[tipIndex]}&rdquo;
              </div>
            </div>
          </div>

          {/* Market Sessions */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '22px 20px' }}>
            <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 14 }}>Market Sessions · UTC</div>

            {londonNyOverlap && (
              <div style={{ background: 'rgba(249,255,60,0.07)', border: '1px solid rgba(249,255,60,0.22)', borderRadius: 7, padding: '8px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f9ff3c', flexShrink: 0, boxShadow: '0 0 8px #f9ff3c' }} />
                <span style={{ ...M, fontSize: 8, color: '#f9ff3c', letterSpacing: '0.12em', textTransform: 'uppercase' }}>London / NY Overlap — Peak Volatility</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {SESSIONS.map((s, i) => {
                const open = openSessions[i];
                return (
                  <div key={s.name} style={{
                    background: open ? `${s.color}10` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${open ? `${s.color}35` : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: 8, padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.3s',
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: open ? s.color : '#333', flexShrink: 0, boxShadow: open ? `0 0 10px ${s.color}80` : 'none', transition: 'all 0.3s' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <span style={{ ...M, fontSize: 10, fontWeight: 700, color: open ? '#fff' : 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>{s.name}</span>
                        <span style={{ ...M, fontSize: 8, color: open ? s.color : 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{open ? 'OPEN' : 'CLOSED'}</span>
                      </div>
                      <div style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em' }}>
                        {fmtH(s.utcOpen)} – {fmtH(s.overnight ? s.utcClose + 24 : s.utcClose)} UTC &nbsp;·&nbsp; {s.pairs.slice(0, 2).join(' · ')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ ...S, fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                Best window: <span style={{ color: '#f9ff3c' }}>1pm – 5pm UTC</span><br />
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>London / NY overlap · highest liquidity</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Action Cards ──────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? 'repeat(3,1fr)' : 'repeat(2,1fr)', gap: 14, marginBottom: 16 }}>
          <a href="/roadmap" style={{
            display: 'flex', alignItems: 'center', gap: 18, padding: '20px 22px',
            background: 'rgba(249,255,60,0.04)', border: '1px solid rgba(249,255,60,0.18)',
            borderRadius: 12, textDecoration: 'none', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(249,255,60,0.09)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,255,60,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(249,255,60,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,255,60,0.18)'; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(249,255,60,0.1)', border: '1px solid rgba(249,255,60,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4h14M3 8h10M3 12h12M3 16h7" stroke="#f9ff3c" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...D, fontSize: 16, fontWeight: 700, color: '#f9ff3c', marginBottom: 3 }}>Course Roadmap</div>
              <div style={{ ...S, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                {phase === 0 ? 'Start here — Week 0, Prepare' : phase >= 7 ? 'All phases complete' : `Phase ${phase} of 7 active`}
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><path d="M3 7h8M8 4l3 3-3 3" stroke="rgba(249,255,60,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>

          <a href="/cue" style={{
            display: 'flex', alignItems: 'center', gap: 18, padding: '20px 22px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, textDecoration: 'none', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(249,255,60,0.1)', border: '1px solid rgba(249,255,60,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ ...M, fontWeight: 800, fontSize: 19, color: '#f9ff3c', lineHeight: 1 }}>C</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...D, fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Cue AI</div>
              <div style={{ ...S, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Ask anything — trading, strategy, mindset</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><path d="M3 7h8M8 4l3 3-3 3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>

          {isAdmin && (
            <a href="/admin" style={{
              display: 'flex', alignItems: 'center', gap: 18, padding: '20px 22px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, textDecoration: 'none', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/><path d="M3 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...D, fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.65)', marginBottom: 3 }}>Admin Panel</div>
                <div style={{ ...S, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Members · progress · access</div>
              </div>
            </a>
          )}
        </div>

        {/* ── ROW 3: Phase Tracker ─────────────────────────────────── */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '22px 22px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Phase Tracker · Click to Mark Progress</span>
            <a href="/roadmap" style={{ ...M, fontSize: 8, letterSpacing: '0.14em', color: 'rgba(249,255,60,0.5)', textDecoration: 'none', textTransform: 'uppercase' }}>Open Full Roadmap →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
            {PHASES.map((ph, i) => {
              const phaseNum = i + 1;
              const isActive = phase === phaseNum;
              const isDone = phase > phaseNum;
              return (
                <div
                  key={ph.num}
                  onClick={() => setPhase(isActive ? 0 : phaseNum)}
                  style={{
                    background: isActive ? 'rgba(249,255,60,0.09)' : isDone ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? 'rgba(249,255,60,0.35)' : isDone ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 9, padding: '10px 8px',
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.16)'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = isDone ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'; }}
                >
                  <div style={{ ...M, fontSize: 10, fontWeight: 700, color: isActive ? '#f9ff3c' : isDone ? '#22c55e' : 'rgba(255,255,255,0.22)', marginBottom: 5 }}>
                    {isDone ? '✓' : ph.num}
                  </div>
                  <div style={{ ...S, fontSize: 10, color: isActive ? 'rgba(255,255,255,0.85)' : isDone ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.3)', lineHeight: 1.3 }}>{ph.title}</div>
                  <div style={{ ...M, fontSize: 7, color: 'rgba(255,255,255,0.15)', marginTop: 4, letterSpacing: '0.04em' }}>{ph.duration}</div>
                </div>
              );
            })}
          </div>
          <p style={{ ...S, fontSize: 11, color: 'rgba(255,255,255,0.18)', margin: '10px 0 0', textAlign: 'center' }}>
            PREPARE (Week 0) is complete once you finish the first section of the roadmap
          </p>
        </div>

        {/* ── ROW 4: Key Pairs + Notes + Quick Ref ──────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>

          {/* Key Pairs by Session */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 18px' }}>
            <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 16 }}>Key Pairs by Session</div>
            {[
              { session: 'London',   time: '8am–5pm UTC',  color: '#3b82f6', pairs: ['EUR/USD', 'GBP/USD', 'EUR/GBP', 'EUR/JPY'] },
              { session: 'New York', time: '1pm–10pm UTC', color: '#f9ff3c', pairs: ['USD/JPY', 'XAU/USD', 'EUR/USD', 'GBP/USD'] },
              { session: 'Tokyo',    time: '12am–9am UTC', color: '#f97316', pairs: ['USD/JPY', 'AUD/JPY', 'GBP/JPY'] },
              { session: 'Sydney',   time: '10pm–7am UTC', color: '#22c55e', pairs: ['AUD/USD', 'NZD/USD', 'AUD/JPY'] },
            ].map(s => (
              <div key={s.session} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ ...M, fontSize: 9, fontWeight: 700, color: s.color, letterSpacing: '0.06em' }}>{s.session}</span>
                  <span style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>{s.time}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {s.pairs.map(p => (
                    <span key={p} style={{ ...M, fontSize: 8, color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '2px 7px' }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ ...M, fontSize: 7.5, color: 'rgba(249,255,60,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Overlap Window</div>
              <div style={{ ...S, fontSize: 11.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.55 }}>
                London + NY: <span style={{ color: '#f9ff3c' }}>1pm–5pm UTC</span><br />
                Highest liquidity · biggest moves
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 18px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 14 }}>My Notes</div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Trade ideas, setups, questions for Cue, things to review..."
              style={{
                flex: 1, minHeight: 200, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, padding: '12px 14px', color: '#fff', ...S,
                fontSize: 13, lineHeight: 1.65, resize: 'none', outline: 'none', transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(249,255,60,0.25)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
            <button
              onClick={saveNotes}
              style={{
                marginTop: 10, background: notesSaved ? 'rgba(34,197,94,0.1)' : 'rgba(249,255,60,0.07)',
                border: `1px solid ${notesSaved ? 'rgba(34,197,94,0.25)' : 'rgba(249,255,60,0.18)'}`,
                borderRadius: 7, padding: '9px 16px',
                ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: notesSaved ? '#22c55e' : '#f9ff3c', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {notesSaved ? '✓ Saved' : 'Save Notes'}
            </button>
          </div>

          {/* Quick Reference */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 18px' }}>
            <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 14 }}>Quick Reference</div>
            {[
              { label: 'Cue Lot Size',    value: '0.50 lot / $500 · 1.00 lot / $1,000' },
              { label: 'Risk / Trade',    value: '5–15% · based on confidence + confluence' },
              { label: 'Analysis TFs',   value: 'Daily · H4 · H1' },
              { label: 'Entry TFs',      value: 'M30 · M15 · M5 · M1' },
              { label: 'Fib Levels',     value: '38.2% · 50% · 61.8% · 78.6% · 88.6%' },
              { label: 'No Trade Rule',  value: '2 or more boxes checked = stay out' },
              { label: 'Best Window',    value: 'London / NY overlap · 1–5pm UTC' },
              { label: 'Structure',      value: 'HH + HL = bullish · LH + LL = bearish' },
              { label: 'MA Rule',        value: 'Above MAs = buy bias · Below = sell bias' },
              { label: 'Cue\'s Rule',   value: 'Structure first. Always.' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0, paddingTop: 1 }}>{item.label}</span>
                <span style={{ ...S, fontSize: 11, color: 'rgba(255,255,255,0.52)', textAlign: 'right', lineHeight: 1.45 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
