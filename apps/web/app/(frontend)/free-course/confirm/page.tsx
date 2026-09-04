"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

import LessonCard, { type Lesson } from "@/components/free-course/confirm/LessonCard";
import { wsa } from "@/components/wsa/theme";
import {
  Eyebrow,
  WsaButton,
  WsaLogo,
  WsaShell,
  WsaWrap,
} from "@/components/wsa/ui";

const PLAYLIST_URL =
  "https://www.youtube.com/watch?v=yuTjmDL9GHw&list=PLboypRAkNT7YZIJZT2nfySZnvKLVjHUHK";

const LESSONS: Lesson[] = [
  {
    n: "01",
    vid: "yuTjmDL9GHw",
    dur: "7 min",
    title: "Give Me 7 Minutes — I'll Improve Your Trading By 176%",
    tag: "The Premise",
    stat: "+176%",
    href: "https://www.youtube.com/watch?v=yuTjmDL9GHw&list=PLboypRAkNT7YZIJZT2nfySZnvKLVjHUHK",
    featured: true,
  },
  {
    n: "02",
    vid: "xWM-EgM36WI",
    dur: "37 min",
    title: "$20K to $1.75M in 420 Days · The 100× Strategy",
    tag: "Case Study",
    stat: "$1.75M",
    href: "https://www.youtube.com/watch?v=xWM-EgM36WI&list=PLboypRAkNT7YZIJZT2nfySZnvKLVjHUHK",
    featured: false,
  },
  {
    n: "03",
    vid: "1kthmhMf-mw",
    dur: "17 min",
    title: "How To Win Without Luck, Talent, Or Being A Genius",
    tag: "Mindset",
    stat: "No talent",
    href: "https://www.youtube.com/watch?v=1kthmhMf-mw&list=PLboypRAkNT7YZIJZT2nfySZnvKLVjHUHK",
    featured: false,
  },
  {
    n: "04",
    vid: "gQco5FCZJvE",
    dur: "37 min",
    title: "Day In The Life · 7-Figure Trader Banks $302K",
    tag: "Case Study",
    stat: "$302K",
    href: "https://www.youtube.com/watch?v=gQco5FCZJvE&list=PLboypRAkNT7YZIJZT2nfySZnvKLVjHUHK",
    featured: false,
  },
  {
    n: "05",
    vid: "R_EG8vscTGw",
    dur: "46 min",
    title: "How To Swing Trade · The Blueprint That Made Me $1.2M",
    tag: "The Blueprint",
    stat: "$1.2M",
    href: "https://www.youtube.com/watch?v=R_EG8vscTGw&list=PLboypRAkNT7YZIJZT2nfySZnvKLVjHUHK",
    featured: false,
  },
];

