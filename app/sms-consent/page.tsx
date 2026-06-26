import type { Metadata } from "next";
import Link from "next/link";
import { wsa } from "@/components/wsa/theme";
import { Eyebrow, TopBar, WsaShell, Wrap } from "@/components/wsa/ui";
import SmsConsentForm from "./SmsConsentForm";

export const metadata: Metadata = {
  title: "SMS Terms & Opt-In — Wall Street Academy",
  description:
    "Wall Street Academy transactional SMS program: call confirmations, reminders, reschedules, and support only. Msg & data rates may apply. Reply STOP to end, HELP for help.",
};

// Transactional-only sample messages — all begin with the consistent sender name.
const SAMPLES = [
  "Wall Street Academy: Your strategy call is confirmed for Tue, Jun 24 at 10:30 AM ET. Reply STOP to end, HELP for help.",
  "Wall Street Academy: Reminder — your call is in 1 hour. Reply STOP to end, HELP for help.",
  "Wall Street Academy: Your call has been rescheduled to Thu, Jun 26 at 2:00 PM ET. Reply STOP to end, HELP for help.",
  "Wall Street Academy: We received your support request and will follow up shortly. Reply STOP to end, HELP for help.",
];

const FACTS = [
  { t: "Program", d: "Transactional messages only — booked-call confirmations, reminders, reschedules, and support replies. No marketing or promotional texts." },
  { t: "Message frequency", d: "Varies based on your activity (e.g., when you book or reschedule a call)." },
  { t: "Cost", d: "Message and data rates may apply, per your mobile carrier plan." },
  { t: "Opt out / help", d: "Reply STOP at any time to stop messages. Reply HELP for help." },
];

const PRIVACY = [
  "Mobile/SMS opt-in data and consent will not be shared with any third parties or affiliates for marketing or promotional purposes.",
  "SMS consent is not shared with third parties, except service providers used solely to deliver the messages.",
];

export default function SmsConsentPage() {
  return (
    <WsaShell>
      <style>{`
        @media (max-width: 880px) {
          .sms-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .sms-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <TopBar ctaHref="/" ctaLabel="Home" logoHref="/" />

      {/* HERO */}
      <section className="grid-bg" style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${wsa.line}` }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(900px 440px at 50% -10%, rgba(249,255,60,0.10), transparent 60%)" }} />
        <Wrap style={{ position: "relative", padding: "84px 22px 52px", textAlign: "center" }}>
          <Eyebrow style={{ marginBottom: 18, justifyContent: "center", display: "flex" }}>· SMS Terms &amp; Opt-In ·</Eyebrow>
          <h1 style={{ fontFamily: wsa.fontH1, fontWeight: 800, fontSize: "clamp(36px, 6vw, 64px)", lineHeight: 1.04, letterSpacing: "-0.02em", color: wsa.white, margin: "0 0 18px" }}>
            Wall Street Academy <span style={{ color: wsa.yellow }}>text messages.</span>
          </h1>
          <p style={{ fontFamily: wsa.fontBody, fontSize: 18, lineHeight: 1.6, color: wsa.ash, maxWidth: 680, margin: "0 auto" }}>
            We send <strong style={{ color: wsa.white }}>transactional text messages only</strong> — call confirmations, reminders, reschedules, and support. No marketing or promotional texts are sent through this program.
          </p>
        </Wrap>
      </section>

      {/* BODY */}
      <Wrap style={{ padding: "64px 22px 90px" }}>
        <div className="sms-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>

          {/* LEFT — program details */}
          <div>
            <Eyebrow style={{ marginBottom: 18 }}>· Program details ·</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 34 }}>
              {FACTS.map((f, i) => (
                <div key={i} style={{ background: wsa.panel, border: `1px solid ${wsa.line}`, borderLeft: `2px solid ${wsa.yellow}`, borderRadius: 10, padding: "16px 18px" }}>
                  <div style={{ fontFamily: wsa.fontH2, fontSize: 14, fontWeight: 800, color: wsa.white, marginBottom: 4 }}>{f.t}</div>
                  <div style={{ fontFamily: wsa.fontBody, fontSize: 14, lineHeight: 1.55, color: wsa.ash }}>{f.d}</div>
                </div>
              ))}
            </div>

            <Eyebrow style={{ marginBottom: 14 }}>· Example messages ·</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 34 }}>
              {SAMPLES.map((m, i) => (
                <div key={i} style={{ background: wsa.bg, border: `1px solid ${wsa.line}`, borderRadius: 12, padding: "13px 16px", fontFamily: wsa.fontBody, fontSize: 13.5, lineHeight: 1.5, color: wsa.white }}>
                  {m}
                </div>
              ))}
            </div>

            <div style={{ background: wsa.panel, border: `1px solid ${wsa.yellow}`, borderRadius: 12, padding: "20px 22px" }}>
              <Eyebrow style={{ marginBottom: 12 }}>· Your privacy ·</Eyebrow>
              <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                {PRIVACY.map((p, i) => (
                  <li key={i} style={{ fontFamily: wsa.fontBody, fontSize: 13.5, lineHeight: 1.55, color: wsa.ash }}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT — opt-in form */}
          <div style={{ background: wsa.panel, border: `1px solid ${wsa.line}`, borderTop: `3px solid ${wsa.yellow}`, borderRadius: 16, padding: "34px 32px", boxShadow: "0 0 60px rgba(249,255,60,0.06)" }}>
            <div style={{ fontFamily: wsa.fontH2, fontSize: 22, fontWeight: 800, color: wsa.white, marginBottom: 6 }}>Sign up &amp; opt in</div>
            <p style={{ fontFamily: wsa.fontBody, fontSize: 14.5, lineHeight: 1.5, color: wsa.ash, margin: "0 0 22px" }}>
              Enter your details. Checking the SMS box is optional.
            </p>
            <SmsConsentForm />
          </div>
        </div>
      </Wrap>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${wsa.line}`, padding: "30px 0" }}>
        <Wrap style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <Eyebrow color={wsa.muted} style={{ fontSize: 9 }}>© 2026 · Wall Street Academy</Eyebrow>
          <nav style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[["/terms", "Terms"], ["/privacy", "Privacy"], ["/contact", "Contact"]].map(([href, label]) => (
              <Link key={href} href={href} style={{ fontFamily: wsa.fontH2, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: wsa.muted, textDecoration: "none" }}>{label}</Link>
            ))}
          </nav>
        </Wrap>
      </footer>
    </WsaShell>
  );
}
