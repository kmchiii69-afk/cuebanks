'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Globe from '@/components/ui/globe';

type Plan = '5k' | '7.5k' | '15k';

interface Member {
  email: string;
  name: string;
  role: 'member' | 'admin';
  cohort: string;
  created_at: number;
  current_phase: number;
  plan: Plan;
  expires_at: string | null;
  goal: string;
  onboarded: boolean;
}

interface CalEvent {
  title: string;
  country: string;
  date: string;
  impact: string;
  forecast: string;
  previous: string;
  actual: string;
}

interface Webinar {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  join_link: string;
  recording_url: string;
  is_published: boolean;
}

const PHASES = [
  { num: 'PREP', title: 'Prepare', duration: 'Week 1'     },
  { num: 'SET',  title: 'Set',     duration: 'Week 2–3'   },
  { num: 'EXE',  title: 'Execute', duration: 'Week 4'     },
  { num: '01',   title: 'Phase 1', duration: 'Week 5'     },
  { num: '02',   title: 'Phase 2', duration: 'Week 6–7'   },
  { num: '03',   title: 'Phase 3', duration: 'Week 7–10'  },
  { num: '04',   title: 'Phase 4', duration: 'Week 11–14' },
  { num: '★',    title: 'Bonus',   duration: 'Week 14–21' },
];

const SESSIONS = [
  { name: 'London',   utcOpen: 8,  utcClose: 17, overnight: false, color: '#3b82f6', abbr: 'LON' },
  { name: 'New York', utcOpen: 13, utcClose: 22, overnight: false, color: '#2563eb', abbr: 'NY'  },
  { name: 'Tokyo',    utcOpen: 0,  utcClose: 9,  overnight: false, color: '#f97316', abbr: 'TKY' },
  { name: 'Sydney',   utcOpen: 22, utcClose: 7,  overnight: true,  color: '#22c55e', abbr: 'SYD' },
];

const CHECKLIST = [
  { id: 'topdown',   label: 'Top-down analysis',        sub: 'Daily → H4 → H1 all reviewed'             },
  { id: 'events',    label: 'Economic events reviewed',  sub: 'High-impact news noted for today'          },
  { id: 'levels',    label: 'S&R levels drawn',          sub: 'Support & resistance on all timeframes'    },
  { id: 'structure', label: 'Market structure ID\'d',    sub: 'HH+HL bullish · LH+LL bearish'            },
  { id: 'bias',      label: 'MA bias confirmed',         sub: 'Above MAs = buy · Below MAs = sell'       },
  { id: 'plan',      label: 'Session plan written',      sub: 'Know which pairs & setups to watch'       },
  { id: 'risk',      label: 'Lot size calculated',       sub: 'Risk % decided before touching the charts' },
  { id: 'notrade',   label: 'No-Trade rule acknowledged',sub: '2+ boxes = sit out. No exceptions.'       },
];

function isOpen(s: typeof SESSIONS[0], h: number, m: number) {
  const t = h + m / 60;
  return s.overnight ? t >= s.utcOpen || t < s.utcClose : t >= s.utcOpen && t < s.utcClose;
}

function todayKey() {
  return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
}

function fmtJoin(ts: number) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtEventTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function isPast(iso: string) {
  return new Date(iso) < new Date();
}

const M: React.CSSProperties = { fontFamily: "'Space Mono', monospace" };
const S: React.CSSProperties = { fontFamily: "'DM Sans', system-ui, sans-serif" };
const D: React.CSSProperties = { fontFamily: "'Sora', system-ui, sans-serif" };

const IMPACT_COLOR: Record<string, string> = { High: '#ef4444', Medium: '#f59e0b', Low: 'rgba(255,255,255,0.25)' };

