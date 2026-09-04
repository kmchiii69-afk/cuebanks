import type { Metadata } from "next";
import FreeCoursePageClient from "@/components/free-course/FreeCoursePageClient";

export const metadata: Metadata = {
  title: "Free Training — The WSA Protocol | Wall Street Academy",
  description:
    "Unlock all five lessons of the WSA Protocol — the same mechanical, rule-based system behind every result on this page. Zero charge, instant access.",
};

export default function FreeCoursePage() {
  return <FreeCoursePageClient />;
}
