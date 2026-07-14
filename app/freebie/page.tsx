"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const QUESTIONS = [
  "Walk me through reading a chart top-down before an entry. Where do most people get the read wrong?",
  "Ask me what my exact setup is — and if I can't say it clearly, tell me what that means about my consistency.",
  "When I take a loss I wanna win it back right away. What does that tell you about how much I actually trust my system?",
];
const LIMIT = QUESTIONS.length;

type Experience = "under_1y" | "1_3y" | "3_5y" | "5y_plus";

const EXPERIENCE_OPTIONS: { value: Experience; label: string }[] = [
  { value: "under_1y", label: "Under a year — still finding my feet" },
  { value: "1_3y", label: "1–3 years" },
  { value: "3_5y", label: "3–5 years" },
  { value: "5y_plus", label: "5+ years" },
];

// Personalized opener per experience bucket — this is what changes based on
// their answer, before they even see the 3 questions.
const EXPERIENCE_COPY: Record<Experience, string> = {
  under_1y:
    "You're under a year in. That means every habit you're building right now either sets you up or sets you back — most people don't find out which until it's too late.",
  "1_3y":
    "1 to 3 years in is where most traders quietly plateau. You've got enough experience to know it's not just bad luck, and not quite enough structure to fix it yet.",
  "3_5y":
    "3 to 5 years in — if something's still off, it's not inexperience anymore. It's a gap in your process you haven't found yet.",
  "5y_plus":
    "5+ years in, and if you're still here, it's not because you don't know forex. One specific piece hasn't clicked. Let's find out which one.",
};

type Answer = { question: string; content: string; streaming: boolean };
type Step = "experience" | "contact" | "chat";