export default function PortalPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [savingPhase, setSavingPhase] = useState(false);

  const [openSessions, setOpenSessions] = useState<boolean[]>([false, false, false, false]);
  const [nowUtc, setNowUtc] = useState('');
  const [utcH, setUtcH] = useState(0);
  const [utcM, setUtcM] = useState(0);

  // Position size calculator
  const [calcBalance, setCalcBalance] = useState('10000');
  const [calcRisk, setCalcRisk] = useState(1);
  const [calcSL, setCalcSL] = useState('');
  const [calcPair, setCalcPair] = useState('EUR/USD');

  const [calEvents, setCalEvents] = useState<CalEvent[]>([]);
  const [calLoading, setCalLoading] = useState(true);

  const [webinars, setWebinars] = useState<Webinar[]>([]);

  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  // Onboarding
  const [onboarding, setOnboarding] = useState(false);
  const [onboardStep, setOnboardStep] = useState<0 | 1 | 2 | 3 | 4>(0); // 0=video, 1=contract, 2=calendly, 3=goal, 4=tour
  const [goalText, setGoalText] = useState('');
  const [savingGoal, setSavingGoal] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const TOUR_STEPS = [
    { title: 'Your Roadmap', icon: '📍', desc: 'The full WSA curriculum is on the Roadmap page. Follow each phase in order. Click any phase to track your progress.' },
    { title: 'Ask Cue Anything', icon: '⚡', desc: 'Cue AI is your personal trading mentor. Ask about confluence, entries, risk, mindset — any time, day or night. Your full conversation history is saved.' },
    { title: 'Weekly Calls', icon: '📡', desc: 'Your live group calls with Cue show up in the portal automatically. Join links and recordings land here every week.' },
    { title: 'Pre-Session Checklist', icon: '✅', desc: 'Before you touch the charts, run through the checklist. It resets every midnight. Build the habit. The checklist is the discipline.' },
  ];

  // Auth
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) { router.replace('/login'); return null; } return r.json(); })
      .then(data => {
        if (!data) return;
        // Expiry check (non-admins only)
        if (data.role !== 'admin' && data.expires_at && new Date(data.expires_at) < new Date()) {
          router.replace('/login?expired=1');
          return;
        }
        setMember(data);
        const ck = localStorage.getItem(`wsa-ck-${data.email}-${todayKey()}`);
        setChecklist(ck ? JSON.parse(ck) : {});
        setNotes(localStorage.getItem(`wsa-notes-${data.email}`) || '');
        // Show onboarding if member hasn't set a goal yet
        if (!data.onboarded || !data.goal) setOnboarding(true);
        setLoading(false);
      })
      .catch(() => router.replace('/login'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Clock + sessions
  useEffect(() => {
    function tick() {
      const now = new Date();
      const h = now.getUTCHours(), m = now.getUTCMinutes();
      setOpenSessions(SESSIONS.map(s => isOpen(s, h, m)));
      setNowUtc(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} UTC`);
      setUtcH(h); setUtcM(m);
    }
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  // Webinars
  useEffect(() => {
    fetch('/api/webinars')
      .then(r => r.json())
      .then(data => setWebinars(Array.isArray(data) ? data : []))
      .catch(() => setWebinars([]));
  }, []);

  // Economic calendar
  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then((data: unknown) => {
        const events = Array.isArray((data as { events?: unknown }).events) ? (data as { events: CalEvent[] }).events : [];
        const today = events.filter(e => isToday(e.date));
        today.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setCalEvents(today);
      })
      .catch(() => setCalEvents([]))
      .finally(() => setCalLoading(false));
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

  function toggleCheck(id: string) {
    if (!member) return;
    const next = { ...checklist, [id]: !checklist[id] };
    setChecklist(next);
    localStorage.setItem(`wsa-ck-${member.email}-${todayKey()}`, JSON.stringify(next));
  }

  function saveNotes() {
    if (!member) return;
    localStorage.setItem(`wsa-notes-${member.email}`, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  async function submitGoal() {
    if (!goalText.trim()) return;
    setSavingGoal(true);
    await fetch('/api/portal/goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal: goalText.trim() }),
    });
    setMember(m => m ? { ...m, goal: goalText.trim(), onboarded: true } : m);
    setSavingGoal(false);
    setOnboardStep(4);
  }

  function finishOnboarding() {
    setOnboarding(false);
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...M, fontSize: 11, color: 'rgba(37,99,235,0.4)', letterSpacing: '0.2em' }}>LOADING</div>
    </div>
  );

  const phase = member?.current_phase ?? 0;
  const isAdmin = member?.role === 'admin';
  const liveCount = openSessions.filter(Boolean).length;
  const overlap = openSessions[0] && openSessions[1]; // London + NY
  const checkDone = CHECKLIST.filter(c => checklist[c.id]).length;
  const highToday = calEvents.filter(e => e.impact === 'High').length;

  const nowTs = new Date();
  const upcomingCalls = webinars
    .filter(w => new Date(w.scheduled_at) > nowTs)
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  const pastRecordings = webinars
    .filter(w => new Date(w.scheduled_at) <= nowTs && w.recording_url)
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    .slice(0, 8);
  const nextCall = upcomingCalls[0] ?? null;

  function fmtCallDate(iso: string) {
    const d = new Date(iso);
    const diffDays = Math.floor((d.getTime() - nowTs.getTime()) / 86400000);
    const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (diffDays === 0) return `Today · ${timeStr}`;
    if (diffDays === 1) return `Tomorrow · ${timeStr}`;
    return `${dateStr} · ${timeStr} · in ${diffDays}d`;
  }

  function fmtRecDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // ── Trading tools ──────────────────────────────────────────────────────────
  const PIP_VALUES: Record<string, number> = {
    'EUR/USD': 10, 'GBP/USD': 10, 'AUD/USD': 10, 'NZD/USD': 10,
    'USD/JPY': 6.7, 'USD/CAD': 7.4, 'USD/CHF': 11.1,
    'EUR/JPY': 6.7, 'GBP/JPY': 6.7, 'AUD/JPY': 6.7,
    'EUR/GBP': 12.6, 'EUR/CAD': 7.4, 'GBP/CAD': 7.4,
  };
  const CALC_PAIRS = Object.keys(PIP_VALUES);
  const dollarRisk = (parseFloat(calcBalance) || 0) * (calcRisk / 100);
  const pipVal = PIP_VALUES[calcPair] ?? 10;
  const slPips = parseFloat(calcSL) || 0;
  const lotSize = slPips > 0 ? dollarRisk / (slPips * pipVal) : 0;

  // Upcoming session events for countdown
  function getCountdownEvents() {
    const nowMin = utcH * 60 + utcM;
    type Evt = { label: string; minsUntil: number; color: string; isOverlap?: boolean };
    const evts: Evt[] = [];
    for (const s of SESSIONS) {
      const openMin = s.utcOpen * 60;
      const closeMin = s.utcClose * 60;
      const open = isOpen(s, utcH, utcM);
      if (!open) {
        let d = openMin - nowMin; if (d <= 0) d += 1440;
        evts.push({ label: `${s.name} opens`, minsUntil: d, color: s.color });
      } else {
        let d = closeMin - nowMin; if (d <= 0) d += 1440;
        evts.push({ label: `${s.name} closes`, minsUntil: d, color: s.color });
      }
    }
    // NY/LON overlap 13:00–17:00 UTC
    const ovStart = 13 * 60, ovEnd = 17 * 60;
    const inOv = nowMin >= ovStart && nowMin < ovEnd;
    if (inOv) {
      let d = ovEnd - nowMin; if (d <= 0) d += 1440;
      evts.push({ label: 'NY/LON overlap ends', minsUntil: d, color: '#2563eb', isOverlap: true });
    } else {
      let d = ovStart - nowMin; if (d <= 0) d += 1440;
      evts.push({ label: 'NY/LON overlap starts', minsUntil: d, color: '#2563eb', isOverlap: true });
    }
    return evts.sort((a, b) => a.minsUntil - b.minsUntil).slice(0, 5);
  }
  function fmtMins(mins: number) {
    const h = Math.floor(mins / 60), m = mins % 60;
    return h > 0 ? `${h}h ${String(m).padStart(2,'0')}m` : `${m}m`;
  }
  const countdownEvts = getCountdownEvents();

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative' }}>
      {/* Space atmosphere */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 100% 70% at 65% 28%, rgba(6,10,20,1) 0%, rgba(0,0,0,1) 65%)' }} />
      {/* Globe */}
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.32, transform: 'translate3d(78vw, 30vh, 0) translate3d(-50%, -50%, 0) scale3d(2.8, 2.8, 1)' }}>
        <Globe size={250} />
      </div>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: 62,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wsa/home/1.png" alt="WSA" style={{ height: 40, width: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }} />
          <div>
            <div style={{ ...M, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1 }}>Wall Street Academy</div>
            <div style={{ ...M, fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 3 }}>Member Portal</div>
          </div>
          {isAdmin && (
            <a href="/admin" style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2563eb', textDecoration: 'none', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 4, padding: '4px 10px', marginLeft: 6 }}>Admin</a>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* Live sessions bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {SESSIONS.map((s, i) => (
              <div key={s.abbr} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: openSessions[i] ? s.color : '#333', flexShrink: 0, boxShadow: openSessions[i] ? `0 0 6px ${s.color}80` : 'none', transition: 'all 0.3s' }} />
                <span style={{ ...M, fontSize: 7.5, color: openSessions[i] ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)', letterSpacing: '0.08em' }}>{s.abbr}</span>
              </div>
            ))}
          </div>
          {nowUtc && <span style={{ ...M, fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>{nowUtc}</span>}
          {member?.name && <span style={{ ...S, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{member.name.split(' ')[0]}</span>}
          <button onClick={logout} disabled={loggingOut} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, padding: '6px 14px', ...M, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
          >{loggingOut ? '...' : 'Sign out'}</button>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1120, margin: '0 auto', padding: '36px 24px 80px' }}>

        {/* ── GOAL BANNER ───────────────────────────────────── */}
        {member?.goal && (
          <div style={{ marginBottom: 14, background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(37,99,235,0.5)', flexShrink: 0 }}>MY GOAL</span>
            <span style={{ ...S, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, flex: 1 }}>{member.goal}</span>
            <span style={{ ...M, fontSize: 8, color: 'rgba(255,255,255,0.18)', flexShrink: 0, letterSpacing: '0.1em' }}>4 months</span>
          </div>
        )}

        {/* ── ROW 1: Welcome + Sessions ─────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 14, marginBottom: 14 }}>

          {/* Welcome */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '26px 26px 22px' }}>
            <p style={{ ...M, fontSize: 9, letterSpacing: '0.22em', color: 'rgba(37,99,235,0.45)', textTransform: 'uppercase', margin: '0 0 8px' }}>
              {member?.cohort ? `Cohort ${member.cohort}` : 'WSA Member'} · Joined {fmtJoin(member?.created_at ?? 0)}
            </p>
            <h1 style={{ ...D, fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 18px' }}>
              {member?.name ? `Welcome back, ${member.name.split(' ')[0]}.` : 'Welcome back.'}
            </h1>

            {/* Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ ...M, fontSize: 8, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>Curriculum Progress</span>
              <span style={{ ...M, fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
                {phase === 0 ? 'Not started' : phase >= 8 ? 'Complete ✓' : `Phase ${phase} of 8`}
              </span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, marginBottom: 18, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(phase / 8) * 100}%`, background: 'linear-gradient(90deg, #2563eb, #d4f700)', borderRadius: 2, transition: 'width 0.5s ease' }} />
            </div>

            {/* Today at a glance */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[
                { label: 'High-impact events', value: calLoading ? '—' : highToday === 0 ? 'None' : String(highToday), color: highToday > 0 ? '#ef4444' : '#22c55e' },
                { label: 'Sessions live', value: `${liveCount} / 4`, color: liveCount > 0 ? '#22c55e' : 'rgba(255,255,255,0.3)' },
                { label: 'Pre-session done', value: `${checkDone} / ${CHECKLIST.length}`, color: checkDone === CHECKLIST.length ? '#22c55e' : 'rgba(255,255,255,0.3)' },
              ].map(stat => (
                <div key={stat.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ ...D, fontSize: 20, fontWeight: 700, color: stat.color, marginBottom: 3 }}>{stat.value}</div>
                  <div style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Sessions */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 18px' }}>
            <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 12 }}>Market Sessions · UTC</div>

            {overlap && (
              <div style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.22)', borderRadius: 7, padding: '7px 11px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb', boxShadow: '0 0 8px #2563eb', flexShrink: 0 }} />
                <span style={{ ...M, fontSize: 8, color: '#2563eb', letterSpacing: '0.12em', textTransform: 'uppercase' }}>London / NY Overlap</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SESSIONS.map((s, i) => {
                const open = openSessions[i];
                return (
                  <div key={s.name} style={{ background: open ? `${s.color}0e` : 'rgba(255,255,255,0.02)', border: `1px solid ${open ? s.color + '30' : 'rgba(255,255,255,0.05)'}`, borderRadius: 8, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 11, transition: 'all 0.3s' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: open ? s.color : '#333', flexShrink: 0, boxShadow: open ? `0 0 8px ${s.color}70` : 'none', transition: 'all 0.3s' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ ...M, fontSize: 10, fontWeight: 700, color: open ? '#fff' : 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>{s.name}</span>
                        <span style={{ ...M, fontSize: 8, color: open ? s.color : 'rgba(255,255,255,0.15)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{open ? 'OPEN' : 'CLOSED'}</span>
                      </div>
                      <div style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>
                        {String(s.utcOpen).padStart(2,'0')}:00 – {String(s.utcClose).padStart(2,'0')}:00 UTC
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ ...S, fontSize: 11.5, color: 'rgba(255,255,255,0.35)', lineHeight: 1.55 }}>
                Best window: <span style={{ color: '#2563eb' }}>1pm – 5pm UTC</span><br />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>London / NY overlap · peak liquidity</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Action Cards ──────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? 'repeat(3,1fr)' : 'repeat(2,1fr)', gap: 12, marginBottom: 14 }}>
          <a href="/roadmap" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: 12, textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.09)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,99,235,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,99,235,0.18)'; }}>
            <div style={{ width: 42, height: 42, borderRadius: 9, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 3h14M2 7h10M2 11h12M2 15h7" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...D, fontSize: 15, fontWeight: 700, color: '#2563eb', marginBottom: 2 }}>Course Roadmap</div>
              <div style={{ ...S, fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>{phase === 0 ? 'Start here — Week 0, Prepare' : phase >= 8 ? 'All phases complete' : `Phase ${phase} of 8 active`}</div>
            </div>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8M8 3.5l3 3-3 3" stroke="rgba(37,99,235,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>

          <a href="/cue" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}>
            <div style={{ width: 42, height: 42, borderRadius: 9, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ ...M, fontWeight: 800, fontSize: 18, color: '#2563eb', lineHeight: 1 }}>C</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...D, fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Cue AI</div>
              <div style={{ ...S, fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>Ask anything — strategy, setups, mindset</div>
            </div>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8M8 3.5l3 3-3 3" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>

          {isAdmin && (
            <a href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}>
              <div style={{ width: 42, height: 42, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6.5" r="3" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/><path d="M2.5 15c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...D, fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Admin Panel</div>
                <div style={{ ...S, fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>Members · progress · access</div>
              </div>
            </a>
          )}
        </div>

        {/* ── ROW 3: Phase Tracker ──────────────────────────── */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 20px', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>Phase Tracker · Click to Mark</span>
            <a href="/roadmap" style={{ ...M, fontSize: 8, letterSpacing: '0.14em', color: 'rgba(37,99,235,0.45)', textDecoration: 'none', textTransform: 'uppercase' }}>Open Roadmap →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 5 }}>
            {PHASES.map((ph, i) => {
              const pn = i + 1;
              const active = phase === pn;
              const done = phase > pn;
              return (
                <div key={ph.num} onClick={() => setPhase(active ? 0 : pn)} style={{ background: active ? 'rgba(37,99,235,0.09)' : done ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${active ? 'rgba(37,99,235,0.35)' : done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 8, padding: '9px 7px', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.16)'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'; }}>
                  <div style={{ ...M, fontSize: 10, fontWeight: 700, color: active ? '#2563eb' : done ? '#22c55e' : 'rgba(255,255,255,0.22)', marginBottom: 4 }}>{done ? '✓' : ph.num}</div>
                  <div style={{ ...S, fontSize: 10, color: active ? 'rgba(255,255,255,0.85)' : done ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.28)', lineHeight: 1.3 }}>{ph.title}</div>
                  <div style={{ ...M, fontSize: 7, color: 'rgba(255,255,255,0.13)', marginTop: 3 }}>{ph.duration}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── TRADING TOOLS ────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

          {/* Session Countdown */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 20px' }}>
            <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 14 }}>Session Countdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {countdownEvts.map((evt, i) => (
                <div key={evt.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 8, background: i === 0 ? `${evt.color}12` : 'rgba(255,255,255,0.02)', border: `1px solid ${i === 0 ? `${evt.color}30` : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.2s' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: i === 0 ? evt.color : 'rgba(255,255,255,0.15)', flexShrink: 0, boxShadow: i === 0 ? `0 0 8px ${evt.color}70` : 'none' }} />
                  <span style={{ ...S, fontSize: 12, color: i === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)', flex: 1 }}>{evt.label}</span>
                  <span style={{ ...M, fontSize: i === 0 ? 14 : 11, fontWeight: 700, color: i === 0 ? evt.color : 'rgba(255,255,255,0.25)', letterSpacing: '0.02em', flexShrink: 0 }}>{fmtMins(evt.minsUntil)}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)', ...S, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
              All times UTC · Updates every 30 seconds
            </div>
          </div>

          {/* Position Size Calculator */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 20px' }}>
            <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 14 }}>Position Size Calculator</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* Balance + Pair row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Account Balance ($)</div>
                  <input
                    type="number" value={calcBalance} onChange={e => setCalcBalance(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '8px 11px', color: '#fff', ...M, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  />
                </div>
                <div>
                  <div style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Pair</div>
                  <select value={calcPair} onChange={e => setCalcPair(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '8px 11px', color: '#fff', ...M, fontSize: 12, outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                    {CALC_PAIRS.map(p => <option key={p} value={p} style={{ background: '#111' }}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Risk % */}
              <div>
                <div style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Risk %</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[0.5, 1, 2, 3].map(r => (
                    <button key={r} onClick={() => setCalcRisk(r)}
                      style={{ flex: 1, padding: '7px 0', borderRadius: 6, border: `1px solid ${calcRisk === r ? 'rgba(37,99,235,0.5)' : 'rgba(255,255,255,0.08)'}`, background: calcRisk === r ? 'rgba(37,99,235,0.12)' : 'rgba(255,255,255,0.03)', color: calcRisk === r ? '#2563eb' : 'rgba(255,255,255,0.4)', ...M, fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {r}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Stop Loss */}
              <div>
                <div style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Stop Loss (pips)</div>
                <input
                  type="number" value={calcSL} onChange={e => setCalcSL(e.target.value)} placeholder="e.g. 20"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '8px 11px', color: '#fff', ...M, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>

              {/* Output */}
              <div style={{ marginTop: 2, padding: '14px 16px', borderRadius: 9, background: lotSize > 0 ? 'rgba(37,99,235,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${lotSize > 0 ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.2s' }}>
                {lotSize > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {[
                      { label: 'Lot Size', value: lotSize.toFixed(2), sub: 'standard' },
                      { label: 'Mini Lots', value: (lotSize * 10).toFixed(1), sub: '× 0.1' },
                      { label: 'Dollar Risk', value: `$${dollarRisk.toFixed(0)}`, sub: `${calcRisk}% of bal.` },
                    ].map(item => (
                      <div key={item.label} style={{ textAlign: 'center' }}>
                        <div style={{ ...D, fontSize: 18, fontWeight: 700, color: '#2563eb', lineHeight: 1.1 }}>{item.value}</div>
                        <div style={{ ...M, fontSize: 7, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{item.label}</div>
                        <div style={{ ...M, fontSize: 7, color: 'rgba(255,255,255,0.18)', marginTop: 1 }}>{item.sub}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', ...S, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Enter balance, risk %, and stop loss to calculate</div>
                )}
              </div>
              <div style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em', lineHeight: 1.6 }}>Pip values approx. for USD accounts · Standard lot = 100,000 units</div>
            </div>
          </div>
        </div>

        {/* ── ROW 4: Weekly Calls — 7.5k and 15k only ─────── */}
        {member?.plan !== '5k' && (nextCall || pastRecordings.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: nextCall ? '1fr 1fr' : '1fr', gap: 14, marginBottom: 14 }}>

            {/* Next Upcoming Call */}
            {nextCall && (
              <div style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 12, padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(37,99,235,0.55)', textTransform: 'uppercase' }}>Next Live Call</div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e80' }} />
                    <span style={{ ...M, fontSize: 8, color: '#22c55e', letterSpacing: '0.1em' }}>UPCOMING</span>
                  </span>
                </div>
                <div style={{ ...D, fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{nextCall.title}</div>
                {nextCall.description && <div style={{ ...S, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 10, lineHeight: 1.5 }}>{nextCall.description}</div>}
                <div style={{ ...M, fontSize: 10, color: 'rgba(37,99,235,0.7)', marginBottom: 14, letterSpacing: '0.04em' }}>{fmtCallDate(nextCall.scheduled_at)}</div>
                {nextCall.join_link ? (
                  <a href={nextCall.join_link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563eb', borderRadius: 7, padding: '9px 18px', ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', transition: 'opacity 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#000" strokeWidth="1.3"/><path d="M4.5 4.5l3 1.5-3 1.5V4.5z" fill="#000"/></svg>
                    Join Call
                  </a>
                ) : (
                  <div style={{ ...M, fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em' }}>Join link coming soon</div>
                )}
              </div>
            )}

            {/* Recordings */}
            {pastRecordings.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 20px' }}>
                <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 14 }}>Call Recordings</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {pastRecordings.map((w, i) => (
                    <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < pastRecordings.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <span style={{ ...M, fontSize: 9, color: 'rgba(255,255,255,0.25)', flexShrink: 0, letterSpacing: '0.04em', minWidth: 70 }}>{fmtRecDate(w.scheduled_at)}</span>
                      <span style={{ ...S, fontSize: 12, color: 'rgba(255,255,255,0.65)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.title}</span>
                      <a href={w.recording_url} target="_blank" rel="noopener noreferrer" style={{ ...M, fontSize: 8, color: 'rgba(37,99,235,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', flexShrink: 0, transition: 'color 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2563eb'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(37,99,235,0.6)'; }}>
                        Watch →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ROW 5: Economic Calendar + Checklist + Notes ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: member?.plan === '5k' ? '380px' : '1fr 380px', gap: 14 }}>

          {/* Economic Calendar — 7.5k and 15k only */}
          {member?.plan !== '5k' && <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 4 }}>Economic Calendar</div>
                <div style={{ ...S, fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>Today · High & Medium impact events</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[{ label: 'HIGH', color: '#ef4444' }, { label: 'MED', color: '#f59e0b' }].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                      <span style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {calLoading ? (
              <div style={{ padding: '24px 0', textAlign: 'center' }}>
                <span style={{ ...M, fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>LOADING EVENTS...</span>
              </div>
            ) : calEvents.length === 0 ? (
              <div style={{ padding: '24px 16px', background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ ...D, fontSize: 15, fontWeight: 700, color: '#22c55e', marginBottom: 6 }}>Clean calendar today</div>
                <div style={{ ...S, fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.55 }}>No high or medium impact events scheduled.<br />Good day to execute your plan.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* Header row */}
                <div style={{ display: 'grid', gridTemplateColumns: '72px 52px 44px 1fr 80px 80px 80px', gap: 8, padding: '0 10px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 2 }}>
                  {['Time', 'Impact', 'Cur.', 'Event', 'Forecast', 'Previous', 'Actual'].map(h => (
                    <span key={h} style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</span>
                  ))}
                </div>
                {calEvents.map((ev, i) => {
                  const past = isPast(ev.date);
                  const hi = ev.impact === 'High';
                  const ic = IMPACT_COLOR[ev.impact] ?? 'rgba(255,255,255,0.2)';
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '72px 52px 44px 1fr 80px 80px 80px', gap: 8, padding: '9px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: hi && !past ? 'rgba(239,68,68,0.04)' : 'transparent', opacity: past ? 0.45 : 1, alignItems: 'center' }}>
                      <span style={{ ...M, fontSize: 11, fontWeight: 700, color: past ? 'rgba(255,255,255,0.3)' : '#fff', letterSpacing: '0.02em' }}>{fmtEventTime(ev.date)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: ic, flexShrink: 0, boxShadow: hi && !past ? `0 0 6px ${ic}80` : 'none' }} />
                        <span style={{ ...M, fontSize: 7.5, color: ic, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{ev.impact === 'High' ? 'HIGH' : 'MED'}</span>
                      </div>
                      <span style={{ ...M, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>{ev.country}</span>
                      <span style={{ ...S, fontSize: 12, color: past ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</span>
                      <span style={{ ...M, fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{ev.forecast || '—'}</span>
                      <span style={{ ...M, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{ev.previous || '—'}</span>
                      <span style={{ ...M, fontSize: 10, fontWeight: 700, color: ev.actual ? '#2563eb' : 'rgba(255,255,255,0.18)' }}>{ev.actual || '—'}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {!calLoading && (
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ ...S, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Times shown in your local timezone · Updates every 30 min</span>
                <a href="https://www.forexfactory.com/calendar" target="_blank" rel="noopener noreferrer" style={{ ...M, fontSize: 8, color: 'rgba(37,99,235,0.4)', textDecoration: 'none', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Full Calendar →</a>
              </div>
            )}
          </div>}

          {/* Right column: Checklist + Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Pre-Session Checklist */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 4 }}>Pre-Session Checklist</div>
                  <div style={{ ...S, fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>Resets midnight · daily habits</div>
                </div>
                <div style={{ ...M, fontSize: 9, color: checkDone === CHECKLIST.length ? '#22c55e' : 'rgba(255,255,255,0.25)', fontWeight: 700 }}>
                  {checkDone}/{CHECKLIST.length}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(checkDone / CHECKLIST.length) * 100}%`, background: checkDone === CHECKLIST.length ? '#22c55e' : 'rgba(37,99,235,0.6)', borderRadius: 2, transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {CHECKLIST.map(item => {
                  const checked = !!checklist[item.id];
                  return (
                    <div key={item.id} onClick={() => toggleCheck(item.id)} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 10px', borderRadius: 7, background: checked ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${checked ? 'rgba(34,197,94,0.18)' : 'rgba(255,255,255,0.05)'}`, cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { if (!checked) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                      onMouseLeave={e => { if (!checked) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; }}>
                      <div style={{ width: 15, height: 15, borderRadius: 4, border: `1.5px solid ${checked ? '#22c55e' : 'rgba(255,255,255,0.2)'}`, background: checked ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s' }}>
                        {checked && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div>
                        <div style={{ ...S, fontSize: 12, fontWeight: checked ? 400 : 500, color: checked ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.75)', textDecoration: checked ? 'line-through' : 'none', lineHeight: 1.3, marginBottom: 1 }}>{item.label}</div>
                        <div style={{ ...M, fontSize: 7.5, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em', lineHeight: 1.4 }}>{item.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {checkDone === CHECKLIST.length && (
                <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 7, textAlign: 'center' }}>
                  <span style={{ ...D, fontSize: 13, fontWeight: 700, color: '#22c55e' }}>Ready to trade. Execute the plan.</span>
                </div>
              )}
            </div>

            {/* Notes */}
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 18px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 12 }}>My Notes</div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Trade ideas, setups, observations, questions for Cue..." style={{ flex: 1, minHeight: 120, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '11px 13px', color: '#fff', ...S, fontSize: 13, lineHeight: 1.6, resize: 'none', outline: 'none', transition: 'border-color 0.15s' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.25)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }} />
              <button onClick={saveNotes} style={{ marginTop: 8, background: notesSaved ? 'rgba(34,197,94,0.09)' : 'rgba(37,99,235,0.06)', border: `1px solid ${notesSaved ? 'rgba(34,197,94,0.25)' : 'rgba(37,99,235,0.18)'}`, borderRadius: 6, padding: '8px', ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: notesSaved ? '#22c55e' : '#2563eb', cursor: 'pointer', transition: 'all 0.2s' }}>
                {notesSaved ? '✓ Saved' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Contact Support — 5k only ─────────────────────── */}
        {member?.plan === '5k' && (
          <div style={{ marginTop: 14, background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ ...M, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(37,99,235,0.7)', textTransform: 'uppercase', marginBottom: 4 }}>Support</div>
              <div style={{ ...S, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>For any queries, reach out to your account manager.</div>
              <div style={{ ...S, fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Response within 24 hours during business days.</div>
            </div>
            <a
              href="mailto:alex@wsacademyfx.com"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.35)', borderRadius: 8, padding: '10px 18px', ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(37,99,235,1)', textDecoration: 'none', flexShrink: 0, transition: 'background 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.22)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,99,235,0.6)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,99,235,0.35)'; }}
            >
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <rect x="0.5" y="0.5" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1"/>
                <path d="M0.5 2L5.5 5L10.5 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              Contact Us
            </a>
          </div>
        )}

      </main>

      {/* ── ONBOARDING OVERLAY ──────────────────────────────── */}
      {onboarding && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>

          {/* Step 0: Welcome Video */}
          {onboardStep === 0 && (
            <div style={{ width: '100%', maxWidth: 860, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', color: 'rgba(37,99,235,0.5)', textTransform: 'uppercase', marginBottom: 10 }}>Wall Street Academy · Welcome</div>
                <h2 style={{ ...D, fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: 0 }}>A message from Cue.</h2>
              </div>
              <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#000', aspectRatio: '16/9', position: 'relative' }}>
                <iframe
                  src="https://player.vimeo.com/video/1205968513?title=0&byline=0&portrait=0&badge=0&autopause=0"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setOnboardStep(1)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 22px', ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}>Skip video</button>
                <button onClick={() => setOnboardStep(1)} style={{ background: '#2563eb', border: 'none', borderRadius: 8, padding: '10px 28px', ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', cursor: 'pointer' }}>{"I'm Ready →"}</button>
              </div>
            </div>
          )}

          {/* Step 1: Contract Signing */}
          {onboardStep === 1 && (
            <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', color: 'rgba(37,99,235,0.5)', textTransform: 'uppercase', marginBottom: 10 }}>Step 1 of 4 · Sign Your Contract</div>
                <h2 style={{ ...D, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 8px' }}>Before your call — sign your contract.</h2>
                <p style={{ ...S, fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.65 }}>
                  This is required before your onboarding call. Please complete it now so your call can go straight into strategy.
                </p>
              </div>
              {/* Warning banner */}
              <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                <div style={{ ...S, fontSize: 13, color: 'rgba(37,99,235,0.85)', lineHeight: 1.6 }}>
                  <strong>Important:</strong> You must sign this contract before your onboarding call. Your call cannot proceed without it.
                </div>
              </div>
              {/* Contract embed */}
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                <iframe
                  src={member?.plan === '15k'
                    ? 'https://sendlink.co/documents/doc-form/6a498aed193ad951c24c1beb?locale=en-US'
                    : 'https://sendlink.co/documents/doc-form/6a49857e1d7de5fba1a059a5?locale=en-US'}
                  style={{ width: '100%', height: 520, border: 'none', display: 'block' }}
                  title="Program contract"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8 }}>
                <a
                  href={member?.plan === '15k'
                    ? 'https://sendlink.co/documents/doc-form/6a498aed193ad951c24c1beb?locale=en-US'
                    : 'https://sendlink.co/documents/doc-form/6a49857e1d7de5fba1a059a5?locale=en-US'}
                  target="_blank" rel="noopener noreferrer"
                  style={{ ...M, fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}
                >
                  Open in new tab ↗
                </a>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setOnboardStep(0)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 18px', ...M, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>← Back</button>
                <button onClick={() => setOnboardStep(2)} style={{ flex: 1, background: '#2563eb', border: 'none', borderRadius: 8, padding: '12px', ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', cursor: 'pointer' }}>{"I've Signed My Contract →"}</button>
              </div>
            </div>
          )}

          {/* Step 2: Onboarding Call Booking */}
          {onboardStep === 2 && (
            <div style={{ width: '100%', maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Header */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', color: 'rgba(37,99,235,0.5)', textTransform: 'uppercase', marginBottom: 12 }}>Step 2 of 4 · Book Your Onboarding Call</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }}>
                  <div>
                    <h2 style={{ ...D, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 10px' }}>Your first call with the team.</h2>
                    <p style={{ ...S, fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 14px', lineHeight: 1.65 }}>
                      Before you begin the roadmap, we want to make sure you are fully set up for success. Book a 1-on-1 onboarding call with our Client Success Manager — someone who has been training directly under Cue for years and knows this system inside and out.
                    </p>
                    <p style={{ ...S, fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 16px', lineHeight: 1.65 }}>
                      On this call, they will walk you through the full roadmap, show you how your Discord server is organized, explain exactly how the mentorship works, and make sure you know what to expect from day one.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        'Full walkthrough of your roadmap',
                        'How your Discord & 1-on-1 channel work',
                        'Mentorship structure & weekly calls',
                        'What to focus on in your first week',
                      ].map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ color: '#2563eb', fontSize: 12, marginTop: 1, flexShrink: 0 }}>▸</span>
                          <span style={{ ...S, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Calendly embed */}
                  <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#fff', minHeight: 580 }}>
                    <iframe
                      src="https://calendly.com/alex-wsacademyfx?background_color=ffffff&text_color=111111&primary_color=000000"
                      style={{ width: '100%', height: 580, border: 'none', display: 'block' }}
                      title="Book your onboarding call"
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <button onClick={() => setOnboardStep(1)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 18px', ...M, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>← Back</button>
                <button onClick={() => setOnboardStep(3)} style={{ flex: 1, background: '#2563eb', border: 'none', borderRadius: 8, padding: '12px', ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', cursor: 'pointer' }}>{"I've Booked My Call →"}</button>
              </div>
            </div>
          )}

          {/* Step 3: Goal Form */}
          {onboardStep === 3 && (
            <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Thank you card */}
              <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>✅</span>
                <div>
                  <div style={{ ...D, fontSize: 14, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>Thank you — welcome to the program.</div>
                  <div style={{ ...S, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>We are genuinely excited to have you here. Your onboarding call is confirmed. Go text in your 1-on-1 channel in Discord — everything is ready and waiting for you.</div>
                </div>
              </div>
              <div>
                <div style={{ ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', color: 'rgba(37,99,235,0.5)', textTransform: 'uppercase', marginBottom: 10 }}>Step 3 of 4 · Set Your Goal</div>
                <h2 style={{ ...D, fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 8px' }}>What do you want to achieve in 4 months?</h2>
                <p style={{ ...S, fontSize: 14, color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.55 }}>Be specific. This goal lives on your portal so you see it every time you log in. It&apos;s your why.</p>
              </div>
              <textarea
                value={goalText}
                onChange={e => setGoalText(e.target.value)}
                placeholder="e.g. Pass a $100K prop challenge by trading only A+ setups with 2% risk per trade..."
                rows={4}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '16px', color: '#fff', ...S, fontSize: 14, lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', system-ui, sans-serif" }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.35)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setOnboardStep(2)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 18px', ...M, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>← Back</button>
                <button
                  onClick={submitGoal}
                  disabled={savingGoal || !goalText.trim()}
                  style={{ flex: 1, background: savingGoal || !goalText.trim() ? 'rgba(37,99,235,0.15)' : '#2563eb', border: 'none', borderRadius: 8, padding: '12px', ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: savingGoal || !goalText.trim() ? 'rgba(37,99,235,0.4)' : '#fff', cursor: savingGoal || !goalText.trim() ? 'not-allowed' : 'pointer' }}
                >
                  {savingGoal ? 'Saving...' : 'Lock In My Goal →'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: App Tour */}
          {onboardStep === 4 && (
            <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <div style={{ ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', color: 'rgba(37,99,235,0.5)', textTransform: 'uppercase', marginBottom: 10 }}>Step 4 of 4 · Quick Tour</div>
                <h2 style={{ ...D, fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 4px' }}>{TOUR_STEPS[tourStep].icon} {TOUR_STEPS[tourStep].title}</h2>
              </div>

              {/* Tour dots */}
              <div style={{ display: 'flex', gap: 6 }}>
                {TOUR_STEPS.map((_, i) => (
                  <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= tourStep ? '#2563eb' : 'rgba(255,255,255,0.1)', transition: 'background 0.2s' }} />
                ))}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '22px 22px' }}>
                <p style={{ ...S, fontSize: 15, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.65 }}>{TOUR_STEPS[tourStep].desc}</p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={finishOnboarding} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 18px', ...M, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>Skip tour</button>
                {tourStep < TOUR_STEPS.length - 1 ? (
                  <button onClick={() => setTourStep(t => t + 1)} style={{ flex: 1, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: 8, padding: '10px', ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2563eb', cursor: 'pointer' }}>Next →</button>
                ) : (
                  <button onClick={finishOnboarding} style={{ flex: 1, background: '#2563eb', border: 'none', borderRadius: 8, padding: '10px', ...M, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', cursor: 'pointer' }}>{"Let's Trade →"}</button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
