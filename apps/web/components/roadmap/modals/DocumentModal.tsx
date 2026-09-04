"use client";

import { useEffect } from "react";
import type { DocContent } from "../types";

// Full-page document modal — used by every phase item that has `.doc`.
// Press Escape to close. Inner click stops propagation so outside-click
// doesn't dismiss when the user is interacting with content.
export default function DocumentModal({ doc, onClose }: { doc: DocContent; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

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
          maxWidth: 720,
          maxHeight: "85vh",
          background: "var(--bg-1)",
          border: "1px solid var(--line)",
          borderTop: "2px solid var(--acid)",
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
            borderBottom: "1px solid var(--line)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--acid)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {doc.title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              lineHeight: 1,
              fontSize: 20,
              padding: "0 4px",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ overflowY: "auto", padding: "28px 32px", flex: 1 }}>
          {doc.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--acid)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                {s.heading}
              </div>
              {s.paras?.map((p, j) => (
                <p
                  key={j}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.6)",
                    margin: "0 0 10px",
                  }}
                >
                  {p}
                </p>
              ))}
              {s.bullets ? (
                <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>
                  {s.bullets.map((b, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        gap: 10,
                        fontFamily: "var(--font-body)",
                        fontSize: 13.5,
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.5)",
                        marginBottom: 7,
                      }}
                    >
                      <span style={{ color: "var(--acid)", flexShrink: 0, marginTop: 1 }}>·</span>
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
              {s.footer ? (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "rgba(37,99,235,0.65)",
                    marginTop: 12,
                    fontStyle: "italic",
                  }}
                >
                  {s.footer}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
