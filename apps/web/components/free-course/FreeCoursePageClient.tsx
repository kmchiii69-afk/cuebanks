"use client";

import Image from "next/image";
import posthog from "posthog-js";
import { useState } from "react";
import Reveal from "@/components/home/Reveal";
import { HomeEyebrow, HomeSecHead, HomeWrap } from "@/components/home/HomeSection";
import LeadCaptureModal from "./LeadCaptureModal";

const CURRICULUM = [
  {
    n: "01",
    tag: "Mindset",
    title: "The Mechanical Mindset",
    body: 'Stop "feeling" the market. Learn the rule-first approach that removes emotion from every decision.',
    time: "12:04 · Free",
  },
  {
    n: "02-03",
    tag: "Execution",
    title: "Clean Setups & Risk",
    body: "Trade only NY & London sessions with confirmed setups and a 2:1 minimum risk-to-reward.",
    time: "34:19 · Free",
  },
  {
    n: "04-05",
    tag: "Growth",
    title: "Journal & Scale",
    body: "Track every trade in Market Memo, find your patterns, and scale only when the data proves you're ready.",
    time: "25:35 · Free",
  },
];

const LESSONS = [
  { lock: false, title: "1. The Mechanical Mindset", sub: "Why structure beats emotion", time: "12:04" },
  { lock: true, title: "2. Reading Clean Setups", sub: "Pullbacks, breakouts & sessions", time: "18:32" },
  { lock: true, title: "3. Risk & The 2:1 Rule", sub: "Protecting your account first", time: "15:47" },
  { lock: true, title: "4. Market Memo Journaling", sub: "Finding your edge in the data", time: "14:10" },
  { lock: true, title: "5. Scaling With Proof", sub: "When (and how) to size up", time: "11:25" },
];

const GAMBLE = [
  "Chasing breakouts on emotion and FOMO",
  "Jumping strategies every losing week",
  "Overleveraging and ignoring stop losses",
  "12-hour chart days, 50 indicators, burnout",
  "No journal, no data, no real edge",
];

const PROTOCOL = [
  "Rule-based entries during optimal sessions",
  "One repeatable framework, followed daily",
  "Defined risk with a 2:1 R:R minimum",
  "Just 2–5 focused hours a day",
  "Every trade logged in Market Memo",
];

const PROOF_IMGS = [
  "/wsa/free-course/2.jpg",
  "/wsa/free-course/3.jpg",
  "/wsa/free-course/4.jpg",
  "/wsa/free-course/5.jpg",
  "/wsa/free-course/6.jpg",
  "/wsa/free-course/7.jpg",
  "/wsa/free-course/8.jpg",
  "/wsa/free-course/9.jpg",
  "/wsa/free-course/10.jpg",
  "/wsa/free-course/11.jpg",
];

const QUOTES = [
  {
    quote:
      "Cornelius hit $10K profit one week after joining. One week of following the rules and the green weeks finally repeated.",
    name: "Cornelius",
    role: "Inner Circle Member",
  },
  {
    quote:
      "$48K in 30 days. The journaling changed everything — once I could see my patterns in the data, the guessing stopped.",
    name: "Jonathan",
    role: "WSA Protocol Trader",
  },
  {
    quote:
      "$50K while still working my full-time job. I trade two hours before work. Structure over screen time was the whole unlock.",
    name: "Mike",
    role: "Part-time Trader",
  },
];

const FAQ = [
  {
    q: "Is this really free?",
    a: "Yes — zero charge. The full training is free because it's the best way to show you how the WSA Protocol actually works before you ever consider the Inner Circle.",
  },
  {
    q: "Do I need experience or a big account?",
    a: "No. Our students start with as little as $500. You don't need a finance degree or a hedge-fund background — just the discipline to follow a system.",
  },
  {
    q: "How much time does it take?",
    a: "The system is built for people with jobs and families. You only need 2–5 focused hours a day — no overtrading, no burnout.",
  },
  {
    q: "What happens after I watch?",
    a: "You'll understand the exact framework behind every win on this page. If you want live mentorship and accountability, you can apply to the Inner Circle — but the training is yours regardless.",
  },
];

const METRICS = [
  { n: "10+", l: "Years live trading experience" },
  { n: "$500K", l: "Documented in 5 days, posted live" },
  { n: "10,000+", l: "Traders mentored worldwide" },
  { n: "2–5 hrs", l: "Of focused trading per day" },
];

function AccessButton({
  children,
  className = "btn",
  onOpen,
}: {
  children: React.ReactNode;
  className?: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        posthog.capture("free_course_modal_opened");
        onOpen();
      }}
    >
      {children}
    </button>
  );
}

