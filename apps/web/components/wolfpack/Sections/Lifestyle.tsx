"use client";

import { useState } from "react";
import { ML, Section } from "../Primitives";
import { LIFESTYLE_TILES } from "../content";

// Two-part section: (1) cinematic Porsche divider with a quote from "the close
// was the same week I bought this" — sets the lifestyle ceiling. (2) a 4-tile
// grid showing what the work funds. Hover lift is local state per tile.
export default function Lifestyle() {
  return (
    <>
      {/* Cinematic Porsche divider */}
      <div
        style={{
          position: "relative",
          aspectRatio: "21/9",
          overflow: "hidden",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uploads/lifestyle/porsche-side-tall.jpg"
          alt="Porsche 911 Targa GTS"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to left, rgba(6,7,10,0.0) 0%, rgba(6,7,10,0.7) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 72,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            maxWidth: 560,
          }}
        >
          <div style={{ textAlign: "right" }}>
            <ML style={{ marginBottom: 20 }}>· Closed out the top call · Same week ·</ML>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 76,
                fontWeight: 600,
                lineHeight: 0.98,
                letterSpacing: "-0.04em",
                color: "var(--bone)",
                margin: "0 0 20px",
              }}
            >
              Picked up in cash.
              <br />
              <em className="glow-acid" style={{ color: "var(--acid)" }}>
                End of cycle.
              </em>
            </h2>
            <ML color="var(--ash)">· Porsche 911 Targa GTS · Bought outright · Profit-paid ·</ML>
          </div>
        </div>
      </div>

      {/* Lifestyle grid */}
      <Section py={120}>
        <ML style={{ marginBottom: 20 }}>What the work funds</ML>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 60,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--bone)",
            margin: "0 0 48px",
          }}
        >
          Plan once a week. <em style={{ color: "var(--acid)" }}>Live everywhere else.</em>
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            background: "var(--line)",
          }}
        >
          {LIFESTYLE_TILES.map((tile, i) => (
            <LifestyleTile key={i} tile={tile} />
          ))}
        </div>
      </Section>
    </>
  );
}

function LifestyleTile({ tile }: { tile: { src: string; tag: string; line: string } }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-1)",
        border: `1px solid ${hovered ? "var(--acid)" : "var(--line)"}`,
        position: "relative",
        aspectRatio: "4/5",
        overflow: "hidden",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 180ms ease, border-color 180ms ease",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.src}
        alt={tile.tag}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(6,7,10,0.85) 0%, transparent 60%)",
        }}
      />
      <div style={{ position: "absolute", bottom: 20, left: 20 }}>
        <ML color="var(--acid)" style={{ marginBottom: 6 }}>
          {tile.tag}
        </ML>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 600,
            color: "var(--bone)",
          }}
        >
          {tile.line}
        </div>
      </div>
    </div>
  );
}
