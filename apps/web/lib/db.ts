/**
 * Data access layer — Convex-backed (replaces Supabase).
 * Member CRUD + secret-gated helpers for Next routes (auth, freebie, cue stream).
 * Portal/admin list UIs use convex/react directly.
 */
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { PhaseProgress } from "./phases";
import { convexClient } from "./convexClient";
import { authSecret } from "./secret";

function client() {
  return convexClient();
}

function secret() {
  return authSecret();
}

export type Plan = "5k" | "7.5k" | "15k" | "low_ticket";

export interface Member {
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
  phase_progress: PhaseProgress;
  plan: Plan;
  expires_at: string | null;
  goal: string;
  onboarded: boolean;
  portal_unlocked: boolean;
  skip_contract: boolean;
  reset_token_hash: string | null;
  reset_token_expires: number | null;
}

export type PublicMember = Omit<
  Member,
  "reset_token_hash" | "reset_token_expires"
>;

export async function getMember(email: string): Promise<Member | null> {
  return (await client().query(api.members.getByEmail, {
    email,
    secret: secret(),
  })) as Member | null;
}

export async function getUserRole(
  email: string,
): Promise<"member" | "admin" | "team" | null> {
  return await client().query(api.users.getRoleByEmail, {
    email,
    secret: secret(),
  });
}

export async function getAllMembers(): Promise<Member[]> {
  return (await client().query(api.members.list, {
    secret: secret(),
  })) as Member[];
}

export async function memberExists(email: string): Promise<boolean> {
  return await client().query(api.members.exists, {
    email,
    secret: secret(),
  });
}

export async function createMember(input: {
  email: string;
  password?: string;
  name?: string;
  role?: "member" | "admin" | "team";
  cohort?: string;
  plan?: Plan;
  skip_contract?: boolean;
  portal_unlocked?: boolean;
}): Promise<Member> {
  return (await client().mutation(api.members.create, {
    secret: secret(),
    email: input.email,
    name: input.name,
    role: input.role,
    cohort: input.cohort,
    plan: input.plan,
    skipContract: input.skip_contract,
    portalUnlocked: input.portal_unlocked,
  })) as Member;
}

type SnakeUpdates = Partial<Omit<Member, "email" | "id" | "created_at">>;

function toCamelUpdate(updates: SnakeUpdates) {
  return {
    name: updates.name,
    role: updates.role,
    active: updates.active,
    cohort: updates.cohort,
    discordId: updates.discord_id,
    notes: updates.notes,
    lastLogin: updates.last_login,
    currentPhase: updates.current_phase,
    phaseProgress: updates.phase_progress,
    plan: updates.plan,
    expiresAt: updates.expires_at,
    goal: updates.goal,
    onboarded: updates.onboarded,
    portalUnlocked: updates.portal_unlocked,
    skipContract: updates.skip_contract,
    resetTokenHash: updates.reset_token_hash,
    resetTokenExpires: updates.reset_token_expires,
  };
}

export async function updateMember(
  email: string,
  updates: SnakeUpdates,
): Promise<Member | null> {
  return (await client().mutation(api.members.update, {
    secret: secret(),
    email,
    ...toCamelUpdate(updates),
  })) as Member | null;
}

/** Passwords live in Convex Auth — synced via api.authMigrate.syncPassword. */
export async function updatePassword(_email: string, _newPassword: string): Promise<void> {
  // no-op for member row; callers sync via syncConvexPassword
}

export async function setResetToken(email: string, tokenHash: string, expiresAt: number): Promise<void> {
  await updateMember(email, {
    reset_token_hash: tokenHash,
    reset_token_expires: expiresAt,
  });
}

export async function clearResetToken(email: string): Promise<void> {
  await updateMember(email, {
    reset_token_hash: null,
    reset_token_expires: null,
  });
}

