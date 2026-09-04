"use client";

import { useEffect, useState } from "react";
import { ML, Wrap } from "../Primitives";
import { RR_SLIDES } from "../content";

// Single-student spotlight — Rick Ross (@rick_ross, Bybit). Step through
// his receipts with prev/next buttons and dot navigation, plus keyboard arrows.
export default function RickRossSpotlight() {
  const [current, setCurrent] = useState(6);
  const [key, setKey] = useState(0);

  const go = (dir: number) => {
    setCurrent((c) => (c + dir + RR_SLIDES.length) % RR_SLIDES.length);
    setKey((k) => k + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const slide = RR_SLIDES[current];

  return (
    <div
      style={{
        background: "var(--bg-1)",
        border: "1px solid var(--acid)",
        margin: "0 0 0 0",
      }}
    >
      <Wrap style={{ padding: "0 48px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            minHeight: 560,
          }}
        >
          {/* Left — image + caption + controls */}
          <div
            style={{
              padding: "48px 48px 48px 0",
              borderRight: "1px solid var(--line)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              key={key}
              style={{
                position: "relative",
                aspectRatio: "16/10",
                background: "var(--bg-2)",
                overflow: "hidden",
                marginBottom: 20,
                animation: "rrFade 0.35s ease",
              }}
              className="grid-bg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.date}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
              <div style={{ position: "absolute", top: 10, left: 10 }}>
                <ML color="var(--muted)">{slide.date}</ML>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 36,
                  fontWeight: 600,
                  color: "var(--acid)",
                  lineHeight: 1,
                }}
              >
                {slide.amount}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ash)",
                  letterSpacing: "0.16em",
                  marginTop: 6,
                }}
              >
                {slide.note}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: "auto",
              }}
            >
              <ML color="var(--muted)">
                {String(current + 1).padStart(2, "0")}/{String(RR_SLIDES.length).padStart(2, "0")}
              </ML>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => go(-1)}
                  style={{
                    width: 40,
                    height: 40,
                    background: "var(--bg-2)",
                    border: "1px solid var(--line)",
                    color: "var(--ash)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                  aria-label="Previous"
                >
                  ←
                </button>
                <button
                  onClick={() => go(1)}
                  style={{
                    width: 40,
                    height: 40,
                    background: "var(--bg-2)",
                    border: "1px solid var(--line)",
                    color: "var(--ash)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                  aria-label="Next"
                >
                  →
                </button>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {RR_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrent(i);
                      setKey((k) => k + 1);
                    }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: i === current ? "var(--acid)" : "var(--line)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <ML color="var(--muted)">· Use ← → to step through the receipts ·</ML>
            </div>
          </div>

          {/* Right — featured P&L + stats */}
          <div
            style={{
              padding: "48px 0 48px 48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 28,
              }}
            >
              <ML>@rick_ross · Bybit</ML>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  color: "var(--bg)",
                  background: "var(--acid)",
                  padding: "3px 8px",
                }}
              >
                VERIFIED
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 108,
                fontWeight: 600,
                color: "var(--acid)",
                lineHeight: 0.9,
                marginBottom: 12,
              }}
            >
              $3.16M
            </div>
            <ML color="var(--ash)" style={{ marginBottom: 32 }}>
              All-time P&L · five months in
            </ML>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 18,
                lineHeight: 1.65,
                color: "var(--ash)",
                fontStyle: "italic",
                margin: "0 0 36px",
                borderLeft: "2px solid var(--acid)",
                paddingLeft: 20,
              }}
            >
              &ldquo;Losing money in the markets is a choice.&rdquo;
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 600,
                    color: "var(--bone)",
                    marginBottom: 4,
                  }}
                >
                  $50K
                </div>
                <ML color="var(--muted)">Started with</ML>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 600,
                    color: "var(--bone)",
                    marginBottom: 4,
                  }}
                >
                  5 months
                </div>
                <ML color="var(--muted)">Timeframe</ML>
              </div>
            </div>
          </div>
        </div>
      </Wrap>
    </div>
  );
}
