"use client";

import { ML, Section } from "../Primitives";
import { TopCallTile } from "../Tiles";
import { TOP_CALL_TILES } from "../content";

// "The call" — the single most viral piece of proof on the page. One alert
// (Oct 9 2025) that banked $237K across six shorts in a single day.
export default function TopCallStory() {
  return (
    <Section py={140}>
      <div style={{ marginBottom: 40 }}>
        <ML color="var(--pink)" style={{ marginBottom: 24 }}>
          · October 9, 2025 · short side · public alert ·
        </ML>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 84,
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            color: "var(--bone)",
            margin: "0 0 24px",
            maxWidth: 1100,
          }}
        >
          Called the 2025 bull-market top.
          <br />
          <em style={{ color: "var(--acid)" }}>
            $237K banked in a single day on the biggest crypto liquidation event on record.
          </em>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 19,
            lineHeight: 1.65,
            color: "var(--ash)",
            margin: 0,
            maxWidth: 820,
          }}
        >
          The alert went out publicly before the move. Six shorts. One day. Every position documented
          with entry and close.
        </p>
      </div>

      {/* Alert image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          background: "var(--bg-2)",
          marginBottom: 36,
          border: "1px solid var(--line)",
        }}
        className="grid-bg"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uploads/cam/btc-2025-top-01.jpg"
          alt="BTC 2025 Top Call"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", top: 16, left: 16 }}>
          <ML color="var(--pink)">· THE PUBLIC ALERT</ML>
        </div>
      </div>

      {/* 3-col receipts grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: "var(--line)",
          marginBottom: 36,
        }}
      >
        {TOP_CALL_TILES.map((t, i) => (
          <TopCallTile key={i} {...t} />
        ))}
      </div>

      {/* Day total banner */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1px 1fr",
          gap: 0,
          border: "1px solid var(--line)",
          background: "var(--bg-1)",
        }}
      >
        <div style={{ padding: "36px 48px 36px 36px" }}>
          <ML color="var(--muted)" style={{ marginBottom: 12 }}>
            DAY TOTAL
          </ML>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 88,
              fontWeight: 600,
              color: "var(--acid)",
              lineHeight: 1,
            }}
          >
            $237K+
          </div>
        </div>
        <div style={{ background: "var(--line)" }} />
        <div style={{ padding: "36px 48px", display: "flex", alignItems: "center" }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 600,
              color: "var(--pink)",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Biggest crypto liquidation event
            <br />
            on record.
          </h3>
        </div>
      </div>
    </Section>
  );
}
