import type { Metadata } from "next";
import Script from "next/script";
import FunnelRenderer from "@/components/funnel/FunnelRenderer";
import * as home from "./_funnels/home";

export const metadata: Metadata = {
  title: "Wall Street Academy — Inner Circle",
  description:
    "The mechanical, rule-based system refined over 10 years to trade just 2–5 focused hours a day — no hype, just structure.",
};

// Same Typeform used on /ig and /text — applying here goes through the exact
// same qualification flow instead of jumping straight to booking a call.
const TYPEFORM_ID = "01KWAVJAM69YPMV554NVRT3Z58";
const TYPEFORM_POPUP_ATTRS = `data-tf-popup="${TYPEFORM_ID}" data-tf-opacity="100" data-tf-iframe-props="title=Wall Street Academy Application" data-tf-transitive-search-params data-tf-medium="snippet"`;

// Point the funnel's conversion CTAs at the Typeform popup (href stays as a
// plain-JS fallback in case the embed script fails to load). The logo (#)
// and the "See How It Works" in-page anchor (#how) are intentionally left
// untouched.
let body = home.body
  .replace(
    '<a href="#apply" class="btn nav-cta">',
    `<a href="/ig" class="btn nav-cta" ${TYPEFORM_POPUP_ATTRS}>`
  )
  .replace(
    '<a href="#" class="btn">Apply For Your Seat',
    `<a href="/ig" class="btn" ${TYPEFORM_POPUP_ATTRS}>Apply For Your Seat`
  )
  .replace(
    '<a href="#" class="btn btn-ghost">Book A Free Strategy Call',
    `<a href="/ig" class="btn btn-ghost" ${TYPEFORM_POPUP_ATTRS}>Book A Free Strategy Call`
  );

// The hero's "video" was a static mockup (fake progress bar, no real
// source) — swap in the actual VSL. Keeps the existing .hero-video/.video
// wrapper classes so sizing, rounded corners, border, and shadow (already
// defined in the funnel's own CSS) still apply to the real embed.
body = body.replace(
  `<div class="hero-video reveal in">
      <div class="video">
        <div class="frame">
          <div class="play" title="Play"></div>
          <div class="vlabel">Watch The Masterclass</div>
        </div>
        <div class="ctrls">
          <span>▶</span><div class="bar"></div><span>1:24 / 48:00</span><span>🔊</span><span>⛶</span>
        </div>
      </div>
    </div>`,
  `<div class="hero-video reveal in">
      <div class="video">
        <iframe src="https://player.vimeo.com/video/1210568071?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;inset:0;width:100%;height:100%;" title="Cue VSL July 2026_2"></iframe>
      </div>
    </div>`
);

// Simplify the hero — drop the long subtext, keep just the headline + trust line.
body = body.replace(
  `      <p class="sub">The mechanical, rule-based system I refined over 10 years to trade just <span class="blue">2–5 focused hours a day</span> — no hype, no get-rich-quick lies, just structure.</p>\n`,
  ""
);

// Move the stat/results strip further down the page (right before the final
// CTA, as a last proof point) and put the same inline Typeform used on /ig
// directly under the hero, so people can apply without leaving the page.
const METRICS_BLOCK = `<!-- METRICS -->
<section class="metrics">
  <div class="wrap">
    <div class="grid">
      <div class="metric"><div class="num">10<span>+</span></div><div class="lab">Years live trading experience</div></div>
      <div class="metric"><div class="num">$500K</div><div class="lab">Documented in 5 days, posted live</div></div>
      <div class="metric"><div class="num">10,000<span>+</span></div><div class="lab">Traders mentored worldwide</div></div>
      <div class="metric"><div class="num">2–5<span>hrs</span></div><div class="lab">Focused trading per day</div></div>
    </div>
  </div>
</section>`;

body = body.replace(
  `</section>

${METRICS_BLOCK}

<!-- STUDENT SPOTLIGHT -->`,
  `</section>

<!-- APPLY FORM -->
<section class="sec" id="apply-form">
  <div class="wrap">
    <div class="sec-head reveal" style="text-align:center;margin:0 auto 36px;max-width:640px">
      <div class="eyebrow" style="justify-content:center;display:flex">Apply Now</div>
      <h2>Go through this and find out if you're a fit.</h2>
    </div>
    <div style="max-width:860px;margin:0 auto;border:1px solid var(--line);border-top:2px solid var(--blue);border-radius:14px;overflow:hidden;background:var(--panel)">
      <div data-tf-live="${TYPEFORM_ID}" style="min-height:560px"></div>
    </div>
  </div>
</section>

<!-- STUDENT SPOTLIGHT -->`
);

body = body.replace(
  `<!-- VIDEO TESTIMONIALS -->

<!-- FINAL CTA -->`,
  `<!-- VIDEO TESTIMONIALS -->

${METRICS_BLOCK}

<!-- FINAL CTA -->`
);

export default function HomePage() {
  return (
    <>
      <Script src="https://embed.typeform.com/next/embed.js" strategy="afterInteractive" />
      <FunnelRenderer data={{ fonts: home.fonts, css: home.css, body, script: home.script }} />
    </>
  );
}
