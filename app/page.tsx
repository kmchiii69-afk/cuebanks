import type { Metadata } from "next";
import RoadmapPage from "./roadmap/page";

export const metadata: Metadata = {
  title: "Wall Street Academy — Inner Circle Roadmap",
  description:
    "Every module, every drill, in the exact order that builds a profitable trader. 6 phases, 16 weeks.",
};

export default function HomePage() {
  return <RoadmapPage />;
}
