"use client";

import { useState } from "react";

const DV_MONTHS = [
  { m: 1,  day: { pnl:   -500, trades: 117,  aplus: 23,  bgrade: 35,  cdgrade: 59,  fees:  580,  blowups: 0, stress: 58, screen: 195, vacation: 0  }, swg: { pnl:   720, trades: 5,    fees:  36,    drawdown: false, stress: 22, screen: 8,   vacation: 2  } },
  { m: 2,  day: { pnl:  -1400, trades: 234,  aplus: 47,  bgrade: 70,  cdgrade:117,  fees: 1190,  blowups: 0, stress: 64, screen: 410, vacation: 0  }, swg: { pnl:  1560, trades:10,    fees:  72,    drawdown: false, stress: 24, screen: 17,  vacation: 4  } },
  { m: 3,  day: { pnl:  -3100, trades: 350,  aplus: 70,  bgrade:105,  cdgrade:175,  fees: 1860,  blowups: 0, stress: 72, screen: 620, vacation: 0  }, swg: { pnl:  2880, trades:15,    fees: 108,    drawdown: false, stress: 28, screen: 26,  vacation: 6  } },
  { m: 4,  day: { pnl: -10000, trades: 467,  aplus: 93,  bgrade:140,  cdgrade:234,  fees: 2710,  blowups: 1, stress: 92, screen: 835, vacation: 0  }, swg: { pnl:  2320, trades:20,    fees: 144,    drawdown: true,  stress: 36, screen: 35,  vacation: 6  } },
  { m: 5,  day: { pnl: -11500, trades: 584,  aplus:117,  bgrade:175,  cdgrade:292,  fees: 3400,  blowups: 1, stress: 86, screen:1050, vacation: 0  }, swg: { pnl:  4960, trades:25,    fees: 180,    drawdown: false, stress: 26, screen: 44,  vacation: 8  } },
  { m: 6,  day: { pnl: -13200, trades: 700,  aplus:140,  bgrade:210,  cdgrade:350,  fees: 4100,  blowups: 1, stress: 90, screen:1265, vacation: 0  }, swg: { pnl:  8400, trades:30,    fees: 216,    drawdown: false, stress: 24, screen: 52,  vacation:10 } },
  { m: 7,  day: { pnl: -15000, trades: 817,  aplus:163,  bgrade:245,  cdgrade:409,  fees: 4800,  blowups: 1, stress: 92, screen:1480, vacation: 0  }, swg: { pnl: 13120, trades:35,    fees: 252,    drawdown: false, stress: 22, screen: 60,  vacation:12 } },
  { m: 8,  day: { pnl: -20000, trades: 934,  aplus:187,  bgrade:280,  cdgrade:467,  fees: 5500,  blowups: 2, stress:100, screen:1695, vacation: 0  }, swg: { pnl: 16600, trades:40,    fees: 288,    drawdown: true,  stress: 34, screen: 68,  vacation:14 } },
  { m: 9,  day: { pnl: -21500, trades:1050,  aplus:210,  bgrade:315,  cdgrade:525,  fees: 6200,  blowups: 2, stress: 94, screen:1910, vacation: 0  }, swg: { pnl: 23360, trades:45,    fees: 324,    drawdown: false, stress: 22, screen: 76,  vacation:18 } },
  { m:10,  day: { pnl: -23000, trades:1167,  aplus:233,  bgrade:350,  cdgrade:584,  fees: 6900,  blowups: 2, stress: 96, screen:2125, vacation: 0  }, swg: { pnl: 31440, trades:50,    fees: 360,    drawdown: false, stress: 20, screen: 84,  vacation:22 } },
  { m:11,  day: { pnl: -24500, trades:1284,  aplus:257,  bgrade:385,  cdgrade:642,  fees: 7600,  blowups: 2, stress: 98, screen:2340, vacation: 0  }, swg: { pnl: 40960, trades:55,    fees: 396,    drawdown: false, stress: 18, screen: 92,  vacation:30 } },
  { m:12,  day: { pnl: -26000, trades:1400,  aplus:280,  bgrade:420,  cdgrade:700,  fees: 8240,  blowups: 2, stress:100, screen:2555, vacation: 0  }, swg: { pnl: 55280, trades:60,    fees: 432,    drawdown: false, stress: 16, screen:100,  vacation:42 } },
];

