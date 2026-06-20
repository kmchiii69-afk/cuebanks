"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import Logo from "@/components/shared/Logo";
import CueVideoTestimonial from "@/components/page2/CueVideoTestimonial";
import { CUE_TESTIMONIALS } from "@/components/wsa/testimonials";

/* Wall Street Academy — high-ticket offer page.
   Built entirely on the existing WSA design tokens (globals.css :root) and the
   shared .btn classes / Logo / CueVideoTestimonial components. No new palette,
   no new fonts, no new deps. */

const APPLY = "/qualify"; // application gate → qualify → book a call

/* ── win screenshots already extracted into /public ── */
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
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.12 },
    );
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

function SectionHead({ num, label, title, sub }: { num: string; label: string; title: ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 48, maxWidth: 820 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.16em" }}>§ {num}</span>
        <span style={{ width: 22, height: 1, background: "var(--acid)" }} />
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
  return (
    <a href={APPLY} className={variant === "ghost" ? "btn btn-ghost btn-lg" : "btn btn-lg"} style={style}>{children}</a>
  );
}

/* ─────────────────────────  data  ───────────────────────── */

const COMPARISON: { row: string; alone: string; wsa: string }[] = [
  { row: "Strategy", alone: "Random YouTube tips, strategy-hopping", wsa: "One proven framework — the WSA Protocol" },
  { row: "Roadmap", alone: "Guessing what to learn next", wsa: "A month-by-month plan to consistency" },
  { row: "Feedback", alone: "No one reviews your trades", wsa: "Trade reviews + direct coaching" },
  { row: "Accountability", alone: "Quit the moment it gets hard", wsa: "Structure, check-ins, and community" },
  { row: "Psychology", alone: "Revenge trades, fear, blown accounts", wsa: "Discipline systems + mindset training" },
  { row: "Support", alone: "Completely alone", wsa: "Direct access to Cue and the team" },
  { row: "Outcome", alone: "Inconsistent — most blow up", wsa: "Measurable, repeatable progress" },
];

const ROADMAP = [
  { m: "Month 01", t: "Foundation", d: "Forex foundations, risk management, and the mindset systems that keep you in the game. Set up your plan, your journal, and your rules." },
  { m: "Month 02", t: "Execution", d: "Learn the WSA Protocol — confluence, structure, and trade management. Start taking real setups with a framework behind every click." },
  { m: "Month 03", t: "Refinement", d: "Trade reviews, error correction, and advanced systems. We find your leaks and fix them with direct feedback." },
  { m: "Month 04", t: "Consistency", d: "Lock in the routine. Repeatable process, controlled risk, and the accountability to keep compounding after the program." },
];

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

const BONUSES = [
  { t: "The WSA Playbook", d: "Cue's personal trade-plan templates, ready to copy.", v: "$1,500" },
  { t: "Risk Calculator", d: "Size every position to a fixed risk in seconds.", v: "$500" },
  { t: "Trade Journal System", d: "Track, tag, and find your edge in the data.", v: "$750" },
  { t: "Execution Checklist", d: "The pre-trade checklist that kills impulse trades.", v: "$500" },
  { t: "Trading Plan Templates", d: "Build your weekly plan on a proven structure.", v: "$750" },
];

const FAQ = [
  { q: "Why $7,500?", a: "Because this isn't a course — it's a 4-month transformation system with coaching, trade reviews, accountability, and community. You're paying for the fastest, most reliable path to consistency, not a folder of videos. One funded account or one avoided blow-up pays for it many times over." },
  { q: "Why $15,000 for the Inner Circle?", a: "Inner Circle adds biweekly 1-on-1 calls with Cue, a personalized roadmap, direct trade reviews, and priority support. Seats are limited on purpose so Cue can give real attention. It's for people who want the shortest possible distance to consistency." },
  { q: "Is this beginner friendly?", a: "Yes. The roadmap starts at foundations and risk management, then builds to the WSA Protocol. Complete beginners and experienced traders follow the same structure at their own pace — with coaching the whole way." },
  { q: "How much time is required?", a: "Plan for a few focused hours a week. The program is built for real life — busy professionals and parents included. The structure is designed so you implement, not just consume." },
  { q: "What if I've taken courses before?", a: "Most of our students have — and strategy-hopping is exactly why they were stuck. WSA replaces a pile of disconnected tactics with one framework, feedback, and accountability so it finally clicks." },
  { q: "What makes WSA different?", a: "Roadmap, coaching, accountability, trade reviews, direct access, and a decade-plus of recorded webinars. The course is one part — the system around it is what produces consistent traders." },
];

const COST = [
  { t: "Blown accounts", d: "Months of progress gone in a single emotional session." },
  { t: "Inconsistency", d: "Green week, red week — never compounding, never stable." },
  { t: "Emotional decisions", d: "FOMO entries, revenge trades, moving stops in the heat." },
  { t: "Information overload", d: "Ten gurus, ten strategies, zero clarity on what to actually do." },
  { t: "Strategy hopping", d: "Abandoning a system the week before it would've worked." },
];

/* ─────────────────────────  sections  ───────────────────────── */

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
        <div style={{ textAlign: "center", maxWidth: 920, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", border: "1px solid var(--line-2)", borderRadius: 999, marginBottom: 26 }}>
              <span className="pulse" style={{ width: 6, height: 6, background: "var(--acid)", borderRadius: "50%" }} />
              <Eyebrow style={{ fontSize: 10 }}>The WSA Transformation System</Eyebrow>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 68, lineHeight: 1.0, letterSpacing: "-0.03em", color: "var(--bone)", margin: "0 0 22px" }}>
              Stop trading alone. <span style={{ color: "var(--acid)" }}>Start trading with a system.</span>
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 20, lineHeight: 1.6, color: "var(--ash)", maxWidth: 680, margin: "0 auto 32px" }}>
              A proven roadmap, real coaching, and the accountability to follow it through — built on the WSA Protocol Cue Banks refined over 13+ years. This isn&rsquo;t &ldquo;watch videos and hope.&rdquo; It&rsquo;s a path to becoming a consistent trader.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
              <CTA>Apply For Your Seat →</CTA>
              <CTA variant="ghost">Book A Call</CTA>
            </div>
            <Eyebrow color="var(--muted)" style={{ fontSize: 9 }}>· Limited seats · Serious applicants only ·</Eyebrow>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
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

