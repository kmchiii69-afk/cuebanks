"use client";

import { useState } from "react";

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.75">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 14 14"
          className="block"
        >
          <polygon
            points="7,1 8.85,5.1 13.3,5.5 9.9,8.4 11,12.8 7,10.4 3,12.8 4.1,8.4 0.7,5.5 5.15,5.1"
            fill="var(--acid)"
          />
        </svg>
      ))}
    </div>
  );
}

const PALETTE_CLASS: Record<string, string> = {
  "var(--acid)": "border-acid text-acid",
  "var(--pink)": "border-pink text-pink",
  "#6FE9FF": "border-[#6FE9FF] text-[#6FE9FF]",
};

export default function ReviewCard({
  name,
  quote,
  date,
  verified = true,
}: {
  name: string;
  quote: string;
  date: string;
  verified?: boolean;
}) {
  const palette = ["var(--acid)", "var(--pink)", "#6FE9FF"];
  const accent = palette[name.charCodeAt(0) % 3];
  const accentClass = PALETTE_CLASS[accent] ?? "border-muted text-muted";
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--acid)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      className="bg-bg-1 border border-line p-5.5 mb-3.5 break-inside-avoid flex flex-col gap-3.5 transition-[border-color,transform] duration-200"
    >
      <div className="flex justify-between items-center">
        <StarRow count={5} />
        {verified && (
          <span className="font-mono text-[8px] font-bold text-acid tracking-[0.22em] border border-acid px-1.5 py-0.75 whitespace-nowrap">
            VERIFIED · WHOP
          </span>
        )}
      </div>
      <p className="font-body text-[14px] leading-[1.6] text-bone m-0 font-normal">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="pt-3.5 border-t border-line flex items-center gap-3">
        <div
          className={`w-8 h-8 bg-bg-2 border ${accentClass} flex items-center justify-center font-display text-[12px] font-bold flex-shrink-0`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-[15px] font-semibold text-bone tracking-[-0.015em] leading-[1.2] whitespace-nowrap overflow-hidden text-ellipsis">
            {name}
          </div>
          <div className="font-mono text-[9px] text-ash tracking-[0.18em] uppercase mt-0.5">
            {date}
          </div>
        </div>
      </div>
    </div>
  );
}
