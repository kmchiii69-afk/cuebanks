"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import Logo from "@/components/shared/Logo";
import CueVideoTestimonial from "@/components/page2/CueVideoTestimonial";
import { CUE_TESTIMONIALS } from "@/components/wsa/testimonials";

/* Wall Street Academy — high-ticket offer page.
   Narrative arc adapted from the Will Rich / Prophecy pitch deck, rebuilt on the
   existing WSA design tokens (globals.css :root) + shared .btn / Logo /
   CueVideoTestimonial components. No new palette, no new fonts, no new deps. */

const APPLY = "/qualify";

const CUE_WINS = [2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `/wsa/cue-wins/${n}.jpg`);
const STUDENT_WINS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => `/wsa/home/${n}.jpg`);
const GALLERY = [...CUE_WINS, ...STUDENT_WINS];

/* ─────────────────────────  primitives  ───────────────────────── */

function Wrap({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 22px", ...style }}>{children}</div>;
}

function Reveal({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(24px)", transition: `opacity 600ms ease ${delay}ms, transform 600ms cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

function Eyebrow({ children, color = "var(--acid)", style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color, ...style }}>{children}</div>;
}

function SectionHead({ num, label, title, sub, center }: { num?: string; label: string; title: ReactNode; sub?: string; center?: boolean }) {
  return (
    <div style={{ marginBottom: 48, maxWidth: center ? 760 : 820, marginLeft: center ? "auto" : undefined, marginRight: center ? "auto" : undefined, textAlign: center ? "center" : "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, justifyContent: center ? "center" : "flex-start" }}>
        {num && <><span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.16em" }}>§ {num}</span><span style={{ width: 22, height: 1, background: "var(--acid)" }} /></>}
        <Eyebrow style={{ fontSize: 10 }}>{label}</Eyebrow>
      </div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 48, lineHeight: 1.04, letterSpacing: "-0.02em", color: "var(--bone)", margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontFamily: "var(--font-body)", fontSize: 18, lineHeight: 1.6, color: "var(--ash)", margin: "18px 0 0" }}>{sub}</p>}
    </div>
  );
}

function Section({ children, id, style }: { children: ReactNode; id?: string; style?: CSSProperties }) {
  return (
    <section id={id} style={{ padding: "96px 0", borderBottom: "1px solid var(--line)", ...style }}>
      <Wrap>{children}</Wrap>
    </section>
  );
}

function CTA({ children = "Apply Now →", variant = "solid", style }: { children?: ReactNode; variant?: "solid" | "ghost"; style?: CSSProperties }) {
  return <a href={APPLY} className={variant === "ghost" ? "btn btn-ghost btn-lg" : "btn btn-lg"} style={style}>{children}</a>;
}

/* ─────────────────────────  data  ───────────────────────── */

const SIGNALS = [
  { n: "Signal 01", t: "Knowledge without conviction", d: "You've watched the videos and read the threads — but when it's time to click, you freeze. Too much information, not enough clarity." },
  { n: "Signal 02", t: "Reactive, not proactive", d: "You chase the move after it's already happened — buying the candle instead of planning the setup before it prints." },
  { n: "Signal 03", t: "Winning by luck", d: "Your green days feel accidental. You can't repeat them — and deep down you're terrified the next trade gives it all back." },
];

const COST = [
  { t: "The money", d: "Blown accounts and slow bleeds — progress erased in a single emotional session." },
  { t: "The time", d: "Years lost trying to figure it out alone, stitching together ten strategies that never connect." },
  { t: "The stress", d: "That knot in your stomach every time you open your portfolio, never sure what to do next." },
];

const SYSTEM = ["The WSA Protocol framework", "Risk management that keeps you in the game", "Market psychology & discipline systems", "Full curriculum + pattern library", "Plug-and-play trade-plan templates"];
const SUPPORT = ["Group coaching & live calls", "Direct trade reviews & feedback", "Accountability and structure", "Direct access to Cue (Inner Circle)", "A community of serious traders"];

const ROADMAP = [
  { m: "Month 01", t: "Foundation & Audit", d: "Forex foundations, risk management, and the mindset systems that keep you in the game. We audit where you are and build your personalized roadmap." },
  { m: "Month 02", t: "Execution", d: "Learn and apply the WSA Protocol — confluence, structure, trade management. Start taking real setups with a framework behind every click." },
  { m: "Month 03", t: "Refinement", d: "Trade reviews, error correction, and advanced systems. We find your leaks and fix them with direct, personal feedback." },
  { m: "Month 04", t: "Mastery & Consistency", d: "Lock in the routine. Repeatable process, controlled risk, and the accountability to keep compounding long after the program." },
];

const DELIVERABLES = [
  { n: "01", t: "Full Curriculum & WSA Protocol", d: "A complete, sequenced curriculum — foundations to the proprietary WSA Protocol Cue refined over 13+ years. Not a playlist; a system." },
  { n: "02", t: "Personalized Roadmap", d: "Built on your goals, risk tolerance, and timeline — not a generic template. We start with onboarding and map your exact path to consistency." },
  { n: "03", t: "Strategy & Trade-Plan Templates", d: "Plug-and-play systems for swing and intraday. Clear criteria for entry, management, and exit — eliminate the guesswork." },
  { n: "04", t: "Coaching, Reviews & Community", d: "Group coaching, live calls, trade reviews, and direct feedback inside a community of serious traders. The part that actually changes outcomes." },
];

const BONUSES = [
  { tag: "Bonus 01", t: "Weekly Group Calls", d: "Live coaching, market breakdowns, and Q&A — including Chart N Chill and CueCast sessions every week.", v: "$1,500" },
  { tag: "Bonus 02", t: "The 138+ Webinar Archive", d: "Instant access to a decade of recorded sessions across every market cycle — the moat competitors can't match.", v: "$2,000" },
  { tag: "Bonus 03", t: "Community & Events", d: "A private community of serious traders, plus member meetups to network and share strategies in person.", v: "$1,000" },
];

const PATHS = [
  { tag: "Path 01", t: "Stay where you are", d: "Keep doing what you're doing and hope consistency magically appears. Spend the next few years wondering “what if.”", tone: "bad" },
  { tag: "Path 02", t: "Figure it out alone", d: "Buy more courses. Watch more YouTube. Spend 100+ hours building a system from scratch — and maybe get it right.", tone: "mid" },
  { tag: "Path 03", t: "Get the system + the coach", d: "Follow the exact framework, templates, and accountability. Scale with confidence. Always know your next move.", tone: "good" },
];

const ONBOARDING = [
  { n: "01", t: "Apply & Get Accepted", d: "Submit your application so we can understand your situation and confirm WSA is the right fit. Serious applicants only." },
  { n: "02", t: "Book Your Call", d: "Schedule your strategy call. We walk your goals, the roadmap, and exactly how the program works for you." },
  { n: "03", t: "Get Full Access", d: "Once you're in: the full curriculum, the WSA Protocol, templates, coaching calls, and the community — unlocked." },
];

const INVESTMENT = [
  { h: "Avoid one blown account", d: "A single avoided emotional blow-up on a real account can cover the program many times over." },
  { h: "Catch one clean swing", d: "One well-executed setup using the WSA Protocol can pay for your entire investment — and then some." },
  { h: "The cost of another year stuck", d: "Another year guessing alone is the most expensive option on the table. Skill compounds; so does lost time." },
];

const FAQ = [
  { q: "Why is this an investment, not a course price?", a: "Because this isn't a folder of videos — it's a multi-month transformation with coaching, trade reviews, accountability, and community. You're paying for the fastest, most reliable path to consistency. One funded account or one avoided blow-up pays for it many times over." },
  { q: "What's the difference between Core and Inner Circle?", a: "Core gives you the full curriculum, the WSA Protocol, group coaching, the webinar archive, and the community. Inner Circle adds biweekly 1-on-1 calls with Cue, a personalized roadmap, direct trade reviews, and priority support. Seats are limited so Cue can give real attention." },
  { q: "Is this beginner friendly?", a: "Yes. The roadmap starts at foundations and risk management, then builds to the WSA Protocol. Beginners and experienced traders follow the same structure at their own pace — with coaching the whole way." },
  { q: "How much time is required?", a: "Plan for a few focused hours a week. The program is built for real life — busy professionals and parents included. It's designed so you implement, not just consume." },
  { q: "What if I've taken courses before?", a: "Most of our students have — and strategy-hopping is exactly why they were stuck. WSA replaces a pile of disconnected tactics with one framework, feedback, and accountability so it finally clicks." },
  { q: "What makes WSA different?", a: "Roadmap, coaching, accountability, trade reviews, direct access, and a decade-plus of recorded webinars. The curriculum is one part — the system around it is what produces consistent traders." },
];

/* ─────────────────────────  building blocks  ───────────────────────── */

function StickyBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 90, transform: show ? "translateY(0)" : "translateY(-100%)", transition: "transform 280ms cubic-bezier(0.2,0.8,0.2,1)", background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--acid)" }}>
      <Wrap style={{ padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Logo />
        <a href={APPLY} className="btn" style={{ fontSize: 11 }}>Apply Now →</a>
      </Wrap>
    </div>
  );
}

function Hero() {
  const stats = [
    { v: "10,000+", k: "Traders helped" },
    { v: "138+", k: "Recorded webinars" },
    { v: "13+ yrs", k: "Refining the system" },
    { v: "2019", k: "Posting profits publicly since" },
  ];
  return (
    <section className="grid-bg" style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(1000px 600px at 50% -10%, rgba(249,255,60,0.10), transparent 60%)" }} />
      <Wrap style={{ position: "relative", paddingTop: 28, paddingBottom: 88 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 64 }}>
          <Logo />
          <Eyebrow color="var(--ash)" style={{ fontSize: 10 }}>· By application · 2026 cohort ·</Eyebrow>
        </div>
        <div style={{ textAlign: "center", maxWidth: 940, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", border: "1px solid var(--line-2)", borderRadius: 999, marginBottom: 26 }}>
              <span className="pulse" style={{ width: 6, height: 6, background: "var(--acid)", borderRadius: "50%" }} />
              <Eyebrow style={{ fontSize: 10 }}>The WSA Transformation · 4-Month Program</Eyebrow>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 68, lineHeight: 1.0, letterSpacing: "-0.03em", color: "var(--bone)", margin: "0 0 22px" }}>
              Stop trading alone. <span style={{ color: "var(--acid)" }}>Start trading with a system.</span>
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 20, lineHeight: 1.6, color: "var(--ash)", maxWidth: 700, margin: "0 auto 32px" }}>
              A proven roadmap, real coaching, and the accountability to follow it through — built on the WSA Protocol Cue Banks refined over 13+ years. Not &ldquo;watch videos and hope.&rdquo; A direct path to becoming a consistent trader.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
              <CTA>Apply For Your Seat →</CTA>
              <CTA variant="ghost">Book A Call</CTA>
            </div>
            <Eyebrow color="var(--muted)" style={{ fontSize: 9 }}>· Limited seats · Serious applicants only ·</Eyebrow>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div className="ofr-4col" style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 800, color: "var(--acid)", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.v}</div>
                <Eyebrow color="var(--ash)" style={{ fontSize: 9, marginTop: 8 }}>{s.k}</Eyebrow>
              </div>
            ))}
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}

