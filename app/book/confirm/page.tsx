import type { Metadata } from "next";
import FunnelRenderer from "@/components/funnel/FunnelRenderer";
import { rewriteLinks } from "@/components/funnel/rewriteLinks";
import * as thankyou from "../../_funnels/thankyou";

export const metadata: Metadata = {
  title: "You're In — Wall Street Academy",
  description: "Your strategy call is booked. Watch the masterclass while you wait.",
};

// "Back To Home" → home. Masterclass play/watch CTAs stay as in-page anchors.
const body = rewriteLinks(thankyou.body, [['href="index.html"', 'href="/"']]);

export default function BookConfirmPage() {
  return <FunnelRenderer data={{ fonts: thankyou.fonts, css: thankyou.css, body, script: thankyou.script }} />;
}
