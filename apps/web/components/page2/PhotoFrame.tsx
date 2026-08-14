"use client";

import { useState } from "react";

export default function PhotoFrame({
  src,
  alt,
  ratio = "4/3",
  style,
  objectPosition = "center",
  zoomable = true,
}: {
  src: string;
  alt: string;
  ratio?: string;
  style?: React.CSSProperties;
  objectPosition?: string;
  zoomable?: boolean;
}) {
  const [hover, setHover] = useState(false);

  function openLightbox() {
    if (!zoomable) return;
    window.dispatchEvent(
      new CustomEvent("qc:lightbox", { detail: { src: `/${src}`, alt } }),
    );
  }

  return (
    <div
      onClick={openLightbox}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={style}
      className={`relative bg-bg-2 border border-line overflow-hidden ${
        zoomable ? "cursor-zoom-in" : "cursor-default"
      }`}
      // Inline aspectRatio because Tailwind v4 doesn't yet parse arbitrary aspect ratios easily.
      // We keep this as a style prop so callers can override via the `ratio` arg.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ aspectRatio: ratio } as any)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/${src}`}
        alt={alt}
        style={{ objectPosition }}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out ${
          hover && zoomable ? "scale-[1.015]" : "scale-100"
        }`}
      />
      {zoomable && (
        <div
          style={{
            opacity: hover ? 1 : 0.65,
            borderColor: hover ? "var(--acid)" : "var(--line-2)",
          }}
          className="absolute bottom-3 right-3 flex items-center gap-2 p-2 px-3 bg-[rgba(6,7,10,0.82)] backdrop-blur-[6px] transition-opacity duration-200 pointer-events-none"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 14 14"
            fill="none"
            stroke={hover ? "var(--acid)" : "var(--bone)"}
            strokeWidth="1.6"
          >
            <circle cx="6" cy="6" r="4.5" />
            <line x1="9.5" y1="9.5" x2="13" y2="13" />
            <line x1="4" y1="6" x2="8" y2="6" />
            <line x1="6" y1="4" x2="6" y2="8" />
          </svg>
          <span
            style={{ color: hover ? "var(--acid)" : "var(--bone)" }}
            className="font-mono text-[9px] font-bold tracking-[0.20em] uppercase transition-colors duration-200"
          >
            · Click to enlarge
          </span>
        </div>
      )}
    </div>
  );
}