export default function FreeCourseConfirm() {
  useEffect(() => {
    posthog.capture("free_course_confirm_viewed");
  }, []);

  return (
    <WsaShell>
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[var(--wsa-line,#2b333f)] bg-[rgba(0,0,0,.86)] backdrop-blur-md">
        <WsaWrap className="flex items-center justify-between py-[14px]">
          <WsaLogo href="/free-course" />
          <Eyebrow color={wsa.green2} className="text-[0.66rem]">
            · Access Granted ·
          </Eyebrow>
        </WsaWrap>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[var(--wsa-line,#2b333f)] py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-120px] -translate-x-1/2"
          style={{
            width: 900,
            height: 500,
            background:
              "radial-gradient(ellipse at center, rgba(37,99,235,0.06) 0%, transparent 70%)",
          }}
        />
        <WsaWrap className="relative max-w-[1180px]">
          <div className="mb-[26px] flex items-center gap-3">
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full"
              style={{ background: wsa.green2 }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                stroke="#000"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="13 4 6 11 3 8" />
              </svg>
            </div>
            <Eyebrow color={wsa.green2} className="text-[0.68rem]">
              · Registration Confirmed ·
            </Eyebrow>
          </div>

          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[1fr_auto] md:gap-12">
            <div>
              <h1
                style={{
                  fontFamily: "var(--wsa-font-h1,'Open Sans',sans-serif)",
                  color: "var(--wsa-white,#ffffff)",
                }}
                className="mb-6 text-[clamp(44px,5vw,64px)] font-extrabold leading-[0.98] tracking-[-0.02em]"
              >
                Your free <span style={{ color: wsa.yellow }}>training</span> is ready.
              </h1>
              <p
                style={{
                  fontFamily: "var(--wsa-font-body,'Open Sans',sans-serif)",
                  color: "var(--wsa-ash,#9aa3b2)",
                }}
                className="mb-7 max-w-[560px] text-[18px] leading-[1.6]"
              >
                5 free lessons — the exact rule-based framework behind every
                result on the page. Watch in order; each lesson builds on the
                last.
              </p>
              <div className="mb-8 inline-flex items-center gap-3 rounded-lg border border-[var(--wsa-line,#2b333f)] bg-[var(--wsa-panel,#0c1018)] px-4 py-2.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="var(--wsa-muted,#707070)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="14" height="10" rx="1" />
                  <polyline points="1,3 8,9 15,3" />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--wsa-font-body,'Open Sans',sans-serif)",
                    color: "var(--wsa-ash,#9aa3b2)",
                  }}
                  className="text-[12.5px]"
                >
                  You&apos;re registered. A confirmation is on its way to your email.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-5">
                <WsaButton
                  href={LESSONS[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!text-[0.9rem]"
                >
                  Watch Lesson 01 →
                </WsaButton>
                <a
                  href={PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
                    color: "var(--wsa-muted,#707070)",
                  }}
                  className="text-[11px] font-extrabold uppercase tracking-[0.16em] no-underline"
                >
                  View Full Playlist ↗
                </a>
              </div>
            </div>

            <div
              className="min-w-[260px] rounded-xl border border-[var(--wsa-line,#2b333f)] bg-[var(--wsa-panel,#0c1018)] px-[30px] py-[26px]"
              style={{ width: "100%" }}
            >
              <Eyebrow className="mb-[18px] text-[0.62rem]">
                · What&apos;s inside ·
              </Eyebrow>
              {[
                { label: "Total lessons", val: "5 unlocked" },
                { label: "Total runtime", val: "~2.5 hours" },
                { label: "Paid or trial", val: "Zero. Free." },
                { label: "More dropping", val: "Lessons 6–12" },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={`flex items-baseline justify-between gap-4 py-2.5 ${
                    i < arr.length - 1
                      ? "border-b border-[var(--wsa-line,#2b333f)]"
                      : ""
                  }`}
                >
                  <span
                    style={{
                      fontFamily: "var(--wsa-font-body,'Open Sans',sans-serif)",
                      color: "var(--wsa-muted,#707070)",
                    }}
                    className="text-[12.5px]"
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
                      color: "var(--wsa-white,#ffffff)",
                    }}
                    className="whitespace-nowrap text-[12px] font-extrabold"
                  >
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </WsaWrap>
      </section>

      {/* LESSON LIBRARY */}
      <section className="py-16 pb-[72px]">
        <WsaWrap className="max-w-[1180px]">
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <Eyebrow className="whitespace-nowrap text-[0.66rem]">
              · The WSA Protocol · Free Training ·
            </Eyebrow>
            <div className="h-px flex-1 bg-[var(--wsa-line,#2b333f)]" />
            <Eyebrow color={wsa.muted} className="whitespace-nowrap text-[0.6rem]">
              5 lessons · unlocked
            </Eyebrow>
          </div>

          {/* Featured lesson first — full width */}
          <div className="mb-3.5">
            <LessonCard lesson={LESSONS[0]} />
          </div>
          {/* 2x2 grid for the remaining four */}
          <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {LESSONS.slice(1).map((l) => (
              <LessonCard key={l.n} lesson={l} />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--wsa-line,#2b333f)] bg-[var(--wsa-panel,#0c1018)] px-[22px] py-[18px]">
            <div className="flex flex-wrap items-center gap-3.5">
              <Eyebrow color={wsa.muted} className="text-[0.62rem]">
                Lessons 06 – 12
              </Eyebrow>
              <div className="h-3.5 w-px bg-[var(--wsa-line,#2b333f)]" />
              <Eyebrow color={wsa.muted} className="text-[0.62rem]">
                · Dropping soon · Stay subscribed ·
              </Eyebrow>
            </div>
            <div
              style={{
                fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
                color: "var(--wsa-muted,#707070)",
                borderColor: "var(--wsa-line,#2b333f)",
              }}
              className="rounded-md border px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em]"
            >
              LOCKED
            </div>
          </div>
        </WsaWrap>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--wsa-line,#2b333f)] py-7">
        <WsaWrap className="flex flex-wrap items-center justify-between gap-5">
          <WsaLogo href="/" size={40} />
          <Eyebrow color={wsa.muted} className="text-[0.58rem]">
            © 2026 · Wall Street Academy · All Rights Reserved
          </Eyebrow>
        </WsaWrap>
      </footer>
    </WsaShell>
  );
}
