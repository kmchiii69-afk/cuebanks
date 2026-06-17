"use client";

import { useEffect, useSyncExternalStore } from "react";
import posthog from "posthog-js";
import { wsa } from "@/components/wsa/theme";
import { Button, Eyebrow, WsaLogo, WsaShell, Wrap } from "@/components/wsa/ui";

/* ─── data (unchanged) ─── */
const HYDRA_URL = "https://bit.ly/3Svauv4";
const BLOFIN_URL = "https://bit.ly/4ayHl8r";

/* broker brand accents */
const HYDRA = "#37ca37";
const BLOFIN = "#FF7A1A";

function Feat({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <span style={{ fontFamily: wsa.fontH2, fontSize: 16, fontWeight: 800, lineHeight: 1.3, minWidth: 14, color: accent }}>+</span>
      <span style={{ fontFamily: wsa.fontBody, fontSize: 15, lineHeight: 1.45, color: "#dfe4ec" }}>{children}</span>
    </div>
  );
}

function BrokerCard({
  accent, eyebrow, title, accentWord, desc, logo, features, chip, cta,
}: {
  accent: string;
  eyebrow: string;
  title: string;
  accentWord: string;
  desc: string;
  logo: { src: string; alt: string; height: number; tag: string };
  features: string[];
  chip: { label: string; line: string; box: string };
  cta: { label: string; href: string; broker: string; footnote: string };
}) {
  return (
    <div
      style={{
        position: "relative", background: wsa.panel, border: `1px solid ${wsa.line}`,
        borderTop: `3px solid ${accent}`, borderRadius: 14, padding: "34px 32px 30px",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(560px 280px at 50% 0%, ${accent}14, transparent 62%)` }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
        <Eyebrow color={accent} style={{ marginBottom: 18 }}>{eyebrow}</Eyebrow>
        <h2 style={{ fontFamily: wsa.fontH2, fontWeight: 800, fontSize: 34, lineHeight: 1.05, letterSpacing: "-0.01em", color: wsa.white, margin: "0 0 14px" }}>
          {title} <span style={{ color: accent }}>{accentWord}</span>
        </h2>
        <p style={{ fontFamily: wsa.fontBody, fontSize: 15.5, lineHeight: 1.55, color: wsa.ash, margin: "0 0 24px" }}>{desc}</p>

        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", border: `1px solid ${wsa.line}`, borderRadius: 10, background: "rgba(255,255,255,0.02)", marginBottom: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo.src} alt={logo.alt} style={{ height: logo.height, width: "auto", display: "block" }} />
          <span style={{ fontFamily: wsa.fontH2, fontSize: 9, fontWeight: 800, letterSpacing: "0.26em", textTransform: "uppercase", color: wsa.muted }}>{logo.tag}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
          {features.map((f, i) => <Feat key={i} accent={accent}>{f}</Feat>)}
        </div>

        <div style={{ border: `1px dashed ${accent}`, borderRadius: 10, background: `${accent}0d`, padding: "15px 18px", marginBottom: 22, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: wsa.fontH2, fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: wsa.muted, marginBottom: 6 }}>{chip.label}</div>
            <div style={{ fontFamily: wsa.fontBody, fontSize: 13, color: wsa.white, fontWeight: 600 }}>{chip.line}</div>
          </div>
          <div style={{ fontFamily: wsa.fontH2, fontSize: 18, fontWeight: 800, letterSpacing: "0.04em", color: accent, padding: "8px 14px", border: `1px solid ${accent}`, borderRadius: 8, background: "rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
            {chip.box}
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <Button
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            full
            onClick={() => posthog.capture("broker_offer_clicked", { broker: cta.broker })}
            style={{ background: accent, color: "#0b1400", boxShadow: `0 10px 34px ${accent}3d` }}
          >
            {cta.label}
          </Button>
          <div style={{ fontFamily: wsa.fontH2, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: wsa.muted, marginTop: 12, textAlign: "center" }}>{cta.footnote}</div>
        </div>
      </div>
    </div>
  );
}

const emptySubscribe = () => () => {};

export default function BrokerOffers() {
  // Host-aware in-funnel paths — unchanged from the original implementation.
  const onFreeHost = useSyncExternalStore(
    emptySubscribe,
    () => window.location.hostname.includes("free."),
    () => false,
  );
  const paths = onFreeHost
    ? { home: "/", confirm: "/confirm" }
    : { home: "/free-course", confirm: "/free-course/confirm" };

  useEffect(() => {
    posthog.capture("broker_offers_viewed");
  }, []);

  return (
    <WsaShell>
      <style>{`
        .bk-split { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: stretch; }
        .bk-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .bk-skip { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: center; }
        .bk-h1 { font-size: 56px; }
        @media (max-width: 920px) {
          .bk-split { grid-template-columns: 1fr; gap: 18px; }
          .bk-stats { grid-template-columns: 1fr; gap: 16px; }
          .bk-skip { grid-template-columns: 1fr; gap: 22px; }
          .bk-h1 { font-size: 34px; }
        }
      `}</style>

      {/* HEADER */}
      <header style={{ borderBottom: `1px solid ${wsa.line}`, position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,.86)", backdropFilter: "blur(8px)" }}>
        <Wrap style={{ paddingTop: 14, paddingBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <WsaLogo href={paths.home} />
          <Eyebrow color={wsa.ash} style={{ fontSize: ".66rem" }}>· Step 2 of 3 · Course access confirmed ·</Eyebrow>
        </Wrap>
      </header>

      {/* HERO */}
      <section style={{ position: "relative", padding: "56px 0 8px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(900px 520px at 50% -8%, rgba(24,139,246,0.12), transparent 62%)" }} />
        <Wrap style={{ position: "relative", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 16px", border: `1px solid ${wsa.green2}`, borderRadius: 999, background: `${wsa.green2}12`, marginBottom: 26 }}>
            <span style={{ color: wsa.green2, fontWeight: 800, lineHeight: 1 }}>✓</span>
            <Eyebrow color={wsa.green2} style={{ fontSize: ".66rem" }}>Lesson 01 is landing in your inbox now</Eyebrow>
          </div>

          <Eyebrow color={wsa.ash} style={{ marginBottom: 18 }}>· You&rsquo;re in · one quick thing before you start ·</Eyebrow>

          <h1 className="bk-h1" style={{ fontFamily: wsa.fontH1, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", color: wsa.white, margin: "0 auto 22px", maxWidth: 920 }}>
            You&rsquo;re in. Before lesson one —<br />
            <span style={{ color: wsa.yellow }}>set up where you&rsquo;ll actually trade.</span>
          </h1>

          <p style={{ fontFamily: wsa.fontBody, fontSize: 18, lineHeight: 1.6, color: wsa.ash, margin: "0 auto", maxWidth: 720 }}>
            The course teaches the system. But a system needs a platform to run on. These are the two I personally use and trust — one funds you with real capital so you risk none of your own, the other is where I place my own trades. Course members get an exclusive deal on both.
          </p>

          <div className="bk-stats" style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${wsa.line}`, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
            {[
              { v: "$200K", k: "· Funded · no challenge ·" },
              { v: "$5,000", k: "· Bonus · where Cue trades ·" },
              { v: "2 ways", k: "· Pick one · or both ·" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: wsa.fontH2, fontSize: 30, fontWeight: 800, color: wsa.yellow, letterSpacing: "-0.01em", lineHeight: 1 }}>{s.v}</div>
                <Eyebrow color={wsa.ash} style={{ fontSize: ".6rem", marginTop: 9 }}>{s.k}</Eyebrow>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* CHOOSE YOUR BROKER */}
      <section style={{ padding: "48px 0 0" }}>
        <Wrap style={{ textAlign: "center" }}>
          <div style={{ fontFamily: wsa.fontH2, fontWeight: 800, fontSize: 40, letterSpacing: "-0.01em", color: wsa.white, lineHeight: 1 }}>Choose your broker</div>
          <Eyebrow color={wsa.ash} style={{ marginTop: 14 }}>· Two paths · both vetted by Cue ·</Eyebrow>
        </Wrap>
      </section>

      {/* BROKER SPLIT */}
      <section style={{ padding: "26px 0 40px" }}>
        <Wrap>
          <div className="bk-split">
            <BrokerCard
              accent={HYDRA}
              eyebrow="· Path 01 · Trade funded ·"
              title="Get funded"
              accentWord="up to $200K."
              desc="No challenges. No phases. Instant funding from day one — for Futures, Crypto, and Forex. Trade real capital with none of your own on the line."
              logo={{ src: "/uploads/brokers/hydra-logo.png", alt: "Hydra Funding", height: 36, tag: "FUNDING" }}
              features={[
                "Instant funding — no eval phase",
                "Trade Futures, Crypto & Forex",
                "Up to 90% split · paid on demand",
                "Accounts from $5K to $200K",
              ]}
              chip={{ label: "· Course-member code ·", line: "20% OFF your first account, site-wide", box: "FOUS20" }}
              cta={{ label: "Get Funded at Hydra →", href: HYDRA_URL, broker: "hydra", footnote: "· Opens hydrafunding.io · affiliate offer ·" }}
            />
            <BrokerCard
              accent={BLOFIN}
              eyebrow="· Path 02 · Where Cue actually trades ·"
              title="Where I place"
              accentWord="my own trades."
              desc="Claim up to a $5,000 sign-up bonus at BloFin — the exchange I actually use. Trade crypto and tokenized TradFi like Nasdaq, NVDA, and Gold, all from one account."
              logo={{ src: "/uploads/brokers/blofin-logo.png", alt: "BloFin", height: 24, tag: "CRYPTO EXCHANGE" }}
              features={[
                "Up to $5,000 in new-user rewards",
                "Crypto + tokenized stocks & gold",
                "Spot, futures & copy trading",
                "Deep, pro-grade liquidity",
              ]}
              chip={{ label: "· New-user reward ·", line: "Sign-up bonus credited on deposit", box: "$5,000" }}
              cta={{ label: "Claim $5K at BloFin →", href: BLOFIN_URL, broker: "blofin", footnote: "· Opens blofin.com · affiliate offer ·" }}
            />
          </div>
        </Wrap>
      </section>

      {/* SKIP TO COURSE */}
      <section style={{ padding: "24px 0 80px" }}>
        <Wrap>
          <div className="bk-skip" style={{ border: `1px solid ${wsa.line}`, borderRadius: 14, background: wsa.panel, padding: "40px 44px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(560px 220px at 0% 50%, rgba(249,255,60,0.06), transparent 62%)" }} />
            <div style={{ position: "relative" }}>
              <Eyebrow style={{ marginBottom: 12 }}>· No pressure ·</Eyebrow>
              <div style={{ fontFamily: wsa.fontH2, fontSize: 28, fontWeight: 800, letterSpacing: "-0.01em", color: wsa.white, lineHeight: 1.15, marginBottom: 14, maxWidth: 660 }}>
                Thanks for the info — take me straight to the course.
              </div>
              <p style={{ fontFamily: wsa.fontBody, fontSize: 15, color: wsa.ash, margin: 0, maxWidth: 620 }}>
                You can always grab these offers later — they&rsquo;re waiting inside your member area. Lesson 01 is already in your inbox.
              </p>
            </div>
            <div style={{ position: "relative" }}>
              <Button href={paths.confirm} variant="ghost" full onClick={() => posthog.capture("broker_offers_skipped")}>
                Send me to the free course →
              </Button>
            </div>
          </div>
        </Wrap>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${wsa.line}`, padding: "30px 0 48px" }}>
        <Wrap style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <Eyebrow color={wsa.muted} style={{ fontSize: ".6rem" }}>· Wall Street Academy · Trade with structure ·</Eyebrow>
          <p style={{ fontFamily: wsa.fontAccent, fontSize: 12, lineHeight: 1.55, color: wsa.muted, margin: 0, maxWidth: 820 }}>
            Hydra Funding and BloFin are partners of Wall Street Academy; we may earn a commission if you sign up through these links. Nothing here is financial advice. Trading involves substantial risk — trade your own size, risk your own capital.
          </p>
        </Wrap>
      </footer>
    </WsaShell>
  );
}
