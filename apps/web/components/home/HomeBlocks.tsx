import Reveal from "./Reveal";
import { HomeEyebrow, HomeSecHead, HomeWrap } from "./HomeSection";

const INCLUDED = [
  {
    title: "120+ hours of training",
    body: "Video lessons, live markups, and full trade recaps.",
  },
  {
    title: "4 group calls per week",
    body: "3 with Cue (incl. Chart & Chill) + 1 with a WSA coach.",
  },
  {
    title: "1-on-1 private support",
    body: "Direct channel with Cue and a dedicated coach.",
  },
  {
    title: "Discord by trading pair",
    body: "Organized channels so you're never lost in the noise.",
  },
  {
    title: "Weekly economic updates",
    body: "Stay ahead of volatility before the market moves.",
  },
  {
    title: "Market Memo journaling",
    body: "Track trades in real time and find your edge.",
  },
];

const METRICS = [
  { num: "10", suffix: "+", lab: "Years live trading experience" },
  { num: "$500K", suffix: "", lab: "Documented in 5 days, posted live" },
  { num: "10,000", suffix: "+", lab: "Traders mentored worldwide" },
  { num: "2–5", suffix: "hrs", lab: "Focused trading per day" },
];

const REVIEW_STATS = {
  average: 4.95,
  count: 135,
};

export function ReviewsStrip() {
  return (
    <section id="reviews" className="bg-[var(--bg-1)] py-[60px] text-center">
      <HomeWrap>
        <Reveal>
          <div className="text-[2rem] tracking-[0.1em] text-[#f6b500]">★★★★★</div>
          <div className="my-2 text-[3rem] font-black tracking-[-0.03em] text-[var(--bone)]">
            {REVIEW_STATS.average.toFixed(2)}
            <span className="text-[1.4rem] text-[var(--muted)]">/5</span>
          </div>
          <div className="font-semibold text-[var(--muted)]">
            across {REVIEW_STATS.count}+ verified Inner Circle reviews
          </div>
        </Reveal>
      </HomeWrap>
    </section>
  );
}

export function IncludedSection() {
  return (
    <section
      id="included"
      className="border-y border-[var(--line)] bg-[linear-gradient(180deg,var(--bg-2),var(--bg))] py-[74px]"
    >
      <HomeWrap>
        <Reveal>
          <HomeSecHead
            eyebrow="What's Inside"
            title="The complete WSA Inner Circle system."
            sub="Everything used over the past 9 years to take traders from inconsistent and emotional to disciplined and profitable."
          />
        </Reveal>
        <div className="grid gap-3.5 md:grid-cols-2">
          {INCLUDED.map((f, i) => (
            <Reveal key={f.title} delayMs={i * 50}>
              <div className="flex items-start gap-3.5 rounded-[10px] border border-[var(--line)] bg-[var(--bg-1)] p-5">
                <span className="mt-0.5 font-bold text-[var(--acid)]" aria-hidden>
                  ✓
                </span>
                <div>
                  <h3 className="mb-1 text-base font-bold text-[var(--bone)]">{f.title}</h3>
                  <p className="m-0 text-[var(--ash)]">{f.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </HomeWrap>
    </section>
  );
}

export function MetricsStrip() {
  return (
    <section className="bg-[var(--bg-1)] py-[34px]">
      <HomeWrap>
        <div className="grid grid-cols-2 gap-[26px] text-center lg:grid-cols-4 lg:gap-[18px]">
          {METRICS.map((m) => (
            <div key={m.lab}>
              <div className="text-[clamp(1.8rem,4vw,2.6rem)] font-black leading-none text-[var(--bone)]">
                {m.num}
                {m.suffix ? <span className="text-[var(--acid)]">{m.suffix}</span> : null}
              </div>
              <div className="mt-2 text-sm text-[var(--muted)]">{m.lab}</div>
            </div>
          ))}
        </div>
      </HomeWrap>
    </section>
  );
}

export function FinalCta() {
  return (
    <section
      id="apply"
      className="bg-[radial-gradient(700px_400px_at_50%_0%,rgba(var(--acid-rgb),0.18),transparent_60%),var(--bg)] py-[84px] text-center"
    >
      <HomeWrap>
        <Reveal>
          <div className="mb-3.5 inline-block">
            <HomeEyebrow>Limited Seats</HomeEyebrow>
          </div>
          <h2 className="mx-auto mb-4 max-w-[18ch] text-[clamp(2rem,5vw,3.4rem)] font-bold tracking-[-0.03em] text-[var(--bone)]">
            Stop watching videos. Start following a system.
          </h2>
          <p className="mx-auto mb-7 max-w-[48ch] text-[1.08rem] text-[var(--ash)]">
            This is your roadmap — the same framework that took Cue from retail shelves to
            six-figure trades, now helping everyday traders win in real time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#apply-form" className="btn">
              Apply For Your Seat <span aria-hidden>→</span>
            </a>
            <a href="#apply-form" className="btn btn-ghost">
              Book A Free Strategy Call
            </a>
          </div>
          <div className="mt-[22px] inline-block rounded-lg border border-dashed border-[var(--acid)] px-5 py-2.5 font-[family-name:var(--font-mono)] text-sm font-extrabold tracking-[0.06em] text-[var(--acid)]">
            GET 20% OFF YOUR FIRST MONTH — CODE: CUEWEBBY20
          </div>
        </Reveal>
      </HomeWrap>
    </section>
  );
}

export function Disclaimer() {
  return (
    <p className="border-t border-[var(--line)] px-[22px] py-[26px] text-center font-serif text-[0.8rem] text-[var(--muted)]">
      Disclaimer: This is for educational purposes only. Trading involves risk, and you should never
      trade with money you can&apos;t afford to lose. Results are not typical and individual results
      will vary.
    </p>
  );
}
