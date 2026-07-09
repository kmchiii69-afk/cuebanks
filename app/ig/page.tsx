"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IGPage() {
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://embed.typeform.com/next/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

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
          · Inner Circle · Now Open ·
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
            I spent 3 months rebuilding this from scratch. New system. New calls. New everything.
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
            I&rsquo;m not running another trading program. I&rsquo;m trying to change what forex actually looks like. The standard, the people, the results.
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
            I want to work with killers. Go through this and find out if you&rsquo;re one of them.
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
          <div data-tf-live="01KWAVJAM69YPMV554NVRT3Z58" style={{ minHeight: 560 }} />
        </div>
      </section>

    </div>
  );
}