const START = 10000;
const dayBalances = DV_MONTHS.map(s => Math.max(0, START * (1 + s.day.blowups) + s.day.pnl));
const swgBalances = DV_MONTHS.map(s => START + s.swg.pnl);
const maxBalance = Math.max(...swgBalances);

function balanceY(b: number) {
  const t = b / maxBalance;
  return 240 - t * 200;
}
function monthX(m: number) {
  return 60 + ((m - 1) / 11) * 1080;
}

const dayPath = DV_MONTHS.map((s, i) => `${i === 0 ? "M" : "L"} ${monthX(s.m)} ${balanceY(dayBalances[i])}`).join(" ");
const swgPath = DV_MONTHS.map((s, i) => `${i === 0 ? "M" : "L"} ${monthX(s.m)} ${balanceY(swgBalances[i])}`).join(" ");
const startY = balanceY(START);

function fmtMoney(n: number) {
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "+";
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}K`;
  return `${sign}$${abs.toLocaleString()}`;
}

function DvCard({
  kicker,
  handle,
  accent,
  pnl,
  balance,
  totalDeposited,
  metrics,
  stressLabel,
  stressValue,
  note,
  positive,
}: {
  kicker: string; handle: string; accent: string; pnl: number; balance: number;
  totalDeposited?: number; metrics: { v: string | number; k: string; highlight?: boolean }[];
  stressLabel: string; stressValue: number; note: string; positive?: boolean;
}) {
  return (
    <div
      style={{ borderTopColor: accent }}
      className="bg-bg-2 border border-line pt-0.5 p-5.5 px-6 flex flex-col"
    >
      <div className="mb-4">
        <div
          style={{ color: accent }}
          className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase"
        >
          · {kicker} ·
        </div>
        <div className="font-mono text-[8.5px] font-bold text-ash tracking-[0.22em] uppercase mt-2">
          {handle}
        </div>
      </div>
      <div className="flex items-baseline gap-3.5 mb-4.5 flex-wrap">
        <div
          style={{
            color: accent,
            textShadow: positive ? "0 0 24px rgba(249,255,60,0.3)" : "none",
          }}
          className="font-display text-[48px] font-bold tracking-[-0.035em] leading-[0.9]"
        >
          {fmtMoney(pnl)}
        </div>
        <div>
          <div className="font-mono text-[8px] font-bold text-ash tracking-[0.22em] uppercase">
            · Active balance{totalDeposited && totalDeposited > START ? ` · $${(totalDeposited / 1000).toFixed(0)}K deposited` : ""}
          </div>
          <div className="font-display text-[16px] font-semibold text-bone tracking-[-0.02em] mt-0.5">
            ${balance.toLocaleString()}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 py-3.5 border-y border-line">
        {metrics.map((m, i) => (
          <div key={i}>
            <div
              style={{ color: m.highlight ? accent : "var(--bone)" }}
              className="font-display text-[17px] font-bold tracking-[-0.02em] leading-none"
            >
              {m.v}
            </div>
            <div className="font-mono text-[8px] font-bold text-ash tracking-[0.22em] uppercase mt-1.5">
              · {m.k}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-baseline mb-2">
          <div className="font-mono text-[8px] font-bold text-ash tracking-[0.22em] uppercase">
            · {stressLabel}
          </div>
          <span
            style={{ color: accent }}
            className="font-mono text-[9px] font-bold tracking-[0.18em]"
          >
            {stressValue} / 100
          </span>
        </div>
        <div className="h-1.5 bg-bg-3 overflow-hidden">
          <div
            style={{
              width: `${stressValue}%`,
              background: accent,
              boxShadow: `0 0 12px ${accent}`,
            }}
            className="h-full transition-[width] duration-300 ease-out"
          />
        </div>
      </div>
      <p className="font-display text-[14px] font-medium italic text-ash leading-[1.4] mt-4 mb-0 tracking-[-0.01em]">
        {note}
      </p>
    </div>
  );
}

export default function DayVsSwingComparison() {
  const [month, setMonth] = useState(3);
  const idx = month - 1;
  const cur = DV_MONTHS[idx];

  return (
    <div className="bg-bg-1 border border-line p-11 pb-8 mb-14 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(900px 400px at 50% 50%, rgba(249,255,60,0.04), transparent 60%)",
        }}
      />
      <div className="relative">
        <div className="flex justify-between items-baseline mb-6 flex-wrap gap-4">
          <div>
            <div className="font-mono text-[9px] font-bold text-ash tracking-[0.22em] uppercase mb-2.5">
              · 12 months · same $10K start · two paths ·
            </div>
            <div className="font-display text-[36px] font-semibold text-bone tracking-[-0.025em] leading-none">
              Scrub the timeline.{" "}
              <em className="text-acid not-italic">Watch both lives play out.</em>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="font-mono text-[10px] font-bold text-acid tracking-[0.22em] uppercase">
              · Month {String(month).padStart(2, "0")} / 12 ·
            </div>
            <span className="font-mono text-[9px] font-semibold text-muted tracking-[0.22em]">
              · Drag the slider below ·
            </span>
          </div>
        </div>

        <div className="bg-bg-2 border border-line p-5 px-6 mb-5 overflow-hidden">
          <svg viewBox="0 0 1200 280" className="w-full block overflow-visible">
            {[40, 90, 140, 190, 240].map((y, i) => (
              <line key={i} x1="60" x2="1140" y1={y} y2={y} stroke="var(--line)" strokeWidth="1" strokeDasharray="2 6" opacity="0.5" />
            ))}
            {[{ y: 40, v: maxBalance }, { y: 140, v: START }, { y: 240, v: 0 }].map((g, i) => (
              <text key={i} x="52" y={g.y + 3} textAnchor="end" fill="var(--muted)"
                style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em" }}>
                ${(g.v / 1000).toFixed(0)}K
              </text>
            ))}
            <line x1="60" x2="1140" y1={startY} y2={startY} stroke="var(--ash)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            <text x="1145" y={startY + 3} fill="var(--ash)" style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em" }}>START</text>
            <defs>
              <clipPath id="dv-clip">
                <rect x="0" y="0" width={monthX(month) + 4} height="280" />
              </clipPath>
            </defs>
            <path d={dayPath} fill="none" stroke="var(--pink)" strokeWidth="2.2" opacity="0.8" clipPath="url(#dv-clip)" style={{ filter: "drop-shadow(0 0 8px rgba(255,45,171,0.35))" }} />
            <path d={swgPath} fill="none" stroke="var(--acid)" strokeWidth="2.2" opacity="0.95" clipPath="url(#dv-clip)" style={{ filter: "drop-shadow(0 0 10px rgba(249,255,60,0.4))" }} />
            <line x1={monthX(month)} x2={monthX(month)} y1="20" y2="260" stroke="var(--bone)" strokeWidth="1" strokeDasharray="3 5" opacity="0.5" />
            <circle cx={monthX(month)} cy={balanceY(dayBalances[idx])} r="6" fill="var(--bg-1)" stroke="var(--pink)" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 8px var(--pink))" }} />
            <circle cx={monthX(month)} cy={balanceY(swgBalances[idx])} r="6" fill="var(--bg-1)" stroke="var(--acid)" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 8px var(--acid))" }} />
            {DV_MONTHS.map((s, i) => (
              <text key={i} x={monthX(s.m)} y="272" textAnchor="middle" fill={s.m === month ? "var(--bone)" : "var(--muted)"} style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em" }}>M{s.m}</text>
            ))}
          </svg>
        </div>

        <div className="mb-7 px-1">
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
            aria-label="Month"
            className="qc-dv-slider outline-none cursor-pointer w-full h-1"
            style={{
              background: `linear-gradient(to right, var(--acid) 0%, var(--acid) ${((month - 1) / 11) * 100}%, var(--line-2) ${((month - 1) / 11) * 100}%, var(--line-2) 100%)`,
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DvCard
            kicker="The day trader"
            handle="Over-trading to death · screen-bound · revenge cycle"
            accent="var(--pink)"
            pnl={cur.day.pnl}
            balance={dayBalances[idx]}
            totalDeposited={START * (1 + cur.day.blowups)}
            metrics={[
              { v: cur.day.trades.toLocaleString(), k: "Trades placed" },
              { v: `${cur.day.aplus} / ${cur.day.bgrade} / ${cur.day.cdgrade}`, k: "A+ / B / C-D grade", highlight: true },
              { v: `$${cur.day.fees.toLocaleString()}`, k: "Fees paid" },
              { v: cur.day.blowups, k: "Times blown up", highlight: cur.day.blowups > 0 },
              { v: `${cur.day.screen.toLocaleString()} hrs`, k: "Screen time" },
              { v: `${cur.day.vacation}`, k: "Vacation days" },
            ]}
            stressLabel="Stress + cortisol"
            stressValue={cur.day.stress}
            note={cur.day.blowups > 0 ? `Account blew up ${cur.day.blowups}× — re-deposited, started over.` : "Slowly bleeding out. Convinced 'this month is the one.'"}
          />
          <DvCard
            kicker="The swing operator"
            handle="5 A+ setups a month · plan · place · walk away"
            accent="var(--acid)"
            pnl={cur.swg.pnl}
            balance={swgBalances[idx]}
            metrics={[
              { v: cur.swg.trades.toLocaleString(), k: "Trades placed" },
              { v: "100% A+", k: "Setup quality", highlight: true },
              { v: `$${cur.swg.fees.toLocaleString()}`, k: "Fees paid" },
              { v: cur.swg.drawdown ? "Drawdown" : "Compounding", k: "Equity state" },
              { v: `${cur.swg.screen} hrs`, k: "Screen time" },
              { v: `${cur.swg.vacation}`, k: "Vacation days" },
            ]}
            stressLabel="Stress + cortisol"
            stressValue={cur.swg.stress}
            note={cur.swg.drawdown ? "Small drawdown. Stops worked. Plan unchanged." : "Compounding through the cycle. Sleeping through the night."}
            positive
          />
        </div>

        {month === 12 && (
          <div className="mt-5 py-5 px-6.5 bg-bg-2 border border-acid grid grid-cols-[auto_1fr_auto] gap-6 items-center">
            <div>
              <div className="font-mono text-[9px] font-bold text-pink tracking-[0.22em] uppercase">
                · Day trader · year end
              </div>
              <div className="font-display text-[28px] font-bold text-pink tracking-[-0.025em] leading-none mt-1">
                {fmtMoney(cur.day.pnl)}
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-[9px] font-bold text-bone tracking-[0.22em] uppercase">
                · Same start · same year ·
              </div>
              <div className="font-display text-[16px] font-medium italic text-ash tracking-[-0.01em] mt-1.5">
                One path destroys you. The other compounds.
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[9px] font-bold text-acid tracking-[0.22em] uppercase">
                · Swing trader · year end
              </div>
              <div
                style={{ textShadow: "0 0 24px rgba(249,255,60,0.4)" }}
                className="font-display text-[28px] font-bold text-acid tracking-[-0.025em] leading-none mt-1"
              >
                {fmtMoney(cur.swg.pnl)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
