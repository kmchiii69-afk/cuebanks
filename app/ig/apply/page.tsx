"use client";

import { Suspense } from "react";
import Link from "next/link";
import QualifyForm from "@/components/page2/QualifyForm";

function Logo() {
  return (
    <Link href="/ig" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/wsa/home/1.png" alt="Wall Street Academy" style={{ height: 40, width: 40, borderRadius: "50%", objectFit: "cover", display: "block" }} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--bone)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        Wall Street Academy
      </span>
    </Link>
  );
}

export default function IGApplyPage() {
  return (
    <div className="grid-bg" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--bone)" }}>
      {/* HEADER */}
      <header style={{ borderBottom: "1px solid var(--line)", padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="pulse" style={{ width: 6, height: 6, background: "var(--acid)", display: "inline-block" }} />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            · Inner Circle · Application ·
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 48px 24px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(800px 360px at 50% 0%, rgba(249,255,60,0.09), transparent 60%)" }} />
        <div style={{ position: "relative" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--bone)", margin: "0 0 16px" }}>
            Let&rsquo;s see if you&rsquo;re a fit.
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.6, color: "var(--ash)", margin: "0 auto", maxWidth: 520, fontWeight: 400 }}>
            A few quick questions. <strong style={{ color: "var(--bone)" }}>Be straight with me</strong> — the more honest you are, the better I can tell you if this is right for you or not.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "32px 48px 100px" }}>
        <div style={{ background: "var(--bg-1)", border: "1px solid var(--line)", padding: "40px 44px", position: "relative" }}>
          <Suspense fallback={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 320, color: "var(--ash)", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" }}>
              <span className="pulse" style={{ width: 8, height: 8, background: "var(--acid)", marginRight: 12, display: "inline-block" }} />
              · Loading ·
            </div>
          }>
            <QualifyForm source="ig" />
          </Suspense>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        <span>© 2026 · iknkfx inc · All Rights Reserved</span>
        <span>· Not financial advice · Trading involves real risk of loss ·</span>
      </footer>
    </div>
  );
}
