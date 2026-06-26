"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_SECTIONS = [
  { id: "cover",      label: "Overview" },
  { id: "who",        label: "Who It's For" },
  { id: "problem",    label: "The Problem" },
  { id: "quillan",    label: "Quillan Black" },
  { id: "wins",       label: "Student Wins" },
  { id: "included",   label: "What's Inside" },
  { id: "roadmap",    label: "The Roadmap" },
  { id: "cue-ai",     label: "Cue AI" },
  { id: "sessions",   label: "Live Sessions" },
  { id: "investment", label: "Investment" },
];

const PHASES = [
  { num: "01", weeks: "Wk 1–2",   title: "Foundation & Mindset",   desc: "Risk management, platform setup, psychology. The most important phase. You don't start Phase 2 without this locked in." },
  { num: "02", weeks: "Wk 2–3",   title: "Reading Price",           desc: "Market structure, S&R, supply and demand, the 200 and 50 EMAs. You learn to see what price is actually doing." },
  { num: "03", weeks: "Wk 4–6",   title: "The Confluence System",   desc: "Fibonacci from point A to B. The stack — all confluences aligned before you enter. This is where it clicks." },
  { num: "04", weeks: "Wk 7–10",  title: "Entries & Management",    desc: "Break and retest, order blocks, entry models. You stop guessing and start executing with a reason." },
  { num: "05", weeks: "Wk 10–13", title: "Live Application",        desc: "Back-testing, journaling, prop firm strategy. The bridge from paper to live account." },
  { num: "06", weeks: "Wk 13–16", title: "Advanced Concepts",       desc: "ICT, liquidity sweeps, higher-level reads. For when the foundation is locked and you're ready to go deeper." },
];

const WINS = [
  { quote: "Bought my first car off trading. One year out of high school. I wouldn't have believed it was possible before WSA.", tag: "First car — 1 year in" },
  { quote: "Finally got consistent after struggling for two years. The stack changed everything. My results completely flipped.", tag: "Funded account passed" },
  { quote: "Made money while I was asleep. That used to sound like a scam to me. Now I understand exactly how it works.", tag: "Multi-session wins" },
  { quote: "I'm calmer. More sure of it. Not panicking over every trade. The psychology changes when the system is solid.", tag: "Full program graduate" },
];

// Shared style tokens
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
  padding: "80px 0",
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
    <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: invert ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)", marginBottom: 24 }}>
      {label}
    </div>
  );
}

