"use client";

import type { CSSProperties } from "react";
import { M, S, D } from "./fonts";
import { TOUR_STEPS } from "./types";

type Props = {
  onboardStep: 0 | 1 | 2 | 3 | 4 | 5;
  setOnboardStep: (s: 0 | 1 | 2 | 3 | 4 | 5) => void;
  goalText: string;
  setGoalText: (s: string) => void;
  savingGoal: boolean;
  submitGoal: () => void;
  tourStep: number;
  setTourStep: (s: number) => void;
  finishOnboarding: () => void;
};

/** 6-step onboarding overlay: orientation video → engagement contract →
 *  Discord join → book CSM call → set goal → portal walkthrough. Renders
 *  nothing when onboardStep === undefined-equivalent from the parent. */
export default function OnboardingOverlay({
  onboardStep,
  setOnboardStep,
  goalText,
  setGoalText,
  savingGoal,
  submitGoal,
  tourStep,
  setTourStep,
  finishOnboarding,
}: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) return;
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 560,
          background: "rgba(8,10,16,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderTop: "2px solid #2563eb",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              ...M,
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(37,99,235,0.6)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Onboarding · Step {onboardStep + 1} of 6
          </div>
          {onboardStep >= 5 ? (
            <button
              onClick={finishOnboarding}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.3)",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
                padding: "0 4px",
              }}
            >
              ✕
            </button>
          ) : null}
        </div>

        <div style={{ padding: "32px 32px", flex: 1 }}>
          {onboardStep === 0 ? (
            <Step0 onContinue={() => setOnboardStep(1)} />
          ) : onboardStep === 1 ? (
            <Step1 onContinue={() => setOnboardStep(2)} />
          ) : onboardStep === 2 ? (
            <Step2 onContinue={() => setOnboardStep(3)} />
          ) : onboardStep === 3 ? (
            <Step3 onContinue={() => setOnboardStep(4)} />
          ) : onboardStep === 4 ? (
            <Step4
              goalText={goalText}
              setGoalText={setGoalText}
              savingGoal={savingGoal}
              submitGoal={submitGoal}
            />
          ) : (
            <Step5 tourStep={tourStep} setTourStep={setTourStep} finishOnboarding={finishOnboarding} />
          )}
        </div>

        <div
          style={{
            padding: "16px 28px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background:
                  s === onboardStep
                    ? "#2563eb"
                    : s < onboardStep
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(255,255,255,0.08)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const buttonStyle: CSSProperties = {
  width: "100%",
  background: "rgba(37,99,235,0.12)",
  border: "1px solid rgba(37,99,235,0.35)",
  borderRadius: 7,
  padding: "12px 18px",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#2563eb",
  cursor: "pointer",
};

function Step0({ onContinue }: { onContinue: () => void }) {
  return (
    <div>
      <h2
        style={{
          ...D,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "#fff",
          margin: "0 0 14px",
          lineHeight: 1.1,
        }}
      >
        Watch the orientation.
      </h2>
      <p
        style={{
          ...S,
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7,
          margin: "0 0 20px",
        }}
      >
        Five minutes. Watch the program orientation before going further.
      </p>
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 8,
          paddingTop: "56.25%",
          position: "relative",
          marginBottom: 20,
        }}
      >
        <iframe
          src="https://player.vimeo.com/video/1205968513?color=f9ff3c&title=0&byline=0&portrait=0"
          allow="autoplay; fullscreen; picture-in-picture"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          title="Orientation"
        />
      </div>
      <button onClick={onContinue} style={buttonStyle}>
        I&apos;ve watched it — Continue
      </button>
    </div>
  );
}

function Step1({ onContinue }: { onContinue: () => void }) {
  return (
    <div>
      <h2
        style={{
          ...D,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "#fff",
          margin: "0 0 14px",
          lineHeight: 1.1,
        }}
      >
        Sign the engagement contract.
      </h2>
      <p
        style={{
          ...S,
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7,
          margin: "0 0 18px",
        }}
      >
        Acknowledge the program terms before continuing.
      </p>
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 8,
          padding: "18px 20px",
          maxHeight: 220,
          overflowY: "auto",
          ...S,
          fontSize: 12.5,
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.45)",
          marginBottom: 16,
        }}
      >
        I understand that trading involves substantial risk. I commit to completing the
        16-week curriculum in order. I will not skip phases or jump ahead. I understand
        results are not guaranteed. I commit to attending my onboarding call with my Client
        Success Manager before full access is granted. I will follow the WSA system as
        taught.
      </div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          padding: "12px 16px",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 7,
          background: "rgba(255,255,255,0.02)",
          marginBottom: 14,
        }}
      >
        <input type="checkbox" style={{ accentColor: "#2563eb" }} />
        <span
          style={{
            ...M,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          I acknowledge and accept the terms above
        </span>
      </label>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onContinue} style={{ ...buttonStyle, flex: 1 }}>
          Acknowledge & Continue
        </button>
      </div>
    </div>
  );
}

