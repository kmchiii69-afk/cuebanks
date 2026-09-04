"use client";

import { useEffect, useState } from "react";
import { Section } from "../shared/H";

const RR_SLIDES = [
  { src: "uploads/proof/rr-07.jpg", date: "Jul 11, 2025", amount: "+$1.59M", note: "One month into studying with Cue Banks" },
  { src: "uploads/proof/rr-05.jpg", date: "Aug 03, 2025", amount: "+$201K",  note: "UNI short · single trade" },
  { src: "uploads/proof/rr-06.jpg", date: "Aug 03, 2025", amount: "Mindset", note: "\"Losing money in the markets is a choice.\"" },
  { src: "uploads/proof/rr-04.jpg", date: "Aug 09, 2025", amount: "+$61K",   note: "INJ long · 4-day swing" },
  { src: "uploads/proof/rr-03.jpg", date: "Aug 17, 2025", amount: "+$1.8M",  note: "Mid-May → August total" },
  { src: "uploads/proof/rr-02.jpg", date: "Oct 14, 2025", amount: "+$2.92M", note: "$50K start · one month in" },
  { src: "uploads/proof/rr-01.jpg", date: "Oct 15, 2025", amount: "+$3.16M", note: "All-time P&L" },
];

export default function RickRossSpotlight() {
  const [i, setI] = useState(RR_SLIDES.length - 1);
  const slide = RR_SLIDES[i];

  function go(delta: number) {
    setI((prev) => (prev + delta + RR_SLIDES.length) % RR_SLIDES.length);
  }

  function openLightbox() {
    window.dispatchEvent(
      new CustomEvent("qc:lightbox", { detail: { src: `/${slide.src}`, alt: `Rick Ross ${slide.date}` } })
    );
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function onPrevEnter(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.borderColor = "var(--acid)";
    e.currentTarget.style.color = "var(--acid)";
  }
  function onPrevLeave(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.borderColor = "var(--line-2)";
    e.currentTarget.style.color = "var(--bone)";
  }

  return (
    <Section py={120} className="border-b border-line">
      <div className="mb-10">
        <div className="font-mono text-[11px] font-bold text-acid tracking-[0.22em] uppercase mb-3.5">
          · Student spotlight · 7 receipts ·
        </div>
        <h2 className="font-display font-semibold text-[72px] leading-[0.98] tracking-[-0.04em] text-bone m-0 max-w-[1100px]">
          One student. $50K start.{" "}
          <em className="text-acid not-italic">$3.16M out.</em>
        </h2>
      </div>

      <div className="bg-bg-1 border border-line grid grid-cols-1 md:grid-cols-2 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute top-0 right-0 w-[700px] h-full pointer-events-none"
          style={{
            background: "radial-gradient(circle at 80% 50%, rgba(249,255,60,0.12), transparent 60%)",
          }}
        />

        {/* CAROUSEL */}
        <div className="p-7 border-r border-line relative">
          <div
            onClick={openLightbox}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...({ aspectRatio: "16/10" } as any)}
            className="relative bg-bg-2 border border-line overflow-hidden cursor-zoom-in"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={i}
              src={`/${slide.src}`}
              alt={`Rick Ross · ${slide.date}`}
              style={{ animation: "rrFade 360ms ease" }}
              className="absolute inset-0 w-full h-full object-cover object-left-top"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1.5 bg-[rgba(6,7,10,0.88)] border border-acid">
              <span className="font-mono text-[9px] font-bold text-acid tracking-[0.22em] uppercase">
                · {slide.date}
              </span>
            </div>
            <div className="absolute top-3 right-3 px-2.5 py-1.5 bg-[rgba(6,7,10,0.88)] border border-line-2 flex items-center gap-1.5 pointer-events-none">
              <svg width="9" height="9" viewBox="0 0 14 14" fill="none" stroke="var(--bone)" strokeWidth="1.6">
                <circle cx="6" cy="6" r="4.5" />
                <line x1="9.5" y1="9.5" x2="13" y2="13" />
                <line x1="4" y1="6" x2="8" y2="6" />
                <line x1="6" y1="4" x2="6" y2="8" />
              </svg>
              <span className="font-mono text-[9px] font-bold text-bone tracking-[0.20em]">ENLARGE</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline mt-4 pb-3.5 border-b border-line">
            <div>
              <div className="font-display text-[22px] font-bold text-acid tracking-[-0.025em] leading-none">
                {slide.amount}
              </div>
              <div className="font-mono text-[9px] font-bold text-ash tracking-[0.22em] uppercase mt-2">
                · {slide.note} ·
              </div>
            </div>
            <span className="font-mono text-[11px] font-bold text-bone tracking-[0.22em]">
              {String(i + 1).padStart(2, "0")} / {String(RR_SLIDES.length).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3.5">
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              onMouseEnter={onPrevEnter}
              onMouseLeave={onPrevLeave}
              className="w-11 h-11 bg-bg-2 border border-line-2 text-bone cursor-pointer flex items-center justify-center transition-all duration-150"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="9,2 3,7 9,12" />
              </svg>
            </button>

            <div className="flex gap-2 flex-1 justify-center">
              {RR_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className="border-0 p-0 cursor-pointer transition-all duration-200"
                  style={{
                    width: idx === i ? 28 : 8,
                    height: 8,
                    background: idx === i ? "var(--acid)" : "var(--line-2)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              aria-label="Next"
              onMouseEnter={onPrevEnter}
              onMouseLeave={onPrevLeave}
              className="w-11 h-11 bg-bg-2 border border-line-2 text-bone cursor-pointer flex items-center justify-center transition-all duration-150"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="5,2 11,7 5,12" />
              </svg>
            </button>
          </div>

          <div className="font-mono text-[9px] font-bold text-ash tracking-[0.22em] uppercase mt-3.5 text-center">
            · Use ← → arrows · click to enlarge ·
          </div>
        </div>

        {/* QUOTE */}
        <div className="py-13 px-14 flex flex-col justify-center relative">
          <div className="flex items-center gap-3 mb-4.5">
            <div className="font-mono text-[11px] font-bold text-acid tracking-[0.22em] uppercase">
              · @rick_ross · Bybit · Verified ·
            </div>
            <span className="font-mono text-[9px] font-bold text-acid tracking-[0.22em] border border-acid px-1.75 py-0.75">
              VERIFIED
            </span>
          </div>
          <div
            className="font-display text-[104px] font-bold text-acid tracking-[-0.05em] leading-[0.88] mb-3.5"
            style={{ textShadow: "0 0 48px rgba(249,255,60,0.4)" }}
          >
            $3.16M
          </div>
          <div className="font-mono text-[11px] font-bold text-ash tracking-[0.22em] uppercase mb-7">
            · Profit · Started with $50K · All-time P&amp;L ·
          </div>
          <p className="font-display text-[24px] font-medium italic text-bone leading-[1.35] m-0 tracking-[-0.01em]">
            &ldquo;$3,160,296.84 profit from $50K. This isn&rsquo;t just a number — it&rsquo;s the result of discipline, execution, and following the Wall Street Academy strategy to the letter. Every setup, every trade, every lesson — it all added up. All hail @cameron.fous. Let the results speak for themselves.&rdquo;
          </p>
        </div>
      </div>
    </Section>
  );
}
