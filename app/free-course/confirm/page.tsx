"use client";

import { useState, useEffect } from "react";
import posthog from "posthog-js";
import { wsa } from "@/components/wsa/theme";
import { Button, Eyebrow, WsaLogo, WsaShell } from "@/components/wsa/ui";

/* ─── data (video links + playlist unchanged) ─── */
const PLAYLIST_URL =
  "https://www.youtube.com/watch?v=yuTjmDL9GHw&list=PLboypRAkNT7YZIJZT2nfySZnvKLVjHUHK";

const LESSONS = [
  { n: "01", vid: "yuTjmDL9GHw", dur: "7 min", title: "Give Me 7 Minutes — I'll Improve Your Trading By 176%", tag: "The Premise", stat: "+176%", href: "https://www.youtube.com/watch?v=yuTjmDL9GHw&list=PLboypRAkNT7YZIJZT2nfySZnvKLVjHUHK", featured: true },
  { n: "02", vid: "xWM-EgM36WI", dur: "37 min", title: "$20K to $1.75M in 420 Days · The 100× Strategy", tag: "Case Study", stat: "$1.75M", href: "https://www.youtube.com/watch?v=xWM-EgM36WI&list=PLboypRAkNT7YZIJZT2nfySZnvKLVjHUHK", featured: false },
  { n: "03", vid: "1kthmhMf-mw", dur: "17 min", title: "How To Win Without Luck, Talent, Or Being A Genius", tag: "Mindset", stat: "No talent", href: "https://www.youtube.com/watch?v=1kthmhMf-mw&list=PLboypRAkNT7YZIJZT2nfySZnvKLVjHUHK", featured: false },
  { n: "04", vid: "gQco5FCZJvE", dur: "37 min", title: "Day In The Life · 7-Figure Trader Banks $302K", tag: "Case Study", stat: "$302K", href: "https://www.youtube.com/watch?v=gQco5FCZJvE&list=PLboypRAkNT7YZIJZT2nfySZnvKLVjHUHK", featured: false },
  { n: "05", vid: "R_EG8vscTGw", dur: "46 min", title: "How To Swing Trade · The Blueprint That Made Me $1.2M", tag: "The Blueprint", stat: "$1.2M", href: "https://www.youtube.com/watch?v=R_EG8vscTGw&list=PLboypRAkNT7YZIJZT2nfySZnvKLVjHUHK", featured: false },
] as const;

