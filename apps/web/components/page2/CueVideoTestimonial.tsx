"use client";

import { useRef, useState } from "react";

export type CueTestimonial = {
  src: string;
  poster: string;
  name: string;
  caption: string;
};

export default function CueVideoTestimonial({ src, poster, name, caption }: CueTestimonial) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function play() {
    setPlaying(true);
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
  }

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
      className="bg-bg-1 border border-line rounded-xl overflow-hidden flex flex-col transition-[border-color,transform] duration-200"
    >
      <div className="relative aspect-[9/16] bg-bg-2 overflow-hidden">
        {playing ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            controls
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <button
            onClick={play}
            aria-label={`Play ${name}'s testimonial`}
            className="absolute inset-0 w-full h-full border-0 p-0 cursor-pointer bg-transparent"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt={`${name} — Wall Street Academy member`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.1)] via-transparent to-[rgba(0,0,0,0.55)]" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-acid flex items-center justify-center shadow-[0_0_32px_rgba(249,255,60,0.45)]">
              <svg width="22" height="22" viewBox="0 0 20 20">
                <polygon points="5,3 17,10 5,17" fill="#000" />
              </svg>
            </span>
            <span className="absolute top-2.5 left-2.5 px-2 py-1 bg-[rgba(0,0,0,0.7)] rounded-md font-mono text-[9px] font-bold tracking-[0.18em] text-bone uppercase">
              ▶ Unscripted
            </span>
          </button>
        )}
      </div>
      <div className="py-3.5 px-4 pb-4">
        <div className="font-display text-[16px] font-bold text-bone tracking-[-0.01em]">{name}</div>
        <div className="font-body text-[13px] leading-[1.45] text-ash mt-1">{caption}</div>
      </div>
    </div>
  );
}