function Step2({ onContinue }: { onContinue: () => void }) {
  return (
    <div>
      <h2
        style={{
          ...D,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "#fff",
          margin: "0 0 14px",
          lineHeight: 1.1,
        }}
      >
        Join the Discord.
      </h2>
      <p
        style={{
          ...S,
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7,
          margin: "0 0 20px",
        }}
      >
        Open Discord and join the WSA member server to continue.
      </p>
      <a
        href="https://discord.gg/wsa"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          textAlign: "center",
          padding: "14px 22px",
          background: "rgba(88,101,242,0.15)",
          border: "1px solid rgba(88,101,242,0.4)",
          borderRadius: 8,
          ...M,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#5865F2",
          textDecoration: "none",
          marginBottom: 20,
        }}
      >
        Open Discord →
      </a>
      <button onClick={onContinue} style={buttonStyle}>
        I&apos;ve joined — Continue
      </button>
    </div>
  );
}

function Step3({ onContinue }: { onContinue: () => void }) {
  return (
    <div>
      <h2
        style={{
          ...D,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "#fff",
          margin: "0 0 14px",
          lineHeight: 1.1,
        }}
      >
        Book your onboarding call.
      </h2>
      <p
        style={{
          ...S,
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7,
          margin: "0 0 20px",
        }}
      >
        Your CSM call is your unlock. Book it now to continue.
      </p>
      <button onClick={onContinue} style={buttonStyle}>
        I&apos;ve booked it — Continue
      </button>
    </div>
  );
}

function Step4({
  goalText,
  setGoalText,
  savingGoal,
  submitGoal,
}: {
  goalText: string;
  setGoalText: (s: string) => void;
  savingGoal: boolean;
  submitGoal: () => void;
}) {
  return (
    <div>
      <h2
        style={{
          ...D,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "#fff",
          margin: "0 0 14px",
          lineHeight: 1.1,
        }}
      >
        What&apos;s your goal?
      </h2>
      <p
        style={{
          ...S,
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7,
          margin: "0 0 16px",
        }}
      >
        One sentence. Be specific. We&apos;ll use this to personalize your track.
      </p>
      <textarea
        value={goalText}
        onChange={(e) => setGoalText(e.target.value)}
        placeholder="Hit $5K/month in 4 months · Quit my day job · Pass a prop firm..."
        style={{
          width: "100%",
          minHeight: 100,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 6,
          padding: "12px 14px",
          color: "#fff",
          ...S,
          fontSize: 14,
          lineHeight: 1.5,
          outline: "none",
          resize: "vertical",
        }}
      />
      <button
        onClick={submitGoal}
        disabled={savingGoal}
        style={{
          width: "100%",
          marginTop: 14,
          background: "rgba(37,99,235,0.12)",
          border: "1px solid rgba(37,99,235,0.35)",
          borderRadius: 7,
          padding: "12px 18px",
          ...M,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#2563eb",
          cursor: savingGoal ? "wait" : "pointer",
          opacity: savingGoal ? 0.5 : 1,
        }}
      >
        {savingGoal ? "Saving…" : "Save Goal"}
      </button>
    </div>
  );
}

function Step5({
  tourStep,
  setTourStep,
  finishOnboarding,
}: {
  tourStep: number;
  setTourStep: (s: number) => void;
  finishOnboarding: () => void;
}) {
  return (
    <div>
      <h2
        style={{
          ...D,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "#fff",
          margin: "0 0 14px",
          lineHeight: 1.1,
        }}
      >
        Welcome to WSA.
      </h2>
      <p
        style={{
          ...S,
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7,
          margin: "0 0 20px",
        }}
      >
        Here&apos;s what to look at first. Five minutes of orientation saves hours later.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {TOUR_STEPS.map((s, i) => (
          <div
            key={s.title}
            onClick={() => setTourStep(i)}
            style={{
              display: "flex",
              gap: 12,
              padding: tourStep === i ? "12px 14px" : "8px 14px",
              background:
                tourStep === i ? "rgba(37,99,235,0.08)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${tourStep === i ? "rgba(37,99,235,0.25)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 7,
              cursor: "pointer",
              alignItems: tourStep === i ? "flex-start" : "center",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <div>
              <div
                style={{
                  ...M,
                  fontSize: 10,
                  fontWeight: 700,
                  color: tourStep === i ? "#2563eb" : "rgba(255,255,255,0.55)",
                  letterSpacing: "0.1em",
                  marginBottom: tourStep === i ? 4 : 0,
                }}
              >
                {s.title}
              </div>
              {tourStep === i ? (
                <div
                  style={{
                    ...S,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.4)",
                    lineHeight: 1.6,
                  }}
                >
                  {s.desc}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <button onClick={finishOnboarding} style={buttonStyle}>
        Got it — Enter Portal
      </button>
    </div>
  );
}
