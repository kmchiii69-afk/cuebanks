import type { Metadata } from "next";
import FunnelRenderer from "@/components/funnel/FunnelRenderer";
import { rewriteLinks } from "@/components/funnel/rewriteLinks";
import * as cueWins from "../_funnels/cue-wins";

export const metadata: Metadata = {
  title: "Cue's Wins — Documented Live | Wall Street Academy",
  description:
    "Publicly posted profits, executed live — real entries, real exits, real money from inside the WSA Inner Circle.",
};

// "Apply For Your Seat" → booking; "Back To Home" → home. In-page #gallery stays.
const body = rewriteLinks(cueWins.body, [
  ['href="index.html#apply"', 'href="/book"'],
  ['href="#apply"', 'href="/book"'],
  ['href="index.html"', 'href="/"'],
]);

export default function CueWinsPage() {
  return <FunnelRenderer data={{ fonts: cueWins.fonts, css: cueWins.css, body, script: cueWins.script }} />;
}
