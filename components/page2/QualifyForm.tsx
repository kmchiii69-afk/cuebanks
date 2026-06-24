"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";
import { useRouter, useSearchParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────

type ChoiceOption = { value: string; label: string };

type ChoiceQuestion = {
  id: string;
  type: "choice";
  label: string;
  helper?: string;
  options: ChoiceOption[];
};

type TextQuestion = {
  id: string;
  type: "text";
  label: string;
  helper?: string;
  placeholder?: string;
  longform?: boolean;
  inputType?: "email" | "tel" | "text";
  optional?: boolean;
};

type Question = ChoiceQuestion | TextQuestion;
type Answers = Record<string, string>;

// ─── Question Definitions ─────────────────────────────────────────

const Q_NAME: TextQuestion = {
  id: "contact_name",
  type: "text",
  label: "First, who am I talking to?",
  helper: "Drop your name so this doesn't feel like a form",
  placeholder: "First and last name",
};

const Q_EMAIL: TextQuestion = {
  id: "contact_email",
  type: "text",
  label: "Best email to reach you?",
  helper: "This is where my team sends your call details if it's a fit",
  placeholder: "your@email.com",
  inputType: "email",
};

const Q_PHONE: TextQuestion = {
  id: "contact_phone",
  type: "text",
  label: "And your phone number?",
  helper: "Include your country code — no spam, just your booking confirmation",
  placeholder: "+1 234 567 8900",
  inputType: "tel",
};

const Q_PATH: ChoiceQuestion = {
  id: "path_fork",
  type: "choice",
  label: "Are you actively trading right now, or still getting into it?",
  options: [
    { value: "active", label: "Yes — I'm actively trading" },
    { value: "learning", label: "Not yet — I'm trying to get into forex and learning" },
  ],
};

// ── Path A: Active Trader ─────────────────────────────────────────

const QA1: ChoiceQuestion = {
  id: "a_length",
  type: "choice",
  label: "How long have you been trading?",
  options: [
    { value: "under_1y", label: "Under a year — still finding my feet" },
    { value: "1_3y", label: "1–3 years" },
    { value: "3_5y", label: "3–5 years" },
    { value: "5y_plus", label: "5+ years" },
  ],
};

const QA2: ChoiceQuestion = {
  id: "a_stuck",
  type: "choice",
  label: "Where are you actually stuck right now?",
  options: [
    { value: "inconsistent", label: "I have wins but I can't make them repeatable — it's inconsistent" },
    { value: "breakeven", label: "I'm stuck around break-even and can't push past it" },
    { value: "psychology", label: "My strategy's fine but my psychology / discipline is the problem" },
    { value: "scale", label: "I'm profitable but want structure to scale up safely" },
  ],
};

const QA3: TextQuestion = {
  id: "a_real_reason",
  type: "text",
  longform: true,
  label: "When you're honest with yourself, what's the real reason you're not where you want to be yet?",
  helper: "One or two sentences. Be straight with me.",
  placeholder: "\"I don't fully trust my own analysis\" or \"I keep blowing it on revenge trades\"...",
};

const QA4: TextQuestion = {
  id: "a_change",
  type: "text",
  longform: true,
  label: "If you fixed that and got to genuinely consistent over the next 6–12 months, what would actually change for you?",
  placeholder: "What opens up when trading stops being a problem...",
};

const QA5: ChoiceQuestion = {
  id: "a_time",
  type: "choice",
  label: "How much focused time can you put in each day?",
  options: [
    { value: "under_1h", label: "Less than an hour" },
    { value: "1_2h", label: "1–2 hours a day" },
    { value: "2_3h", label: "2–3 hours a day" },
    { value: "all_in", label: "As much as it takes — I'm all in on this" },
  ],
};

// ── Path B: Getting Into Forex ────────────────────────────────────

const QB1: TextQuestion = {
  id: "b_pull",
  type: "text",
  longform: true,
  label: "What is it about forex specifically that's pulling you in?",
  helper: "Be real with me — what made you want this, not crypto, not stocks?",
  placeholder: "One or two sentences...",
};

const QB2: ChoiceQuestion = {
  id: "b_stage",
  type: "choice",
  label: "How far along are you?",
  options: [
    { value: "just_curious", label: "Just curious — haven't really started learning yet" },
    { value: "studying", label: "I've been studying / watching but haven't placed a real trade" },
    { value: "few_trades", label: "I've made a few trades on a small or demo account" },
    { value: "ready", label: "I'm right on the edge of going for it for real" },
  ],
};

const QB3: TextQuestion = {
  id: "b_blocking",
  type: "text",
  longform: true,
  label: "What's actually been stopping you from going all-in on it?",
  helper: "The honest reason",
  placeholder: "\"I don't know where to start\", \"I'm scared to lose money\", \"I keep starting and stopping\"...",
};

const QB4: ChoiceQuestion = {
  id: "b_time",
  type: "choice",
  label: "How much focused time can you put in each day to learn it properly?",
  options: [
    { value: "under_1h", label: "Less than an hour" },
    { value: "1_2h", label: "1–2 hours a day" },
    { value: "2_3h", label: "2–3 hours a day" },
    { value: "all_in", label: "As much as it takes — I'm all in on this" },
  ],
};

// ── Both Paths ────────────────────────────────────────────────────

const Q_ACCESS: ChoiceQuestion = {
  id: "access_level",
  type: "choice",
  label: "How do you want to work with me inside the Inner Circle?",
  options: [
    { value: "standard", label: "Give me the roadmap + the group — I'll do the reps with the community and live calls" },
    { value: "1on1", label: "I want you working with me directly, 1-on-1 — the highest level of access" },
  ],
};

const Q_BUDGET_STANDARD: ChoiceQuestion = {
  id: "investment_tier",
  type: "choice",
  label: "Picture 6 months from now — you've got the structure and you're trading with consistency. To get there with my direct guidance, how much are you genuinely ready to invest in yourself right now?",
  helper: "Only include funds you currently have available or can access via credit card / financing",
  options: [
    { value: "under_5k", label: "Under $5,000" },
    { value: "5k_7500", label: "$5,000 – $7,500" },
    { value: "7500_12k", label: "$7,500 – $12,000" },
    { value: "12k_plus", label: "$12,000+" },
  ],
};

const Q_BUDGET_1ON1: ChoiceQuestion = {
  id: "investment_tier",
  type: "choice",
  label: "Working with me directly, 1-on-1, is the highest-touch thing I offer and there are only a handful of spots. I need to know it's a real commitment. How much are you ready to invest in yourself for direct access?",
  helper: "Only include funds you currently have available or can access via credit card / financing",
  options: [
    { value: "under_10k", label: "Under $10,000" },
    { value: "10k_15k", label: "$10,000 – $15,000" },
    { value: "15k_20k", label: "$15,000 – $20,000" },
    { value: "20k_plus", label: "$20,000+" },
  ],
};

// ─── ICP Routing ──────────────────────────────────────────────────

export type RouteDecision =
  | "call_group"          // Standard $5K+ → group call ($7,500)
  | "call_1on1"           // 1-on-1 $10K+ → premium call ($15,000)
  | "call_group_stepdown" // 1-on-1 under $10K → redirect to group call
  | "free_funnel"         // Under budget or beginner → free course
  | "manual_review";      // Path B + 1-on-1 + real budget → flag for team

export function computeRoute(answers: Answers): RouteDecision {
  const { path_fork, b_stage, access_level, investment_tier } = answers;

  // B path beginners → free funnel
  if (path_fork === "learning" && (b_stage === "just_curious" || b_stage === "studying")) {
    return "free_funnel";
  }

  // Standard under $5K → free funnel
  if (access_level === "standard" && investment_tier === "under_5k") {
    return "free_funnel";
  }

  // 1-on-1 under $10K → step down to group call
  if (access_level === "1on1" && investment_tier === "under_10k") {
    return "call_group_stepdown";
  }

  // Path B (C/D) + 1-on-1 + real budget → manual review before routing to premium
  if (path_fork === "learning" && access_level === "1on1" && investment_tier && investment_tier !== "under_10k") {
    return "manual_review";
  }

  // Standard bands B-D → group call
  if (access_level === "standard") {
    return "call_group";
  }

  // 1-on-1 bands B-D → premium call
  return "call_1on1";
}

// ─── Validation ───────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isComplete(q: Question, value: string): boolean {
  if (q.type === "text" && q.optional) return true;
  if (!value || value.trim() === "") return false;
  if (q.id === "contact_email") return EMAIL_RE.test(value.trim());
  return true;
}