function Gallery() {
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <div style={{ columnCount: 4, columnGap: 14 }} className="ofr-masonry">
        {GALLERY.map((src, i) => (
          <button key={i} onClick={() => setOpen(src)} className="ofr-tile" style={{ display: "block", width: "100%", marginBottom: 14, padding: 0, border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", cursor: "pointer", background: "var(--bg-1)", breakInside: "avoid" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Wall Street Academy member win" loading="lazy" style={{ width: "100%", display: "block" }} />
          </button>
        ))}
      </div>
      {open && (
        <div onClick={() => setOpen(null)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open} alt="Wall Street Academy member win" style={{ maxWidth: "92vw", maxHeight: "90vh", objectFit: "contain", border: "1px solid var(--acid)", borderRadius: 8 }} />
        </div>
      )}
    </>
  );
}

function PricingCard({ featured, name, price, term, lead, features, cta }: { featured?: boolean; name: string; price: string; term: string; lead: string; features: string[]; cta: string }) {
  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg-1)", border: featured ? "1px solid var(--acid)" : "1px solid var(--line)", borderTop: `3px solid ${featured ? "var(--acid)" : "var(--line-2)"}`, borderRadius: 14, padding: "36px 32px", display: "flex", flexDirection: "column", boxShadow: featured ? "0 0 80px rgba(249,255,60,0.10)" : "none", overflow: "hidden" }}>
      {featured && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(600px 300px at 50% 0%, rgba(249,255,60,0.08), transparent 60%)" }} />}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <Eyebrow color={featured ? "var(--acid)" : "var(--ash)"} style={{ fontSize: 10 }}>{name}</Eyebrow>
          {featured && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#000", background: "var(--acid)", padding: "4px 10px", borderRadius: 6 }}>Limited Seats</span>}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 52, fontWeight: 800, color: "var(--bone)", letterSpacing: "-0.03em", lineHeight: 1 }}>{price}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ash)", letterSpacing: "0.1em" }}>· {term}</span>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.55, color: "var(--ash)", margin: "10px 0 24px" }}>{lead}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ color: "var(--acid)", fontWeight: 800, lineHeight: 1.4 }}>✓</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.45, color: "var(--bone)" }}>{f}</span>
            </div>
          ))}
        </div>
        <a href={APPLY} className={featured ? "btn btn-lg" : "btn btn-ghost btn-lg"} style={{ width: "100%", justifyContent: "center", marginTop: "auto" }}>{cta}</a>
      </div>
    </div>
  );
}

