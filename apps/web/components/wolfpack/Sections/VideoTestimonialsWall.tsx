"use client";

import { H, ML, Section } from "../Primitives";
import { VideoTestimonialCard } from "../Cards";
import { VIDEO_TESTIMONIALS } from "../content";

// 4-col wall of YouTube lazy-load cards. Each card opens on click —
// keeps the initial render weight down (~2MB per iframe avoided).
export default function VideoTestimonialsWall() {
  return (
    <Section id="videos" py={140}>
      <H
        num="04c"
        label="Video testimonials"
        title="Hear it from the pack."
        sub="20 of 50+ video testimonials from traders in the Wolfpack — different backgrounds, same results."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          background: "var(--line)",
          marginBottom: 1,
        }}
      >
        {VIDEO_TESTIMONIALS.map((v, i) => (
          <VideoTestimonialCard key={i} videoId={v.videoId} headline={v.headline} body={v.body} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          background: "var(--bg-1)",
          padding: "20px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            className="pulse"
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--acid)",
            }}
          />
          <ML>20 of 50+ video testimonials · The Wolfpack speaks</ML>
        </div>
        <a
          href="/wolfpack#apply"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "var(--acid)",
            textTransform: "uppercase",
          }}
        >
          Apply For Your Seat →
        </a>
      </div>
    </Section>
  );
}
