"use client";

// TEMPORARY booking experience for A2P / SMS-consent approval. Self-contained:
// no Calendly dependency. Presents a (dummy) calendar + a booking form with an
// explicit SMS opt-in disclosure so carriers/Close can verify consent capture.
// Revert to <BookingCalendar/> in app/book/page.tsx once CALENDLY_PAT is live.

import { useMemo, useState } from "react";
import posthog from "posthog-js";

const TIMES = ["9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM"];

function nextBusinessDays(n: number): Date[] {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1); // start tomorrow
  while (out.length < n) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export default function DummyBookingForm({
  firstName,
  lastName,
  email: emailProp,
  phone: phoneProp,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}) {
  const days = useMemo(() => nextBusinessDays(7), []);
  const [date, setDate] = useState<Date | null>(days[0] ?? null);
  const [time, setTime] = useState<string | null>(null);
  const [first, setFirst] = useState(firstName);
  const [last, setLast] = useState(lastName);
  const [email, setEmail] = useState(emailProp);
  const [phone, setPhone] = useState(phoneProp);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [err, setErr] = useState("");

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneOk = phone.replace(/\D/g, "").length >= 10;
  const ready = !!date && !!time && first.trim() && emailOk && phoneOk && consent;

  async function confirm() {
    setErr("");
    if (!date || !time) return setErr("Please pick a day and time.");
    if (!first.trim()) return setErr("Please enter your first name.");
    if (!emailOk) return setErr("Please enter a valid email.");
    if (!phoneOk) return setErr("Please enter a valid phone number.");
    if (!consent) return setErr("Please agree to receive text messages to continue.");

    setStatus("submitting");
    const when = `${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${time}`;
    try {
      // Best-effort: record the lead + intent in the existing backend (no-op if
      // its env vars aren't set yet). Never blocks the confirmation.
      await fetch("/api/callback-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first.trim(),
          last_name: last.trim(),
          email: email.trim(),
          phone: phone.trim(),
          sms_consent: true,
          requested_time: when,
        }),
      }).catch(() => {});
      posthog.capture("book_scheduled", { requested_time: when, sms_consent: true });
    } catch {
      /* ignore — still confirm */
    }
    window.location.href = "/book/confirm";
  }

  return (
    <div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.22em", textTransform: "uppercase", textAlign: "center", marginBottom: 24 }}>
        · Select a time · 45 min ·
      </div>

      {/* Day strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 20 }}>
        {days.map((d) => {
          const sel = date?.toDateString() === d.toDateString();
          return (
            <button
              key={d.toISOString()}
              onClick={() => { setDate(d); setTime(null); }}
              style={{
                padding: "14px 4px", borderRadius: 6, cursor: "pointer", textAlign: "center",
                background: sel ? "rgba(249,255,60,0.08)" : "var(--bg-1)",
                border: `1px solid ${sel ? "var(--acid)" : "var(--line)"}`,
                color: sel ? "var(--acid)" : "var(--bone)", transition: "all 150ms ease",
                boxShadow: sel ? "0 0 0 1px var(--acid)" : "none",
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4, color: sel ? "var(--acid)" : "var(--ash)" }}>{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{d.getDate()}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4, color: "var(--ash)" }}>{d.toLocaleDateString("en-US", { month: "short" })}</div>
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, marginBottom: 28 }}>
        {TIMES.map((t) => {
          const sel = time === t;
          return (
            <button
              key={t}
              onClick={() => { setTime(t); posthog.capture("book_slot_selected", { time: t }); }}
              style={{
                padding: "16px 10px", borderRadius: 5, cursor: "pointer", textAlign: "center",
                background: sel ? "rgba(249,255,60,0.08)" : "var(--bg-1)",
                border: `1px solid ${sel ? "var(--acid)" : "var(--line)"}`,
                color: sel ? "var(--acid)" : "var(--bone)",
                fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, transition: "all 140ms ease",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Details + consent */}
      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="bk-form-row">
          <Field label="First name" value={first} onChange={setFirst} placeholder="Jane" />
          <Field label="Last name" value={last} onChange={setLast} placeholder="Trader" />
        </div>
        <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@email.com" />
        <Field label="Phone" value={phone} onChange={setPhone} type="tel" placeholder="+1 (555) 000-0000" />

        {/* SMS consent — required for A2P / carrier approval */}
        <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer", background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 8, padding: "14px 16px" }}>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 18, height: 18, marginTop: 2, accentColor: "var(--acid)", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, lineHeight: 1.55, color: "var(--ash)" }}>
            By checking this box, I agree to receive appointment reminders and recurring marketing text messages from Wall Street Academy at the number provided, including via automated systems. Consent is not a condition of purchase. Msg &amp; data rates may apply. Msg frequency varies. Reply <strong style={{ color: "var(--bone)" }}>STOP</strong> to opt out or <strong style={{ color: "var(--bone)" }}>HELP</strong> for help. See our{" "}
            <a href="/privacy" style={{ color: "var(--acid)" }}>Privacy Policy</a> and <a href="/terms" style={{ color: "var(--acid)" }}>Terms</a>.
          </span>
        </label>

        {err && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--pink)", letterSpacing: "0.06em" }}>{err}</div>}

        <button
          onClick={confirm}
          disabled={status === "submitting"}
          className="btn btn-lg"
          style={{ width: "100%", justifyContent: "center", border: 0, cursor: status === "submitting" ? "wait" : "pointer", opacity: ready || status === "submitting" ? 1 : 0.7 }}
        >
          {status === "submitting" ? "Confirming…" : "Confirm My Call →"}
        </button>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted)", letterSpacing: "0.12em", textAlign: "center", textTransform: "uppercase" }}>
          · No charge to book · 45-minute strategy call ·
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ash)", marginBottom: 7 }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acid)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line-2)")}
        style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--line-2)", color: "var(--bone)", padding: "13px 14px", fontFamily: "var(--font-body)", fontSize: 14.5, borderRadius: 8, outline: "none", boxSizing: "border-box" }}
      />
    </label>
  );
}
