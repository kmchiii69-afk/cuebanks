"use client";

import { H, ML, Section } from "../Primitives";
import { ResultBanner } from "../Tiles";
import { RESULT_BANNERS } from "../content";

// Verified results stack — three full-width result banners separated by 1px
// hairlines, plus a CTA bar at the bottom. Bar copy says whatever price
// was passed — keeps the global variant reusable without override strings.
export default function Results({
  joinHref,
  priceLabel,
}: {
  joinHref: string;
  priceLabel: string;
}) {
  return (
    <Section id="results" py={140}>
      <H
        num="03"
        label="Verified results"
        title="Documented. Timestamped. On the record."
        sub="Three of the most notable documented results from the Krypton framework — each with a verifiable P&L."
      />
      <div style={{ border: "1px solid var(--line)", marginBottom: 1 }}>
        {RESULT_BANNERS.map((r, i) => (
          <ResultBanner key={i} {...r} />
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
          <ML>Krypton Course + Weekly Trade Alerts · {priceLabel} one-time</ML>
        </div>
        <a href={joinHref} className="btn">
          Buy Now
        </a>
      </div>
    </Section>
  );
}
