"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const S = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "0 32px" } as React.CSSProperties,
  section: { padding: "120px 0", borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative" as const, overflow: "hidden" },
  eyebrow: { fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)", marginBottom: 28 },
  eyebrowAcid: { fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: "var(--acid)", marginBottom: 28 },
  ghost: { position: "absolute" as const, top: 72, left: -8, fontFamily: "var(--font-display)", fontSize: "13vw", fontWeight: 800, lineHeight: 1, color: "rgba(255,255,255,0.022)", letterSpacing: "-0.06em", pointerEvents: "none" as const, userSelect: "none" as const, zIndex: 0 },
  body: { fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.42)", maxWidth: 580, marginTop: 20 },
  line: { width: "100%", height: 1, background: "rgba(255,255,255,0.07)" },
};

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

const WINS = [
  {
    quote: "Bought my first car off trading. One year out of high school. I wouldn't have believed it was possible before WSA.",
    name: "WSA Member",
    tag: "First car — 1 year in",
  },
  {
    quote: "Finally got consistent after struggling for two years. The stack changed everything. I stopped taking setups that didn't qualify and my results flipped.",
    name: "WSA Member",
    tag: "Funded account passed",
  },
  {
    quote: "Made money while I was asleep. That used to sound like a scam to me. Now I understand how it actually works — because the system is that clear.",
    name: "WSA Member",
    tag: "Multi-session wins",
  },
  {
    quote: "I'm calmer. More sure of it. Not panicking over every trade. That's the thing nobody tells you — the psychology changes when the system is solid.",
    name: "WSA Member",
    tag: "Full program graduate",
  },
];

const PHASES = [
  { num: "01", weeks: "Weeks 1–2",   title: "Foundation & Mindset",      desc: "Risk management, platform setup, psychology. The most important phase. Cue blew four accounts before he understood this. You don't have to." },
  { num: "02", weeks: "Weeks 2–3",   title: "Reading Price",              desc: "Market structure, support and resistance, supply and demand, the 200 and 50 EMAs. You learn to see what price is actually doing — not what you want it to do." },
  { num: "03", weeks: "Weeks 4–6",   title: "The Confluence System",      desc: "Fibonacci from point A to B. The stack — structure, MAs, fib level, candle confirmation — all aligned before you enter. This is where the system clicks." },
  { num: "04", weeks: "Weeks 7–10",  title: "Entries & Management",       desc: "Break and retest, order blocks, entry models, trade management. This is where you stop guessing and start executing with a reason." },
  { num: "05", weeks: "Weeks 10–13", title: "Live Application",           desc: "Back-testing, journaling, prop firm strategy. The bridge from paper to live. You've built the foundation — now you use it." },
  { num: "06", weeks: "Weeks 13–16", title: "Advanced Concepts",          desc: "ICT concepts, liquidity sweeps, higher-level reads, fine-tuning the system to your style. For when the foundation is locked." },
];

