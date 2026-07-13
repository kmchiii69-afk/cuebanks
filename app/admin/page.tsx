'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PHASE_LABELS = ['—', 'Set', 'Execute', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Bonus', 'Complete ✓'];

type Plan = '5k' | '7.5k' | '15k' | 'low_ticket';

interface Member {
  id: string;
  email: string;
  name: string;
  role: 'member' | 'admin';
  active: boolean;
  cohort: string;
  discord_id: string;
  notes: string;
  created_at: number;
  last_login: number;
  current_phase: number;
  plan: Plan;
  expires_at: string | null;
  goal: string;
  onboarded: boolean;
  portal_unlocked: boolean;
  skip_contract: boolean;
}

interface CueInstruction {
  id: string;
  type: 'do' | 'dont';
  instruction: string;
  active: boolean;
  created_at: string;
}

interface Webinar {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  join_link: string;
  recording_url: string;
  is_published: boolean;
  created_at: string;
  created_by: string;
}

function fmt(ts: number) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtIso(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function toLocalInput(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function timeAgo(ts: number) {
  if (!ts) return 'Never';
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const F: React.CSSProperties = {
  width: '100%', height: 40,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 7, padding: '0 12px',
  fontSize: 13, color: '#fff',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};
const FO = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.35)'; };
const FB = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; };
const M = "'Space Mono', monospace";
const S = "'DM Sans', system-ui, sans-serif";
const D = "'Sora', system-ui, sans-serif";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'members' | 'webinars' | 'analytics' | 'cue-ai'>('members');

  // ── Members ──
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const [addEmail, setAddEmail] = useState('');
  const [addName, setAddName] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addCohort, setAddCohort] = useState('');
  const [addRole, setAddRole] = useState<'member' | 'admin'>('member');
  const [addPlan, setAddPlan] = useState<Plan>('5k');
  const [addSkipContract, setAddSkipContract] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const [editName, setEditName] = useState('');
  const [editCohort, setEditCohort] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [editPlan, setEditPlan] = useState<Plan>('5k');
  const [editSkipContract, setEditSkipContract] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Analytics
  interface AnalyticRow { id: string; member_email: string; plan: string; question: string; answer: string; created_at: string; }
  const [analytics, setAnalytics] = useState<AnalyticRow[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsPlan, setAnalyticsPlan] = useState('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Cue AI Instructions
  const [cueInstructions, setCueInstructions] = useState<CueInstruction[]>([]);
  const [cueLoading, setCueLoading] = useState(false);
  const [newDoText, setNewDoText] = useState('');
  const [newDontText, setNewDontText] = useState('');
  const [addingDo, setAddingDo] = useState(false);
  const [addingDont, setAddingDont] = useState(false);

  // ── Webinars ──
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [webinarsLoading, setWebinarsLoading] = useState(false);
  const [showWebinarModal, setShowWebinarModal] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState<Webinar | null>(null);
  const [wSaving, setWSaving] = useState(false);
  const [wError, setWError] = useState('');

  const [wTitle, setWTitle] = useState('');
  const [wDescription, setWDescription] = useState('');
  const [wScheduledAt, setWScheduledAt] = useState('');
  const [wJoinLink, setWJoinLink] = useState('');
  const [wRecordingUrl, setWRecordingUrl] = useState('');
  const [wPublished, setWPublished] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) { router.replace('/login'); return null; } return r.json(); })
      .then(u => {
        if (u && u.role !== 'admin') { router.replace('/portal'); return; }
        if (u) { loadMembers(); loadWebinars(); loadAnalytics('all'); }
      })
      .catch(() => router.replace('/login'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadMembers() {
    setMembersLoading(true);
    const res = await fetch('/api/admin/members');
    if (res.ok) setMembers(await res.json());
    setMembersLoading(false);
  }

  async function loadWebinars() {
    setWebinarsLoading(true);
    const res = await fetch('/api/admin/webinars');
    if (res.ok) setWebinars(await res.json());
    setWebinarsLoading(false);
  }

  async function loadAnalytics(plan: string) {
    setAnalyticsLoading(true);
    const res = await fetch(`/api/admin/analytics?plan=${plan}`);
    if (res.ok) setAnalytics(await res.json());
    setAnalyticsLoading(false);
  }

  async function logout() {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  }

  // ── Member actions ──
  async function addMember() {
    if (!addEmail || !addPassword) return;
    setAddLoading(true); setAddError('');
    const res = await fetch('/api/admin/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: addEmail, password: addPassword, name: addName, cohort: addCohort, role: addRole, plan: addPlan, skip_contract: addSkipContract }),
    });
    if (res.ok) {
      setShowAdd(false);
      setAddEmail(''); setAddName(''); setAddPassword(''); setAddCohort(''); setAddRole('member'); setAddPlan('5k'); setAddSkipContract(false);
      loadMembers();
    } else {
      const d = await res.json().catch(() => ({}));
      setAddError(d.error || 'Failed to add member');
    }
    setAddLoading(false);
  }

  function openEdit(m: Member) {
    setSelected(m); setEditName(m.name); setEditCohort(m.cohort);
    setEditNotes(m.notes); setEditPassword(''); setEditActive(m.active);
    setEditPlan(m.plan ?? '5k'); setEditSkipContract(m.skip_contract ?? false); setDeleteConfirm('');
  }

  async function unlockPortal() {
    if (!selected) return;
    setUnlockLoading(true);
    await fetch(`/api/admin/members/${encodeURIComponent(selected.email)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portal_unlocked: true }),
    });
    setSelected(null);
    loadMembers();
    setUnlockLoading(false);
  }

  async function handleDelete() {
    if (!selected || deleteConfirm !== 'DELETE') return;
    setDeleteLoading(true);
    await fetch(`/api/admin/members/${encodeURIComponent(selected.email)}`, { method: 'DELETE' });
    setSelected(null);
    setDeleteConfirm('');
    loadMembers();
    setDeleteLoading(false);
  }

  async function saveEdit() {
    if (!selected) return;
    setEditLoading(true);
    const body: Record<string, unknown> = { name: editName, cohort: editCohort, notes: editNotes, active: editActive, plan: editPlan, skip_contract: editSkipContract };
    if (editPassword) body.password = editPassword;
    await fetch(`/api/admin/members/${encodeURIComponent(selected.email)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSelected(null);
    loadMembers();
    setEditLoading(false);
  }

  // ── Webinar actions ──
  function openNewWebinar() {
    setEditingWebinar(null);
    setWTitle(''); setWDescription(''); setWScheduledAt('');
    setWJoinLink(''); setWRecordingUrl(''); setWPublished(true);
    setWError('');
    setShowWebinarModal(true);
  }

  function openEditWebinar(w: Webinar) {
    setEditingWebinar(w);
    setWTitle(w.title); setWDescription(w.description);
    setWScheduledAt(toLocalInput(w.scheduled_at));
    setWJoinLink(w.join_link); setWRecordingUrl(w.recording_url);
    setWPublished(w.is_published);
    setWError('');
    setShowWebinarModal(true);
  }

  async function saveWebinar() {
    if (!wTitle.trim() || !wScheduledAt) { setWError('Title and date/time are required'); return; }
    setWSaving(true); setWError('');
    const body = {
      title: wTitle.trim(),
      description: wDescription.trim(),
      scheduled_at: new Date(wScheduledAt).toISOString(),
      join_link: wJoinLink.trim(),
      recording_url: wRecordingUrl.trim(),
      is_published: wPublished,
    };
    const url = editingWebinar ? `/api/admin/webinars/${editingWebinar.id}` : '/api/admin/webinars';
    const method = editingWebinar ? 'PATCH' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      setShowWebinarModal(false);
      loadWebinars();
    } else {
      const d = await res.json().catch(() => ({}));
      setWError(d.error || 'Failed to save');
    }
    setWSaving(false);
  }

  async function removeWebinar(id: string) {
    if (!confirm('Delete this webinar? This cannot be undone.')) return;
    await fetch(`/api/admin/webinars/${id}`, { method: 'DELETE' });
    loadWebinars();
  }

  // ── Cue AI Instruction actions ──
  async function loadCueInstructions() {
    setCueLoading(true);
    const res = await fetch('/api/admin/cue-instructions');
    if (res.ok) setCueInstructions(await res.json());
    setCueLoading(false);
  }

  async function addCueInstruction(type: 'do' | 'dont', text: string) {
    const setter = type === 'do' ? setAddingDo : setAddingDont;
    setter(true);
    await fetch('/api/admin/cue-instructions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, instruction: text }),
    });
    if (type === 'do') setNewDoText(''); else setNewDontText('');
    await loadCueInstructions();
    setter(false);
  }

  async function toggleCueInstruction(id: string, active: boolean) {
    await fetch(`/api/admin/cue-instructions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    loadCueInstructions();
  }

  async function deleteCueInstruction(id: string) {
    if (!confirm('Delete this instruction?')) return;
    await fetch(`/api/admin/cue-instructions/${id}`, { method: 'DELETE' });
    loadCueInstructions();
  }

  const filtered = members.filter(m =>
    m.email.includes(search.toLowerCase()) ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.cohort.toLowerCase().includes(search.toLowerCase())
  );

  const now = new Date();
  const upcoming = webinars.filter(w => new Date(w.scheduled_at) > now).sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  const past = webinars.filter(w => new Date(w.scheduled_at) <= now).sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());

  const panelStyle: React.CSSProperties = { position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 };
  const cardStyle: React.CSSProperties = { background: '#0c1018', border: '1px solid rgba(255,255,255,0.1)', borderTop: '2px solid #2563eb', borderRadius: 10, padding: 28, width: '100%', maxWidth: 480 };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.015) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wsa/home/1.png" alt="WSA" style={{ height: 36, width: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.12)' }} />
          <span style={{ fontFamily: M, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(37,99,235,0.65)', textTransform: 'uppercase' }}>Admin</span>
          <a href="/portal" style={{ fontFamily: M, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, padding: '4px 10px' }}>← Portal</a>
        </div>
        <button onClick={logout} disabled={loggingOut} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '6px 14px', fontFamily: M, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.32)'; }}>
          {loggingOut ? '...' : 'Sign out'}
        </button>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1120, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Tab nav */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
          {(['members', 'webinars', 'analytics', 'cue-ai'] as const).map(tab => (
            <button key={tab} onClick={() => {
              setActiveTab(tab);
              if (tab === 'analytics') loadAnalytics(analyticsPlan);
              if (tab === 'cue-ai' && cueInstructions.length === 0) loadCueInstructions();
            }} style={{
              background: activeTab === tab ? 'rgba(37,99,235,0.1)' : 'transparent',
              border: `1px solid ${activeTab === tab ? 'rgba(37,99,235,0.35)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 7, padding: '8px 20px', fontFamily: M, fontSize: 9, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: activeTab === tab ? '#2563eb' : 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {tab === 'members' ? `Members · ${members.length}` : tab === 'webinars' ? `Webinars · ${webinars.length}` : tab === 'analytics' ? 'Analytics' : 'Cue AI'}
            </button>
          ))}
        </div>

        {/* ── MEMBERS TAB ──────────────────────────────────────────── */}
        {activeTab === 'members' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontFamily: D, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 3px' }}>Members</h1>
                <p style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{members.length} total · {members.filter(m => m.active).length} active</p>
              </div>
              <button onClick={() => setShowAdd(true)} style={{ background: '#2563eb', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: M, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                + Add Member
              </button>
            </div>

            <input type="text" placeholder="Search by email, name or cohort…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...F, marginBottom: 14, height: 42, paddingLeft: 16 }} onFocus={FO} onBlur={FB} />

            {membersLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: M, fontSize: 11, color: 'rgba(37,99,235,0.4)', letterSpacing: '0.2em' }}>LOADING</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Name', 'Email', 'Plan', 'Expires', 'Progress', 'Role', 'Status', 'Last Login', 'Joined', ''].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 14px', fontFamily: M, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(m => (
                      <tr key={m.email} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                        <td style={{ padding: '12px 14px', fontFamily: S, fontSize: 13, color: m.active ? '#fff' : 'rgba(255,255,255,0.28)' }}>{m.name || '—'}</td>
                        <td style={{ padding: '12px 14px', fontFamily: S, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{m.email}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontFamily: M, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: m.plan === '15k' ? '#2563eb' : m.plan === '7.5k' ? '#f97316' : m.plan === 'low_ticket' ? '#a855f7' : 'rgba(255,255,255,0.4)', background: m.plan === '15k' ? 'rgba(37,99,235,0.08)' : m.plan === '7.5k' ? 'rgba(249,115,22,0.08)' : m.plan === 'low_ticket' ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 4 }}>{m.plan === 'low_ticket' ? 'Low Ticket' : m.plan || '5k'}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontFamily: M, fontSize: 10, color: m.expires_at && new Date(m.expires_at) < new Date() ? '#ef4444' : 'rgba(255,255,255,0.3)' }}>
                          {m.expires_at ? new Date(m.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ display: 'flex', gap: 2 }}>
                              {[1,2,3,4,5,6,7].map(p => (
                                <div key={p} style={{ width: 7, height: 7, borderRadius: 2, background: (m.current_phase ?? 0) >= p ? '#2563eb' : 'rgba(255,255,255,0.07)' }} />
                              ))}
                            </div>
                            <span style={{ fontFamily: S, fontSize: 11, color: 'rgba(255,255,255,0.32)' }}>
                              {(m.current_phase ?? 0) === 0 ? 'Not started' : PHASE_LABELS[m.current_phase ?? 0] ?? `P${m.current_phase}`}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontFamily: M, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: m.role === 'admin' ? '#2563eb' : 'rgba(255,255,255,0.32)', background: m.role === 'admin' ? 'rgba(37,99,235,0.08)' : 'transparent', padding: m.role === 'admin' ? '3px 7px' : '0', borderRadius: 4 }}>{m.role}</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: m.active ? '#22c55e' : '#ef4444', boxShadow: m.active ? '0 0 6px rgba(34,197,94,0.5)' : 'none' }} />
                        </td>
                        <td style={{ padding: '12px 14px', fontFamily: S, fontSize: 12, color: 'rgba(255,255,255,0.32)' }}>{timeAgo(m.last_login)}</td>
                        <td style={{ padding: '12px 14px', fontFamily: S, fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>{fmt(m.created_at)}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <button onClick={() => openEdit(m)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, padding: '5px 12px', fontFamily: M, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.35)'; e.currentTarget.style.color = '#2563eb'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.32)'; }}>Edit</button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={10} style={{ padding: '40px 14px', textAlign: 'center', fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>No members found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── WEBINARS TAB ─────────────────────────────────────────── */}
        {activeTab === 'webinars' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontFamily: D, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 3px' }}>Webinars & Recordings</h1>
                <p style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Schedule calls · add recordings after · auto-populates to member portal</p>
              </div>
              <button onClick={openNewWebinar} style={{ background: '#2563eb', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: M, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                + Schedule Call
              </button>
            </div>

            {webinarsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: M, fontSize: 11, color: 'rgba(37,99,235,0.4)', letterSpacing: '0.2em' }}>LOADING</div>
            ) : (
              <>
                {/* Upcoming */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontFamily: M, fontSize: 8, fontWeight: 700, letterSpacing: '0.24em', color: 'rgba(37,99,235,0.5)', textTransform: 'uppercase', marginBottom: 12 }}>
                    Upcoming · {upcoming.length}
                  </div>
                  {upcoming.length === 0 ? (
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
                      No upcoming calls scheduled. Click "+ Schedule Call" to add one.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {upcoming.map(w => (
                        <div key={w.id} style={{ display: 'grid', gridTemplateColumns: '170px 1fr 100px 100px auto', gap: 14, alignItems: 'center', background: 'rgba(37,99,235,0.03)', border: '1px solid rgba(37,99,235,0.12)', borderRadius: 9, padding: '13px 16px' }}>
                          <div>
                            <div style={{ fontFamily: M, fontSize: 10, fontWeight: 700, color: '#2563eb', letterSpacing: '0.04em' }}>{new Date(w.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            <div style={{ fontFamily: M, fontSize: 8, color: 'rgba(37,99,235,0.45)', marginTop: 2 }}>{new Date(w.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}</div>
                          </div>
                          <div>
                            <div style={{ fontFamily: S, fontSize: 13, fontWeight: 500, color: '#fff' }}>{w.title}</div>
                            {w.description && <div style={{ fontFamily: S, fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{w.description}</div>}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            {w.join_link ? (
                              <a href={w.join_link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: M, fontSize: 8, color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>🔗 Link ✓</a>
                            ) : (
                              <span style={{ fontFamily: M, fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>No link</span>
                            )}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontFamily: M, fontSize: 8, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>
                              {w.is_published ? '● Published' : '○ Draft'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => openEditWebinar(w)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, padding: '5px 11px', fontFamily: M, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.35)'; e.currentTarget.style.color = '#2563eb'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>Edit</button>
                            <button onClick={() => removeWebinar(w.id)} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 5, padding: '5px 11px', fontFamily: M, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.5)', cursor: 'pointer', transition: 'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; e.currentTarget.style.color = '#ef4444'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = 'rgba(239,68,68,0.5)'; }}>Del</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Past / Recordings */}
                <div>
                  <div style={{ fontFamily: M, fontSize: 8, fontWeight: 700, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 12 }}>
                    Past & Recordings · {past.length}
                  </div>
                  {past.length === 0 ? (
                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
                      No past sessions yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {past.map(w => (
                        <div key={w.id} style={{ display: 'grid', gridTemplateColumns: '170px 1fr 130px 100px auto', gap: 14, alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 9, padding: '12px 16px' }}>
                          <div style={{ fontFamily: M, fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>
                            {new Date(w.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div>
                            <div style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{w.title}</div>
                            {w.description && <div style={{ fontFamily: S, fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{w.description}</div>}
                          </div>
                          <div>
                            {w.recording_url ? (
                              <a href={w.recording_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: M, fontSize: 8, color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>🎬 Recording ✓</a>
                            ) : (
                              <span style={{ fontFamily: M, fontSize: 8, color: '#f59e0b', letterSpacing: '0.08em' }}>No recording yet</span>
                            )}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontFamily: M, fontSize: 8, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>
                              {w.is_published ? '● Published' : '○ Draft'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => openEditWebinar(w)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, padding: '5px 11px', fontFamily: M, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.35)'; e.currentTarget.style.color = '#2563eb'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>Edit</button>
                            <button onClick={() => removeWebinar(w.id)} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 5, padding: '5px 11px', fontFamily: M, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.5)', cursor: 'pointer', transition: 'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; e.currentTarget.style.color = '#ef4444'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = 'rgba(239,68,68,0.5)'; }}>Del</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
        {/* ── ANALYTICS TAB ────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontFamily: D, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 3px' }}>Cue AI Analytics</h1>
                <p style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Questions members have asked, filtered by plan tier</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {(['all', 'low_ticket', '5k', '7.5k', '15k'] as const).map(p => (
                  <button key={p} onClick={() => { setAnalyticsPlan(p); loadAnalytics(p); }} style={{ background: analyticsPlan === p ? 'rgba(37,99,235,0.1)' : 'transparent', border: `1px solid ${analyticsPlan === p ? 'rgba(37,99,235,0.35)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 7, padding: '6px 16px', fontFamily: M, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: analyticsPlan === p ? '#2563eb' : 'rgba(255,255,255,0.35)', cursor: 'pointer' }}>
                    {p === 'all' ? 'All' : p === 'low_ticket' ? 'Low Ticket' : p}
                  </button>
                ))}
              </div>
            </div>
            {analyticsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: M, fontSize: 11, color: 'rgba(37,99,235,0.4)', letterSpacing: '0.2em' }}>LOADING</div>
            ) : analytics.length === 0 ? (
              <div style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, textAlign: 'center', fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
                No questions logged yet. Questions appear here after members use Cue AI.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 180px 1fr 110px', gap: 14, padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 2 }}>
                  {['Plan', 'Member', 'Question', 'Date'].map(h => (
                    <span key={h} style={{ fontFamily: M, fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>{h}</span>
                  ))}
                </div>
                {analytics.map((row, i) => {
                  const isExpanded = expandedRow === row.id;
                  return (
                    <div key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <div
                        onClick={() => setExpandedRow(isExpanded ? null : row.id)}
                        style={{ display: 'grid', gridTemplateColumns: '80px 180px 1fr 110px 20px', gap: 14, padding: '11px 14px', alignItems: 'flex-start', cursor: 'pointer', transition: 'background 0.1s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <span style={{ fontFamily: M, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: row.plan === '15k' ? '#2563eb' : row.plan === '7.5k' ? '#f97316' : row.plan === 'low_ticket' ? '#a855f7' : 'rgba(255,255,255,0.4)', background: row.plan === '15k' ? 'rgba(37,99,235,0.07)' : row.plan === '7.5k' ? 'rgba(249,115,22,0.07)' : row.plan === 'low_ticket' ? 'rgba(168,85,247,0.07)' : 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 4, display: 'inline-block' }}>{row.plan === 'low_ticket' ? 'Low Ticket' : row.plan}</span>
                        <span style={{ fontFamily: S, fontSize: 11, color: 'rgba(255,255,255,0.4)', wordBreak: 'break-word' }}>{row.member_email}</span>
                        <span style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, wordBreak: 'break-word' }}>{row.question}</span>
                        <span style={{ fontFamily: M, fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>{new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span style={{ fontFamily: M, fontSize: 10, color: 'rgba(255,255,255,0.2)', transition: 'transform 0.15s', display: 'inline-block', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
                      </div>
                      {isExpanded && (
                        <div style={{ margin: '0 14px 14px', padding: '16px 18px', background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.12)', borderLeft: '3px solid rgba(37,99,235,0.35)', borderRadius: '0 6px 6px 0' }}>
                          <div style={{ fontFamily: M, fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(37,99,235,0.5)', marginBottom: 10 }}>Cue AI Response</div>
                          {row.answer ? (
                            <p style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{row.answer}</p>
                          ) : (
                            <p style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.2)', margin: 0, fontStyle: 'italic' }}>No answer saved — this question was asked before the answer logging was added.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div style={{ padding: '10px 14px', fontFamily: M, fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>{analytics.length} questions shown · max 1000</div>
              </div>
            )}
          </>
        )}
        {/* ── CUE AI TAB ────────────────────────────────────────── */}
        {activeTab === 'cue-ai' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: D, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 6px' }}>Cue AI Training</h1>
              <p style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                Active instructions are injected into every Cue AI conversation. Changes apply within 5 minutes.
              </p>
            </div>
            {cueLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: M, fontSize: 11, color: 'rgba(37,99,235,0.4)', letterSpacing: '0.2em' }}>LOADING</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* Cue DOES column */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }} />
                    <span style={{ fontFamily: M, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#22c55e' }}>Cue Does</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                    {cueInstructions.filter(i => i.type === 'do').length === 0 && (
                      <div style={{ padding: '16px', background: 'rgba(34,197,94,0.03)', border: '1px dashed rgba(34,197,94,0.15)', borderRadius: 8, fontFamily: S, fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
                        No DO instructions yet
                      </div>
                    )}
                    {cueInstructions.filter(i => i.type === 'do').map(instr => (
                      <div key={instr.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: instr.active ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${instr.active ? 'rgba(34,197,94,0.18)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 8, padding: '10px 12px' }}>
                        <button onClick={() => toggleCueInstruction(instr.id, instr.active)} title={instr.active ? 'Deactivate' : 'Activate'} style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 4, background: instr.active ? '#22c55e' : 'transparent', border: `1px solid ${instr.active ? '#22c55e' : 'rgba(255,255,255,0.15)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {instr.active && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}
                        </button>
                        <span style={{ flex: 1, fontFamily: S, fontSize: 13, color: instr.active ? '#fff' : 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>{instr.instruction}</span>
                        <button onClick={() => deleteCueInstruction(instr.id)} style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.4)', fontSize: 14, padding: '0 2px' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(239,68,68,0.4)'; }}>×</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      placeholder="Add a DO instruction…"
                      value={newDoText}
                      onChange={e => setNewDoText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && newDoText.trim()) addCueInstruction('do', newDoText.trim()); }}
                      maxLength={500}
                      style={{ ...F, flex: 1 }} onFocus={FO} onBlur={FB}
                    />
                    <button
                      onClick={() => { if (newDoText.trim()) addCueInstruction('do', newDoText.trim()); }}
                      disabled={addingDo || !newDoText.trim()}
                      style={{ height: 40, background: addingDo || !newDoText.trim() ? 'rgba(34,197,94,0.1)' : '#22c55e', border: 'none', borderRadius: 7, padding: '0 16px', fontFamily: M, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: addingDo || !newDoText.trim() ? 'rgba(34,197,94,0.4)' : '#fff', cursor: addingDo || !newDoText.trim() ? 'not-allowed' : 'pointer' }}>
                      {addingDo ? '...' : 'Add'}
                    </button>
                  </div>
                </div>

                {/* Cue DOESN'T column */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.4)' }} />
                    <span style={{ fontFamily: M, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ef4444' }}>{"Cue Doesn't"}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                    {cueInstructions.filter(i => i.type === 'dont').length === 0 && (
                      <div style={{ padding: '16px', background: "rgba(239,68,68,0.03)", border: '1px dashed rgba(239,68,68,0.15)', borderRadius: 8, fontFamily: S, fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
                        No DON&apos;T instructions yet
                      </div>
                    )}
                    {cueInstructions.filter(i => i.type === 'dont').map(instr => (
                      <div key={instr.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: instr.active ? "rgba(239,68,68,0.04)" : 'rgba(255,255,255,0.02)', border: `1px solid ${instr.active ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 8, padding: '10px 12px' }}>
                        <button onClick={() => toggleCueInstruction(instr.id, instr.active)} title={instr.active ? 'Deactivate' : 'Activate'} style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 4, background: instr.active ? '#ef4444' : 'transparent', border: `1px solid ${instr.active ? '#ef4444' : 'rgba(255,255,255,0.15)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {instr.active && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}
                        </button>
                        <span style={{ flex: 1, fontFamily: S, fontSize: 13, color: instr.active ? '#fff' : 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>{instr.instruction}</span>
                        <button onClick={() => deleteCueInstruction(instr.id)} style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.4)', fontSize: 14, padding: '0 2px' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(239,68,68,0.4)'; }}>×</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      placeholder="Add a DON'T instruction…"
                      value={newDontText}
                      onChange={e => setNewDontText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && newDontText.trim()) addCueInstruction('dont', newDontText.trim()); }}
                      maxLength={500}
                      style={{ ...F, flex: 1 }} onFocus={FO} onBlur={FB}
                    />
                    <button
                      onClick={() => { if (newDontText.trim()) addCueInstruction('dont', newDontText.trim()); }}
                      disabled={addingDont || !newDontText.trim()}
                      style={{ height: 40, background: addingDont || !newDontText.trim() ? "rgba(239,68,68,0.1)" : '#ef4444', border: 'none', borderRadius: 7, padding: '0 16px', fontFamily: M, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: addingDont || !newDontText.trim() ? "rgba(239,68,68,0.4)" : '#fff', cursor: addingDont || !newDontText.trim() ? 'not-allowed' : 'pointer' }}>
                      {addingDont ? '...' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Add Member Modal ── */}
      {showAdd && (
        <div style={panelStyle} onClick={() => setShowAdd(false)}>
          <div style={cardStyle} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: D, fontSize: 18, fontWeight: 700, margin: '0 0 20px', letterSpacing: '-0.02em' }}>Add Member</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder="Email *" value={addEmail} onChange={e => setAddEmail(e.target.value)} style={F} onFocus={FO} onBlur={FB} />
              <input placeholder="Full name" value={addName} onChange={e => setAddName(e.target.value)} style={F} onFocus={FO} onBlur={FB} />
              <input placeholder="Password *" type="password" value={addPassword} onChange={e => setAddPassword(e.target.value)} style={F} onFocus={FO} onBlur={FB} />
              <input placeholder="Cohort (e.g. June 2026)" value={addCohort} onChange={e => setAddCohort(e.target.value)} style={F} onFocus={FO} onBlur={FB} />
              <select value={addRole} onChange={e => setAddRole(e.target.value as 'member' | 'admin')} style={{ ...F, appearance: 'none' as const }}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <select value={addPlan} onChange={e => setAddPlan(e.target.value as Plan)} style={{ ...F, appearance: 'none' as const }}>
                <option value="low_ticket">Low Ticket — Cue AI only · 4 months</option>
                <option value="5k">5K — Roadmap + Cue AI</option>
                <option value="7.5k">7.5K — + Group Calls & Webinars</option>
                <option value="15k">15K — + 1-on-1 with Cue</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={addSkipContract} onChange={e => setAddSkipContract(e.target.checked)} style={{ accentColor: '#2563eb', width: 14, height: 14 }} />
                <span style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>15K — No Contract (sent via chat after payment)</span>
              </label>
            </div>
            {addError && <p style={{ fontFamily: M, fontSize: 10, color: '#ef4444', marginTop: 10, letterSpacing: '0.06em' }}>{addError}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, height: 40, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, fontFamily: M, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={addMember} disabled={addLoading || !addEmail || !addPassword} style={{ flex: 2, height: 40, background: addLoading || !addEmail || !addPassword ? 'rgba(37,99,235,0.15)' : '#2563eb', border: 'none', borderRadius: 7, fontFamily: M, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: addLoading || !addEmail || !addPassword ? 'rgba(37,99,235,0.4)' : '#fff', cursor: addLoading || !addEmail || !addPassword ? 'not-allowed' : 'pointer' }}>
                {addLoading ? '...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Member Modal ── */}
      {selected && (
        <div style={panelStyle} onClick={() => setSelected(null)}>
          <div style={cardStyle} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: D, fontSize: 18, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Edit Member</h2>
              <p style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{selected.email}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder="Full name" value={editName} onChange={e => setEditName(e.target.value)} style={F} onFocus={FO} onBlur={FB} />
              <input placeholder="Cohort" value={editCohort} onChange={e => setEditCohort(e.target.value)} style={F} onFocus={FO} onBlur={FB} />
              <input placeholder="Notes (internal)" value={editNotes} onChange={e => setEditNotes(e.target.value)} style={F} onFocus={FO} onBlur={FB} />
              <input placeholder="New password (leave blank to keep)" type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} style={F} onFocus={FO} onBlur={FB} />
              <select value={editPlan} onChange={e => setEditPlan(e.target.value as Plan)} style={{ ...F, appearance: 'none' as const }}>
                <option value="low_ticket">Low Ticket — Cue AI only · 4 months</option>
                <option value="5k">5K — Roadmap + Cue AI</option>
                <option value="7.5k">7.5K — + Group Calls & Webinars</option>
                <option value="15k">15K — + 1-on-1 with Cue</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={editActive} onChange={e => setEditActive(e.target.checked)} style={{ accentColor: '#2563eb', width: 14, height: 14 }} />
                <span style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Active (can log in)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={editSkipContract} onChange={e => setEditSkipContract(e.target.checked)} style={{ accentColor: '#2563eb', width: 14, height: 14 }} />
                <span style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>15K — No Contract (sent via chat after payment)</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setSelected(null)} style={{ flex: 1, height: 40, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, fontFamily: M, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveEdit} disabled={editLoading} style={{ flex: 2, height: 40, background: editLoading ? 'rgba(37,99,235,0.15)' : '#2563eb', border: 'none', borderRadius: 7, fontFamily: M, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: editLoading ? 'rgba(37,99,235,0.4)' : '#fff', cursor: editLoading ? 'not-allowed' : 'pointer' }}>
                {editLoading ? '...' : 'Save Changes'}
              </button>
            </div>

            {/* Unlock portal access */}
            {selected.role !== 'admin' && !selected.portal_unlocked && (
              <div style={{ marginTop: 16, padding: '16px 0 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontFamily: M, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(34,197,94,0.5)', marginBottom: 8 }}>Portal Access</div>
                <div style={{ fontFamily: S, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
                  Member has completed onboarding but hasn&apos;t had their call yet. Click to unlock the full portal.
                </div>
                <button
                  onClick={unlockPortal}
                  disabled={unlockLoading}
                  style={{ width: '100%', height: 40, background: unlockLoading ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 7, fontFamily: M, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: unlockLoading ? 'rgba(34,197,94,0.3)' : '#22c55e', cursor: unlockLoading ? 'not-allowed' : 'pointer' }}
                >
                  {unlockLoading ? '...' : '🔓 Unlock Full Portal Access'}
                </button>
              </div>
            )}
            {selected.role !== 'admin' && selected.portal_unlocked && (
              <div style={{ marginTop: 16, padding: '16px 0 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontFamily: S, fontSize: 12, color: 'rgba(34,197,94,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>●</span> Portal access is active
                </div>
              </div>
            )}

            {/* Danger zone — delete member */}
            <div style={{ marginTop: 16, padding: '16px 0 0', borderTop: '1px solid rgba(239,68,68,0.15)' }}>
              <div style={{ fontFamily: M, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.4)', marginBottom: 8 }}>Danger Zone</div>
              <div style={{ fontFamily: S, fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>
                Permanently deletes this member and all their data. Type <span style={{ fontFamily: M, color: 'rgba(239,68,68,0.6)' }}>DELETE</span> to confirm.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  placeholder="Type DELETE to confirm"
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                  style={{ ...F, flex: 1, borderColor: deleteConfirm === 'DELETE' ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)', fontSize: 12 }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = deleteConfirm === 'DELETE' ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'; }}
                />
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirm !== 'DELETE' || deleteLoading}
                  style={{ height: 40, padding: '0 18px', background: deleteConfirm === 'DELETE' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${deleteConfirm === 'DELETE' ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 7, fontFamily: M, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: deleteConfirm === 'DELETE' ? '#ef4444' : 'rgba(255,255,255,0.18)', cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                >
                  {deleteLoading ? '...' : 'Delete'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Webinar Modal ── */}
      {showWebinarModal && (
        <div style={panelStyle} onClick={() => setShowWebinarModal(false)}>
          <div style={{ ...cardStyle, maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: D, fontSize: 18, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              {editingWebinar ? 'Edit Webinar' : 'Schedule New Call'}
            </h2>
            <p style={{ fontFamily: S, fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: '0 0 20px' }}>
              {editingWebinar ? 'Update details. Add recording URL after the call.' : 'Fills the portal automatically when saved.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder="Title * (e.g. Weekly Call #5 — Fibonacci Confluence)" value={wTitle} onChange={e => setWTitle(e.target.value)} style={F} onFocus={FO} onBlur={FB} />
              <input placeholder="Description (optional)" value={wDescription} onChange={e => setWDescription(e.target.value)} style={F} onFocus={FO} onBlur={FB} />
              <div>
                <label style={{ fontFamily: M, fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 6 }}>Date & Time *</label>
                <input type="datetime-local" value={wScheduledAt} onChange={e => setWScheduledAt(e.target.value)} style={{ ...F, colorScheme: 'dark' }} onFocus={FO} onBlur={FB} />
              </div>
              <input placeholder="Join Link (Zoom / Google Meet URL)" value={wJoinLink} onChange={e => setWJoinLink(e.target.value)} style={F} onFocus={FO} onBlur={FB} />
              <input placeholder="Recording URL (add after the call)" value={wRecordingUrl} onChange={e => setWRecordingUrl(e.target.value)} style={F} onFocus={FO} onBlur={FB} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 0' }}>
                <input type="checkbox" checked={wPublished} onChange={e => setWPublished(e.target.checked)} style={{ accentColor: '#2563eb', width: 14, height: 14 }} />
                <span style={{ fontFamily: S, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Published (visible to all members)</span>
              </label>
            </div>
            {wError && <p style={{ fontFamily: M, fontSize: 10, color: '#ef4444', marginTop: 8, letterSpacing: '0.06em' }}>{wError}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowWebinarModal(false)} style={{ flex: 1, height: 40, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, fontFamily: M, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveWebinar} disabled={wSaving || !wTitle.trim() || !wScheduledAt} style={{ flex: 2, height: 40, background: wSaving || !wTitle.trim() || !wScheduledAt ? 'rgba(37,99,235,0.15)' : '#2563eb', border: 'none', borderRadius: 7, fontFamily: M, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: wSaving || !wTitle.trim() || !wScheduledAt ? 'rgba(37,99,235,0.4)' : '#fff', cursor: wSaving || !wTitle.trim() || !wScheduledAt ? 'not-allowed' : 'pointer' }}>
                {wSaving ? '...' : editingWebinar ? 'Save Changes' : 'Schedule Call'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
