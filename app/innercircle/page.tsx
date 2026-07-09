"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tier = "basic" | "standard" | "premium";

const NAV_SECTIONS = [
  { id: "cover",      label: "Overview" },
  { id: "who",        label: "Who It's For" },
  { id: "problem",    label: "The Problem" },
  { id: "quillan",    label: "Quillan Black" },
  { id: "wins",       label: "Student Wins" },
  { id: "proof",      label: "The Receipts" },
  { id: "included",   label: "What's Inside" },
  { id: "roadmap",    label: "The Roadmap" },
  { id: "calls",      label: "Weekly Webinars" },
  { id: "cue-ai",     label: "Cue AI" },
  { id: "investment", label: "Investment" },
];

const STUDENT_WIN_IMGS = [
  { src: "/wsa/home/11.jpg", label: "Doubled account today" },
  { src: "/wsa/home/12.jpg", label: "$6,429" },
  { src: "/wsa/home/13.jpg", label: "$5K ×4" },
  { src: "/wsa/home/14.jpg", label: "$35,400 on US30" },
  { src: "/wsa/home/15.jpg", label: "FTMO $56,281" },
  { src: "/wsa/home/16.jpg", label: "15 racks for the day" },
  { src: "/wsa/home/17.jpg", label: "Made money while asleep" },
  { src: "/wsa/home/18.jpg", label: "$12,433 on US30" },
  { src: "/wsa/home/19.jpg", label: "Monthly salary in 1 hr" },
  { src: "/wsa/home/20.jpg", label: "First car from trading" },
];

const CUE_WIN_IMGS = [
  { src: "/wsa/cue-wins/2.jpg",  label: "$10,299" },
  { src: "/wsa/cue-wins/3.jpg",  label: "$31,464" },
  { src: "/wsa/cue-wins/4.jpg",  label: "$29,703" },
  { src: "/wsa/cue-wins/5.jpg",  label: "$16,068" },
  { src: "/wsa/cue-wins/6.jpg",  label: "$28,790" },
  { src: "/wsa/cue-wins/9.jpg",  label: "$46,800" },
];

