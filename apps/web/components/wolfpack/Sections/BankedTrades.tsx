"use client";

import { H, Section } from "../Primitives";
import { TradeRow } from "../Tiles";
import { TRADE_ROWS } from "../content";

// "Banked trades" — two fully-documented positions wrapped in trade-row
// components (image | text | callouts). Each row flips left/right.
export default function BankedTrades() {
  return (
    <Section py={140}>
      <H
        num="05"
        label="Banked trades · case studies"
        title="Inside the trades."
        sub="Two documented positions from the Krypton playbook — entered, managed, and closed on screen."
      />
      <div style={{ border: "1px solid var(--line)" }}>
        {TRADE_ROWS.map((t, i) => (
          // TradeRow accepts a ReactNode title but TRADE_ROWS stores JSX
          // strings. The cast below is sound because the data is built
          // with JSX expressions above.
          <TradeRow key={i} {...t} title={t.title as React.ReactNode} />
        ))}
      </div>
    </Section>
  );
}
