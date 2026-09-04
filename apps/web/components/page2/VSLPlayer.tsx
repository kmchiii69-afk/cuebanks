"use client";

import { useState } from "react";

const YT_ID = "YUB3sqIWGgs";

export default function VSLPlayer() {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(`https://i.ytimg.com/vi/${YT_ID}/maxresdefault.jpg`);

  return (
    <div
      onMouseEnter={() => !playing && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderColor: playing || hovered ? "var(--acid)" : "var(--line)",
      }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...({ aspectRatio: "16/9" } as any)}
      className="relative bg-bg-2 border overflow-hidden transition-colors duration-200"
    >
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title="Wall Street Academy · Free Training"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Play training video"
          className="absolute inset-0 p-0 bg-transparent border-0 cursor-pointer text-inherit"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt="Cue Banks · Free Training"
            onError={() => setImgSrc(`https://i.ytimg.com/vi/${YT_ID}/hqdefault.jpg`)}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Dim + radial vignette */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(6,7,10,0.25) 0%, rgba(6,7,10,0.65) 100%)",
            }}
          />

          {/* Centered play overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
            <div
              style={{
                boxShadow: hovered
                  ? "0 0 0 1px var(--acid), 0 0 96px rgba(249,255,60,0.55)"
                  : "0 0 0 1px var(--acid), 0 0 64px rgba(249,255,60,0.35)",
                transform: hovered ? "scale(1.04)" : "scale(1)",
              }}
              className="w-30 h-30 bg-acid flex items-center justify-center transition-[transform,box-shadow] duration-200"
            >
              <svg width="40" height="40" viewBox="0 0 40 40">
                <polygon points="12,6 12,34 36,20" fill="var(--bg)" />
              </svg>
            </div>
            <span className="px-3.5 py-2 bg-[rgba(6,7,10,0.78)] border border-line-2 font-mono text-[11px] font-semibold text-bone tracking-[0.22em] uppercase">
              · Click to start the training ·
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
