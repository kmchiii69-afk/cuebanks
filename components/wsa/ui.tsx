"use client";

import type { CSSProperties, ReactNode } from "react";
import { wsa } from "./theme";

/* Shared Wall Street Academy primitives for the re-skinned funnel pages.
   Visual system only — pages keep their own backend wiring/handlers. */

export function Eyebrow({ children, color = wsa.yellow, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return (
    <div style={{ fontFamily: wsa.fontH2, textTransform: "uppercase", letterSpacing: "0.22em", fontSize: ".72rem", fontWeight: 800, color, ...style }}>
      {children}
    </div>
  );
}

export function WsaLogo({ href = "/", size = 56 }: { href?: string; size?: number }) {
  return (
    <a href={href} aria-label="Wall Street Academy" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={wsa.logo} alt="Wall Street Academy" style={{ height: size, width: size, borderRadius: "50%", objectFit: "cover", display: "block" }} />
    </a>
  );
}

type BtnProps = {
  children: ReactNode;
  variant?: "solid" | "ghost";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  target?: string;
  rel?: string;
  style?: CSSProperties;
  className?: string;
  full?: boolean;
};

export function Button({ children, variant = "solid", href, onClick, type = "button", disabled, target, rel, style, className, full }: BtnProps) {
  const base: CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
    fontFamily: wsa.fontH2, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em",
    fontSize: "1rem", padding: "16px 34px", borderRadius: 6, textDecoration: "none",
    border: "none", cursor: disabled ? "default" : "pointer", whiteSpace: "nowrap",
    transition: "transform .15s ease, box-shadow .2s ease", opacity: disabled ? 0.6 : 1,
    width: full ? "100%" : undefined,
    ...(variant === "solid"
      ? { background: wsa.yellow, color: "#000" }
      : { background: "rgba(0,0,0,0.5)", color: wsa.white, border: `1px solid rgba(255,255,255,.35)` }),
    ...style,
  };
  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className={className} style={base}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className} style={base}>
      {children}
    </button>
  );
}

/** Full-bleed black page shell with the WSA base styles applied. */
export function WsaShell({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ minHeight: "100vh", background: wsa.black, color: wsa.white, fontFamily: wsa.fontBody, lineHeight: 1.55, overflowX: "hidden", ...style }}>
      {children}
    </div>
  );
}

export function Wrap({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 22px", ...style }}>{children}</div>;
}

export function TopBar({ ctaHref, ctaLabel = "Apply For Your Seat", logoHref = "/", right }: { ctaHref?: string; ctaLabel?: string; logoHref?: string; right?: ReactNode }) {
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "12px 22px", borderBottom: `1px solid ${wsa.line}`, position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,.86)", backdropFilter: "blur(8px)" }}>
      <WsaLogo href={logoHref} />
      {right ?? (ctaHref ? <Button href={ctaHref} style={{ fontSize: ".82rem", padding: "12px 22px" }}>{ctaLabel}</Button> : <span />)}
    </header>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontFamily: wsa.fontAccent, fontSize: ".8rem", color: wsa.muted, textAlign: "center", padding: "26px 22px", borderTop: `1px solid ${wsa.line}`, margin: 0 }}>
      {children}
    </p>
  );
}
