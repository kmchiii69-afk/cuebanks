"use client";

import { useEffect, useState } from "react";

interface LightboxState {
  src: string;
  alt: string;
}

export default function Lightbox() {
  const [state, setState] = useState<LightboxState | null>(null);

  useEffect(() => {
    function onOpen(e: Event) {
      setState((e as CustomEvent<LightboxState>).detail);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setState(null);
    }
    window.addEventListener("qc:lightbox", onOpen as EventListener);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("qc:lightbox", onOpen as EventListener);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = state ? "hidden" : "";
  }, [state]);

  if (!state) return null;

  return (
    <div
      onClick={() => setState(null)}
      className="fixed inset-0 z-[200] bg-[rgba(6,7,10,0.92)] backdrop-blur-[10px] flex items-center justify-center p-12 cursor-zoom-out"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setState(null);
        }}
        aria-label="Close"
        className="absolute top-6 right-6 z-[2] w-11 h-11 bg-bg-1 border border-line-2 text-bone font-mono text-base cursor-pointer flex items-center justify-center"
      >
        ✕
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] font-semibold text-ash tracking-[0.22em] uppercase bg-bg-1 px-4.5 py-2.5 border border-line whitespace-nowrap">
        · Click anywhere or press Esc to close ·
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={state.src}
        alt={state.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain border border-line-2 shadow-[0_30px_90px_rgba(0,0,0,0.6)] cursor-default"
        style={{ animation: "lbIn 240ms cubic-bezier(0.2,0.8,0.2,1)" }}
      />
    </div>
  );
}
