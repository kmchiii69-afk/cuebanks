// Admin types and shared style primitives.
// Mirrors awfx's components/admin/users/types.ts structure so a future
// awfx → cuebanks admin component import is a one-liner.

import type { CSSProperties } from "react";

export type Plan = "5k" | "7.5k" | "15k" | "low_ticket";

export type Member = {
  id: string;
  email: string;
  name: string;
  role: "member" | "admin" | "team";
  active: boolean;
  cohort: string;
  discord_id: string;
  notes: string;
  created_at: number;
  last_login: number;
  current_phase: number;
  phase_progress: import("@/lib/phases").PhaseProgress;
  plan: Plan;
  expires_at: string | null;
  goal: string;
  onboarded: boolean;
  portal_unlocked: boolean;
  skip_contract: boolean;
};

export type CueInstruction = {
  id: string;
  type: "do" | "dont";
  instruction: string;
  active: boolean;
  created_at: string;
};

export type Webinar = {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  join_link: string;
  recording_url: string;
  is_published: boolean;
  created_at: string;
  created_by: string;
};

export type FreebieLead = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  experience: string;
  questions_asked: number;
  clicked_cta: boolean;
  created_at: string;
};

export type FreebieQA = {
  id: string;
  email: string;
  question: string;
  answer: string;
  created_at: string;
};

export type AnalyticRow = {
  id: string;
  member_email: string;
  plan: string;
  question: string;
  answer: string;
  created_at: string;
};

export type AdminTab = "members" | "webinars" | "analytics" | "cue-ai" | "freebie";

export const EXPERIENCE_LABELS: Record<string, string> = {
  under_1y: "Under a year",
  "1_3y": "1–3 years",
  "3_5y": "3–5 years",
  "5y_plus": "5+ years",
};

// Form helpers — focus/blur change border color via inline event handlers.
// Same pattern as the original admin page used for inputs/selects.
export const inputStyle: CSSProperties = {
  width: "100%",
  height: 40,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 7,
  padding: "0 12px",
  fontSize: 13,
  color: "#fff",
  fontFamily: "'DM Sans', system-ui, sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

export const inputFocusStyle = "rgba(37,99,235,0.35)";
export const inputBlurStyle = "rgba(255,255,255,0.1)";

export const focusInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = inputFocusStyle;
};
export const blurInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = inputBlurStyle;
};
