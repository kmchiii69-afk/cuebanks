"use client";

import { useState } from "react";
import type { Video } from "@/lib/roadmap-data";
import type {
  ChecklistDoc,
  DocContent,
  PhaseItem,
} from "./types";

const btnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "3px 9px 3px 7px",
  background: "rgba(37,99,235,0.07)",
  border: "1px solid rgba(37,99,235,0.2)",
  color: "var(--acid)",
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "background 0.12s, border-color 0.12s",
  whiteSpace: "nowrap",
  textDecoration: "none",
};

const btnEnter = (e: React.MouseEvent<HTMLElement>) => {
  (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.15)";
  (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.5)";
};
const btnLeave = (e: React.MouseEvent<HTMLElement>) => {
  (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.07)";
  (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.2)";
};

export function PlayBtn({
  video,
  onPlay,
}: {
  video: Video;
  onPlay: (v: Video) => void;
}) {
  if (video.href) {
    return (
      <a
        href={video.href}
        target="_blank"
        rel="noopener noreferrer"
        style={btnStyle}
        onMouseEnter={btnEnter}
        onMouseLeave={btnLeave}
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 1h6v6H1zM3 3h2v2H3z" stroke="currentColor" strokeWidth="1" />
        </svg>
        {video.label}
      </a>
    );
  }
  return (
    <button onClick={() => onPlay(video)} style={btnStyle} onMouseEnter={btnEnter} onMouseLeave={btnLeave}>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1.5 1L7 4L1.5 7V1Z" fill="currentColor" />
      </svg>
      {video.label}
    </button>
  );
}

type ModuleItemHandlers = {
  onPlay: (v: Video) => void;
  onOpenDoc: (doc: DocContent) => void;
  onOpenChecklist: (c: ChecklistDoc) => void;
  onOpenImages: (images: string[], title: string) => void;
};

// Single row inside a Phase card. Hover lifts opacity + accent border.
// Each button (Read/Checklist/Images/Play) calls its handler prop.
export default function ModuleItem({
  item,
  index,
  isLast,
  onPlay,
  onOpenDoc,
  onOpenChecklist,
  onOpenImages,
}: {
  item: PhaseItem;
  index: number;
  isLast: boolean;
} & ModuleItemHandlers) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
        padding: "26px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.06)",
        transition: "background 0.15s",
        borderRadius: 6,
        marginLeft: -12,
        marginRight: -12,
        paddingLeft: 12,
        paddingRight: 12,
        background: hovered ? "rgba(255,255,255,0.025)" : "transparent",
        cursor: "default",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 30,
          height: 30,
          borderRadius: "50%",
          border: hovered ? "1px solid rgba(37,99,235,0.35)" : "1px solid rgba(255,255,255,0.1)",
          background: hovered ? "rgba(37,99,235,0.06)" : "rgba(255,255,255,0.03)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
          transition: "border-color 0.15s, background 0.15s",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            color: hovered ? "rgba(37,99,235,0.7)" : "rgba(255,255,255,0.3)",
          }}
        >
          {index + 1}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 17,
              color: hovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.9)",
              letterSpacing: "-0.02em",
              transition: "color 0.15s",
            }}
          >
            {item.label}
          </span>
          {item.tag ? (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#fff",
                background: "var(--acid)",
                padding: "3px 8px",
                borderRadius: 3,
              }}
            >
              {item.tag}
            </span>
          ) : null}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.5)",
            marginBottom: item.videos?.length || item.doc || item.checklist || item.images?.length ? 14 : 0,
          }}
        >
          {item.note}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {item.doc ? (
            <button
              onClick={() => onOpenDoc(item.doc!)}
              style={{
                ...btnStyle,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.55)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(37,99,235,0.07)";
                e.currentTarget.style.borderColor = "rgba(37,99,235,0.3)";
                e.currentTarget.style.color = "var(--acid)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                e.currentTarget.style.color = "rgba(255,255,255,0.55)";
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 1h4l2 2v5H1V1z" stroke="currentColor" strokeWidth="1" />
                <path d="M5 1v2h2" stroke="currentColor" strokeWidth="1" />
              </svg>
              Read
            </button>
          ) : null}
          {item.checklist ? (
            <button
              onClick={() => onOpenChecklist(item.checklist!)}
              style={{
                ...btnStyle,
                background:
                  item.checklist.theme === "red" ? "rgba(239,68,68,0.07)" : "rgba(34,197,94,0.07)",
                border: `1px solid ${
                  item.checklist.theme === "red" ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"
                }`,
                color: item.checklist.theme === "red" ? "#ef4444" : "#22c55e",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  item.checklist!.theme === "red" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  item.checklist!.theme === "red" ? "rgba(239,68,68,0.07)" : "rgba(34,197,94,0.07)";
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 2h6M1 4h4M1 6h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Checklist
            </button>
          ) : null}
          {item.images && item.images.length > 0 ? (
            <button
              onClick={() => onOpenImages(item.images!, item.label)}
              style={{
                ...btnStyle,
                background: "rgba(99,102,241,0.07)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#818cf8",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.07)";
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1" />
                <path
                  d="M1 5.5L3 3.5L4.5 5L5.5 4L7 5.5"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
              </svg>
              Images
            </button>
          ) : null}
          {item.videos?.map((v) => (
            <PlayBtn key={v.href ?? v.id} video={v} onPlay={onPlay} />
          ))}
        </div>
      </div>
    </div>
  );
}
