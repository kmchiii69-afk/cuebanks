"use client";

import { useEffect, useState } from "react";
import Wrap from "../shared/Wrap";

const CURRENT_CYCLE_READ = {
  phaseNum: "06",
  phaseName: "Whiplash",
  bias: "Long" as "Long" | "Short" | "Step aside",
  note: "Sweep at demand · longs back on the table",
};

function Tick({ label, price, pct, positive }: { label: string; price: string; pct: string; positive: boolean }) {
  const colorClass = positive ? "text-acid" : "text-pink";
  return (
    <div className="flex flex-col gap-0.5 min-w-[110px]">
      <div className="flex items-baseline gap-2">
        <div className="font-mono text-[9px] font-bold tracking-[0.22em] uppercase text-ash">
          {label}
        </div>
        <span className="font-display text-[16px] font-bold text-bone tracking-[-0.02em] leading-none">
          {price}
        </span>
      </div>
      <span
        style={{ color: positive ? "var(--acid)" : "var(--pink)" }}
        className={`font-mono text-[9.5px] font-bold tracking-[0.14em] ${colorClass}`}
      >
        · {pct} · 24h
      </span>
    </div>
  );
}

export default function LiveTicker({ ctaHref = "#apply" }: { ctaHref?: string } = {}) {
  const [btc, setBtc] = useState<{ price: number; change: number } | null>(null);
  const [eth, setEth] = useState<{ price: number; change: number } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchPrices() {
      try {
        const r = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true"
        );
        if (!r.ok) throw new Error("rate");
        const j = await r.json();
        if (cancelled) return;
        setBtc({ price: j.bitcoin.usd, change: j.bitcoin.usd_24h_change });
        setEth({ price: j.ethereum.usd, change: j.ethereum.usd_24h_change });
        setError(false);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    fetchPrices();
    const id = setInterval(fetchPrices, 45000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  function fmt(n: number | null | undefined) {
    if (n == null) return "—";
    if (n >= 10000) return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
    return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  function fmtPct(n: number | null | undefined) {
    if (n == null) return "—";
    const sign = (n ?? 0) >= 0 ? "+" : "";
    return sign + (n ?? 0).toFixed(2) + "%";
  }

  const biasClass =
    CURRENT_CYCLE_READ.bias === "Long"
      ? "text-acid"
      : CURRENT_CYCLE_READ.bias === "Short"
        ? "text-pink"
        : "text-bone";
  const biasVar =
    CURRENT_CYCLE_READ.bias === "Long"
      ? "var(--acid)"
      : CURRENT_CYCLE_READ.bias === "Short"
        ? "var(--pink)"
        : "var(--bone)";

  return (
    <div className="qc-ticker-wrap relative border-y border-line bg-bg-1">
      <Wrap className="py-4 px-12">
        <div className="qc-ticker-row grid grid-cols-[auto_1fr_auto_auto_auto] gap-7 items-center">
          <div className="flex items-center gap-2.5">
            <span
              style={{
                background: error ? "var(--pink)" : "var(--acid)",
              }}
              className="pulse w-2 h-2 rounded-full inline-block"
            />
            <div
              style={{ color: error ? "var(--pink)" : "var(--acid)" }}
              className="font-mono text-[9px] font-bold tracking-[0.22em] uppercase"
            >
              · {error ? "Offline" : "Live"} ·{" "}
              {new Date().toLocaleString("en-US", { month: "short", day: "numeric" })} ·
            </div>
          </div>

          <div className="qc-ticker-notes min-w-0 flex items-baseline gap-3.5 flex-wrap">
            <div className="font-mono text-[9px] font-bold tracking-[0.22em] uppercase text-ash">
              · Phase
            </div>
            <span className="font-display text-[18px] font-bold text-bone tracking-[-0.02em] leading-none">
              {CURRENT_CYCLE_READ.phaseNum} · {CURRENT_CYCLE_READ.phaseName}
            </span>
            <span
              style={{
                borderColor: biasVar,
                color: biasVar,
              }}
              className={`font-mono text-[9px] font-bold tracking-[0.22em] border px-1.75 py-0.75 ${biasClass}`}
            >
              {CURRENT_CYCLE_READ.bias.toUpperCase()}
            </span>
            <span className="qc-ticker-note font-body text-[13px] font-normal text-ash italic">
              {CURRENT_CYCLE_READ.note}
            </span>
          </div>

          <Tick
            label="BTC"
            price={fmt(btc?.price)}
            pct={fmtPct(btc?.change)}
            positive={(btc?.change ?? 0) >= 0}
          />
          <Tick
            label="ETH"
            price={fmt(eth?.price)}
            pct={fmtPct(eth?.change)}
            positive={(eth?.change ?? 0) >= 0}
          />

          <a
            href={ctaHref}
            className="font-mono text-[9px] font-bold text-acid tracking-[0.22em] uppercase border-l border-line pl-5 qc-ticker-cta"
          >
            Trade with us →
          </a>
        </div>
      </Wrap>

      <style>{`
        @media (max-width: 900px) {
          .qc-ticker-row { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .qc-ticker-row > *:nth-child(1) { grid-column: 1 / -1; }
          .qc-ticker-row > *:nth-child(2) { grid-column: 1 / -1; }
          .qc-ticker-row > *:nth-child(5) {
            grid-column: 1 / -1;
            border-left: 0 !important;
            padding-left: 0 !important;
            border-top: 1px solid var(--line);
            padding-top: 12px;
          }
          .qc-ticker-note { display: none; }
        }
      `}</style>
    </div>
  );
}
