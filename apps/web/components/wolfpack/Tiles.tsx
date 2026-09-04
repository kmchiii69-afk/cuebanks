"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ML } from "./Primitives";
import type {
  FuruRowData,
  KryptonCaseData,
  PackageTileData,
  ResultBannerData,
  TradeRowData,
  WolfWinTileData,
  TopCallTileData,
} from "./data";

// ── KryptonCase — single case-study tile; the grid of four lives on the page. ──
export function KryptonCase({ tag, big, from, span, note, accent = "var(--acid)" }: KryptonCaseData) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderTop: `2px solid ${accent}`,
        background: "var(--bg-1)",
        padding: "28px 28px 32px",
        position: "relative",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 180ms ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <ML color={accent}>{tag}</ML>
        <ML color="var(--muted)">{span}</ML>
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 56,
          fontWeight: 600,
          color: accent,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {big}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--ash)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        {from}
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 14,
          lineHeight: 1.65,
          color: "var(--ash)",
          margin: 0,
        }}
      >
        {note}
      </p>
    </div>
  );
}

// ── PackageTile — single row in the package grid (left meta / right bullets). ──
export function PackageTile({ idx, kicker, title, body, items, accent }: PackageTileData) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
        background: "var(--bg-1)",
        border: "1px solid var(--line)",
        borderLeft: `3px solid ${accent}`,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 180ms ease, border-color 180ms ease",
      }}
    >
      <div style={{ padding: "28px 32px", borderRight: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 32,
              fontWeight: 700,
              color: accent,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {String(idx).padStart(2, "0")}
          </span>
          <ML color={accent} style={{ fontSize: 9 }}>
            {kicker}
          </ML>
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            fontWeight: 600,
            color: "var(--bone)",
            lineHeight: 1.1,
            marginBottom: 10,
          }}
        >
          {title}
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--ash)",
            margin: 0,
          }}
        >
          {body}
        </p>
      </div>
      <div
        style={{
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span
              style={{
                color: accent,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                lineHeight: 1.6,
                flexShrink: 0,
              }}
            >
              ·
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: "var(--bone)",
                letterSpacing: "0.08em",
                lineHeight: 1.6,
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FuruRow — three-column "them / vs / us" comparison row. ──
export function FuruRow({ furu, wolf }: FuruRowData) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 64px 1fr",
        borderTop: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          padding: "24px 28px",
          display: "flex",
          gap: 14,
          background: "rgba(255,45,171,0.04)",
        }}
      >
        <span
          style={{
            color: "var(--pink)",
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          ✕
        </span>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--ash)",
            margin: 0,
          }}
        >
          {furu}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid var(--line)",
          borderRight: "1px solid var(--line)",
        }}
      >
        <ML color="var(--muted)">VS</ML>
      </div>
      <div
        style={{
          padding: "24px 28px",
          display: "flex",
          gap: 14,
          background: "rgba(37,99,235,0.04)",
        }}
      >
        <span
          style={{
            color: "var(--acid)",
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          ✓
        </span>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--bone)",
            margin: 0,
          }}
        >
          {wolf}
        </p>
      </div>
    </div>
  );
}

// ── ResultBanner — split hero for a documented result (kicker + big dollar + image). ──
export function ResultBanner({ kicker, big, sub, period, image, accent = "var(--acid)", flipped }: ResultBannerData) {
  const textBlock = (
    <div style={{ padding: "44px 48px", borderLeft: flipped ? undefined : `2px solid ${accent}`, borderRight: flipped ? `2px solid ${accent}` : undefined }}>
      <ML color={accent} style={{ marginBottom: 20 }}>
        {kicker}
      </ML>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 132,
          fontWeight: 600,
          color: accent,
          lineHeight: 0.9,
          marginBottom: 20,
          textShadow: `0 0 60px ${accent}55`,
        }}
      >
        {big}
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 18,
          lineHeight: 1.6,
          color: "var(--ash)",
          margin: "0 0 16px",
        }}
      >
        {sub}
      </p>
      <ML color="var(--muted)">{period}</ML>
    </div>
  );

  const imageBlock = (
    <div
      style={{ position: "relative", aspectRatio: "5/3", background: "var(--bg-2)" }}
      className="grid-bg"
    >
      <div style={{ position: "absolute", top: 12, left: 12 }}>
        <ML color="var(--muted)">· VERIFIED P&L</ML>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={kicker}
        style={{
          position: "absolute",
          inset: 22,
          width: "calc(100% - 44px)",
          height: "calc(100% - 44px)",
          objectFit: "contain",
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: flipped ? "1.1fr 1fr" : "1fr 1.1fr",
        borderTop: "1px solid var(--line)",
      }}
    >
      {flipped ? (
        <>
          {textBlock}
          {imageBlock}
        </>
      ) : (
        <>
          {imageBlock}
          {textBlock}
        </>
      )}
    </div>
  );
}

