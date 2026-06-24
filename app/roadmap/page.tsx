"use client";

import Link from "next/link";

const PHASES = [
  {
    num: "01",
    title: "Foundation & Mindset",
    duration: "Week 1 – 2",
    tagline:
      "Your strategy isn't gonna be the basis of your trading success. Risk management will be. Before you touch a chart, you need to understand that.",
    checkpoint:
      "You know the rules that keep your account alive. You understand why there is not one single successful trader who uses improper risk management. You're not starting phase two without this locked in.",
    items: [
      {
        label: "Introduction to Forex",
        note: "What the market actually is, how it moves, and what it isn't. The foundation is support and resistance — everything else is built on top of that.",
      },
      {
        label: "Platform Setup — MT4 + TradingView",
        note: "Cue's exact indicators, moving averages, and chart templates before anything else. If the setup is wrong, the analysis is wrong from the start.",
      },
      {
        label: "Risk Management 101",
        note: "1% to 5% risk per trade — conservative to the absolute most you should go. Cue blew four $1,000 accounts before he understood this. You don't have to.",
      },
      {
        label: "Mental Health — The Trader's Environment",
        note: "Once you get greedy, that's what kills your success. This module covers the mindset before the market exposes every weak point in your psychology.",
      },
      {
        label: "The Four Fears + Greed, Revenge, FOMO",
        note: "You are the problem at times. Not the broker. The market. You. Know your patterns before they cost you. Take accountability for your own actions.",
      },
      {
        label: "Demo vs Live — Understanding the Difference",
        note: "Demo doesn't replicate the emotional weight of real money. This module bridges that gap so your first live account doesn't become a tuition payment.",
      },
    ],
  },
  {
    num: "02",
    title: "Reading Price",
    duration: "Week 2 – 3",
    tagline:
      "If the market is above the MAs, focus on buys. If it's under the MAs, focus on sells. Learn to see what the market is actually showing you — and flow with it.",
    checkpoint:
      "You can look at any chart and tell the trend, mark your S&R levels, and identify supply and demand zones. You know what's noise and what's a real move. Charts don't lie to you anymore.",
    items: [
      {
        label: "Identifying The Trend (1.0 + 2.0)",
        note: "Higher high points, higher low points — that's a bullish market. Lower highs, lower lows — that's a bearish market. This is always first. Structure is always first.",
      },
      {
        label: "Support & Resistance (1.0 + 2.0)",
        note: "The base of every style of trading. Daily levels on the line chart, H4 on the line chart, H1 on candles — that's how Cue marks his S&R from the top down.",
      },
      {
        label: "Supply & Demand",
        note: "The institutional orders behind every real move. Not retail psychology — the actual zones where price is going to react, repeatedly.",
      },
      {
        label: "Drawing Trendlines (1.0 + 2.0)",
        note: "If you can't walk in it, it's invalid. Most traders draw them wrong. Learn where to anchor, when they break, and exactly what that means for the next move.",
      },
      {
        label: "Chart Practice: 10 Drawn Charts",
        note: "Draw 10 charts with trend direction, S&R, and supply/demand marked. This is how you build the eye. You can't skip the reps — submit before moving to Phase 3.",
      },
    ],
  },
  {
    num: "03",
    title: "Structure + Levels",
    duration: "Week 3 – 4",
    tagline:
      "Regardless of what the MAs are doing, always ask yourself — what is structure doing? This phase is where you learn to read the blueprint of every move before it happens.",
    checkpoint:
      "You can map market structure clean on any pair. You can draw a fib from point A to point B and identify where price is most likely to react — 38.2%, 23.6%, the green zone. Entries stop being guesses.",
    items: [
      {
        label: "Drawing Market Structure (1.0 + 2.0)",
        note: "Break of structure. Change of character. Continuation versus reversal. You need to know what the market is doing before you can know where it's going.",
      },
      {
        label: "Using Fibonacci (1.0 + 2.0)",
        note: "Point A to point B — 38.2% is your first higher-low opportunity, 23.6% is where it gets sloppy. Know which levels to trust and which ones to wait through.",
      },
      {
        label: "Fibonacci Drill: 20 Historical Moves",
        note: "Pull 20 historical moves and map the fib on each one. Find where price reacted. This repetition is what builds the eye — you cannot shortcut this.",
      },
      {
        label: "Top Down Analysis — Cue's Exact Flow",
        note: "H4 for 30% of your time, M5 for 60%, H1 or M30 for the last 10%. Top down every single session before you touch a lower timeframe entry.",
      },
      {
        label: "Chart Pattern Anatomy",
        note: "The patterns that repeat across every market. Double tops only work in a downtrend. Double bottoms confirm an uptrend. Know the shape before the market confirms it.",
      },
    ],
  },
  {
    num: "04",
    title: "The Confluence System",
    duration: "Week 4 – 7",
    tagline:
      "When it shows up that smooth — structure clean, MAs below the market, 38.2% respected, everything aligned — you have to take advantage of it. This is the system.",
    checkpoint:
      "You can identify a full confluence setup: structure first, MAs confirm direction, fib level respected, candle close confirms the entry. You stop entering on feeling. You enter on evidence.",
    items: [
      {
        label: "Confluence Trading 1.0 → 2.0 → 2.5",
        note: "Watch in order. Don't skip. Each version builds on the last — this is Cue's full journey developing the system from its foundation. The stack starts here.",
      },
      {
        label: "Confluence Trading 2.9 → 3.0",
        note: "Advanced application. Cue thinking out loud on live charts — what he filters, what disqualifies a setup, how the whole system runs when it's second nature.",
      },
      {
        label: "Confluence XXX + Confluence 30.0",
        note: "The deep end. Live charts, real setups, the full system in motion. This is where it clicks — high MAs smooth below, 38.2% respected, price acting like butter.",
      },
      {
        label: "The Process — Maintaining a Live Trade",
        note: "Never have urgency for the market to go in your favor — that's how you close prematurely. This is entry to exit: how Cue manages a trade in real time, tick by tick.",
      },
      {
        label: "Confluence Tick By Tick + Confluence RAW",
        note: "Unfiltered real-time execution. Tick by tick — that means every candle, every close, every moment the market makes a new move. This is how the professional thinks.",
      },
      {
        label: "50 Setup Drill",
        note: "Mark confluence zones on 50 historical setups — entry, stop, target. Then ask yourself: was structure first? Did the MAs confirm? Was the candle close there? That's the checklist.",
      },
    ],
  },
  {
    num: "05",
    title: "Advanced Execution",
    duration: "Week 7 – 10",
    tagline:
      "Stop being afraid to up your lot size when the risk is tight and the setup is clean. This phase layers in the tools that sharpen your entries and filter the trash.",
    checkpoint:
      "You have additional confirmation tools in your stack. You can identify trend strength before entering, catch breakouts early, and recognize the technical mistakes that kill accounts before you make them.",
    items: [
      {
        label: "Ichimoku Kinko Hyo",
        note: "If it says strong buy, try not to sell. This tool shows trend, momentum, and support in one read — an additional filter that confirms what your structure is already telling you.",
      },
      {
        label: "Pivot Points",
        note: "Institutional levels that recalculate daily. High-confluence zones that print consistently — where banks are watching and price responds.",
      },
      {
        label: "Using Channels to Catch Breakouts",
        note: "How to position before the move, not after. Float the trend — don't try to catch five-pip micro moves inside a channel. Wait for the real break.",
      },
      {
        label: "Average Directional Index (ADX)",
        note: "Your trend strength filter. Don't try to trade a ranging, choppy market — that's where most accounts bleed out. ADX tells you when the trend is real.",
      },
      {
        label: "Common Technical F**k Ups",
        note: "Treat the charts like a piece of art. Precision, precision, precision. This is Cue's breakdown of the exact mistakes he sees most — the ones that are easily fixed once you see them.",
      },
      {
        label: "Major Market Patterns — All 13",
        note: "Head & shoulders, double tops/bottoms, wedges, pennants, triangles, rectangles — all of them. Know the shape before the market prints the confirmation candle.",
      },
    ],
  },
  {
    num: "06",
    title: "Live & Consistent",
    duration: "Week 10 – 16",
    tagline:
      "All I need is 20 or 30 pips a day. The real money is here. This phase is where you stop watching and start compounding.",
    checkpoint:
      "You're posting setups, getting reviewed, journaling every trade. After every loss you're writing down what you did wrong and what you could do better. The majority wins is all that matters — and you're building toward that.",
    items: [
      {
        label: "Monthly Group Q&A with Cue",
        note: "Bring your charts. Bring your questions. Four live calls across four months — real feedback on real setups, not a lecture. Show up prepared or show up ready to learn from someone who is.",
      },
      {
        label: "Chart N Chill Webinar Library",
        note: "100+ sessions on demand. When you have a question, the answer is probably already recorded. Check the library first — the CSM will redirect you there if it is.",
      },
      {
        label: "NY + London Session Focus",
        note: "NY and London are where the volume is, where the setups form, where the money moves. Build your schedule around these sessions and stop forcing trades in dead markets.",
      },
      {
        label: "Post Course Mindset",
        note: "Patience is the biggest thing. It's a transfer of money from the impatient to the patient. This module covers growing a small account, when to scale lot size, when to withdraw — and when not to.",
      },
      {
        label: "3 Trade Ideas Per Week — Discord Review",
        note: "Post your analysis. Get reviewed. Improve. The best traders in the group post consistently — not because they're forced to, because they understand that's how you grow.",
      },
      {
        label: "30-Day Live Trading Journal",
        note: "Track every trade: entry, stop, target, outcome, and notes. Review it weekly. This data is what makes you better — not more videos. The journal is the system.",
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
