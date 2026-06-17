"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";

/**
 * WSA-branded lead-capture modal. Posts to the SAME backend the original
 * free-course flow used (POST /api/free-course) and redirects to the broker
 * step on success — backend and routing behavior unchanged.
 */
export default function LeadCaptureModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setForm({ first_name: "", last_name: "", email: "", phone: "" });
        setStatus("idle");
        setErrorMsg("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/free-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      posthog.identify(form.email.trim(), { first_name: form.first_name.trim(), email: form.email.trim() });
      posthog.capture("free_course_submitted", { first_name: form.first_name.trim(), email: form.email.trim() });
      // Same redirect logic as the original SignupModal (free. subdomain vs direct).
      const brokerPath =
        typeof window !== "undefined" && window.location.hostname.includes("free.")
          ? "/broker"
          : "/free-course/broker";
      window.location.href = brokerPath;
    } catch {
      setErrorMsg("Network error. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (!open) return null;

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((v) => ({ ...v, [k]: e.target.value }));
  const dis = status === "submitting";

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }} onClick={onClose} />
      <div
        style={{
          position: "relative", width: "100%", maxWidth: 460,
          background: "#0a0d14", border: "1px solid #2b333f", borderRadius: 14,
          boxShadow: "0 30px 90px rgba(0,0,0,0.7), 0 0 0 1px rgba(249,255,60,0.08)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #2b333f", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#f9ff3c" }}>
            Free Training Access
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "transparent", border: "1px solid #2b333f", color: "#9aa3b2", width: 30, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 15, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} style={{ padding: "24px 22px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 22, lineHeight: 1.15, color: "#fff", margin: 0 }}>
            Unlock all 5 lessons
          </h3>
          <p style={{ fontFamily: "'Open Sans',sans-serif", fontSize: 13.5, lineHeight: 1.5, color: "#9aa3b2", margin: "0 0 4px" }}>
            Enter your details and the WSA Protocol training is yours — instant access, zero charge.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="First name" required value={form.first_name} onChange={f("first_name")} disabled={dis} autoFocus />
            <Field label="Last name" value={form.last_name} onChange={f("last_name")} disabled={dis} />
          </div>
          <Field label="Email" type="email" required value={form.email} onChange={f("email")} disabled={dis} />
          <Field label="Phone" type="tel" value={form.phone} onChange={f("phone")} disabled={dis} />

          {status === "error" && (
            <div style={{ fontFamily: "'Open Sans',sans-serif", fontSize: 12.5, color: "#e93d3d" }}>{errorMsg}</div>
          )}

          <button
            type="submit"
            disabled={dis}
            style={{
              marginTop: 4, fontFamily: "'Montserrat',sans-serif", fontWeight: 800, textTransform: "uppercase",
              letterSpacing: "0.06em", fontSize: 15, background: "#f9ff3c", color: "#000",
              padding: "16px 24px", border: "none", borderRadius: 8, cursor: dis ? "default" : "pointer",
              opacity: dis ? 0.6 : 1, transition: "transform .15s ease",
            }}
          >
            {dis ? "Sending…" : "Get Free Access →"}
          </button>
          <p style={{ fontFamily: "'Times New Roman',serif", fontStyle: "italic", fontSize: 11, color: "#707070", textAlign: "center", margin: 0 }}>
            We respect your inbox. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required, disabled, autoFocus,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontFamily: "'Montserrat',sans-serif", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#707070", marginBottom: 6 }}>
        {label}{required ? " *" : ""}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        style={{
          width: "100%", background: "#111827", border: "1px solid #2b333f", color: "#fff",
          padding: "12px 13px", fontFamily: "'Open Sans',sans-serif", fontSize: 14, borderRadius: 8, outline: "none",
        }}
      />
    </label>
  );
}
