"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import Logo from "@/components/shared/Logo";
import CueVideoTestimonial from "@/components/page2/CueVideoTestimonial";
import { CUE_TESTIMONIALS } from "@/components/wsa/testimonials";

/* Wall Street Academy — closer's PITCH DECK (/offer-two).
   Same WSA design system as /offer, re-shaped as slides a closer walks through
   live on a call. Path mirrors the discovery script:
   symptom → cost → mechanism → roadmap → vault → proof → offer → de-risk → decision.
   No personal bio, no ad-funnel talk, student-wins as proof, minimal mid-deck
   CTAs (the closer drives the ask). */

const APPLY = "/qualify";
const TOTAL = 11;

// Proof: student wins lead, Cue's documented trades support. No personal income shots.
const STUDENT_WINS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => `/wsa/home/${n}.jpg`);
const CUE_WINS = [2, 3, 4, 5, 6, 7].map((n) => `/wsa/cue-wins/${n}.jpg`);
const PROOF = [...STUDENT_WINS, ...CUE_WINS];

/* ───────── primitives ───────── */

function Reveal({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(22px)", transition: `opacity 600ms ease ${delay}ms, transform 600ms cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`, ...style }}>{children}</div>;
}

function Eyebrow({ children, color = "var(--acid)", style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color, ...style }}>{children}</div>;
}

/** A full deck slide: dark canvas, slide index top-right, generous padding. */
function Slide({ n, kicker, children, alt, style }: { n: number; kicker?: string; children: ReactNode; alt?: boolean; style?: CSSProperties }) {
  return (
    <section style={{ position: "relative", borderBottom: "1px solid var(--line)", background: alt ? "var(--bg-1)" : "var(--bg)", padding: "84px 0", ...style }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          {kicker ? <Eyebrow>{kicker}</Eyebrow> : <span />}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "var(--muted)" }}>{String(n).padStart(2, "0")} / {TOTAL}</span>
        </div>
        {children}
      </div>
    </section>
  );
}

function SlideTitle({ children, style, className }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return <h2 className={className} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 52, lineHeight: 1.03, letterSpacing: "-0.025em", color: "var(--bone)", margin: 0, ...style }}>{children}</h2>;
}

/* ───────── data ───────── */

const SIGNALS = [
  { n: "01", t: "Knowledge without conviction", d: "You've watched the videos and read the threads — but when it's time to click, you freeze." },
  { n: "02", t: "Reactive, not proactive", d: "You chase the move after it's already happened — buying the candle instead of planning the setup." },
  { n: "03", t: "Winning by luck", d: "Your green days feel accidental. You can't repeat them — and the next trade could give it all back." },
];

const COST = [
  { t: "Blown accounts", d: "Progress erased in a single emotional session." },
  { t: "Years lost", d: "Stitching together ten strategies that never connect." },
  { t: "Trades never taken", d: "The opportunity cost of sitting frozen on the sidelines." },
];

const MECHANISM = ["Rule-based — not signals, not gambling", "Repeatable setups, the same framework every week", "Confluence · structure · trade management · error correction", "Run it in 2–5 focused hours a day"];

const ROADMAP = [
  { m: "Month 01", t: "Foundation", d: "Forex foundations, risk management, and the mindset systems. We audit where you are and build your roadmap." },
  { m: "Month 02", t: "Execution", d: "Learn and apply the WSA Protocol. Start taking real setups with a framework behind every click." },
  { m: "Month 03", t: "Refinement", d: "Trade reviews and error correction. We find your leaks and fix them with direct feedback." },
  { m: "Month 04", t: "Mastery", d: "Lock in the routine — repeatable process, controlled risk, lasting consistency." },
];

const VAULT = ["Full curriculum + pattern library", "The WSA Protocol framework", "Strategy & trade-plan templates", "Weekly webinars", "Trade reviews & direct feedback", "138+ webinar archive", "Private community", "Onboarding & CSM support"];