// ── TopCallTile — receipt of one of the day's six short trades (Oct 9 2025). ──
export function TopCallTile({
  src,
  ticker,
  amount,
  note,
  accent = "var(--acid)",
}: TopCallTileData) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? accent : "var(--line)"}`,
        background: "var(--bg-1)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 180ms ease, border-color 180ms ease",
      }}
    >
      <div
        style={{ position: "relative", aspectRatio: "4/3", background: "var(--bg-2)" }}
        className="grid-bg"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={ticker}
          style={{
            position: "absolute",
            inset: 12,
            width: "calc(100% - 24px)",
            height: "calc(100% - 24px)",
            objectFit: "contain",
          }}
        />
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          <ML color="var(--muted)">{ticker}</ML>
        </div>
        <div style={{ position: "absolute", bottom: 8, right: 8, background: accent, padding: "4px 8px" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--bg)",
              letterSpacing: "0.12em",
            }}
          >
            {amount}
          </span>
        </div>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: "0.16em",
          }}
        >
          {note}
        </div>
      </div>
    </div>
  );
}

// ── WolfWinTile — community-posted win screenshot with caption. ──
export function WolfWinTile({
  src,
  handle,
  caption,
  dollars,
  platform,
  accent = "var(--acid)",
}: WolfWinTileData) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? accent : "var(--line)"}`,
        background: "var(--bg-1)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 180ms ease, border-color 180ms ease",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={handle}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", top: 8, left: 8 }}>
          <ML color={accent}>· REAL · {platform.toUpperCase()}</ML>
        </div>
        <div style={{ position: "absolute", bottom: 8, right: 8, background: accent, padding: "4px 8px" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--bg)",
              letterSpacing: "0.12em",
            }}
          >
            {dollars}
          </span>
        </div>
      </div>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--bone)",
            }}
          >
            {handle}
          </span>
          <ML color="var(--muted)">{platform}</ML>
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13.5,
            lineHeight: 1.6,
            color: "var(--ash)",
            margin: 0,
          }}
        >
          {caption}
        </p>
      </div>
    </div>
  );
}

// ── TradeRow — full-width documented trade (image | text with callouts). ──
export function TradeRow({
  kicker,
  title,
  body,
  img,
  callouts,
  accent,
  flip,
  ratio = "4/5",
}: TradeRowData): ReactNode {
  const imageBlock = (
    <div
      style={{ position: "relative", aspectRatio: ratio, background: "var(--bg-2)" }}
      className="grid-bg"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt={kicker}
        style={{
          position: "absolute",
          inset: 18,
          width: "calc(100% - 36px)",
          height: "calc(100% - 36px)",
          objectFit: "contain",
        }}
      />
      <div style={{ position: "absolute", top: 12, left: 12 }}>
        <ML color="var(--muted)">· VERIFIED · PHEMEX</ML>
      </div>
    </div>
  );

  const textBlock = (
    <div style={{ padding: "52px 56px" }}>
      <ML color={accent} style={{ marginBottom: 20 }}>
        {kicker}
      </ML>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 56,
          fontWeight: 600,
          color: "var(--bone)",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          marginBottom: 20,
        }}
      >
        {title}
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 17,
          lineHeight: 1.65,
          color: "var(--ash)",
          margin: "0 0 28px",
        }}
      >
        {body}
      </p>
      <div
        style={{
          borderTop: "1px solid var(--line)",
          paddingTop: 24,
          display: "grid",
          gridTemplateColumns: `repeat(${callouts.length}, 1fr)`,
          gap: 20,
        }}
      >
        {callouts.map((c, i) => (
          <div key={i}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                fontWeight: 600,
                color: accent,
                marginBottom: 4,
              }}
            >
              {c.v}
            </div>
            <ML color="var(--muted)">{c.k}</ML>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: flip ? "1.1fr 0.9fr" : "0.9fr 1.1fr",
        borderTop: `2px solid ${accent}`,
      }}
    >
      {flip ? (
        <>
          {textBlock}
          {imageBlock}
        </>
      ) : (
        <>
          {imageBlock}
          {textBlock}
        </>
      )}
    </div>
  );
}
