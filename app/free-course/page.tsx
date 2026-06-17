import type { Metadata } from "next";
import FreeCourseFunnel from "./FreeCourseFunnel";
import * as freeCourse from "../_funnels/free-course";

export const metadata: Metadata = {
  title: "Free Training — The WSA Protocol | Wall Street Academy",
  description:
    "Unlock all five lessons of the WSA Protocol — the same mechanical, rule-based system behind every result on this page. Zero charge, instant access.",
};

export default function FreeCoursePage() {
  return (
    <FreeCourseFunnel
      data={{
        fonts: freeCourse.fonts,
        css: freeCourse.css,
        body: freeCourse.body,
        script: freeCourse.script,
      }}
    />
  );
}
