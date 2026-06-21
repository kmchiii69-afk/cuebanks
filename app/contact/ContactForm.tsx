"use client";

import { useState } from "react";
import { wsa } from "@/components/wsa/theme";

// Where contact submissions are sent. The form opens the visitor's email client
// pre-filled (no backend required). TODO: set this to Cue's real support inbox.
export const SUPPORT_EMAIL = "support@cuebanks.com";

const TOPICS = [
  "General question",
  "Program & application",
  "Billing & refunds",
  "Technical / account access",
  "Partnerships & media",
  "Something else",
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [touched, setTouched] = useState(false);

  const valid = form.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.message.trim();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    const subject = `[WSA Contact] ${form.topic} — ${form.name.trim()}`;
    const body = `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\nTopic: ${form.topic}\n\n${form.message.trim()}\n`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((v) => ({ ...v, [k]: e.target.value }));

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="ct-row">
        <Field label="Your name" required value={form.name} onChange={set("name")} placeholder="Jane Trader" />
        <Field label="Email" type="email" required value={form.email} onChange={set("email")} placeholder="you@email.com" />
      </div>

      <label style={{ display: "block" }}>
        <Lbl>Topic</Lbl>
        <select value={form.topic} onChange={set("topic")} style={selectStyle}>
          {TOPICS.map((t) => <option key={t} value={t} style={{ background: wsa.panel }}>{t}</option>)}
        </select>
      </label>

      <label style={{ display: "block" }}>
        <Lbl>Message *</Lbl>
        <textarea
          value={form.message}
          onChange={set("message")}
          rows={6}
          placeholder="How can we help?"
          style={{ ...inputStyle, resize: "vertical", minHeight: 130 }}
        />
      </label>

      {touched && !valid && (
        <div style={{ fontFamily: wsa.fontBody, fontSize: 13, color: wsa.red }}>
          Please add your name, a valid email, and a message.
        </div>
      )}

      <button
        type="submit"
        style={{
          marginTop: 4, fontFamily: wsa.fontH2, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: "0.06em", fontSize: 15, background: wsa.yellow, color: "#000",
          padding: "16px 28px", border: "none", borderRadius: 8, cursor: "pointer",
        }}
      >
        Send Message →
      </button>
      <p style={{ fontFamily: wsa.fontAccent, fontStyle: "italic", fontSize: 12, color: wsa.muted, margin: 0 }}>
        This opens your email app with the message pre-filled. Prefer email? Write us directly at{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: wsa.yellow }}>{SUPPORT_EMAIL}</a>.
      </p>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: wsa.panel, border: `1px solid ${wsa.line}`, color: wsa.white,
  padding: "13px 14px", fontFamily: wsa.fontBody, fontSize: 14.5, borderRadius: 8, outline: "none", boxSizing: "border-box",
};
const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "none", cursor: "pointer" };

function Lbl({ children }: { children: React.ReactNode }) {
  return <span style={{ display: "block", fontFamily: wsa.fontH2, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: wsa.muted, marginBottom: 7 }}>{children}</span>;
}

function Field({ label, value, onChange, type = "text", required, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label style={{ display: "block" }}>
      <Lbl>{label}{required ? " *" : ""}</Lbl>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        onFocus={(e) => (e.currentTarget.style.borderColor = wsa.yellow)}
        onBlur={(e) => (e.currentTarget.style.borderColor = wsa.line)}
        style={inputStyle} />
    </label>
  );
}
