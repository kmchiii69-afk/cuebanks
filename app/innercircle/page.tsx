"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tier = "standard" | "premium";

const NAV_SECTIONS = [
  { id: "cover",      label: "Overview" },
  { id: "who",        label: "Who It's For" },
  { id: "problem",    label: "The Problem" },
  { id: "quillan",    label: "Quillan Black" },
  { id: "wins",       label: "Student Wins" },
  { id: "proof",      label: "The Receipts" },
  { id: "included",   label: "What's Inside" },
  { id: "roadmap",    label: "The Roadmap" },
  { id: "cue-ai",     label: "Cue AI" },
  { id: "sessions",   label: "Live Sessions" },
  { id: "investment", label: "Investment" },
];

// Student win screenshots from the funnel (real account screenshots)
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

// Cue's documented live trades
const CUE_WIN_IMGS = [
  { src: "/wsa/cue-wins/2.jpg",  label: "$10,299" },
  { src: "/wsa/cue-wins/3.jpg",  label: "$31,464" },
  { src: "/wsa/cue-wins/4.jpg",  label: "$29,703" },
  { src: "/wsa/cue-wins/5.jpg",  label: "$16,068" },
  { src: "/wsa/cue-wins/6.jpg",  label: "$28,790" },
  { src: "/wsa/cue-wins/9.jpg",  label: "$46,800" },
];

// Marquee component — row of images auto-scrolling, reversed for every other row
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

const INCLUDED_STANDARD = [
  { tag: "Core",       n: "16 wks", title: "The 6-Phase Roadmap",   desc: "Every module in exact order. You don't skip phases. Structured the way Cue would've wanted starting out.", exclusive: false },
  { tag: "Exclusive",  n: "10+ yrs", title: "Cue AI",               desc: "AI trained on every session ever recorded. Ask anything, get the WSA answer in his voice.", exclusive: false },
  { tag: "Archive",    n: "40+",    title: "Chart N Chill",          desc: "Live sessions on demand. Cue on charts, real setups, real talk.", exclusive: false },
  { tag: "Archive",    n: "27+",    title: "CueCAST",                desc: "Market analysis recordings. His actual weekly prep process.", exclusive: false },
  { tag: "Live",       n: "4×",     title: "Group Q&A Calls",        desc: "Four live calls across the program. Bring your charts and questions.", exclusive: false },
  { tag: "Structured", n: "6",      title: "Phase Drills",           desc: "Practice between each phase. This is a training program, not a library.", exclusive: false },
];

const INCLUDED_PREMIUM = [
  { tag: "Core",       n: "16 wks", title: "The 6-Phase Roadmap",   desc: "Every module in exact order. You don't skip phases. Structured the way Cue would've wanted starting out.", exclusive: false },
  { tag: "Exclusive",  n: "10+ yrs", title: "Cue AI",               desc: "AI trained on every session ever recorded. Ask anything, get the WSA answer in his voice.", exclusive: false },
  { tag: "Archive",    n: "40+",    title: "Chart N Chill",          desc: "Live sessions on demand. Cue on charts, real setups, real talk.", exclusive: false },
  { tag: "Archive",    n: "27+",    title: "CueCAST",                desc: "Market analysis recordings. His actual weekly prep process.", exclusive: false },
  { tag: "Live",       n: "4×",     title: "Group Q&A Calls",        desc: "Four live calls across the program. Bring your charts and questions.", exclusive: false },
  { tag: "Structured", n: "6",      title: "Phase Drills",           desc: "Practice between each phase. This is a training program, not a library.", exclusive: false },
  { tag: "2.0 Only",   n: "2×",     title: "Personal Setup Calls",   desc: "Two 1-on-1 calls with Quillan. He maps the roadmap to your specific situation and builds your custom plan.", exclusive: true },
  { tag: "2.0 Only",   n: "Custom", title: "Custom Roadmap Config",  desc: "Quillan personally sets your priorities, adjusts the phase order where needed, and defines your targets.", exclusive: true },
  { tag: "2.0 Only",   n: "Direct", title: "Priority Chat Access",   desc: "More direct access to Cue between sessions. Questions don't wait for the next group call.", exclusive: true },
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
    <div className="ic-reveal" style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: invert ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)", marginBottom: 24 }}>
      {label}
    </div>
  );
}

