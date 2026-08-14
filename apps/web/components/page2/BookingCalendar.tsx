"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import posthog from "posthog-js";

type Slot = { time: string; schedulingUrl: string };
type SlotsMap = Record<string, Slot[]>;

const CALENDLY_THEME = {
  background_color: "000000",
  text_color: "ffffff",
  primary_color: "f9ff3c",
  hide_event_type_details: "1",
  hide_landing_page_details: "1",
};

function buildConfirmUrl(schedulingUrl: string, name: string, email: string): string {
  const url = new URL(schedulingUrl);
  if (name) url.searchParams.set("name", name);
  if (email) url.searchParams.set("email", email);
  Object.entries(CALENDLY_THEME).forEach(([k, v]) => url.searchParams.set(k, v));
  // embed_domain + embed_type make Calendly emit postMessage events (incl.
  // calendly.event_scheduled) to the parent window so we can redirect on booking.
  if (typeof window !== "undefined") {
    url.searchParams.set("embed_domain", window.location.hostname);
    url.searchParams.set("embed_type", "Inline");
  }
  return url.toString().replace(/\+/g, "%20");
}

function getLocalTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function getNextDays(count: number): string[] {
  const out: string[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    out.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function formatTime(iso: string, _tz: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

const POPULAR_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export default function BookingCalendar({
  firstName,
  lastName,
  email,
  phone: _phone,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  const [timezone, setTimezone] = useState(getLocalTimezone);
  const [slotsMap, setSlotsMap] = useState<SlotsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [confirmSlot, setConfirmSlot] = useState<Slot | null>(null);

  const days = useMemo(() => getNextDays(14), []);
  const visibleDays = days.slice(0, 7);

  const fetchSlots = useCallback(async (tz: string) => {
    setLoading(true);
    setError(null);
    try {
      const start = new Date().toISOString().slice(0, 10);
      const res = await fetch(
        `/api/calendly/slots?start=${start}&days=14&timezone=${encodeURIComponent(tz)}`,
      );
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      const map: SlotsMap = data.slots || {};
      setSlotsMap(map);
      const first = days.find((d) => (map[d] || []).length > 0);
      if (first) setSelectedDate((prev) => prev ?? first);
    } catch {
      setError("Could not load availability. Please refresh to try again.");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchSlots(timezone);
  }, [timezone, fetchSlots]);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      const data = e.data as { event?: string } | null;
      if (data && typeof data === "object" && data.event === "calendly.event_scheduled") {
        posthog.capture("book_scheduled");
        window.location.href = "/book/confirm";
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const todaySlots = selectedDate ? (slotsMap[selectedDate] || []) : [];

  if (confirmSlot) {
    const confirmUrl = buildConfirmUrl(confirmSlot.schedulingUrl, fullName, email);
    return (
      <div>
        <button
          onClick={() => setConfirmSlot(null)}
          className="bg-transparent border-0 text-ash cursor-pointer font-mono text-[10px] font-bold tracking-[0.18em] uppercase flex items-center gap-1.5 mb-4 p-0"
        >
          ← Change time
        </button>
        <div className="border border-line overflow-hidden">
          <iframe
            key={confirmUrl}
            src={confirmUrl}
            title="Confirm booking"
            className="w-full h-[640px] border-0 block bg-transparent"
            allow="camera; microphone; autoplay; encrypted-media"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="font-mono text-[10px] font-bold text-acid tracking-[0.22em] uppercase text-center mb-6">
        · Select a time · 45 min ·
      </div>

      {loading && (
        <div className="flex items-center justify-center h-[260px] text-ash font-mono text-[10px] font-bold tracking-[0.2em] uppercase gap-2.5">
          <span className="pulse w-1.5 h-1.5 bg-acid inline-block" />
          Loading availability…
        </div>
      )}

      {error && !loading && (
        <div
          style={{ color: "var(--drop, #e93d3d)" }}
          className="text-center py-12 font-mono text-[11px] tracking-[0.12em]"
        >
          {error}
          <br />
          <button
            onClick={() => fetchSlots(timezone)}
            className="mt-3.5 bg-transparent border border-line-2 text-bone font-mono text-[10px] font-bold tracking-[0.16em] uppercase px-4 py-2.5 cursor-pointer"
          >
            Retry →
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Day strip */}
          <div className="grid grid-cols-7 gap-2 mb-5">
            {visibleDays.map((date) => {
              const d = new Date(date + "T12:00:00");
              const hasSlots = (slotsMap[date] || []).length > 0;
              const sel = date === selectedDate;
              return (
                <button
                  key={date}
                  onClick={() => hasSlots && setSelectedDate(date)}
                  disabled={!hasSlots}
                  style={{
                    background: sel ? "rgba(249,255,60,0.08)" : "var(--bg-1)",
                    borderColor: sel ? "var(--acid)" : "var(--line)",
                    color: hasSlots ? (sel ? "var(--acid)" : "var(--bone)") : "var(--muted)",
                    boxShadow: sel
                      ? "0 0 0 1px var(--acid), 0 0 18px rgba(249,255,60,0.10)"
                      : "none",
                    opacity: hasSlots ? 1 : 0.35,
                  }}
                  className={`rounded-md text-center py-3.5 px-1 border transition-all duration-150 ${
                    hasSlots ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div
                    style={{ color: sel ? "var(--acid)" : "var(--ash)" }}
                    className="font-mono text-[8px] font-bold tracking-[0.14em] uppercase mb-1"
                  >
                    {d.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="font-display text-[26px] font-bold leading-none tracking-[-0.02em]">
                    {d.getDate()}
                  </div>
                  <div className="font-mono text-[8px] font-bold tracking-[0.12em] uppercase mt-1 text-ash">
                    {d.toLocaleDateString("en-US", { month: "short" })}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Duration + timezone row */}
          <div className="flex items-center justify-between mb-4.5 gap-3 flex-wrap">
            <div className="font-mono text-[10px] text-ash tracking-[0.12em] flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              45 min call
            </div>
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ash)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="bg-bg-1 border border-line text-bone font-mono text-[10px] py-1 px-2 cursor-pointer outline-none tracking-[0.08em]"
              >
                {POPULAR_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace(/_/g, " ")}
                  </option>
                ))}
                {!POPULAR_TIMEZONES.includes(timezone) && (
                  <option value={timezone}>{timezone.replace(/_/g, " ")}</option>
                )}
              </select>
            </div>
          </div>

          {/* Time slot grid */}
          {selectedDate &&
            (todaySlots.length === 0 ? (
              <div className="text-center py-8 text-ash font-mono text-[10px] tracking-[0.14em] uppercase">
                No availability — pick another day
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2">
                {todaySlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => {
                      setConfirmSlot(slot);
                      posthog.capture("book_slot_selected", {
                        start_time: slot.time,
                        timezone,
                      });
                    }}
                    onMouseEnter={(e) => {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.borderColor = "var(--acid)";
                      b.style.color = "var(--acid)";
                      b.style.background = "rgba(249,255,60,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.borderColor = "var(--line)";
                      b.style.color = "var(--bone)";
                      b.style.background = "var(--bg-1)";
                    }}
                    className="py-4 px-2.5 bg-bg-1 border border-line text-bone font-display text-[15px] font-bold tracking-[-0.01em] cursor-pointer rounded-sm transition-all duration-150 text-center"
                  >
                    {formatTime(slot.time, timezone)}
                  </button>
                ))}
              </div>
            ))}
        </>
      )}
    </div>
  );
}
