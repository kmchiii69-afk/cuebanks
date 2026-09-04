import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { wsa } from "./theme";

// Maps the WSA palette tokens in `theme.ts` → a Tailwind arbitrary class so
// pages can write `<Eyebrow color={wsa.green2}>` instead of inline-style objects.
// Falls back to empty string for unknown colors so callers can swap a hex in
// without breaking compile.
const COLOR_TEXT: Record<string, string> = {
  [wsa.yellow]: "text-[var(--wsa-yellow,#f9ff3c)]",
  [wsa.white]: "text-white",
  [wsa.black]: "text-black",
  [wsa.muted]: "text-[var(--wsa-muted,#707070)]",
  [wsa.ash]: "text-[var(--wsa-ash,#9aa3b2)]",
  [wsa.blue]: "text-[var(--wsa-blue,#188bf6)]",
  [wsa.red]: "text-[var(--wsa-red,#e93d3d)]",
  [wsa.green]: "text-[var(--wsa-green,#12da00)]",
  [wsa.green2]: "text-[var(--wsa-green-2,#37ca37)]",
};

const BORDER_COLOR: Record<string, string> = {
  [wsa.line]: "border-[var(--wsa-line,#2b333f)]",
  [wsa.panelLine]: "border-[var(--wsa-panel-line,#1a2230)]",
};

const FONT_H2 = "font-[family-name:var(--wsa-font-h2,'Montserrat',sans-serif)]";
const FONT_BODY = "font-[family-name:var(--wsa-font-body,'Open_Sans',sans-serif)]";
const FONT_ACCENT = "font-[family-name:var(--wsa-font-accent,'Times_New_Roman',Times,serif)]";

/* Shared Wall Street Academy primitives for the re-skinned funnel pages.
   Visual system only — pages keep their own backend wiring/handlers. */
export function Eyebrow({
  children,
  color = wsa.yellow,
  className = "",
  style,
}: {
  children: ReactNode;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const colorClass = COLOR_TEXT[color] ?? "";
  return (
    <div
      style={style}
      className={`${FONT_H2} text-[0.72rem] font-extrabold uppercase tracking-[0.22em] ${colorClass} ${className}`}
    >
      {children}
    </div>
  );
}

export function WsaLogo({
  href = "/",
  size = 56,
}: {
  href?: string;
  size?: number;
}) {
  return (
    <Link
      href={href}
      aria-label="Wall Street Academy"
      className="inline-flex flex-shrink-0 items-center no-underline"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={wsa.logo}
        alt="Wall Street Academy"
        style={{ height: size, width: size }}
        className="block rounded-full object-cover"
      />
    </Link>
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
  // Dynamic background + text color come from inline style because the cuebanks
  // Tailwind config doesn't have WSA-yellow as a utility. Static padding,
  // typography, transitions live in the className so they're tree-shaken
  // and visible to Tailwind's analyzer.
  const styleOverride: CSSProperties = {
    ...style,
    background: isSolid ? wsa.yellow : "rgba(0,0,0,0.5)",
    color: isSolid ? "#000" : wsa.white,
    width: full ? "100%" : undefined,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };
  const baseCls = `inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-md border-0 px-[34px] py-4 text-base font-extrabold uppercase tracking-[0.06em] no-underline transition-[transform,box-shadow] duration-200 ${className ?? ""}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        style={styleOverride}
        className={baseCls}
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
      className={baseCls}
    >
      {children}
    </button>
  );
}

/** Full-bleed black page shell with the WSA base styles applied. */
export function WsaShell({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{ minHeight: "100vh", overflowX: "hidden", ...style }}
      className={`bg-black text-white ${FONT_BODY} leading-[1.55]`}
    >
      {children}
    </div>
  );
}

export function WsaWrap({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`mx-auto max-w-[1120px] px-[22px] ${className}`}
    >
      {children}
    </div>
  );
}

const TOPBAR_BORDER = BORDER_COLOR[wsa.line] ?? "border-current";

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
      className={`sticky top-0 z-50 flex items-center justify-between gap-3.5 border-b px-5 py-3 backdrop-blur-md ${TOPBAR_BORDER}`}
      style={{ background: "rgba(0,0,0,.86)" }}
    >
      <WsaLogo href={logoHref} />
      {right ?? (
        ctaHref ? (
          <WsaButton
            href={ctaHref}
            className="!px-[22px] !py-3 !text-[0.82rem]"
          >
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
      className={`${FONT_ACCENT} m-0 border-t-[var(--wsa-line,#2b333f)] px-5 py-[26px] text-center text-[0.8rem] text-[var(--wsa-muted,#707070)]`}
    >
      {children}
    </p>
  );
}
