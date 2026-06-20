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
    // play after the element mounts
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
  }

  return (
    <div
      style={{
        background: "var(--bg-1)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 200ms ease, transform 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--acid)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ position: "relative", aspectRatio: "9/16", background: "var(--bg-2)", overflow: "hidden" }}>
        {playing ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            controls
            playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <button
            onClick={play}
            aria-label={`Play ${name}'s testimonial`}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, padding: 0, cursor: "pointer", background: "transparent" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster} alt={`${name} — Wall Street Academy member`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.55) 100%)" }} />
            <span
              style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                width: 64, height: 64, borderRadius: "50%", background: "var(--acid)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 32px rgba(249,255,60,0.45)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 20 20"><polygon points="5,3 17,10 5,17" fill="#000" /></svg>
            </span>
            <span style={{ position: "absolute", top: 10, left: 10, padding: "4px 9px", background: "rgba(0,0,0,0.7)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "var(--bone)", textTransform: "uppercase" }}>
              ▶ Unscripted
            </span>
          </button>
        )}
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--bone)", letterSpacing: "-0.01em" }}>{name}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, lineHeight: 1.45, color: "var(--ash)", marginTop: 4 }}>{caption}</div>
      </div>
    </div>
  );
}
