"use client";

import { useState } from "react";
import { wsa } from "@/components/wsa/theme";

/* Transactional-only SMS opt-in form for A2P 10DLC / TCR review.
   - ONE optional, UNCHECKED SMS checkbox (consent is NOT a condition).
   - Transactional-only language (no marketing / promo / coaching wording).
   - Self-contained; does not modify any existing project code. */

export default function SmsConsentForm() {
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "" });
  const [sms, setSms] = useState(false); // optional, unchecked by default
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const phoneOk = form.phone.replace(/\D/g, "").length >= 10;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!form.first.trim()) return setErr("Please enter your first name.");
    if (!emailOk) return setErr("Please enter a valid email.");
    if (!phoneOk) return setErr("Please enter a valid phone number.");
    // Best-effort record via the existing endpoint (unmodified); never blocks.
    try {
      await fetch("/api/callback-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first.trim(),
          last_name: form.last.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          sms_consent: sms,
        }),
      }).catch(() => {});
    } catch { /* ignore */ }
    setDone(true);
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((v) => ({ ...v, [k]: e.target.value }));

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: wsa.green2, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div style={{ fontFamily: wsa.fontH2, fontSize: 22, fontWeight: 800, color: wsa.white, marginBottom: 8 }}>You&rsquo;re all set</div>
        <p style={{ fontFamily: wsa.fontBody, fontSize: 14.5, lineHeight: 1.6, color: wsa.ash, margin: 0 }}>
          Thanks, {form.first.trim() || "there"}. {sms
            ? "You opted in to transactional text messages from Wall Street Academy. Reply STOP at any time to end, or HELP for help."
            : "We received your details. You did not opt in to text messages."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="sms-row">
        <Field label="First name" value={form.first} onChange={set("first")} placeholder="Jane" />
        <Field label="Last name" value={form.last} onChange={set("last")} placeholder="Trader" />
      </div>
      <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" />
      <Field label="Mobile phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" />

      {/* Optional, unchecked transactional-only SMS consent */}
      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer", background: wsa.panel, border: `1px solid ${wsa.line}`, borderRadius: 8, padding: "14px 16px" }}>
        <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} style={{ width: 18, height: 18, marginTop: 2, accentColor: wsa.yellow, flexShrink: 0 }} />
        <span style={{ fontFamily: wsa.fontBody, fontSize: 12.5, lineHeight: 1.6, color: wsa.ash }}>
          You agree to receive automated transactional text messages with varying frequency from Wall Street Academy
          (e.g., call confirmations/reminders). Msg &amp; data rates may apply. Reply <strong style={{ color: wsa.white }}>STOP</strong> to
          end. Text <strong style={{ color: wsa.white }}>HELP</strong> for help.{" "}
          Terms: <a href="https://cuebanks.vercel.app/terms" style={{ color: wsa.yellow }}>cuebanks.vercel.app/terms</a>{" "}
          Privacy: <a href="https://cuebanks.vercel.app/privacy" style={{ color: wsa.yellow }}>cuebanks.vercel.app/privacy</a>
        </span>
      </label>

      {err && <div style={{ fontFamily: wsa.fontBody, fontSize: 13, color: wsa.red }}>{err}</div>}

      <button type="submit" style={{ marginTop: 4, fontFamily: wsa.fontH2, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 15, background: wsa.yellow, color: "#000", padding: "16px 28px", border: "none", borderRadius: 8, cursor: "pointer" }}>
        Submit
      </button>
      <p style={{ fontFamily: wsa.fontAccent, fontStyle: "italic", fontSize: 12, color: wsa.muted, margin: 0, textAlign: "center" }}>
        The SMS checkbox is optional. Consent to texts is not a condition of any purchase or service.
      </p>
    </form>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontFamily: wsa.fontH2, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: wsa.muted, marginBottom: 7 }}>{label}</span>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={(e) => (e.currentTarget.style.borderColor = wsa.yellow)}
        onBlur={(e) => (e.currentTarget.style.borderColor = wsa.line)}
        style={{ width: "100%", background: wsa.panel, border: `1px solid ${wsa.line}`, color: wsa.white, padding: "13px 14px", fontFamily: wsa.fontBody, fontSize: 14.5, borderRadius: 8, outline: "none", boxSizing: "border-box" }} />
    </label>
  );
}
