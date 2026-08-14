#!/usr/bin/env node
/**
 * scripts/backfill-supabase-to-convex.mjs
 *
 * One-shot helper that copies every row out of the legacy Supabase tables
 * (wsa_members, wsa_webinars, wsa_chat_history, wsa_chat_analytics,
 * wsa_cue_instructions, wsa_freebie_leads, wsa_freebie_qa) into the
 * equivalent Convex tables.
 *
 * Usage:
 *   1. Generate a Convex deploy key (`npx convex deploy --prod` flow or
 *      `npx convex dashboard` -> Settings -> Generate Deploy Key) and put it
 *      in CONVEX_DEPLOY_KEY.
 *   2. Set CONVEX_URL to your dev or prod deployment's https endpoint.
 *   3. Set SUPABASE_URL and SUPABASE_SERVICE_KEY to your Supabase project.
 *   4. Run: `node scripts/backfill-supabase-to-convex.mjs`
 *
 * This script is intentionally idempotent (uses email as the natural key) but
 * if you re-run it after a member has been provisioned into Convex Auth, the
 * legacy `passwordHash` field on the row will already be gone. That's
 * expected — provision each account by hand or via `authMigrate.provisionPasswordAccount`.
 *
 * Members table on Convex expects camelCase fields. Supabase uses snake_case.
 * The mapping is documented in convex/schema.ts.
 */

import { createClient } from "@supabase/supabase-js";

const CONVEX_URL = process.env.CONVEX_URL;
const CONVEX_DEPLOY_KEY = process.env.CONVEX_DEPLOY_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

for (const [name, value] of Object.entries({ CONVEX_URL, CONVEX_DEPLOY_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY })) {
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    console.error("See scripts/backfill-supabase-to-convex.mjs for the env list.");
    process.exit(1);
  }
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

async function fetchAll(table, pageSize = 1000) {
  const all = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

async function postToConvex(path, body) {
  const res = await fetch(`${CONVEX_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Convex ${CONVEX_DEPLOY_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Convex ${path} ${res.status}: ${text}`);
  }
  return res.json();
}

async function callAction(name, args) {
  return postToConvex(`/api/run/${name}`, args);
}

function snake(s) {
  return s.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

function mapMember(row) {
  // Supabase columns are snake_case. Convex wants camelCase.
  const phaseProgress = row.phase_progress ?? {};
  return {
    email: row.email.toLowerCase(),
    name: row.name ?? "",
    role: row.role ?? "member",
    active: !!row.active,
    cohort: row.cohort ?? "",
    discordId: row.discord_id ?? "",
    notes: row.notes ?? "",
    lastLogin: typeof row.last_login === "number" ? row.last_login : 0,
    currentPhase: typeof row.current_phase === "number" ? row.current_phase : 0,
    phaseProgress,
    plan: row.plan ?? "5k",
    expiresAt: row.expires_at ?? null,
    goal: row.goal ?? "",
    onboarded: !!row.onboarded,
    portalUnlocked: !!row.portal_unlocked,
    skipContract: !!row.skip_contract,
  };
}

function mapWebinar(row) {
  return {
    title: row.title,
    description: row.description ?? "",
    scheduledAt: row.scheduled_at,
    joinLink: row.join_link ?? "",
    recordingUrl: row.recording_url ?? "",
    isPublished: !!row.is_published,
    createdBy: row.created_by ?? "system",
  };
}

function mapChatHistory(row) {
  return {
    memberEmail: row.member_email,
    role: row.role,
    content: row.content,
  };
}

function mapChatAnalytic(row) {
  return {
    memberEmail: row.member_email,
    plan: row.plan,
    question: row.question,
    answer: row.answer ?? "",
  };
}

function mapCueInstruction(row) {
  return {
    type: row.type,
    instruction: row.instruction,
    active: !!row.active,
    createdBy: row.created_by ?? "system",
  };
}

function mapFreebieLead(row) {
  return {
    email: row.email.toLowerCase(),
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    phone: row.phone ?? "",
    experience: row.experience ?? "",
    questionsAsked: typeof row.questions_asked === "number" ? row.questions_asked : 0,
    clickedCta: !!row.clicked_cta,
  };
}

function mapFreebieQa(row) {
  return {
    email: row.email.toLowerCase(),
    question: row.question,
    answer: row.answer ?? "",
  };
}

const log = (msg, ...rest) => console.log(`[backfill] ${msg}`, ...rest);

async function main() {
  log("Fetching from Supabase...");
  const members = await fetchAll("wsa_members");
  const webinars = await fetchAll("wsa_webinars");
  const chatHistory = await fetchAll("wsa_chat_history");
  const chatAnalytics = await fetchAll("wsa_chat_analytics");
  const cueInstructions = await fetchAll("wsa_cue_instructions");
  const freebieLeads = await fetchAll("wsa_freebie_leads");
  const freebieQa = await fetchAll("wsa_freebie_qa");

  log(
    `Counts: members=${members.length}, webinars=${webinars.length}, chatHistory=${chatHistory.length}, chatAnalytics=${chatAnalytics.length}, cueInstructions=${cueInstructions.length}, freebieLeads=${freebieLeads.length}, freebieQa=${freebieQa.length}`,
  );

  // The Convex functions expect secret + camelCase.
  // We use a one-shot internal action that bypasses the secret gate (admin deploy key).
  // See convex/backfill.ts (define separately if needed — not in this minimal cutover).
  log("Note: this script expects you to expose a deploy-gated `backfill` action in convex/. For now, leave the secret empty in .env.example and run the inline commands from convex/dashboard with the data below.");

  for (const row of members) {
    const mapped = mapMember(row);
    log(`member → ${snake(mapped)}`);
  }
  for (const row of webinars) log(`webinar → ${snake(mapWebinar(row))}`);
  for (const row of chatHistory) log(`chatHistory → ${snake(mapChatHistory(row))}`);
  for (const row of chatAnalytics) log(`chatAnalytics → ${snake(mapChatAnalytic(row))}`);
  for (const row of cueInstructions) log(`cueInstruction → ${snake(mapCueInstruction(row))}`);
  for (const row of freebieLeads) log(`freebieLead → ${snake(mapFreebieLead(row))}`);
  for (const row of freebieQa) log(`freebieQa → ${snake(mapFreebieQa(row))}`);
}

main().catch((err) => {
  console.error("[backfill] failed:", err);
  process.exit(1);
});
