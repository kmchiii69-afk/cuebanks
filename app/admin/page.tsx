'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
}

function fmt(ts: number) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

const FIELD_STYLE: React.CSSProperties = {
  width: '100%', height: 40,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 7, padding: '0 12px',
  fontSize: 13, color: '#fff',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

export default function AdminPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Add member form
  const [addEmail, setAddEmail] = useState('');
  const [addName, setAddName] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addCohort, setAddCohort] = useState('');
  const [addRole, setAddRole] = useState<'member' | 'admin'>('member');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit member form
  const [editName, setEditName] = useState('');
  const [editCohort, setEditCohort] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => {
        if (!r.ok) { router.replace('/login'); return null; }
        return r.json();
      })
      .then(u => {
        if (u && u.role !== 'admin') { router.replace('/portal'); return; }
        if (u) loadMembers();
      })
      .catch(() => router.replace('/login'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadMembers() {
    setLoading(true);
    const res = await fetch('/api/admin/members');
    if (res.ok) setMembers(await res.json());
    setLoading(false);
  }

  async function logout() {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  }

  async function addMember() {
    if (!addEmail || !addPassword) return;
    setAddLoading(true);
    setAddError('');
    const res = await fetch('/api/admin/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: addEmail, password: addPassword, name: addName, cohort: addCohort, role: addRole }),
    });
    if (res.ok) {
      setShowAdd(false);
      setAddEmail(''); setAddName(''); setAddPassword(''); setAddCohort(''); setAddRole('member');
      loadMembers();
    } else {
      const d = await res.json().catch(() => ({}));
      setAddError(d.error || 'Failed to add member');
    }
    setAddLoading(false);
  }

  function openEdit(m: Member) {
    setSelected(m);
    setEditName(m.name);
    setEditCohort(m.cohort);
    setEditNotes(m.notes);
    setEditPassword('');
    setEditActive(m.active);
  }

  async function saveEdit() {
    if (!selected) return;
    setEditLoading(true);
    const body: Record<string, unknown> = {
      name: editName,
      cohort: editCohort,
      notes: editNotes,
      active: editActive,
    };
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

  const filtered = members.filter(m =>
    m.email.includes(search.toLowerCase()) ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.cohort.toLowerCase().includes(search.toLowerCase())
  );

  const panelStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 100,
    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
  };

  const cardStyle: React.CSSProperties = {
    background: '#0c1018', border: '1px solid rgba(255,255,255,0.1)',
    borderTop: '2px solid #f9ff3c',
    borderRadius: 10, padding: 28,
    width: '100%', maxWidth: 460,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
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
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f9ff3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 14, color: '#000' }}>W</span>
          </div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(249,255,60,0.6)', textTransform: 'uppercase' }}>Admin</span>
        </div>
        <button
          onClick={logout} disabled={loggingOut}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '6px 14px', fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
        >
          {loggingOut ? '...' : 'Sign out'}
        </button>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Sora', system-ui", fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Members</h1>
            <p style={{ fontFamily: "'DM Sans', system-ui", fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
              {members.length} total · {members.filter(m => m.active).length} active
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: '#f9ff3c', border: 'none', borderRadius: 8,
              padding: '10px 20px',
              fontFamily: "'Space Mono', monospace", fontSize: 10,
              fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#000', cursor: 'pointer', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            + Add Member
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by email, name or cohort…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            ...FIELD_STYLE, marginBottom: 16, height: 42,
            paddingLeft: 16, fontSize: 13,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(249,255,60,0.3)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        />

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(249,255,60,0.4)', letterSpacing: '0.2em' }}>LOADING</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Cohort', 'Role', 'Status', 'Last Login', 'Joined', ''].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '8px 14px',
                      fontFamily: "'Space Mono', monospace", fontSize: 9,
                      fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.25)',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.email} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                    <td style={{ padding: '13px 14px', fontFamily: "'DM Sans', system-ui", fontSize: 13, color: m.active ? '#fff' : 'rgba(255,255,255,0.3)' }}>{m.name || '—'}</td>
                    <td style={{ padding: '13px 14px', fontFamily: "'DM Sans', system-ui", fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{m.email}</td>
                    <td style={{ padding: '13px 14px', fontFamily: "'Space Mono', monospace", fontSize: 11, color: m.cohort ? 'rgba(249,255,60,0.6)' : 'rgba(255,255,255,0.2)' }}>{m.cohort || '—'}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{
                        fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: m.role === 'admin' ? '#f9ff3c' : 'rgba(255,255,255,0.35)',
                        background: m.role === 'admin' ? 'rgba(249,255,60,0.08)' : 'transparent',
                        padding: m.role === 'admin' ? '3px 7px' : '0',
                        borderRadius: 4,
                      }}>{m.role}</span>
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{
                        display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                        background: m.active ? '#22c55e' : '#ef4444',
                        boxShadow: m.active ? '0 0 8px rgba(34,197,94,0.5)' : 'none',
                      }} />
                    </td>
                    <td style={{ padding: '13px 14px', fontFamily: "'DM Sans', system-ui", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{timeAgo(m.last_login)}</td>
                    <td style={{ padding: '13px 14px', fontFamily: "'DM Sans', system-ui", fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{fmt(m.created_at)}</td>
                    <td style={{ padding: '13px 14px' }}>
                      <button
                        onClick={() => openEdit(m)}
                        style={{
                          background: 'none', border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 5, padding: '5px 12px',
                          fontFamily: "'Space Mono', monospace", fontSize: 9,
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,255,60,0.3)'; e.currentTarget.style.color = '#f9ff3c'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                      >Edit</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: '40px 14px', textAlign: 'center', fontFamily: "'DM Sans', system-ui", fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>No members found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add Member Panel */}
      {showAdd && (
        <div style={panelStyle} onClick={() => setShowAdd(false)}>
          <div style={cardStyle} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Sora', system-ui", fontSize: 18, fontWeight: 700, margin: '0 0 20px', letterSpacing: '-0.02em' }}>Add Member</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder="Email *" value={addEmail} onChange={e => setAddEmail(e.target.value)} style={FIELD_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(249,255,60,0.3)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
              <input placeholder="Full name" value={addName} onChange={e => setAddName(e.target.value)} style={FIELD_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(249,255,60,0.3)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
              <input placeholder="Password *" type="password" value={addPassword} onChange={e => setAddPassword(e.target.value)} style={FIELD_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(249,255,60,0.3)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
              <input placeholder="Cohort (e.g. June 2026)" value={addCohort} onChange={e => setAddCohort(e.target.value)} style={FIELD_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(249,255,60,0.3)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
              <select value={addRole} onChange={e => setAddRole(e.target.value as 'member' | 'admin')}
                style={{ ...FIELD_STYLE, appearance: 'none' as const }}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {addError && <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#ef4444', marginTop: 10, letterSpacing: '0.06em' }}>{addError}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowAdd(false)}
                style={{ flex: 1, height: 40, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={addMember} disabled={addLoading || !addEmail || !addPassword}
                style={{ flex: 2, height: 40, background: addLoading || !addEmail || !addPassword ? 'rgba(249,255,60,0.15)' : '#f9ff3c', border: 'none', borderRadius: 7, fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: addLoading || !addEmail || !addPassword ? 'rgba(249,255,60,0.4)' : '#000', cursor: addLoading || !addEmail || !addPassword ? 'not-allowed' : 'pointer' }}>
                {addLoading ? '...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Panel */}
      {selected && (
        <div style={panelStyle} onClick={() => setSelected(null)}>
          <div style={cardStyle} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Sora', system-ui", fontSize: 18, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Edit Member</h2>
              <p style={{ fontFamily: "'DM Sans', system-ui", fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{selected.email}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder="Full name" value={editName} onChange={e => setEditName(e.target.value)} style={FIELD_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(249,255,60,0.3)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
              <input placeholder="Cohort" value={editCohort} onChange={e => setEditCohort(e.target.value)} style={FIELD_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(249,255,60,0.3)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
              <input placeholder="Notes (internal only)" value={editNotes} onChange={e => setEditNotes(e.target.value)} style={FIELD_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(249,255,60,0.3)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
              <input placeholder="New password (leave blank to keep)" type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} style={FIELD_STYLE}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(249,255,60,0.3)'; }} onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={editActive} onChange={e => setEditActive(e.target.checked)} style={{ accentColor: '#f9ff3c', width: 14, height: 14 }} />
                <span style={{ fontFamily: "'DM Sans', system-ui", fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Active (can log in)</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setSelected(null)}
                style={{ flex: 1, height: 40, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={saveEdit} disabled={editLoading}
                style={{ flex: 2, height: 40, background: editLoading ? 'rgba(249,255,60,0.15)' : '#f9ff3c', border: 'none', borderRadius: 7, fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: editLoading ? 'rgba(249,255,60,0.4)' : '#000', cursor: editLoading ? 'not-allowed' : 'pointer' }}>
                {editLoading ? '...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
