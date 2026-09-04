"use client";

import { M, S, D } from "./fonts";
import type { Member } from "./types";
import { fmtJoin } from "./types";

type Props = {
  member: Member;
  loggingOut: boolean;
  onLogout: () => void;
};

/** Low-tier membership view — Cue AI access only, no roadmap/tools.
 *  Shows the user what they have and gives them the Cue AI link. */
export default function LowTicketScreen({ member, loggingOut, onLogout }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <nav
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 28px",
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(0,0,0,0.95)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wsa/home/1.png"
            alt="WSA"
            style={{
              height: 38,
              width: 38,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
          <div>
            <div
              style={{
                ...M,
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Wall Street Academy
            </div>
            <div
              style={{
                ...M,
                fontSize: 8,
                color: "rgba(255,255,255,0.22)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginTop: 3,
              }}
            >
              Member Portal
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              ...M,
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#a855f7",
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.2)",
              borderRadius: 4,
              padding: "4px 10px",
            }}
          >
            Low Ticket
          </span>
          {member.name ? (
            <span style={{ ...S, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
              {member.name.split(" ")[0]}
            </span>
          ) : null}
          <button
            onClick={onLogout}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 5,
              padding: "6px 14px",
              ...M,
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer",
            }}
          >
            {loggingOut ? "..." : "Sign out"}
          </button>
        </div>
      </nav>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          position: "relative",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(168,85,247,0.06), transparent 70%)",
          }}
        />
        <div style={{ position: "relative", maxWidth: 520, width: "100%", textAlign: "center" }}>
          <div
            style={{
              ...M,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "rgba(168,85,247,0.6)",
              marginBottom: 16,
            }}
          >
            Your Access · 4 Months
          </div>
          <h1
            style={{
              ...D,
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#fff",
              margin: "0 0 12px",
              lineHeight: 1.1,
            }}
          >
            Welcome{member.name ? `, ${member.name.split(" ")[0]}` : ""}.
          </h1>
          <p
            style={{
              ...S,
              fontSize: 16,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.7,
              margin: "0 0 48px",
            }}
          >
            Your membership includes full access to Cue AI for 4 months. Ask anything — setups,
            strategy, entries, risk management. Cue is available 24/7.
          </p>
          <a
            href="/cue"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.35)",
              borderRadius: 14,
              padding: "22px 36px",
              textDecoration: "none",
              transition: "all 0.2s",
              width: "100%",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.18)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.1)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.35)";
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "rgba(168,85,247,0.15)",
                border: "1px solid rgba(168,85,247,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ ...M, fontWeight: 800, fontSize: 22, color: "#a855f7", lineHeight: 1 }}>
                C
              </span>
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ ...D, fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                Open Cue AI
              </div>
              <div style={{ ...S, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                Your personal trading mentor · Available 24/7
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="rgba(168,85,247,0.6)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <div
            style={{
              marginTop: 28,
              ...M,
              fontSize: 8,
              color: "rgba(255,255,255,0.18)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Joined {fmtJoin(member.created_at)} · 4-Month Access
          </div>
        </div>
      </main>
    </div>
  );
}
