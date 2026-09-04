import type { Metadata } from "next";
import Script from "next/script";

import HomeHero from "@/components/home/HomeHero";
import TypeformEmbed from "@/components/home/TypeformEmbed";
import CueMasonry from "@/components/home/CueMasonry";
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
    <main className="bg-bg font-h1 text-bone">
      <Script src="https://embed.typeform.com/next/embed.js" strategy="afterInteractive" />
      <HomeHero />
      <TypeformEmbed />
      <CueMasonry />
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
