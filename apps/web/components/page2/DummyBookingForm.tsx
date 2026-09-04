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
      <div className="font-mono text-[10px] font-bold text-acid tracking-[0.22em] uppercase text-center mb-6">
        · Select a time · 45 min ·
      </div>

      {/* Day strip */}
      <div className="grid grid-cols-7 gap-2 mb-5">
        {days.map((d) => {
          const sel = date?.toDateString() === d.toDateString();
          return (
            <button
              key={d.toISOString()}
              onClick={() => {
                setDate(d);
                setTime(null);
              }}
              style={{
                background: sel ? "rgba(249,255,60,0.08)" : "var(--bg-1)",
                borderColor: sel ? "var(--acid)" : "var(--line)",
                color: sel ? "var(--acid)" : "var(--bone)",
                boxShadow: sel ? "0 0 0 1px var(--acid)" : "none",
              }}
              className="rounded-md cursor-pointer text-center py-3.5 px-1 border transition-all duration-150"
            >
              <div
                style={{ color: sel ? "var(--acid)" : "var(--ash)" }}
                className="font-mono text-[8px] font-bold tracking-[0.14em] uppercase mb-1"
              >
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className="font-display text-[26px] font-bold leading-none">{d.getDate()}</div>
              <div className="font-mono text-[8px] font-bold tracking-[0.12em] uppercase mt-1 text-ash">
                {d.toLocaleDateString("en-US", { month: "short" })}
              </div>
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2 mb-7">
        {TIMES.map((t) => {
          const sel = time === t;
          return (
            <button
              key={t}
              onClick={() => {
                setTime(t);
                posthog.capture("book_slot_selected", { time: t });
              }}
              style={{
                background: sel ? "rgba(249,255,60,0.08)" : "var(--bg-1)",
                borderColor: sel ? "var(--acid)" : "var(--line)",
                color: sel ? "var(--acid)" : "var(--bone)",
              }}
              className="rounded-sm cursor-pointer text-center py-4 px-2.5 border font-display text-[15px] font-bold transition-all duration-150"
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Details + consent */}
      <div className="border-t border-line pt-6 flex flex-col gap-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bk-form-row">
          <Field label="First name" value={first} onChange={setFirst} placeholder="Jane" />
          <Field label="Last name" value={last} onChange={setLast} placeholder="Trader" />
        </div>
        <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@email.com" />
        <Field label="Phone" value={phone} onChange={setPhone} type="tel" placeholder="+1 (555) 000-0000" />

        {/* SMS consent — required for A2P / carrier approval */}
        <label className="flex gap-3 items-start cursor-pointer bg-bg-1 border border-line rounded-lg py-3.5 px-4">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            style={{ accentColor: "var(--acid)" }}
            className="w-[18px] h-[18px] mt-0.5 flex-shrink-0"
          />
          <span className="font-body text-[12.5px] leading-[1.55] text-ash">
            By checking this box, I agree to receive appointment reminders and recurring marketing text messages from Wall Street Academy at the number provided, including via automated systems. Consent is not a condition of purchase. Msg &amp; data rates may apply. Msg frequency varies. Reply{" "}
            <strong className="text-bone">STOP</strong> to opt out or <strong className="text-bone">HELP</strong> for help. See our{" "}
            <a href="/privacy" className="text-acid">Privacy Policy</a> and <a href="/terms" className="text-acid">Terms</a>.
          </span>
        </label>

        {err && (
          <div className="font-mono text-[11px] text-pink tracking-[0.06em]">{err}</div>
        )}

        <button
          onClick={confirm}
          disabled={status === "submitting"}
          style={{
            width: "100%",
            justifyContent: "center",
            border: 0,
            cursor: status === "submitting" ? "wait" : "pointer",
            opacity: ready || status === "submitting" ? 1 : 0.7,
          }}
          className="btn btn-lg"
        >
          {status === "submitting" ? "Confirming…" : "Confirm My Call →"}
        </button>
        <p className="font-mono text-[9px] text-muted tracking-[0.12em] text-center uppercase">
          · No charge to book · 45-minute strategy call ·
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[9.5px] font-bold tracking-[0.18em] uppercase text-ash mb-1.5">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acid)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line-2)")}
        className="w-full bg-bg border border-line-2 text-bone py-3 px-3.5 font-body text-[14.5px] rounded-lg outline-none box-border focus:border-acid"
      />
    </label>
  );
}
