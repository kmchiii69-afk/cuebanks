"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { HomeSecHead, HomeWrap } from "./HomeSection";

const CUE_WINS = [
  { src: "/wsa/home/2.jpg", alt: "Cue live trade — $10,299 profit" },
  { src: "/wsa/home/3.jpg", alt: "Cue live trade — $31,464 profit" },
  { src: "/wsa/home/4.jpg", alt: "Cue live trade — $29,703 profit" },
  { src: "/wsa/home/5.jpg", alt: "Cue live trade — $16,068 with chart markup" },
  { src: "/wsa/home/6.jpg", alt: "Cue live trade — $28,790 profit" },
  { src: "/wsa/home/7.jpg", alt: "Cue live trade — $26,270 on XAUUSD" },
  { src: "/wsa/home/8.jpg", alt: "Cue live trade — $18,010 on XAUUSD" },
  { src: "/wsa/home/9.jpg", alt: "Cue live trade — $46,800 on XAUUSD" },
  { src: "/wsa/home/10.jpg", alt: "Cue live trade — $14,340 on XAUUSD" },
];

export default function CueMasonry() {
  return (
    <section id="spotlight" className="py-[74px]">
      <HomeWrap>
        <Reveal>
          <HomeSecHead
            eyebrow="Documented Live"
            title="Cue's Wins"
            sub="Publicly posted profits, executed live — not from selling courses, from clicking buttons on the chart."
          />
        </Reveal>
        <div className="w-full [column-count:3] [column-gap:16px] max-[900px]:[column-count:2] max-[560px]:[column-count:1]">
          {CUE_WINS.map((img, i) => (
            <Reveal key={img.src} delayMs={i * 40} className="mb-4 break-inside-avoid">
              <figure className="cursor-pointer overflow-hidden rounded-xl border border-line-2 bg-white transition hover:border-wsa-blue">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={640}
                  height={800}
                  className="h-auto w-full object-cover transition-transform duration-[350ms] hover:scale-[1.06]"
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </HomeWrap>
    </section>
  );
}
