"use client";

import { ML, Wrap, WolfLogo } from "../Primitives";
import { FOOTER_OTHER_LINKS, FOOTER_PACK_LINKS } from "../content";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        background: "var(--bg-1)",
        padding: "56px 0 0",
      }}
    >
      <Wrap>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr",
            gap: 48,
            marginBottom: 56,
          }}
        >
          <div>
            <div style={{ marginBottom: 20 }}>
              <WolfLogo />
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: 1.7,
                color: "var(--ash)",
                margin: 0,
                maxWidth: 320,
              }}
            >
              The Wolfpack is a trading education program — not a financial advisory service. All
              results shown are documented, verifiable, and not typical.
            </p>
          </div>
          <div>
            <ML style={{ marginBottom: 20 }}>· The pack ·</ML>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FOOTER_PACK_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--ash)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <ML style={{ marginBottom: 20 }}>· Other lanes ·</ML>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FOOTER_OTHER_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--ash)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid var(--line)",
            padding: "24px 0 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ML color="var(--muted)">© 2026 Cue Banks · All rights reserved · Not financial advice ·</ML>
          <div style={{ display: "flex", gap: 24 }}>
            <a
              href="/privacy"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Privacy
            </a>
            <a
              href="/terms"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Terms
            </a>
          </div>
        </div>
      </Wrap>
    </footer>
  );
}