/** @deprecated Convex Auth validates passwords. Kept for transitional callers. */
export async function validateCredentials(
  _email: string,
  _password: string,
): Promise<Member | null> {
  return null;
}

export async function deleteMember(email: string): Promise<void> {
  await client().mutation(api.members.remove, {
    secret: secret(),
    email,
  });
}

export async function recordLogin(email: string): Promise<void> {
  await client().mutation(api.members.recordLogin, {
    secret: secret(),
    email,
  });
}

// ─── Next-only helpers (streaming cue + public freebie funnels) ──────────────
// Admin/portal CRUD for webinars, cue instructions, chat, and freebie lists
// lives in Convex (`useQuery` / `useMutation`). These helpers remain for
// secret-gated server routes that cannot use the browser Convex client.

export type InstructionType = "do" | "dont";

export interface CueInstruction {
  id: string;
  type: InstructionType;
  instruction: string;
  active: boolean;
  created_at: string;
  created_by: string;
}

export async function getCueInstructions(): Promise<CueInstruction[]> {
  return (await client().query(api.cueInstructions.adminList, {
    secret: secret(),
  })) as CueInstruction[];
}

export async function getActiveCueInstructions(): Promise<CueInstruction[]> {
  return (await client().query(api.cueInstructions.listActiveForServer, {
    secret: secret(),
  })) as CueInstruction[];
}

export async function createCueInstruction(input: {
  type: InstructionType;
  instruction: string;
  created_by: string;
}): Promise<CueInstruction> {
  return (await client().mutation(api.cueInstructions.adminCreateServer, {
    secret: secret(),
    type: input.type,
    instruction: input.instruction,
    createdBy: input.created_by,
  })) as CueInstruction;
}

export async function updateCueInstruction(
  id: string,
  updates: { active?: boolean; instruction?: string },
): Promise<CueInstruction | null> {
  return (await client().mutation(api.cueInstructions.adminUpdate, {
    id: id as Id<"cueInstructions">,
    instruction: updates.instruction,
    active: updates.active,
  })) as CueInstruction | null;
}

export async function deleteCueInstruction(id: string): Promise<void> {
  await client().mutation(api.cueInstructions.adminRemove, {
    id: id as Id<"cueInstructions">,
  });
}

// ─── Chat History ─────────────────────────────────────────────────────────────

