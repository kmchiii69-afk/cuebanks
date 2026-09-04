"use client";

import { H, ML, Section } from "../Primitives";
import { RatingHeader, ReviewCard } from "../Cards";
import { REVIEWS } from "../content";

// 3-column masonry of Whop-verified reviews. Rating header renders above
// the masonry showing the headline 4.95★ figure and a CTA.
export default function ReviewsWall({ joinHref }: { joinHref: string }) {
  return (
    <Section id="reviews" py={140}>
      <H num="04b" label="Verified reviews · Whop" title="4.95 stars. 135 verified reviews." />
      <RatingHeader joinHref={joinHref} />
      <div style={{ columnCount: 3, columnGap: 14 }}>
        {REVIEWS.map((r, i) => (
          <ReviewCard key={i} name={r.name} quote={r.quote} date={r.date} />
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
          marginTop: 14,
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
          <ML>Showing 24 of 135 · See all on Whop →</ML>
        </div>
        <a
          href="https://whop.com/iknk-fx/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "var(--acid)",
            textTransform: "uppercase",
          }}
        >
          View All Reviews →
        </a>
      </div>
    </Section>
  );
}