function Accordion({ items }: { items: { head: ReactNode; body: ReactNode; openByDefault?: boolean }[] }) {
  const [open, setOpen] = useState<number | null>(() => { const i = items.findIndex((x) => x.openByDefault); return i === -1 ? null : i; });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 10, background: "var(--bg-1)", overflow: "hidden" }}>
            <button onClick={() => setOpen(isOpen ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "20px 24px", background: "transparent", border: 0, cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--bone)" }}>{it.head}</span>
              <span style={{ color: "var(--acid)", fontSize: 22, lineHeight: 1, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 200ms ease" }}>+</span>
            </button>
            {isOpen && <div style={{ padding: "0 24px 22px" }}>{it.body}</div>}
          </div>
        );
      })}
    </div>
  );
}

const CURRICULUM: { cat: string; tag?: string; items: string[] }[] = [
  { cat: "The WSA Protocol", tag: "Core framework · 13+ years", items: ["Confluence Trading", "Trade Management", "ADX", "Live Trade Frameworks", "Technical Error Correction"] },
  { cat: "Foundations", items: ["Forex Introduction", "Risk Management"] },
  { cat: "Mental Performance", items: ["Mental Health Training", "Trading Psychology", "Discipline Systems", "Fear Management", "Revenge Trading", "Risk Acceptance", "Money Psychology"] },
  { cat: "Technical Analysis", items: ["Trend Identification", "Support & Resistance", "Supply & Demand", "Trendlines"] },
  { cat: "Market Structure", items: ["Fibonacci", "Market Structure", "Top-Down Analysis"] },
  { cat: "Advanced Training", items: ["Ichimoku", "Donchian Channels", "Pivot Points", "Naked Charts"] },
  { cat: "Pattern Library", items: ["Head & Shoulders", "Double Tops", "Double Bottoms", "Wedges", "Triangles", "Pennants"] },
  { cat: "Business & Wealth", items: ["Taxes", "LLC Setup", "Financial Management"] },
];

