"use client";

import { useEffect, useState } from "react";

// Floating "Book a Call" button bottom-left + modal that loads Calendly
// in an iframe. The host name on the existing cuidapps embed is preserved.
export default function CalendlyWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open]);

  return (
    <>
      {open ? (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.88)",
            zIndex: 1001,
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
              maxWidth: 740,
              background: "rgba(8,10,16,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
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
                padding: "12px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                flexShrink: 0,
              }}
            >
              <div>
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
                  Book Your 1-on-1 Call
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.4)",
                    margin: "3px 0 0",
                  }}
                >
                  Your call will be with Felipe, trained directly under Cue for years. He knows this
                  system inside out — come prepared with your questions.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  fontSize: 20,
                  lineHeight: 1,
                  padding: "0 4px",
                  flexShrink: 0,
                  marginLeft: 16,
                }}
              >
                ✕
              </button>
            </div>
            <iframe
              src="https://calendly.com/alex-wsacademyfx?background_color=080a10&text_color=ffffff&primary_color=2563eb"
              style={{
                width: "100%",
                height: 580,
                border: "none",
                display: "block",
              }}
              title="Book your 1-on-1 call"
            />
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "0 16px 0 6px",
          height: 44,
          borderRadius: 30,
          background: "rgba(10,14,22,0.92)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(37,99,235,0.25)",
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.55)";
          (e.currentTarget as HTMLElement).style.background = "rgba(20,24,38,0.96)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.25)";
          (e.currentTarget as HTMLElement).style.background = "rgba(10,14,22,0.92)";
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(37,99,235,0.08)",
            border: "1px solid rgba(37,99,235,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2" width="12" height="11" rx="1.5" stroke="var(--acid)" strokeWidth="1.2" />
            <path
              d="M4 1v2M10 1v2M1 5h12"
              stroke="var(--acid)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <rect x="3.5" y="7" width="2" height="2" rx="0.4" fill="var(--acid)" />
            <rect x="6.5" y="7" width="2" height="2" rx="0.4" fill="var(--acid)" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Book a Call
        </span>
      </button>
    </>
  );
}
