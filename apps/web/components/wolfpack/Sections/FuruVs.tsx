"use client";

import { H, ML, Section, WolfMark } from "../Primitives";
import { FuruRow } from "../Tiles";
import { FURU_ROWS } from "../content";

// "The Lambo guy" vs. "Cue + the pack" — a comparison table that uses
// FuruRow underneath the heading for each comparison line.
export default function FuruVs() {
  return (
    <Section id="vs" py={140}>
      <H
        num="03"
        label="The Pack vs. The Furus"
        title="Why most gurus lose you money."
        sub="The difference between the Wolfpack and the rest of the industry isn't just results — it's the model."
      />
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)" }}>
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 64px 1fr",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div style={{ padding: "20px 28px", background: "rgba(255,45,171,0.04)" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 600,
                color: "var(--bone)",
                marginBottom: 6,
              }}
            >
              The Lambo guy
            </div>
            <ML color="var(--pink)">· Typical furu ·</ML>
          </div>
          <div
            style={{
              borderLeft: "1px solid var(--line)",
              borderRight: "1px solid var(--line)",
            }}
          />
          <div style={{ padding: "20px 28px", background: "rgba(37,99,235,0.04)" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 600,
                color: "var(--bone)",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              Cue + the pack <WolfMark size={20} />
            </div>
            <ML color="var(--acid)">· The Wolfpack ·</ML>
          </div>
        </div>
        {FURU_ROWS.map((row, i) => (
          <FuruRow key={i} furu={row.furu} wolf={row.wolf} />
        ))}
      </div>
    </Section>
  );
}
