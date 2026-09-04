import Reveal from "./Reveal";
import { HomeSecHead, HomeWrap } from "./HomeSection";

const PAINS = [
  {
    title: "Emotional trading & second-guessing.",
    body: "You win one week, then give it all back the next chasing the market.",
  },
  {
    title: "Inconsistency & random results.",
    body: "No two weeks look the same because there are no rules.",
  },
  {
    title: "You know what works but don't stick to it.",
    body: "FOMO, revenge trades, and overleveraging undo all the good days.",
  },
  {
    title: "Burnout from living on the charts.",
    body: "12-hour days, 50 indicators, and still blowing accounts.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Trade clean setups",
    body: "Only execute when every rule-based confirmation is met, during optimal NY & London sessions. Minimum 2:1 risk-to-reward.",
  },
  {
    n: "02",
    title: "Track everything",
    body: "Every trade is reviewed post-execution inside your Market Memo journal — entry, exit, session, setup, emotion, and result.",
  },
  {
    n: "03",
    title: "Scale with proof",
    body: "You don't earn the right to scale until the data says so. Size up only when win rate and drawdown control confirm your edge.",
  },
];

const PHASES = [
  { n: "PHASE 01", title: "Define your rules", body: "Clear criteria for entry, exit, risk, and time on charts." },
  { n: "PHASE 02", title: "Session targeting", body: "Trade only NY & London — aligned to session behavior." },
  { n: "PHASE 03", title: "Setup selection", body: "Pullbacks, breakouts & continuations only." },
  { n: "PHASE 04", title: "Risk control", body: "2:1 R:R minimum and daily drawdown caps." },
  { n: "PHASE 05", title: "Trade prep", body: "Pre-plan, rate conviction, log emotional state." },
  { n: "PHASE 06", title: "Execution", body: "Follow rules like muscle memory — no hesitation." },
  { n: "PHASE 07", title: "Market Memo review", body: "Log every result; find the patterns in your data." },
  { n: "PHASE 08", title: "Eliminate bad habits", body: "Cut chasing, FOMO, and overleveraging at the root." },
  { n: "PHASE 09", title: "Scale the edge", body: "Increase size only when the receipts back it up." },
];

export default function PainSolutionMethod() {
  return (
    <>
      <section
        id="problem"
        className="border-y border-[var(--line)] bg-[linear-gradient(180deg,var(--bg-2),var(--bg))] py-[74px]"
      >
        <HomeWrap>
          <Reveal>
            <HomeSecHead
              eyebrow="If This Sounds Familiar…"
              title={
                <>
                  You&apos;ve been told you need to be a{" "}
                  <span className="text-[var(--acid)]">finance genius.</span> You don&apos;t.
                </>
              }
              sub="If you've failed at trading before, it's probably not your fault — you were missing structure, not talent."
            />
          </Reveal>
          <div className="grid gap-3.5">
            {PAINS.map((p, i) => (
              <Reveal key={p.title} delayMs={i * 60}>
                <div className="flex items-start gap-3.5 rounded-[10px] border border-[var(--line)] border-l-[3px] border-l-[var(--pink)] bg-[var(--bg-1)] px-5 py-[18px]">
                  <span className="mt-0.5 font-extrabold text-[var(--pink)]" aria-hidden>
                    ✕
                  </span>
                  <p className="m-0 text-[var(--ash)]">
                    <b className="text-[var(--bone)]">{p.title}</b> {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </HomeWrap>
      </section>

      <section id="how" className="py-[74px]">
        <HomeWrap>
          <Reveal>
            <HomeSecHead
              eyebrow="The Real Secret"
              title={
                <>
                  It&apos;s not a new indicator. It&apos;s a{" "}
                  <span className="text-[var(--acid)]">repeatable framework.</span>
                </>
              }
              sub="The WSA Protocol removes emotion so success becomes mechanical — telling you exactly when to enter, manage, and exit."
            />
          </Reveal>
          <div className="grid gap-[18px] md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delayMs={i * 70}>
                <div className="relative overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-[26px]">
                  <div className="pointer-events-none absolute right-[18px] top-2 font-[family-name:var(--font-mono)] text-[3rem] font-black text-[rgba(var(--acid-rgb),0.25)]">
                    {s.n}
                  </div>
                  <h3 className="relative mb-2 text-[1.15rem] font-bold text-[var(--bone)]">{s.title}</h3>
                  <p className="relative m-0 text-[var(--ash)] leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </HomeWrap>
      </section>

      <section
        id="method"
        className="border-y border-[var(--line)] bg-[linear-gradient(180deg,var(--bg-2),var(--bg))] py-[74px]"
      >
        <HomeWrap>
          <Reveal>
            <HomeSecHead
              eyebrow="The WSA Protocol"
              title="One full system. Built for people with jobs."
              sub="The same nine-part process used to go from celebrating $200 days to documented six-figure weeks."
            />
          </Reveal>
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {PHASES.map((p, i) => (
              <Reveal key={p.n} delayMs={i * 40}>
                <div className="rounded-[10px] border border-[var(--line)] bg-[var(--bg-1)] p-5">
                  <div className="mb-2 font-[family-name:var(--font-mono)] text-[0.7rem] font-bold tracking-[0.16em] text-[var(--acid)]">
                    {p.n}
                  </div>
                  <h3 className="mb-1.5 text-base font-bold text-[var(--bone)]">{p.title}</h3>
                  <p className="m-0 text-sm leading-relaxed text-[var(--ash)]">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </HomeWrap>
      </section>
    </>
  );
}
