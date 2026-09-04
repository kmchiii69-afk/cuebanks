"use client";

import { useEffect } from "react";
import type { ModalVideo } from "../types";

// Vimeo video modal — autoplay embed with acid accent. Shown when a phase
// item's "Play" button is clicked.
export default function VideoModal({ video, onClose }: { video: ModalVideo; onClose: () => void }) {
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
        background: "rgba(0,0,0,0.92)",
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
          maxWidth: 1020,
          background: "var(--bg-1)",
          border: "1px solid var(--line)",
          borderTop: "2px solid var(--acid)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            borderBottom: "1px solid var(--line)",
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
            {video.label}
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
        <div style={{ position: "relative", paddingTop: "56.25%" }}>
          <iframe
            src={`https://player.vimeo.com/video/${video.id}?${
              video.hash ? `h=${video.hash}&` : ""
            }autoplay=1&color=f9ff3c&title=0&byline=0&portrait=0`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
