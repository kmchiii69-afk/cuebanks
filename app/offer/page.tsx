import type { Metadata } from "next";
import OfferPage from "./OfferPage";

export const metadata: Metadata = {
  title: "The WSA Program — Apply | Wall Street Academy",
  description:
    "Stop trading alone. Follow a proven roadmap with coaching, accountability, and the WSA Protocol — the framework Cue Banks refined over 13+ years.",
};

export default function Offer() {
  return <OfferPage />;
}
