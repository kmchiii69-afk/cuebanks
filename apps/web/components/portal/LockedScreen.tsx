"use client";

import { M, S, D } from "./fonts";
import type { Member } from "./types";

type Props = {
  member: Member;
  loggingOut: boolean;
  onLogout: () => void;
};

/** Shown to members who completed onboarding but haven't had their
 *  1-on-1 CSM call yet. Walks them through what's about to unlock and
 *  provides a logout handle. */
export default function LockedScreen({ member, loggingOut, onLogout }: Props) {
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
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(37,99,235,0.05), transparent 70%)",
          }}
        />
        <div style={{ position: "relative", maxWidth: 540, width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(37,99,235,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="4" y="6" width="20" height="18" rx="2" stroke="rgba(37,99,235,0.7)" strokeWidth="1.5" />
                <path d="M4 11h20" stroke="rgba(37,99,235,0.7)" strokeWidth="1.5" />
                <path d="M9 4v4M19 4v4" stroke="rgba(37,99,235,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="17" r="1.5" fill="rgba(37,99,235,0.7)" />
                <circle cx="14" cy="17" r="1.5" fill="rgba(37,99,235,0.7)" />
                <circle cx="18" cy="17" r="1.5" fill="rgba(37,99,235,0.7)" />
              </svg>
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                ...M,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "rgba(37,99,235,0.6)",
                marginBottom: 14,
              }}
            >
              Onboarding Complete · Next Step
            </div>
            <h1
              style={{
                ...D,
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "#fff",
                margin: "0 0 14px",
                lineHeight: 1.1,
              }}
            >
              Your onboarding call
              <br />
              is your unlock.
            </h1>
            <p
              style={{
                ...S,
                fontSize: 15,
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.7,
                margin: "0 auto",
                maxWidth: 440,
              }}
            >
              Your Client Success Manager will walk you through the entire platform on your call.
              Once that&apos;s done, your full access gets activated — the roadmap, Cue AI,
              live sessions, everything.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: "2px solid rgba(37,99,235,0.4)",
              borderRadius: 10,
              padding: "24px 28px",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                ...M,
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                marginBottom: 16,
              }}
            >
              What unlocks after your call
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "◆", label: "Cue AI", desc: "Your personal trading mentor — available 24/7" },
                { icon: "◆", label: "Roadmap", desc: "7-phase curriculum built around your trading goals" },
                { icon: "◆", label: "Live Sessions", desc: "Weekly group calls, recordings, and market analysis" },
                { icon: "◆", label: "Trading Tools", desc: "Position size calculator, session countdown, forex calendar" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span
                    style={{
                      ...M,
                      fontSize: 8,
                      color: "rgba(37,99,235,0.5)",
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <span style={{ ...S, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                      {item.label}
                    </span>
                    <span style={{ ...S, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                      {" "}
                      — {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ ...S, fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>
              Questions before your call?{" "}
              <a
                href="mailto:alex@wsacademyfx.com"
                style={{ color: "rgba(37,99,235,0.6)", textDecoration: "none" }}
              >
                alex@wsacademyfx.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
