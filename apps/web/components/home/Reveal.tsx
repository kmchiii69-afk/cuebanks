"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Scroll-in reveal — replaces the FunnelRenderer's IntersectionObserver + `.reveal` class.
 *  Uses an `IntersectionObserver` per element so we don't ship the old `.reveal` + `.in`
 *  CSS hook anymore. Defaults match the funnel's previous behaviour (12% threshold, once). */
export default function Reveal({
  children,
  className = "",
  delayMs = 0,
  once = true,
  startVisible = false,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  once?: boolean;
  startVisible?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(startVisible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform,filter] duration-500 ease-out ${
        inView ? "translate-y-0 opacity-100 blur-0" : "translate-y-4 opacity-0 blur-[6px]"
      } ${className}`}
      style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
