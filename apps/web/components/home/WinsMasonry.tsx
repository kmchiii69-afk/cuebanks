"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { HomeSecHead, HomeWrap } from "./HomeSection";

// Winshots inline — mirrors the cuebanks `wins-bento` block from the legacy
// _funnels/home.ts. Files live in /public/wsa/home/ and are loaded from the
// repo's gitignored / public assets folder.
const ANTHONY_WINS = [
  { src: "/wsa/home/11.jpg", alt: "Student win \u2014 Doubled account today" },
  { src: "/wsa/home/12.jpg", alt: "Student win \u2014 $6,429 \u2014 same direction" },
  { src: "/wsa/home/13.jpg", alt: "Student win \u2014 $5K x4 \u2014 Holy SWEET GAP" },
  { src: "/wsa/home/14.jpg", alt: "Student win \u2014 $35,400 on US30" },
  { src: "/wsa/home/15.jpg", alt: "Student win \u2014 FTMO $56,281 reward" },
  { src: "/wsa/home/16.jpg", alt: "Student win \u2014 Nice lil 15 racks for the day" },
  { src: "/wsa/home/17.jpg", alt: "Student win \u2014 Making money while asleep" },
  { src: "/wsa/home/18.jpg", alt: "Student win \u2014 $12,433 live on US30" },
  { src: "/wsa/home/19.jpg", alt: "Student win \u2014 Monthly salary in 1 hour" },
  { src: "/wsa/home/20.jpg", alt: "Student win \u2014 First car from trading" },
];

export default function WinsMasonry() {
  return (
    <section id="winshots" className="py-[74px]">
      <HomeWrap>
        <Reveal>
          <HomeSecHead
            eyebrow="Receipts Don't Lie"
            title="Student Wins"
            sub="Real screenshots from inside the Inner Circle. Real entries, real exits, real money."
          />
        </Reveal>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {ANTHONY_WINS.map((img, i) => (
            <Reveal key={img.src} delayMs={i * 60} className="mb-4 break-inside-avoid">
              <figure className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-1)]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={640}
                  height={800}
                  className="h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-center text-[0.78rem] text-[var(--muted)]">
          Tap any screenshot to view full size.
        </p>
      </HomeWrap>
    </section>
  );
}
