"use client";

const ACCENT_CLASS: Record<string, string> = {
  "var(--acid)": "border-acid text-acid",
  "var(--pink)": "border-pink text-pink",
};

export default function ProofTile({
  src,
  handle,
  caption,
  dollars,
  platform,
  accent = "var(--acid)",
}: {
  src: string;
  handle: string;
  caption?: string;
  dollars?: string;
  platform?: string;
  accent?: string;
}) {
  function openLightbox(e: React.MouseEvent) {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent("qc:lightbox", { detail: { src: `/${src}`, alt: handle } })
    );
  }

  const accentClass = ACCENT_CLASS[accent] ?? "border-muted text-muted";

  return (
    <div
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--acid)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      className="bg-bg-1 border border-line overflow-hidden transition-transform transition-[border-color] duration-200"
    >
      <div
        onClick={openLightbox}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ aspectRatio: "16/10" } as any)}
        className="relative bg-bg-2 overflow-hidden cursor-zoom-in"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/${src}`}
          alt={handle}
          className="absolute inset-0 w-full h-full object-cover object-left-top"
        />
        <div
          style={{ borderColor: accent, color: accent }}
          className={`absolute top-2.5 left-2.5 px-2 py-1 bg-[rgba(6,7,10,0.85)] border font-mono text-[9px] font-bold tracking-[0.22em] whitespace-nowrap ${accentClass}`}
        >
          · REAL · WHOP
        </div>
        {dollars && (
          <div
            style={{ background: accent, color: "var(--bg)" }}
            className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 font-display text-[22px] font-bold tracking-[-0.02em] whitespace-nowrap"
          >
            {dollars}
          </div>
        )}
        <div className="absolute top-2.5 right-2.5 px-2 py-1 bg-[rgba(6,7,10,0.85)] border border-line-2 font-mono text-[9px] font-bold text-bone tracking-[0.20em] whitespace-nowrap flex items-center gap-1.5">
          <svg width="9" height="9" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="6" cy="6" r="4.5" />
            <line x1="9.5" y1="9.5" x2="13" y2="13" />
            <line x1="4" y1="6" x2="8" y2="6" />
            <line x1="6" y1="4" x2="6" y2="8" />
          </svg>
          ENLARGE
        </div>
      </div>

      <div className="py-4.5 px-5.5 pb-5.5 flex flex-col gap-2">
        <div className="flex justify-between items-baseline">
          <span className="font-display text-[18px] font-semibold text-bone tracking-[-0.015em]">
            {handle}
          </span>
          {platform && (
            <span className="font-mono text-[9px] font-semibold text-ash tracking-[0.22em] uppercase whitespace-nowrap">
              {platform}
            </span>
          )}
        </div>
        {caption && (
          <div className="font-body text-[13px] leading-[1.55] text-ash font-normal">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
