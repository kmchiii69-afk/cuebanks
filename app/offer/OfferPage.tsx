"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import Logo from "@/components/shared/Logo";
import CueVideoTestimonial from "@/components/page2/CueVideoTestimonial";
import { CUE_TESTIMONIALS } from "@/components/wsa/testimonials";

/* Wall Street Academy — /offer rebuilt as a full-screen WEB PITCH DECK.
   Apple-keynote pacing: one idea per ~full-viewport slide, large type, minimal
   copy, scroll-reveal + count-up animations, proximity scroll-snap, strategic
   CTAs only (hero · after proof · final). Same WSA tokens/components — content
   reused from the prior offer page, reorganized into a 14-slide narrative. */

const APPLY = "/qualify";

const SLIDES = ["Promise", "Reality", "Stuck", "Cue", "Shift", "Framework", "How", "Results", "Voices", "Included", "Bonuses", "Offer", "Value", "Apply"];

const STUDENT_WINS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => `/wsa/home/${n}.jpg`);
const CUE_WINS = [2, 3, 4, 5, 6, 7, 8, 9].map((n) => `/wsa/cue-wins/${n}.jpg`);
const PROOF = [...STUDENT_WINS, ...CUE_WINS];

/* ───────── animation hooks ───────── */

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, [threshold]);
  return { ref, seen };
}