// ─── Free Funnel Closing Screen ───────────────────────────────────

function FreeFunnelScreen({ firstName }: { firstName: string }) {
  const router = useRouter();

  useEffect(() => {
    const id = window.setTimeout(() => {
      router.replace("/free-course");
    }, 4200);
    return () => window.clearTimeout(id);
  }, [router]);

  return (
    <div style={{ textAlign: "center", padding: "48px 0 32px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 28 }}>
        · Got it ·
      </div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 38, lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--bone)", margin: "0 0 20px" }}>
        {firstName ? `${firstName}, I want to make sure you get value.` : "I want to make sure you get value."}
      </h2>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.65, color: "var(--ash)", maxWidth: 500, margin: "0 auto 36px" }}>
        Based on where you&rsquo;re at right now, I&rsquo;ve got a free course that&rsquo;ll get you moving in the right direction. Start here — and when the timing&rsquo;s right, the door&rsquo;s open.
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--ash)", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" }}>
        <span className="pulse" style={{ width: 6, height: 6, background: "var(--acid)", display: "inline-block" }} />
        Taking you there now...
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function QualifyForm({ source = "direct" }: { source?: string }) {
  const router = useRouter();
  const sp = useSearchParams();

  const urlEmail = useMemo(() => sp.get("email") || "", [sp]);
  const urlFirst = useMemo(() => sp.get("first_name") || "", [sp]);
  const urlLast = useMemo(() => sp.get("last_name") || "", [sp]);
  const urlPhone = useMemo(() => sp.get("phone") || "", [sp]);

  const [rawStep, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => {
    const init: Answers = {};
    const fullName = [urlFirst, urlLast].filter(Boolean).join(" ");
    if (fullName) init["contact_name"] = fullName;
    if (urlEmail) init["contact_email"] = urlEmail;
    if (urlPhone) init["contact_phone"] = urlPhone;
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [earlyExit, setEarlyExit] = useState<"free_funnel" | null>(null);
  const startedRef = useRef(false);

  // ── Dynamic question list ──────────────────────────────────────
  const questions = useMemo((): Question[] => {
    const list: Question[] = [Q_NAME, Q_EMAIL, Q_PHONE, Q_PATH];

    const path = answers["path_fork"];
    const bStage = answers["b_stage"];
    const access = answers["access_level"];

    if (path === "active") {
      list.push(QA1, QA2, QA3, QA4, QA5);
    } else if (path === "learning") {
      list.push(QB1, QB2);
      if (bStage === "few_trades" || bStage === "ready") {
        list.push(QB3, QB4);
      }
    }

    // Access + budget after path-specific questions
    const showFinal =
      path === "active" ||
      (path === "learning" && (bStage === "few_trades" || bStage === "ready"));

    if (showFinal) {
      list.push(Q_ACCESS);
      if (access === "standard") list.push(Q_BUDGET_STANDARD);
      else if (access === "1on1") list.push(Q_BUDGET_1ON1);
    }

    return list;
  }, [answers]);

  const total = questions.length;
  const step = Math.min(rawStep, total - 1);
  const q = questions[step];
  const value = answers[q.id] ?? "";
  const filled = isComplete(q, value);
  const progress = ((step + (filled ? 1 : 0.4)) / Math.max(total, 1)) * 100;

  const setAnswer = useCallback((id: string, v: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      posthog.capture("qualify_form_started");
    }
    setAnswers((prev) => ({ ...prev, [id]: v }));
  }, []);

  const submit = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      const fullName = (answers["contact_name"] || [urlFirst, urlLast].filter(Boolean).join(" ")).trim();
      const parts = fullName.split(" ");
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ");
      const email = (answers["contact_email"] || urlEmail).trim().toLowerCase();
      const phone = answers["contact_phone"] || urlPhone;

      const payloadAnswers: Answers = {};
      for (const [k, v] of Object.entries(answers)) {
        if (!k.startsWith("contact_")) payloadAnswers[k] = v;
      }

      const res = await fetch("/api/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone, answers: payloadAnswers }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      const route = computeRoute(answers);
      if (email) posthog.identify(email, { email, first_name: firstName });
      posthog.capture("qualify_form_submitted", {
        path_fork: answers["path_fork"],
        access_level: answers["access_level"],
        investment_tier: answers["investment_tier"],
        routing: route,
        source,
      });

      const params = new URLSearchParams();
      params.set("route", route);
      if (firstName) params.set("first_name", firstName);
      if (lastName) params.set("last_name", lastName);
      if (email) params.set("email", email);
      if (phone) params.set("phone", phone);

      router.push(`/qualified?${params.toString()}`);
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }, [answers, urlFirst, urlLast, urlEmail, urlPhone, router]);

  const goNext = useCallback(() => {
    if (!filled) return;
    if (step < total - 1) {
      setDirection("forward");
      setStep(step + 1);
    } else {
      submit();
    }
  }, [filled, step, total, submit]);

  const goBack = useCallback(() => {
    if (step === 0) return;
    setDirection("back");
    setStep(step - 1);
  }, [step]);

  // Auto-advance choice questions + early exit detection
  useEffect(() => {
    if (q.type !== "choice" || !filled) return;
    const id = window.setTimeout(() => {
      if (q.id === "b_stage" && (value === "just_curious" || value === "studying")) {
        posthog.capture("qualify_early_exit", { b_stage: value });
        setEarlyExit("free_funnel");
        return;
      }
      if (step < total - 1) {
        setDirection("forward");
        setStep((s) => (s === step ? s + 1 : s));
      }
    }, 320);
    return () => window.clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, q.type, q.id, step, total]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "textarea") return;
      if (e.key === "Enter" && tag !== "input") { e.preventDefault(); goNext(); }
      else if (e.key === "ArrowLeft" && tag !== "input") { e.preventDefault(); goBack(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goBack]);

  // ── Early exit screen ──────────────────────────────────────────
  if (earlyExit === "free_funnel") {
    const fullName = answers["contact_name"] || urlFirst;
    const firstName = fullName.split(" ")[0] || "";
    return <FreeFunnelScreen firstName={firstName} />;
  }

  const isFinal = step === total - 1;
  const slideOffset = direction === "forward" ? 14 : -14;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Progress */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--ash)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            · Question {step + 1} of {total} ·
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            {Math.round(progress)}%
          </div>
        </div>
        <div style={{ width: "100%", height: 3, background: "var(--line)", overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "var(--acid)", transition: "width 280ms cubic-bezier(0.2,0.8,0.2,1)", boxShadow: "0 0 18px rgba(249,255,60,0.5)" }} />
        </div>
      </div>

      {/* Question */}
      <div
        key={`${q.id}-${step}`}
        style={{ animation: `qcSlideIn 320ms cubic-bezier(0.2,0.8,0.2,1) both` }}
      >
        <style>{`@keyframes qcSlideIn { from { opacity: 0; transform: translateY(${slideOffset}px); } to { opacity: 1; transform: translateY(0); } }`}</style>

        {q.helper && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--ash)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 12 }}>
            · {q.helper}
          </div>
        )}

        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 34, lineHeight: 1.1, letterSpacing: "-0.025em", color: "var(--bone)", margin: "0 0 28px" }}>
          {q.label}
        </h2>

        {q.type === "choice" && (
          <ChoiceView question={q} value={value} onSelect={(v) => setAnswer(q.id, v)} />
        )}
        {q.type === "text" && (
          <TextView question={q} value={value} onChange={(v) => setAnswer(q.id, v)} onEnter={goNext} />
        )}
      </div>

      {/* Error */}
      {error && (
        <div role="alert" style={{ padding: "12px 16px", background: "rgba(255,45,171,0.10)", border: "1px solid var(--pink)", color: "var(--bone)", fontFamily: "var(--font-body)", fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 28, borderTop: "1px solid var(--line)" }}>
        <button
          onClick={goBack}
          disabled={step === 0 || submitting}
          style={{
            padding: "12px 18px",
            background: "transparent",
            border: "1px solid var(--line-2)",
            color: step === 0 ? "var(--muted)" : "var(--bone)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            cursor: step === 0 ? "default" : "pointer",
            opacity: step === 0 ? 0.4 : 1,
          }}
        >
          ← Back
        </button>

        <button
          onClick={goNext}
          disabled={!filled || submitting}
          style={{
            padding: isFinal ? "16px 26px" : "14px 22px",
            background: filled ? "var(--acid)" : "var(--bg-2)",
            border: 0,
            color: filled ? "var(--bg)" : "var(--muted)",
            fontFamily: "var(--font-mono)",
            fontSize: isFinal ? 13 : 12,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: filled && !submitting ? "pointer" : "default",
            boxShadow: filled ? "0 0 0 1px var(--acid), 0 0 32px rgba(249,255,60,0.25)" : "none",
            transition: "all 200ms ease",
          }}
        >
          {submitting ? "Submitting..." : isFinal ? "Submit Application →" : "Next →"}
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
        <span>· Enter to advance ·</span>
        <span>· ← back ·</span>
      </div>

      {isFinal && (
        <p style={{ marginTop: 4, fontFamily: "var(--font-body)", fontSize: 11, lineHeight: 1.55, color: "var(--muted)", textAlign: "center", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
          By submitting, you agree to be contacted by Wall Street Academy via email, SMS, or phone about our services. Message + data rates may apply. See our{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ash)", textDecoration: "underline" }}>Privacy Policy</a>.
        </p>
      )}
    </div>
  );
}

// ─── Choice View ──────────────────────────────────────────────────

function ChoiceView({
  question,
  value,
  onSelect,
}: {
  question: ChoiceQuestion;
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {question.options.map((opt, i) => {
        const selected = value === opt.value;
        const letter = String.fromCharCode(65 + i);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 20px",
              background: selected ? "rgba(249,255,60,0.08)" : "var(--bg-1)",
              border: `1px solid ${selected ? "var(--acid)" : "var(--line-2)"}`,
              color: "var(--bone)",
              textAlign: "left",
              fontFamily: "var(--font-body)",
              fontSize: 16,
              lineHeight: 1.4,
              cursor: "pointer",
              transition: "all 160ms ease",
              boxShadow: selected ? "0 0 0 1px var(--acid), 0 0 32px rgba(249,255,60,0.15)" : "none",
            }}
            onMouseEnter={(e) => {
              if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--acid)";
            }}
            onMouseLeave={(e) => {
              if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--line-2)";
            }}
          >
            <span
              aria-hidden
              style={{
                width: 28,
                height: 28,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: selected ? "var(--acid)" : "var(--bg-2)",
                border: `1px solid ${selected ? "var(--acid)" : "var(--line-2)"}`,
                color: selected ? "var(--bg)" : "var(--ash)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              {selected ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--bg)" strokeWidth="2.4">
                  <polyline points="3,7 6,10 11,4" />
                </svg>
              ) : (
                letter
              )}
            </span>
            <span style={{ flex: 1 }}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Text View ────────────────────────────────────────────────────

function TextView({
  question,
  value,
  onChange,
  onEnter,
}: {
  question: TextQuestion;
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
}) {
  if (question.longform) {
    return (
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder || ""}
        autoFocus
        style={{
          width: "100%",
          background: "var(--bg-1)",
          border: "1px solid var(--line-2)",
          color: "var(--bone)",
          padding: "16px 20px",
          fontFamily: "var(--font-body)",
          fontSize: 16,
          lineHeight: 1.55,
          outline: "none",
          resize: "vertical",
          borderRadius: 0,
          boxSizing: "border-box",
        }}
        maxLength={2000}
      />
    );
  }
  return (
    <input
      type={question.inputType || "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder || ""}
      autoFocus
      maxLength={500}
      onKeyDown={(e) => {
        if (e.key === "Enter") { e.preventDefault(); onEnter(); }
      }}
      style={{
        width: "100%",
        background: "var(--bg-1)",
        border: "1px solid var(--line-2)",
        color: "var(--bone)",
        padding: "16px 20px",
        fontFamily: "var(--font-body)",
        fontSize: 16,
        outline: "none",
        borderRadius: 0,
        boxSizing: "border-box",
      }}
    />
  );
}
