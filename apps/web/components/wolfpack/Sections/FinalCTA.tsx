"use client";

import { ML, Section, WolfMark } from "../Primitives";

// Closing CTA — "stay a sheep, or become one." Acid-bordered section with
// watermark + price-tagged CTA buttons. The price label is passed in.
export default function FinalCTA({
  joinHref,
  priceLabel,
}: {
  joinHref: string;
  priceLabel: string;
}) {
  return (
    <Section py={120}>
      <div
        style={{
          border: "1px solid var(--acid)",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(37,99,235,0.08) 0%, transparent 70%)",
          padding: "80px 48px",
        }}
      >
        <WolfMark
          size={500}
          color="var(--acid)"
          style={{
            position: "absolute",
            bottom: -100,
            left: -80,
            opacity: 0.04,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 940,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <WolfMark size={56} color="var(--acid)" />
          </div>
          <ML style={{ marginBottom: 20, justifyContent: "center", display: "flex" }}>
            · Stay a sheep · get eaten by the wolves ·
          </ML>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 96,
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              margin: "0 0 32px",
            }}
          >
            <span style={{ color: "var(--bone)" }}>Or </span>
            <em className="glow-acid" style={{ color: "var(--acid)" }}>
              become one.
            </em>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 19,
              lineHeight: 1.7,
              color: "var(--ash)",
              margin: "0 auto 40px",
              maxWidth: 680,
            }}
          >
            The system is built. The receipts are on the wall. The only question is whether
            you&apos;re in the pack or watching from the outside.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <a href={joinHref} className="btn btn-lg">
              Buy Now · {priceLabel} →
            </a>
            <a href="#package" className="btn btn-ghost btn-lg">
              See What&apos;s Inside
            </a>
          </div>
          <ML color="var(--ash)" style={{ justifyContent: "center", display: "flex" }}>
            · 4.95★ across 135 verified Whop reviews · Receipts on the wall ·
          </ML>
        </div>
      </div>
    </Section>
  );
}
