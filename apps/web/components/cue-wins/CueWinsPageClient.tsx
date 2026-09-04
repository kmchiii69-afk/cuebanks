"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Reveal from "@/components/home/Reveal";
import { HomeEyebrow, HomeWrap } from "@/components/home/HomeSection";

const IMAGES = [
  "/wsa/cue-wins/2.jpg",
  "/wsa/cue-wins/3.jpg",
  "/wsa/cue-wins/4.jpg",
  "/wsa/cue-wins/5.jpg",
  "/wsa/cue-wins/6.jpg",
  "/wsa/cue-wins/7.jpg",
  "/wsa/cue-wins/8.jpg",
  "/wsa/cue-wins/9.jpg",
  "/wsa/cue-wins/10.jpg",
];

const METRICS = [
  { n: "$500K", l: "Documented in 5 days" },
  { n: "10+", l: "Years trading live" },
  { n: "2019", l: "Posting profits publicly since" },
  { n: "10,000+", l: "Traders mentored" },
];

export default function CueWinsPageClient() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  const close = useCallback(() => setLightbox(null), []);

  // Esc closes the lightbox; also locks body scroll while open so the page
  // underneath can't be scrolled behind the modal.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close]);

  return (
    <main className="bg-[var(--bg)] text-[var(--bone)]">
      <section className="border-b border-[var(--line)] bg-[radial-gradient(800px_420px_at_70%_-10%,rgba(var(--acid-rgb),0.16),transparent_60%),var(--bg)] py-16 sm:py-20">
        <HomeWrap>
          <Reveal>
            <HomeEyebrow>Documented Live · Receipts Don&apos;t Lie</HomeEyebrow>
            <h1 className="mb-4 max-w-[16ch] text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              Cue&apos;s <span className="text-[var(--acid)]">Wins.</span>
            </h1>
            <p className="mb-8 max-w-[52ch] text-lg text-[var(--ash)]">
              Publicly posted profits, executed live — not from selling courses, from clicking
              buttons on the chart. Every entry, every exit, in real time.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#gallery" className="btn">
                See The Receipts <span aria-hidden>→</span>
              </a>
              <Link href="/" className="btn btn-ghost">
                Back To Home
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.l}>
                <div className="text-[clamp(1.6rem,3vw,2.2rem)] font-black text-[var(--acid)]">
                  {m.n}
                </div>
                <div className="mt-1 font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </HomeWrap>
      </section>

      <section id="gallery" className="py-[74px]">
        <HomeWrap>
          <Reveal>
            <HomeEyebrow>The Receipts</HomeEyebrow>
            <h2 className="mb-3 text-[clamp(1.7rem,3.6vw,2.7rem)] font-bold tracking-[-0.03em]">
              Real trades. Real money. <span className="text-[var(--acid)]">Real time.</span>
            </h2>
            <p className="mb-10 max-w-[52ch] text-[var(--ash)]">
              A scroll through trades posted live to the Inner Circle. Tap any screenshot to view it
              full size.
            </p>
          </Reveal>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {IMAGES.map((src, i) => (
              <Reveal key={src} delayMs={i * 40} className="mb-4 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setLightbox(src)}
                  className="block w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-1)] text-left transition hover:border-[var(--acid)]"
                >
                  <Image
                    src={src}
                    alt={`Cue live trade receipt ${i + 1}`}
                    width={640}
                    height={800}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </HomeWrap>
      </section>

      <section
        id="apply"
        className="border-t border-[var(--line)] bg-[radial-gradient(700px_360px_at_50%_0%,rgba(var(--acid-rgb),0.16),transparent_60%),var(--bg)] py-[84px] text-center"
      >
        <HomeWrap>
          <Reveal>
            <HomeEyebrow>Your Turn</HomeEyebrow>
            <h2 className="mx-auto mb-4 max-w-[18ch] text-[clamp(2rem,5vw,3.2rem)] font-bold tracking-[-0.03em]">
              Stop watching wins. Start <span className="text-[var(--acid)]">posting them.</span>
            </h2>
            <p className="mx-auto mb-7 max-w-[48ch] text-[var(--ash)]">
              The same system behind every one of these trades is what we teach inside the WSA Inner
              Circle. Apply and start trading with structure.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="/book" className="btn">
                Apply For Your Seat <span aria-hidden>→</span>
              </a>
              <Link href="/" className="btn btn-ghost">
                Back To Home
              </Link>
            </div>
            <div className="mt-[22px] inline-block rounded-lg border border-dashed border-[var(--acid)] px-5 py-2.5 font-mono text-sm font-extrabold tracking-[0.06em] text-[var(--acid)]">
              GET 20% OFF YOUR FIRST MONTH — CODE: CUEWEBBY20
            </div>
          </Reveal>
        </HomeWrap>
      </section>

      <p className="border-t border-[var(--line)] px-[22px] py-[26px] text-center font-serif text-[0.8rem] text-[var(--muted)]">
        Disclaimer: This is for educational purposes only. Trading involves risk, and you should
        never trade with money you can&apos;t afford to lose. Results are not typical and individual
        results will vary.
      </p>

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-5 top-5 text-3xl text-white/80 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Full size trade receipt"
            className="max-h-[90vh] max-w-[min(960px,100%)] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </main>
  );
}
