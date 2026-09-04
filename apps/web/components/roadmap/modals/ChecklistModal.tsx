"use client";

import { useEffect, useState } from "react";
import type { ChecklistDoc } from "../types";

// Interactive pre-trade checklist. Red theme = "no trade" list, green =
// "trade ready". Toggle items, watch the no-trade banner light up at ≥2.
export default function ChecklistModal({ doc, onClose }: { doc: ChecklistDoc; onClose: () => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const totalItems = doc.sections.reduce((sum, s) => sum + s.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const isRed = doc.theme === "red";
  const accent = isRed ? "#ef4444" : "#22c55e";
  const noTrade = isRed && checkedCount >= 2;

  function toggle(key: string) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.94)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 680,
          maxHeight: "85vh",
          background: isRed ? "rgba(10,3,3,0.98)" : "rgba(3,10,6,0.98)",
          border: `1px solid ${accent}22`,
          borderTop: `2px solid ${accent}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            borderBottom: `1px solid ${accent}1a`,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 700,
                color: accent,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {doc.title}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: `${accent}66`,
                letterSpacing: "0.14em",
              }}
            >
              {checkedCount} / {totalItems}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              fontSize: 20,
              lineHeight: 1,
              padding: "0 4px",
            }}
          >
            ✕
          </button>
        </div>
        {noTrade ? (
          <div
            style={{
              padding: "10px 24px",
              background: "#ef44441a",
              borderBottom: "1px solid #ef444430",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 800,
                color: "#ef4444",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              ⛔ NO TRADE TODAY
            </span>
          </div>
        ) : null}
        <div style={{ overflowY: "auto", padding: "20px 24px", flex: 1 }}>
          {doc.sections.map((section, si) => (
            <div key={si} style={{ marginBottom: 22 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  fontWeight: 700,
                  color: `${accent}aa`,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                {section.heading}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`;
                  const on = !!checked[key];
                  return (
                    <label
                      key={key}
                      onClick={() => toggle(key)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        cursor: "pointer",
                        padding: "8px 12px",
                        borderRadius: 5,
                        background: on ? `${accent}10` : "rgba(255,255,255,0.02)",
                        border: `1px solid ${on ? accent + "30" : "rgba(255,255,255,0.06)"}`,
                        transition: "all 0.12s",
                      }}
                    >
                      <div
                        style={{
                          width: 15,
                          height: 15,
                          borderRadius: 3,
                          border: `1.5px solid ${on ? accent : "rgba(255,255,255,0.18)"}`,
                          background: on ? accent : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 2,
                          transition: "all 0.12s",
                        }}
                      >
                        {on ? (
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path
                              d="M1 3.5L3.5 6L8 1"
                              stroke={isRed ? "#fff" : "#000"}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : null}
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13.5,
                          lineHeight: 1.55,
                          color: on ? accent : "rgba(255,255,255,0.55)",
                          transition: "color 0.12s",
                        }}
                      >
                        {item.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {doc.rule ? (
          <div
            style={{
              padding: "12px 24px",
              borderTop: `1px solid ${accent}18`,
              background: noTrade ? "#ef44441a" : "transparent",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 700,
                color: noTrade ? "#ef4444" : `${accent}44`,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {noTrade ? "⛔ " : "· "}
              {doc.rule} ·
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