/* ─────────────────────────  page  ───────────────────────── */

export default function OfferPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--bone)", fontFamily: "var(--font-body)", overflowX: "hidden" }}>
      <style>{`
        @media (max-width: 900px) {
          .ofr-masonry { column-count: 2 !important; }
          .ofr-2col { grid-template-columns: 1fr !important; }
          .ofr-3col { grid-template-columns: 1fr !important; }
          .ofr-4col { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .ofr-masonry { column-count: 1 !important; }
          .ofr-4col { grid-template-columns: 1fr !important; }
        }
        .ofr-tile img { transition: transform 400ms cubic-bezier(0.2,0.8,0.2,1); }
        .ofr-tile:hover { border-color: var(--acid) !important; }
        .ofr-tile:hover img { transform: scale(1.04); }
      `}</style>

      <StickyBar />
      <Hero />

      {/* 01 — The invisible struggle */}
      <Section>
        <Reveal><SectionHead num="01" label="The invisible struggle" title={<>Why smart traders get <em style={{ color: "var(--pink)" }}>stuck</em> at the same level.</>} sub="It&rsquo;s rarely the strategy. It&rsquo;s the three quiet patterns that keep capable people exactly where they are." /></Reveal>
        <div className="ofr-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {SIGNALS.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "2px solid var(--pink)", borderRadius: 12, padding: "30px 28px" }}>
                <Eyebrow color="var(--pink)" style={{ fontSize: 10, marginBottom: 16 }}>{s.n}</Eyebrow>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--bone)", letterSpacing: "-0.01em", marginBottom: 10 }}>{s.t}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 02 — Cost of staying stuck */}
      <Section style={{ background: "var(--bg-1)" }}>
        <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center" }}>
          <Reveal>
            <SectionHead num="02" label="The real cost" title={<>The cost of <em style={{ color: "var(--acid)" }}>staying stuck.</em></>} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {COST.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, padding: "18px 20px" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--pink)", fontSize: 18, lineHeight: 1.3 }}>›</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--bone)" }}>{c.t}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.5, color: "var(--ash)", marginTop: 3 }}>{c.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ background: "var(--bg)", border: "1px solid var(--acid)", borderRadius: 14, padding: "44px 36px", textAlign: "center", boxShadow: "0 0 60px rgba(249,255,60,0.08)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 88, fontWeight: 800, color: "var(--acid)", letterSpacing: "-0.04em", lineHeight: 0.9, textShadow: "0 0 40px rgba(249,255,60,0.3)" }}>100%</div>
              <Eyebrow style={{ marginTop: 16 }}>Opportunity cost</Eyebrow>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.55, color: "var(--ash)", margin: "12px 0 0" }}>Of the trades you never take. Every day you wait, the market moves without you.</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 03 — The solution (system + support) */}
      <Section>
        <Reveal><SectionHead num="03" label="The solution" title={<>You need <em style={{ color: "var(--acid)" }}>both</em> to win.</>} sub="A system without support gets abandoned. Support without a system goes in circles. WSA gives you both — together." center /></Reveal>
        <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Reveal>
            <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "2px solid var(--acid)", borderRadius: 12, padding: "32px 30px" }}>
              <Eyebrow style={{ marginBottom: 8 }}>The System</Eyebrow>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "var(--bone)", marginBottom: 20 }}>The WSA Protocol</div>
              {SYSTEM.map((f, i) => <Bullet key={i}>{f}</Bullet>)}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "2px solid var(--blue)", borderRadius: 12, padding: "32px 30px" }}>
              <Eyebrow color="var(--blue)" style={{ marginBottom: 8 }}>The Support</Eyebrow>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "var(--bone)", marginBottom: 20 }}>Coaching & Community</div>
              {SUPPORT.map((f, i) => <Bullet key={i} color="var(--blue)">{f}</Bullet>)}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 04 — Roadmap */}
      <Section>
        <Reveal><SectionHead num="04" label="Your transformation" title={<>The 4-month roadmap to <em style={{ color: "var(--acid)" }}>consistency.</em></>} sub="No guessing what to do next. Every month builds on the last." /></Reveal>
        <div className="ofr-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {ROADMAP.map((r, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "2px solid var(--acid)", borderRadius: 10, padding: "26px 24px", display: "flex", flexDirection: "column" }}>
                <Eyebrow style={{ fontSize: 10, marginBottom: 14 }}>{r.m}</Eyebrow>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--bone)", letterSpacing: "-0.02em", marginBottom: 12 }}>{r.t}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{r.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 05 — Core deliverables */}
      <Section style={{ background: "var(--bg-1)" }}>
        <Reveal><SectionHead num="05" label="Core deliverables" title={<>Everything you need to <em style={{ color: "var(--acid)" }}>succeed.</em></>} /></Reveal>
        <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {DELIVERABLES.map((d, i) => (
            <Reveal key={i} delay={(i % 2) * 80}>
              <div style={{ height: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 12, padding: "30px 30px", display: "flex", gap: 20 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: "var(--acid)", lineHeight: 1, opacity: 0.5 }}>{d.n}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--bone)", marginBottom: 8 }}>{d.t}</div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{d.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 06 — Inside the vault (curriculum) */}
      <Section>
        <Reveal><SectionHead num="06" label="Inside the vault" title={<>The complete <em style={{ color: "var(--acid)" }}>curriculum.</em></>} sub="Not a playlist — a sequenced system so you always know what to learn next." /></Reveal>
        <Reveal delay={80}>
          <Accordion
            items={CURRICULUM.map((c, idx) => ({
              openByDefault: idx === 0,
              head: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  {c.cat}
                  {c.tag && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#000", background: "var(--acid)", padding: "3px 8px", borderRadius: 5 }}>{c.tag}</span>}
                </span>
              ),
              body: (
                <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                  {c.items.map((it, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--bone)" }}>
                      <span style={{ color: "var(--acid)" }}>▸</span> {it}
                    </div>
                  ))}
                </div>
              ),
            }))}
          />
        </Reveal>
      </Section>

      {/* 07 — Webinar moat */}
      <Section style={{ background: "var(--bg-1)" }}>
        <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 48, alignItems: "center" }}>
          <Reveal>
            <Eyebrow style={{ marginBottom: 16 }}>The moat</Eyebrow>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 88, fontWeight: 800, color: "var(--acid)", letterSpacing: "-0.04em", lineHeight: 0.9, textShadow: "0 0 40px rgba(249,255,60,0.3)" }}>138+</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: "var(--bone)", letterSpacing: "-0.02em", marginTop: 8 }}>recorded webinars</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.65, color: "var(--ash)", marginTop: 18, maxWidth: 460 }}>Over a decade of live trading education — every market cycle, bull and bear. Live breakdowns, Q&amp;A, and an archive most competitors simply can&rsquo;t match.</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { t: "A decade of recordings", d: "Searchable library spanning every major market cycle." },
                { t: "Live market breakdowns", d: "Real charts, real time, real decisions — explained." },
                { t: "Chart N Chill", d: "Relaxed live sessions breaking down the week's setups." },
                { t: "CueCast", d: "Mindset, markets, and the business of trading." },
              ].map((x, i) => (
                <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 10, padding: "22px 22px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--bone)", marginBottom: 6 }}>{x.t}</div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.5, color: "var(--ash)", margin: 0 }}>{x.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 08 — Real results gallery */}
      <Section>
        <Reveal><SectionHead num="07" label="Real results" title={<>What happens when you have <em style={{ color: "var(--acid)" }}>a system.</em></>} sub="Cue's documented trades and student wins, posted live. Tap any screenshot to expand." /></Reveal>
        <Reveal delay={80}><Gallery /></Reveal>
      </Section>

      {/* 09 — Video testimonials */}
      <Section style={{ background: "var(--bg-1)" }}>
        <Reveal><SectionHead num="08" label="In their words" title={<>Unscripted. <em style={{ color: "var(--acid)" }}>Unedited.</em></>} sub="Real Wall Street Academy members on what changed when they stopped trading alone." /></Reveal>
        <div className="ofr-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {CUE_TESTIMONIALS.map((t, i) => <Reveal key={i} delay={i * 70}><CueVideoTestimonial {...t} /></Reveal>)}
        </div>
      </Section>

      {/* 10 — Bonuses */}
      <Section>
        <Reveal><SectionHead num="09" label="Exclusive bonuses" title={<>Accelerate with <em style={{ color: "var(--acid)" }}>community & access.</em></>} /></Reveal>
        <div className="ofr-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {BONUSES.map((b, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "28px 26px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <Eyebrow style={{ fontSize: 10 }}>{b.tag}</Eyebrow>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--acid)" }}>{b.v}</span>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--bone)", marginBottom: 8 }}>{b.t}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 11 — Offer breakdown / pricing */}
      <Section id="apply" style={{ background: "var(--bg-1)" }}>
        <Reveal><SectionHead num="10" label="Choose your path" title={<>Two ways to <em style={{ color: "var(--acid)" }}>transform.</em></>} sub="Both are complete programs. Inner Circle adds Cue, one-on-one." center /></Reveal>
        <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" }}>
          <Reveal>
            <PricingCard name="WSA Core Program" price="$7,500" term="4 months" cta="Apply For Core →"
              lead="Everything you need to follow the roadmap and build consistency — with group coaching and the full WSA system."
              features={["Full curriculum access", "Alternative course layout", "Group coaching calls", "138+ webinar archive", "Community access", "Psychology & discipline training", "The WSA Protocol"]} />
          </Reveal>
          <Reveal delay={100}>
            <PricingCard featured name="WSA Inner Circle" price="$15,000" term="4–5 months" cta="Apply For Inner Circle →"
              lead="The fastest path. Everything in Core, plus direct, personalized access to Cue and the highest level of coaching."
              features={["Everything in Core, plus:", "Biweekly 1-on-1 calls with Cue", "Personalized roadmap", "Direct trade reviews", "Priority support", "Direct feedback loop", "Advanced private sessions"]} />
          </Reveal>
        </div>
      </Section>

      {/* 12 — The investment (perspective) */}
      <Section>
        <Reveal><SectionHead num="11" label="The investment" title={<>Put it in <em style={{ color: "var(--acid)" }}>perspective.</em></>} sub="The real question isn&rsquo;t whether you can afford this — it&rsquo;s whether you can afford another year without it." /></Reveal>
        <div className="ofr-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {INVESTMENT.map((x, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "30px 28px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: "var(--acid)", lineHeight: 1, opacity: 0.5, marginBottom: 14 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800, color: "var(--bone)", marginBottom: 10 }}>{x.h}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 13 — Guarantee */}
      <Section style={{ background: "var(--bg-1)" }}>
        <Reveal>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-flex", width: 56, height: 56, borderRadius: "50%", border: "1px solid var(--acid)", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--acid)" strokeWidth="1.8"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" /><path d="M9 12l2 2 4-4" /></svg>
            </div>
            <Eyebrow style={{ marginBottom: 16 }}>Skin in the game</Eyebrow>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--bone)", margin: "0 0 20px" }}>We don&rsquo;t stop until you make progress.</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 18, lineHeight: 1.7, color: "var(--ash)", margin: 0 }}>
              Complete onboarding, attend the required sessions, and apply the system — and if you don&rsquo;t see measurable progress toward your goal, Wall Street Academy keeps working with you until you do. This isn&rsquo;t a refund guarantee. It&rsquo;s an accountability guarantee.
            </p>
            <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 12.5, color: "var(--muted)", marginTop: 22 }}>Educational program only. Trading involves substantial risk; results vary and are not guaranteed.</p>
          </div>
        </Reveal>
      </Section>

      {/* 14 — Onboarding process */}
      <Section>
        <Reveal><SectionHead num="12" label="The process" title={<>From application to <em style={{ color: "var(--acid)" }}>full access.</em></>} center /></Reveal>
        <div className="ofr-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {ONBOARDING.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "30px 28px" }}>
                <div style={{ display: "inline-flex", width: 40, height: 40, borderRadius: "50%", background: "var(--acid)", color: "#000", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, marginBottom: 16 }}>{s.n}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--bone)", marginBottom: 8 }}>{s.t}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 15 — The decision (3 paths) */}
      <Section style={{ background: "var(--bg-1)" }}>
        <Reveal><SectionHead num="13" label="The decision" title={<>Three paths <em style={{ color: "var(--acid)" }}>forward.</em></>} center /></Reveal>
        <div className="ofr-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {PATHS.map((p, i) => {
            const accent = p.tone === "good" ? "var(--acid)" : p.tone === "mid" ? "var(--ash)" : "var(--pink)";
            const featured = p.tone === "good";
            return (
              <Reveal key={i} delay={i * 80}>
                <div style={{ height: "100%", background: "var(--bg)", border: featured ? "1px solid var(--acid)" : "1px solid var(--line)", borderTop: `2px solid ${accent}`, borderRadius: 12, padding: "30px 28px", boxShadow: featured ? "0 0 60px rgba(249,255,60,0.08)" : "none", display: "flex", flexDirection: "column" }}>
                  <Eyebrow color={accent} style={{ fontSize: 10, marginBottom: 14 }}>{p.tag}</Eyebrow>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 800, color: "var(--bone)", marginBottom: 10 }}>{p.t}</div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--ash)", margin: 0, flex: 1 }}>{p.d}</p>
                  {featured && <a href={APPLY} className="btn" style={{ marginTop: 22, width: "100%", justifyContent: "center" }}>Choose this path →</a>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* 16 — FAQ */}
      <Section>
        <Reveal><SectionHead num="14" label="Questions" title={<>Everything you&rsquo;re <em style={{ color: "var(--acid)" }}>wondering.</em></>} /></Reveal>
        <Reveal delay={80}>
          <Accordion items={FAQ.map((f) => ({ head: f.q, body: <p style={{ fontFamily: "var(--font-body)", fontSize: 15.5, lineHeight: 1.65, color: "var(--ash)", margin: 0 }}>{f.a}</p> }))} />
        </Reveal>
      </Section>

      {/* 17 — The real question (final close) */}
      <section style={{ position: "relative", overflow: "hidden", padding: "120px 0" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(900px 500px at 50% 50%, rgba(249,255,60,0.10), transparent 60%)" }} />
        <Wrap style={{ position: "relative", textAlign: "center", maxWidth: 900 }}>
          <Reveal>
            <Eyebrow style={{ marginBottom: 20, justifyContent: "center", display: "flex" }}>The real question</Eyebrow>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 56, lineHeight: 1.02, letterSpacing: "-0.03em", color: "var(--bone)", margin: "0 0 22px" }}>
              Keep doing it alone — or get the system <span style={{ color: "var(--acid)" }}>and the coach.</span>
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 19, lineHeight: 1.6, color: "var(--ash)", maxWidth: 660, margin: "0 auto 36px" }}>
              You didn&rsquo;t get this far by accident. The only question left is whether the next year looks like the last one — or like the trader you know you can become. Your first call is free. No obligation. Just a conversation.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <CTA>Apply For Your Seat →</CTA>
              <CTA variant="ghost">Book A Call</CTA>
            </div>
            <Eyebrow color="var(--muted)" style={{ fontSize: 9, marginTop: 22 }}>· Serious applicants only · 2026 cohort ·</Eyebrow>
          </Reveal>
        </Wrap>
      </section>

      {/* footer */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "30px 0" }}>
        <Wrap style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <Logo />
          <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 12, color: "var(--muted)", margin: 0, maxWidth: 720 }}>
            For educational purposes only. Trading involves risk, and you should never trade with money you can&rsquo;t afford to lose. Results are not typical and individual results will vary.
          </p>
        </Wrap>
      </footer>
    </div>
  );
}

function Bullet({ children, color = "var(--acid)" }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
      <span style={{ color, fontWeight: 800, lineHeight: 1.4 }}>✓</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.45, color: "var(--bone)" }}>{children}</span>
    </div>
  );
}