function Heading({ children, invert }: { children: React.ReactNode; invert?: boolean }) {
  return (
    <h2 className="ic-reveal" style={{ fontFamily: display, fontSize: "clamp(48px,6.5vw,80px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", color: invert ? "#000" : bone, margin: 0 }}>
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

// Tier switcher — fixed top-right, for closers only
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
      {(["standard", "premium"] as Tier[]).map((t) => {
        const active = tier === t;
        return (
          <button key={t} onClick={() => setTier(t)} style={{
            background: active ? acid : "transparent",
            border: "none",
            color: active ? "#000" : "rgba(255,255,255,0.35)",
            fontFamily: mono,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            padding: "9px 18px",
            cursor: "pointer",
            transition: "background 0.18s, color 0.18s",
            whiteSpace: "nowrap",
          }}>
            {t === "standard" ? "Inner Circle" : "Inner Circle 2.0"}
          </button>
        );
      })}
    </div>
  );
}

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

  const isPremium = tier === "premium";
  const price = isPremium ? "$15,000" : "$7,500";
  const included = isPremium ? INCLUDED_PREMIUM : INCLUDED_STANDARD;

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
            {/* Tier badge */}
            <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: isPremium ? acid : "rgba(255,255,255,0.25)", transition: "color 0.25s" }}>
              {isPremium ? "Inner Circle 2.0" : "Inner Circle"}
            </span>
          </div>

          <h1 className="ic-reveal" style={{ fontFamily: display, fontSize: "clamp(64px,10vw,110px)", fontWeight: 800, lineHeight: 0.9, letterSpacing: "-0.05em", marginBottom: 32 }}>
            The system.<br />The AI.<br />
            <em style={{ color: acid, fontStyle: "normal" }}>
              {isPremium ? "Your sessions." : "The roadmap."}
            </em>
          </h1>

          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 21, lineHeight: 1.65, color: "rgba(255,255,255,0.45)", maxWidth: 580, marginBottom: 48 }}>
            {isPremium
              ? "A decade of live trading, every framework Quillan has built, plus two personal sessions where he maps the system directly to your situation."
              : "A decade of live trading, hundreds of sessions, every framework Quillan Black has built — packaged into the most complete forex curriculum that exists."}
          </p>

          <div className="ic-reveal" style={{ width: 48, height: 2, background: acid, marginBottom: 40 }} />

          <div className="ic-reveal" style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[
              { n: "6",   l: "Phases" },
              { n: "16",  l: "Weeks" },
              { n: "67+", l: "Live Sessions" },
              ...(isPremium ? [{ n: "2×", l: "Personal Calls" }] : [{ n: "10+", l: "Years of Data" }]),
            ].map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: display, fontSize: 48, fontWeight: 800, letterSpacing: "-0.05em", color: bone, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHO IT'S FOR ══════════════════════════════════════════════════════════ */}
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
              { n: "04", s: "Nobody built the thing for traders who are already serious.", r: " Everything out there is for total beginners. This isn't that." },
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
              { yr: "2025–26",    t: "Built Wall Street Academy — 6-phase roadmap, AI trained on every session ever recorded, packaged from scratch." },
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

      {/* ══ PROOF — COMMUNITY WINS ════════════════════════════════════════════════ */}
      <section id="proof" style={{ ...slide, flexDirection: "column", alignItems: "flex-start", overflow: "hidden", padding: "80px 0" }}>
        {/* Heading stays in the wrap */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 48px", width: "100%", position: "relative", zIndex: 1, marginBottom: 36 }}>
          <Eyebrow label="Community wins" />
          <Heading>The receipts.<br /><em style={{ color: acid, fontStyle: "normal" }}>Real accounts. Real money.</em></Heading>
          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 19, lineHeight: 1.7, color: "rgba(255,255,255,0.4)", maxWidth: 560, marginTop: 16 }}>
            Every one of these was posted live. Not hand-picked after the fact — documented in real time, same system, same rules.
          </p>
        </div>

        {/* Full-bleed marquee rows */}
        <div style={{ width: "100vw", display: "flex", flexDirection: "column", gap: 10, marginLeft: "calc(-50vw + 50%)" }}>
          {/* Row 1 — student wins (→) */}
          <WinMarquee images={STUDENT_WIN_IMGS} height={170} />
          {/* Row 2 — student wins reversed (←) */}
          <WinMarquee images={[...STUDENT_WIN_IMGS].reverse()} reverse height={170} />
          {/* Row 3 — Cue's documented trades (→) */}
          <WinMarquee images={CUE_WIN_IMGS} height={170} />
        </div>

        {/* Stats bar */}
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
            <div className="ic-reveal" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(249,255,60,0.08)", border: "1px solid rgba(249,255,60,0.25)", padding: "8px 16px", marginTop: 20, marginBottom: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: acid }} />
              <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: acid }}>3 exclusive additions in 2.0</span>
            </div>
          )}

          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)", marginTop: 24 }}>
            {included.map(({ tag, n, title, desc, exclusive }) => (
              <div key={title} style={{ background: exclusive ? "rgba(249,255,60,0.04)" : "#000", padding: "22px 22px", borderTop: exclusive ? "1px solid rgba(249,255,60,0.2)" : "none", position: "relative" }}>
                <div style={{ fontFamily: mono, fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: exclusive ? acid : "rgba(255,255,255,0.3)", marginBottom: 9 }}>{tag}</div>
                <div style={{ fontFamily: display, fontSize: 16, fontWeight: 700, letterSpacing: "-0.015em", color: bone, marginBottom: 7, lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontFamily: body, fontSize: 13, lineHeight: 1.6, color: exclusive ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.3)", marginBottom: 14 }}>{desc}</div>
                <div style={{ fontFamily: display, fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", color: exclusive ? "rgba(249,255,60,0.08)" : "rgba(255,255,255,0.04)", lineHeight: 1 }}>{n}</div>
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
            <div className="ic-reveal" style={{ fontFamily: body, fontSize: 16, lineHeight: 1.65, color: "rgba(249,255,60,0.65)", maxWidth: 560, margin: "16px 0 8px", borderLeft: "2px solid rgba(249,255,60,0.3)", paddingLeft: 18 }}>
              In 2.0, Quillan reviews this with you personally on your first call — adjusting emphasis and targets to match where you actually are.
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

      {/* ══ CUE AI — ACID INVERSION ═══════════════════════════════════════════════ */}
      <section id="cue-ai" style={{ ...slide, background: acid, color: "#000", marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", width: "100vw", borderTop: "none" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 48px", width: "100%", position: "relative", zIndex: 1 }}>
          <Eyebrow label="Cue AI" invert />
          <Heading invert>Nobody has built<br />this for forex.</Heading>
          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 21, lineHeight: 1.7, color: "rgba(0,0,0,0.55)", maxWidth: 620, margin: "24px 0 28px" }}>
            {isPremium
              ? "Every session. Every Q&A. Every live call ever recorded — trained into an AI that answers in Cue's voice. In 2.0, you also get direct access to Cue between sessions. Your questions don't wait for the next group call."
              : "Every session. Every Q&A. Every live call Quillan has ever recorded — trained into a single AI that thinks the way he thinks and answers the way he talks on calls."}
          </p>
          <blockquote className="ic-reveal" style={{ borderLeft: "3px solid rgba(0,0,0,0.2)", paddingLeft: 28, fontFamily: display, fontSize: "clamp(20px,2.8vw,30px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.3, color: "#000", marginBottom: 32 }}>
            &ldquo;Ask it anything — whether your setup qualifies, how to draw a fib, why you keep making the same mistake. It gives you the WSA answer. Not the generic answer.&rdquo;
          </blockquote>
          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1, background: "rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.12)" }}>
            {[
              { title: "Trained on real sessions",      desc: "The actual Q&As, breakdowns, and live content from years of WSA." },
              { title: "Answers in Cue's voice",        desc: "Direct. If your thinking is wrong, it says so — then gives you the right way." },
              { title: isPremium ? "Priority access" : "Available 24/7", desc: isPremium ? "2.0 members get more direct access. Not just the AI — Cue himself." : "3am setup question? Ask it. No waiting for the next call." },
              { title: "Roadmap-aware",                  desc: "Knows the full curriculum. Walks you through any phase or concept." },
            ].map(({ title, desc }) => (
              <div key={title} style={{ background: acid, padding: "24px 20px" }}>
                <div style={{ fontFamily: display, fontSize: 15, fontWeight: 700, color: "#000", marginBottom: 8 }}>{title}</div>
                <div style={{ fontFamily: body, fontSize: 13, lineHeight: 1.6, color: "rgba(0,0,0,0.5)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SESSIONS ══════════════════════════════════════════════════════════════ */}
      <section id="sessions" style={slide}>
        <Ghost n="09" />
        <div style={wrap}>
          <Eyebrow label="Live sessions" />
          <Heading>Real charts.<br /><em style={{ color: acid, fontStyle: "normal" }}>Real time.</em></Heading>
          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 19, lineHeight: 1.7, color: "rgba(255,255,255,0.42)", maxWidth: 580, margin: "20px 0 40px" }}>
            Every live session archived on demand. Go through the core phases first — then use these as the ongoing extension of the system.
          </p>
          <div className="ic-reveal" style={{ display: "grid", gridTemplateColumns: isPremium ? "1fr 1fr 1fr" : "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { n: "40+", name: "Chart N Chill",  desc: "Cue live on charts. Real setups, real talk, real decisions. Every session on record, new ones added." },
              { n: "27+", name: "CueCAST",         desc: "Market analysis sessions. How Cue prepares for the week — his actual process." },
              ...(isPremium ? [{ n: "2×", name: "Personal Calls",  desc: "Two 1-on-1 calls with Quillan. Session one: custom roadmap setup. Session two: mid-program review and fine-tuning." }] : []),
            ].map(({ n, name, desc }) => (
              <div key={name} style={{ background: name === "Personal Calls" ? "rgba(249,255,60,0.04)" : "#000", padding: "36px 32px", borderTop: name === "Personal Calls" ? "1px solid rgba(249,255,60,0.2)" : "none" }}>
                <div style={{ fontFamily: display, fontSize: 56, fontWeight: 800, letterSpacing: "-0.05em", color: name === "Personal Calls" ? "rgba(249,255,60,0.07)" : "rgba(255,255,255,0.05)", lineHeight: 1, marginBottom: 16 }}>{n}</div>
                <div style={{ fontFamily: display, fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: name === "Personal Calls" ? acid : bone, marginBottom: 12 }}>{name}</div>
                <div style={{ fontFamily: body, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.32)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ INVESTMENT ════════════════════════════════════════════════════════════ */}
      <section id="investment" style={{ ...slide, flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
        <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: display, fontSize: "28vw", fontWeight: 800, color: "rgba(255,255,255,0.015)", lineHeight: 1, pointerEvents: "none" }}>$</div>
        <div style={{ ...wrap, textAlign: "center" }}>
          <div className="ic-reveal" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: acid }}>· {isPremium ? "Inner Circle 2.0" : "Inner Circle"} ·</span>
          </div>

          <div className="ic-reveal" style={{ fontFamily: display, fontSize: "clamp(80px,14vw,140px)", fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.9, color: bone, margin: "0 0 36px", transition: "opacity 0.2s" }}>
            {price}
          </div>

          <p className="ic-reveal" style={{ fontFamily: body, fontSize: 20, lineHeight: 1.75, color: "rgba(255,255,255,0.42)", maxWidth: 520, margin: "0 auto 16px" }}>
            {isPremium
              ? "Everything in the Inner Circle, plus two personal sessions with Quillan where he builds your custom plan and checks in mid-program. This is the closest thing to having him in your corner directly."
              : "If you make back 1% of your account consistently — monthly — this pays for itself inside a year. The traders who treat this as an expense don't make it."}
          </p>

          {isPremium && (
            <div className="ic-reveal" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(249,255,60,0.07)", border: "1px solid rgba(249,255,60,0.2)", padding: "8px 18px", marginBottom: 8 }}>
              <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: acid }}>Inner Circle ($7,500) + 2 personal calls + custom roadmap + priority access</span>
            </div>
          )}

          <div className="ic-reveal" style={{ width: 1, height: 52, background: "rgba(255,255,255,0.07)", margin: "32px auto" }} />
          <div className="ic-reveal" style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 48 }}>
            · One-time · Full program access · Cue AI included ·
          </div>

          <div className="ic-reveal" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <Link href="/roadmap" style={{ display: "inline-block", background: acid, color: "#000", fontFamily: mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "20px 48px", textDecoration: "none" }}>
              See the roadmap →
            </Link>
            <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>· Limited spots ·</span>
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
