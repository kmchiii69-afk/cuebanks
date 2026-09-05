"use client";

// NOTE: this page is intentionally large (≈2.3k lines) because the 8-row
// member dashboard shares 25+ pieces of state across sections. Each
// extracted section would force 12+ props + 6+ callbacks through the
// parent — extraction overhead exceeded the value at this scope. The
// fully self-contained pieces (Loading, Locked, LowTicket, Onboarding,
// Security) live in apps/web/components/portal/.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Globe from "@/components/ui/globe";
import {
  PHASES,
  TOTAL_PHASES,
  isPhaseComplete,
} from "@/lib/phases";

import {
  CHECKLIST,
  IMPACT_COLOR,
  SESSIONS,
  TZ_OPTIONS,
  fmtEventTime,
  fmtJoin,
  isOpen,
  isToday,
  type CalEvent,
  type Member,
  type Webinar,
} from "@/components/portal/types";
import { M, S, D } from "@/components/portal/fonts";
import LoadingScreen from "@/components/portal/LoadingScreen";
import { isStaffRole } from "@/lib/roles";
// ONBOARDING_TOUR_STEPS moved to components/portal/types.ts and consumed
// by OnboardingOverlay. The 9 dashboard rows below stay inline because
// each one needs access to ~6–12 pieces of the parent component's state
// (savingsGoal, calcBalance, openSessions, etc.) and the wire count for
// fully splitting them exceeds the value at this size.
import LockedScreen from "@/components/portal/LockedScreen";
import LowTicketScreen from "@/components/portal/LowTicketScreen";
import OnboardingOverlay from "@/components/portal/OnboardingOverlay";
import SecurityPanel from "@/components/portal/SecurityPanel";

// ─── Quote-currency per pair (used by position-size calculator) ─────────────
const QUOTE_CCY: Record<string, string> = {
  "XAU/USD": "USD",
  "BTC/USD": "USD",
  "EUR/USD": "USD",
  "GBP/USD": "USD",
  "AUD/USD": "USD",
  "NZD/USD": "USD",
  "USD/JPY": "JPY",
  "USD/CAD": "CAD",
  "USD/CHF": "CHF",
  "EUR/JPY": "JPY",
  "GBP/JPY": "JPY",
  "AUD/JPY": "JPY",
  "EUR/GBP": "GBP",
  "EUR/CAD": "CAD",
  "GBP/CAD": "CAD",
};
const CALC_PAIRS = Object.keys(QUOTE_CCY);
const CALC_CURRENCIES = ["USD", "GBP", "EUR", "AUD", "CAD"];
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  AUD: "A$",
  CAD: "C$",
};

