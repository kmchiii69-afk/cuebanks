"use client";

import { ML, Wrap } from "../Primitives";

// Cinematic full-width band: photo backdrop, gradient overlay, headline.
// "Place the trap. Walk away." — sets up the pre-positioned-every-Sunday
// pitch that runs through the whole sales page.
export default function MatrixBand() {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "16/9",
        overflow: "hidden",
        borderBottom: "1px solid var(--line)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/uploads/cam/at-the-charts.jpg"
        alt="At the charts"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(6,7,10,0.92) 0%, rgba(6,7,10,0.55) 50%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Wrap style={{ padding: "0 48px" }}>
          <div style={{ maxWidth: 620 }}>
            <ML style={{ marginBottom: 24 }}>· Set · Forget · Let it play out ·</ML>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 84,
                lineHeight: 0.98,
                letterSpacing: "-0.04em",
                color: "var(--bone)",
                margin: "0 0 24px",
              }}
            >
              Stop chasing alerts.
              <br />
              <em className="glow-acid" style={{ color: "var(--acid)" }}>
                Place the trap. Walk away.
              </em>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 18,
                lineHeight: 1.65,
                color: "var(--ash)",
                margin: 0,
                maxWidth: 520,
              }}
            >
              Pre-positioned before the move, orders bracketed on Sunday, then off the screens. The
              plan runs itself while you live.
            </p>
          </div>
        </Wrap>
      </div>
    </div>
  );
}