export interface ChatHistoryMessage {
  id: string;
  member_email: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export async function getChatHistory(
  email: string,
  limit = 100,
): Promise<ChatHistoryMessage[]> {
  return (await client().query(api.chat.listForMeServer, {
    secret: secret(),
    memberEmail: email,
    limit,
  })) as ChatHistoryMessage[];
}

export async function saveChatMessages(
  email: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
): Promise<void> {
  await client().mutation(api.chat.saveManyForMember, {
    secret: secret(),
    memberEmail: email,
    messages,
  });
}

export async function saveChatAnalytic(
  email: string,
  plan: string,
  question: string,
  answer = "",
): Promise<void> {
  await client().mutation(api.chat.recordAnalytic, {
    secret: secret(),
    memberEmail: email,
    plan,
    question,
    answer,
  });
}

// ─── Analytics (admin) ────────────────────────────────────────────────────────

export interface AnalyticRow {
  id: string;
  member_email: string;
  plan: string;
  question: string;
  answer: string;
  created_at: string;
}

export async function getChatAnalytics(plan?: string): Promise<AnalyticRow[]> {
  return (await client().query(api.chat.adminListAnalyticsServer, {
    secret: secret(),
    plan,
  })) as AnalyticRow[];
}

// ─── Cue AI Freebie (public lead magnet — "ask Cue AI 3 questions") ───────────

export type TradingExperience = "under_1y" | "1_3y" | "3_5y" | "5y_plus";

export interface FreebieLead {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  experience: TradingExperience | "";
  questions_asked: number;
  clicked_cta: boolean;
  created_at: string;
}

export interface FreebieQA {
  id: string;
  email: string;
  question: string;
  answer: string;
  created_at: string;
}

export async function getFreebieLead(email: string): Promise<FreebieLead | null> {
  return (await client().query(api.freebie.getLeadByEmail, {
    secret: secret(),
    email,
  })) as FreebieLead | null;
}

export async function getFreebieLeadByPhone(phone: string): Promise<FreebieLead | null> {
  if (!phone) return null;
  return (await client().query(api.freebie.getLeadByPhone, {
    secret: secret(),
    phone,
  })) as FreebieLead | null;
}

/**
 * Creates the lead on first opt-in. If this email OR this phone number has
 * already been used, returns the existing row untouched.
 */
export async function upsertFreebieLead(input: {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  experience: TradingExperience;
}): Promise<{ lead: FreebieLead; created: boolean }> {
  return (await client().mutation(api.freebie.upsertLead, {
    secret: secret(),
    email: input.email,
    firstName: input.first_name,
    lastName: input.last_name,
    phone: input.phone,
    experience: input.experience,
  })) as { lead: FreebieLead; created: boolean };
}

export async function incrementFreebieQuestions(email: string): Promise<void> {
  await client().mutation(api.freebie.incrementQuestions, {
    email,
    secret: secret(),
  });
}

export async function markFreebieCtaClicked(email: string): Promise<void> {
  await client().mutation(api.freebie.markCtaClicked, {
    secret: secret(),
    email,
  });
}

export async function getAllFreebieLeads(): Promise<FreebieLead[]> {
  return (await client().query(api.freebie.adminListLeads, {
    secret: secret(),
  })) as FreebieLead[];
}

export async function saveFreebieQA(email: string, question: string, answer: string): Promise<void> {
  await client().mutation(api.freebie.saveQa, {
    secret: secret(),
    email,
    question,
    answer,
  });
}

export async function getAllFreebieQA(): Promise<FreebieQA[]> {
  return (await client().query(api.freebie.adminListQa, {
    secret: secret(),
  })) as FreebieQA[];
}

// ─── Webinars ────────────────────────────────────────────────────────────────

export interface Webinar {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  join_link: string;
  recording_url: string;
  is_published: boolean;
  created_at: string;
  created_by: string;
}

/** Published webinars for portal members. (Auth-required Convex query.) */
export async function getWebinars(): Promise<Webinar[]> {
  return (await client().query(api.webinars.adminListServer, {
    secret: secret(),
  })) as Webinar[];
}

export async function getAllWebinars(): Promise<Webinar[]> {
  return (await client().query(api.webinars.adminListServer, {
    secret: secret(),
  })) as Webinar[];
}

export async function createWebinar(input: {
  title: string;
  description?: string;
  scheduled_at: string;
  join_link?: string;
  recording_url?: string;
  is_published?: boolean;
  created_by?: string;
}): Promise<Webinar> {
  return (await client().mutation(api.webinars.adminCreateServer, {
    secret: secret(),
    title: input.title,
    description: input.description,
    scheduledAt: input.scheduled_at,
    joinLink: input.join_link,
    recordingUrl: input.recording_url,
    isPublished: input.is_published,
  })) as Webinar;
}

export async function updateWebinar(
  id: string,
  updates: Partial<Omit<Webinar, "id" | "created_at">>,
): Promise<Webinar | null> {
  return (await client().mutation(api.webinars.adminUpdateServer, {
    secret: secret(),
    id: id as Id<"webinars">,
    title: updates.title,
    description: updates.description,
    scheduledAt: updates.scheduled_at,
    joinLink: updates.join_link,
    recordingUrl: updates.recording_url,
    isPublished: updates.is_published,
  })) as Webinar | null;
}

export async function deleteWebinar(id: string): Promise<void> {
  await client().mutation(api.webinars.adminRemoveServer, {
    secret: secret(),
    id: id as Id<"webinars">,
  });
}
