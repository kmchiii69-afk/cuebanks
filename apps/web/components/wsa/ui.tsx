"use client";

import type { CSSProperties, ReactNode } from "react";
import { wsa } from "./theme";

const VAR_MAP: Record<string, string> = {
  [wsa.yellow]: "text-[var(--cuebanks-wsa-yellow,#f9ff3c)]",
  [wsa.white]: "text-white",
  [wsa.black]: "text-black",
  [wsa.muted]: "text-[#707070]",
  [wsa.ash]: "text-[#9aa3b2]",
  [wsa.blue]: "text-[#188bf6]",
  [wsa.red]: "text-[#e93d3d]",
  [wsa.green]: "text-[#12da00]",
};

const WSA_BORDER_CLASS: Record<string, string> = {
  [wsa.line]: "border-[#2b333f]",
  [wsa.panelLine]: "border-[#1a2230]",
};

/* Shared Wall Street Academy primitives for the re-skinned funnel pages.
   Visual system only — pages keep their own backend wiring/handlers. */
export function Eyebrow({
  children,
  color = wsa.yellow,
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) {
  const colorClass = VAR_MAP[color] ?? "";
  return (
    <div
      style={style}
      className={`font-['Montserrat'] uppercase tracking-[0.22em] text-[0.72rem] font-extrabold ${colorClass}`}
    >
      {children}
    </div>
  );
}

export function WsaLogo({ href = "/", size = 56 }: { href?: string; size?: number }) {
  return (
    <a
      href={href}
      aria-label="Wall Street Academy"
      className="inline-flex items-center no-underline flex-shrink-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={wsa.logo}
        alt="Wall Street Academy"
        style={{ height: size, width: size }}
        className="rounded-full object-cover block"
      />
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

export function WsaButton({
  children,
  variant = "solid",
  href,
  onClick,
  type = "button",
  disabled,
  target,
  rel,
  style,
  className,
  full,
}: BtnProps) {
  const isSolid = variant === "solid";
  const styleOverride: CSSProperties = {
    ...style,
    ...(isSolid
      ? { background: wsa.yellow, color: "#000" }
      : { background: "rgba(0,0,0,0.5)", color: wsa.white }),
    width: full ? "100%" : undefined,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };
  const cls = `inline-flex items-center justify-center gap-2.5 font-extrabold uppercase tracking-[0.06em] text-base px-8.5 py-4 rounded-md no-underline border-0 whitespace-nowrap transition-transform transition-shadow duration-150 duration-200 ${className ?? ""}`;
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        style={styleOverride}
        className={cls}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={styleOverride}
      className={cls}
    >
      {children}
    </button>
  );
}

/** Full-bleed black page shell with the WSA base styles applied. */
export function WsaShell({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: wsa.black,
        color: wsa.white,
        overflowX: "hidden",
        ...style,
      }}
      className="font-['Open_Sans'] leading-[1.55]"
    >
      {children}
    </div>
  );
}

export function WsaWrap({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 22px", ...style }}>
      {children}
    </div>
  );
}

const topBarClass = WSA_BORDER_CLASS[wsa.line] ?? "border-current";

export function TopBar({
  ctaHref,
  ctaLabel = "Apply For Your Seat",
  logoHref = "/",
  right,
}: {
  ctaHref?: string;
  ctaLabel?: string;
  logoHref?: string;
  right?: ReactNode;
}) {
  return (
    <header
      style={{
        background: "rgba(0,0,0,.86)",
        backdropFilter: "blur(8px)",
      }}
      className={`flex items-center justify-between gap-3.5 px-5 py-3 sticky top-0 z-50 border-b ${topBarClass}`}
    >
      <WsaLogo href={logoHref} />
      {right ?? (
        ctaHref ? (
          <WsaButton href={ctaHref} style={{ fontSize: ".82rem", padding: "12px 22px" }}>
            {ctaLabel}
          </WsaButton>
        ) : (
          <span />
        )
      )}
    </header>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: wsa.fontAccent,
        color: wsa.muted,
        borderTopColor: wsa.line,
      }}
      className="font-['Times_New_Roman'] text-[0.8rem] text-center px-5 py-6.5 border-t m-0"
    >
      {children}
    </p>
  );
}
