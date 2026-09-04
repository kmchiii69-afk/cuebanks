import type { Metadata } from "next";

import HomeHero from "@/components/home/HomeHero";
import TypeformEmbed from "@/components/home/TypeformEmbed";
import WinsMasonry from "@/components/home/WinsMasonry";
import YouCanBand from "@/components/home/YouCanBand";
import PainSolutionMethod from "@/components/home/PainSolutionMethod";
import WinsMarquee from "@/components/home/WinsMarquee";
import {
  Disclaimer,
  FinalCta,
  IncludedSection,
  MetricsStrip,
  ReviewsStrip,
} from "@/components/home/HomeBlocks";

export const metadata: Metadata = {
  title: "Wall Street Academy — Inner Circle",
  description:
    "The mechanical, rule-based system refined over 10 years to trade just 2–5 focused hours a day — no hype, no get-rich-quick lies, just structure.",
};

export default function HomePage() {
  return (
    <main className="bg-[var(--bg)] text-[var(--bone)]">
      <HomeHero />
      <TypeformEmbed />
      <WinsMasonry />
      <YouCanBand />
      <PainSolutionMethod />
      <WinsMarquee />
      <ReviewsStrip />
      <IncludedSection />
      <MetricsStrip />
      <FinalCta />
      <Disclaimer />
    </main>
  );
}
