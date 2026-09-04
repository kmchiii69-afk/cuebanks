"use client";

import Reveal from "./Reveal";
import { HomeSecHead, HomeWrap } from "./HomeSection";

const WINS = [
  {
    name: "Cornelius",
    role: "Inner Circle Member",
    amt: "$10K",
    note: "Profit one week after joining the Inner Circle.",
  },
  {
    name: "Jonathan",
    role: "WSA Protocol Trader",
    amt: "$48K",
    note: "In 30 days following the WSA Protocol.",
  },
  {
    name: "Mike",
    role: "Part-time Trader",
    amt: "$50K",
    note: "While still working a full-time job.",
  },
  {
    name: "T\u2019Challa",
    role: "US30 Specialist",
    amt: "$35.4K",
    note: "Single SELL on US30, executed clean.",
  },
  {
    name: "SV",
    role: "Inner Circle Member",
    amt: "$12.4K",
    note: "Live on US30.PRO in under 15 minutes.",
  },
  {
    name: "Selfmade_Jova",
    role: "Day Trader",
    amt: "$7K",
    note: "Monthly salary pulled in one hour.",
  },
  {
    name: "Justin",
    role: "Class of 2024",
    amt: "New Car",
    note: "Bought his first car one year out of high school.",
  },
  {
    name: "Philly",
    role: "Swing Trader",
    amt: "$15.1K",
    note: "Made money while asleep on USDJPY.",
  },
];

function WinCard({
  name,
  role,
  amt,
  note,
}: {
  name: string;
  role: string;
  amt: string;
  note: string;
}) {
  const initial = name.replace(/[^A-Za-z]/g, "").charAt(0) || "W";
  return (
    <div className="w-[320px] shrink-0 rounded-3xl border border-line-2 border-t-[3px] border-t-wsa-green bg-[linear-gradient(160deg,rgba(34,34,34,0.9),rgba(17,24,39,0.85))] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-[10px]">
      <div className="mb-3.5 flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-wsa-green bg-[linear-gradient(135deg,#188bf6,#0b3c6b)] font-h2 text-[1.1rem] font-black text-white">
          {initial}
        </div>
        <div>
          <div className="font-h2 text-base font-extrabold leading-tight text-bone">{name}</div>
          <div className="text-[0.82rem] text-[#cbd5e0] opacity-70">{role}</div>
        </div>
      </div>
      <div className="mb-2 font-h2 text-[1.7rem] font-black text-wsa-green">{amt}</div>
      <p className="mb-3 font-h1 text-[0.9rem] text-[#cbd5e0]">{note}</p>
      <div className="flex gap-1 text-acid" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 24 24" className="size-4 fill-acid">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

export default function WinsMarquee() {
  const loop = [...WINS, ...WINS];

  return (
    <section id="wins" className="overflow-hidden py-[74px]">
      <HomeWrap>
        <Reveal>
          <HomeSecHead
            eyebrow="Recent Wins"
            title={
              <>
                No other program has everyday traders posting{" "}
                <span className="text-wsa-green">5-figures</span> day after day.
              </>
            }
          />
        </Reveal>
      </HomeWrap>
      <div className="group relative mt-2 mask-[linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <div className="home-marquee flex w-max gap-[18px] px-5 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {loop.map((w, i) => (
            <WinCard key={`${w.name}-${i}`} {...w} />
          ))}
        </div>
      </div>
    </section>
  );
}
