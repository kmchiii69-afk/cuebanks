// POST /api/freebie/optin
//
// Called by /freebie before unlocking the 3 free Cue AI questions. Creates
// the wsa_freebie_leads row (so /api/freebie/cue can gate + count usage,
// and so copy can be personalized by trading experience), and mirrors the
// standard lead-capture side-effects (Close, Kit, Discord) used by every
// other opt-in on the site. Side-effects never block the response — if
// Close/Kit/Discord are down, the visitor still gets in.

import { NextRequest, NextResponse } from "next/server";
import { createOrUpdateLead } from "@/lib/close";
import { subscribeToForm as kitSubscribe } from "@/lib/kit";
import { pingFreebieOptIn } from "@/lib/discord";
import { getFreebieLead, upsertFreebieLead, TradingExperience } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_EXPERIENCE: TradingExperience[] = ["under_1y", "1_3y", "3_5y", "5y_plus"];

function clean(s: unknown, max: number, allowedChars?: RegExp): string {
  if (typeof s !== "string") return "";
  let v = s.trim().slice(0, max);
  if (allowedChars) v = v.replace(allowedChars, "");
  return v;
}

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const first_name = clean(body.first_name, 40, /[^A-Za-z\s'-]/g);
  const last_name = clean(body.last_name, 40, /[^A-Za-z\s'-]/g);
  const email = clean(body.email, 120).toLowerCase();
  const phone = clean(body.phone, 24, /[^\d+\s()-]/g);
  const experience = clean(body.experience, 20) as TradingExperience;

  if (!first_name) return NextResponse.json({ error: "Missing name" }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 7) return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  if (!VALID_EXPERIENCE.includes(experience)) return NextResponse.json({ error: "Missing trading experience" }, { status: 400 });

  const existing = await getFreebieLead(email);
  const lead = await upsertFreebieLead({ email, first_name, last_name, phone, experience });

  // Fire-and-forget CRM side-effects — same pattern as /api/lead and /api/free-course.
  Promise.allSettled([
    createOrUpdateLead({ first_name, last_name, email, phone, status: "Opt In", source: "Cue AI Freebie" }),
    kitSubscribe({ email, first_name, last_name, phone }),
    pingFreebieOptIn({ first_name, last_name, email, phone, experience, created: !existing }),
  ]).then(([closeRes, kitRes, discordRes]) => {
    if (closeRes.status === "rejected") console.error("[/api/freebie/optin] Close failed:", closeRes.reason);
    if (kitRes.status === "rejected") console.error("[/api/freebie/optin] Kit failed:", kitRes.reason);
    if (discordRes.status === "rejected") console.error("[/api/freebie/optin] Discord failed:", discordRes.reason);
  });

  return NextResponse.json({ ok: true, questions_asked: lead.questions_asked });
}
