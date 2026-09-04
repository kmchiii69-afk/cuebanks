"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { HomeSecHead, HomeWrap } from "./HomeSection";

const COLS: { src: string; alt: string }[][] = [
  [
    { src: "/wsa/home/11.jpg", alt: "Student win — Doubled account today" },
    { src: "/wsa/home/12.jpg", alt: "Student win — $6,429 — same direction" },
    { src: "/wsa/home/13.jpg", alt: "Student win — $5K x4 — Holy SWEET GAP" },
    { src: "/wsa/home/14.jpg", alt: "Student win — $35,400 on US30" },
  ],
  [
    { src: "/wsa/home/15.jpg", alt: "Student win — FTMO $56,281 reward" },
    { src: "/wsa/home/16.jpg", alt: "Student win — Nice lil 15 racks for the day" },
    { src: "/wsa/home/17.jpg", alt: "Student win — Making money while asleep" },
  ],
  [
    { src: "/wsa/home/18.jpg", alt: "Student win — $12,433 live on US30" },
    { src: "/wsa/home/19.jpg", alt: "Student win — Monthly salary in 1 hour" },
    { src: "/wsa/home/20.jpg", alt: "Student win — First car from trading" },
  ],
];

export default function WinsMasonry() {
  return (
    <section
      id="winshots"
      className="bg-[linear-gradient(180deg,#0a0d14,#05070b)] py-[74px]"
    >
      <HomeWrap>
        <Reveal>
          <HomeSecHead
            eyebrow="Receipts Don't Lie"
            title="Student Wins"
            sub="Real screenshots from inside the Inner Circle. Real entries, real exits, real money."
          />
        </Reveal>
        <div className="grid items-start gap-3.5 max-[560px]:grid-cols-1 max-[900px]:grid-cols-2 min-[901px]:grid-cols-3">
          {COLS.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-3.5">
              {col.map((img, i) => (
                <Reveal key={img.src} delayMs={(ci + i * 3) * 120}>
                  <figure className="overflow-hidden rounded-xl border border-line-2 bg-white transition hover:border-wsa-blue">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={640}
                      height={800}
                      className="h-auto w-full object-cover"
                      sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                    />
                  </figure>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </HomeWrap>
    </section>
  );
}
