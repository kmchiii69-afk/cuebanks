"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";

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
        className="absolute inset-0 bg-[rgba(0,0,0,0.82)] backdrop-blur-[10px]"
      />
      <div className="relative w-full max-w-[460px] bg-[#0a0d14] border border-[#2b333f] rounded-[14px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.7),0_0_0_1px_rgba(249,255,60,0.08)]">
        <div className="px-5 py-4 border-b border-[#2b333f] flex justify-between items-center">
          <span className="font-['Montserrat'] font-extrabold text-[11px] tracking-[0.22em] uppercase text-[#f9ff3c]">
            Free Training Access
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="bg-transparent border border-[#2b333f] text-[#9aa3b2] w-[30px] h-[30px] rounded-lg cursor-pointer text-[15px] leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="px-5 py-6 pb-6.5 flex flex-col gap-3.5">
          <h3 className="font-['Montserrat'] font-extrabold text-[22px] leading-[1.15] text-white m-0">
            Unlock all 5 lessons
          </h3>
          <p className="font-['Open_Sans'] text-[13.5px] leading-[1.5] text-[#9aa3b2] m-0 mb-1">
            Enter your details and the WSA Protocol training is yours — instant access, zero charge.
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <Field label="First name" required value={form.first_name} onChange={f("first_name")} disabled={dis} autoFocus />
            <Field label="Last name" value={form.last_name} onChange={f("last_name")} disabled={dis} />
          </div>
          <Field label="Email" type="email" required value={form.email} onChange={f("email")} disabled={dis} />
          <Field label="Phone" type="tel" value={form.phone} onChange={f("phone")} disabled={dis} />

          {status === "error" && (
            <div className="font-['Open_Sans'] text-[12.5px] text-[#e93d3d]">{errorMsg}</div>
          )}

          <button
            type="submit"
            disabled={dis}
            style={{
              opacity: dis ? 0.6 : 1,
              cursor: dis ? "default" : "pointer",
            }}
            className="mt-1 font-['Montserrat'] font-extrabold uppercase tracking-[0.06em] text-[15px] bg-[#f9ff3c] text-black px-6 py-4 border-0 rounded-lg transition-transform duration-150"
          >
            {dis ? "Sending…" : "Get Free Access →"}
          </button>
          <p className="font-['Times_New_Roman'] italic text-[11px] text-[#707070] text-center m-0">
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
      <span className="block font-['Montserrat'] text-[9.5px] font-bold tracking-[0.18em] uppercase text-[#707070] mb-1.5">
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
        className="w-full bg-[#111827] border border-[#2b333f] text-white py-3 px-3 font-['Open_Sans'] text-[14px] rounded-lg outline-none"
      />
    </label>
  );
}
