// Shared types and pure helpers for the portal page. Kept in one file
// so every section component can import them without dragging in the
// default-export page module.

import type { PhaseProgress } from "@/lib/phases";

export type Plan = "5k" | "7.5k" | "15k" | "low_ticket";

export type Member = {
  email: string;
  name: string;
  role: "member" | "admin" | "team";
  cohort: string;
  created_at: number;
  current_phase: number;
  phase_progress: PhaseProgress;
  plan: Plan;
  expires_at: string | null;
  goal: string;
  onboarded: boolean;
  portal_unlocked: boolean;
  skip_contract: boolean;
};

export type CalEvent = {
  title: string;
  country: string;
  date: string;
  impact: string;
  forecast: string;
  previous: string;
  actual: string;
};

export type Webinar = {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  join_link: string;
  recording_url: string;
  is_published: boolean;
};

export const SESSIONS = [
  { name: "London", utcOpen: 8, utcClose: 17, overnight: false, color: "#3b82f6", abbr: "LON" },
  { name: "New York", utcOpen: 13, utcClose: 22, overnight: false, color: "#2563eb", abbr: "NY" },
  { name: "Tokyo", utcOpen: 0, utcClose: 9, overnight: false, color: "#f97316", abbr: "TKY" },
  { name: "Sydney", utcOpen: 22, utcClose: 7, overnight: true, color: "#22c55e", abbr: "SYD" },
];

export const TZ_OPTIONS = [
  { key: "UTC", label: "UTC", iana: "UTC" },
  { key: "GMT", label: "GMT (London)", iana: "Europe/London" },
  { key: "EST", label: "EST (New York)", iana: "America/New_York" },
  { key: "PST", label: "PST (LA)", iana: "America/Los_Angeles" },
  { key: "SYD", label: "AEST (Sydney)", iana: "Australia/Sydney" },
  { key: "TKY", label: "JST (Tokyo)", iana: "Asia/Tokyo" },
];

export const CHECKLIST = [
  { id: "topdown", label: "Top-down analysis", sub: "Daily → H4 → H1 all reviewed" },
  { id: "events", label: "Economic events reviewed", sub: "High-impact news noted for today" },
  { id: "levels", label: "S&R levels drawn", sub: "Support & resistance on all timeframes" },
  { id: "structure", label: "Market structure ID'd", sub: "HH+HL bullish · LH+LL bearish" },
  { id: "bias", label: "MA bias confirmed", sub: "Above MAs = buy · Below MAs = sell" },
  { id: "plan", label: "Session plan written", sub: "Know which pairs & setups to watch" },
  { id: "risk", label: "Lot size calculated", sub: "Risk % decided before touching the charts" },
  { id: "notrade", label: "No-Trade rule acknowledged", sub: "2+ boxes = sit out. No exceptions." },
];

export const IMPACT_COLOR: Record<string, string> = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "rgba(255,255,255,0.25)",
};

// ── Pure helpers used across multiple sections ───────────────────────────────
export function isOpen(s: typeof SESSIONS[0], h: number, m: number) {
  const t = h + m / 60;
  return s.overnight ? t >= s.utcOpen || t < s.utcClose : t >= s.utcOpen && t < s.utcClose;
}

export function todayKey() {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
}

export function fmtJoin(ts: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function fmtEventTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function isPast(iso: string) {
  return new Date(iso) < new Date();
}

// Pair → quote currency (used by position-size calculator currency conversion).
export const QUOTE_CCY: Record<string, string> = {
  "EUR/USD": "USD",
  "USD/JPY": "JPY",
  "GBP/USD": "USD",
  "USD/CHF": "CHF",
  "AUD/USD": "USD",
  "USD/CAD": "CAD",
  "NZD/USD": "USD",
  "XAU/USD": "USD",
  "BTC/USD": "USD",
};

// Symbol per account currency. Mirrors the inline list in the calculator.
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CHF: "F",
  CAD: "C$",
  AUD: "A$",
  NZD: "NZ$",
};

// The onboarding-tour copy. Lives here so OnboardingOverlay imports it
// rather than pulling it from the page module.
export const TOUR_STEPS = [
  {
    title: "Your Roadmap",
    icon: "📍",
    desc: "The full WSA curriculum is on the Roadmap page. Follow each phase in order. Click any phase to track your progress.",
  },
  {
    title: "Ask Cue Anything",
    icon: "⚡",
    desc: "Cue AI is your personal trading mentor. Ask about confluence, entries, risk, mindset — any time, day or night. Your full conversation history is saved.",
  },
  {
    title: "Weekly Calls",
    icon: "📡",
    desc: "Your live group calls with Cue show up in the portal automatically. Join links and recordings land here every week.",
  },
  {
    title: "Pre-Session Checklist",
    icon: "✅",
    desc: "Before you touch the charts, run through the checklist. It resets every midnight. Build the habit. The checklist is the discipline.",
  },
];

// Membership-tier constant — also exported from mem-data.ts in some versions
// but kept here so the page orchestrator and any sub-component share the
// same source of truth.
export { SESSIONS as FOREX_SESSIONS };
