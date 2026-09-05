"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Globe from "@/components/ui/globe";
import { CNC, CUECASTS } from "@/lib/roadmap-data";
import { getPhase } from "@/lib/phases";

import DocumentModal from "@/components/roadmap/modals/DocumentModal";
import ChecklistModal from "@/components/roadmap/modals/ChecklistModal";
import ImageGalleryModal from "@/components/roadmap/modals/ImageGalleryModal";
import VideoModal from "@/components/roadmap/modals/VideoModal";
import CalendlyWidget from "@/components/roadmap/CalendlyWidget";
import ChatPanel from "@/components/roadmap/ChatPanel";
import PhaseList from "@/components/roadmap/PhaseList";
import Hero from "@/components/roadmap/Hero";
import Included from "@/components/roadmap/Included";
import ProgressDrawer from "@/components/roadmap/ProgressDrawer";
import { ROADMAP_PHASES } from "@/components/roadmap/data";
import type {
  ChecklistDoc,
  DocContent,
  ImageGalleryProps,
  Member,
  ModalVideo,
} from "@/components/roadmap/types";
import { isStaffRole } from "@/lib/roles";

// Globe parallax position per visible section — snaps to the closest.
const GLOBE_POS = [
  { left: 78, top: 30, scale: 2.8, opacity: 0.32 }, // hero
  { left: 20, top: 55, scale: 2.4, opacity: 0.30 }, // prepare
  { left: 88, top: 52, scale: 2.0, opacity: 0.28 }, // set
  { left: 16, top: 50, scale: 2.2, opacity: 0.26 }, // execute
  { left: 76, top: 22, scale: 1.8, opacity: 0.25 }, // phase 01
  { left: 72, top: 44, scale: 2.6, opacity: 0.30 }, // phase 02
  { left: 15, top: 42, scale: 2.0, opacity: 0.26 }, // phase 03
  { left: 82, top: 28, scale: 3.0, opacity: 0.28 }, // phase 04
  { left: 60, top: 65, scale: 2.2, opacity: 0.26 }, // bonus
];

export default function RoadmapPage() {
  const router = useRouter();
  const [activeVideo, setActiveVideo] = useState<ModalVideo | null>(null);
  const [activeDoc, setActiveDoc] = useState<DocContent | null>(null);
  const [activeChecklist, setActiveChecklist] = useState<ChecklistDoc | null>(null);
  const [activeImages, setActiveImages] = useState<ImageGalleryProps | null>(null);
  const [globeTransform, setGlobeTransform] = useState(
    `translate3d(78vw, 30vh, 0) translate3d(-50%, -50%, 0) scale3d(2.8, 2.8, 1)`,
  );
  const [globeOpacity, setGlobeOpacity] = useState(0.32);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLElement>(null);

  const [member, setMember] = useState<Member | null>(null);
  const [completingPhase, setCompletingPhase] = useState<number | null>(null);
  const [completeError, setCompleteError] = useState<Record<number, string>>({});
  const [homeworkChecked, setHomeworkChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) {
          router.replace("/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.plan === "low_ticket" && !isStaffRole(data.role)) {
          router.replace("/portal");
          return;
        }
        setMember(data);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  async function markPhaseComplete(phaseId: number) {
    if (!member || completingPhase) return;
    const def = getPhase(phaseId);
    if (def?.hasHomework && !member.phase_progress?.[String(phaseId)]?.status) return;
    setCompletingPhase(phaseId);
    setCompleteError((e) => ({ ...e, [phaseId]: "" }));
    try {
      const res = await fetch("/api/portal/phase-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phaseId,
          homeworkConfirmed: def?.hasHomework ? true : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCompleteError((e) => ({ ...e, [phaseId]: data.error || "Something went wrong" }));
        return;
      }
      setMember((m) =>
        m
          ? {
              ...m,
              phase_progress: data.phase_progress ?? m.phase_progress,
              current_phase: data.current_phase ?? m.current_phase,
            }
          : m,
      );
    } finally {
      setCompletingPhase(null);
    }
  }

  const totalVideos = ROADMAP_PHASES.reduce(
    (acc, p) => acc + p.items.reduce((a, i) => a + (i.videos?.length ?? 0), 0),
    0,
  );

  useEffect(() => {
    function handleScroll() {
      const refs: (Element | null)[] = [
        heroRef.current,
        ...Array.from({ length: ROADMAP_PHASES.length }, (_, i) => phaseRefs.current[i] ?? null),
      ];
      const midpoint = window.innerHeight / 2;
      let closest = 0;
      let minDist = Infinity;
      refs.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - midpoint);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      const p = GLOBE_POS[closest] ?? GLOBE_POS[0];
      setGlobeTransform(
        `translate3d(${p.left}vw, ${p.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${p.scale}, ${p.scale}, 1)`,
      );
      setGlobeOpacity(p.opacity);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function jumpTo(i: number) {
    phaseRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "var(--bone)", position: "relative" }}>
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 100% 70% at 65% 28%, rgba(6,10,20,1) 0%, rgba(0,0,0,1) 65%)",
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: globeOpacity,
          willChange: "transform, opacity",
          transform: globeTransform,
          transition: "transform 1400ms cubic-bezier(0.23, 1, 0.32, 1), opacity 700ms ease",
        }}
      >
        <Globe size={250} />
      </div>

      {activeVideo ? <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} /> : null}
      {activeDoc ? <DocumentModal doc={activeDoc} onClose={() => setActiveDoc(null)} /> : null}
      {activeChecklist ? (
        <ChecklistModal doc={activeChecklist} onClose={() => setActiveChecklist(null)} />
      ) : null}
      {activeImages ? (
        <ImageGalleryModal
          images={activeImages.images}
          title={activeImages.title}
          onClose={() => setActiveImages(null)}
        />
      ) : null}
      <CalendlyWidget />
      <ChatPanel />

      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "18px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(20px)",
          zIndex: 100,
        }}
      >
        <Link
          href="/portal"
          style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wsa/home/1.png"
            alt="Wall Street Academy"
            style={{ height: 44, width: 44, borderRadius: "50%", objectFit: "cover" }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--bone)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Wall Street Academy
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {ROADMAP_PHASES.map((p, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.3)",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.14em",
                padding: "4px 8px",
                cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
                borderRadius: 3,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--acid)";
                e.currentTarget.style.borderColor = "rgba(37,99,235,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              {p.num}
            </button>
          ))}
          <ProgressDrawer member={member} />
        </div>
      </header>

      <Hero
        heroRef={heroRef}
        stats={[
          { n: "8", label: "Phases" },
          { n: "16", label: "Weeks" },
          { n: String(totalVideos) + "+", label: "Videos" },
          { n: `${CNC.length + CUECASTS.length}`, label: "Live Sessions" },
        ]}
      />

      <PhaseList
        activeVideo={activeVideo}
        setActiveVideo={setActiveVideo}
        setActiveDoc={setActiveDoc}
        setActiveChecklist={setActiveChecklist}
        setActiveImages={setActiveImages}
        member={member}
        homeworkChecked={homeworkChecked}
        setHomeworkChecked={setHomeworkChecked}
        completingPhase={completingPhase}
        completeError={completeError}
        markPhaseComplete={markPhaseComplete}
        phaseRefs={phaseRefs}
      />

      <Included totalVideos={totalVideos} />

      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          fontWeight: 700,
          color: "rgba(255,255,255,0.18)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span>© 2026 · iknkfx inc · All Rights Reserved</span>
        <span>· Not financial advice · Trading involves real risk of loss ·</span>
      </footer>
    </div>
  );
}
