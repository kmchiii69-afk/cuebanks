"use client";

import { useEffect, useState } from "react";
import { ML, WolfLogo, WolfMark, Wrap } from "./Primitives";
import { RECEIPT_STATS, TICKER_BASE } from "./content";

const TICKER_ITEMS = [...TICKER_BASE, ...TICKER_BASE, ...TICKER_BASE];

// Sticky bar that slides down once the user is past the hero — promotes the
// join CTA and the price on every long page.
export function WolfStickyBar({
  joinHref,
  priceLabel,
}: {
  joinHref: string;
  priceLabel: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 700);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: "rgba(6,7,10,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--acid)",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 260ms ease",
      }}
    >
      <Wrap style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 48px" }}>
        <WolfLogo size={22} />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <ML style={{ whiteSpace: "nowrap" }}>
            <span
              className="pulse"
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--acid)",
                marginRight: 8,
              }}
            />
            · Krypton + Alerts · {priceLabel} · One Payment ·
          </ML>
          <a href={joinHref} className="btn" style={{ padding: "10px 20px", fontSize: 11 }}>
            Buy Now
          </a>
        </div>
      </Wrap>
    </div>
  );
}

// Top banner shown to traffic that arrived via the Mentorship application.
// Reads differently than a CTA — explains this is the self-serve lane.
export function DownsellBar() {
  return (
    <div
      style={{
        background: "var(--bg-1)",
        borderBottom: "1px solid var(--line)",
        padding: "11px 0",
      }}
    >
      <Wrap
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            className="pulse"
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--ash)",
              flexShrink: 0,
            }}
          />
          <ML color="var(--ash)">
            · You came from the Mentorship application · This is the operator&apos;s self-serve lane ·
          </ML>
        </div>
        <ML color="var(--acid)">· WOLFPACK · KRYPTON COURSE + WEEKLY ALERTS ·</ML>
      </Wrap>
    </div>
  );
}

// CSS-only marquee — the keyframe `ticker` is defined in globals.css. Doubles
// the items so the loop lands seamlessly when the track resets to 0.
export function WolfTicker() {
  return (
    <div
      style={{
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        background: "var(--bg-1)",
        padding: "14px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 48,
          whiteSpace: "nowrap",
          animation: "ticker 60s linear infinite",
          width: "max-content",
        }}
      >
        {TICKER_ITEMS.map((item, i) => (
          <span
            key={i}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, color: item.color }}
          >
            <WolfMark size={14} color={item.color} />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.2em",
              }}
            >
              {item.text}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Vimeo-embed VSL slot. Click swaps the poster for an autoplay iframe.
export function WolfVSL({ vimeoId }: { vimeoId: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      onClick={() => !playing && setPlaying(true)}
      style={{
        position: "relative",
        aspectRatio: "16/9",
        border: "1px solid var(--acid)",
        boxShadow: "0 0 0 1px var(--acid), 0 8px 64px rgba(37,99,235,0.12)",
        background: "var(--bg-2)",
        cursor: playing ? "default" : "pointer",
        overflow: "hidden",
      }}
    >
      {playing ? (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/cam/at-the-charts.jpg"
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center right",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(6,7,10,0.82) 0%, rgba(6,7,10,0.55) 50%, rgba(6,7,10,0.30) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(6,7,10,0.70) 0%, transparent 40%)",
            }}
          />
          <div style={{ position: "absolute", top: 20, left: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span
              className="pulse"
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--acid)",
              }}
            />
            <ML>· WOLFPACK · WALKTHROUGH</ML>
          </div>
          <div style={{ position: "absolute", top: 20, right: 20 }}>
            <ML color="var(--bone)">VIMEO · HD</ML>
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 110,
                height: 110,
                background: "var(--acid)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--bg)">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 600,
                  color: "var(--bone)",
                  marginBottom: 10,
                }}
              >
                Watch How I Read the Market Before It Moves
              </div>
              <ML color="var(--ash)">· SOUND ON · FULL SCREEN ·</ML>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 4-up receipt stats strip — most-installed sales asset on the page.
export function ReceiptStrip() {
  return (
    <div
      style={{
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        background: "var(--bg-1)",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
      }}
    >
      {RECEIPT_STATS.map((s, i) => (
        <div
          key={i}
          style={{
            padding: "36px 28px",
            borderLeft: i > 0 ? "1px solid var(--line)" : "none",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 52,
              fontWeight: 600,
              color: s.color,
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            {s.v}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--ash)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {s.k}
          </div>
        </div>
      ))}
    </div>
  );
}