const PATHS = [
  { tag: "Path 01", t: "Stay where you are", d: "Keep guessing and hope consistency appears. Spend the next few years wondering “what if.”", tone: "bad" },
  { tag: "Path 02", t: "Figure it out alone", d: "More courses, more YouTube, 100+ hours building a system from scratch. Maybe it works.", tone: "mid" },
  { tag: "Path 03", t: "Get the system + the coach", d: "Follow the exact framework, templates, and accountability. Scale with confidence.", tone: "good" },
];

const INVEST = [
  { h: "Avoid one blown account", d: "A single avoided blow-up can cover the program many times over." },
  { h: "Catch one clean swing", d: "One well-executed setup can pay for the entire investment." },
  { h: "The cost of another year stuck", d: "Another year guessing alone is the most expensive option on the table." },
];

/* ───────── gallery ───────── */

function Gallery() {
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <div className="d2-masonry" style={{ columnCount: 4, columnGap: 12 }}>
        {PROOF.map((src, i) => (
          <button key={i} onClick={() => setOpen(src)} className="d2-tile" style={{ display: "block", width: "100%", marginBottom: 12, padding: 0, border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", cursor: "pointer", background: "var(--bg-1)", breakInside: "avoid" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Wall Street Academy student win" loading="lazy" style={{ width: "100%", display: "block" }} />
          </button>
        ))}
      </div>
      {open && (
        <div onClick={() => setOpen(null)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open} alt="Wall Street Academy student win" style={{ maxWidth: "92vw", maxHeight: "90vh", objectFit: "contain", border: "1px solid var(--acid)", borderRadius: 8 }} />
        </div>
      )}
    </>
  );
}

function PricingCard({ featured, name, price, term, lead, features }: { featured?: boolean; name: string; price: string; term: string; lead: string; features: string[] }) {
  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg)", border: featured ? "1px solid var(--acid)" : "1px solid var(--line)", borderTop: `3px solid ${featured ? "var(--acid)" : "var(--line-2)"}`, borderRadius: 14, padding: "34px 30px", display: "flex", flexDirection: "column", boxShadow: featured ? "0 0 70px rgba(37,99,235,0.10)" : "none", overflow: "hidden" }}>
      {featured && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(600px 300px at 50% 0%, rgba(37,99,235,0.08), transparent 60%)" }} />}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <Eyebrow color={featured ? "var(--acid)" : "var(--ash)"} style={{ fontSize: 10 }}>{name}</Eyebrow>
          {featured && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#000", background: "var(--acid)", padding: "4px 10px", borderRadius: 6 }}>Limited Seats</span>}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 50, fontWeight: 800, color: "var(--bone)", letterSpacing: "-0.03em", lineHeight: 1 }}>{price}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ash)" }}>· {term}</span>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.55, color: "var(--ash)", margin: "0 0 22px" }}>{lead}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ color: "var(--acid)", fontWeight: 800, lineHeight: 1.4 }}>✓</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.45, color: "var(--bone)" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── page ───────── */

export default function OfferTwoPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--bone)", fontFamily: "var(--font-body)", overflowX: "hidden" }}>
      <style>{`
        @media (max-width: 900px) {
          .d2-masonry { column-count: 2 !important; }
          .d2-2col { grid-template-columns: 1fr !important; }
          .d2-3col { grid-template-columns: 1fr !important; }
          .d2-4col { grid-template-columns: 1fr 1fr !important; }
          .d2-cover-h1 { font-size: 44px !important; }
          .d2-title { font-size: 34px !important; }
        }
        @media (max-width: 560px) { .d2-masonry { column-count: 1 !important; } .d2-4col { grid-template-columns: 1fr !important; } }
        .d2-tile img { transition: transform 400ms cubic-bezier(0.2,0.8,0.2,1); }
        .d2-tile:hover { border-color: var(--acid) !important; }
        .d2-tile:hover img { transform: scale(1.04); }
      `}</style>

      {/* COVER */}
      <section className="grid-bg" style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line)", minHeight: "92vh", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(1000px 600px at 50% 0%, rgba(37,99,235,0.10), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 1120, width: "100%", margin: "0 auto", padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo />
          <Eyebrow color="var(--ash)" style={{ fontSize: 10 }}>· Strategy session · 2026 ·</Eyebrow>
        </div>
        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", maxWidth: 1120, width: "100%", margin: "0 auto", padding: "0 28px" }}>
          <Reveal style={{ maxWidth: 900 }}>
            <Eyebrow style={{ marginBottom: 22 }}>The Wall Street Academy Program</Eyebrow>
            <h1 className="d2-cover-h1" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 80, lineHeight: 0.98, letterSpacing: "-0.035em", color: "var(--bone)", margin: "0 0 24px" }}>
              From guessing<br />to a <span style={{ color: "var(--acid)" }}>system.</span>
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 20, lineHeight: 1.6, color: "var(--ash)", maxWidth: 620 }}>
              A 4-month transformation — roadmap, coaching, and the WSA Protocol Cue Banks refined over 13+ years. Here&rsquo;s exactly how it works.
            </p>
          </Reveal>
        </div>
        <div style={{ position: "relative", maxWidth: 1120, width: "100%", margin: "0 auto", padding: "0 28px 28px" }}>
          <Eyebrow color="var(--muted)" style={{ fontSize: 9 }}>· Symptom → System → Decision ·</Eyebrow>
        </div>
      </section>

      {/* 01 — THE PROBLEM */}
      <Slide n={1} kicker="Why you're stuck">
        <Reveal><SlideTitle className="d2-title">It&rsquo;s rarely the strategy. <span style={{ color: "var(--pink)" }}>It&rsquo;s one of these three.</span></SlideTitle></Reveal>
        <div className="d2-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 44 }}>
          {SIGNALS.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "2px solid var(--pink)", borderRadius: 12, padding: "30px 28px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--pink)", opacity: 0.6, lineHeight: 1, marginBottom: 16 }}>{s.n}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 800, color: "var(--bone)", marginBottom: 10 }}>{s.t}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Slide>

      {/* 02 — THE COST */}
      <Slide n={2} kicker="The cost of staying stuck" alt>
        <div className="d2-2col" style={{ display: "grid", gridTemplateColumns: "1fr 0.85fr", gap: 48, alignItems: "center" }}>
          <Reveal>
            <SlideTitle className="d2-title">Every day you wait, the market moves <span style={{ color: "var(--acid)" }}>without you.</span></SlideTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
              {COST.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, padding: "18px 20px" }}>
                  <span style={{ color: "var(--pink)", fontWeight: 800, fontSize: 18 }}>›</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--bone)" }}>{c.t}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.5, color: "var(--ash)", marginTop: 3 }}>{c.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ background: "var(--bg)", border: "1px solid var(--acid)", borderRadius: 14, padding: "44px 32px", textAlign: "center", boxShadow: "0 0 60px rgba(37,99,235,0.08)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 92, fontWeight: 800, color: "var(--acid)", letterSpacing: "-0.04em", lineHeight: 0.9, textShadow: "0 0 40px rgba(37,99,235,0.3)" }}>100%</div>
              <Eyebrow style={{ marginTop: 16 }}>Opportunity cost</Eyebrow>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.55, color: "var(--ash)", margin: "12px 0 0" }}>Of the trades you never take.</p>
            </div>
          </Reveal>
        </div>
      </Slide>

      {/* 03 — THE MECHANISM (WSA Protocol) */}
      <Slide n={3} kicker="The mechanism">
        <div className="d2-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <Reveal>
            <Eyebrow style={{ marginBottom: 14 }}>The fix for the symptom</Eyebrow>
            <SlideTitle className="d2-title">The <span style={{ color: "var(--acid)" }}>WSA Protocol.</span></SlideTitle>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 18, lineHeight: 1.65, color: "var(--ash)", marginTop: 18 }}>
              A proprietary, rule-based framework Cue refined over 13+ years. It turns guessing into a repeatable process — so your wins stop being accidents.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "2px solid var(--acid)", borderRadius: 12, padding: "32px 30px" }}>
              {MECHANISM.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < MECHANISM.length - 1 ? 16 : 0 }}>
                  <span style={{ color: "var(--acid)", fontWeight: 800, lineHeight: 1.4 }}>✓</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.5, color: "var(--bone)" }}>{m}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Slide>

      {/* 04 — THE ROADMAP */}
      <Slide n={4} kicker="Your transformation" alt>
        <Reveal><SlideTitle className="d2-title">The 4-month roadmap to <span style={{ color: "var(--acid)" }}>consistency.</span></SlideTitle></Reveal>
        <div className="d2-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 44 }}>
          {ROADMAP.map((r, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ height: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderTop: "2px solid var(--acid)", borderRadius: 10, padding: "26px 24px" }}>
                <Eyebrow style={{ fontSize: 10, marginBottom: 14 }}>{r.m}</Eyebrow>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 23, fontWeight: 800, color: "var(--bone)", letterSpacing: "-0.02em", marginBottom: 12 }}>{r.t}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{r.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Slide>

      {/* 05 — THE VAULT / DELIVERABLES */}
      <Slide n={5} kicker="What you get">
        <Reveal><SlideTitle className="d2-title">Everything inside the <span style={{ color: "var(--acid)" }}>program.</span></SlideTitle></Reveal>
        <div className="d2-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 40 }}>
          {VAULT.map((v, i) => (
            <Reveal key={i} delay={(i % 4) * 60}>
              <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 10, padding: "22px 22px", display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: "var(--acid)", fontWeight: 800 }}>▸</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "var(--bone)", lineHeight: 1.4 }}>{v}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Slide>

      {/* 06 — THE PROOF */}
      <Slide n={6} kicker="The proof" alt>
        <Reveal>
          <SlideTitle className="d2-title">Real students. <span style={{ color: "var(--acid)" }}>Real results.</span></SlideTitle>
          <div className="d2-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, margin: "28px 0 36px" }}>
            {[{ v: "10,000+", k: "Traders helped" }, { v: "138+", k: "Recorded webinars" }, { v: "2019", k: "Documented live since" }].map((s, i) => (
              <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, padding: "20px 22px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: "var(--acid)", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.v}</div>
                <Eyebrow color="var(--ash)" style={{ fontSize: 9, marginTop: 8 }}>{s.k}</Eyebrow>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={80}><Gallery /></Reveal>
      </Slide>

      {/* 07 — VIDEO TESTIMONIALS */}
      <Slide n={7} kicker="In their words">
        <Reveal><SlideTitle className="d2-title">Unscripted. <span style={{ color: "var(--acid)" }}>Unedited.</span></SlideTitle></Reveal>
        <div className="d2-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 40 }}>
          {CUE_TESTIMONIALS.map((t, i) => <Reveal key={i} delay={i * 70}><CueVideoTestimonial {...t} /></Reveal>)}
        </div>
      </Slide>

      {/* 08 — THE OFFER (two tiers) */}
      <Slide n={8} kicker="The offer" alt>
        <Reveal><SlideTitle className="d2-title" style={{ textAlign: "center" }}>Two ways to <span style={{ color: "var(--acid)" }}>transform.</span></SlideTitle></Reveal>
        <div className="d2-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 44, alignItems: "stretch" }}>
          <Reveal>
            <PricingCard name="WSA Core Program" price="$7,500" term="4 months"
              lead="The full system with group coaching — everything you need to follow the roadmap and build consistency."
              features={["Full curriculum + WSA Protocol", "Weekly webinars", "Strategy & trade-plan templates", "138+ webinar archive", "Community access", "Psychology & discipline training"]} />
          </Reveal>
          <Reveal delay={100}>
            <PricingCard featured name="WSA Inner Circle" price="$15,000" term="4–5 months"
              lead="The fastest path. Everything in Core, plus direct, personalized access to Cue."
              features={["Everything in Core, plus:", "Weekly 1-on-1 webinars with Cue", "Personalized roadmap", "Direct trade reviews", "Priority support", "Advanced private sessions"]} />
          </Reveal>
        </div>
      </Slide>

      {/* 09 — PRICE JUSTIFICATION */}
      <Slide n={9} kicker="Put it in perspective">
        <Reveal><SlideTitle className="d2-title">The question isn&rsquo;t whether you can afford it — <span style={{ color: "var(--acid)" }}>it&rsquo;s whether you can afford another year stuck.</span></SlideTitle></Reveal>
        <div className="d2-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 44 }}>
          {INVEST.map((x, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "30px 28px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: "var(--acid)", opacity: 0.5, lineHeight: 1, marginBottom: 14 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800, color: "var(--bone)", marginBottom: 10 }}>{x.h}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Slide>

      {/* 10 — THE GUARANTEE */}
      <Slide n={10} kicker="De-risk the decision" alt>
        <Reveal>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-flex", width: 56, height: 56, borderRadius: "50%", border: "1px solid var(--acid)", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--acid)" strokeWidth="1.8"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" /><path d="M9 12l2 2 4-4" /></svg>
            </div>
            <SlideTitle className="d2-title">We don&rsquo;t stop until you make <span style={{ color: "var(--acid)" }}>progress.</span></SlideTitle>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 18, lineHeight: 1.7, color: "var(--ash)", margin: "20px 0 0" }}>
              Complete onboarding, attend the required sessions, and apply the system — and if you don&rsquo;t see measurable progress toward your goal, we keep working with you until you do. Not a refund guarantee. An accountability guarantee.
            </p>
            <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 12.5, color: "var(--muted)", marginTop: 22 }}>Educational program only. Trading involves substantial risk; results vary and are not guaranteed.</p>
          </div>
        </Reveal>
      </Slide>

      {/* 11 — THE DECISION + CLOSE */}
      <Slide n={11} kicker="The decision">
        <Reveal><SlideTitle className="d2-title" style={{ textAlign: "center" }}>Three paths <span style={{ color: "var(--acid)" }}>forward.</span></SlideTitle></Reveal>
        <div className="d2-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 44 }}>
          {PATHS.map((p, i) => {
            const accent = p.tone === "good" ? "var(--acid)" : p.tone === "mid" ? "var(--ash)" : "var(--pink)";
            const featured = p.tone === "good";
            return (
              <Reveal key={i} delay={i * 80}>
                <div style={{ height: "100%", background: "var(--bg-1)", border: featured ? "1px solid var(--acid)" : "1px solid var(--line)", borderTop: `2px solid ${accent}`, borderRadius: 12, padding: "30px 28px", boxShadow: featured ? "0 0 60px rgba(37,99,235,0.08)" : "none" }}>
                  <Eyebrow color={accent} style={{ fontSize: 10, marginBottom: 14 }}>{p.tag}</Eyebrow>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 800, color: "var(--bone)", marginBottom: 10 }}>{p.t}</div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{p.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={120}>
          <div style={{ marginTop: 48, textAlign: "center" }}>
            <a href={APPLY} className="btn btn-lg">Apply For Your Seat →</a>
            <Eyebrow color="var(--muted)" style={{ fontSize: 9, marginTop: 18 }}>· Serious applicants only · 2026 cohort ·</Eyebrow>
          </div>
        </Reveal>
      </Slide>

      {/* footer */}
      <footer style={{ padding: "30px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <Logo />
          <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 12, color: "var(--muted)", margin: 0, maxWidth: 720 }}>
            For educational purposes only. Trading involves risk, and you should never trade with money you can&rsquo;t afford to lose. Results are not typical and individual results will vary.
          </p>
        </div>
      </footer>
    </div>
  );
}
