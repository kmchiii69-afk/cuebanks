"use client";

import { Eyebrow, WsaButton } from "@/components/wsa/ui";

/* BrokerCard — used twice on the broker offers page (Hydra / BloFin).
   Pass a CSS `accent` color and the card adapts all its borders/buttons/
   chips to that brand without needing a separate palette per card.

   Implementation note: we set the accent via inline `style={{ "--accent": "..." }}`
   so the children can read it as `var(--accent)` and Tailwind arbitrary
   classes like `border-[var(--accent)]` resolve correctly. That's why
   the dynamic color must travel through CSS custom property rather than
   a tailwind class. */

type BrokerCardProps = {
  accent: string;
  eyebrow: string;
  title: string;
  accentWord: string;
  desc: string;
  logo: { src: string; alt: string; height: number; tag: string };
  features: string[];
  chip: { label: string; line: string; box: string };
  cta: { label: string; href: string; broker: string; footnote: string };
  onCtaClick?: () => void;
};

export default function BrokerCard({
  accent,
  eyebrow,
  title,
  accentWord,
  desc,
  logo,
  features,
  chip,
  cta,
  onCtaClick,
}: BrokerCardProps) {
  return (
    <div
      style={
        {
          background: "var(--wsa-panel, #0c1018)",
          borderTopColor: accent,
          "--accent": accent,
        } as React.CSSProperties
      }
      className="relative flex flex-col overflow-hidden rounded-[14px] border border-[var(--wsa-line,#2b333f)] border-t-[3px] px-8 py-[34px]"
    >
      {/* Soft accent wash at the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(560px 280px at 50% 0%, ${accent}14, transparent 62%)`,
        }}
      />

      <div className="relative flex h-full flex-col">
        <Eyebrow color={accent} className="mb-[18px]">
          {eyebrow}
        </Eyebrow>
        <h2
          style={{
            fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
            color: "var(--wsa-white,#ffffff)",
          }}
          className="mb-[14px] text-[34px] font-extrabold leading-[1.05] tracking-[-0.01em]"
        >
          {title} <span style={{ color: accent }}>{accentWord}</span>
        </h2>
        <p
          style={{
            fontFamily: "var(--wsa-font-body,'Open Sans',sans-serif)",
            color: "var(--wsa-ash,#9aa3b2)",
          }}
          className="mb-6 text-[15.5px] leading-[1.55]"
        >
          {desc}
        </p>

        <div className="mb-[22px] flex items-center gap-[14px] rounded-[10px] border border-[var(--wsa-line,#2b333f)] bg-[rgba(255,255,255,0.02)] px-[18px] py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={logo.alt}
            style={{ height: logo.height, width: "auto" }}
            className="block"
          />
          <span
            style={{
              fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
              color: "var(--wsa-muted,#707070)",
            }}
            className="text-[9px] font-extrabold uppercase tracking-[0.26em]"
          >
            {logo.tag}
          </span>
        </div>

        <div className="mb-[22px] flex flex-col gap-3">
          {features.map((f, i) => (
            <Feat key={i} accent={accent}>
              {f}
            </Feat>
          ))}
        </div>

        <div
          className="mb-[22px] flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-dashed px-[18px] py-[15px]"
          style={{
            background: `${accent}0d`,
            borderColor: accent,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
                color: "var(--wsa-muted,#707070)",
              }}
              className="mb-1.5 text-[9px] font-extrabold uppercase tracking-[0.2em]"
            >
              {chip.label}
            </div>
            <div
              style={{
                fontFamily: "var(--wsa-font-body,'Open Sans',sans-serif)",
                color: "var(--wsa-white,#ffffff)",
              }}
              className="text-[13px] font-semibold"
            >
              {chip.line}
            </div>
          </div>
          <div
            style={{
              fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
              borderColor: accent,
              color: accent,
              background: "rgba(0,0,0,0.4)",
            }}
            className="whitespace-nowrap rounded-lg border px-[14px] py-2 text-[18px] font-extrabold tracking-[0.04em]"
          >
            {chip.box}
          </div>
        </div>

        <div className="mt-auto">
          <WsaButton
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            full
            onClick={onCtaClick}
            style={{
              background: accent,
              color: "#0b1400",
              boxShadow: `0 10px 34px ${accent}3d`,
            }}
          >
            {cta.label}
          </WsaButton>
          <div
            style={{
              fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
              color: "var(--wsa-muted,#707070)",
            }}
            className="mt-3 text-center text-[9px] font-bold uppercase tracking-[0.18em]"
          >
            {cta.footnote}
          </div>
        </div>
      </div>
    </div>
  );
}

function Feat({
  accent,
  children,
}: {
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        style={{
          fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
          color: accent,
          minWidth: 14,
        }}
        className="text-base font-extrabold leading-[1.3]"
      >
        +
      </span>
      <span
        style={{
          fontFamily: "var(--wsa-font-body,'Open Sans',sans-serif)",
          color: "#dfe4ec",
        }}
        className="text-[15px] leading-[1.45]"
      >
        {children}
      </span>
    </div>
  );
}
