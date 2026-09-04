"use client";

import Reveal from "./Reveal";
import { HomeSecHead, HomeWrap } from "./HomeSection";

// Wins data mirrors the card data the legacy home.ts funnel renders
// inside the marquee — kept inline because it isn't user-editable and
// doesn't need a data-fetching boundary.
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
    <div className="w-[300px] shrink-0 rounded-3xl border border-[var(--line)] border-t-[3px] border-t-[var(--acid)] bg-[linear-gradient(160deg,var(--bg-1),var(--bg-2))] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] sm:w-[320px]">
      <div className="mb-3.5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--acid)] text-[1.1rem] font-black text-[var(--primary-foreground)]">
          {initial}
        </div>
        <div>
          <div className="text-base font-extrabold leading-tight text-[var(--bone)]">{name}</div>
          <div className="text-[0.82rem] text-[var(--ash)] opacity-80">{role}</div>
        </div>
      </div>
      <div className="mb-2 text-[1.7rem] font-black text-[var(--acid)]">{amt}</div>
      <p className="mb-3 text-[0.9rem] text-[var(--ash)]">{note}</p>
      <div className="text-[#f6b500]" aria-hidden>
        ★★★★★
      </div>
    </div>
  );
}

export default function WinsMarquee() {
  // Doubling creates a seamless -50% keyframe loop — first half ends where second half begins.
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
                <span className="text-emerald-500">5-figures</span> day after day.
              </>
            }
          />
        </Reveal>
      </HomeWrap>
      <div className="group relative mt-2">
        <div className="home-marquee flex w-max gap-4 px-5 group-hover:[animation-play-state:paused]">
          {loop.map((w, i) => (
            <WinCard key={`${w.name}-${i}`} {...w} />
          ))}
        </div>
      </div>
    </section>
  );
}
