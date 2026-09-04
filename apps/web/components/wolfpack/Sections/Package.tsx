"use client";

import { H, ML, Section, WolfMark } from "../Primitives";
import { PackageTile } from "../Tiles";
import { PACKAGE_TILES } from "../content";

// Six-package stack — the actual deliverables customers unlock. The
// closing bar mentions the price, param'd so the global variant can
// override.
export default function Package({ joinHref, priceLabel }: { joinHref: string; priceLabel: string }) {
  return (
    <Section id="package" py={140}>
      <H
        num="01"
        label="The Wolf Package"
        title="Everything. One payment."
        sub="Six deliverables, unlocked instantly. No upsells inside. No drip. No gatekeeping."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {PACKAGE_TILES.map((tile) => (
          <PackageTile key={tile.idx} {...tile} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid var(--acid)",
          background: "var(--bg-1)",
          padding: "20px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <WolfMark size={22} />
          <ML>All six unlocked · One payment · {priceLabel}</ML>
        </div>
        <a href={joinHref} className="btn">
          Buy Now →
        </a>
      </div>
    </Section>
  );
}