function Heading({ children, invert }: { children: React.ReactNode; invert?: boolean }) {
  return (
    <h2 style={{ fontFamily: display, fontSize: "clamp(48px,6.5vw,80px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", color: invert ? "#000" : bone, margin: 0 }}>
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

export default function InnerCirclePage() {
  const [active, setActive] = useState("cover");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.4 }
    );
    NAV_SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".ic-reveal");
    const ro = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add("visible"), i * 40); ro.unobserve(e.target); } }),
      { threshold: 0.06, rootMargin: "0px 0px -20px 0px" }
    );
    els.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ background: "#000", color: bone, overflowX: "hidden", scrollSnapType: "y proximity" }}>

      {/* ── Side nav ────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", left: "max(20px, calc(50vw - 480px - 160px))", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 5, zIndex: 50 }}>
        {NAV_SECTIONS.map(({ id, label }) => (
          <button key={id} className={`ic-nav-item${active === id ? " active" : ""}`}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            {label}
          </button>
        ))}
      </nav>

      {/* ══ 01 COVER ════════════════════════════════════════════════════════════ */}
      <section id="cover" style={{ ...slide, borderTop: "none", minHeight: "100vh" }}>
        <div style={wrap}>
          <div className="ic-reveal" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 52 }}>
            <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Wall Street Academy</span>
            <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Private — 2026</span>
          </div>

          <h1 className="ic-reveal" style={{ fontFamily: display, fontSize: "clamp(64px,10vw,110px)", fontWeight: 800, lineHeight: 0.9, letterSpacing: "-0.05em", marginBottom: 36 }}>
            The system.<br />The AI.<br /><em style={{ color: acid, fontStyle: "normal" }}>The roadmap.</em>
          </h1>

          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 21, lineHeight: 1.65, color: "rgba(255,255,255,0.45)", maxWidth: 560, marginBottom: 52 }}>
            A decade of live trading, hundreds of sessions, every framework Quillan Black has built — packaged into the most complete forex curriculum that exists.
          </p>

          <div className="ic-reveal" style={{ width: 48, height: 2, background: acid, marginBottom: 40 }} />

          <div className="ic-reveal" style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[{ n: "6", l: "Phases" }, { n: "16", l: "Weeks" }, { n: "67+", l: "Live Sessions" }, { n: "10+", l: "Years of Data" }].map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: display, fontSize: 48, fontWeight: 800, letterSpacing: "-0.05em", color: bone, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 02 WHO IT'S FOR ═════════════════════════════════════════════════════ */}
      <section id="who" style={slide}>
        <Ghost n="02" />
        <div style={wrap}>
          <Eyebrow label="Who this is for" />
          <Heading>Not everyone.<br /><em style={{ color: acid, fontStyle: "normal" }}>Specifically you.</em></Heading>
          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 19, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", maxWidth: 620, margin: "20px 0 36px" }}>
            This is built for the trader already in forex — who knows the concepts but can&apos;t figure out why consistency is still escaping them.
          </p>

          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ background: "#000", padding: "28px 28px" }}>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: acid, marginBottom: 18 }}>· This is you ·</div>
              {["Already trading — demo or live", "Know what support & resistance is", "Know what a fib retracement is", "Stuck on consistency, not concepts", "Serious about making this work long-term"].map((t) => (
                <div key={t} style={{ fontFamily: body, fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{t}</div>
              ))}
            </div>
            <div style={{ background: "#000", padding: "28px 28px" }}>
              <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", marginBottom: 18 }}>· Not a fit ·</div>
              {["Never touched a chart in your life", "Looking for a get-rich shortcut", "Not prepared to do the work", "Want signals to copy, not skills to keep", "Won&apos;t follow the roadmap in order"].map((t) => (
                <div key={t} style={{ fontFamily: body, fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.18)", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.07)" }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 03 THE PROBLEM ══════════════════════════════════════════════════════ */}
      <section id="problem" style={slide}>
        <Ghost n="03" />
        <div style={wrap}>
          <Eyebrow label="The problem" />
          <Heading>Why serious traders<br /><em style={{ color: acid, fontStyle: "normal" }}>stay stuck.</em></Heading>

          <div style={{ marginTop: 40 }}>
            {[
              { n: "01", strong: "They learned setups without learning structure first.", rest: " The setup is the last thing you look at. Higher timeframe structure doesn't support it — the setup is noise." },
              { n: "02", strong: "They don't stack confluence.", rest: " One reason to enter is never enough. The stack has to qualify. One piece alone is gambling." },
              { n: "03", strong: "Risk management is an afterthought.", rest: " You can have the best read and still blow your account. Cue blew four $1,000 accounts learning this. You don't have to." },
              { n: "04", strong: "Nobody built the thing for traders who are already serious.", rest: " Everything out there is for total beginners. This isn't that." },
            ].map(({ n, strong, rest }) => (
              <div key={n} className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 20, padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)", paddingTop: 3 }}>{n}</span>
                <p style={{ fontFamily: body, fontSize: 18, lineHeight: 1.65, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                  <strong style={{ color: bone, fontWeight: 700 }}>{strong}</strong>{rest}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 04 QUILLAN ══════════════════════════════════════════════════════════ */}
      <section id="quillan" style={slide}>
        <Ghost n="04" />
        <div style={wrap}>
          <Eyebrow label="Quillan Black" />
          <Heading>Built from scratch.<br /><em style={{ color: acid, fontStyle: "normal" }}>Doesn&apos;t work for anybody.</em></Heading>

          <blockquote className="ic-reveal" style={{ borderLeft: "2px solid " + acid, paddingLeft: 28, margin: "36px 0", fontFamily: display, fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.3, color: bone }}>
            &ldquo;I blew four $1,000 accounts before I understood risk management. That&apos;s when I stopped blaming the market and started building the actual system.&rdquo;
          </blockquote>

          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { yr: "Early days",   t: "Blew four accounts. Learned psychology and risk management kill more traders than bad setups do." },
              { yr: "Years 1–5",   t: "Refined the confluence system. Built the top-down framework — Daily → H4 → H1 → M30 → M5 — as the non-negotiable process." },
              { yr: "Years 5–10",  t: "Started teaching. Watched traders make the exact same mistakes repeatedly — built the curriculum to interrupt that pattern." },
              { yr: "2025–26",     t: "Built Wall Street Academy — 6-phase roadmap, AI trained on every session ever recorded, packaged from scratch." },
            ].map(({ yr, t }) => (
              <div key={yr} style={{ background: "#000", padding: "22px 24px" }}>
                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>{yr}</div>
                <p style={{ fontFamily: body, fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.42)", margin: 0 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 05 WINS ═════════════════════════════════════════════════════════════ */}
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

      {/* ══ 06 INCLUDED ═════════════════════════════════════════════════════════ */}
      <section id="included" style={slide}>
        <Ghost n="06" />
        <div style={wrap}>
          <Eyebrow label="What's inside" />
          <Heading>Every tool.<br /><em style={{ color: acid, fontStyle: "normal" }}>Nothing missing.</em></Heading>

          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)", marginTop: 36 }}>
            {[
              { tag: "Core",       n: "16 wks", title: "The Roadmap",       desc: "6 phases, every module in exact order. You don't skip phases." },
              { tag: "Exclusive",  n: "10+ yrs", title: "Cue AI",            desc: "AI trained on every session ever recorded. Answers in his voice, with his system." },
              { tag: "Archive",    n: "40+",    title: "Chart N Chill",      desc: "Live sessions on demand. Cue on charts, real setups, real talk." },
              { tag: "Archive",    n: "27+",    title: "CueCAST",            desc: "Market analysis recordings. His actual weekly prep process." },
              { tag: "Live",       n: "4×",     title: "Group Q&A Calls",    desc: "Four live calls across the program. Bring your charts." },
              { tag: "Structured", n: "6",      title: "Phase Drills",       desc: "Practice between phases. This is a training program, not a library." },
            ].map(({ tag, n, title, desc }) => (
              <div key={title} style={{ background: "#000", padding: "24px 22px" }}>
                <div style={{ fontFamily: mono, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: acid, marginBottom: 10 }}>{tag}</div>
                <div style={{ fontFamily: display, fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: bone, marginBottom: 8, lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontFamily: body, fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.32)", marginBottom: 16 }}>{desc}</div>
                <div style={{ fontFamily: display, fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.05)", lineHeight: 1 }}>{n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 07 ROADMAP ══════════════════════════════════════════════════════════ */}
      <section id="roadmap" style={slide}>
        <Ghost n="07" />
        <div style={wrap}>
          <Eyebrow label="The roadmap" />
          <Heading>Six phases.<br /><em style={{ color: acid, fontStyle: "normal" }}>In this order.</em></Heading>

          <div style={{ marginTop: 32 }}>
            {PHASES.map((p) => (
              <div key={p.num} className="ic-reveal ic-phase-row" style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: 24, padding: "16px 10px", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "0 -10px", alignItems: "center" }}>
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

      {/* ══ 08 CUE AI — ACID INVERSION ══════════════════════════════════════════ */}
      <section id="cue-ai" style={{ ...slide, background: acid, color: "#000", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", width: "100vw", borderTop: "none" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 48px", width: "100%", position: "relative", zIndex: 1 }}>
          <Eyebrow label="Cue AI" invert />
          <Heading invert>Nobody has built<br />this for forex.</Heading>

          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 21, lineHeight: 1.7, color: "rgba(0,0,0,0.55)", maxWidth: 620, margin: "24px 0 32px" }}>
            Every session. Every Q&amp;A. Every live call Quillan has ever recorded — trained into a single AI that thinks the way he thinks and answers the way he talks on calls.
          </p>

          <blockquote className="ic-reveal" style={{ borderLeft: "3px solid rgba(0,0,0,0.2)", paddingLeft: 28, fontFamily: display, fontSize: "clamp(20px,2.8vw,30px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.3, color: "#000", marginBottom: 36 }}>
            &ldquo;Ask it anything — whether your setup qualifies, how to draw a fib, why you keep making the same mistake. It gives you the WSA answer. Not the generic answer.&rdquo;
          </blockquote>

          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1, background: "rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.12)" }}>
            {[
              { title: "Trained on real sessions",  desc: "The actual Q&As, breakdowns, and live content from years of WSA." },
              { title: "Answers in Cue's voice",    desc: "Direct. No hedging. If your thinking is wrong, it tells you — and explains the right way." },
              { title: "Available 24/7",             desc: "3am question about a setup? Ask it. No waiting for the next call." },
              { title: "Roadmap-aware",              desc: "Knows the full curriculum. Walks you through any phase or concept." },
            ].map(({ title, desc }) => (
              <div key={title} style={{ background: acid, padding: "24px 20px" }}>
                <div style={{ fontFamily: display, fontSize: 15, fontWeight: 700, color: "#000", marginBottom: 8 }}>{title}</div>
                <div style={{ fontFamily: body, fontSize: 13, lineHeight: 1.6, color: "rgba(0,0,0,0.5)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 09 LIVE SESSIONS ════════════════════════════════════════════════════ */}
      <section id="sessions" style={slide}>
        <Ghost n="09" />
        <div style={wrap}>
          <Eyebrow label="Live sessions" />
          <Heading>Real charts.<br /><em style={{ color: acid, fontStyle: "normal" }}>Real time.</em></Heading>
          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 19, lineHeight: 1.7, color: "rgba(255,255,255,0.42)", maxWidth: 580, margin: "20px 0 40px" }}>
            Every live session archived on demand. Go through the core phases first — then use these as the ongoing extension of the system.
          </p>

          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { n: "40+", name: "Chart N Chill",  desc: "Cue live on charts. Real setups, real talk, real decisions. The way he thinks through a trade out loud. Every session on record. New ones added continuously." },
              { n: "27+", name: "CueCAST",         desc: "Market analysis sessions. How Cue prepares for the week — what pairs he's watching, what setups are forming, and what to avoid. His actual process." },
            ].map(({ n, name, desc }) => (
              <div key={name} style={{ background: "#000", padding: "44px 36px" }}>
                <div style={{ fontFamily: display, fontSize: 64, fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(255,255,255,0.05)", lineHeight: 1, marginBottom: 20 }}>{n}</div>
                <div style={{ fontFamily: display, fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", color: bone, marginBottom: 14 }}>{name}</div>
                <div style={{ fontFamily: body, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.32)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 10 INVESTMENT ═══════════════════════════════════════════════════════ */}
      <section id="investment" style={{ ...slide, flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
        <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: display, fontSize: "28vw", fontWeight: 800, color: "rgba(255,255,255,0.015)", lineHeight: 1, pointerEvents: "none" }}>$</div>
        <div style={{ ...wrap, textAlign: "center" }}>
          <div className="ic-reveal" style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: acid, marginBottom: 24 }}>· Investment ·</div>
          <div className="ic-reveal" style={{ fontFamily: display, fontSize: "clamp(80px,14vw,140px)", fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.9, color: bone, margin: "0 0 36px" }}>
            $15,000
          </div>
          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 20, lineHeight: 1.75, color: "rgba(255,255,255,0.42)", maxWidth: 500, margin: "0 auto 40px" }}>
            If you make back 1% of your account consistently — monthly — this pays for itself inside a year. The traders who treat this as an expense don&apos;t make it. The ones who treat it as an investment do.
          </p>
          <div className="ic-reveal" style={{ width: 1, height: 56, background: "rgba(255,255,255,0.07)", margin: "0 auto 32px" }} />
          <div className="ic-reveal" style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
            · One-time · Full program access · Cue AI included ·
          </div>

          <div className="ic-reveal" style={{ marginTop: 52, display: "flex", alignItems: "center", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
            <Link href="/roadmap" style={{ display: "inline-block", background: acid, color: "#000", fontFamily: mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "20px 48px", textDecoration: "none" }}>
              See the roadmap →
            </Link>
            <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>· Limited spots ·</span>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>© 2026 · Wall Street Academy · iknkfx inc</span>
        <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>Private — Not for distribution</span>
      </footer>
    </div>
  );
}
