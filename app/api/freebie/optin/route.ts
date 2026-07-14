// POST /api/freebie/optin
//
// Called by /freebie before unlocking the 3 free Cue AI questions. Creates
// the wsa_freebie_leads row (so /api/freebie/cue can gate + count usage,
// and so copy can be personalized by trading experience), and mirrors the
// standard lead-capture side-effects (Close, Kit, Discord) used by every
// other opt-in on the site. Side-effects never block the response — if
// Close/Kit/Discord are down, the visitor still gets in.
//
// Validation is deliberately strict here: this endpoint is the only thing
// standing between the 3-free-questions offer and someone farming it with
// fake contact info, so email format + disposable-domain + mail-server
// checks and real phone-number-format validation all happen before a lead
// is created. Uniqueness (one email, one phone, one shot) is enforced in
// upsertFreebieLead itself.

import { NextRequest, NextResponse } from "next/server";
import { isValidPhoneNumber } from "libphonenumber-js";
import { createOrUpdateLead } from "@/lib/close";
import { subscribeToForm as kitSubscribe } from "@/lib/kit";
import { pingFreebieOptIn } from "@/lib/discord";
import { upsertFreebieLead, TradingExperience } from "@/lib/db";
import { isDisposableEmailDomain, domainHasMailServer } from "@/lib/email-validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
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
  const phone = clean(body.phone, 24);
  const experience = clean(body.experience, 20) as TradingExperience;

  if (!first_name) return NextResponse.json({ error: "Missing name" }, { status: 400 });
  if (!VALID_EXPERIENCE.includes(experience)) return NextResponse.json({ error: "Missing trading experience" }, { status: 400 });

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  const domain = email.split("@")[1] ?? "";
  if (isDisposableEmailDomain(domain)) {
    return NextResponse.json({ error: "Please use a real, permanent email address" }, { status: 400 });
  }
  if (!(await domainHasMailServer(domain))) {
    return NextResponse.json({ error: "That email domain doesn't look like it can receive mail — check for a typo" }, { status: 400 });
  }

  if (!phone || !isValidPhoneNumber(phone)) {
    return NextResponse.json({ error: "Enter a valid phone number with country code" }, { status: 400 });
  }

  const { lead, created } = await upsertFreebieLead({ email, first_name, last_name, phone, experience });

  // Fire-and-forget CRM side-effects — same pattern as /api/lead and /api/free-course.
  Promise.allSettled([
    // Distinct lead status so these don't mix into the regular sales-funnel
    // lead statuses in Close.
    createOrUpdateLead({ first_name, last_name, email: lead.email, phone, status: "Freebie - Opted In", source: "Cue AI Freebie" }),
    kitSubscribe({ email: lead.email, first_name, last_name, phone }),
    pingFreebieOptIn({ first_name, last_name, email: lead.email, phone, experience, created }),
  ]).then(([closeRes, kitRes, discordRes]) => {
    if (closeRes.status === "rejected") console.error("[/api/freebie/optin] Close failed:", closeRes.reason);
    if (kitRes.status === "rejected") console.error("[/api/freebie/optin] Kit failed:", kitRes.reason);
    if (discordRes.status === "rejected") console.error("[/api/freebie/optin] Discord failed:", discordRes.reason);
  });

  // Return the canonical email (may differ from what was typed if this phone
  // or email was already tied to an existing lead) so the client uses the
  // right key for every subsequent /api/freebie/cue call.
  return NextResponse.json({ ok: true, email: lead.email, questions_asked: lead.questions_asked });
}
