"use client";

import { useState, useRef } from "react";

export default function BookConfirmPage() {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function handlePlay() {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method: "play" }),
      "https://player.vimeo.com"
    );
    setPlaying(true);
  }

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
          style={{ height: 64, width: 64, borderRadius: "50%", objectFit: "cover" }}
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
          · You&rsquo;re Booked In ·
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "56px 48px 40px",
          textAlign: "left",
        }}
      >
        <p
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 18,
            lineHeight: 1.7,
            color: "var(--ash)",
            margin: "0 0 16px",
            fontWeight: 400,
          }}
        >
          You&rsquo;re booked in.
        </p>
        <p
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 18,
            lineHeight: 1.7,
            color: "var(--bone)",
            margin: 0,
            fontWeight: 500,
          }}
        >
          Watch this quick video so you understand the offer and what we&rsquo;ll be going through.
        </p>
      </section>

      {/* VIDEO */}
      <section style={{ maxWidth: 420, margin: "0 auto", padding: "0 24px 56px" }}>
        <div
          style={{
            border: "1px solid var(--line)",
            borderTop: "2px solid var(--acid)",
            background: "var(--bg-1)",
            position: "relative",
            paddingBottom: "177.78%",
            overflow: "hidden",
          }}
        >
          <iframe
            ref={iframeRef}
            src="https://player.vimeo.com/video/1205827279?title=0&byline=0&portrait=0&badge=0&autopause=0&autoplay=0&api=1&player_id=vimeo-confirm&app_id=58479"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            title="cue post booking"
          />
          {!playing && (
            <button
              onClick={handlePlay}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                background: "#0a0a0a", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 16,
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "var(--acid)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 40px rgba(37,99,235,0.25)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1.08)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 60px rgba(37,99,235,0.4)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(37,99,235,0.25)";
                }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M10 7L22 14L10 21V7Z" fill="#000" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                Click to play
              </span>
            </button>
          )}
        </div>
      </section>

      {/* INSTRUCTIONS */}
      <section
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "0 48px 40px",
        }}
      >
        <p
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--ash)",
            margin: "0 0 28px",
            fontWeight: 400,
          }}
        >
          Make sure you show up on time, in a quiet place, and ready to properly go through
          your situation, your goals, and whether this is actually a good fit.
        </p>

        <div
          style={{
            borderLeft: "2px solid var(--acid)",
            paddingLeft: 20,
            marginBottom: 40,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 700,
              color: "var(--acid)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              margin: "0 0 16px",
            }}
          >
            Before the call, have a think about:
          </p>
          {[
            "What you're trying to achieve",
            "What's currently holding you back",
            "What you're ready to invest if it makes sense",
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 10,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--acid)",
                  letterSpacing: "0.1em",
                  marginTop: 3,
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "var(--bone)",
                  fontWeight: 400,
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--ash)",
            margin: "0 0 4px",
            fontWeight: 400,
          }}
        >
          Looking forward to speaking with you.
        </p>
        <p
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--bone)",
            margin: 0,
            fontWeight: 600,
          }}
        >
          — Cue Black
        </p>
      </section>
    </div>
  );
}