const inputStyle: React.CSSProperties = {
  height: 46,
  background: "var(--bg-2)",
  border: "1px solid var(--line-2)",
  borderRadius: 6,
  padding: "0 14px",
  color: "var(--bone)",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

export default function FreebiePage() {
  const [step, setStep] = useState<Step>("experience");
  const [experience, setExperience] = useState<Experience | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState<string | undefined>("");
  const [email, setEmail] = useState("");
  const [optInLoading, setOptInLoading] = useState(false);
  const [optInError, setOptInError] = useState("");

  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [customQuestions, setCustomQuestions] = useState<Answer[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [customLoading, setCustomLoading] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [limitError, setLimitError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [answers, customQuestions]);

  function selectExperience(v: Experience) {
    setExperience(v);
    setStep("contact");
  }

  async function handleOptIn(e?: FormEvent) {
    e?.preventDefault();
    if (!name.trim() || !phone?.trim() || !email.trim() || !experience || optInLoading) return;
    setOptInLoading(true);
    setOptInError("");
    const [first_name, ...rest] = name.trim().split(/\s+/);
    const last_name = rest.join(" ");
    try {
      const res = await fetch("/api/freebie/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          phone: phone.trim(),
          email: email.trim(),
          experience,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        // Use the server's canonical email — if this phone/email was already
        // tied to an earlier opt-in, it may differ from what was just typed.
        setEmail(data.email ?? email.trim());
        setQuestionsAsked(data.questions_asked ?? 0);
        setStep("chat");
      } else {
        setOptInError(data.error || "Something went wrong");
      }
    } catch {
      setOptInError("Connection error");
    }
    setOptInLoading(false);
  }

  async function askQuestion(index: number) {
    if (answers[index] || questionsAsked >= LIMIT) return;
    const question = QUESTIONS[index];
    setAnswers((prev) => ({ ...prev, [index]: { question, content: "", streaming: true } }));
    setLimitError("");

    try {
      const res = await fetch("/api/freebie/cue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, question }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setLimitError(data.message || "You've used all 3 free questions.");
          setAnswers((prev) => {
            const copy = { ...prev };
            delete copy[index];
            return copy;
          });
        } else {
          setAnswers((prev) => ({ ...prev, [index]: { question, content: "Something went wrong. Try again.", streaming: false } }));
        }
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setAnswers((prev) => ({
          ...prev,
          [index]: { question, content: (prev[index]?.content ?? "") + chunk, streaming: true },
        }));
      }
      setAnswers((prev) => ({ ...prev, [index]: { question, content: prev[index]?.content ?? "", streaming: false } }));
      setQuestionsAsked((n) => n + 1);
    } catch {
      setAnswers((prev) => ({ ...prev, [index]: { question, content: "Connection error. Try again.", streaming: false } }));
    }
  }

  async function askCustomQuestion(e?: FormEvent) {
    e?.preventDefault();
    const question = customInput.trim();
    if (!question || questionsAsked >= LIMIT || customLoading) return;
    setCustomLoading(true);
    setCustomInput("");
    setLimitError("");
    const itemIndex = customQuestions.length;
    setCustomQuestions((prev) => [...prev, { question, content: "", streaming: true }]);

    function updateItem(patch: Partial<Answer>) {
      setCustomQuestions((prev) => {
        const copy = [...prev];
        copy[itemIndex] = { ...copy[itemIndex], ...patch };
        return copy;
      });
    }

    try {
      const res = await fetch("/api/freebie/cue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, question }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setLimitError(data.message || "You've used all 3 free questions.");
          setCustomQuestions((prev) => prev.slice(0, itemIndex));
        } else {
          updateItem({ content: "Something went wrong. Try again.", streaming: false });
        }
        setCustomLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let content = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        content += decoder.decode(value, { stream: true });
        updateItem({ content, streaming: true });
      }
      updateItem({ content, streaming: false });
      setQuestionsAsked((n) => n + 1);
    } catch {
      updateItem({ content: "Connection error. Try again.", streaming: false });
    }
    setCustomLoading(false);
  }

  const allAsked = questionsAsked >= LIMIT;
  const canSubmitContact = !!name.trim() && !!phone?.trim() && !!email.trim() && !!experience;

  return (
    <div className="grid-bg" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--bone)" }}>
      {/* HEADER */}
      <header style={{ borderBottom: "1px solid var(--line)", padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/wsa/home/1.png" alt="Wall Street Academy" style={{ height: 64, width: 64, borderRadius: "50%", objectFit: "cover" }} />
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          · Ask Cue AI · Free ·
        </div>
      </header>

      {/* HERO */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "56px 24px 32px", textAlign: "left" }}>
        {!experience ? (
          <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 18, lineHeight: 1.7, color: "var(--bone)", margin: 0, fontWeight: 500 }}>
            I need to understand you first so my second brain can actually help you.
          </p>
        ) : (
          <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 18, lineHeight: 1.7, color: "var(--bone)", margin: 0, fontWeight: 500 }}>
            {EXPERIENCE_COPY[experience]}
          </p>
        )}
      </section>

      <section style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 64px" }}>
        {step === "experience" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ash)", marginBottom: 4 }}>
              How long have you been trading forex?
            </div>
            {EXPERIENCE_OPTIONS.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => selectExperience(opt.value)}
                style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
                  background: "var(--bg-1)", border: "1px solid var(--line-2)", color: "var(--bone)",
                  textAlign: "left", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontSize: 15, lineHeight: 1.4, cursor: "pointer", transition: "border-color 160ms ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--acid)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--line-2)"; }}
              >
                <span style={{ width: 26, height: 26, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-2)", border: "1px solid var(--line-2)", color: "var(--ash)", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1 }}>{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === "contact" && (
          <form onSubmit={handleOptIn} style={{ border: "1px solid var(--line)", borderTop: "2px solid var(--acid)", background: "var(--bg-1)", padding: "28px 28px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--acid)" }}>
              Where should Cue send this?
            </div>
            <input placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} disabled={optInLoading} autoFocus style={inputStyle} />
            <div className="qc-phone-wrap">
              <PhoneInput
                international
                defaultCountry="US"
                value={phone}
                onChange={setPhone}
                disabled={optInLoading}
                placeholder="Phone"
              />
            </div>
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={optInLoading} style={inputStyle} />
            {optInError && <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--acid)", margin: 0 }}>{optInError}</p>}
            <button
              type="submit"
              disabled={!canSubmitContact || optInLoading}
              style={{
                height: 46, background: canSubmitContact ? "var(--acid)" : "var(--bg-2)", border: "none", borderRadius: 6,
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
                color: canSubmitContact ? "#fff" : "var(--muted)", cursor: canSubmitContact ? "pointer" : "not-allowed",
              }}
            >
              {optInLoading ? "· · ·" : "Unlock Cue AI"}
            </button>
            <button
              type="button"
              onClick={() => setStep("experience")}
              style={{ background: "none", border: "none", color: "var(--ash)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", cursor: "pointer", padding: 0, alignSelf: "flex-start" }}
            >
              ← back
            </button>
          </form>
        )}

        {step === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ash)" }}>
              {LIMIT - questionsAsked} of {LIMIT} free questions left · tap one
            </div>

            {QUESTIONS.map((q, i) => {
              const answer = answers[i];
              const disabled = allAsked && !answer;
              return (
                <div key={i} style={{ border: "1px solid var(--line)", background: "var(--bg-1)", borderRadius: 8, overflow: "hidden" }}>
                  <button
                    onClick={() => askQuestion(i)}
                    disabled={!!answer || disabled}
                    style={{
                      width: "100%", textAlign: "left", padding: "16px 18px", background: "none", border: "none",
                      color: "var(--bone)", fontSize: 14, lineHeight: 1.5, cursor: answer || disabled ? "default" : "pointer",
                      opacity: disabled ? 0.4 : 1,
                    }}
                  >
                    <span style={{ color: "var(--acid)", fontFamily: "var(--font-mono)", fontSize: 11, marginRight: 8 }}>{String(i + 1).padStart(2, "0")}</span>
                    {q}
                  </button>
                  {answer && (
                    <div style={{ padding: "0 18px 18px", borderTop: "1px solid var(--line)", marginTop: -1 }}>
                      <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 14, lineHeight: 1.7, color: "var(--ash)", whiteSpace: "pre-wrap", margin: "14px 0 0" }}>
                        {answer.content}
                        {answer.streaming && <span style={{ opacity: 0.4 }}>▍</span>}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {customQuestions.map((item, i) => (
              <div key={`custom-${i}`} style={{ border: "1px solid var(--line)", background: "var(--bg-1)", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ padding: "16px 18px", color: "var(--bone)", fontSize: 14, lineHeight: 1.5 }}>
                  <span style={{ color: "var(--acid)", fontFamily: "var(--font-mono)", fontSize: 11, marginRight: 8 }}>Q{i + 1}</span>
                  {item.question}
                </div>
                <div style={{ padding: "0 18px 18px", borderTop: "1px solid var(--line)", marginTop: -1 }}>
                  <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 14, lineHeight: 1.7, color: "var(--ash)", whiteSpace: "pre-wrap", margin: "14px 0 0" }}>
                    {item.content}
                    {item.streaming && <span style={{ opacity: 0.4 }}>▍</span>}
                  </p>
                </div>
              </div>
            ))}

            {!allAsked && (
              <form onSubmit={askCustomQuestion} style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  placeholder="Or type your own question…"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  disabled={customLoading}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="submit"
                  disabled={!customInput.trim() || customLoading}
                  style={{
                    flexShrink: 0, height: 46, padding: "0 20px",
                    background: customInput.trim() ? "var(--acid)" : "var(--bg-2)", border: "none", borderRadius: 6,
                    fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                    color: customInput.trim() ? "#fff" : "var(--muted)", cursor: customInput.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  Ask
                </button>
              </form>
            )}

            {limitError && <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--acid)", margin: 0 }}>{limitError}</p>}

            {allAsked && (
              <div style={{ border: "1px solid var(--acid)", background: "rgba(37,99,235,0.06)", borderRadius: 8, padding: "22px 22px", textAlign: "center", marginTop: 4 }}>
                <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 15, color: "var(--bone)", margin: "0 0 16px", lineHeight: 1.6 }}>
                  That&rsquo;s the surface. Inside the Inner Circle you get the full system, not 3 questions&rsquo; worth.
                </p>
                <a
                  href="/ig"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify({ email })], { type: "application/json" });
                    navigator.sendBeacon("/api/freebie/cta-click", blob);
                  }}
                  style={{ display: "inline-block", background: "var(--acid)", color: "#fff", textDecoration: "none", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "14px 32px", borderRadius: 6 }}
                >
                  I Want To Work With Cue 1-1 →
                </a>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "24px 48px", textAlign: "center", fontSize: 12, color: "var(--ash)", display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <span>© {new Date().getFullYear()} Wall Street Academy LLC. All rights reserved.</span>
        <span style={{ opacity: 0.3 }}>·</span>
        <a href="/tos" style={{ color: "var(--ash)", textDecoration: "underline", textUnderlineOffset: 3 }}>Terms of Service</a>
      </footer>
    </div>
  );
}
