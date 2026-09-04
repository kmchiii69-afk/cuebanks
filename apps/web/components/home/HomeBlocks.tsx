import Reveal from "./Reveal";
import { HomeEyebrow, HomeSecHead, HomeWrap, TypeformApplyLink } from "./HomeSection";
import { funnelBtn, funnelBtnGhost } from "./funnel";

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
    <section id="reviews" className="bg-white py-[60px] text-center text-black">
      <HomeWrap>
        <Reveal>
          <div className="text-[2rem] tracking-[0.1em] text-[#f6b500]">★★★★★</div>
          <div className="my-2 font-h2 text-[3rem] font-black text-black">
            {REVIEW_STATS.average.toFixed(2)}
            <span className="text-[1.4rem] text-muted">/5</span>
          </div>
          <div className="font-h1 font-semibold text-muted">
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
      className="bg-[linear-gradient(180deg,#0a0d14,#05070b)] py-[74px]"
    >
      <HomeWrap>
        <Reveal>
          <HomeSecHead
            eyebrow="What's Inside"
            title="The complete WSA Inner Circle system."
            sub="Everything used over the past 9 years to take traders from inconsistent and emotional to disciplined and profitable."
          />
        </Reveal>
        <div className="grid gap-4 max-[760px]:grid-cols-1 min-[761px]:grid-cols-2">
          {INCLUDED.map((f, i) => (
            <Reveal key={f.title} delayMs={i * 50}>
              <div className="flex items-start gap-3.5 rounded-[10px] border border-line-2 bg-[#0c0f16] p-5">
                <span
                  className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-wsa-green text-[0.9rem] font-black text-black"
                  aria-hidden
                >
                  ✓
                </span>
                <div>
                  <h3 className="mb-[3px] font-h2 text-[1.02rem] font-bold text-bone">{f.title}</h3>
                  <p className="m-0 font-h1 text-[0.88rem] text-muted">{f.body}</p>
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
    <section className="bg-white py-[34px] text-black">
      <HomeWrap>
        <div className="grid grid-cols-2 gap-[26px] text-center min-[761px]:grid-cols-4 min-[761px]:gap-[18px]">
          {METRICS.map((m) => (
            <div key={m.lab}>
              <div className="font-h2 text-[clamp(1.8rem,4vw,2.6rem)] font-black leading-none text-black">
                {m.num}
                {m.suffix ? <span className="text-wsa-blue">{m.suffix}</span> : null}
              </div>
              <div className="mt-2 font-h1 text-[0.82rem] font-semibold text-muted">{m.lab}</div>
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
      className="bg-[radial-gradient(700px_400px_at_50%_0%,rgba(24,139,246,0.22),transparent_60%),linear-gradient(180deg,#05070b,#000)] py-[84px] text-center"
    >
      <HomeWrap>
        <Reveal>
          <div className="mb-3.5 inline-block">
            <HomeEyebrow>Limited Seats</HomeEyebrow>
          </div>
          <h2 className="mx-auto mb-4 max-w-[18ch] font-h2 text-[clamp(2rem,5vw,3.4rem)] font-extrabold tracking-[-0.01em] text-bone">
            Stop watching videos. Start following a system.
          </h2>
          <p className="mx-auto mb-7 max-w-[48ch] font-h1 text-[1.08rem] text-[#cbd5e0]">
            This is your roadmap — the same framework that took me from retail shelves to
            six-figure trades, now helping everyday traders win in real time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <TypeformApplyLink className={funnelBtn}>
              Apply For Your Seat <span aria-hidden>→</span>
            </TypeformApplyLink>
            <TypeformApplyLink className={funnelBtnGhost}>Book A Free Strategy Call</TypeformApplyLink>
          </div>
          <div className="mt-[22px] inline-block rounded-lg border border-dashed border-acid px-5 py-2.5 font-h2 text-[0.95rem] font-extrabold tracking-[0.08em] text-acid">
            GET 20% OFF YOUR FIRST MONTH — CODE: CUEWEBBY20
          </div>
        </Reveal>
      </HomeWrap>
    </section>
  );
}

export function Disclaimer() {
  return (
    <p className="border-t border-line-2 px-[22px] py-[26px] text-center font-accent text-[0.8rem] text-muted">
      Disclaimer: This is for educational purposes only. Trading involves risk, and you should never
      trade with money you can&apos;t afford to lose. Results are not typical and individual results
      will vary.
    </p>
  );
}
