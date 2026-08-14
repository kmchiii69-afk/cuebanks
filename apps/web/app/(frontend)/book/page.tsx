"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import posthog from "posthog-js";
import CalendlyWidget from "@/components/page2/CalendlyWidget";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline flex-shrink-0 whitespace-nowrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/wsa/home/1.png"
        alt="Wall Street Academy"
        className="h-11 w-11 rounded-full object-cover block"
      />
      <span className="font-mono text-[13px] font-bold text-bone tracking-[0.18em] uppercase">
        Wall Street Academy
      </span>
    </Link>
  );
}

function BookInner() {
  const sp = useSearchParams();
  const firstName = (sp.get("first_name") || "").replace(/[^A-Za-z\s'-]/g, "").slice(0, 40);
  const lastName = (sp.get("last_name") || "").replace(/[^A-Za-z\s'-]/g, "").slice(0, 40);
  const email = (sp.get("email") || "").slice(0, 120);
  const phone = (sp.get("phone") || "").slice(0, 24);

  useEffect(() => {
    if (email) posthog.identify(email, { email, first_name: firstName, last_name: lastName, phone });
    posthog.capture("book_page_viewed", { email: email || undefined });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CalendlyWidget
      firstName={firstName}
      lastName={lastName}
      email={email}
    />
  );
}

function FirstNameGreeting() {
  const sp = useSearchParams();
  const fn = (sp.get("first_name") || "").replace(/[^A-Za-z\s'-]/g, "").slice(0, 24);
  if (!fn) return null;
  return (
    <>
      , <em className="text-acid not-italic">{fn}</em>
    </>
  );
}

const FALLBACK_DELAY_MS = 75_000;

function CallbackFallback() {
  const sp = useSearchParams();
  const email = (sp.get("email") || "").slice(0, 120);
  const firstName = (sp.get("first_name") || "").replace(/[^A-Za-z\s'-]/g, "").slice(0, 40);
  const lastName = (sp.get("last_name") || "").replace(/[^A-Za-z\s'-]/g, "").slice(0, 40);
  const phone = (sp.get("phone") || "").slice(0, 24);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), FALLBACK_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (!email || !visible) return null;

  async function request() {
    if (status === "sending" || status === "done") return;
    setStatus("sending");
    posthog.capture("book_fallback_requested");
    try {
      const res = await fetch("/api/callback-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-3.5 py-4.5 px-5.5 border border-acid bg-[rgba(37,99,235,0.06)] flex items-center gap-3.5">
        <span className="font-display text-[18px] font-bold text-acid leading-none">✓</span>
        <span className="font-body text-[15px] text-bone">
          Got it — the team will reach out to you shortly{phone ? ` at ${phone}` : ""}.
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ animation: "lbIn 400ms ease both" }}
      className="mt-3.5 py-4.5 px-5.5 border border-line bg-bg-1 flex items-center justify-between gap-4 flex-wrap"
    >
      <span className="font-body text-[15px] text-ash">
        Can&rsquo;t find a time that works?
      </span>
      <div className="flex items-center gap-3.5 flex-wrap">
        {status === "error" && (
          <span className="font-mono text-[10px] text-pink tracking-[0.1em]">
            Something went wrong — try again
          </span>
        )}
        <button
          onClick={request}
          disabled={status === "sending"}
          style={{ cursor: status === "sending" ? "wait" : "pointer" }}
          className="px-5 py-3 bg-transparent border-0 shadow-[0_0_0_1px_var(--line-2)] text-bone font-mono text-[11px] font-bold tracking-[0.16em] uppercase"
        >
          {status === "sending" ? "Sending..." : "Have the team call me →"}
        </button>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <div className="grid-bg min-h-screen bg-bg text-bone">
      {/* HEADER */}
      <header className="border-b border-line py-5 px-12 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-3.5">
          <span className="pulse w-1.5 h-1.5 bg-acid inline-block" />
          <div className="font-mono text-[10px] font-bold text-acid tracking-[0.22em] uppercase">
            · Qualified · Pick your time ·
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-[1180px] mx-auto py-10 px-12 pb-6 text-center relative">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(800px 360px at 50% 0%, rgba(37,99,235,0.10), transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="font-mono text-[11px] font-bold text-acid tracking-[0.22em] uppercase mb-3.5">
            · You&rsquo;re in · Final step ·
          </div>
          <h1 className="font-display font-semibold text-[48px] leading-[0.98] tracking-[-0.045em] text-bone m-0 mb-3.5">
            Pick a time
            <Suspense fallback={null}>
              <FirstNameGreeting />
            </Suspense>
            .
          </h1>
          <p className="font-body text-[17px] leading-[1.55] text-ash mx-auto max-w-[640px] font-normal">
            45 minutes with the team — we&rsquo;ll walk the system, see if it fits where you are, and answer anything on your mind. Grabbing a slot takes 30 seconds.
          </p>
        </div>
      </section>

      {/* CALENDLY EMBED */}
      <section className="max-w-[1180px] mx-auto pb-8 px-12">
        <div className="bg-bg-1 border border-line p-8 py-9 relative">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[360px] text-ash font-mono text-[11px] font-bold tracking-[0.22em] uppercase">
                <span className="pulse w-2 h-2 bg-acid mr-3 inline-block" />
                · Preparing calendar ·
              </div>
            }
          >
            <BookInner />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <CallbackFallback />
        </Suspense>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="max-w-[1180px] mx-auto px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {[
            { n: "01", t: "Tell us your situation", d: "5 minutes on where you are, what you've tried, and what you actually want." },
            { n: "02", t: "We walk the system", d: "How the Wall Street Academy framework actually works — phases, swing setups, weekly plan." },
            { n: "03", t: "Decide together", d: "If we're a fit you'll know on the call. If we're not, we'll point you somewhere useful." },
          ].map((s, i) => (
            <div key={i} className="bg-bg-1 border border-line border-t border-t-acid py-5 px-5.5">
              <div className="font-mono text-[10px] font-bold text-acid tracking-[0.22em] mb-2.5">
                · {s.n} ·
              </div>
              <div className="font-display text-[20px] font-semibold text-bone tracking-[-0.015em] mb-2">
                {s.t}
              </div>
              <div className="font-body text-[14px] leading-[1.55] text-ash font-normal">
                {s.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line py-8 px-12 flex justify-between items-center flex-wrap gap-4 font-mono text-[10px] font-bold text-muted tracking-[0.22em] uppercase">
        <span>© 2026 · iknkfx inc · All Rights Reserved</span>
        <span>· Not financial advice · Trading involves real risk of loss ·</span>
      </footer>
    </div>
  );
}
