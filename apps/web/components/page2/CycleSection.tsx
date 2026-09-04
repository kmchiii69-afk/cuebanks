"use client";

import { useState } from "react";
import CycleScrubber, { CYCLE_PHASES } from "./CycleScrubber";
import { Section } from "../shared/H";

export default function CycleSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = CYCLE_PHASES[activeIdx];
  const activeColor = active.v === "long" ? "var(--acid)" : "var(--pink)";
  const sideLabel = active.v === "long" ? "Long" : "Short";

  return (
    <Section py={140} className="border-b border-line">
      <div className="mb-12 max-w-[1180px]">
        <div className="font-mono text-[11px] font-bold text-acid tracking-[0.22em] uppercase mb-3.5">
          · The Krypton 2.0 method ·
        </div>
        <h2 className="font-display font-semibold text-[72px] leading-[0.97] tracking-[-0.04em] text-bone m-0">
          One full cycle.{" "}
          <em className="text-acid not-italic">
            Nine distinct phases.
          </em>
          <br />
          The same playbook every time.
        </h2>
        <p className="font-body text-[19px] leading-[1.55] text-ash mt-6 mb-0 max-w-[920px] font-normal">
          Every cycle moves through the same nine phases. Drag the dot below to walk through them — long bias, short bias, what each one looks like on the chart, and where retail gets washed out.
        </p>
      </div>

      <div className="relative bg-bg-1 border border-line p-11 pb-9 mb-6 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(900px 400px at 50% 50%, rgba(249,255,60,0.06), transparent 60%)",
          }}
        />
        <div className="relative">
          <CycleScrubber activeIdx={activeIdx} setActiveIdx={setActiveIdx} />

          <div className="mt-9 pt-7 border-t border-line grid grid-cols-[auto_1fr_auto] gap-7 items-start">
            <div className="min-w-[200px]">
              <div
                style={{ color: activeColor }}
                className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase mb-3.5"
              >
                · PHASE {active.id} ·
              </div>
              <div className="font-display text-[56px] font-semibold text-bone tracking-[-0.035em] leading-[0.95] mb-3.5">
                {active.name}
              </div>
              <span
                style={{ borderColor: activeColor, color: activeColor }}
                className="inline-block font-mono text-[10px] font-bold tracking-[0.22em] border px-2.5 py-1"
              >
                {sideLabel.toUpperCase()} BIAS
              </span>
            </div>
            <p className="font-body text-[17px] leading-[1.55] text-ash m-0 font-normal max-w-[720px]">
              {active.desc}
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
                disabled={activeIdx === 0}
                aria-label="Previous phase"
                className={`w-11 h-11 bg-bg-2 border border-line-2 text-bone flex items-center justify-center ${
                  activeIdx === 0 ? "cursor-default opacity-40" : "cursor-pointer"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="9,2 3,7 9,12" />
                </svg>
              </button>
              <button
                onClick={() => setActiveIdx(Math.min(CYCLE_PHASES.length - 1, activeIdx + 1))}
                disabled={activeIdx === CYCLE_PHASES.length - 1}
                aria-label="Next phase"
                className={`w-11 h-11 bg-bg-2 border border-line-2 text-bone flex items-center justify-center ${
                  activeIdx === CYCLE_PHASES.length - 1 ? "cursor-default opacity-40" : "cursor-pointer"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="5,2 11,7 5,12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-10 mt-7 pt-6 border-t border-line">
            {[
              { c: "var(--acid)", l: "Long opportunity · 6 phases" },
              { c: "var(--pink)", l: "Short opportunity · 3 phases" },
            ].map((x, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span
                  style={{ background: x.c }}
                  className="w-2.5 h-2.5 inline-block"
                />
                <div className="font-mono text-[10px] font-bold text-ash tracking-[0.22em] uppercase">
                  · {x.l} ·
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="font-display text-[22px] font-medium italic text-ash text-center mt-10 mx-auto mb-0 max-w-[920px] tracking-[-0.01em] leading-[1.4]">
        Cue Banks walks through every phase live inside Wall Street Academy — with real, current examples from the crypto market.
      </p>
    </Section>
  );
}
