"use client";

import { useState } from "react";
import { ML, StarRow, WolfMark, Wrap } from "./Primitives";
import type { ReviewData, VideoTestimonialData } from "./data";

// YouTube lazy-load — uses the channel maxres thumbnail until clicked.
// Saving the iframe until click shaves ~2MB off the initial page load.
export function VideoTestimonialCard({ videoId, headline, body }: VideoTestimonialData) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "var(--acid)" : "var(--line)"}`,
        background: "var(--bg-1)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 180ms ease, border-color 180ms ease",
      }}
    >
      <div
        onClick={() => !loaded && setLoaded(true)}
        style={{
          position: "relative",
          aspectRatio: "16/9",
          cursor: loaded ? "default" : "pointer",
          overflow: "hidden",
          background: "var(--bg-2)",
        }}
      >
        {loaded ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt={headline}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(6,7,10,0.7) 0%, transparent 50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "var(--acid)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--bg)">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              </div>
            </div>
            <div style={{ position: "absolute", top: 8, left: 8 }}>
              <ML>· LIVE · TESTIMONIAL</ML>
            </div>
            <div style={{ position: "absolute", bottom: 8, right: 8 }}>
              <ML color="var(--bone)">YOUTUBE</ML>
            </div>
          </>
        )}
      </div>
      <div style={{ padding: "16px 18px" }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 600,
            color: "var(--bone)",
            marginBottom: 6,
            lineHeight: 1.3,
          }}
        >
          {headline}
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12.5,
            lineHeight: 1.6,
            color: "var(--ash)",
            margin: 0,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

// Review pulled from Whop — the avatars are initials, color-coded by first-letter hash.
export function ReviewCard({ name, quote, date }: ReviewData) {
  const [hovered, setHovered] = useState(false);
  const colorIndex = name.charCodeAt(0) % 3;
  const avatarColor =
    colorIndex === 0 ? "var(--acid)" : colorIndex === 1 ? "var(--pink)" : "#6FE9FF";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "var(--acid)" : "var(--line)"}`,
        background: "var(--bg-1)",
        padding: 20,
        marginBottom: 14,
        breakInside: "avoid",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 180ms ease, border-color 180ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <StarRow count={5} color="var(--acid)" size={12} />
        <ML color="var(--muted)">VERIFIED · WHOP</ML>
      </div>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 14,
          lineHeight: 1.65,
          color: "var(--bone)",
          margin: "0 0 16px",
        }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: `1.5px solid ${avatarColor}`,
            background: "var(--bg-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            color: avatarColor,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--bone)",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--muted)",
              letterSpacing: "0.14em",
            }}
          >
            {date}
          </div>
        </div>
      </div>
    </div>
  );
}

// The 4.95★ rating header — large number + stars + meta + CTA on one row.
// Lives at the top of the reviews wall.
export function RatingHeader({ joinHref }: { joinHref: string }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 48,
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 88,
              fontWeight: 600,
              color: "var(--acid)",
              lineHeight: 1,
              marginBottom: 12,
            }}
          >
            4.95 <span style={{ fontSize: 40, color: "var(--ash)" }}>/ 5.00</span>
          </div>
          <div style={{ marginBottom: 20 }}>
            <StarRow count={5} color="var(--acid)" size={16} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, auto)",
              gap: "12px 32px",
              justifyContent: "start",
            }}
          >
            <ML color="var(--ash)">135 reviews</ML>
            <ML color="var(--ash)">100% 5-star</ML>
            <ML color="var(--ash)">Whop platform</ML>
          </div>
        </div>
        <a href={joinHref} className="btn btn-lg">
          Join Them →
        </a>
      </div>
    </div>
  );
}

// Export the underlying icon library so sections can reuse these glyphs
// without depending on WolfMark directly.
export { WolfMark, Wrap };
