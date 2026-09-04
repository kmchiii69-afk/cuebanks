"use client";

import { useEffect, useState } from "react";

// Multi-image gallery modal: starts as a grid, click a thumbnail to view full size.
export default function ImageGalleryModal({
  images,
  title,
  onClose,
}: {
  images: string[];
  title: string;
  onClose: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (active) setActive(null);
        else onClose();
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose, active]);

  function closeOrBack() {
    if (active) setActive(null);
    else onClose();
  }

  return (
    <div
      onClick={closeOrBack}
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
          maxWidth: active ? 1100 : 860,
          background: "rgba(8,10,16,0.98)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "2px solid var(--acid)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {active ? (
              <button
                onClick={() => setActive(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  fontSize: 13,
                  padding: "0 4px 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M8 2L4 6L8 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : null}
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
              {active ? "IMAGE" : title}
            </span>
            {!active ? (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.12em",
                }}
              >
                {images.length} charts
              </span>
            ) : null}
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
        <div style={{ overflowY: "auto", padding: active ? 0 : 20 }}>
          {active ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={active} alt="" style={{ width: "100%", display: "block" }} />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 12,
              }}
            >
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(src)}
                  style={{
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 4,
                    padding: 0,
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Chart ${i + 1}`} style={{ width: "100%", display: "block" }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
