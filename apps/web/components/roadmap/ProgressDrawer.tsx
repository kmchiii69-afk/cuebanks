"use client";

import { useState } from "react";
import type { Member } from "./types";

function fmt(ts: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Right-side slide-out drawer: progress bar over the 16-week curriculum,
// per-phase jump list, and a localStorage-persisted note pad.
export default function ProgressDrawer({ member }: { member: Member | null }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  // Initialize from localStorage once member loads; the page-level effect
  // sets `notes` when `member.email` arrives.
  function saveNotes() {
    if (!member) return;
    localStorage.setItem(`wsa-notes-${member.email}`, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  // The component reads member + jumps at render time. It uses the
  // `member?.phase_progress` to render the active/done states.
  const progress = member?.phase_progress;
  const phaseCount = Object.keys(progress ?? {}).length;

  return (
    <>
      {/* Profile avatar → opens drawer */}
      <button
        onClick={() => setOpen(true)}
        title={member?.name || "My Progress"}
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: member ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.06)",
          border: `1.5px solid ${member ? "rgba(37,99,235,0.4)" : "rgba(255,255,255,0.14)"}`,
          color: member ? "var(--acid)" : "var(--muted)",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(37,99,235,0.2)";
          e.currentTarget.style.borderColor = "rgba(37,99,235,0.7)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = member
            ? "rgba(37,99,235,0.12)"
            : "rgba(255,255,255,0.06)";
          e.currentTarget.style.borderColor = member
            ? "rgba(37,99,235,0.4)"
            : "rgba(255,255,255,0.14)";
        }}
      >
        {member ? member.name.charAt(0).toUpperCase() : "?"}
      </button>

      {open ? (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 200,
            backdropFilter: "blur(2px)",
          }}
        />
      ) : null}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 340,
          background: "#0a0c10",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0, 0.2, 1)",
          overflowY: "auto",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--acid)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              My Progress
            </div>
            {member ? (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {member.cohort ? `Cohort ${member.cohort}` : "WSA Member"} · Joined{" "}
                {fmt(member.created_at)}
              </div>
            ) : null}
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
              padding: "0 2px",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--bone)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--muted)";
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "20px 20px 8px", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Curriculum ({phaseCount} done)
            </span>
          </div>
          <div
            style={{
              height: 3,
              background: "rgba(255,255,255,0.07)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(phaseCount / 8) * 100}%`,
                background: "var(--acid)",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Notes */}
        <div
          style={{
            padding: "0 20px 24px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Notes & Feedback
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Questions, feedback, what you're working on..."
            style={{
              flex: 1,
              minHeight: 140,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "12px 14px",
              color: "var(--bone)",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              lineHeight: 1.65,
              resize: "none",
              outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(37,99,235,0.25)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          />
          <button
            onClick={saveNotes}
            style={{
              background: notesSaved ? "rgba(34,197,94,0.12)" : "rgba(37,99,235,0.08)",
              border: `1px solid ${notesSaved ? "rgba(34,197,94,0.3)" : "rgba(37,99,235,0.2)"}`,
              borderRadius: 7,
              padding: "10px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: notesSaved ? "#22c55e" : "var(--acid)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {notesSaved ? "✓ Saved" : "Save Notes"}
          </button>
        </div>
      </div>
    </>
  );
}
