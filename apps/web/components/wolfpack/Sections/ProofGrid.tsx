"use client";

import { H, ML, Section } from "../Primitives";
import { WolfWinTile } from "../Tiles";
import { WOLF_WIN_TILES } from "../content";

// 3-col masonry of student-posted wins — receipts from the live chat.
// The CTA bar at the bottom mirrors the bar at the bottom of Results.
export default function ProofGrid({ joinHref }: { joinHref: string }) {
  return (
    <Section id="proof" py={140}>
      <H
        num="05"
        label="Student wins"
        title="The pack ships receipts."
        sub="Twelve of hundreds posted in the live chat. Real trades, real accounts, real money."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: "var(--line)",
          marginBottom: 1,
        }}
      >
        {WOLF_WIN_TILES.map((w, i) => (
          <WolfWinTile key={i} {...w} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          background: "var(--bg-1)",
          padding: "20px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          <ML>12 of hundreds · Posted in the live chat every week</ML>
        </div>
        <a href={joinHref} className="btn">
          Buy Now
        </a>
      </div>
    </Section>
  );
}
