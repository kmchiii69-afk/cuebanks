"use client";

import { getPhase, isPhaseComplete, isPhaseUnlocked } from "@/lib/phases";
import type { ChecklistDoc, DocContent, ImageGalleryProps, Member, ModalVideo } from "./types";
import type { Video } from "@/lib/roadmap-data";
import { ROADMAP_PHASES } from "./data";
import ModuleItem from "./ModuleItem";

// Vertical timeline of phase cards. Each card shows the phase title/tagline,
// a numbered list of items (each opens a doc/video/checklist/gallery),
// the checkpoint after the items, and a "Mark Complete" control per card.
type Handlers = {
  activeVideo: ModalVideo | null;
  setActiveVideo: (v: ModalVideo | null) => void;
  setActiveDoc: (d: DocContent) => void;
  setActiveChecklist: (c: ChecklistDoc) => void;
  setActiveImages: (i: ImageGalleryProps) => void;
  member: Member | null;
  homeworkChecked: Record<number, boolean>;
  setHomeworkChecked: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  completingPhase: number | null;
  completeError: Record<number, string>;
  markPhaseComplete: (id: number) => void;
  phaseRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
};

function fmt(ts: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PhaseList(props: Handlers) {
  function playVideo(v: Video) {
    if (v.id) props.setActiveVideo({ id: v.id, hash: v.hash, label: v.label });
  }

  return (
    <section
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "0 48px 100px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 28,
            top: 0,
            bottom: 0,
            width: 1,
            background:
              "linear-gradient(to bottom, rgba(37,99,235,0.5) 0%, rgba(37,99,235,0.04) 100%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {ROADMAP_PHASES.map((phase, i) => {
            const videoCount = phase.items.reduce(
              (a, item) => a + (item.videos?.length ?? 0),
              0,
            );
            const phaseId = i + 1;
            const def = getPhase(phaseId);
            const unlocked = isPhaseUnlocked(props.member?.phase_progress, phaseId);
            const complete = isPhaseComplete(props.member?.phase_progress, phaseId);
            const completion = props.member?.phase_progress?.[String(phaseId)];
            const prevTitle = i > 0 ? ROADMAP_PHASES[i - 1].title : null;

            return (
              <div
                key={i}
                ref={(el) => {
                  props.phaseRefs.current[i] = el;
                }}
                style={{
                  display: "flex",
                  gap: 32,
                  position: "relative",
                  scrollMarginTop: 80,
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    flexShrink: 0,
                    width: 56,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: 32,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#000",
                      border: `1.5px solid ${
                        complete ? "rgba(34,197,94,0.6)" : "rgba(37,99,235,0.6)"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow:
                        "0 0 20px rgba(37,99,235,0.12), 0 0 60px rgba(37,99,235,0.05)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        fontWeight: 700,
                        color: complete ? "#22c55e" : "var(--acid)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {complete ? "✓" : unlocked ? phase.num : "🔒"}
                    </span>
                  </div>
                </div>

                {/* Card */}
                <div
                  style={{
                    flex: 1,
                    background: "rgba(12,16,24,0.7)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderTop: `1px solid ${
                      complete ? "rgba(34,197,94,0.3)" : "rgba(37,99,235,0.3)"
                    }`,
                    overflow: "hidden",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 0 0 0 transparent, 0 8px 40px rgba(0,0,0,0.5)",
                    opacity: unlocked ? 1 : 0.55,
                  }}
                >
                  {/* Card header */}
                  <div style={{ padding: "36px 40px 24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 18,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.35)",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 4,
                          padding: "5px 12px",
                        }}
                      >
                        {phase.duration}
                      </div>
                      {videoCount > 0 ? (
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "var(--acid)",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            background: "rgba(37,99,235,0.07)",
                            border: "1px solid rgba(37,99,235,0.2)",
                            borderRadius: 4,
                            padding: "5px 12px",
                          }}
                        >
                          ▶ {videoCount} videos
                        </div>
                      ) : null}
                    </div>
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "clamp(26px, 3vw, 34px)",
                        letterSpacing: "-0.03em",
                        color: "var(--bone)",
                        margin: "0 0 14px",
                      }}
                    >
                      {phase.title}
                    </h2>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 400,
                        fontSize: 16,
                        lineHeight: 1.75,
                        color: "rgba(255,255,255,0.48)",
                        margin: 0,
                        maxWidth: 620,
                      }}
                    >
                      {phase.tagline}
                    </p>
                  </div>

                  {/* Items */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "8px 40px" }}>
                    {phase.items.map((item, j) => (
                      <ModuleItem
                        key={j}
                        item={item}
                        index={j}
                        isLast={j === phase.items.length - 1}
                        onPlay={playVideo}
                        onOpenDoc={props.setActiveDoc}
                        onOpenChecklist={props.setActiveChecklist}
                        onOpenImages={(images, title) => props.setActiveImages({ images, title })}
                      />
                    ))}
                  </div>

                  {/* Checkpoint */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(37,99,235,0.03)",
                      padding: "20px 40px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "rgba(37,99,235,0.45)",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        flexShrink: 0,
                        paddingTop: 3,
                        whiteSpace: "nowrap",
                      }}
                    >
                      · After ·
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 400,
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "rgba(37,99,235,0.65)",
                      }}
                    >
                      {phase.checkpoint}
                    </div>
                  </div>

                  {/* Mark as Complete */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "20px 40px" }}>
                    {!unlocked ? (
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.35)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        🔒 Locked — complete {prevTitle} first
                      </div>
                    ) : complete ? (
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#22c55e",
                          letterSpacing: "0.04em",
                        }}
                      >
                        ✓ Completed{" "}
                        {completion ? fmt(new Date(completion.completedAt).getTime()) : ""}
                        {completion?.completedBy === "admin" ? (
                          <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
                            {" "}
                            · Marked by coach
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {def?.hasHomework ? (
                          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={!!props.homeworkChecked[phaseId]}
                              onChange={(e) =>
                                props.setHomeworkChecked((h) => ({
                                  ...h,
                                  [phaseId]: e.target.checked,
                                }))
                              }
                              style={{ marginTop: 3, accentColor: "#2563eb" }}
                            />
                            <span
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 13,
                                color: "rgba(255,255,255,0.6)",
                                lineHeight: 1.5,
                              }}
                            >
                              I&apos;ve submitted my homework for this phase in my private Discord
                              channel.
                            </span>
                          </label>
                        ) : null}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <button
                            onClick={() => props.markPhaseComplete(phaseId)}
                            disabled={
                              props.completingPhase === phaseId ||
                              (def?.hasHomework && !props.homeworkChecked[phaseId])
                            }
                            style={{
                              alignSelf: "flex-start",
                              background: "rgba(37,99,235,0.12)",
                              border: "1px solid rgba(37,99,235,0.4)",
                              borderRadius: 7,
                              padding: "10px 20px",
                              fontFamily: "var(--font-mono)",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "var(--acid)",
                              cursor:
                                def?.hasHomework && !props.homeworkChecked[phaseId]
                                  ? "not-allowed"
                                  : "pointer",
                              opacity:
                                def?.hasHomework && !props.homeworkChecked[phaseId] ? 0.4 : 1,
                              transition: "opacity 0.15s",
                            }}
                          >
                            {props.completingPhase === phaseId
                              ? "Marking..."
                              : `Mark ${phase.title} Complete`}
                          </button>
                          {props.completeError[phaseId] ? (
                            <span
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: 12,
                                color: "#ef4444",
                              }}
                            >
                              {props.completeError[phaseId]}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
