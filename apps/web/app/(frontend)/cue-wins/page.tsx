import type { Metadata } from "next";
import CueWinsPageClient from "@/components/cue-wins/CueWinsPageClient";

export const metadata: Metadata = {
  title: "Cue's Wins — Documented Live | Wall Street Academy",
  description:
    "Publicly posted profits, executed live — real entries, real exits, real money from inside the WSA Inner Circle.",
};

export default function CueWinsPage() {
  return <CueWinsPageClient />;
}
