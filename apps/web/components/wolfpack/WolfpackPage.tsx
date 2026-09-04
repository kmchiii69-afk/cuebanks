"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

import { DownsellBar, WolfStickyBar, WolfTicker } from "./Bar";
import Hero from "./Sections/Hero";
import Receipts from "./Sections/Receipts";
import MatrixBand from "./Sections/MatrixBand";
import KryptonCaseGrid from "./Sections/KryptonCaseGrid";
import Results from "./Sections/Results";
import TopCallStory from "./Sections/TopCallStory";
import BankedTrades from "./Sections/BankedTrades";
import Lifestyle from "./Sections/Lifestyle";
import RickRossSpotlight from "./Sections/RickRossSpotlight";
import ProofGrid from "./Sections/ProofGrid";
import FuruVs from "./Sections/FuruVs";
import VideoTestimonialsWall from "./Sections/VideoTestimonialsWall";
import ReviewsWall from "./Sections/ReviewsWall";
import Package from "./Sections/Package";
import PriceBlock from "./Sections/PriceBlock";
import FAQ from "./Sections/FAQ";
import FinalCTA from "./Sections/FinalCTA";
import Footer from "./Sections/Footer";
import { HERO_BADGES } from "./content";

// Both `/wolfpack` and `/wolfpack-global` render this same page. The two
// pages only differ on price ($997 vs $297) and the Whop checkout URL
// (regional PPP variant). Those flow through as props so the visuals stay
// in lockstep — copy edits happen in one place.
export type WolfpackVariant = {
  /** Join URL (regular Whop checkout). */
  joinHref: string;
  /** "Browse all plans" link in the price block — usually same as joinHref. */
  altHref: string;
  /** "$997" or "$297" — rendered next to the sticky bar, hero CTA, final CTA, package bar. */
  priceLabel: string;
  /** Optional override for the small label next to the price in the price block ("ONE PAYMENT" by default). */
  smallLabel?: string;
  /** Posthog event name — both pages fire the same `wolfpack_page_viewed`. */
  captureEvent?: string;
};

export default function WolfpackPage(variant: WolfpackVariant) {
  const { joinHref, altHref, priceLabel, smallLabel, captureEvent = "wolfpack_page_viewed" } = variant;

  useEffect(() => {
    posthog.capture(captureEvent);
  }, [captureEvent]);

  return (
    <>
      <WolfStickyBar joinHref={joinHref} priceLabel={priceLabel} />
      <DownsellBar />
      <Hero priceLabel={priceLabel} joinHref={joinHref} badges={HERO_BADGES} />
      <WolfTicker />
      <Receipts />
      <MatrixBand />
      <KryptonCaseGrid />
      <Results joinHref={joinHref} priceLabel={priceLabel} />
      <TopCallStory />
      <BankedTrades />
      <Lifestyle />
      <RickRossSpotlight />
      <ProofGrid joinHref={joinHref} />
      <FuruVs />
      <VideoTestimonialsWall />
      <ReviewsWall joinHref={joinHref} />
      <Package joinHref={joinHref} priceLabel={priceLabel} />
      <PriceBlock joinHref={joinHref} altHref={altHref} priceLabel={priceLabel} smallLabel={smallLabel} />
      <FAQ />
      <FinalCTA joinHref={joinHref} priceLabel={priceLabel} />
      <Footer />
    </>
  );
}
