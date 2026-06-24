"use client";

import Link from "next/link";

const PHASES = [
  {
    num: "01",
    title: "Foundation & Mindset",
    duration: "Week 1 – 2",
    tagline:
      "Before you touch a chart, you need to know why 90% of traders lose money — and build the habits that protect you from day one.",
    checkpoint:
      "You understand how risk management protects your account. You won't make the mistakes that kill most new traders before they ever get a chance.",
    items: [
      {
        label: "Introduction to Forex",
        note: "What it actually is. What it isn't. No hype — just the structure of the market you're about to trade.",
      },
      {
        label: "Platform Setup — MT4 + TradingView",
        note: "Install Cue's exact indicators, templates, and settings before anything else. Start with the right tools.",
      },
      {
        label: "Risk Management 101",
        note: "The 2:1 minimum. Daily drawdown caps. Position sizing. This module alone saves accounts. Non-negotiable before Phase 2.",
      },
      {
        label: "Mental Health — The Trader's Environment",
        note: "Your habits, your relationships, your outlook. Cue built this because the market will expose every weak link in your psychology — before you're ready.",
      },
      {
        label: "The Four Fears + Greed, Revenge, FOMO",
        note: "Know your patterns before the market exploits them. Fear of being wrong. Fear of missing out. Fear of losing money. Fear of leaving money on the table. All covered.",
      },
      {
        label: "Demo vs Live — Understanding the Difference",
        note: "Why demo doesn't prepare you for live, and exactly how to bridge the gap without blowing your first real account.",
      },
    ],
  },
  {
    num: "02",
    title: "Reading Price",
    duration: "Week 2 – 3",
    tagline:
      "Learn to see what the market is actually saying. Trends, support, supply and demand — the language behind every single price move.",
    checkpoint:
      "You can look at any chart and tell the trend, identify key S&R levels, and spot supply/demand zones. Charts stop being noise.",
    items: [
      {
        label: "Identifying The Trend (1.0 + 2.0)",
        note: "Moving averages, trend direction, higher highs and lower lows. The single most important skill before confluence. You cannot trade what you can't read.",
      },
      {
        label: "Support & Resistance (1.0 + 2.0)",
        note: "Where price respects itself. Where institutions are watching. 11 + 15 minutes that change how you see charts permanently.",
      },
      {
        label: "Supply & Demand",
        note: "The institutional reason behind every move. Not retail psychology — the actual orders that move markets.",
      },
      {
        label: "Drawing Trendlines (1.0 + 2.0)",
        note: "Most traders draw them wrong. 34 minutes of getting it right — where to anchor, when they break, what it means when they do.",
      },
      {
        label: "Chart Practice: 10 Drawn Charts",
        note: "Draw 10 charts with trends, S&R, and supply/demand marked. Submit for review before moving to Phase 3. Not optional.",
      },
    ],
  },
  {
    num: "03",
    title: "Structure + Levels",
    duration: "Week 3 – 4",
    tagline:
      "Market structure is how professional traders read intention. Fibonacci is how they find precision. Together, this is where your entries start to make sense.",
    checkpoint:
      "You can draw accurate market structure and identify precise Fibonacci retracements on any chart. Your entries become purposeful — not guesses.",
    items: [
      {
        label: "Drawing Market Structure (1.0 + 2.0)",
        note: "The blueprint of every move before it happens. Break of structure, change of character, continuation vs reversal. The roadmap within the chart.",
      },
      {
        label: "Using Fibonacci (1.0 + 2.0)",
        note: "Not voodoo. The math the market respects. 8 + 34 minutes — the exact tool settings, how to draw it, where price reacts.",
      },
      {
        label: "Fibonacci Drill: 20 Historical Moves",
        note: "Apply fibs to 20 historical moves and identify where price reacted. This repetition is what builds the eye. You can't skip the reps.",
      },
      {
        label: "Top Down Analysis — Cue's Exact Flow",
        note: "HTF to LTF. The framework Cue uses every single session to bias a pair before touching a lower timeframe.",
      },
      {
        label: "Chart Pattern Anatomy",
        note: "The shapes that repeat. Learn them before the market prints them. Head & shoulders, double tops/bottoms, wedges, pennants, rectangles.",
      },
    ],
  },
  {
    num: "04",
    title: "The Confluence System",
    duration: "Week 4 – 7",
    tagline:
      "This is Cue's edge. The reason his students quit jobs and buy cars. Everything you've learned stacks here into one repeatable, high-probability system.",
    checkpoint:
      "You have a complete system. Multiple confluences stack = a high-probability setup. You stop trading setups. You start trading evidence.",
    items: [
      {
        label: "Confluence Trading 1.0 → 2.0 → 2.5",
        note: "Watch in order. Don't skip. 23m → 34m → 45m. Each builds on the last. Confluence is the stack — trend, structure, key level, momentum aligned.",
      },
      {
        label: "Confluence Trading 2.9 → 3.0",
        note: "49m + 48m. Advanced application. Cue's thinking out loud — how he filters, what disqualifies a setup, how he manages the trade.",
      },
      {
        label: "Confluence XXX + Confluence 30.0 (NEW)",
        note: "1h 51m + 1h 12m. The deep end. This is where it clicks — live charts, real setups, the full system in motion.",
      },
      {
        label: "The Process — Maintaining a Live Trade",
        note: "31 minutes on what happens AFTER you're in. Most traders skip this. This is where accounts blow — not the entry.",
      },
      {
        label: "Confluence Tick By Tick + Confluence RAW",
        note: "1h 18m + 1h 14m. Real-time execution breakdown. Unfiltered. This is how the professional thinks in the moment.",
      },
      {
        label: "50 Setup Practice",
        note: "Identify confluence zones on 50 historical setups. Mark your entries, stops, targets. Submit your top 5 for group call review.",
      },
    ],
  },
  {
    num: "05",
    title: "Advanced Execution",
    duration: "Week 7 – 10",
    tagline:
      "Now you layer in tools. More precision. Cleaner entries. You stop guessing where price will react — and start knowing why.",
    checkpoint:
      "You have a full toolkit. You can filter trades by trend strength, catch breakouts, spot patterns before they complete. Fewer trades. Better trades.",
    items: [
      {
        label: "Ichimoku Kinko Hyo",
        note: "12 minutes. A tool that filters trend, momentum, and support all at once. Adds a layer of confirmation most traders don't have.",
      },
      {
        label: "Pivot Points",
        note: "10 minutes. Institutional levels calculated daily. Where banks are watching. High-confluence areas that print consistently.",
      },
      {
        label: "Using Channels to Catch Breakouts",
        note: "17 minutes. How momentum players stack with structure traders. How to position before the move — not after.",
      },
      {
        label: "Average Directional Index (ADX)",
        note: "10 minutes. Your trend strength filter. This stops you trading choppy, ranging markets — one of the most common and most expensive mistakes beginners make.",
      },
      {
        label: "Common Technical F**k Ups",
        note: "33 minutes of what NOT to do. Cue's breakdown of the most common mistakes he sees — saves you months of learning the hard way.",
      },
      {
        label: "Major Market Patterns — All 13",
        note: "Head & shoulders, double tops/bottoms, both wedges, both pennants, symmetrical triangles, descending triangles, rectangles. Know the shape before the market confirms it.",
      },
    ],
  },
  {
    num: "06",
    title: "Live & Consistent",
    duration: "Week 10 – 16",
    tagline:
      "Weekly calls. Real trades. Real feedback. This is where it compounds. You're not learning anymore — you're executing.",
    checkpoint:
      "You're consistently placing setups, tracking your performance, and improving with each week. By month four, you have a system, a journal, and proof of concept.",
    items: [
      {
        label: "Monthly Group Q&A with Cue",
        note: "Bring your charts. Bring your questions. Live feedback on real setups — not a lecture. Four calls across the four months. Show up prepared.",
      },
      {
        label: "Chart N Chill Webinar Library",
        note: "100+ sessions on demand — Cue breaking down live charts in real time. When you have a question, the answer is already recorded. Check the library first.",
      },
      {
        label: "NY + London Session Focus",
        note: "Master the sessions. NY and London are where the volume is, where the setups form, where the money moves. Build your trading schedule around them.",
      },
      {
        label: "Post Course Mindset",
        note: "Growing a small account. Patience. When to ditch your job. How to maintain confidence. The thinking that comes after you know the system.",
      },
      {
        label: "3 Trade Ideas Per Week — Discord Review",
        note: "Post, get reviewed, improve. The best traders in the group are posting regularly. Consistency in practice is the system.",
      },
      {
        label: "30-Day Live Trading Journal",
        note: "Track every trade. Entry, stop, target, outcome, notes. Review weekly. This data is what makes you better — not more videos.",
      },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div
      className="grid-bg"
      style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--bone)" }}
    >
      {/* HEADER */}
      <header
        style={{
          borderBottom: "1px solid var(--line)",
          padding: "20px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="/ig" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wsa/home/1.png"
            alt="Wall Street Academy"
            style={{ height: 52, width: 52, borderRadius: "50%", objectFit: "cover" }}
          />
        </Link>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            color: "var(--acid)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          · Inner Circle · Roadmap ·
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "80px 48px 16px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(900px 520px at 50% 0%, rgba(249,255,60,0.10), transparent 60%)",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 700,
              color: "var(--muted)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            · 6 Phases · 16 Weeks · One Direction ·
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(44px, 7vw, 76px)",
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              color: "var(--bone)",
              margin: "0 0 22px",
            }}
          >
            The Inner Circle
            <br />
            <em style={{ color: "var(--acid)", fontStyle: "normal" }}>Roadmap.</em>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 19,
              lineHeight: 1.55,
              color: "var(--ash)",
              margin: "0 auto 14px",
              maxWidth: 560,
            }}
          >
            Every module. Every drill. In the exact order that builds a
            profitable trader — not just someone who watched videos.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              lineHeight: 1.5,
              color: "var(--muted)",
              margin: "0 auto 64px",
              maxWidth: 460,
            }}
          >
            This is the structure that was missing. This is why it works now.
          </p>
        </div>
      </section>

      {/* PHASES */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 48px 100px" }}>
        {/* Timeline connector */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 28,
              top: 0,
              bottom: 0,
              width: 1,
              background:
                "linear-gradient(to bottom, var(--acid) 0%, rgba(249,255,60,0.15) 100%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {PHASES.map((phase, i) => (
              <div key={i} style={{ display: "flex", gap: 32, position: "relative" }}>
                {/* Phase dot */}
                <div
                  style={{
                    flexShrink: 0,
                    width: 56,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: 36,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--bg)",
                      border: "2px solid var(--acid)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 20px rgba(249,255,60,0.25)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--acid)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {phase.num}
                    </span>
                  </div>
                </div>

                {/* Phase card */}
                <div
                  style={{
                    flex: 1,
                    background: "var(--bg-1)",
                    border: "1px solid var(--line)",
                    borderTop: "1px solid rgba(249,255,60,0.25)",
                    overflow: "hidden",
                  }}
                >
                  {/* Card header */}
                  <div style={{ padding: "28px 32px 22px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "var(--muted)",
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          background: "var(--bg-2)",
                          border: "1px solid var(--line)",
                          padding: "4px 10px",
                        }}
                      >
                        {phase.duration}
                      </div>
                    </div>
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "clamp(22px, 3vw, 28px)",
                        letterSpacing: "-0.025em",
                        color: "var(--bone)",
                        margin: "0 0 10px",
                      }}
                    >
                      {phase.title}
                    </h2>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "var(--ash)",
                        margin: 0,
                        maxWidth: 600,
                      }}
                    >
                      {phase.tagline}
                    </p>
                  </div>

                  {/* Items */}
                  <div
                    style={{
                      borderTop: "1px solid var(--line)",
                      padding: "0 32px",
                    }}
                  >
                    {phase.items.map((item, j) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 16,
                          padding: "14px 0",
                          borderBottom:
                            j < phase.items.length - 1
                              ? "1px solid var(--line)"
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            flexShrink: 0,
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            border: "1px solid var(--line-2)",
                            background: "var(--bg-2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 1,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 9,
                              fontWeight: 700,
                              color: "var(--muted)",
                            }}
                          >
                            {j + 1}
                          </span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 600,
                              fontSize: 14,
                              color: "var(--bone)",
                              marginBottom: 3,
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {item.label}
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 12.5,
                              lineHeight: 1.55,
                              color: "var(--ash)",
                            }}
                          >
                            {item.note}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Checkpoint */}
                  <div
                    style={{
                      borderTop: "1px solid var(--line)",
                      background: "rgba(249,255,60,0.04)",
                      padding: "14px 32px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "var(--acid)",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        flexShrink: 0,
                        paddingTop: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      · After ·
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12.5,
                        lineHeight: 1.55,
                        color: "var(--acid)",
                        opacity: 0.85,
                      }}
                    >
                      {phase.checkpoint}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED STRIP */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 48px 80px",
        }}
      >
        <div
          style={{
            borderTop: "1px solid var(--line)",
            paddingTop: 48,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 700,
              color: "var(--muted)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 28,
            }}
          >
            · What's included in the program ·
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
            }}
          >
            {[
              {
                label: "100+ Hours of Video",
                desc: "Every module, webinar, and live trade breakdown in the system.",
              },
              {
                label: "Monthly Group Q&A",
                desc: "4 live calls with Cue across the 4 months. Bring your charts.",
              },
              {
                label: "Discord Community",
                desc: "Access to the community, wins channel, and live session chats.",
              },
              {
                label: "CSM Support",
                desc: "Questions get answered fast — redirected to the exact module or call that covers it.",
              },
              {
                label: "Structured Drills",
                desc: "Practice between phases is required. Not a video library — a training program.",
              },
              {
                label: "4 Months. No Lifetime.",
                desc: "Urgency and focus. You're not buying access — you're buying transformation.",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-1)",
                  border: "1px solid var(--line)",
                  padding: "18px 20px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--bone)",
                    marginBottom: 5,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    color: "var(--ash)",
                  }}
                >
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "0 48px 100px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            color: "var(--muted)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          · 6 phases · 16 weeks · $7,500 ·
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 52px)",
            letterSpacing: "-0.035em",
            color: "var(--bone)",
            margin: "0 0 16px",
            lineHeight: 1.0,
          }}
        >
          Apply and see if you&rsquo;re
          <br />
          <em style={{ color: "var(--acid)", fontStyle: "normal" }}>the right fit.</em>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            lineHeight: 1.55,
            color: "var(--ash)",
            margin: "0 auto 36px",
            maxWidth: 440,
          }}
        >
          The roadmap is built. The system is proven. The only question is
          whether you&rsquo;re ready to follow it.
        </p>
        <Link
          href="/ig/apply"
          style={{
            display: "inline-block",
            padding: "20px 48px",
            background: "var(--acid)",
            color: "var(--bg)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textDecoration: "none",
            boxShadow: "0 0 0 1px var(--acid), 0 0 56px rgba(249,255,60,0.28)",
          }}
        >
          Apply for the Inner Circle →
        </Link>
        <p
          style={{
            marginTop: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            color: "var(--muted)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          · Takes 2 minutes · Spots are limited ·
        </p>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "32px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 700,
          color: "var(--muted)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        <span>© 2026 · iknkfx inc · All Rights Reserved</span>
        <span>· Not financial advice · Trading involves real risk of loss ·</span>
      </footer>
    </div>
  );
}
