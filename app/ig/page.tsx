"use client";

import Link from "next/link";
import { useState } from "react";

// Swap this for the real Vimeo/YouTube embed URL when the VSL is ready
const VSL_URL: string | null = null;

export default function IGPage() {
  const [vslaPlayed, setVslPlayed] = useState(false);

  return (
    <div
      className="grid-bg"
      style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--bone)" }}
    >
      {/* HEADER */}
      <header
        style={{
          borderBottom: "1px solid var(--line)",
          padding: "20px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/wsa/home/1.png"
          alt="Wall Street Academy"
          style={{ height: 40, width: 40, borderRadius: "50%", objectFit: "cover" }}
        />
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            color: "var(--acid)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          · Inner Circle · Now Open ·
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "64px 48px 0",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(800px 480px at 50% 0%, rgba(249,255,60,0.10), transparent 60%)",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--acid)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            · Wall Street Academy · Quillan Black ·
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(40px, 6vw, 64px)",
              lineHeight: 0.98,
              letterSpacing: "-0.045em",
              color: "var(--bone)",
              margin: "0 0 24px",
            }}
          >
            The Inner Circle
            <br />
            is{" "}
            <em style={{ color: "var(--acid)", fontStyle: "normal" }}>
              open again.
            </em>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 20,
              lineHeight: 1.5,
              color: "var(--ash)",
              margin: "0 auto 48px",
              maxWidth: 560,
              fontWeight: 400,
            }}
          >
            You said you&rsquo;re serious.{" "}
            <strong style={{ color: "var(--bone)" }}>This is the door.</strong>
          </p>
        </div>
      </section>

      {/* VSL */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 48px 56px" }}>
        {VSL_URL ? (
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              border: "1px solid var(--line)",
            }}
          >
            <iframe
              src={VSL_URL}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={() => setVslPlayed(true)}
            />
          </div>
        ) : (
          /* VSL Placeholder */
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              background: "var(--bg-1)",
              border: "1px solid var(--line)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
              }}
            >
              {/* Play icon */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  border: "2px solid var(--line-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--bg-2)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                >
                  <polygon points="10,7 22,14 10,21" fill="var(--acid)" />
                </svg>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--muted)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                · VSL coming soon ·
              </div>
            </div>
          </div>
        )}
      </section>

      {/* COPY BELOW VSL */}
      <section
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "0 48px 56px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 20,
            lineHeight: 1.5,
            color: "var(--ash)",
            margin: "0 0 14px",
          }}
        >
          My system. My direct guidance.{" "}
          <strong style={{ color: "var(--bone)" }}>Built to make you consistent.</strong>
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 20,
            lineHeight: 1.5,
            color: "var(--ash)",
            margin: "0 0 48px",
          }}
        >
          Serious applicants only —{" "}
          <strong style={{ color: "var(--bone)" }}>two minutes to apply.</strong>
        </p>

        {/* CTA */}
        <Link
          href="/qualify"
          style={{
            display: "inline-block",
            padding: "20px 40px",
            background: "var(--acid)",
            color: "var(--bg)",
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textDecoration: "none",
            boxShadow: "0 0 0 1px var(--acid), 0 0 48px rgba(249,255,60,0.3)",
            transition: "all 200ms ease",
          }}
        >
          Apply for the Inner Circle →
        </Link>

        <p
          style={{
            marginTop: 18,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            color: "var(--muted)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          · Takes 2 minutes · Spots are limited ·
        </p>
      </section>

      {/* PROOF STRIP */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 48px 80px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {[
            {
              n: "01",
              t: "A real system",
              d: "Step-by-step swing trading roadmap — no day trading, no 8-hour screen days.",
            },
            {
              n: "02",
              t: "My direct guidance",
              d: "Live calls, community, and direct access — not a course you buy and forget.",
            },
            {
              n: "03",
              t: "Built around your life",
              d: "Designed for people with jobs, families, and real schedules. Not a second job.",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-1)",
                border: "1px solid var(--line)",
                borderTop: "1px solid var(--acid)",
                padding: "20px 22px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--acid)",
                  letterSpacing: "0.22em",
                  marginBottom: 10,
                }}
              >
                · {s.n} ·
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "var(--bone)",
                  letterSpacing: "-0.015em",
                  marginBottom: 8,
                }}
              >
                {s.t}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: "var(--ash)",
                  fontWeight: 400,
                }}
              >
                {s.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "32px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 700,
          color: "var(--muted)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        <span>© 2026 · iknkfx inc · All Rights Reserved</span>
        <span>· Not financial advice · Trading involves real risk of loss ·</span>
      </footer>
    </div>
  );
}