function WinMarquee({ images, reverse, height = 160 }: { images: typeof STUDENT_WIN_IMGS; reverse?: boolean; height?: number }) {
  const doubled = [...images, ...images];
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div style={{
        display: "flex", gap: 10, width: "max-content",
        animation: `ticker ${reverse ? "38s" : "30s"} linear infinite ${reverse ? "reverse" : ""}`,
      }}>
        {doubled.map((img, i) => (
          <div key={i} style={{ flexShrink: 0, height, width: "auto", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.label} style={{ height: "100%", width: "auto", display: "block", objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const PHASES = [
  { num: "01", weeks: "Wk 1–2",   title: "Foundation & Mindset",    desc: "Risk management, platform setup, psychology. The most important phase. You don't start Phase 2 without this locked in." },
  { num: "02", weeks: "Wk 2–3",   title: "Reading Price Action",    desc: "Market structure, S&R, supply and demand, the 200 and 50 EMAs. You learn to see what price is actually doing." },
  { num: "03", weeks: "Wk 3–4",   title: "Structure + Levels",      desc: "Major market patterns, key levels, and how structure on higher timeframes controls every trade you'll ever take." },
  { num: "04", weeks: "Wk 4–7",   title: "The Confluence System",   desc: "Fibonacci from point A to B. The stack — all confluences aligned before you enter. This is where it clicks." },
  { num: "05", weeks: "Wk 7–10",  title: "Advanced Execution",      desc: "Break and retest, order blocks, entry models. You stop guessing and start executing with a reason." },
  { num: "06", weeks: "Wk 10–16", title: "Live & Consistent",       desc: "Back-testing, journaling, prop firm strategy, 30-day live trading journal. The bridge from paper to live account." },
];

// 16 weekly webinars — one per week, 1.5 hrs each, structured topic + Q&A at end
const CALL_SCHEDULE_STANDARD = [
  { n: "01", type: "WEBINAR", label: "Orientation — The WSA Framework",                  when: "Week 1",  note: "Cue walks the full 16-week roadmap live. What to expect, how to work the system, and the mindset required to see it through." },
  { n: "02", type: "WEBINAR", label: "Phase 01 — The Psychology of Losing",              when: "Week 2",  note: "Why most traders blow up before they ever develop a real edge. The mental patterns that destroy accounts — and how the system interrupts them." },
  { n: "03", type: "WEBINAR", label: "Phase 01 — Risk Rules That Keep You Alive",        when: "Week 3",  note: "Position sizing, max loss per session, and the compounding math most traders ignore. This is what protects your capital through Phase 2–6." },
  { n: "04", type: "WEBINAR", label: "Phase 02 — Reading Price Like Cue Reads It",       when: "Week 4",  note: "Market structure from scratch. How Cue actually sees a chart — not textbook theory. What price is doing vs. what it looks like it's doing." },
  { n: "05", type: "WEBINAR", label: "Phase 02 — Supply, Demand & the 200/50 EMA",      when: "Week 5",  note: "How the EMAs frame everything. Supply and demand zones that matter vs. the ones retail draws wrong. Cue on live charts." },
  { n: "06", type: "WEBINAR", label: "Phase 03 — Structure From the Top Down",           when: "Week 6",  note: "Why daily and H4 control every trade you take on the lower timeframes. How to map the higher timeframe before touching a 5-minute chart." },
  { n: "07", type: "WEBINAR", label: "Phase 03 — The Levels That Actually Matter",       when: "Week 7",  note: "Most traders mark too many levels. Cue walks through exactly how he identifies the ones the market will react to — and why the rest are noise." },
  { n: "08", type: "WEBINAR", label: "Phase 04 — Fibonacci From Point A to B",           when: "Week 8",  note: "How to draw a fib correctly. The levels Cue uses vs. what's taught everywhere else. What confluences look like when a setup is real." },
  { n: "09", type: "WEBINAR", label: "Phase 04 — The Confluence Stack",                  when: "Week 9",  note: "The full qualification process. What has to align before Cue considers entering a trade. Every criteria, in sequence, on real charts." },
  { n: "10", type: "WEBINAR", label: "Phase 05 — Break & Retest: The Entry Model",       when: "Week 10", note: "One of the highest-probability patterns in the system. How to identify it, where to wait, and when the setup actually qualifies vs. when it doesn't." },
  { n: "11", type: "WEBINAR", label: "Phase 05 — Order Blocks & Institutional Zones",    when: "Week 11", note: "Where institutions actually leave footprints. How to identify order blocks, why they hold, and how to use them as entry zones — not just reference points." },
  { n: "12", type: "WEBINAR", label: "Phase 05 — Trade Management: Exits Are Harder",    when: "Week 12", note: "Most traders get in right and still lose. Moving stops, partial takes, scaling out — the full management process Cue runs on every trade." },
  { n: "13", type: "WEBINAR", label: "Phase 06 — The 100-Trade Back-Test Protocol",      when: "Week 13", note: "How to properly back-test the WSA system. What you're looking for, how to log it, and what your data should tell you before you go live." },
  { n: "14", type: "WEBINAR", label: "Phase 06 — Journaling Your Edge",                  when: "Week 14", note: "What to record, how to analyze it, and how to use your journal to identify the patterns in your mistakes before they become habits." },
  { n: "15", type: "WEBINAR", label: "Phase 06 — Prop Firm Strategy",                    when: "Week 15", note: "How to apply the WSA system to a funded challenge. The exact approach Cue uses — risk parameters, instrument selection, and phase management." },
  { n: "16", type: "WEBINAR", label: "Final Session — Consistency, Scale, What's Next",  when: "Week 16", note: "How to build a sustainable edge over months, not a hot streak. Scaling from demo to live. Group wins, live review, and next chapter mapping." },
];

// Inner Circle 2.0 — same 16 group webinars + 3 exclusive additions
const CALL_SCHEDULE_PREMIUM = [
  { n: "★",  type: "1-ON-1",  label: "Private Orientation Call with Cue",               when: "Week 1",         note: "Before the cohort sessions begin. Cue maps the 16-week roadmap directly to your situation, your capital, your targets. Your plan. Private.", exclusive: true },
  { n: "01", type: "WEBINAR", label: "Orientation — The WSA Framework",                 when: "Week 1",         note: "Shared cohort session. Cue walks the full roadmap live. Mindset, expectations, and how to maximize the 16 weeks ahead.", exclusive: false },
  { n: "02", type: "WEBINAR", label: "Phase 01 — The Psychology of Losing",             when: "Week 2",         note: "Shared cohort session. The mental patterns that destroy accounts — and how the system interrupts them.", exclusive: false },
  { n: "03", type: "WEBINAR", label: "Phase 01 — Risk Rules That Keep You Alive",       when: "Week 3",         note: "Shared cohort session. Position sizing, max loss, and the compounding math most traders ignore.", exclusive: false },
  { n: "04", type: "WEBINAR", label: "Phase 02 — Reading Price Like Cue Reads It",      when: "Week 4",         note: "Shared cohort session. Market structure from scratch. How Cue actually sees a chart.", exclusive: false },
  { n: "05", type: "WEBINAR", label: "Phase 02 — Supply, Demand & the 200/50 EMA",     when: "Week 5",         note: "Shared cohort session. EMAs, supply/demand zones that matter, live charts.", exclusive: false },
  { n: "06", type: "WEBINAR", label: "Phase 03 — Structure From the Top Down",          when: "Week 6",         note: "Shared cohort session. Daily and H4 control every trade on the lower timeframes.", exclusive: false },
  { n: "07", type: "WEBINAR", label: "Phase 03 — The Levels That Actually Matter",      when: "Week 7",         note: "Shared cohort session. How Cue identifies the levels the market will actually react to.", exclusive: false },
  { n: "08", type: "WEBINAR", label: "Phase 04 — Fibonacci From Point A to B",          when: "Week 8",         note: "Shared cohort session. How to draw a fib correctly and what confluences look like when real.", exclusive: false },
  { n: "09", type: "WEBINAR", label: "Phase 04 — The Confluence Stack",                 when: "Week 9",         note: "Shared cohort session. The full qualification process. Every criteria, in sequence, on real charts.", exclusive: false },
  { n: "10", type: "WEBINAR", label: "Phase 05 — Break & Retest: The Entry Model",      when: "Week 10",        note: "Shared cohort session. One of the highest-probability patterns in the system.", exclusive: false },
  { n: "11", type: "WEBINAR", label: "Phase 05 — Order Blocks & Institutional Zones",   when: "Week 11",        note: "Shared cohort session. Where institutions leave footprints and how to use them.", exclusive: false },
  { n: "12", type: "WEBINAR", label: "Phase 05 — Trade Management: Exits Are Harder",   when: "Week 12",        note: "Shared cohort session. Moving stops, partial takes, and the full management process.", exclusive: false },
  { n: "13", type: "WEBINAR", label: "Phase 06 — The 100-Trade Back-Test Protocol",     when: "Week 13",        note: "Shared cohort session. How to properly back-test the WSA system.", exclusive: false },
  { n: "14", type: "WEBINAR", label: "Phase 06 — Journaling Your Edge",                 when: "Week 14",        note: "Shared cohort session. What to record, analyze, and learn from your data.", exclusive: false },
  { n: "15", type: "WEBINAR", label: "Phase 06 — Prop Firm Strategy",                   when: "Week 15",        note: "Shared cohort session. How to apply the WSA system to a funded challenge.", exclusive: false },
  { n: "16", type: "WEBINAR", label: "Final Session — Consistency, Scale, What's Next", when: "Week 16",        note: "Shared cohort session. Sustainable edge, scaling from demo to live, group wins.", exclusive: false },
  { n: "★",  type: "GUESTS",  label: "Special Guest Calls",                             when: "TBA",            note: "Calls with guest traders and mentors scheduled throughout the program. Dates announced as the cohort progresses.", exclusive: true },
  { n: "★",  type: "1-ON-1",  label: "Private Final Win Call with Cue",                 when: "Week 16",        note: "After the final cohort session. Private close-out with Cue. Your wins, your gaps, your next chapter — mapped out 1-on-1.", exclusive: true },
];

const WINS = [
  { quote: "Bought my first car off trading. One year out of high school. I wouldn't have believed it was possible before WSA.", tag: "First car — 1 year in" },
  { quote: "Finally got consistent after struggling for two years. The stack changed everything. My results completely flipped.", tag: "Funded account passed" },
  { quote: "Made money while I was asleep. That used to sound like a scam to me. Now I understand exactly how it works.", tag: "Multi-session wins" },
  { quote: "I'm calmer. More sure of it. Not panicking over every trade. The psychology changes when the system is solid.", tag: "Full program graduate" },
];

// ── What's Included ─────────────────────────────────────────────────────────
const INCLUDED_BASIC = [
  { tag: "Core",       n: "16 wks",  title: "The 6-Phase Roadmap",     desc: "All 6 phases in exact order. Self-paced over 4 months. You don't skip phases.", exclusive: false },
  { tag: "Exclusive",  n: "10+ yrs", title: "Cue AI",                  desc: "AI trained on every session ever recorded. Ask anything — get the WSA answer.", exclusive: false },
  { tag: "Archive",    n: "90+",     title: "Chart N Chill Sessions",   desc: "Full archive of live sessions on demand. Cue on charts, real setups, real decisions.", exclusive: false },
  { tag: "Archive",    n: "27+",     title: "CueCAST",                  desc: "Market analysis recordings. His actual weekly prep process.", exclusive: false },
  { tag: "Structured", n: "6",       title: "Phase Drills",             desc: "Practice assignments between each phase. Training program, not a video library.", exclusive: false },
  { tag: "Community",  n: "Active",  title: "WSA Discord",              desc: "Access to the community for the duration of the program.", exclusive: false },
];

const INCLUDED_STANDARD = [
  { tag: "Core",       n: "16 wks",  title: "The 6-Phase Roadmap",      desc: "All 6 phases in exact order. You complete each one before the next session.", exclusive: false },
  { tag: "Exclusive",  n: "10+ yrs", title: "Cue AI",                   desc: "AI trained on every session ever recorded. Most questions get answered here first.", exclusive: false },
  { tag: "Archive",    n: "90+",     title: "Chart N Chill Sessions",    desc: "Full archive of live sessions on demand. Cue on charts, real setups.", exclusive: false },
  { tag: "Archive",    n: "27+",     title: "CueCAST",                   desc: "Market analysis recordings. His actual weekly prep process.", exclusive: false },
  { tag: "Structured", n: "6",       title: "Phase Drills",              desc: "Complete every drill to stay with your cohort. Accountability is built in.", exclusive: false },
  { tag: "Live",       n: "16",      title: "Weekly Webinars",            desc: "One 90-minute webinar every week for 16 weeks. Each session covers a specific phase topic — material you won't find anywhere else.", exclusive: false },
  { tag: "Support",    n: "Direct",  title: "1-on-1 Chat with Head CSM",  desc: "Your dedicated CSM — trained by Cue. Accountability, wins, and escalations for the full 4 months.", exclusive: false },
  { tag: "Community",  n: "Active",  title: "WSA Discord",               desc: "Access to the full community for the duration of the program.", exclusive: false },
];

const INCLUDED_PREMIUM = [
  { tag: "Core",       n: "16 wks",  title: "The 6-Phase Roadmap",      desc: "Reviewed with Cue personally on your orientation call. Customized to your starting point.", exclusive: false },
  { tag: "Exclusive",  n: "10+ yrs", title: "Cue AI",                   desc: "AI trained on every session ever recorded. Ask anything — get the WSA answer.", exclusive: false },
  { tag: "Archive",    n: "90+",     title: "Chart N Chill Sessions",    desc: "Full archive of live sessions on demand. Cue on charts, real setups.", exclusive: false },
  { tag: "Archive",    n: "27+",     title: "CueCAST",                   desc: "Market analysis recordings. His actual weekly prep process.", exclusive: false },
  { tag: "Structured", n: "6",       title: "Phase Drills",              desc: "Complete every drill to stay with your cohort. Accountability is built in.", exclusive: false },
  { tag: "Shared",     n: "16",      title: "Weekly Webinars",            desc: "16 weekly 90-minute webinars shared with the Inner Circle cohort. One per week for the full 16 weeks.", exclusive: false },
  { tag: "2.0 Only",   n: "1-on-1",  title: "Private Orientation w/ Cue", desc: "Cue builds your custom plan in your first call. Your situation, your targets, your roadmap.", exclusive: true },
  { tag: "2.0 Only",   n: "TBA",     title: "Special Guest Calls",       desc: "Access to calls with guest traders and mentors. Dates announced throughout the program.", exclusive: true },
  { tag: "2.0 Only",   n: "1-on-1",  title: "Private Final Win Call w/ Cue", desc: "Private close-out call with Quillan. Your wins, your progress, your next steps.", exclusive: true },
  { tag: "2.0 Only",   n: "Priority", title: "Priority Chat — Cue + CSM",   desc: "Direct access to Cue and your Head CSM. Questions don't wait for the next group call.", exclusive: true },
  { tag: "Community",  n: "Active",  title: "WSA Discord",               desc: "Access to the full community for the duration of the program.", exclusive: false },
];

const mono = "var(--font-mono)";
const display = "var(--font-display)";
const body = "var(--font-body)";
const acid = "var(--acid)";
const bone = "var(--bone)";

const slide: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  borderTop: "1px solid rgba(255,255,255,0.07)",
  position: "relative",
  overflow: "hidden",
  scrollSnapAlign: "start",
  padding: "100px 0 80px",
};

const wrap: React.CSSProperties = {
  maxWidth: 860,
  margin: "0 auto",
  padding: "0 48px",
  width: "100%",
  position: "relative",
  zIndex: 1,
};

function Eyebrow({ label, invert }: { label: string; invert?: boolean }) {
  return (
    <div className="ic-reveal" style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: invert ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.3)", marginBottom: 24 }}>
      {label}
    </div>
  );
}

function Heading({ children, invert }: { children: React.ReactNode; invert?: boolean }) {
  return (
    <h2 className="ic-reveal" style={{ fontFamily: display, fontSize: "clamp(48px,6.5vw,80px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", color: invert ? "#fff" : bone, margin: 0 }}>
      {children}
    </h2>
  );
}

function Ghost({ n }: { n: string }) {
  return (
    <div aria-hidden style={{ position: "absolute", top: "50%", left: -16, transform: "translateY(-50%)", fontFamily: display, fontSize: "28vw", fontWeight: 800, lineHeight: 1, color: "rgba(255,255,255,0.018)", letterSpacing: "-0.06em", pointerEvents: "none", userSelect: "none" }}>
      {n}
    </div>
  );
}

const TIER_LABELS: Record<Tier, string> = {
  basic: "Premium Group",
  standard: "Inner Circle",
  premium: "Inner Circle 2.0",
};

const TIER_PRICES: Record<Tier, string> = {
  basic: "$5,000",
  standard: "$7,500",
  premium: "$15,000",
};

function TierSwitcher({ tier, setTier }: { tier: Tier; setTier: (t: Tier) => void }) {
  return (
    <div style={{
      position: "fixed", top: 20, right: 24, zIndex: 200,
      display: "flex", alignItems: "center",
      background: "rgba(0,0,0,0.92)", backdropFilter: "blur(24px)",
      border: "1px solid rgba(255,255,255,0.1)",
      padding: 4, gap: 2,
      boxShadow: "0 4px 40px rgba(0,0,0,0.6)",
    }}>
      {(["basic", "standard", "premium"] as Tier[]).map((t) => {
        const active = tier === t;
        return (
          <button key={t} onClick={() => setTier(t)} style={{
            background: active ? acid : "transparent",
            border: "none",
            color: active ? "#fff" : "rgba(255,255,255,0.35)",
            fontFamily: mono,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "9px 16px",
            cursor: "pointer",
            transition: "background 0.18s, color 0.18s",
            whiteSpace: "nowrap",
          }}>
            {TIER_LABELS[t]}
          </button>
        );
      })}
    </div>
  );
}

// ── Cover headline / stats by tier ──────────────────────────────────────────
const COVER_CONTENT: Record<Tier, { headline: React.ReactNode; sub: string; stats: { n: string; l: string }[] }> = {
  basic: {
    headline: <>The system.<br />The AI.<br /><em style={{ color: acid, fontStyle: "normal" }}>Self-paced.</em></>,
    sub: "The complete WSA curriculum and an AI trained on 10 years of live sessions — yours to work through at your own pace over 4 months.",
    stats: [
      { n: "6",   l: "Phases" },
      { n: "16",  l: "Weeks" },
      { n: "90+", l: "Live Sessions" },
      { n: "5K",  l: "Investment" },
    ],
  },
  standard: {
    headline: <>The system.<br />The AI.<br /><em style={{ color: acid, fontStyle: "normal" }}>16 live webinars.</em></>,
    sub: "A 4-month boot camp. One 90-minute webinar every week — structured, topic-specific, covering material you can't get anywhere else. CSM accountability, and every WSA tool built in cohort.",
    stats: [
      { n: "16",   l: "Webinars" },
      { n: "16",   l: "Weeks" },
      { n: "90min", l: "Per Session" },
      { n: "90+",  l: "Archived Sessions" },
    ],
  },
  premium: {
    headline: <>The system.<br />The AI.<br /><em style={{ color: acid, fontStyle: "normal" }}>Your own sessions.</em></>,
    sub: "Everything in Inner Circle — 16 weekly webinars — plus two private calls with Cue directly. Your orientation and your final win call are yours alone.",
    stats: [
      { n: "16",      l: "Webinars" },
      { n: "2",       l: "Private Cue Calls" },
      { n: "90min",   l: "Per Session" },
      { n: "Priority", l: "Access" },
    ],
  },
};

export default function InnerCirclePage() {
  const [active, setActive] = useState("cover");
  const [tier, setTier] = useState<Tier>("standard");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.4 }
    );
    NAV_SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".ic-reveal:not(.visible)");
    const ro = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add("visible"), i * 40); ro.unobserve(e.target); } }),
      { threshold: 0.06, rootMargin: "0px 0px -20px 0px" }
    );
    els.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [tier]);

  const isBasic    = tier === "basic";
  const isPremium  = tier === "premium";
  const isStandard = tier === "standard";
  const price = TIER_PRICES[tier];
  const cover = COVER_CONTENT[tier];

  const included = isBasic ? INCLUDED_BASIC : isPremium ? INCLUDED_PREMIUM : INCLUDED_STANDARD;

  return (
    <div style={{ background: "#000", color: bone, overflowX: "hidden", scrollSnapType: "y proximity" }}>

      {/* ── Tier switcher ────────────────────────────────────────────────────── */}
      <TierSwitcher tier={tier} setTier={setTier} />

      {/* ── Side nav ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", left: "max(20px, calc(50vw - 480px - 160px))", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 5, zIndex: 50 }}>
        {NAV_SECTIONS.map(({ id, label }) => (
          <button key={id} className={`ic-nav-item${active === id ? " active" : ""}`}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            {label}
          </button>
        ))}
      </nav>

      {/* ══ COVER ════════════════════════════════════════════════════════════════ */}
      <section id="cover" style={{ ...slide, borderTop: "none" }}>
        <div style={wrap}>
          <div className="ic-reveal" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Wall Street Academy</span>
            <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: acid, transition: "color 0.25s" }}>
              {TIER_LABELS[tier]}
            </span>
          </div>

          <h1 className="ic-reveal" style={{ fontFamily: display, fontSize: "clamp(64px,10vw,110px)", fontWeight: 800, lineHeight: 0.9, letterSpacing: "-0.05em", marginBottom: 32 }}>
            {cover.headline}
          </h1>

          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 21, lineHeight: 1.65, color: "rgba(255,255,255,0.45)", maxWidth: 580, marginBottom: 48 }}>
            {cover.sub}
          </p>

          <div className="ic-reveal" style={{ width: 48, height: 2, background: acid, marginBottom: 40 }} />

          <div className="ic-reveal" style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {cover.stats.map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: display, fontSize: 48, fontWeight: 800, letterSpacing: "-0.05em", color: bone, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* 4-month boot camp banner */}
          {!isBasic && (
            <div className="ic-reveal" style={{ marginTop: 40, display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.2)", padding: "10px 20px" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: acid, flexShrink: 0 }} />
              <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(37,99,235,0.7)" }}>
                4-Month Boot Camp · Cohort-Based · Enrolling Now
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ══ WHO IT'S FOR ══════════════════════════════════════════════════════════ */}
      <section id="who" style={slide}>
        <Ghost n="02" />
        <div style={wrap}>
          <Eyebrow label="Who this is for" />
          <Heading>Not everyone.<br /><em style={{ color: acid, fontStyle: "normal" }}>Specifically you.</em></Heading>
          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 19, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", maxWidth: 620, margin: "20px 0 36px" }}>
            {isBasic
              ? "For the trader who wants the system and the AI at their own pace. You know Forex is real — you just want the right curriculum without the overhead."
              : "This is built for the trader already in forex — who knows the concepts but can't figure out why consistency is still escaping them."}
          </p>
          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ background: "#000", padding: "28px 28px" }}>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: acid, marginBottom: 18 }}>· This is you ·</div>
              {(isBasic
                ? ["Already trading — demo or live", "Self-motivated — you do the work", "Want structure without coaching overhead", "Budget-conscious, serious about learning", "Planning to upgrade once results come in"]
                : ["Already trading — demo or live", "Know what support & resistance is", "Know what a fib retracement is", "Stuck on consistency, not concepts", "Ready to be held accountable for 4 months"]
              ).map((t) => (
                <div key={t} style={{ fontFamily: body, fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{t}</div>
              ))}
            </div>
            <div style={{ background: "#000", padding: "28px 28px" }}>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", marginBottom: 18 }}>· Not a fit ·</div>
              {["Never touched a chart in your life", "Looking for a get-rich shortcut", "Not prepared to do the work", "Want signals to copy, not skills", "Won't follow the roadmap in order"].map((t) => (
                <div key={t} style={{ fontFamily: body, fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.18)", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.07)" }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROBLEM ═══════════════════════════════════════════════════════════════ */}
      <section id="problem" style={slide}>
        <Ghost n="03" />
        <div style={wrap}>
          <Eyebrow label="The problem" />
          <Heading>Why serious traders<br /><em style={{ color: acid, fontStyle: "normal" }}>stay stuck.</em></Heading>
          <div style={{ marginTop: 40 }}>
            {[
              { n: "01", s: "They learned setups without learning structure first.", r: " Higher timeframe structure doesn't support it — the setup is noise." },
              { n: "02", s: "They don't stack confluence.", r: " One reason to enter is never enough. The stack has to qualify. One piece alone is gambling." },
              { n: "03", s: "Risk management is an afterthought.", r: " You can have the best read and still blow your account because you sized wrong." },
              { n: "04", s: "Everything out there is just information.", r: " Courses, YouTube, Discord — information doesn't build consistency. Execution under structure does." },
            ].map(({ n, s, r }) => (
              <div key={n} className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 20, padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)", paddingTop: 3 }}>{n}</span>
                <p style={{ fontFamily: body, fontSize: 18, lineHeight: 1.65, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                  <strong style={{ color: bone, fontWeight: 700 }}>{s}</strong>{r}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ QUILLAN ═══════════════════════════════════════════════════════════════ */}
      <section id="quillan" style={slide}>
        <Ghost n="04" />
        <div style={wrap}>
          <Eyebrow label="Quillan Black" />
          <Heading>Built from scratch.<br /><em style={{ color: acid, fontStyle: "normal" }}>Doesn&apos;t work for anybody.</em></Heading>
          <blockquote className="ic-reveal" style={{ borderLeft: "2px solid " + acid, paddingLeft: 28, margin: "32px 0", fontFamily: display, fontSize: "clamp(20px,3vw,30px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.3, color: bone }}>
            &ldquo;I blew four $1,000 accounts before I understood risk management. That&apos;s when I stopped blaming the market and started building the actual system.&rdquo;
          </blockquote>
          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { yr: "Early days",  t: "Blew four accounts. Learned psychology and risk management kill more traders than bad setups do." },
              { yr: "Years 1–5",  t: "Refined the confluence system. Built the top-down framework — Daily → H4 → H1 → M30 → M5 — as the non-negotiable process." },
              { yr: "Years 5–10", t: "Started teaching. Watched traders make the exact same mistakes repeatedly — built the curriculum to interrupt that pattern." },
              { yr: "2025–26",    t: "Built Wall Street Academy — 6-phase roadmap, Cue AI trained on every session ever recorded, packaged from scratch." },
            ].map(({ yr, t }) => (
              <div key={yr} style={{ background: "#000", padding: "22px 24px" }}>
                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>{yr}</div>
                <p style={{ fontFamily: body, fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.42)", margin: 0 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WINS ══════════════════════════════════════════════════════════════════ */}
      <section id="wins" style={slide}>
        <Ghost n="05" />
        <div style={wrap}>
          <Eyebrow label="Student wins" />
          <Heading>The results nobody<br /><em style={{ color: acid, fontStyle: "normal" }}>puts on the feed.</em></Heading>
          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 19, lineHeight: 1.7, color: "rgba(255,255,255,0.4)", maxWidth: 560, margin: "20px 0 36px" }}>
            The algorithm shows you the highlight. Not the person who struggled for two years and then flipped everything. These are those people.
          </p>
          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {WINS.map(({ quote, tag }) => (
              <div key={tag} style={{ background: "#000", padding: "28px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
                <blockquote style={{ fontFamily: display, fontSize: 18, fontWeight: 600, lineHeight: 1.5, letterSpacing: "-0.01em", color: "rgba(255,255,255,0.85)", margin: 0 }}>
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: acid, flexShrink: 0 }} />
                  <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>{tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROOF ════════════════════════════════════════════════════════════════ */}
      <section id="proof" style={{ ...slide, flexDirection: "column", alignItems: "flex-start", overflow: "hidden", padding: "80px 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 48px", width: "100%", position: "relative", zIndex: 1, marginBottom: 36 }}>
          <Eyebrow label="Community wins" />
          <Heading>The receipts.<br /><em style={{ color: acid, fontStyle: "normal" }}>Real accounts. Real money.</em></Heading>
          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 19, lineHeight: 1.7, color: "rgba(255,255,255,0.4)", maxWidth: 560, marginTop: 16 }}>
            Every one of these was posted live. Not hand-picked after the fact — documented in real time, same system, same rules.
          </p>
        </div>
        <div style={{ width: "100vw", display: "flex", flexDirection: "column", gap: 10, marginLeft: "calc(-50vw + 50%)" }}>
          <WinMarquee images={STUDENT_WIN_IMGS} height={170} />
          <WinMarquee images={[...STUDENT_WIN_IMGS].reverse()} reverse height={170} />
          <WinMarquee images={CUE_WIN_IMGS} height={170} />
        </div>
        <div className="ic-reveal" style={{ maxWidth: 860, margin: "28px auto 0", padding: "0 48px", width: "100%", display: "flex", gap: 40, flexWrap: "wrap" }}>
          {[
            { n: "$500K+", l: "Documented in 5 days" },
            { n: "10,000+", l: "Traders mentored" },
            { n: "2019", l: "Posting live since" },
          ].map((s) => (
            <div key={s.l}>
              <div style={{ fontFamily: display, fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", color: acid, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ INCLUDED ══════════════════════════════════════════════════════════════ */}
      <section id="included" style={{ ...slide, alignItems: "flex-start", paddingTop: 100 }}>
        <Ghost n="06" />
        <div style={wrap}>
          <Eyebrow label="What's inside" />
          <Heading>Every tool.<br /><em style={{ color: acid, fontStyle: "normal" }}>Nothing missing.</em></Heading>

          {isPremium && (
            <div className="ic-reveal" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.25)", padding: "8px 16px", marginTop: 20, marginBottom: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: acid }} />
              <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: acid }}>4 exclusive additions in 2.0</span>
            </div>
          )}

          {isBasic && (
            <div className="ic-reveal" style={{ fontFamily: body, fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.35)", maxWidth: 560, margin: "16px 0 4px", borderLeft: "2px solid rgba(255,255,255,0.1)", paddingLeft: 18 }}>
              Course and AI access only. No live calls or CSM support — upgrade to Inner Circle for the full boot camp.
            </div>
          )}

          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)", marginTop: 24 }}>
            {included.map(({ tag, n, title, desc, exclusive }) => (
              <div key={title} style={{ background: exclusive ? "rgba(37,99,235,0.04)" : "#000", padding: "22px 22px", borderTop: exclusive ? "1px solid rgba(37,99,235,0.2)" : "none", position: "relative" }}>
                <div style={{ fontFamily: mono, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: exclusive ? acid : "rgba(255,255,255,0.3)", marginBottom: 9 }}>{tag}</div>
                <div style={{ fontFamily: display, fontSize: 16, fontWeight: 700, letterSpacing: "-0.015em", color: bone, marginBottom: 7, lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontFamily: body, fontSize: 13, lineHeight: 1.6, color: exclusive ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.3)", marginBottom: 14 }}>{desc}</div>
                <div style={{ fontFamily: display, fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", color: exclusive ? "rgba(37,99,235,0.25)" : "rgba(255,255,255,0.18)", lineHeight: 1 }}>{n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ROADMAP ═══════════════════════════════════════════════════════════════ */}
      <section id="roadmap" style={slide}>
        <Ghost n="07" />
        <div style={wrap}>
          <Eyebrow label="The roadmap" />
          <Heading>Six phases.<br /><em style={{ color: acid, fontStyle: "normal" }}>In this order.</em></Heading>
          {isPremium && (
            <div className="ic-reveal" style={{ fontFamily: body, fontSize: 16, lineHeight: 1.65, color: "rgba(37,99,235,0.65)", maxWidth: 560, margin: "16px 0 8px", borderLeft: "2px solid rgba(37,99,235,0.3)", paddingLeft: 18 }}>
              In 2.0, Quillan reviews this with you personally on your orientation call — adjusting emphasis and custom targets to match where you actually are.
            </div>
          )}
          {!isBasic && (
            <div className="ic-reveal" style={{ fontFamily: body, fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.3)", maxWidth: 560, margin: "16px 0 8px", borderLeft: "2px solid rgba(255,255,255,0.08)", paddingLeft: 18 }}>
              One 90-minute webinar every week runs alongside the curriculum. You work the modules, then Cue goes deeper on the same topic live — giving you context you won't find anywhere else.
            </div>
          )}
          <div style={{ marginTop: 28 }}>
            {PHASES.map((p) => (
              <div key={p.num} className="ic-reveal ic-phase-row" style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: 24, padding: "15px 10px", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "0 -10px", alignItems: "center" }}>
                <div style={{ width: 38, height: 38, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.28)" }}>{p.num}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 2fr", gap: 20, alignItems: "start" }}>
                  <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", paddingTop: 2 }}>{p.weeks}</span>
                  <div style={{ fontFamily: display, fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: bone, lineHeight: 1.2 }}>{p.title}</div>
                  <div style={{ fontFamily: body, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.35)" }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WEEKLY WEBINARS ══════════════════════════════════════════════════════ */}
      <section id="calls" style={slide}>
        <Ghost n="08" />
        <div style={wrap}>
          <Eyebrow label="Weekly webinars" />
          {isBasic ? (
            <>
              <Heading>90+ sessions.<br /><em style={{ color: acid, fontStyle: "normal" }}>On demand.</em></Heading>
              <p className="ic-reveal" style={{ fontFamily: body, fontSize: 19, lineHeight: 1.7, color: "rgba(255,255,255,0.42)", maxWidth: 580, margin: "20px 0 40px" }}>
                No live webinars on Premium Group — but you get the full archive of Chart N Chill and CueCAST sessions. Every live trade, every analysis, every breakdown Cue has ever recorded.
              </p>
              <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {[
                  { n: "90+", name: "Chart N Chill",  desc: "Cue live on charts. Real setups, real talk, real decisions. Every session on record." },
                  { n: "27+", name: "CueCAST",         desc: "Market analysis sessions. How Cue prepares for the week — his actual process." },
                ].map(({ n, name, desc }) => (
                  <div key={name} style={{ background: "#000", padding: "36px 32px" }}>
                    <div style={{ fontFamily: display, fontSize: 56, fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(255,255,255,0.18)", lineHeight: 1, marginBottom: 16 }}>{n}</div>
                    <div style={{ fontFamily: display, fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: bone, marginBottom: 12 }}>{name}</div>
                    <div style={{ fontFamily: body, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.32)" }}>{desc}</div>
                  </div>
                ))}
              </div>
              <div className="ic-reveal" style={{ marginTop: 28, fontFamily: body, fontSize: 15, color: "rgba(255,255,255,0.3)", borderLeft: "2px solid rgba(255,255,255,0.08)", paddingLeft: 18 }}>
                Want live webinars? Inner Circle includes 16 weekly sessions with Cue.
              </div>
            </>
          ) : (
            <>
              <Heading>{isPremium ? "16 webinars." : "16 webinars."}<br /><em style={{ color: acid, fontStyle: "normal" }}>{isPremium ? "Two private calls with Cue." : "One every week. 90 minutes."}</em></Heading>
              <p className="ic-reveal" style={{ fontFamily: body, fontSize: 19, lineHeight: 1.7, color: "rgba(255,255,255,0.42)", maxWidth: 580, margin: "20px 0 12px" }}>
                {isPremium
                  ? "Every webinar is a structured 90-minute deep-dive on a specific topic — material Cue has never put in the public content. Your 2.0 calls — orientation and final win call — are yours alone."
                  : "One 90-minute webinar every week for 16 weeks. Each one is built around a specific phase topic: not a Q&A session, not chart-and-chill. Structured content, taught live, that doesn't exist outside this program. The last 10 minutes open for questions."}
              </p>
              {isPremium && (
                <div className="ic-reveal" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.2)", padding: "8px 16px", marginBottom: 20 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: acid }} />
                  <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: acid }}>★ rows = 2.0 exclusive</span>
                </div>
              )}
              <div className="ic-reveal" style={{ display: "flex", flexDirection: "column", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)", marginTop: isPremium ? 0 : 20 }}>
                {(isPremium ? CALL_SCHEDULE_PREMIUM : CALL_SCHEDULE_STANDARD).map((call) => {
                  const isExclusive = isPremium && "exclusive" in call && call.exclusive;
                  return (
                    <div key={call.n + call.label} style={{
                      background: isExclusive ? "rgba(37,99,235,0.04)" : "#000",
                      borderLeft: isExclusive ? `3px solid ${acid}` : "3px solid transparent",
                      padding: "16px 20px",
                      display: "grid",
                      gridTemplateColumns: "36px 80px 1fr auto",
                      gap: 16,
                      alignItems: "center",
                    }}>
                      <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: isExclusive ? acid : "rgba(255,255,255,0.2)" }}>{call.n}</span>
                      <span style={{ fontFamily: mono, fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isExclusive ? acid : "rgba(255,255,255,0.3)", background: isExclusive ? "rgba(37,99,235,0.1)" : "rgba(255,255,255,0.05)", padding: "3px 7px" }}>{call.type}</span>
                      <div>
                        <div style={{ fontFamily: display, fontSize: 15, fontWeight: 700, color: isExclusive ? acid : bone, letterSpacing: "-0.015em", marginBottom: 3 }}>{call.label}</div>
                        <div style={{ fontFamily: body, fontSize: 13, color: "rgba(255,255,255,0.32)", lineHeight: 1.5 }}>{call.note}</div>
                      </div>
                      <span style={{ fontFamily: mono, fontSize: 9, color: "rgba(255,255,255,0.2)", whiteSpace: "nowrap", textAlign: "right" }}>{call.when}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══ CUE AI — ACID INVERSION ═══════════════════════════════════════════════ */}
      <section id="cue-ai" style={{ ...slide, background: acid, color: "#fff", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", width: "100vw", borderTop: "none" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 48px", width: "100%", position: "relative", zIndex: 1 }}>
          <Eyebrow label="Cue AI" invert />
          <Heading invert>Nobody has built<br />this for forex.</Heading>
          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 21, lineHeight: 1.7, color: "rgba(255,255,255,0.75)", maxWidth: 620, margin: "24px 0 28px" }}>
            {isPremium
              ? "Every session. Every Q&A. Every live call ever recorded — trained into an AI that answers in Cue's voice. In 2.0, you also get priority direct access to Cue between sessions."
              : "Every session. Every Q&A. Every live call Quillan has ever recorded — trained into a single AI that thinks the way he thinks and answers the way he talks on calls."}
          </p>
          <blockquote className="ic-reveal" style={{ borderLeft: "3px solid rgba(255,255,255,0.3)", paddingLeft: 28, fontFamily: display, fontSize: "clamp(20px,2.8vw,30px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.3, color: "#fff", marginBottom: 32 }}>
            &ldquo;Ask it anything — whether your setup qualifies, how to draw a fib, why you keep making the same mistake. It gives you the WSA answer. Not the generic answer.&rdquo;
          </blockquote>
          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(0,0,0,0.2)" }}>
            {[
              { title: "Trained on real sessions",  desc: "The actual Q&As, breakdowns, and live content from years of WSA." },
              { title: "Answers in Cue's voice",     desc: "Direct. If your thinking is wrong, it says so — then gives you the right way." },
              { title: isPremium ? "Priority access" : "Available 24/7", desc: isPremium ? "2.0 members get more direct access — Cue himself is reachable between sessions." : "3am setup question? Ask it. No waiting for the next call." },
              { title: "Roadmap-aware",               desc: "Knows the full curriculum. Walks you through any phase or concept." },
            ].map(({ title, desc }) => (
              <div key={title} style={{ background: acid, padding: "24px 20px" }}>
                <div style={{ fontFamily: display, fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{title}</div>
                <div style={{ fontFamily: body, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.65)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ INVESTMENT ════════════════════════════════════════════════════════════ */}
      <section id="investment" style={{ ...slide, flexDirection: "column", justifyContent: "center" }}>
        <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: display, fontSize: "28vw", fontWeight: 800, color: "rgba(255,255,255,0.015)", lineHeight: 1, pointerEvents: "none" }}>$</div>
        <div style={{ ...wrap }}>
          <Eyebrow label="Investment" />
          <Heading>{isPremium ? "Inner Circle 2.0." : isBasic ? "Premium Group." : "Inner Circle."}<br /><em style={{ color: acid, fontStyle: "normal" }}>The investment.</em></Heading>

          {/* Selected tier detail */}
          <div className="ic-reveal" style={{ marginTop: 36, padding: "28px 32px", border: "1px solid rgba(37,99,235,0.15)", background: "rgba(37,99,235,0.03)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: acid }}>· {TIER_LABELS[tier]} ·</span>
              <span style={{ fontFamily: display, fontSize: 40, fontWeight: 800, letterSpacing: "-0.05em", color: bone }}>{price}</span>
            </div>
            <p style={{ fontFamily: body, fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.42)", maxWidth: 580, margin: "0 0 20px" }}>
              {isBasic
                ? "The complete WSA curriculum and Cue AI access. Self-paced. No live calls — but everything you need to build the foundation on your own terms. Upgrade to Inner Circle when you're ready for the boot camp."
                : isStandard
                ? "A 4-month cohort boot camp. 16 weekly 90-minute webinars with Quillan — one every week, each covering a phase topic you can't get anywhere else. Direct CSM accountability, and everything in the system. If you make back 1% of your account consistently — monthly — this pays for itself inside a year."
                : "Everything in Inner Circle — 16 weekly webinars — plus a private orientation and private final win call with Quillan directly. This is the closest thing to having him in your corner for the full 4 months."}
            </p>
            <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
              · 4-Month Program · {isBasic ? "Self-Paced" : "Cohort-Based"} · Not Lifetime ·
            </div>
          </div>

          <div className="ic-reveal" style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <Link href="/roadmap" style={{ display: "inline-block", background: acid, color: "#000", fontFamily: mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "20px 48px", textDecoration: "none" }}>
              See the roadmap →
            </Link>
            <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>· Limited cohort spots ·</span>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>© 2026 · Wall Street Academy · iknkfx inc</span>
        <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>Private — Not for distribution</span>
      </footer>
    </div>
  );
}
