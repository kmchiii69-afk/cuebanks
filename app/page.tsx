import type { Metadata } from "next";
import FunnelRenderer from "@/components/funnel/FunnelRenderer";
import * as home from "./_funnels/home";

export const metadata: Metadata = {
  title: "Wall Street Academy — Inner Circle",
  description:
    "The mechanical, rule-based system refined over 10 years to trade just 2–5 focused hours a day — no hype, just structure.",
};

// Point the funnel's conversion CTAs at the booking page. The logo (#) and the
// "See How It Works" in-page anchor (#how) are intentionally left untouched.
const body = home.body
  .replace('<a href="#apply" class="btn nav-cta">', '<a href="/book" class="btn nav-cta">')
  .replace('<a href="#" class="btn">Apply For Your Seat', '<a href="/book" class="btn">Apply For Your Seat')
  .replace('<a href="#" class="btn btn-ghost">Book A Free Strategy Call', '<a href="/book" class="btn btn-ghost">Book A Free Strategy Call');

export default function HomePage() {
  return <FunnelRenderer data={{ fonts: home.fonts, css: home.css, body, script: home.script }} />;
}