function LessonCard({ lesson }: { lesson: typeof LESSONS[number] }) {
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
        display: "block", position: "relative", overflow: "hidden", borderRadius: 12,
        border: lesson.featured ? `1px solid ${wsa.yellow}` : `1px solid ${hovered ? "#3a4456" : wsa.line}`,
        textDecoration: "none", transition: "border-color 200ms ease",
        boxShadow: lesson.featured ? "0 0 60px rgba(249,255,60,0.12)" : "none",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16/9" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb} alt={lesson.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 500ms cubic-bezier(0.2,0.8,0.2,1)", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.08) 100%)" }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: `translate(-50%, -50%) scale(${hovered ? 1.12 : 1})`, transition: "transform 240ms ease, opacity 240ms ease",
          opacity: hovered ? 1 : 0.8, width: lesson.featured ? 64 : 50, height: lesson.featured ? 64 : 50, borderRadius: "50%",
          background: lesson.featured ? wsa.yellow : "rgba(0,0,0,0.55)", border: `1px solid ${lesson.featured ? wsa.yellow : "rgba(249,255,60,0.5)"}`,
          display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)",
        }}>
          <svg width={lesson.featured ? 20 : 15} height={lesson.featured ? 20 : 15} viewBox="0 0 20 20"><polygon points="5,3 17,10 5,17" fill={lesson.featured ? "#000" : wsa.yellow} /></svg>
        </div>
        <div style={{ position: "absolute", top: 12, left: 12, fontFamily: wsa.fontH2, fontSize: 11, fontWeight: 800, color: wsa.yellow, background: "rgba(0,0,0,0.82)", padding: "4px 10px", letterSpacing: "0.06em", borderRadius: 6, border: "1px solid rgba(249,255,60,0.25)" }}>{lesson.stat}</div>
        <div style={{ position: "absolute", bottom: 12, right: 12, fontFamily: wsa.fontH2, fontSize: 10, fontWeight: 800, color: lesson.featured ? "#000" : wsa.white, background: lesson.featured ? wsa.yellow : "rgba(0,0,0,0.82)", padding: "4px 9px", letterSpacing: "0.05em", borderRadius: 6 }}>{lesson.dur}</div>
        {lesson.featured && (
          <div style={{ position: "absolute", top: 12, right: 12, fontFamily: wsa.fontH2, fontSize: 9, fontWeight: 800, color: "#000", background: wsa.yellow, padding: "4px 10px", letterSpacing: "0.18em", textTransform: "uppercase", borderRadius: 6 }}>START HERE</div>
        )}
      </div>
      <div style={{ padding: lesson.featured ? "18px 22px 20px" : "15px 17px 17px", background: lesson.featured ? "rgba(249,255,60,0.04)" : wsa.panel, borderTop: `1px solid ${lesson.featured ? "rgba(249,255,60,0.18)" : wsa.line}` }}>
        <div style={{ fontFamily: wsa.fontH2, fontSize: 9, fontWeight: 800, color: lesson.featured ? wsa.yellow : wsa.muted, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: lesson.featured ? 10 : 8, display: "flex", alignItems: "center", gap: 10 }}>
          <span>LESSON {lesson.n}</span>
          <span style={{ width: 12, height: 1, background: lesson.featured ? wsa.yellow : wsa.line, display: "inline-block" }} />
          <span>{lesson.tag}</span>
        </div>
        <div style={{ fontFamily: wsa.fontH2, fontSize: lesson.featured ? 22 : 16, fontWeight: 800, color: wsa.white, letterSpacing: "-0.01em", lineHeight: 1.2 }}>{lesson.title}</div>
      </div>
    </a>
  );
}

