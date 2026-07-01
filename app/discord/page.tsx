"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DiscordPage() {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data?.type === 'form-submit') {
          router.push('/post-application');
        }
      } catch { /* ignore non-JSON messages */ }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [router]);

  return (
    <div
      className="grid-bg"
      style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--bone)" }}
    >
      {/* HEADER */}
      <header
        style={{
          borderBottom: "1px solid var(--line)",
          padding: "20px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/wsa/home/1.png"
          alt="Wall Street Academy"
          style={{ height: 64, width: 64, borderRadius: "50%", objectFit: "cover" }}
        />
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            color: "var(--acid)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          · Wall Street Academy · Inner Circle ·
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "56px 48px 48px",
          textAlign: "left",
        }}
      >
        <p
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 18,
            lineHeight: 1.7,
            color: "var(--ash)",
            margin: "0 0 20px",
            fontWeight: 400,
          }}
        >
          You&rsquo;re already in the community. You&rsquo;ve seen what I&rsquo;m building.
        </p>
        <p
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 18,
            lineHeight: 1.7,
            color: "var(--ash)",
            margin: "0 0 20px",
            fontWeight: 400,
          }}
        >
          I want every single person from Wall Street Academy to win. That&rsquo;s not just something I say.{" "}
          <span style={{ color: "var(--bone)", fontWeight: 500 }}>
            That&rsquo;s why I&rsquo;m opening these spots to the community first, with full access to everything we&rsquo;ve built.
          </span>
        </p>
        <p
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 18,
            lineHeight: 1.7,
            color: "var(--bone)",
            margin: 0,
            fontWeight: 500,
          }}
        >
          Fill this out and let me know where you&rsquo;re at. I&rsquo;ll tell you exactly what makes sense for you.
        </p>
      </section>

      {/* TYPEFORM EMBED */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>
        <div
          style={{
            border: "1px solid var(--line)",
            borderTop: "2px solid var(--acid)",
            overflow: "hidden",
            background: "var(--bg-1)",
          }}
        >
          <div data-tf-live="01KWCF1M21WH4PSANSSHFK3MQQ" style={{ minHeight: 560 }} />
          <Script src="//embed.typeform.com/next/embed.js" strategy="afterInteractive" />
        </div>
      </section>

    </div>
  );
}