export default function PortalPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [openSessions, setOpenSessions] = useState<boolean[]>([false, false, false, false]);
  const [nowDate, setNowDate] = useState<Date | null>(null);
  const [utcH, setUtcH] = useState(0);
  const [utcM, setUtcM] = useState(0);
  const [dashTz, setDashTz] = useState("UTC");

  // Position size calculator
  const [calcBalance, setCalcBalance] = useState("10000");
  const [calcRisk, setCalcRisk] = useState(1);
  const [calcSL, setCalcSL] = useState("");
  const [calcPair, setCalcPair] = useState("EUR/USD");
  const [calcCurrency, setCalcCurrency] = useState("USD");
  const [fxRates, setFxRates] = useState<Record<string, number>>({ USD: 1 });

  const [calEvents, setCalEvents] = useState<CalEvent[]>([]);
  const [calLoading, setCalLoading] = useState(true);

  const [webinars, setWebinars] = useState<Webinar[]>([]);

  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  // Onboarding
  const [onboarding, setOnboarding] = useState(false);
  const [onboardStep, setOnboardStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [goalText, setGoalText] = useState("");
  const [savingGoal, setSavingGoal] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    function todayKey() {
      return new Date().toLocaleDateString("en-CA");
    }
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
        if (!isStaffRole(data.role) && data.expires_at && new Date(data.expires_at) < new Date()) {
          router.replace("/login?expired=1");
          return;
        }
        setMember(data);
        const ck = localStorage.getItem(`wsa-ck-${data.email}-${todayKey()}`);
        setChecklist(ck ? JSON.parse(ck) : {});
        setNotes(localStorage.getItem(`wsa-notes-${data.email}`) || "");
        const savedTz = localStorage.getItem(`wsa-tz-${data.email}`);
        if (savedTz && TZ_OPTIONS.some((t) => t.key === savedTz)) setDashTz(savedTz);
        if (
          !isStaffRole(data.role) &&
          data.plan !== "low_ticket" &&
          !data.portal_unlocked &&
          (!data.onboarded || !data.goal)
        )
          setOnboarding(true);
        setLoading(false);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  // Clock + sessions
  useEffect(() => {
    function tick() {
      const now = new Date();
      const h = now.getUTCHours();
      const m = now.getUTCMinutes();
      setOpenSessions(SESSIONS.map((s) => isOpen(s, h, m)));
      setNowDate(now);
      setUtcH(h);
      setUtcM(m);
    }
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  // Webinars
  useEffect(() => {
    fetch("/api/webinars")
      .then((r) => r.json())
      .then((data) => setWebinars(Array.isArray(data) ? data : []))
      .catch(() => setWebinars([]));
  }, []);

  // FX rates
  useEffect(() => {
    fetch("/api/fx")
      .then((r) => r.json())
      .then((data) =>
        setFxRates(data?.rates && typeof data.rates === "object" ? data.rates : { USD: 1 }),
      )
      .catch(() => setFxRates({ USD: 1 }));
  }, []);

  // Economic calendar
  useEffect(() => {
    fetch("/api/calendar")
      .then((r) => r.json())
      .then((data: unknown) => {
        const events = Array.isArray((data as { events?: unknown }).events)
          ? (data as { events: CalEvent[] }).events
          : [];
        const today = events.filter((e) => isToday(e.date));
        today.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setCalEvents(today);
      })
      .catch(() => setCalEvents([]))
      .finally(() => setCalLoading(false));
  }, []);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  function toggleCheck(id: string) {
    if (!member) return;
    const next = { ...checklist, [id]: !checklist[id] };
    setChecklist(next);
    const key = new Date().toLocaleDateString("en-CA");
    localStorage.setItem(`wsa-ck-${member.email}-${key}`, JSON.stringify(next));
  }

  function saveNotes() {
    if (!member) return;
    localStorage.setItem(`wsa-notes-${member.email}`, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  async function changePassword() {
    setPwError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("Fill in all fields");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords don't match");
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch("/api/portal/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPwSaved(true);
        setTimeout(() => setPwSaved(false), 2500);
      } else {
        const data = await res.json().catch(() => ({}));
        setPwError(data.error || "Failed to update password");
      }
    } catch {
      setPwError("Connection error");
    }
    setPwSaving(false);
  }

  async function submitGoal() {
    if (!goalText.trim()) return;
    setSavingGoal(true);
    await fetch("/api/portal/goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal: goalText.trim() }),
    });
    setMember((m) => (m ? { ...m, goal: goalText.trim(), onboarded: true } : m));
    setSavingGoal(false);
    setOnboardStep(5);
  }

  function finishOnboarding() {
    setOnboarding(false);
  }

  if (loading) return <LoadingScreen />;

  // Locked: onboarding done but the CSM call hasn't happened yet.
  const needsCallUnlock =
    member &&
    !isStaffRole(member.role) &&
    !member.portal_unlocked &&
    (member.plan === "low_ticket" || member.onboarded);
  if (needsCallUnlock) {
    return <LockedScreen member={member!} loggingOut={loggingOut} onLogout={logout} />;
  }

  if (member?.plan === "low_ticket" && !isStaffRole(member.role)) {
    return (
      <LowTicketScreen
        member={member}
        loggingOut={loggingOut}
        onLogout={logout}
      />
    );
  }

  const isAdmin = isStaffRole(member?.role);
  const phase = member?.current_phase ?? 0;
  const completedPhaseCount = PHASES.filter((p) =>
    isPhaseComplete(member?.phase_progress, p.id),
  ).length;
  const allPhasesComplete = completedPhaseCount >= TOTAL_PHASES;
  const liveCount = openSessions.filter(Boolean).length;
  const overlap = openSessions[0] && openSessions[1];
  const checkDone = CHECKLIST.filter((c) => checklist[c.id]).length;
  const highToday = calEvents.filter((e) => e.impact === "High").length;

  const nowTs = new Date();
  const upcomingCalls = webinars
    .filter((w) => new Date(w.scheduled_at) > nowTs)
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  const pastRecordings = webinars
    .filter((w) => new Date(w.scheduled_at) <= nowTs && w.recording_url)
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    .slice(0, 8);
  const nextCall = upcomingCalls[0] ?? null;

  function fmtCallDate(iso: string) {
    const d = new Date(iso);
    const diffDays = Math.floor((d.getTime() - nowTs.getTime()) / 86400000);
    const timeStr = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
    const dateStr = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (diffDays === 0) return `Today · ${timeStr}`;
    if (diffDays === 1) return `Tomorrow · ${timeStr}`;
    return `${dateStr} · ${timeStr} · in ${diffDays}d`;
  }

  function fmtRecDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // ── Trading tools ──
  // Quote currency per pair — pip value is computed live from this + fxRates, not hardcoded,
  // so it stays accurate for any account currency (mirrors how myfxbook's calculator works).
  const currencySymbol = CURRENCY_SYMBOLS[calcCurrency] ?? "$";
  const quoteCcy = QUOTE_CCY[calcPair] ?? "USD";
  const pipValueQuote =
    calcPair === "XAU/USD" || calcPair === "BTC/USD"
      ? 1
      : (quoteCcy === "JPY" ? 0.01 : 0.0001) * 100000;
  const rateQuote = fxRates[quoteCcy] ?? 1;
  const rateAccount = fxRates[calcCurrency] ?? 1;
  const accountRisk = (parseFloat(calcBalance) || 0) * (calcRisk / 100);
  const pipVal = (pipValueQuote / rateQuote) * rateAccount;
  const slPips = parseFloat(calcSL) || 0;
  const lotSize = slPips > 0 ? accountRisk / (slPips * pipVal) : 0;

  function getCountdownEvents() {
    const nowMin = utcH * 60 + utcM;
    type Evt = { label: string; minsUntil: number; color: string; isOverlap?: boolean };
    const evts: Evt[] = [];
    for (const s of SESSIONS) {
      const openMin = s.utcOpen * 60;
      const closeMin = s.utcClose * 60;
      const open = isOpen(s, utcH, utcM);
      if (!open) {
        let d = openMin - nowMin;
        if (d <= 0) d += 1440;
        evts.push({ label: `${s.name} opens`, minsUntil: d, color: s.color });
      } else {
        let d = closeMin - nowMin;
        if (d <= 0) d += 1440;
        evts.push({ label: `${s.name} closes`, minsUntil: d, color: s.color });
      }
    }
    // NY/LON overlap 13:00–17:00 UTC
    const ovStart = 13 * 60;
    const ovEnd = 17 * 60;
    const inOv = nowMin >= ovStart && nowMin < ovEnd;
    if (inOv) {
      let d = ovEnd - nowMin;
      if (d <= 0) d += 1440;
      evts.push({
        label: "NY/LON overlap ends",
        minsUntil: d,
        color: "#2563eb",
        isOverlap: true,
      });
    } else {
      let d = ovStart - nowMin;
      if (d <= 0) d += 1440;
      evts.push({
        label: "NY/LON overlap starts",
        minsUntil: d,
        color: "#2563eb",
        isOverlap: true,
      });
    }
    return evts.sort((a, b) => a.minsUntil - b.minsUntil).slice(0, 5);
  }
  function fmtMins(mins: number) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
  }
  const countdownEvts = getCountdownEvents();

  // ── Timezone display (session open/close logic above stays UTC-based) ──
  const activeTz = TZ_OPTIONS.find((t) => t.key === dashTz) ?? TZ_OPTIONS[0];
  function fmtHourInTz(utcHour: number): string {
    if (!nowDate) return `${String(utcHour).padStart(2, "0")}:00`;
    const d = new Date(nowDate);
    d.setUTCHours(utcHour, 0, 0, 0);
    return d.toLocaleTimeString("en-GB", {
      timeZone: activeTz.iana,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  const nowInTz = nowDate
    ? nowDate.toLocaleTimeString("en-GB", {
        timeZone: activeTz.iana,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";
  function changeTz(tz: string) {
    setDashTz(tz);
    if (member) localStorage.setItem(`wsa-tz-${member.email}`, tz);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", position: "relative" }}>
      {/* Space atmosphere */}
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
      {/* Globe */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.32,
          transform:
            "translate3d(78vw, 30vh, 0) translate3d(-50%, -50%, 0) scale3d(2.8, 2.8, 1)",
        }}
      >
        <Globe size={250} />
      </div>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(0,0,0,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          height: 62,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wsa/home/1.png"
            alt="WSA"
            style={{
              height: 40,
              width: 40,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid rgba(255,255,255,0.12)",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                ...M,
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Wall Street Academy
            </div>
            <div
              style={{
                ...M,
                fontSize: 8,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginTop: 3,
              }}
            >
              Member Portal
            </div>
          </div>
          {isAdmin ? (
            <a
              href="/admin"
              style={{
                ...M,
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#2563eb",
                textDecoration: "none",
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(37,99,235,0.2)",
                borderRadius: 4,
                padding: "4px 10px",
                marginLeft: 6,
              }}
            >
              Admin
            </a>
          ) : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* Live sessions bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {SESSIONS.map((s, i) => (
              <div key={s.abbr} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: openSessions[i] ? s.color : "#333",
                    flexShrink: 0,
                    boxShadow: openSessions[i] ? `0 0 6px ${s.color}80` : "none",
                    transition: "all 0.3s",
                  }}
                />
                <span
                  style={{
                    ...M,
                    fontSize: 7.5,
                    color: openSessions[i]
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(255,255,255,0.15)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.abbr}
                </span>
              </div>
            ))}
          </div>
          {nowInTz ? (
            <span style={{ ...M, fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
              {nowInTz} {dashTz}
            </span>
          ) : null}
          {member?.name ? (
            <span style={{ ...S, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
              {member.name.split(" ")[0]}
            </span>
          ) : null}
          <button
            onClick={logout}
            disabled={loggingOut}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 5,
              padding: "6px 14px",
              ...M,
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
              e.currentTarget.style.color = "rgba(255,255,255,0.65)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.3)";
            }}
          >
            {loggingOut ? "..." : "Sign out"}
          </button>
        </div>
      </nav>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1120,
          margin: "0 auto",
          padding: "36px 24px 80px",
        }}
      >
        {/* ── GOAL BANNER ───────────────────────────────────── */}
        {member?.goal ? (
          <div
            style={{
              marginBottom: 14,
              background: "rgba(37,99,235,0.04)",
              border: "1px solid rgba(37,99,235,0.15)",
              borderRadius: 10,
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span
              style={{
                ...M,
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(37,99,235,0.5)",
                flexShrink: 0,
              }}
            >
              MY GOAL
            </span>
            <span
              style={{
                ...S,
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.4,
                flex: 1,
              }}
            >
              {member.goal}
            </span>
            <span
              style={{
                ...M,
                fontSize: 8,
                color: "rgba(255,255,255,0.18)",
                flexShrink: 0,
                letterSpacing: "0.1em",
              }}
            >
              4 months
            </span>
          </div>
        ) : null}

        {/* ── ROW 1: Welcome + Sessions ─────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 330px",
            gap: 14,
            marginBottom: 14,
          }}
        >
          {/* Welcome */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "26px 26px 22px",
            }}
          >
            <p
              style={{
                ...M,
                fontSize: 9,
                letterSpacing: "0.22em",
                color: "rgba(37,99,235,0.45)",
                textTransform: "uppercase",
                margin: "0 0 8px",
              }}
            >
              {member?.cohort ? `Cohort ${member.cohort}` : "WSA Member"} · Joined{" "}
              {fmtJoin(member?.created_at ?? 0)}
            </p>
            <h1
              style={{
                ...D,
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#fff",
                margin: "0 0 18px",
              }}
            >
              {member?.name ? `Welcome back, ${member.name.split(" ")[0]}.` : "Welcome back."}
            </h1>

            {/* Progress */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
              <span
                style={{
                  ...M,
                  fontSize: 8,
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.22)",
                  textTransform: "uppercase",
                }}
              >
                Curriculum Progress
              </span>
              <span
                style={{
                  ...M,
                  fontSize: 8,
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                {phase === 0 && completedPhaseCount === 0
                  ? "Not started"
                  : allPhasesComplete
                    ? "Complete ✓"
                    : `Phase ${phase} of ${TOTAL_PHASES}`}
              </span>
            </div>
            <div
              style={{
                height: 3,
                background: "rgba(255,255,255,0.07)",
                borderRadius: 2,
                marginBottom: 18,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(completedPhaseCount / TOTAL_PHASES) * 100}%`,
                  background: "linear-gradient(90deg, #2563eb, #d4f700)",
                  borderRadius: 2,
                  transition: "width 0.5s ease",
                }}
              />
            </div>

            {/* Today at a glance */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[
                {
                  label: "High-impact events",
                  value: calLoading ? "—" : highToday === 0 ? "None" : String(highToday),
                  color: highToday > 0 ? "#ef4444" : "#22c55e",
                },
                {
                  label: "Sessions live",
                  value: `${liveCount} / 4`,
                  color: liveCount > 0 ? "#22c55e" : "rgba(255,255,255,0.3)",
                },
                {
                  label: "Pre-session done",
                  value: `${checkDone} / ${CHECKLIST.length}`,
                  color:
                    checkDone === CHECKLIST.length ? "#22c55e" : "rgba(255,255,255,0.3)",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      ...D,
                      fontSize: 20,
                      fontWeight: 700,
                      color: stat.color,
                      marginBottom: 3,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      ...M,
                      fontSize: 7.5,
                      color: "rgba(255,255,255,0.25)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      lineHeight: 1.4,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Sessions */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "20px 18px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  ...M,
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.28)",
                  textTransform: "uppercase",
                }}
              >
                Market Sessions
              </div>
              <select
                value={dashTz}
                onChange={(e) => changeTz(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 5,
                  padding: "3px 6px",
                  color: "rgba(255,255,255,0.5)",
                  ...M,
                  fontSize: 8,
                  letterSpacing: "0.06em",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {TZ_OPTIONS.map((t) => (
                  <option key={t.key} value={t.key} style={{ background: "#111" }}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {overlap ? (
              <div
                style={{
                  background: "rgba(37,99,235,0.07)",
                  border: "1px solid rgba(37,99,235,0.22)",
                  borderRadius: 7,
                  padding: "7px 11px",
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#2563eb",
                    boxShadow: "0 0 8px #2563eb",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    ...M,
                    fontSize: 8,
                    color: "#2563eb",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  London / NY Overlap
                </span>
              </div>
            ) : null}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SESSIONS.map((s, i) => {
                const open = openSessions[i];
                return (
                  <div
                    key={s.name}
                    style={{
                      background: open ? `${s.color}0e` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${open ? s.color + "30" : "rgba(255,255,255,0.05)"}`,
                      borderRadius: 8,
                      padding: "9px 13px",
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      transition: "all 0.3s",
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: open ? s.color : "#333",
                        flexShrink: 0,
                        boxShadow: open ? `0 0 8px ${s.color}70` : "none",
                        transition: "all 0.3s",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            ...M,
                            fontSize: 10,
                            fontWeight: 700,
                            color: open ? "#fff" : "rgba(255,255,255,0.28)",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {s.name}
                        </span>
                        <span
                          style={{
                            ...M,
                            fontSize: 8,
                            color: open ? s.color : "rgba(255,255,255,0.15)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          {open ? "OPEN" : "CLOSED"}
                        </span>
                      </div>
                      <div
                        style={{
                          ...M,
                          fontSize: 7.5,
                          color: "rgba(255,255,255,0.2)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {fmtHourInTz(s.utcOpen)} – {fmtHourInTz(s.utcClose)} {dashTz}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                style={{
                  ...S,
                  fontSize: 11.5,
                  color: "rgba(255,255,255,0.35)",
                  lineHeight: 1.55,
                }}
              >
                Best window:{" "}
                <span style={{ color: "#2563eb" }}>
                  {fmtHourInTz(13)} – {fmtHourInTz(17)} {dashTz}
                </span>
                <br />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                  London / NY overlap · peak liquidity
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Action Cards ──────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isAdmin ? "repeat(3,1fr)" : "repeat(2,1fr)",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <a
            href="/roadmap"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "18px 20px",
              background: "rgba(37,99,235,0.04)",
              border: "1px solid rgba(37,99,235,0.18)",
              borderRadius: 12,
              textDecoration: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.09)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.04)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.18)";
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 9,
                background: "rgba(37,99,235,0.1)",
                border: "1px solid rgba(37,99,235,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M2 3h14M2 7h10M2 11h12M2 15h7"
                  stroke="#2563eb"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  ...D,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#2563eb",
                  marginBottom: 2,
                }}
              >
                Course Roadmap
              </div>
              <div
                style={{
                  ...S,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                {phase === 0 && completedPhaseCount === 0
                  ? "Start here — Week 1, Prepare"
                  : allPhasesComplete
                    ? "All phases complete"
                    : `Phase ${phase} of ${TOTAL_PHASES} active`}
              </div>
            </div>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M2.5 6.5h8M8 3.5l3 3-3 3"
                stroke="rgba(37,99,235,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <a
            href="/cue"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "18px 20px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              textDecoration: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 9,
                background: "rgba(37,99,235,0.1)",
                border: "1px solid rgba(37,99,235,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ ...M, fontWeight: 800, fontSize: 18, color: "#2563eb", lineHeight: 1 }}>
                C
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  ...D,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 2,
                }}
              >
                Cue AI
              </div>
              <div style={{ ...S, fontSize: 12, color: "rgba(255,255,255,0.38)" }}>
                Ask anything — strategy, setups, mindset
              </div>
            </div>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M2.5 6.5h8M8 3.5l3 3-3 3"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {isAdmin ? (
            <a
              href="/admin"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "18px 20px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                textDecoration: "none",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 9,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 1l8 4v8l-8 4-8-4V5z"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    ...D,
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 2,
                  }}
                >
                  Admin
                </div>
                <div style={{ ...S, fontSize: 12, color: "rgba(255,255,255,0.38)" }}>
                  Coach panel · members, content, settings
                </div>
              </div>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M2.5 6.5h8M8 3.5l3 3-3 3"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ) : null}
        </div>

        {/* ── ROW 3: Phase Tracker ──────────────────────────── */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                ...M,
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
              }}
            >
              Phase Progress ({completedPhaseCount} / {TOTAL_PHASES} done)
            </div>
            <a
              href="/roadmap"
              style={{
                ...M,
                fontSize: 8,
                letterSpacing: "0.16em",
                color: "rgba(37,99,235,0.6)",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Open Roadmap →
            </a>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {PHASES.map((ph) => {
              const done = isPhaseComplete(member?.phase_progress, ph.id);
              const unlocked =
                !done &&
                (member?.phase_progress
                  ? ph.id <= (member.current_phase || 0)
                  : ph.id === 1);
              const isCurrent = unlocked && !done;
              return (
                <a
                  key={ph.id}
                  href="/roadmap"
                  style={{
                    flex: 1,
                    background: done
                      ? "rgba(34,197,94,0.08)"
                      : isCurrent
                        ? "rgba(37,99,235,0.1)"
                        : "rgba(255,255,255,0.02)",
                    border: done
                      ? "1px solid rgba(34,197,94,0.2)"
                      : isCurrent
                        ? "1px solid rgba(37,99,235,0.25)"
                        : "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 6,
                    padding: "10px 6px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      ...M,
                      fontSize: 9,
                      fontWeight: 700,
                      color: done
                        ? "#22c55e"
                        : isCurrent
                          ? "#2563eb"
                          : "rgba(255,255,255,0.18)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {done ? "✓" : ph.num}
                  </div>
                  <div
                    style={{
                      ...M,
                      fontSize: 7,
                      color: "rgba(255,255,255,0.25)",
                      letterSpacing: "0.06em",
                      marginTop: 4,
                      lineHeight: 1.2,
                    }}
                  >
                    {ph.title}
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* ── ROW 4: Trading Tools (countdown + position calc) ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 14,
          }}
        >
          {/* Session Countdown */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                ...M,
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Upcoming Session Events
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {countdownEvts.map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 0",
                    borderBottom:
                      i < countdownEvts.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: e.color,
                      boxShadow: e.isOverlap
                        ? `0 0 6px ${e.color}90`
                        : "none",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      ...M,
                      fontSize: 10,
                      color: "rgba(255,255,255,0.5)",
                      letterSpacing: "0.04em",
                      flex: 1,
                    }}
                  >
                    {e.label}
                  </span>
                  <span
                    style={{
                      ...M,
                      fontSize: 11,
                      fontWeight: 700,
                      color: e.color,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {fmtMins(e.minsUntil)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Position Size Calculator */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  ...M,
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.28)",
                  textTransform: "uppercase",
                }}
              >
                Position Size Calculator
              </div>
              <select
                value={calcCurrency}
                onChange={(e) => setCalcCurrency(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 5,
                  padding: "3px 6px",
                  color: "rgba(255,255,255,0.5)",
                  ...M,
                  fontSize: 8,
                  letterSpacing: "0.06em",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {CALC_CURRENCIES.map((c) => (
                  <option key={c} value={c} style={{ background: "#111" }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <label>
                <div
                  style={{
                    ...M,
                    fontSize: 7.5,
                    color: "rgba(255,255,255,0.22)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Balance ({currencySymbol})
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={calcBalance}
                  onChange={(e) => setCalcBalance(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    padding: "9px 11px",
                    color: "#fff",
                    ...S,
                    fontSize: 13,
                    outline: "none",
                    fontVariantNumeric: "tabular-nums",
                  }}
                />
              </label>
              <label>
                <div
                  style={{
                    ...M,
                    fontSize: 7.5,
                    color: "rgba(255,255,255,0.22)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Pair
                </div>
                <select
                  value={calcPair}
                  onChange={(e) => setCalcPair(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    padding: "9px 11px",
                    color: "#fff",
                    ...M,
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    outline: "none",
                    cursor: "pointer",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {CALC_PAIRS.map((p) => (
                    <option key={p} value={p} style={{ background: "#111" }}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <div
                  style={{
                    ...M,
                    fontSize: 7.5,
                    color: "rgba(255,255,255,0.22)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Risk %
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  max="100"
                  value={calcRisk}
                  onChange={(e) => setCalcRisk(Number(e.target.value))}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    padding: "9px 11px",
                    color: "#fff",
                    ...S,
                    fontSize: 13,
                    outline: "none",
                    fontVariantNumeric: "tabular-nums",
                  }}
                />
              </label>
              <label>
                <div
                  style={{
                    ...M,
                    fontSize: 7.5,
                    color: "rgba(255,255,255,0.22)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Stop Loss (pips)
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={calcSL}
                  onChange={(e) => setCalcSL(e.target.value)}
                  placeholder="50"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    padding: "9px 11px",
                    color: "#fff",
                    ...S,
                    fontSize: 13,
                    outline: "none",
                    fontVariantNumeric: "tabular-nums",
                  }}
                />
              </label>
            </div>

            <div
              style={{
                marginTop: 14,
                padding: "14px 16px",
                background: "rgba(37,99,235,0.04)",
                border: "1px solid rgba(37,99,235,0.18)",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <div
                  style={{
                    ...M,
                    fontSize: 7.5,
                    color: "rgba(37,99,235,0.5)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: 3,
                  }}
                >
                  Recommended Lot Size
                </div>
                <div
                  style={{
                    ...M,
                    fontSize: 8,
                    color: "rgba(255,255,255,0.22)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {currencySymbol}
                  {accountRisk.toFixed(2)} risk · {slPips > 0 ? `${slPips} pip SL` : "—"}
                </div>
              </div>
              <div
                style={{
                  ...D,
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: lotSize > 0 ? "#2563eb" : "rgba(255,255,255,0.18)",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                }}
              >
                {lotSize > 0 ? lotSize.toFixed(2) : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 5: Weekly Calls (next) ────────────────────── */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: "22px 24px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                ...M,
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
              }}
            >
              {nextCall ? "Your Next Group Call" : "No Calls Scheduled"}
            </div>
            <a
              href="/portal"
              style={{
                ...M,
                fontSize: 8,
                letterSpacing: "0.14em",
                color: "rgba(37,99,235,0.6)",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              See All Calls →
            </a>
          </div>
          {nextCall ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "16px 18px",
                background: "rgba(37,99,235,0.04)",
                border: "1px solid rgba(37,99,235,0.18)",
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "rgba(37,99,235,0.1)",
                  border: "1px solid rgba(37,99,235,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="3" y="5" width="16" height="14" rx="2" stroke="#2563eb" strokeWidth="1.5" />
                  <path d="M7 3v4M15 3v4M3 11h16" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    ...D,
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {nextCall.title}
                </div>
                {nextCall.description ? (
                  <div
                    style={{
                      ...S,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: 6,
                      lineHeight: 1.5,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {nextCall.description}
                  </div>
                ) : null}
                <div
                  style={{
                    ...M,
                    fontSize: 9,
                    color: "#2563eb",
                    letterSpacing: "0.14em",
                  }}
                >
                  {fmtCallDate(nextCall.scheduled_at)}
                </div>
              </div>
              <a
                href={nextCall.join_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "10px 18px",
                  background: "rgba(37,99,235,0.12)",
                  border: "1px solid rgba(37,99,235,0.35)",
                  borderRadius: 8,
                  ...M,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#2563eb",
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                Join
              </a>
            </div>
          ) : (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: "rgba(255,255,255,0.25)",
                ...S,
                fontSize: 13,
              }}
            >
              The next group call will appear here once scheduled.
            </div>
          )}
        </div>

        {/* ── ROW 6: Calendar + Checklist + Notes ──────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginBottom: 14,
          }}
        >
          {/* Calendar */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "20px 22px",
            }}
          >
            <div
              style={{
                ...M,
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              High-Impact Events Today
            </div>
            {calLoading ? (
              <div
                style={{
                  padding: "20px 0",
                  textAlign: "center",
                  ...M,
                  fontSize: 9,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.16em",
                }}
              >
                Loading…
              </div>
            ) : calEvents.length === 0 ? (
              <div
                style={{
                  padding: "16px 0",
                  textAlign: "center",
                  ...M,
                  fontSize: 9,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                No events scheduled
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {calEvents.map((e, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "6px 0",
                      borderBottom:
                        i < calEvents.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}
                  >
                    <span
                      style={{
                        ...M,
                        fontSize: 8,
                        fontWeight: 700,
                        color: IMPACT_COLOR[e.impact] || IMPACT_COLOR.Low,
                        letterSpacing: "0.1em",
                        flexShrink: 0,
                        width: 24,
                      }}
                    >
                      {e.impact === "High" ? "HI" : e.impact === "Medium" ? "MD" : "LO"}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          ...M,
                          fontSize: 10,
                          color: "rgba(255,255,255,0.7)",
                          letterSpacing: "0.04em",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {e.title}
                        {e.country ? (
                          <span
                            style={{
                              color: "rgba(255,255,255,0.3)",
                              marginLeft: 6,
                              fontSize: 8.5,
                            }}
                          >
                            {e.country}
                          </span>
                        ) : null}
                      </div>
                      <div
                        style={{
                          ...M,
                          fontSize: 8,
                          color: "rgba(255,255,255,0.22)",
                          letterSpacing: "0.06em",
                          marginTop: 2,
                        }}
                      >
                        {fmtEventTime(e.date)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, minWidth: 56 }}>
                      <div
                        style={{
                          ...M,
                          fontSize: 7,
                          color: "rgba(255,255,255,0.2)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Forecast
                      </div>
                      <div
                        style={{
                          ...M,
                          fontSize: 10,
                          color: "rgba(255,255,255,0.6)",
                        }}
                      >
                        {e.forecast || "—"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checklist + Notes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Checklist */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "18px 22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    ...M,
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    color: "rgba(255,255,255,0.28)",
                    textTransform: "uppercase",
                  }}
                >
                  Pre-Session Checklist ({checkDone}/{CHECKLIST.length})
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {CHECKLIST.map((c) => {
                  const on = !!checklist[c.id];
                  return (
                    <label
                      key={c.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        cursor: "pointer",
                        opacity: on ? 1 : 0.75,
                      }}
                      onClick={() => toggleCheck(c.id)}
                    >
                      <div
                        style={{
                          width: 13,
                          height: 13,
                          borderRadius: 2.5,
                          border: `1.2px solid ${on ? "#2563eb" : "rgba(255,255,255,0.18)"}`,
                          background: on ? "#2563eb" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 2,
                          transition: "all 0.12s",
                        }}
                      >
                        {on ? (
                          <svg width="7" height="6" viewBox="0 0 9 7" fill="none">
                            <path
                              d="M1 3.5L3.5 6L8 1"
                              stroke="#fff"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : null}
                      </div>
                      <div>
                        <div
                          style={{
                            ...M,
                            fontSize: 9,
                            color: on ? "#fff" : "rgba(255,255,255,0.55)",
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            transition: "color 0.12s",
                          }}
                        >
                          {c.label}
                        </div>
                        <div
                          style={{
                            ...S,
                            fontSize: 10,
                            color: "rgba(255,255,255,0.25)",
                            marginTop: 1,
                          }}
                        >
                          {c.sub}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    ...M,
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    color: "rgba(255,255,255,0.28)",
                    textTransform: "uppercase",
                  }}
                >
                  Notes
                </div>
                <button
                  onClick={saveNotes}
                  style={{
                    background: notesSaved
                      ? "rgba(34,197,94,0.12)"
                      : "rgba(37,99,235,0.1)",
                    border: `1px solid ${notesSaved ? "rgba(34,197,94,0.3)" : "rgba(37,99,235,0.25)"}`,
                    borderRadius: 4,
                    padding: "3px 9px",
                    ...M,
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: notesSaved ? "#22c55e" : "#2563eb",
                    cursor: "pointer",
                  }}
                >
                  {notesSaved ? "✓ Saved" : "Save"}
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Quick notes..."
                style={{
                  width: "100%",
                  minHeight: 70,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 6,
                  padding: "8px 12px",
                  color: "#fff",
                  ...S,
                  fontSize: 12,
                  lineHeight: 1.5,
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── ROW 7: Recordings ───────────────────────────── */}
        {pastRecordings.length > 0 ? (
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "20px 24px",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                ...M,
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Recent Recordings ({pastRecordings.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
              {pastRecordings.map((r) => (
                <a
                  key={r.id}
                  href={r.recording_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    padding: "10px 13px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 7,
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.05)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <polygon points="3,2 11,7 3,12" fill="rgba(37,99,235,0.6)" />
                  </svg>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        ...M,
                        fontSize: 10,
                        color: "rgba(255,255,255,0.7)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.title}
                    </div>
                    <div
                      style={{
                        ...M,
                        fontSize: 7.5,
                        color: "rgba(255,255,255,0.22)",
                        marginTop: 2,
                      }}
                    >
                      {fmtRecDate(r.scheduled_at)}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <SecurityPanel
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          pwError={pwError}
          pwSaved={pwSaved}
          pwSaving={pwSaving}
          changePassword={changePassword}
          logout={logout}
        />

      </main>

      {onboarding ? (
        <OnboardingOverlay
          onboardStep={onboardStep}
          setOnboardStep={setOnboardStep}
          goalText={goalText}
          setGoalText={setGoalText}
          savingGoal={savingGoal}
          submitGoal={submitGoal}
          tourStep={tourStep}
          setTourStep={setTourStep}
          finishOnboarding={finishOnboarding}
        />
      ) : null}

      {/* Footer */}

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "28px 24px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            ...M,
            fontSize: 8,
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          © 2026 · Wall Street Academy · iknkfx inc · Not financial advice
        </p>
      </footer>
    </div>
  );
}
