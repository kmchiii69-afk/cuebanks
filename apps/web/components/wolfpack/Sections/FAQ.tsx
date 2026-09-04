"use client";

import { useState } from "react";
import { H, Section } from "../Primitives";
import { FAQ_ITEMS } from "../content";

// Accordion — single open at a time. The original used `openIdx === -1` to
// track "none open"; we use `null` for the same idea with cleaner state.
export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <Section id="faq" py={140}>
      <H num="05" label="Frequently asked" title="Questions answered." />
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              style={{
                background: "var(--bg-1)",
                borderLeft: isOpen ? "2px solid var(--acid)" : "1px solid var(--line)",
                borderTop: "1px solid var(--line)",
                borderRight: "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "22px 28px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--bone)",
                    lineHeight: 1.4,
                  }}
                >
                  {item.q}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 20,
                    color: "var(--acid)",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 200ms ease",
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </button>
              {isOpen ? (
                <div style={{ padding: "0 28px 24px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "var(--ash)",
                      margin: 0,
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
