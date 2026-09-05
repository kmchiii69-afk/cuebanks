import type { Metadata } from "next";
import CuePage from "../../(frontend)/cue-funnel/page";

export const metadata: Metadata = {
  title: "Cue AI — Wall Street Academy",
};

export default function MemberCuePage() {
  return <CuePage homeHref="/portal" />;
}
