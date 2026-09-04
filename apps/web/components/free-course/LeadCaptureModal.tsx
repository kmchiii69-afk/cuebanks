"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";

/**
 * WSA-branded lead-capture modal. Posts to /api/free-course (same backend the
 * legacy free-course funnel used) and redirects to the broker step on success.
 */
export default function LeadCaptureModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Reset the form shortly after close — gives the close animation time to finish
  // before wiping state, so any in-flight field doesn't flash back to "empty" while
  // the modal is still fading.
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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
      // Same redirect logic as the legacy free-course funnel (free.* subdomain → /broker;
      // direct domain → /free-course/broker). Keeps history identical to the old flow.
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
    >
      <div
        onClick={onClose}
        aria-hidden
        className="absolute inset-0 bg-[rgba(0,0,0,0.82)] backdrop-blur-[10px]"
      />
      <div className="relative w-full max-w-[460px] rounded-[14px] border border-[var(--line-2)] bg-[var(--bg-1)] shadow-[0_30px_90px_rgba(0,0,0,0.7),0_0_0_1px_rgba(var(--acid-rgb),0.08)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--line-2)] px-5 py-4">
          <span className="font-mono text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--acid)]">
            Free Training Access
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-lg border border-[var(--line-2)] bg-transparent text-[15px] leading-none text-[var(--ash)]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3.5 px-5 pb-[26px] pt-6">
          <h3 className="m-0 font-display text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[var(--bone)]">
            Unlock all 5 lessons
          </h3>
          <p className="m-0 mb-1 text-[13.5px] leading-[1.5] text-[var(--ash)]">
            Enter your details and the WSA Protocol training is yours — instant access, zero charge.
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <Field label="First name" required value={form.first_name} onChange={f("first_name")} disabled={dis} autoFocus />
            <Field label="Last name" value={form.last_name} onChange={f("last_name")} disabled={dis} />
          </div>
          <Field label="Email" type="email" required value={form.email} onChange={f("email")} disabled={dis} />
          <Field label="Phone" type="tel" value={form.phone} onChange={f("phone")} disabled={dis} />

          {status === "error" ? (
            <div className="text-[12.5px] text-[var(--pink)]">{errorMsg}</div>
          ) : null}

          <button
            type="submit"
            disabled={dis}
            style={{
              opacity: dis ? 0.6 : 1,
              cursor: dis ? "default" : "pointer",
            }}
            className="mt-1 rounded-lg border-0 bg-[var(--acid)] px-6 py-4 font-mono text-[15px] font-extrabold uppercase tracking-[0.06em] text-[var(--primary-foreground)] transition-transform duration-150"
          >
            {dis ? "Sending…" : "Get Free Access →"}
          </button>
          <p className="m-0 text-center font-serif text-[11px] italic text-[var(--muted)]">
            We respect your inbox. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  disabled,
  autoFocus,
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
    <label className="block">
      <span className="mb-1.5 block font-mono text-[9.5px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        className="w-full rounded-lg border border-[var(--line-2)] bg-[var(--bg-2)] px-3 py-3 font-body text-[14px] text-[var(--bone)] outline-none focus:border-[var(--acid)]"
      />
    </label>
  );
}
