import type { Metadata } from "next";
import Link from "next/link";
import { wsa } from "@/components/wsa/theme";
import { Button, Eyebrow, TopBar, WsaShell, Wrap } from "@/components/wsa/ui";
import ContactForm, { SUPPORT_EMAIL } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — Wall Street Academy",
  description: "Get in touch with the Wall Street Academy team. Questions about the program, billing, or your account — we're here to help.",
};

const REASONS = [
  { t: "Program & application", d: "Questions about Core, Inner Circle, the roadmap, or your application." },
  { t: "Billing & refunds", d: "Payments, invoices, and anything covered by our refund policy." },
  { t: "Account & access", d: "Trouble logging in or accessing your curriculum, calls, or community." },
];

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund", label: "Refund" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export default function ContactPage() {
  return (
    <WsaShell>
      <style>{`
        @media (max-width: 880px) {
          .ct-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .ct-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <TopBar ctaHref="/qualify" ctaLabel="Apply" logoHref="/" />

      {/* HERO */}
      <section className="grid-bg" style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${wsa.line}` }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(900px 460px at 50% -10%, rgba(37,99,235,0.10), transparent 60%)" }} />
        <Wrap style={{ position: "relative", padding: "84px 22px 56px", textAlign: "center" }}>
          <Eyebrow style={{ marginBottom: 18, justifyContent: "center", display: "flex" }}>· Contact ·</Eyebrow>
          <h1 style={{ fontFamily: wsa.fontH1, fontWeight: 800, fontSize: "clamp(40px, 7vw, 72px)", lineHeight: 1.02, letterSpacing: "-0.02em", color: wsa.white, margin: "0 0 18px" }}>
            Let&rsquo;s <span style={{ color: wsa.yellow }}>talk.</span>
          </h1>
          <p style={{ fontFamily: wsa.fontBody, fontSize: 18, lineHeight: 1.6, color: wsa.ash, maxWidth: 620, margin: "0 auto" }}>
            Whether you&rsquo;re weighing the program or you&rsquo;re already inside, the Wall Street Academy team is here to help. We typically reply within <strong style={{ color: wsa.white }}>1 business day</strong>.
          </p>
        </Wrap>
      </section>

      {/* BODY */}
      <Wrap style={{ padding: "72px 22px 96px" }}>
        <div className="ct-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 56, alignItems: "start" }}>

          {/* LEFT — info */}
          <div>
            <Eyebrow style={{ marginBottom: 16 }}>· Reach us ·</Eyebrow>
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ display: "inline-block", fontFamily: wsa.fontH2, fontSize: 22, fontWeight: 800, color: wsa.white, textDecoration: "none", marginBottom: 8 }}>
              {SUPPORT_EMAIL}
            </a>
            <p style={{ fontFamily: wsa.fontBody, fontSize: 15, lineHeight: 1.6, color: wsa.ash, margin: "0 0 34px" }}>
              Email us directly, or use the form — both land in the same inbox.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 34 }}>
              {REASONS.map((r, i) => (
                <div key={i} style={{ background: wsa.panel, border: `1px solid ${wsa.line}`, borderLeft: `2px solid ${wsa.yellow}`, borderRadius: 10, padding: "16px 18px" }}>
                  <div style={{ fontFamily: wsa.fontH2, fontSize: 15, fontWeight: 800, color: wsa.white, marginBottom: 4 }}>{r.t}</div>
                  <div style={{ fontFamily: wsa.fontBody, fontSize: 14, lineHeight: 1.5, color: wsa.ash }}>{r.d}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${wsa.line}`, paddingTop: 22 }}>
              <Eyebrow color={wsa.muted} style={{ fontSize: 9, marginBottom: 12 }}>· Looking for a seat? ·</Eyebrow>
              <Button href="/qualify">Apply For Your Seat →</Button>
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={{ background: wsa.panel, border: `1px solid ${wsa.line}`, borderTop: `3px solid ${wsa.yellow}`, borderRadius: 16, padding: "34px 32px", boxShadow: "0 0 60px rgba(37,99,235,0.06)" }}>
            <div style={{ fontFamily: wsa.fontH2, fontSize: 22, fontWeight: 800, color: wsa.white, marginBottom: 6 }}>Send us a message</div>
            <p style={{ fontFamily: wsa.fontBody, fontSize: 14.5, lineHeight: 1.5, color: wsa.ash, margin: "0 0 22px" }}>
              Tell us what you need and we&rsquo;ll get back to you.
            </p>
            <ContactForm />
          </div>
        </div>
      </Wrap>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${wsa.line}`, padding: "30px 0" }}>
        <Wrap style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <Eyebrow color={wsa.muted} style={{ fontSize: 9 }}>© 2026 · Wall Street Academy</Eyebrow>
          <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {LEGAL.map((l) => (
              <Link key={l.href} href={l.href} style={{ fontFamily: wsa.fontH2, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: wsa.muted, textDecoration: "none" }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </Wrap>
      </footer>
    </WsaShell>
  );
}