export default function InnerCirclePage() {
  const [activeSection, setActiveSection] = useState("cover");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.25 }
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) { sectionRefs.current[id] = el; observer.observe(el); }
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll(".ic-reveal");
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 35);
            ro.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );
    reveals.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={{ background: "#000", color: "var(--bone)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Left nav ──────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", left: "max(24px, calc(50vw - 400px - 180px))",
        top: "50%", transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: 6, zIndex: 50,
      }}>
        {NAV_SECTIONS.map(({ id, label }) => (
          <button key={id} className={`ic-nav-item${activeSection === id ? " active" : ""}`} onClick={() => jumpTo(id)}>
            {label}
          </button>
        ))}
      </nav>

      {/* ── COVER ─────────────────────────────────────────────────────────────── */}
      <section id="cover" style={{ padding: "140px 0 120px", borderTop: "none", position: "relative" }}>
        <div style={S.wrap}>
          <div className="ic-reveal" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 60 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Wall Street Academy</span>
            <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Private — 2026</span>
          </div>

          <h1 className="ic-reveal" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(52px,8vw,80px)", fontWeight: 800, lineHeight: 0.92, letterSpacing: "-0.045em", marginBottom: 0 }}>
            The system.<br />The AI.<br /><em style={{ color: "var(--acid)", fontStyle: "normal" }}>The roadmap.</em>
          </h1>

          <p className="ic-reveal" style={{ fontFamily: "var(--font-body)", fontSize: 19, lineHeight: 1.65, color: "rgba(255,255,255,0.42)", maxWidth: 520, marginTop: 32 }}>
            A decade of live trading, hundreds of sessions, and every framework Quillan Black has built — packaged into the most complete forex curriculum that exists.
          </p>

          <div className="ic-reveal" style={{ width: 48, height: 2, background: "var(--acid)", margin: "48px 0" }} />

          <div className="ic-reveal" style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            {[{ n: "6", l: "Phases" }, { n: "16", l: "Weeks" }, { n: "67+", l: "Live Sessions" }, { n: "10+", l: "Years of Data" }].map((s) => (
              <div key={s.l} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--bone)", lineHeight: 1 }}>{s.n}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ──────────────────────────────────────────────────────── */}
      <section id="who" style={S.section}>
        <div style={S.wrap}>
          <div style={S.ghost}>01</div>
          <p className="ic-reveal" style={S.eyebrow}>Who this is for</p>
          <h2 className="ic-reveal" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.0, position: "relative", zIndex: 1 }}>
            Not everyone. <em style={{ color: "var(--acid)", fontStyle: "normal" }}>Specifically you.</em>
          </h2>
          <p className="ic-reveal" style={S.body}>This is built for the trader who is already in forex. You know the concepts. You&apos;ve seen setups. But consistency is still escaping you — and you don&apos;t know exactly why.</p>

          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)", marginTop: 48, position: "relative", zIndex: 1 }}>
            {/* Yes column */}
            <div style={{ background: "#000", padding: "28px 24px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--acid)", marginBottom: 16 }}>· This is you ·</div>
              {["Already trading — demo or live", "Understand support & resistance", "Know what a fib retracement is", "Struggling with consistency, not concepts", "Serious about making this work long-term", "Willing to follow a structured system"].map((t) => (
                <div key={t} style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.45)", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{t}</div>
              ))}
            </div>
            {/* No column */}
            <div className="ic-icp-no" style={{ background: "#000", padding: "28px 24px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", marginBottom: 16 }}>· Not a fit ·</div>
              {["Never touched a chart in your life", "Looking for a get-rich shortcut", "Not prepared to do the work", "Want signals to copy, not skills to keep", "Can't be told when your thinking is wrong", "Won't follow the roadmap in order"].map((t) => (
                <div key={t} style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.2)", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.08)" }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ───────────────────────────────────────────────────────── */}
      <section id="problem" style={S.section}>
        <div style={S.wrap}>
          <div style={S.ghost}>02</div>
          <p className="ic-reveal" style={S.eyebrow}>The problem</p>
          <h2 className="ic-reveal" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.0, position: "relative", zIndex: 1 }}>
            Why serious traders stay stuck.
          </h2>

          <div style={{ position: "relative", zIndex: 1, marginTop: 48 }}>
            {[
              { n: "01", body: <><strong style={{ color: "var(--bone)", fontWeight: 600 }}>They learned setups without learning structure first.</strong> The setup is the last thing you look at. If the higher timeframe structure doesn&apos;t support the direction, the setup is noise.</> },
              { n: "02", body: <><strong style={{ color: "var(--bone)", fontWeight: 600 }}>They don&apos;t stack confluence.</strong> One reason to enter is never enough. Structure, moving averages, fib level, and a clean candle close — the stack has to qualify. One piece alone is gambling.</> },
              { n: "03", body: <><strong style={{ color: "var(--bone)", fontWeight: 600 }}>Risk management is an afterthought.</strong> You can have the best read on a trade and still blow your account because you sized wrong. Cue blew four $1,000 accounts learning this. You don&apos;t have to.</> },
              { n: "04", body: <><strong style={{ color: "var(--bone)", fontWeight: 600 }}>Nobody built the thing for traders who are already serious.</strong> Everything out there is for total beginners. This isn&apos;t that.</> },
            ].map(({ n, body }) => (
              <div key={n} className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 22, padding: "22px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.18)", paddingTop: 2 }}>{n}</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.42)" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUILLAN ───────────────────────────────────────────────────────────── */}
      <section id="quillan" style={S.section}>
        <div style={S.wrap}>
          <div style={S.ghost}>03</div>
          <p className="ic-reveal" style={S.eyebrow}>Quillan Black</p>
          <h2 className="ic-reveal" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.0, position: "relative", zIndex: 1 }}>
            Built this from scratch.<br /><em style={{ color: "var(--acid)", fontStyle: "normal" }}>Doesn&apos;t work for anybody.</em>
          </h2>

          <blockquote className="ic-reveal" style={{ borderLeft: "2px solid var(--acid)", paddingLeft: 28, margin: "48px 0", fontFamily: "var(--font-display)", fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3, color: "var(--bone)", position: "relative", zIndex: 1 }}>
            &ldquo;I blew four $1,000 accounts before I understood risk management. That&apos;s when I stopped blaming the market and started building the actual system.&rdquo;
          </blockquote>

          <p className="ic-reveal" style={{ ...S.body, position: "relative", zIndex: 1 }}>
            Quillan has been trading live for over a decade. He developed the confluence system — structure, moving averages, fibonacci, and candle confirmation — across years of real chart time. He teaches 2 to 5 focused hours a day, not all day in front of screens.
          </p>

          <div style={{ position: "relative", zIndex: 1 }}>
            {[
              { yr: "Early",    text: <>Blew four accounts. Learned that <strong style={{ color: "var(--bone)", fontWeight: 600 }}>psychology and risk management kill more traders than bad setups do.</strong></> },
              { yr: "Years 1–5", text: <>Refined the confluence system. Developed the top-down framework — <strong style={{ color: "var(--bone)", fontWeight: 600 }}>Daily → H4 → H1 → M30 → M5</strong> — as the non-negotiable process before every entry.</> },
              { yr: "Years 5–10", text: <>Started teaching. Watched traders make <strong style={{ color: "var(--bone)", fontWeight: 600 }}>the exact same mistakes repeatedly</strong> — and designed the curriculum to interrupt that pattern at the root.</> },
              { yr: "2025–26",   text: <>Built the Wall Street Academy platform — <strong style={{ color: "var(--bone)", fontWeight: 600 }}>6-phase roadmap, AI trained on every session ever recorded,</strong> and a curriculum he would&apos;ve paid anything for when starting.</> },
            ].map(({ yr, text }) => (
              <div key={yr} className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 24, padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", alignItems: "start" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em", paddingTop: 2 }}>{yr}</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.4)" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT WINS ───────────────────────────────────────────────────────── */}
      <section id="wins" style={S.section}>
        <div style={S.wrap}>
          <div style={S.ghost}>04</div>
          <p className="ic-reveal" style={S.eyebrow}>Student wins</p>
          <h2 className="ic-reveal" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.0, position: "relative", zIndex: 1 }}>
            The results nobody<br /><em style={{ color: "var(--acid)", fontStyle: "normal" }}>puts on the feed.</em>
          </h2>
          <p className="ic-reveal" style={{ ...S.body, position: "relative", zIndex: 1 }}>The algorithm shows you the highlight. It never shows you the actual turn — the person who struggled for two years and then flipped everything. These are those people.</p>

          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)", marginTop: 48, position: "relative", zIndex: 1 }}>
            {WINS.map(({ quote, tag }) => (
              <div key={tag} style={{ background: "#000", padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 28, minHeight: 220 }}>
                <blockquote style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, lineHeight: 1.55, letterSpacing: "-0.01em", color: "rgba(255,255,255,0.82)", margin: 0 }}>
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--acid)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ─────────────────────────────────────────────────────── */}
      <section id="included" style={S.section}>
        <div style={S.wrap}>
          <div style={S.ghost}>05</div>
          <p className="ic-reveal" style={S.eyebrow}>What&apos;s inside</p>
          <h2 className="ic-reveal" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.0, position: "relative", zIndex: 1 }}>
            Every tool. <em style={{ color: "var(--acid)", fontStyle: "normal" }}>Nothing missing.</em>
          </h2>
          <p className="ic-reveal" style={{ ...S.body, position: "relative", zIndex: 1 }}>This is not a course library you buy and sit on. Each component connects to the next.</p>

          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)", marginTop: 48, position: "relative", zIndex: 1 }}>
            {/* Full-width top cell */}
            <div style={{ gridColumn: "1 / -1", background: "#000", padding: "36px 32px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--acid)" }}>Core</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--bone)" }}>The 6-Phase Roadmap</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.35)" }}>Every module in the exact order that builds a profitable trader. Risk and mindset first. Reading price second. The confluence system third. You don&apos;t skip phases.</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.05)", lineHeight: 1, marginTop: 8 }}>16 wks</span>
            </div>
            {[
              { tag: "Exclusive", title: "Cue AI",              n: "10+ yrs", desc: "Trained on every session Quillan has ever recorded. Ask anything — it answers in his voice, with his system. Nobody has built this for forex." },
              { tag: "Archive",   title: "Chart N Chill",       n: "40+",     desc: "Live sessions archived on demand. Cue on charts, talking through real setups in real time. New sessions added continuously." },
              { tag: "Archive",   title: "CueCAST Sessions",    n: "27+",     desc: "Market analysis recordings. How Cue reads the market, prepares for sessions, and identifies the setups worth watching." },
              { tag: "Live",      title: "Group Q&A Calls",     n: "4×",      desc: "Four live calls across the program. Bring your charts, bring your questions. Direct answers — not pre-recorded content." },
            ].map(({ tag, title, n, desc }) => (
              <div key={title} style={{ background: "#000", padding: "30px 28px", display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--acid)" }}>{tag}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, letterSpacing: "-0.015em", color: "var(--bone)" }}>{title}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.32)", flex: 1 }}>{desc}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", color: "rgba(255,255,255,0.05)", lineHeight: 1, marginTop: 12 }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROADMAP ───────────────────────────────────────────────────────────── */}
      <section id="roadmap" style={S.section}>
        <div style={S.wrap}>
          <div style={S.ghost}>05</div>
          <p className="ic-reveal" style={S.eyebrow}>The roadmap</p>
          <h2 className="ic-reveal" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.0, position: "relative", zIndex: 1 }}>
            Six phases. <em style={{ color: "var(--acid)", fontStyle: "normal" }}>In this order.</em>
          </h2>
          <p className="ic-reveal" style={{ ...S.body, position: "relative", zIndex: 1 }}>Each phase builds on the last. You don&apos;t skip ahead. The roadmap is a sequence, not a library — and the sequence is intentional.</p>

          <div style={{ marginTop: 48, position: "relative", zIndex: 1 }}>
            {PHASES.map((p) => (
              <div key={p.num} className="ic-reveal ic-phase-row" style={{ display: "grid", gridTemplateColumns: "56px 1fr", gap: 28, padding: "28px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", alignItems: "start", margin: "0 -12px" }}>
                <div style={{ width: 40, height: 40, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.28)" }}>{p.num}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: 8 }}>{p.weeks}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--bone)", marginBottom: 10, lineHeight: 1.2 }}>{p.title}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.35)" }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CUE AI — ACID INVERSION ───────────────────────────────────────────── */}
      <section id="cue-ai" style={{ background: "var(--acid)", color: "#000", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", width: "100vw", padding: "120px 0", borderTop: "none", position: "relative" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 32px" }}>
          <p className="ic-reveal" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginBottom: 28 }}>Cue AI</p>
          <h2 className="ic-reveal" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.0, color: "#000" }}>
            Nobody has built<br />this for forex.
          </h2>
          <p className="ic-reveal" style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.75, color: "rgba(0,0,0,0.55)", maxWidth: 580, marginTop: 20 }}>
            Every session. Every Q&amp;A. Every live call Quillan has ever recorded — trained into a single AI that thinks the way he thinks and answers the way he talks. This isn&apos;t a chatbot bolted onto a course. The data behind it is a decade of real trading content.
          </p>
          <blockquote className="ic-reveal" style={{ borderLeft: "3px solid rgba(0,0,0,0.2)", paddingLeft: 24, margin: "48px 0", fontFamily: "var(--font-display)", fontSize: "clamp(18px,2.8vw,26px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3, color: "#000" }}>
            &ldquo;Ask it anything — whether your setup qualifies, how to draw a fib, why you keep making the same mistake. It gives you the WSA answer. Not the generic answer.&rdquo;
          </blockquote>

          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.12)", marginTop: 48 }}>
            {[
              { title: "Trained on real sessions",  desc: "Not prompted with a summary. Trained on the actual Q&As, breakdowns, and live content from years of WSA sessions." },
              { title: "Answers in Cue's voice",    desc: "Direct. No hedging. If your thinking is wrong, it tells you — and then gives you the right way. Exactly how Cue talks on calls." },
              { title: "Available 24/7",             desc: "3am question about a setup? Ask it. You're not waiting for the next call or digging through old recordings." },
              { title: "Roadmap-aware",              desc: "Knows the full curriculum. Can walk you through any phase, explain any concept, tell you exactly where to focus next." },
            ].map(({ title, desc }) => (
              <div key={title} style={{ background: "var(--acid)", padding: "28px 24px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#000", marginBottom: 8, letterSpacing: "-0.01em" }}>{title}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.65, color: "rgba(0,0,0,0.5)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE SESSIONS ─────────────────────────────────────────────────────── */}
      <section id="sessions" style={S.section}>
        <div style={S.wrap}>
          <div style={S.ghost}>07</div>
          <p className="ic-reveal" style={S.eyebrow}>Live sessions</p>
          <h2 className="ic-reveal" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.0, position: "relative", zIndex: 1 }}>
            Real charts. <em style={{ color: "var(--acid)", fontStyle: "normal" }}>Real time.</em>
          </h2>
          <p className="ic-reveal" style={{ ...S.body, position: "relative", zIndex: 1 }}>Every live session archived. Go through the core phases first — then use these as the ongoing extension of the system.</p>

          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)", marginTop: 48, position: "relative", zIndex: 1 }}>
            {[
              { n: "40+", name: "Chart N Chill",   desc: "Cue live on charts. Real setups, real talk, real decisions — the way he thinks through a trade out loud. Every session on record. New ones added." },
              { n: "27+", name: "CueCAST",          desc: "Market analysis sessions. How Cue prepares for the week — what pairs he's watching, what setups are forming, and what to avoid. His actual process." },
            ].map(({ n, name, desc }) => (
              <div key={name} style={{ background: "#000", padding: "40px 32px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 52, fontWeight: 800, letterSpacing: "-0.05em", color: "rgba(255,255,255,0.05)", lineHeight: 1, marginBottom: 20 }}>{n}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--bone)", marginBottom: 14 }}>{name}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.32)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTMENT ────────────────────────────────────────────────────────── */}
      <section id="investment" style={{ ...S.section, textAlign: "center", padding: "140px 0" }}>
        <div style={S.wrap}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "var(--font-display)", fontSize: "20vw", fontWeight: 800, color: "rgba(255,255,255,0.018)", lineHeight: 1, pointerEvents: "none" }}>$</div>
          <p className="ic-reveal" style={S.eyebrowAcid}>· Investment ·</p>
          <div className="ic-reveal" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(72px,12vw,120px)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, color: "var(--bone)", margin: "32px 0" }}>
            $15,000
          </div>
          <p className="ic-reveal" style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.42)", maxWidth: 480, margin: "0 auto" }}>
            If you make back 1% of your account consistently — monthly — this pays for itself inside a year. The traders who treat this as an expense don&apos;t make it. The ones who treat it as an investment do.
          </p>
          <div className="ic-reveal" style={{ width: 1, height: 60, background: "rgba(255,255,255,0.07)", margin: "48px auto" }} />
          <p className="ic-reveal" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>
            · One-time · Full program access · Cue AI included ·
          </p>
        </div>
      </section>

      {/* ── CLOSE ─────────────────────────────────────────────────────────────── */}
      <section id="close" style={{ ...S.section, padding: "120px 0 160px" }}>
        <div style={S.wrap}>
          <div style={S.ghost}>09</div>
          <p className="ic-reveal" style={S.eyebrow}>How to get in</p>
          <h2 className="ic-reveal" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2, color: "var(--bone)", marginBottom: 28, position: "relative", zIndex: 1 }}>
            I&apos;m working with a very small number of people directly. <em style={{ color: "var(--acid)", fontStyle: "normal" }}>I want to see results, not just sign people up.</em>
          </h2>
          <p className="ic-reveal" style={{ ...S.body, position: "relative", zIndex: 1 }}>
            This isn&apos;t a course you buy and sit on. I&apos;m involved. You get the roadmap, the AI, every session — and I&apos;m building this around the people who are serious about following it through. If that&apos;s you, let&apos;s talk.
          </p>
          <div className="ic-reveal" style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 48, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            <Link href="/roadmap" style={{ display: "inline-block", background: "var(--acid)", color: "#000", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "18px 40px", textDecoration: "none" }}>
              See the roadmap →
            </Link>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>· Limited spots ·</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>© 2026 · Wall Street Academy · iknkfx inc</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)" }}>Private — Not for distribution</span>
      </footer>
    </div>
  );
}
