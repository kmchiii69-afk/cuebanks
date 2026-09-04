"use client";

import { useState } from "react";

export type Lesson = {
  n: string;
  vid: string;
  dur: string;
  title: string;
  tag: string;
  stat: string;
  href: string;
  featured: boolean;
};

/* LessonCard — cover thumbnail + meta. The first lesson (`featured: true`)
   uses the acid-yellow brand highlight while the others use the muted
   panel/border treatment. Hovering scales the thumb and the play glyph. */
export default function LessonCard({ lesson }: { lesson: Lesson }) {
  const [hovered, setHovered] = useState(false);
  const thumb = `https://img.youtube.com/vi/${lesson.vid}/maxresdefault.jpg`;

  return (
    <a
      href={lesson.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderColor: lesson.featured
          ? "var(--wsa-yellow,#f9ff3c)"
          : hovered
            ? "#3a4456"
            : "var(--wsa-line,#2b333f)",
        boxShadow: lesson.featured ? "0 0 60px rgba(37,99,235,0.12)" : "none",
      }}
      className="relative block overflow-hidden rounded-xl border transition-colors duration-200 no-underline"
    >
      <div className="relative aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={lesson.title}
          style={{
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
          className="block h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.08)_100%)]" />

        {/* Center play glyph — scales up on hover */}
        <div
          style={{
            width: lesson.featured ? 64 : 50,
            height: lesson.featured ? 64 : 50,
            background: lesson.featured ? "var(--wsa-yellow,#f9ff3c)" : "rgba(0,0,0,0.55)",
            borderColor: lesson.featured ? "var(--wsa-yellow,#f9ff3c)" : "rgba(37,99,235,0.5)",
            opacity: hovered ? 1 : 0.8,
            transform: `translate(-50%,-50%) scale(${hovered ? 1.12 : 1})`,
          }}
          className="absolute left-1/2 top-1/2 flex items-center justify-center rounded-full border backdrop-blur-md transition-[transform,opacity] duration-200 ease-out"
        >
          <svg
            width={lesson.featured ? 20 : 15}
            height={lesson.featured ? 20 : 15}
            viewBox="0 0 20 20"
          >
            <polygon
              points="5,3 17,10 5,17"
              fill={lesson.featured ? "#000" : "var(--wsa-yellow,#f9ff3c)"}
            />
          </svg>
        </div>

        {/* Stat (top-left) + duration (bottom-right) */}
        <div
          style={{
            fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
            color: "var(--wsa-yellow,#f9ff3c)",
            background: "rgba(0,0,0,0.82)",
          }}
          className="absolute left-3 top-3 rounded-md border border-[rgba(37,99,235,0.25)] px-2.5 py-1 text-[11px] font-extrabold tracking-[0.06em]"
        >
          {lesson.stat}
        </div>
        <div
          style={{
            fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
            color: lesson.featured ? "#000" : "var(--wsa-white,#ffffff)",
            background: lesson.featured ? "var(--wsa-yellow,#f9ff3c)" : "rgba(0,0,0,0.82)",
          }}
          className="absolute bottom-3 right-3 rounded-md px-2 py-1 text-[10px] font-extrabold tracking-[0.05em]"
        >
          {lesson.dur}
        </div>

        {lesson.featured ? (
          <div
            style={{
              fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
              color: "#000",
              background: "var(--wsa-yellow,#f9ff3c)",
            }}
            className="absolute right-3 top-3 rounded-md px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em]"
          >
            START HERE
          </div>
        ) : null}
      </div>
      <div
        style={{
          background: lesson.featured ? "rgba(37,99,235,0.04)" : "var(--wsa-panel,#0c1018)",
          borderTopColor: lesson.featured ? "rgba(37,99,235,0.18)" : "var(--wsa-line,#2b333f)",
        }}
        className={[
          "border-t",
          lesson.featured ? "px-[22px] py-[18px]" : "px-[17px] py-[15px]",
        ].join(" ")}
      >
        <div
          style={{
            fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
            color: lesson.featured ? "var(--wsa-yellow,#f9ff3c)" : "var(--wsa-muted,#707070)",
          }}
          className={[
            "mb-0 flex items-center gap-2.5 text-[9px] font-extrabold uppercase tracking-[0.22em]",
            lesson.featured ? "mb-2.5" : "mb-2",
          ].join(" ")}
        >
          <span>LESSON {lesson.n}</span>
          <span
            style={{
              width: 12,
              height: 1,
              background: lesson.featured ? "var(--wsa-yellow,#f9ff3c)" : "var(--wsa-line,#2b333f)",
              display: "inline-block",
            }}
          />
          <span>{lesson.tag}</span>
        </div>
        <div
          style={{
            fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
            color: "var(--wsa-white,#ffffff)",
          }}
          className={`font-extrabold leading-[1.2] tracking-[-0.01em] ${lesson.featured ? "text-[22px]" : "text-[16px]"}`}
        >
          {lesson.title}
        </div>
      </div>
    </a>
  );
}
