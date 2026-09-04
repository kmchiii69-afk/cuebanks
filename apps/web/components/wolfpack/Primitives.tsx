"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────
// Primitives shared across the Wolfpack and Wolfpack-Global pages.
// Self-contained — no state, no fetching — so they render identically
// under either the static or client page wrapper.
// ─────────────────────────────────────────────────────────────────

export function Wrap({
  children,
  max = 1320,
  style,
}: {
  children: ReactNode;
  max?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ maxWidth: max, margin: "0 auto", padding: "0 48px", ...style }}>
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  py = 120,
  style,
}: {
  id?: string;
  children: ReactNode;
  py?: number;
  style?: CSSProperties;
}) {
  return (
    <section id={id} style={{ padding: `${py}px 0`, ...style }}>
      <Wrap>{children}</Wrap>
    </section>
  );
}

/** Section heading: kicker label + large h2 + optional sub. Matches the
 *  tailwind classes on the wolfpack page and the inline-style behavior on
 *  wolfpack-global; both render identically because we hand-roll the
 *  spacing via Tailwind arbitrary values. */
export function H({
  num,
  label,
  title,
  sub,
}: {
  num: string;
  label: string;
  title: ReactNode;
  sub?: string;
}) {
  return (
    <div className="mb-[60px]">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <span className="border border-[var(--acid)] px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.22em] text-[var(--acid)]">
          § {num}
        </span>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--acid)]">
          {label}
        </span>
      </div>
      <h2 className="m-0 mb-6 max-w-[1100px] font-display text-[76px] font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--bone)]">
        {title}
      </h2>
      {sub ? (
        <p className="m-0 max-w-[820px] font-body text-[19px] font-normal leading-[1.6] text-[var(--ash)]">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

/** Mono-eyebrow — uppercase, letter-spaced, used for kickers and badges.
 *  Inline `style` lets callers add positioning (`margin-bottom`, etc.) without
 *  wrapping every call site in a fragment. */
export function ML({
  children,
  color = "var(--acid)",
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 700,
        color,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Stylized wolf-pack mark used as the brand glyph and decorative watermark. */
export function WolfMark({
  size = 28,
  color = "var(--acid)",
  style,
}: {
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "inline-block", flexShrink: 0, verticalAlign: "middle", ...style }}
      aria-hidden="true"
    >
      <path d="M 30 38 L 36 28 L 40 36 L 50 32 L 60 36 L 64 28 L 70 38 L 70 60 L 60 70 L 40 70 L 30 60 Z" fill={color} />
      <circle cx="44" cy="50" r="2.5" fill="var(--bg)" />
      <circle cx="56" cy="50" r="2.5" fill="var(--bg)" />
    </svg>
  );
}

/** Wolfpack brand logo — wolf mark + wordmark, linking home. */
export function WolfLogo({ size = 26 }: { size?: number }) {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }} className="no-underline">
      <WolfMark size={size} color="var(--acid)" />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 17,
          fontWeight: 600,
          color: "var(--bone)",
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
        }}
      >
        The Wolfpack <span style={{ color: "var(--ash)", fontWeight: 400 }}>· WSA</span>
      </span>
    </Link>
  );
}

export function StarRow({
  count = 5,
  color = "var(--acid)",
  size = 12,
}: {
  count?: number;
  color?: string;
  size?: number;
}) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 14 14" style={{ display: "block" }}>
          <polygon points="7,1 8.85,5.1 13.3,5.5 9.9,8.4 11,12.8 7,10.4 3,12.8 4.1,8.4 0.7,5.5 5.15,5.1" fill={color} />
        </svg>
      ))}
    </div>
  );
}
