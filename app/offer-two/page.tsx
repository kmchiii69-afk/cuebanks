import type { Metadata } from "next";
import OfferTwoPage from "./OfferTwoPage";

export const metadata: Metadata = {
  title: "The WSA Program — Presentation | Wall Street Academy",
  description:
    "The Wall Street Academy pitch deck — symptom to system. Built to be walked through live on a strategy call.",
};

export default function OfferTwo() {
  return <OfferTwoPage />;
}
