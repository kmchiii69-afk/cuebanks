"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function QualifiedRouter() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const route = sp.get("route") || "";
    const firstName = sp.get("first_name") || "";
    const lastName = sp.get("last_name") || "";
    const email = sp.get("email") || "";
    const phone = sp.get("phone") || "";

    const contactParams = new URLSearchParams();
    if (firstName) contactParams.set("first_name", firstName);
    if (lastName) contactParams.set("last_name", lastName);
    if (email) contactParams.set("email", email);
    if (phone) contactParams.set("phone", phone);
    const contact = contactParams.toString();

    switch (route) {
      case "free_funnel":
        router.replace("/free-course");
        break;
      case "call_1on1": {
        const p = new URLSearchParams(contactParams);
        p.set("tier", "1on1");
        router.replace(`/book?${p.toString()}`);
        break;
      }
      case "manual_review": {
        const p = new URLSearchParams(contactParams);
        p.set("review", "1");
        router.replace(`/book?${p.toString()}`);
        break;
      }
      // call_group, call_group_stepdown, and legacy "book" all go to /book
      default:
        router.replace(contact ? `/book?${contact}` : "/book");
        break;
    }
  }, [sp, router]);

  return null;
}

export default function QualifiedPage() {
  return (
    <div className="grid-bg" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--bone)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: "0 48px", position: "relative" }}>
        <div style={{ position: "absolute", inset: -100, pointerEvents: "none", background: "radial-gradient(600px 360px at 50% 50%, rgba(249,255,60,0.10), transparent 60%)" }} />
        <div style={{ position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wsa/home/1.png" alt="Wall Street Academy" style={{ height: 64, width: 64, borderRadius: "50%", objectFit: "cover", display: "block", margin: "0 auto 28px" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <span className="pulse" style={{ width: 8, height: 8, background: "var(--acid)", display: "inline-block" }} />
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--acid)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
              · Application received ·
            </div>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 48, lineHeight: 0.98, letterSpacing: "-0.04em", color: "var(--bone)", margin: "0 0 16px" }}>
            Routing you now<em style={{ color: "var(--acid)" }}>...</em>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.55, color: "var(--ash)", margin: 0, fontWeight: 400 }}>
            Hang tight — taking you to the next step.
          </p>
        </div>
      </div>

      <Suspense fallback={null}>
        <QualifiedRouter />
      </Suspense>
    </div>
  );
}
