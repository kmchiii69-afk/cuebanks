"use client";

import { useState } from "react";

export default function VideoTestimonialCard({
  videoId,
  headline,
  body,
}: {
  videoId: string;
  headline: string;
  body: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embed = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

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
      className="bg-bg-1 border border-line flex flex-col transition-[border-color,transform] duration-200"
    >
      <div
        onClick={() => !loaded && setLoaded(true)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ aspectRatio: "9/16" } as any)}
        className={`relative bg-bg-2 overflow-hidden border-b border-line ${
          loaded ? "cursor-default" : "cursor-pointer"
        }`}
      >
        {!loaded ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt={headline}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,7,10,0.25) 0%, rgba(6,7,10,0.05) 40%, rgba(6,7,10,0.85) 100%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-acid flex items-center justify-center shadow-[0_0_40px_rgba(249,255,60,0.45),0_0_100px_rgba(249,255,60,0.18)]">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <polygon points="7,4 7,20 21,12" fill="var(--bg)" />
                </svg>
              </div>
            </div>
            <div className="absolute top-2.5 left-2.5 px-1.75 py-0.75 bg-[rgba(6,7,10,0.85)] border border-acid font-mono text-[8px] font-bold text-acid tracking-[0.22em] whitespace-nowrap">
              · LIVE · TESTIMONIAL
            </div>
            <div className="absolute bottom-2.5 right-2.5 px-1.75 py-0.75 bg-[rgba(6,7,10,0.85)] border border-line-2 font-mono text-[8px] font-bold text-bone tracking-[0.22em] whitespace-nowrap">
              YT SHORT
            </div>
          </>
        ) : (
          <iframe
            src={embed}
            title={headline}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 w-full h-full border-0"
          />
        )}
      </div>
      <div className="py-4.5 px-5 pb-5.5 flex flex-col gap-2 flex-1">
        <div className="font-display text-[17px] font-semibold text-bone tracking-[-0.02em] leading-[1.2]">
          {headline}
        </div>
        <p className="font-body text-[12.5px] leading-[1.55] text-ash m-0 font-normal">
          {body}
        </p>
      </div>
    </div>
  );
}