export default function FreeCourseConfirm() {
  useEffect(() => {
    posthog.capture("free_course_confirm_viewed");
  }, []);

  return (
    <WsaShell>
      <style>{`
        .cf-wrap { max-width: 1180px; margin: 0 auto; padding: 0 22px; }
        .cf-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .cf-hero { display: grid; grid-template-columns: 1fr auto; gap: 48px; align-items: start; }
        .cf-h1 { font-size: 64px; }
        @media (max-width: 860px) {
          .cf-hero { grid-template-columns: 1fr; gap: 28px; }
          .cf-stats { width: 100%; }
        }
        @media (max-width: 720px) {
          .cf-grid { grid-template-columns: 1fr; }
          .cf-h1 { font-size: 44px; }
        }
      `}</style>

      {/* HEADER */}
      <header style={{ borderBottom: `1px solid ${wsa.line}`, position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,.86)", backdropFilter: "blur(8px)" }}>
        <div className="cf-wrap" style={{ paddingTop: 14, paddingBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <WsaLogo href="/free-course" />
          <Eyebrow color={wsa.green2} style={{ fontSize: ".66rem" }}>· Access Granted ·</Eyebrow>
        </div>
      </header>

      {/* HERO */}
      <section style={{ padding: "64px 0 56px", borderBottom: `1px solid ${wsa.line}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 900, height: 500, background: "radial-gradient(ellipse at center, rgba(249,255,60,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="cf-wrap" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: wsa.green2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 4 6 11 3 8" /></svg>
            </div>
            <Eyebrow color={wsa.green2} style={{ fontSize: ".68rem" }}>· Registration Confirmed ·</Eyebrow>
          </div>

          <div className="cf-hero">
            <div>
              <h1 className="cf-h1" style={{ fontFamily: wsa.fontH1, fontWeight: 800, lineHeight: 0.98, letterSpacing: "-0.02em", color: wsa.white, margin: "0 0 24px" }}>
                Your free <span style={{ color: wsa.yellow }}>training</span> is ready.
              </h1>
              <p style={{ fontFamily: wsa.fontBody, fontSize: 18, lineHeight: 1.6, color: wsa.ash, margin: "0 0 28px", maxWidth: 560 }}>
                5 free lessons — the exact rule-based framework behind every result on the page. Watch in order; each lesson builds on the last.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 8, background: wsa.panel, border: `1px solid ${wsa.line}`, marginBottom: 32 }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={wsa.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="14" height="10" rx="1" /><polyline points="1,3 8,9 15,3" /></svg>
                <span style={{ fontFamily: wsa.fontBody, fontSize: 12.5, color: wsa.ash }}>You&apos;re registered. A confirmation is on its way to your email.</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <Button href={LESSONS[0].href} target="_blank" rel="noopener noreferrer" style={{ fontSize: ".9rem" }}>Watch Lesson 01 →</Button>
                <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: wsa.fontH2, fontSize: 11, fontWeight: 800, color: wsa.muted, letterSpacing: "0.16em", textDecoration: "none", textTransform: "uppercase" }}>View Full Playlist ↗</a>
              </div>
            </div>

            <div className="cf-stats" style={{ background: wsa.panel, border: `1px solid ${wsa.line}`, borderRadius: 12, padding: "26px 30px", minWidth: 260 }}>
              <Eyebrow style={{ fontSize: ".62rem", marginBottom: 18 }}>· What&apos;s inside ·</Eyebrow>
              {[
                { label: "Total lessons", val: "5 unlocked" },
                { label: "Total runtime", val: "~2.5 hours" },
                { label: "Paid or trial", val: "Zero. Free." },
                { label: "More dropping", val: "Lessons 6–12" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${wsa.line}` : "none", gap: 16 }}>
                  <span style={{ fontFamily: wsa.fontBody, fontSize: 12.5, color: wsa.muted }}>{row.label}</span>
                  <span style={{ fontFamily: wsa.fontH2, fontSize: 12, fontWeight: 800, color: wsa.white, whiteSpace: "nowrap" }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LESSON LIBRARY */}
      <section style={{ padding: "64px 0 72px" }}>
        <div className="cf-wrap">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <Eyebrow style={{ fontSize: ".66rem", whiteSpace: "nowrap" }}>· The WSA Protocol · Free Training ·</Eyebrow>
            <div style={{ flex: 1, height: 1, background: wsa.line }} />
            <Eyebrow color={wsa.muted} style={{ fontSize: ".6rem", whiteSpace: "nowrap" }}>5 lessons · unlocked</Eyebrow>
          </div>

          <div style={{ marginBottom: 14 }}>
            <LessonCard lesson={LESSONS[0]} />
          </div>
          <div className="cf-grid" style={{ marginBottom: 14 }}>
            {LESSONS.slice(1).map((l) => <LessonCard key={l.n} lesson={l} />)}
          </div>

          <div style={{ padding: "18px 22px", border: `1px solid ${wsa.line}`, borderRadius: 12, background: wsa.panel, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <Eyebrow color={wsa.muted} style={{ fontSize: ".62rem" }}>Lessons 06 – 12</Eyebrow>
              <div style={{ width: 1, height: 14, background: wsa.line }} />
              <Eyebrow color={wsa.muted} style={{ fontSize: ".62rem" }}>· Dropping soon · Stay subscribed ·</Eyebrow>
            </div>
            <div style={{ fontFamily: wsa.fontH2, fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: wsa.muted, textTransform: "uppercase", padding: "5px 12px", border: `1px solid ${wsa.line}`, borderRadius: 6 }}>LOCKED</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${wsa.line}`, padding: "28px 0" }}>
        <div className="cf-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <WsaLogo href="/" size={40} />
          <Eyebrow color={wsa.muted} style={{ fontSize: ".58rem" }}>© 2026 · Wall Street Academy · All Rights Reserved</Eyebrow>
        </div>
      </footer>
    </WsaShell>
  );
}
