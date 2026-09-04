"use client";

import posthog from "posthog-js";
import { useEffect, useSyncExternalStore } from "react";

import BrokerCard from "@/components/free-course/broker/BrokerCard";
import { wsa } from "@/components/wsa/theme";
import {
  Eyebrow,
  WsaButton,
  WsaLogo,
  WsaShell,
  WsaWrap,
} from "@/components/wsa/ui";

// Broker-page data — affiliate links & brand accents. Lives outside the
// component so it isn't reconstructed on every re-render.
const HYDRA_URL = "https://bit.ly/3Svauv4";
const BLOFIN_URL = "https://bit.ly/4ayHl8B";

const HYDRA = "#37ca37";
const BLOFIN = "#FF7A1A";

export default function BrokerOffers() {
  // Host-aware in-funnel paths: free.* subdomain → legacy paths,
  // direct → /free-course/broker. Empty subscribe handler keeps
  // server-render and client-render output identical.
  const emptySubscribe = () => () => {};
  const onFreeHost = useSyncExternalStore(
    emptySubscribe,
    () => window.location.hostname.includes("free."),
    () => false
  );
  const paths = onFreeHost
    ? { home: "/", confirm: "/confirm" }
    : { home: "/free-course", confirm: "/free-course/confirm" };

  useEffect(() => {
    posthog.capture("broker_offers_viewed");
  }, []);

  return (
    <WsaShell>
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[var(--wsa-line,#2b333f)] bg-[rgba(0,0,0,.86)] backdrop-blur-md">
        <WsaWrap className="flex flex-wrap items-center justify-between gap-5 py-[14px]">
          <WsaLogo href={paths.home} />
          <Eyebrow color={wsa.ash} className="text-[0.66rem]">
            · Step 2 of 3 · Course access confirmed ·
          </Eyebrow>
        </WsaWrap>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 520px at 50% -8%, rgba(24,139,246,0.12), transparent 62%)",
          }}
        />
        <WsaWrap className="relative text-center">
          <div
            className="mb-[26px] inline-flex items-center gap-2.5 rounded-full border px-4 py-[9px]"
            style={{
              borderColor: wsa.green2,
              background: `${wsa.green2}12`,
            }}
          >
            <span
              style={{ color: wsa.green2 }}
              className="font-extrabold leading-none"
            >
              ✓
            </span>
            <Eyebrow color={wsa.green2} className="text-[0.66rem]">
              Lesson 01 is landing in your inbox now
            </Eyebrow>
          </div>

          <Eyebrow color={wsa.ash} className="mb-[18px]">
            · You&apos;re in · one quick thing before you start ·
          </Eyebrow>

          <h1
            style={{
              fontFamily: "var(--wsa-font-h1,'Open Sans',sans-serif)",
              color: "var(--wsa-white,#ffffff)",
            }}
            className="mx-auto mb-[22px] max-w-[920px] text-[clamp(34px,5.6vw,56px)] font-extrabold leading-[1.05] tracking-[-0.02em]"
          >
            You&apos;re in. Before lesson one —
            <br />
            <span style={{ color: wsa.yellow }}>
              set up where you&apos;ll actually trade.
            </span>
          </h1>

          <p
            style={{
              fontFamily: "var(--wsa-font-body,'Open Sans',sans-serif)",
              color: "var(--wsa-ash,#9aa3b2)",
            }}
            className="mx-auto max-w-[720px] text-[18px] leading-[1.6]"
          >
            The course teaches the system. But a system needs a platform to
            run on. These are the two I personally use and trust — one funds
            you with real capital so you risk none of your own, the other is
            where I place my own trades. Course members get an exclusive deal
            on both.
          </p>

          {/* Three-up "trust strip" */}
          <div className="mx-auto mt-10 grid max-w-[760px] grid-cols-1 gap-6 border-t border-[var(--wsa-line,#2b333f)] pt-7 sm:grid-cols-3">
            {[
              { v: "$200K", k: "· Funded · no challenge ·" },
              { v: "$5,000", k: "· Bonus · where Cue trades ·" },
              { v: "2 ways", k: "· Pick one · or both ·" },
            ].map((s) => (
              <div key={s.k}>
                <div
                  style={{
                    fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
                    color: "var(--wsa-yellow,#f9ff3c)",
                  }}
                  className="text-[30px] font-extrabold leading-none tracking-[-0.01em]"
                >
                  {s.v}
                </div>
                <Eyebrow color={wsa.ash} className="mt-2 text-[0.6rem]">
                  {s.k}
                </Eyebrow>
              </div>
            ))}
          </div>
        </WsaWrap>
      </section>

      {/* CHOOSE YOUR BROKER */}
      <section className="pt-12">
        <WsaWrap className="text-center">
          <div
            style={{
              fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
              color: "var(--wsa-white,#ffffff)",
            }}
            className="text-[40px] font-extrabold leading-none tracking-[-0.01em]"
          >
            Choose your broker
          </div>
          <Eyebrow color={wsa.ash} className="mt-3.5">
            · Two paths · both vetted by Cue ·
          </Eyebrow>
        </WsaWrap>
      </section>

      {/* BROKER SPLIT */}
      <section className="py-[26px] pb-10">
        <WsaWrap>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
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
              onCtaClick={() => posthog.capture("broker_offer_clicked", { broker: "hydra" })}
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
              onCtaClick={() => posthog.capture("broker_offer_clicked", { broker: "blofin" })}
            />
          </div>
        </WsaWrap>
      </section>

      {/* SKIP TO COURSE */}
      <section className="py-6 pb-20">
        <WsaWrap>
          <div
            className="relative grid grid-cols-1 items-center gap-8 overflow-hidden rounded-[14px] border border-[var(--wsa-line,#2b333f)] px-11 py-10 md:grid-cols-[1fr_auto] md:gap-8"
            style={{
              background: "var(--wsa-panel, #0c1018)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(560px 220px at 0% 50%, rgba(37,99,235,0.06), transparent 62%)",
              }}
            />
            <div className="relative">
              <Eyebrow className="mb-3">· No pressure ·</Eyebrow>
              <div
                style={{
                  fontFamily: "var(--wsa-font-h2,'Montserrat',sans-serif)",
                  color: "var(--wsa-white,#ffffff)",
                }}
                className="mb-3.5 max-w-[660px] text-[28px] font-extrabold leading-[1.15] tracking-[-0.01em]"
              >
                Thanks for the info — take me straight to the course.
              </div>
              <p
                style={{
                  fontFamily: "var(--wsa-font-body,'Open Sans',sans-serif)",
                  color: "var(--wsa-ash,#9aa3b2)",
                }}
                className="m-0 max-w-[620px] text-[15px]"
              >
                You can always grab these offers later — they&apos;re waiting
                inside your member area. Lesson 01 is already in your inbox.
              </p>
            </div>
            <div className="relative">
              <WsaButton
                href={paths.confirm}
                variant="ghost"
                full
                onClick={() => posthog.capture("broker_offers_skipped")}
              >
                Send me to the free course →
              </WsaButton>
            </div>
          </div>
        </WsaWrap>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--wsa-line,#2b333f)] py-7 pb-12">
        <WsaWrap className="flex flex-wrap items-center justify-between gap-6">
          <Eyebrow color={wsa.muted} className="text-[0.6rem]">
            · Wall Street Academy · Trade with structure ·
          </Eyebrow>
          <p
            style={{
              fontFamily: "var(--wsa-font-accent,'Times New Roman',Times,serif)",
              color: "var(--wsa-muted,#707070)",
            }}
            className="m-0 max-w-[820px] text-[12px] leading-[1.55]"
          >
            Hydra Funding and BloFin are partners of Wall Street Academy; we
            may earn a commission if you sign up through these links.
            Nothing here is financial advice. Trading involves substantial
            risk — trade your own size, risk your own capital.
          </p>
        </WsaWrap>
      </footer>
    </WsaShell>
  );
}
