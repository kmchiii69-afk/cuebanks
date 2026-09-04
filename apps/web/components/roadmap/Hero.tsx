"use client";

import type { CSSProperties } from "react";

type Stat = { n: string; label: string };

const heroWrap: CSSProperties = {
  maxWidth: 860,
  margin: "0 auto",
  padding: "96px 48px 24px",
  textAlign: "center",
  position: "relative",
  zIndex: 1,
};

/** Roadmap hero — parallaxed Globe target. Holds a section ref so the
 *  page can track which section is in view; the page passes the ref. */
export default function Hero({
  heroRef,
  stats,
}: {
  heroRef: React.RefObject<HTMLElement | null>;
  stats: Stat[];
}) {
  return (
    <section ref={heroRef} style={heroWrap}>
      <div style={{ position: "relative" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(48px, 7.5vw, 88px)",
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
            color: "var(--bone)",
            margin: "0 0 24px",
          }}
        >
          The Inner Circle
          <br />
          <em style={{ color: "var(--acid)", fontStyle: "normal" }}>Roadmap.</em>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: 18,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.45)",
            margin: "0 auto 36px",
            maxWidth: 500,
            letterSpacing: "0.01em",
          }}
        >
          Every module. Every drill. Every live session — in the exact order that builds a
          profitable trader.
        </p>
        <div
          style={{
            display: "inline-flex",
            gap: 0,
            border: "1px solid rgba(255,255,255,0.07)",
            overflow: "hidden",
            marginBottom: 80,
            borderRadius: 12,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "18px 28px",
                borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                textAlign: "center",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 32,
                  letterSpacing: "-0.04em",
                  color: "var(--acid)",
                  lineHeight: 1,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginTop: 6,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
