"use client";

import { H, Section } from "../Primitives";
import { KryptonCase } from "../Tiles";
import { KRYPTON_CASES } from "../content";

// 4-up grid of documented case studies. The `Section > H` reuse keeps the
// rhythm consistent across sections; only num/label/title/sub change.
export default function KryptonCaseGrid() {
  return (
    <Section py={140}>
      <H
        num="02"
        label="Krypton · Case studies"
        title="Real money. Real screenshots. Real trades."
        sub="Four documented case studies from the Krypton playbook — each one a different cycle, a different market, the same system."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--line)" }}>
        {KRYPTON_CASES.map((c, i) => (
          <KryptonCase key={i} {...c} />
        ))}
      </div>
    </Section>
  );
}
