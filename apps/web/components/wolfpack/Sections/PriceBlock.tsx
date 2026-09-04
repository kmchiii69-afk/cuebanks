"use client";

import { ML, Section, WolfMark } from "../Primitives";
import { PRICE_ROWS } from "../content";

// Big price block — two-pane (left copy + benefits, right price card with
// acid border). The actual price labels are passed in so /wolfpack-global
// can render the $297 version without override strings.
export default function PriceBlock({
  joinHref,
  altHref,
  priceLabel,
  smallLabel = "ONE PAYMENT",
}: {
  joinHref: string;
  altHref: string;
  priceLabel: string;
  smallLabel?: string;
}) {
  return (
    <Section id="join" py={120}>
      <div
        style={{
          border: "1px solid var(--acid)",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(37,99,235,0.08) 0%, transparent 70%)",
        }}
      >
        <WolfMark
          size={500}
          color="var(--acid)"
          style={{
            position: "absolute",
            right: -80,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.04,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            position: "relative",
          }}
        >
          {/* Left */}
          <div style={{ padding: "64px 56px", borderRight: "1px solid var(--line)" }}>
            <ML style={{ marginBottom: 24 }}>· Take your seat · One payment ·</ML>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 76,
                lineHeight: 0.98,
                letterSpacing: "-0.04em",
                color: "var(--bone)",
                margin: "0 0 24px",
              }}
            >
              Join the pack.
              <br />
              <em className="glow-acid" style={{ color: "var(--acid)" }}>
                Get the entire system.
              </em>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 17,
                lineHeight: 1.65,
                color: "var(--ash)",
                margin: "0 0 32px",
                maxWidth: 480,
              }}
            >
              One payment unlocks everything. No recurring fees. No upsells inside the room. The
              full Krypton system plus a weekly plan every Monday.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PRICE_ROWS.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: "var(--acid)", fontFamily: "var(--font-mono)", fontSize: 14 }}>
                    ✓
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      color: "var(--ash)",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Right: price card */}
          <div style={{ padding: "64px 56px", display: "flex", flexDirection: "column" }}>
            <div
              style={{
                background: "var(--bg-2)",
                borderTop: "4px solid var(--acid)",
                padding: "36px 32px",
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 28,
                }}
              >
                <ML>· The Wolfpack ·</ML>
                <ML color="var(--ash)">· VIA WHOP ·</ML>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 88,
                    fontWeight: 600,
                    color: "var(--acid)",
                    lineHeight: 1,
                  }}
                >
                  {priceLabel}
                </span>
                <ML>· {smallLabel}</ML>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: "var(--ash)",
                  margin: "0 0 28px",
                }}
              >
                Krypton Course + Weekly Trade Alerts. Lifetime access to the course.
              </p>
              <a
                href={joinHref}
                className="btn"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  display: "flex",
                  marginBottom: 20,
                }}
              >
                Buy Now → Join the Wolfpack
              </a>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <ML color="var(--muted)">· SECURE · WHOP CHECKOUT ·</ML>
                <a
                  href={altHref}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--acid)",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  Browse all plans →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