export default function FreeCoursePageClient() {
  const [open, setOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <main className="bg-[var(--bg)] text-[var(--bone)]">
        <section className="border-b border-[var(--line)] bg-[radial-gradient(900px_500px_at_80%_-10%,rgba(var(--acid-rgb),0.16),transparent_60%),var(--bg)] py-16 sm:py-20">
          <HomeWrap>
            <Reveal>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-1)] px-3 py-1.5 text-xs font-bold text-[var(--acid)]">
                ★ 100% Free Training
              </div>
              <h1 className="mb-4 max-w-[18ch] text-[clamp(2.1rem,5.2vw,3.8rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
                I went from <span className="text-[var(--acid)]">Target shelves</span> to six-figure
                weeks. Here&apos;s the free training.
              </h1>
              <p className="mb-7 max-w-[52ch] text-lg text-[var(--ash)]">
                The exact rule-based system I refined over 10 years — broken into free lessons you
                can watch today. No fluff, no hype, just the WSA Protocol.
              </p>
              <div className="mb-5 flex flex-wrap gap-3">
                <AccessButton onOpen={() => setOpen(true)}>
                  Get Free Access <span aria-hidden>→</span>
                </AccessButton>
                <a href="#cases" className="btn btn-ghost">
                  See What&apos;s Inside
                </a>
              </div>
              <p className="font-mono text-[0.82rem] text-[var(--muted)]">
                10,000+ traders trained · Profits posted publicly since{" "}
                <b className="text-[var(--acid)]">2019</b>
              </p>
            </Reveal>

            <Reveal className="mt-10" delayMs={60}>
              <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                    The WSA Protocol — Free Lessons
                  </div>
                  <span className="rounded bg-[var(--acid)] px-2 py-0.5 text-[0.7rem] font-bold text-[var(--primary-foreground)]">
                    FREE
                  </span>
                </div>
                <div className="grid gap-2">
                  {LESSONS.map((l) => (
                    <div
                      key={l.title}
                      className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-3"
                    >
                      <span className="text-lg" aria-hidden>
                        {l.lock ? "🔒" : "▶"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-bold">{l.title}</div>
                        <div className="truncate text-sm text-[var(--muted)]">{l.sub}</div>
                      </div>
                      <div className="shrink-0 font-mono text-xs text-[var(--muted)]">
                        {l.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </HomeWrap>
        </section>

        <section className="py-[74px]">
          <HomeWrap>
            <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <Reveal>
                <div className="mb-2 font-mono text-xs text-[var(--muted)]">
                  📈 Cue Banks · Founder, Wall Street Academy
                </div>
                <HomeEyebrow>Who&apos;s Teaching You</HomeEyebrow>
                <h2 className="mb-4 text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold tracking-[-0.03em]">
                  10 years of trading, distilled into a free system.
                </h2>
                <p className="mb-8 leading-relaxed text-[var(--ash)]">
                  I started celebrating $200 wins while working shifts. No degree, no mentors — just
                  charts, discipline, and a system I refined until it became repeatable. Today I
                  trade a few focused hours a day and document the results live.
                </p>
                <div className="grid grid-cols-2 gap-5">
                  {METRICS.map((m) => (
                    <div key={m.l}>
                      <div className="text-2xl font-black text-[var(--acid)]">{m.n}</div>
                      <div className="mt-1 text-sm text-[var(--muted)]">{m.l}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delayMs={80}>
                <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-1)]">
                  <Image
                    src="/wsa/free-course/1.png"
                    alt="Cue Banks"
                    width={800}
                    height={1000}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </HomeWrap>
        </section>

        <section
          id="cases"
          className="border-y border-[var(--line)] bg-[linear-gradient(180deg,var(--bg-2),var(--bg))] py-[74px]"
        >
          <HomeWrap>
            <Reveal>
              <HomeSecHead
                eyebrow="What You'll Learn — Free"
                title="Five lessons. One repeatable system."
                sub="Each lesson stands alone, but together they're the framework that took me from retail shelves to six-figure weeks."
              />
            </Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {CURRICULUM.map((c, i) => (
                <Reveal key={c.n} delayMs={i * 60}>
                  <div className="h-full rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-6">
                    <div className="mb-2 font-mono text-[0.7rem] font-bold tracking-[0.16em] text-[var(--acid)]">
                      LESSON {c.n} · {c.tag}
                    </div>
                    <h3 className="mb-2 text-lg font-bold">{c.title}</h3>
                    <p className="mb-4 text-[var(--ash)]">{c.body}</p>
                    <div className="font-mono text-xs text-[var(--muted)]">
                      {c.time}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </HomeWrap>
        </section>

        <section className="py-[74px]">
          <HomeWrap>
            <Reveal>
              <HomeSecHead
                eyebrow="Why Most Traders Lose"
                title={
                  <>
                    The <span className="text-[var(--pink)]">Gamble</span> vs. The{" "}
                    <span className="text-[var(--acid)]">Protocol</span>.
                  </>
                }
                sub="It's not the trader. It's the lack of a structured, repeatable system."
              />
            </Reveal>
            <div className="grid gap-4 md:grid-cols-2">
              <Reveal>
                <div className="rounded-xl border border-[var(--line)] border-l-[3px] border-l-[var(--pink)] bg-[var(--bg-1)] p-6">
                  <h3 className="mb-4 font-bold text-[var(--pink)]">✕ The Gamble</h3>
                  <ul className="space-y-3">
                    {GAMBLE.map((item) => (
                      <li key={item} className="flex gap-2 text-[var(--ash)]">
                        <span className="text-[var(--pink)]">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delayMs={70}>
                <div className="rounded-xl border border-[var(--line)] border-l-[3px] border-l-[var(--acid)] bg-[var(--bg-1)] p-6">
                  <h3 className="mb-4 font-bold text-[var(--acid)]">✓ The WSA Protocol</h3>
                  <ul className="space-y-3">
                    {PROTOCOL.map((item) => (
                      <li key={item} className="flex gap-2 text-[var(--ash)]">
                        <span className="text-[var(--acid)]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </HomeWrap>
        </section>

        <section className="border-y border-[var(--line)] bg-[linear-gradient(180deg,var(--bg-2),var(--bg))] py-[74px]">
          <HomeWrap>
            <Reveal>
              <HomeSecHead
                eyebrow="The Receipts"
                title="Verified student results."
                sub="Real screenshots from real traders following the same system taught in this free training."
              />
            </Reveal>
            <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
              {PROOF_IMGS.map((src, i) => (
                <Reveal key={src} delayMs={i * 30} className="mb-3 break-inside-avoid">
                  <figure className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-1)]">
                    <Image
                      src={src}
                      alt={`Verified student result ${i + 1}`}
                      width={640}
                      height={800}
                      className="h-auto w-full object-cover"
                    />
                  </figure>
                </Reveal>
              ))}
            </div>
          </HomeWrap>
        </section>

        <section className="py-[74px]">
          <HomeWrap>
            <Reveal>
              <HomeSecHead eyebrow="In Their Words" title="Traders who made the shift." />
            </Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {QUOTES.map((q, i) => (
                <Reveal key={q.name} delayMs={i * 60}>
                  <article className="flex h-full flex-col rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-6">
                    <div className="mb-3 text-[#f6b500]">★★★★★</div>
                    <blockquote className="mb-5 flex-1 text-[var(--bone)]">
                      &ldquo;{q.quote}&rdquo;
                    </blockquote>
                    <div className="font-bold">{q.name}</div>
                    <div className="text-sm text-[var(--muted)]">{q.role}</div>
                  </article>
                </Reveal>
              ))}
            </div>
          </HomeWrap>
        </section>

        <section className="border-y border-[var(--line)] bg-[linear-gradient(180deg,var(--bg-2),var(--bg))] py-[74px]">
          <HomeWrap>
            <Reveal>
              <HomeSecHead eyebrow="The Catch" title="Questions? Answered." />
            </Reveal>
            <div className="mx-auto max-w-[760px] space-y-2">
              {FAQ.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <Reveal key={item.q} delayMs={i * 40}>
                    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)]">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        aria-expanded={isOpen}
                      >
                        {item.q}
                        <span className="text-[var(--acid)]">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen ? (
                        <p className="border-t border-[var(--line)] px-5 py-4 text-[var(--ash)]">
                          {item.a}
                        </p>
                      ) : null}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </HomeWrap>
        </section>

        <section
          id="access"
          className="bg-[radial-gradient(700px_400px_at_50%_0%,rgba(var(--acid-rgb),0.18),transparent_60%),var(--bg)] py-[84px] text-center"
        >
          <HomeWrap>
            <Reveal>
              <HomeEyebrow>Zero Charge · Instant Access</HomeEyebrow>
              <h2 className="mx-auto mb-4 max-w-[18ch] text-[clamp(2rem,5vw,3.2rem)] font-bold tracking-[-0.03em]">
                Get the free training. Start trading with{" "}
                <span className="text-[var(--acid)]">structure.</span>
              </h2>
              <p className="mx-auto mb-7 max-w-[48ch] text-[var(--ash)]">
                Drop your email and unlock all five lessons of the WSA Protocol — the same system
                behind every result on this page.
              </p>
              <AccessButton onOpen={() => setOpen(true)}>
                Get Free Access <span aria-hidden>→</span>
              </AccessButton>
            </Reveal>
          </HomeWrap>
        </section>

        <p className="border-t border-[var(--line)] px-[22px] py-[26px] text-center font-serif text-[0.8rem] text-[var(--muted)]">
          Disclaimer: This is for educational purposes only. Trading involves risk, and you should
          never trade with money you can&apos;t afford to lose. Results are not typical and
          individual results will vary.
        </p>
      </main>

      <LeadCaptureModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