function Reveal({ children, delay = 0, y = 28, style }: { children: ReactNode; delay?: number; y?: number; style?: CSSProperties }) {
  const { ref, seen } = useInView<HTMLDivElement>(0.18);
  return (
    <div ref={ref} style={{ opacity: seen ? 1 : 0, transform: seen ? "translateY(0)" : `translateY(${y}px)`, transition: `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.2,0.85,0.25,1) ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

function CountUp({ to, suffix = "", prefix = "", dur = 1600 }: { to: number; suffix?: string; prefix?: string; dur?: number }) {
  const { ref, seen } = useInView<HTMLSpanElement>(0.4);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf = 0; let startTs = 0;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min(1, (ts - startTs) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, dur]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ───────── slide chrome ───────── */

function Eyebrow({ children, color = "var(--acid)", style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color, ...style }}>{children}</div>;
}

/** Full-viewport slide. `align` controls vertical content placement. */
function Slide({ id, n, kicker, children, alt, align = "center", style, className }: { id: string; n: number; kicker?: string; children: ReactNode; alt?: boolean; align?: "center" | "start"; style?: CSSProperties; className?: string }) {
  return (
    <section
      id={id}
      data-slide={n}
      className={`ofr-slide ${className ?? ""}`}
      style={{
        flex: "0 0 100%", width: "100vw", height: "100svh", overflowY: "auto", overflowX: "hidden",
        scrollSnapAlign: "start", position: "relative",
        background: alt ? "var(--bg-1)" : "var(--bg)", ...style,
      }}
    >
      {/* min-height:100% + centered flex keeps slides centered, yet scrollable
          (top reachable) when content is taller than the viewport. */}
      <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: align === "center" ? "center" : "flex-start", padding: "104px 0 96px" }}>
        <div className="ofr-pad" style={{ maxWidth: 1160, width: "100%", margin: "0 auto", padding: "0 64px", position: "relative" }}>
          {kicker && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.1em" }}>{String(n).padStart(2, "0")}</span>
              <span style={{ width: 28, height: 1, background: "var(--acid)" }} />
              <Eyebrow style={{ fontSize: 11 }}>{kicker}</Eyebrow>
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

function Title({ children, size = 64, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return <h2 className="ofr-title" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: "-0.03em", color: "var(--bone)", margin: 0, ...style }}>{children}</h2>;
}

function Lead({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <p style={{ fontFamily: "var(--font-body)", fontSize: 20, lineHeight: 1.6, color: "var(--ash)", margin: 0, maxWidth: 640, ...style }}>{children}</p>;
}

function CTA({ children = "Apply For Your Seat →", variant = "solid", style }: { children?: ReactNode; variant?: "solid" | "ghost"; style?: CSSProperties }) {
  return <a href={APPLY} className={variant === "ghost" ? "btn btn-ghost btn-lg" : "btn btn-lg"} style={style}>{children}</a>;
}

/* fixed deck navigation — top progress + bottom dot rail + slide counter */
function DeckNav({ active, goTo }: { active: number; goTo: (i: number) => void }) {
  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, height: 3, background: "var(--acid)", width: `${((active + 1) / SLIDES.length) * 100}%`, zIndex: 95, transition: "width 320ms ease", boxShadow: "0 0 12px rgba(249,255,60,0.6)" }} />
      <div className="ofr-dots" style={{ position: "fixed", left: "50%", bottom: 18, transform: "translateX(-50%)", zIndex: 95, display: "flex", gap: 9, padding: "9px 14px", borderRadius: 999, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid var(--line)" }}>
        {SLIDES.map((label, i) => (
          <button key={i} onClick={() => goTo(i)} title={label} aria-label={label} style={{ width: 8, height: 8, padding: 0, border: 0, cursor: "pointer", borderRadius: "50%", background: i === active ? "var(--acid)" : "var(--line-2)", boxShadow: i === active ? "0 0 10px rgba(249,255,60,0.7)" : "none", transition: "all 240ms ease", transform: i === active ? "scale(1.35)" : "scale(1)" }} />
        ))}
      </div>
      <div className="ofr-counter" style={{ position: "fixed", right: 24, bottom: 16, zIndex: 95, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "var(--muted)" }}>
        {String(active + 1).padStart(2, "0")} / {SLIDES.length}
      </div>
    </>
  );
}

/* fixed left/right deck arrows (desktop) */
function Arrows({ active, goTo }: { active: number; goTo: (i: number) => void }) {
  const base: CSSProperties = { position: "fixed", top: "50%", transform: "translateY(-50%)", zIndex: 95, width: 46, height: 46, borderRadius: "50%", border: "1px solid var(--line-2)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", color: "var(--bone)", fontSize: 24, lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
  return (
    <div className="ofr-arrows">
      <button aria-label="Previous slide" onClick={() => goTo(active - 1)} disabled={active === 0} style={{ ...base, left: 18, opacity: active === 0 ? 0.25 : 1 }}>‹</button>
      <button aria-label="Next slide" onClick={() => goTo(active + 1)} disabled={active === SLIDES.length - 1} style={{ ...base, right: 18, opacity: active === SLIDES.length - 1 ? 0.25 : 1 }}>›</button>
    </div>
  );
}

function TopBar() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 90, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", background: "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)", pointerEvents: "none" }}>
      <div style={{ pointerEvents: "auto" }}><Logo /></div>
      <a href={APPLY} className="btn" style={{ fontSize: 11, pointerEvents: "auto" }}>Apply →</a>
    </div>
  );
}

/* ───────── data (reused, condensed to one idea/slide) ───────── */

const SIGNALS = [
  { t: "Knowledge without conviction", d: "You've watched the videos — but when it's time to click, you freeze." },
  { t: "Reactive, not proactive", d: "You chase the move after it's happened, instead of planning the setup." },
  { t: "Winning by luck", d: "Your green days feel accidental. You can't repeat them." },
];
const STUCK = ["No system", "No feedback", "No accountability"];
const STATS = [
  { to: 10000, suffix: "+", k: "Traders helped" },
  { to: 138, suffix: "+", k: "Recorded webinars" },
  { to: 13, suffix: "+ yrs", k: "Refining the system" },
];
const MECHANISM = ["Rule-based — not signals, not gambling", "Repeatable setups, the same framework weekly", "Confluence · structure · trade management", "Run it in 2–5 focused hours a day"];
const ROADMAP = [
  { m: "Month 01", t: "Foundation", d: "Foundations, risk, mindset. Audit + your personalized roadmap." },
  { m: "Month 02", t: "Execution", d: "Apply the WSA Protocol on real setups with a framework behind every click." },
  { m: "Month 03", t: "Refinement", d: "Trade reviews and error correction. We find your leaks and fix them." },
  { m: "Month 04", t: "Mastery", d: "Repeatable process, controlled risk, lasting consistency." },
];
const INCLUDED = ["Full curriculum + pattern library", "The WSA Protocol framework", "Strategy & trade-plan templates", "Weekly webinars", "Trade reviews & direct feedback", "138+ webinar archive", "Private community", "Onboarding & CSM support"];
const BONUSES = [
  { t: "Weekly Group Calls", d: "Live coaching, market breakdowns, Chart N Chill & CueCast.", v: "$1,500" },
  { t: "The 138+ Webinar Archive", d: "A decade of recordings across every market cycle.", v: "$2,000" },
  { t: "Community & Events", d: "A private room of serious traders, plus member meetups.", v: "$1,000" },
];
const INVEST = [
  { h: "Avoid one blown account", d: "A single avoided blow-up can cover the program many times over." },
  { h: "Catch one clean swing", d: "One well-executed setup can pay for the entire investment." },
  { h: "Another year stuck", d: "Guessing alone is the most expensive option on the table." },
];
const PATHS = [
  { t: "Stay where you are", tone: "bad" },
  { t: "Figure it out alone", tone: "mid" },
  { t: "Get the system + the coach", tone: "good" },
];

/* ───────── reusable blocks ───────── */

function WinsCarousel() {
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <div className="ofr-carousel" style={{ display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: 14, WebkitOverflowScrolling: "touch" }}>
        {PROOF.map((src, i) => (
          <button key={i} onClick={() => setOpen(src)} className="ofr-shot" style={{ flex: "0 0 auto", width: 240, scrollSnapAlign: "center", padding: 0, border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", cursor: "pointer", background: "var(--bg-1)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Wall Street Academy member win" loading="lazy" style={{ width: "100%", display: "block" }} />
          </button>
        ))}
      </div>
      <Eyebrow color="var(--muted)" style={{ fontSize: 9, marginTop: 16 }}>← Drag to see more receipts · tap to expand →</Eyebrow>
      {open && (
        <div onClick={() => setOpen(null)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.93)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open} alt="Wall Street Academy member win" style={{ maxWidth: "92vw", maxHeight: "90vh", objectFit: "contain", border: "1px solid var(--acid)", borderRadius: 8 }} />
        </div>
      )}
    </>
  );
}

function PricingCard({ featured, name, price, term, lead, features }: { featured?: boolean; name: string; price: string; term: string; lead: string; features: string[] }) {
  return (
    <div style={{ position: "relative", height: "100%", background: "var(--bg)", border: featured ? "1px solid var(--acid)" : "1px solid var(--line)", borderTop: `3px solid ${featured ? "var(--acid)" : "var(--line-2)"}`, borderRadius: 16, padding: "34px 32px", display: "flex", flexDirection: "column", boxShadow: featured ? "0 0 80px rgba(249,255,60,0.10)" : "none", overflow: "hidden" }}>
      {featured && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(600px 300px at 50% 0%, rgba(249,255,60,0.08), transparent 60%)" }} />}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <Eyebrow color={featured ? "var(--acid)" : "var(--ash)"} style={{ fontSize: 10 }}>{name}</Eyebrow>
          {featured && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#000", background: "var(--acid)", padding: "4px 10px", borderRadius: 6 }}>Limited</span>}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 52, fontWeight: 800, color: "var(--bone)", letterSpacing: "-0.03em", lineHeight: 1 }}>{price}</span>
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

export default function OfferPage() {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const animatingRef = useRef(false);
  useEffect(() => { activeRef.current = active; }, [active]);

  // JS-animated horizontal scroll (direct scrollLeft + easing) — reliable across
  // engines where CSS smooth-scroll/scroll-snap fight programmatic scrollTo.
  const goTo = useCallback((i: number) => {
    const root = scroller.current; if (!root) return;
    const idx = Math.max(0, Math.min(SLIDES.length - 1, i));
    const slide = root.children[idx] as HTMLElement | undefined;
    const target = slide ? slide.offsetLeft : idx * root.clientWidth;
    const start = root.scrollLeft;
    const dist = target - start;
    setActive(idx);
    if (Math.abs(dist) < 1) return;
    animatingRef.current = true;
    let t0 = 0; const dur = 480;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min(1, (ts - t0) / dur);
      root.scrollLeft = start + dist * (1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(step);
      else animatingRef.current = false;
    };
    requestAnimationFrame(step);
  }, []);

  // Track the active slide from scroll position, and JS-snap to the nearest
  // panel ~160ms after a free swipe stops (suppressed during goTo animation).
  useEffect(() => {
    const root = scroller.current; if (!root) return;
    let raf = 0; let snapT: ReturnType<typeof setTimeout>;
    const update = () => {
      const i = Math.round(root.scrollLeft / Math.max(1, root.clientWidth));
      setActive(Math.max(0, Math.min(SLIDES.length - 1, i)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
      if (animatingRef.current) return;
      clearTimeout(snapT);
      snapT = setTimeout(() => {
        if (animatingRef.current) return;
        const w = Math.max(1, root.clientWidth);
        const i = Math.round(root.scrollLeft / w);
        if (Math.abs(root.scrollLeft - i * w) > 2) goTo(i);
      }, 160);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { root.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); clearTimeout(snapT); };
  }, [goTo]);

  // keyboard arrows advance the deck
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); goTo(activeRef.current + 1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); goTo(activeRef.current - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  // translate a vertical mouse wheel into horizontal deck movement, but let a
  // taller-than-viewport slide finish scrolling vertically first.
  useEffect(() => {
    const root = scroller.current; if (!root) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const slide = root.querySelectorAll<HTMLElement>("[data-slide]")[activeRef.current];
      if (slide) {
        const down = e.deltaY > 0;
        const atBottom = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 2;
        const atTop = slide.scrollTop <= 2;
        if ((down && !atBottom) || (!down && !atTop)) return;
      }
      e.preventDefault();
      root.scrollLeft += e.deltaY;
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <>
      <style>{`
        @keyframes ofrBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
        .ofr-title { font-size: clamp(34px, 6vw, 72px); }
        .ofr-deck { scrollbar-width: none; }
        .ofr-deck::-webkit-scrollbar { display: none; }
        .ofr-slide { scrollbar-width: none; }
        .ofr-slide::-webkit-scrollbar { display: none; }
        .ofr-carousel::-webkit-scrollbar { height: 6px; }
        .ofr-carousel::-webkit-scrollbar-thumb { background: var(--line-2); border-radius: 3px; }
        .ofr-shot img { transition: transform 400ms cubic-bezier(0.2,0.8,0.2,1); }
        .ofr-shot:hover { border-color: var(--acid) !important; }
        .ofr-shot:hover img { transform: scale(1.05); }
        @media (max-width: 900px) {
          .ofr-2col { grid-template-columns: 1fr !important; }
          .ofr-3col { grid-template-columns: 1fr !important; }
          .ofr-4col { grid-template-columns: 1fr 1fr !important; }
          .ofr-pad { padding-left: 22px !important; padding-right: 22px !important; }
          .ofr-arrows { display: none !important; }
        }
        @media (max-width: 560px) { .ofr-4col { grid-template-columns: 1fr !important; } }
      `}</style>

      <TopBar />
      <DeckNav active={active} goTo={goTo} />
      <Arrows active={active} goTo={goTo} />
      <div ref={scroller} className="ofr-deck" style={{ height: "100svh", display: "flex", flexDirection: "row", overflowX: "auto", overflowY: "hidden", background: "var(--bg)", color: "var(--bone)", fontFamily: "var(--font-body)" }}>

      {/* 01 — BIG PROMISE */}
      <Slide id="slide-1" n={1} className="grid-bg" style={{ overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(1100px 640px at 50% 30%, rgba(249,255,60,0.10), transparent 60%)" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 940, margin: "0 auto" }}>
          <Reveal><Eyebrow style={{ marginBottom: 26, justifyContent: "center", display: "flex" }}>The WSA Transformation · 4-Month Program</Eyebrow></Reveal>
          <Reveal delay={120}>
            <Title style={{ fontSize: "clamp(38px, 6.4vw, 76px)", textAlign: "center" }}>Stop trading alone.<br /><span style={{ color: "var(--acid)" }}>Start trading with a system.</span></Title>
          </Reveal>
          <Reveal delay={240}><Lead style={{ margin: "22px auto 0", textAlign: "center" }}>A proven roadmap, real coaching, and the WSA Protocol Cue refined over 13+ years.</Lead></Reveal>
          <Reveal delay={360} style={{ marginTop: 30 }}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}><CTA /><CTA variant="ghost">Book A Call</CTA></div>
          </Reveal>
          <Reveal delay={520} style={{ marginTop: 30 }}>
            <Eyebrow color="var(--muted)" style={{ fontSize: 9, justifyContent: "center", display: "flex", gap: 8 }}>
              Scroll <span style={{ display: "inline-block", animation: "ofrBob 1.8s ease-in-out infinite" }}>↓</span>
            </Eyebrow>
          </Reveal>
        </div>
      </Slide>

      {/* 02 — THE REALITY */}
      <Slide id="slide-2" n={2} kicker="The painful reality">
        <Reveal><Title>The problem isn&rsquo;t you. <span style={{ color: "var(--pink)" }}>It&rsquo;s trading without a system.</span></Title></Reveal>
        <div className="ofr-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 48 }}>
          {SIGNALS.map((s, i) => (
            <Reveal key={i} delay={i * 120}>
              <div style={{ borderLeft: "2px solid var(--pink)", paddingLeft: 20 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--bone)", marginBottom: 8 }}>{s.t}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 15.5, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Slide>

      {/* 03 — WHY MOST STAY STUCK */}
      <Slide id="slide-3" n={3} kicker="Why most traders stay stuck" alt>
        <Reveal><Title size={72}>Three words keep capable people <span style={{ color: "var(--acid)" }}>exactly where they are.</span></Title></Reveal>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 48 }}>
          {STUCK.map((s, i) => (
            <Reveal key={i} delay={i * 140}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "var(--bone)", padding: "16px 28px", border: "1px solid var(--line)", borderRadius: 12, background: "var(--bg)" }}>
                <span style={{ color: "var(--pink)" }}>✕</span> {s}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={520}><Lead style={{ marginTop: 40 }}>It&rsquo;s rarely the strategy. Everything changes when those three gaps get filled.</Lead></Reveal>
      </Slide>

      {/* 04 — CUE / CREDIBILITY */}
      <Slide id="slide-4" n={4} kicker="Why listen to Cue">
        <Reveal><Title style={{ textAlign: "center", marginBottom: 12 }}>Documented. Public. <span style={{ color: "var(--acid)" }}>Proven.</span></Title></Reveal>
        <Reveal delay={120}><Lead style={{ margin: "0 auto 56px", textAlign: "center" }}>Not theory — a track record posted live since 2019.</Lead></Reveal>
        <div className="ofr-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 140}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px,7vw,84px)", fontWeight: 800, color: "var(--acid)", letterSpacing: "-0.04em", lineHeight: 1, textShadow: "0 0 40px rgba(249,255,60,0.25)" }}>
                  <CountUp to={s.to} suffix={s.suffix} />
                </div>
                <Eyebrow color="var(--ash)" style={{ fontSize: 10, marginTop: 14, justifyContent: "center", display: "flex" }}>{s.k}</Eyebrow>
              </div>
            </Reveal>
          ))}
        </div>
      </Slide>

      {/* 05 — THE SHIFT */}
      <Slide id="slide-5" n={5} kicker="The breakthrough" alt>
        <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
          <Reveal><Title size={68}>The course was never the point.<br /><span style={{ color: "var(--acid)" }}>The system around it is.</span></Title></Reveal>
          <Reveal delay={160}><Lead style={{ margin: "28px auto 0", textAlign: "center" }}>Roadmap. Coaching. Accountability. Trade reviews. That&rsquo;s what turns information into a consistent trader — and it&rsquo;s exactly what WSA is built on.</Lead></Reveal>
        </div>
      </Slide>

      {/* 06 — THE FRAMEWORK */}
      <Slide id="slide-6" n={6} kicker="The framework">
        <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <Reveal>
            <Title size={60}>The <span style={{ color: "var(--acid)" }}>WSA Protocol.</span></Title>
            <Lead style={{ marginTop: 20 }}>A proprietary, rule-based framework refined over 13+ years. It turns guessing into a repeatable process.</Lead>
          </Reveal>
          <Reveal delay={140}>
            <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", borderTop: "2px solid var(--acid)", borderRadius: 14, padding: "34px 32px" }}>
              {MECHANISM.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: i < MECHANISM.length - 1 ? 18 : 0 }}>
                  <span style={{ color: "var(--acid)", fontWeight: 800 }}>✓</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.5, color: "var(--bone)" }}>{m}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Slide>

      {/* 07 — HOW IT WORKS (roadmap) */}
      <Slide id="slide-7" n={7} kicker="How it works" alt>
        <Reveal><Title>Your 4-month <span style={{ color: "var(--acid)" }}>roadmap.</span></Title></Reveal>
        <div className="ofr-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 48 }}>
          {ROADMAP.map((r, i) => (
            <Reveal key={i} delay={i * 120}>
              <div style={{ height: "100%" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, color: "var(--acid)", opacity: 0.4, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--bone)", margin: "10px 0 8px" }}>{r.t}</div>
                <Eyebrow color="var(--ash)" style={{ fontSize: 9, marginBottom: 10 }}>{r.m}</Eyebrow>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{r.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Slide>

      {/* 08 — STUDENT RESULTS */}
      <Slide id="slide-8" n={8} kicker="The proof">
        <Reveal><Title>Real students. <span style={{ color: "var(--acid)" }}>Real receipts.</span></Title></Reveal>
        <Reveal delay={120} style={{ marginTop: 40 }}><WinsCarousel /></Reveal>
      </Slide>

      {/* 09 — VIDEO TESTIMONIALS + mid CTA */}
      <Slide id="slide-9" n={9} kicker="In their words" alt>
        <Reveal><Title>Unscripted. <span style={{ color: "var(--acid)" }}>Unedited.</span></Title></Reveal>
        <div className="ofr-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, margin: "40px 0 36px" }}>
          {CUE_TESTIMONIALS.map((t, i) => <Reveal key={i} delay={i * 90}><CueVideoTestimonial {...t} /></Reveal>)}
        </div>
        <Reveal delay={200} style={{ textAlign: "center" }}><CTA>See if you&rsquo;re a fit →</CTA></Reveal>
      </Slide>

      {/* 10 — WHAT'S INCLUDED */}
      <Slide id="slide-10" n={10} kicker="What's included">
        <Reveal><Title>Everything inside the <span style={{ color: "var(--acid)" }}>program.</span></Title></Reveal>
        <div className="ofr-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 44 }}>
          {INCLUDED.map((v, i) => (
            <Reveal key={i} delay={(i % 4) * 80}>
              <div style={{ height: "100%", background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 12, padding: "22px 22px", display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: "var(--acid)", fontWeight: 800 }}>▸</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "var(--bone)", lineHeight: 1.4 }}>{v}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Slide>

      {/* 11 — BONUSES */}
      <Slide id="slide-11" n={11} kicker="Bonuses & support" alt>
        <Reveal><Title>Accelerate with <span style={{ color: "var(--acid)" }}>community & access.</span></Title></Reveal>
        <div className="ofr-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 44 }}>
          {BONUSES.map((b, i) => (
            <Reveal key={i} delay={i * 120}>
              <div style={{ height: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 14, padding: "30px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <Eyebrow style={{ fontSize: 10 }}>Bonus 0{i + 1}</Eyebrow>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--acid)" }}>{b.v}</span>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 800, color: "var(--bone)", marginBottom: 8 }}>{b.t}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{b.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Slide>

      {/* 12 — OFFER BREAKDOWN */}
      <Slide id="slide-12" n={12} kicker="The offer">
        <Reveal><Title style={{ textAlign: "center" }}>Two ways to <span style={{ color: "var(--acid)" }}>transform.</span></Title></Reveal>
        <div className="ofr-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 44, alignItems: "stretch" }}>
          <Reveal>
            <PricingCard name="WSA Core Program" price="$7,500" term="4 months"
              lead="The full system with group coaching — everything you need to follow the roadmap."
              features={["Full curriculum + WSA Protocol", "Weekly webinars", "Trade-plan templates", "138+ webinar archive", "Community access"]} />
          </Reveal>
          <Reveal delay={120}>
            <PricingCard featured name="WSA Inner Circle" price="$15,000" term="4–5 months"
              lead="The fastest path. Everything in Core, plus direct access to Cue."
              features={["Everything in Core, plus:", "Weekly 1-on-1 webinars with Cue", "Personalized roadmap", "Direct trade reviews", "Priority support"]} />
          </Reveal>
        </div>
      </Slide>

      {/* 13 — PRICE ANCHOR / VALUE + guarantee */}
      <Slide id="slide-13" n={13} kicker="Put it in perspective" alt>
        <Reveal><Title>The real question isn&rsquo;t the price. <span style={{ color: "var(--acid)" }}>It&rsquo;s the cost of waiting.</span></Title></Reveal>
        <div className="ofr-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, margin: "44px 0 36px" }}>
          {INVEST.map((x, i) => (
            <Reveal key={i} delay={i * 120}>
              <div style={{ height: "100%", background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 12, padding: "28px 26px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800, color: "var(--acid)", opacity: 0.5, marginBottom: 12 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800, color: "var(--bone)", marginBottom: 8 }}>{x.h}</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--ash)", margin: 0 }}>{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={360}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", background: "var(--bg)", border: "1px solid var(--acid)", borderRadius: 12, padding: "20px 24px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--acid)" strokeWidth="1.8" style={{ flexShrink: 0 }}><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" /><path d="M9 12l2 2 4-4" /></svg>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 15.5, lineHeight: 1.5, color: "var(--bone)" }}><strong>Accountability guarantee:</strong> follow the program and if you don&rsquo;t see measurable progress, we keep working with you until you do. Not a refund — accountability.</span>
          </div>
        </Reveal>
      </Slide>

      {/* 14 — CTA */}
      <Slide id="slide-14" n={14} style={{ overflow: "hidden", borderBottom: "none" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(900px 520px at 50% 50%, rgba(249,255,60,0.12), transparent 60%)" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 920, margin: "0 auto" }}>
          <Reveal><Eyebrow style={{ marginBottom: 22, justifyContent: "center", display: "flex" }}>The decision</Eyebrow></Reveal>
          <Reveal delay={120}><Title size={72} style={{ textAlign: "center" }}>Keep doing it alone — or get the system <span style={{ color: "var(--acid)" }}>and the coach.</span></Title></Reveal>
          <Reveal delay={240}>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", margin: "32px 0" }}>
              {PATHS.map((p, i) => (
                <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: p.tone === "good" ? "#000" : "var(--ash)", background: p.tone === "good" ? "var(--acid)" : "transparent", border: p.tone === "good" ? "none" : "1px solid var(--line-2)", padding: "10px 18px", borderRadius: 999 }}>{p.t}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={360}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}><CTA>Apply For Your Seat →</CTA><CTA variant="ghost">Book A Call</CTA></div>
            <Eyebrow color="var(--muted)" style={{ fontSize: 9, marginTop: 22, justifyContent: "center", display: "flex" }}>· Serious applicants only · 2026 cohort ·</Eyebrow>
          </Reveal>
        </div>
      </Slide>
      </div>
    </>
  );
}
