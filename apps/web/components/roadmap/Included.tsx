"use client";

type Stat = { label: string; desc: string };

// Three-column "what's included" strip below the phase timeline.
export default function Included({ totalVideos }: { totalVideos: number }) {
  const cells: Stat[] = [
    {
      label: `${totalVideos}+ Videos`,
      desc: "Every module, webinar, and live session — all on demand.",
    },
    {
      label: "Chart N Chill + CueCAST",
      desc: "Full archives of live sessions — Cue on charts, real decisions.",
    },
    {
      label: "16 Weekly Webinars",
      desc: "1 live webinar per week with Cue across 16 weeks. Bring your charts.",
    },
    {
      label: "Structured Drills",
      desc: "Practice between phases is required. This is a training program, not a library.",
    },
    {
      label: "Cue AI — On Demand",
      desc: "Ask Cue anything, anytime. Trained on WSA content, answers in his voice.",
    },
    {
      label: "1-on-1 Coach Access",
      desc: "Direct line to your coach for the duration of the program.",
    },
  ];

  return (
    <section
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "0 48px 80px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 48 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            fontWeight: 700,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          · What&apos;s included ·
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
          {cells.map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                padding: "20px 22px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.85)",
                  marginBottom: 6,
                  letterSpacing: "-0.01em",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.32)",
                }}
              >
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