function PricingCard({ featured, name, price, term, lead, features, badge }: { featured?: boolean; name: string; price: string; term: string; lead: string; features: string[]; badge?: string }) {
  return (
    <div style={{ position: "relative", background: "var(--bg-1)", border: featured ? "1px solid var(--acid)" : "1px solid var(--line)", borderTop: `3px solid ${featured ? "var(--acid)" : "var(--line-2)"}`, borderRadius: 14, padding: "36px 32px", display: "flex", flexDirection: "column", boxShadow: featured ? "0 0 80px rgba(249,255,60,0.10)" : "none", overflow: "hidden" }}>
      {featured && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(600px 300px at 50% 0%, rgba(249,255,60,0.08), transparent 60%)" }} />}
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <Eyebrow color={featured ? "var(--acid)" : "var(--ash)"} style={{ fontSize: 10 }}>{name}</Eyebrow>
          {badge && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#000", background: "var(--acid)", padding: "4px 10px", borderRadius: 6 }}>{badge}</span>}
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
        <a href={APPLY} className={featured ? "btn btn-lg" : "btn btn-ghost btn-lg"} style={{ width: "100%", justifyContent: "center", marginTop: "auto" }}>
          {featured ? "Apply For Inner Circle →" : "Apply For Core →"}
        </a>
      </div>
    </div>
  );
}

function Accordion({ items }: { items: { head: ReactNode; body: ReactNode; openByDefault?: boolean }[] }) {
  const [open, setOpen] = useState<number | null>(items.findIndex((i) => i.openByDefault) ?? -1);
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

/* ─────────────────────────  page  ───────────────────────── */

export default function OfferPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--bone)", fontFamily: "var(--font-body)", overflowX: "hidden" }}>
      <style>{`
        @media (max-width: 900px) {
          .ofr-masonry { column-count: 2 !important; }
          .ofr-2col { grid-template-columns: 1fr !important; }
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

      {/* 2 — Cost of trading alone */}
      <Section>
        <Reveal>
          <SectionHead num="01" label="The real cost" title={<>What trading alone actually <em style={{ color: "var(--pink)" }}>costs you.</em></>} sub="It&rsquo;s not just money. It&rsquo;s the years lost to the same cycle — over and over." />
        </Reveal>
        <div className="ofr-4col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {COST.map((c, i) => (
            <Reveal key={i} delay={i * 60}>
              <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderLeft: "2px solid var(--pink)", borderRadius: 10, padding: "26px 26px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--bone)", marginBottom: 8 }}>{c.t}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 3 — Why most traders fail */}
      <Section>
        <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <Reveal>
            <SectionHead num="02" label="The pattern" title={<>Why most traders <em style={{ color: "var(--acid)" }}>never make it.</em></>} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.7, color: "var(--ash)", margin: 0 }}>
              It&rsquo;s almost never the strategy. Traders fail because they operate with <strong style={{ color: "var(--bone)" }}>no structure, no roadmap, no accountability, and no feedback loop.</strong> They learn in random fragments, trade on emotion, and quit the moment a system gets tested. WSA removes every one of those failure points.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { t: "No structure", d: "Learning in random fragments instead of a sequence." },
                { t: "No roadmap", d: "No idea what to focus on this week — or next." },
                { t: "No accountability", d: "Nothing keeps you executing when it gets hard." },
                { t: "No feedback loop", d: "Same mistakes repeat because no one reviews them." },
              ].map((x, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 10, padding: "18px 20px" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--pink)", fontSize: 18 }}>✕</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--bone)" }}>{x.t}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.5, color: "var(--ash)", marginTop: 3 }}>{x.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 4 — The WSA Difference (comparison) */}
      <Section>
        <Reveal><SectionHead num="03" label="The difference" title={<>Trader alone <span style={{ color: "var(--ash)" }}>vs</span> <em style={{ color: "var(--acid)" }}>WSA student.</em></>} sub="Same markets. Completely different outcome." /></Reveal>
        <Reveal delay={80}>
          <div style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr" }}>
              <div style={{ padding: "16px 20px", background: "var(--bg-2)", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ash)" }} />
              <div style={{ padding: "16px 20px", background: "var(--bg-2)", borderLeft: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--pink)" }}>Trader Alone</div>
              <div style={{ padding: "16px 20px", background: "rgba(249,255,60,0.06)", borderLeft: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--acid)" }}>WSA Student</div>
            </div>
            {COMPARISON.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", borderTop: "1px solid var(--line)" }}>
                <div style={{ padding: "16px 20px", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--bone)" }}>{r.row}</div>
                <div style={{ padding: "16px 20px", borderLeft: "1px solid var(--line)", fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.5, color: "var(--ash)" }}>{r.alone}</div>
                <div style={{ padding: "16px 20px", borderLeft: "1px solid var(--line)", background: "rgba(249,255,60,0.03)", fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.5, color: "var(--bone)" }}>✓ {r.wsa}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* 5 — Roadmap */}
      <Section>
        <Reveal><SectionHead num="04" label="The roadmap" title={<>Four months. <em style={{ color: "var(--acid)" }}>One clear path.</em></>} sub="No guessing what to do next. Every month builds on the last." /></Reveal>
        <div className="ofr-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {ROADMAP.map((r, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "2px solid var(--acid)", borderRadius: 10, padding: "26px 24px", display: "flex", flexDirection: "column" }}>
                <Eyebrow style={{ fontSize: 10, marginBottom: 14 }}>{r.m}</Eyebrow>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "var(--bone)", letterSpacing: "-0.02em", marginBottom: 12 }}>{r.t}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{r.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 6 — Inside the vault (curriculum) */}
      <Section>
        <Reveal><SectionHead num="05" label="Inside the vault" title={<>Everything inside <em style={{ color: "var(--acid)" }}>Wall Street Academy.</em></>} sub="A complete curriculum — not a playlist. Organized so you always know what to learn next." /></Reveal>
        <Reveal delay={80}>
          <Accordion
            items={CURRICULUM.map((c, idx) => ({
              openByDefault: idx === 0,
              head: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                  {c.cat}
                  {c.tag && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#000", background: "var(--acid)", padding: "3px 8px", borderRadius: 5 }}>{c.tag}</span>}
                </span>
              ),
              body: (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }} className="ofr-2col">
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

      {/* 7 — Webinar archive */}
      <Section style={{ background: "var(--bg-1)" }}>
        <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 48, alignItems: "center" }}>
          <Reveal>
            <Eyebrow style={{ marginBottom: 16 }}>The moat</Eyebrow>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 88, fontWeight: 800, color: "var(--acid)", letterSpacing: "-0.04em", lineHeight: 0.9, textShadow: "0 0 40px rgba(249,255,60,0.3)" }}>138+</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: "var(--bone)", letterSpacing: "-0.02em", marginTop: 8 }}>recorded webinars</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.65, color: "var(--ash)", marginTop: 18, maxWidth: 460 }}>
              Over a decade of live trading education — through every market cycle, bull and bear. Live breakdowns, Q&amp;A, and the archive most competitors simply can&rsquo;t match.
            </p>
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

      {/* 8 — Community wins gallery */}
      <Section>
        <Reveal><SectionHead num="06" label="Receipts" title={<>Real members. <em style={{ color: "var(--acid)" }}>Real results.</em></>} sub="Cue's documented trades and student wins, posted live. Tap any screenshot to expand." /></Reveal>
        <Reveal delay={80}><Gallery /></Reveal>
      </Section>

      {/* 9 — Video testimonials */}
      <Section style={{ background: "var(--bg-1)" }}>
        <Reveal><SectionHead num="07" label="In their words" title={<>Unscripted. <em style={{ color: "var(--acid)" }}>Unedited.</em></>} sub="Real Wall Street Academy members on what changed when they stopped trading alone." /></Reveal>
        <div className="ofr-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {CUE_TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 70}><CueVideoTestimonial {...t} /></Reveal>
          ))}
        </div>
      </Section>

      {/* 10 — Offer breakdown */}
      <Section id="apply">
        <Reveal><SectionHead num="08" label="Choose your path" title={<>Two ways to <em style={{ color: "var(--acid)" }}>transform.</em></>} sub="Both are complete programs. Inner Circle adds Cue, 1-on-1." /></Reveal>
        <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch" }}>
          <Reveal>
            <PricingCard
              name="WSA Core Program"
              price="$7,500"
              term="4 months"
              lead="Everything you need to follow the roadmap and build consistency — with group coaching and the full WSA system."
              features={["Full curriculum access", "Alternative course layout", "Group coaching calls", "138+ webinar archive", "Community access", "Psychology & discipline training", "The WSA Protocol"]}
            />
          </Reveal>
          <Reveal delay={100}>
            <PricingCard
              featured
              badge="Limited Seats"
              name="WSA Inner Circle"
              price="$15,000"
              term="4–5 months"
              lead="The fastest path. Everything in Core, plus direct, personalized access to Cue and the highest level of coaching."
              features={["Everything in Core, plus:", "Biweekly 1-on-1 calls with Cue", "Personalized roadmap", "Direct trade reviews", "Priority support", "Direct feedback loop", "Advanced private sessions"]}
            />
          </Reveal>
        </div>
      </Section>

      {/* 11 — Bonuses */}
      <Section>
        <Reveal><SectionHead num="09" label="Bonus stack" title={<>Plus everything you need to <em style={{ color: "var(--acid)" }}>execute.</em></>} /></Reveal>
        <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "start" }}>
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {BONUSES.map((b, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 10, padding: "18px 22px" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--bone)" }}>{b.t}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--ash)", marginTop: 3 }}>{b.d}</div>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--acid)", whiteSpace: "nowrap" }}>{b.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ background: "var(--bg-1)", border: "1px solid var(--acid)", borderRadius: 12, padding: "32px 30px", textAlign: "center", boxShadow: "0 0 60px rgba(249,255,60,0.08)" }}>
              <Eyebrow style={{ marginBottom: 14 }}>Total bonus value</Eyebrow>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 60, fontWeight: 800, color: "var(--acid)", letterSpacing: "-0.03em", lineHeight: 1 }}>$4,000</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--ash)", margin: "16px 0 24px" }}>Included free with every program — yours the moment you&rsquo;re accepted.</p>
              <CTA style={{ width: "100%", justifyContent: "center" }}>Apply Now →</CTA>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 12 — Guarantee */}
      <Section style={{ background: "var(--bg-1)" }}>
        <Reveal>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-flex", width: 56, height: 56, borderRadius: "50%", border: "1px solid var(--acid)", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--acid)" strokeWidth="1.8"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" /><path d="M9 12l2 2 4-4" /></svg>
            </div>
            <Eyebrow style={{ marginBottom: 16 }}>The accountability guarantee</Eyebrow>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--bone)", margin: "0 0 20px" }}>
              We don&rsquo;t stop until you make progress.
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 18, lineHeight: 1.7, color: "var(--ash)", margin: 0 }}>
              If you complete onboarding, attend the required sessions, and follow the roadmap — and still don&rsquo;t see measurable progress — Wall Street Academy keeps working with you until you do. This is an accountability commitment, not a refund gimmick. We&rsquo;re invested in the trader you become.
            </p>
            <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 12.5, color: "var(--muted)", marginTop: 22 }}>
              Educational program only. Trading involves substantial risk; results vary and are not guaranteed.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* 13 — FAQ */}
      <Section>
        <Reveal><SectionHead num="10" label="Questions" title={<>Everything you&rsquo;re <em style={{ color: "var(--acid)" }}>wondering.</em></>} /></Reveal>
        <Reveal delay={80}>
          <Accordion items={FAQ.map((f) => ({ head: f.q, body: <p style={{ fontFamily: "var(--font-body)", fontSize: 15.5, lineHeight: 1.65, color: "var(--ash)", margin: 0 }}>{f.a}</p> }))} />
        </Reveal>
      </Section>

      {/* 14 — Final decision */}
      <section style={{ position: "relative", overflow: "hidden", padding: "110px 0" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(900px 500px at 50% 50%, rgba(249,255,60,0.10), transparent 60%)" }} />
        <Wrap style={{ position: "relative", textAlign: "center", maxWidth: 880 }}>
          <Reveal>
            <Eyebrow style={{ marginBottom: 20, justifyContent: "center", display: "flex" }}>One decision left</Eyebrow>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 60, lineHeight: 1.0, letterSpacing: "-0.03em", color: "var(--bone)", margin: "0 0 22px" }}>
              A year from now, you&rsquo;ll either still be guessing — <span style={{ color: "var(--acid)" }}>or trading with a system.</span>
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 19, lineHeight: 1.6, color: "var(--ash)", maxWidth: 640, margin: "0 auto 36px" }}>
              You can keep piecing it together alone and hope it clicks — or follow a proven roadmap with coaching and accountability beside you. The seats are limited and the cohort is by application.
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
