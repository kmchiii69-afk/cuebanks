"use client";

import Link from "next/link";
import { ML, WolfMark } from "../Primitives";
import { WolfVSL } from "../Bar";
import { HeroBadge } from "../data";

// Above-the-fold hero with nav, headline, CTA row, VSL slot, pitch, and a
// 4-col mini badge strip. The price is passed in so /wolfpack-global can
// render the same component with $297 instead of $997.
export default function Hero({
  priceLabel,
  joinHref,
  badges,
}: {
  priceLabel: string;
  joinHref: string;
  badges: HeroBadge[];
}) {
  return (
    <div
      className="grid-bg"
      style={{
        position: "relative",
        padding: "20px 0 88px",
        borderBottom: "1px solid var(--line)",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(37,99,235,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <WolfMark
        size={620}
        color="var(--acid)"
        style={{ position: "absolute", right: -120, top: 80, opacity: 0.05, pointerEvents: "none" }}
      />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 48px" }}>
        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingTop: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }} className="no-underline">
            <WolfMark size={26} color="var(--acid)" />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 17,
                fontWeight: 600,
                color: "var(--bone)",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              The Wolfpack <span style={{ color: "var(--ash)", fontWeight: 400 }}>· WSA</span>
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {[
              ["Package", "#package"],
              ["Results", "#results"],
              ["Reviews", "#reviews"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--ash)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </a>
            ))}
            <a href={joinHref} className="btn">
              Buy Now
            </a>
          </div>
        </div>

        {/* Headline block */}
        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
            <span
              className="pulse"
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--acid)",
              }}
            />
            <ML>You qualified for the Wolfpack</ML>
          </div>
          <div style={{ marginBottom: 14 }}>
            <ML color="var(--ash)">Best crypto trading program on Whop</ML>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 60,
              lineHeight: 0.97,
              letterSpacing: "-0.04em",
              color: "var(--bone)",
              margin: "0 0 16px",
            }}
          >
            Finally, see into the market
            <br />
            <em style={{ color: "var(--acid)" }}>like the matrix</em>
            <br />
            <em>with Cue at the helm.</em>
          </h1>
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 18 }}>
          <a href={joinHref} className="btn btn-lg">
            Buy Now · {priceLabel} →
          </a>
          <a href="#package" className="btn btn-ghost btn-lg">
            See What&apos;s Inside ↓
          </a>
        </div>

        {/* VSL */}
        <div style={{ maxWidth: 800, margin: "0 auto 48px" }}>
          <WolfVSL vimeoId="1090298635" />
        </div>

        {/* Pitch */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 19,
            lineHeight: 1.7,
            color: "var(--ash)",
            textAlign: "center",
            maxWidth: 820,
            margin: "0 auto 48px",
            fontWeight: 400,
          }}
        >
          I&apos;ll tell you exactly where the market is going — the entries, the exits, the level at
          which I stop out — and you can copy it, study it, or just let it run. No guessing. No noise.
          One system, repeated every week, for 10 years.
        </p>

        {/* 4-col mini badges */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            maxWidth: 820,
            margin: "0 auto",
            background: "var(--line)",
            border: "1px solid var(--line)",
          }}
        >
          {badges.map((b, i) => (
            <div key={i} style={{ background: "var(--bg-1)", padding: "18px 16px", textAlign: "center" }}>
              <ML color="var(--muted)" style={{ marginBottom: 6, whiteSpace: "normal" }}>
                {b.k}
              </ML>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--bone)",
                }}
              >
                {b.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
