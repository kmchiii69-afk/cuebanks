import { createClient, SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

let _client: SupabaseClient | null = null;
export function db() {
  if (!_client) {
    _client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }
  return _client;
}

const TABLE = 'wsa_members';

export type Plan = '5k' | '7.5k' | '15k' | 'low_ticket';

export interface Member {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'member' | 'admin';
  active: boolean;
  cohort: string;
  discord_id: string;
  notes: string;
  created_at: number;
  last_login: number;
  current_phase: number;
  plan: Plan;
  expires_at: string | null; // ISO timestamp, null = no expiry (admins)
  goal: string;
  onboarded: boolean;
  portal_unlocked: boolean;
  skip_contract: boolean;
  reset_token_hash: string | null;
  reset_token_expires: number | null; // epoch ms
}

export type PublicMember = Omit<Member, 'password_hash'>;

export async function getMember(email: string): Promise<Member | null> {
  const { data } = await db()
    .from(TABLE)
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();
  return data ?? null;
}

export async function getAllMembers(): Promise<Member[]> {
  const { data } = await db()
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function memberExists(email: string): Promise<boolean> {
  const { data } = await db()
    .from(TABLE)
    .select('email')
    .eq('email', email.toLowerCase().trim())
    .single();
  return !!data;
}

export async function createMember(input: {
  email: string;
  password: string;
  name?: string;
  role?: 'member' | 'admin';
  cohort?: string;
  plan?: Plan;
  skip_contract?: boolean;
}): Promise<Member> {
  const email = input.email.toLowerCase().trim();
  const password_hash = await bcrypt.hash(input.password, 12);
  const now = Date.now();
  const isAdmin = input.role === 'admin';
  // 4 months from now for members; no expiry for admins
  const expiresAt = isAdmin ? null : new Date(Date.now() + 4 * 30 * 24 * 60 * 60 * 1000).toISOString();
  const record = {
    email,
    password_hash,
    name: input.name || '',
    role: input.role || 'member',
    active: true,
    cohort: input.cohort || '',
    discord_id: '',
    notes: '',
    created_at: now,
    last_login: 0,
    plan: isAdmin ? '5k' : (input.plan || '5k'),
    expires_at: expiresAt,
    goal: '',
    onboarded: false,
    portal_unlocked: isAdmin,
    skip_contract: input.skip_contract ?? false,
    reset_token_hash: null,
    reset_token_expires: null,
  };
  const { data, error } = await db().from(TABLE).insert(record).select().single();
  if (error) throw error;
  return data ?? record;
}

export async function updateMember(
  email: string,
  updates: Partial<Omit<Member, 'email' | 'password_hash' | 'id'>>
): Promise<Member | null> {
  const { data } = await db()
    .from(TABLE)
    .update(updates)
    .eq('email', email.toLowerCase().trim())
    .select()
    .single();
  return data ?? null;
}

export async function updatePassword(email: string, newPassword: string): Promise<void> {
  const hash = await bcrypt.hash(newPassword, 12);
  await db()
    .from(TABLE)
    .update({ password_hash: hash })
    .eq('email', email.toLowerCase().trim());
}

export async function setResetToken(email: string, tokenHash: string, expiresAt: number): Promise<void> {
  await db()
    .from(TABLE)
    .update({ reset_token_hash: tokenHash, reset_token_expires: expiresAt })
    .eq('email', email.toLowerCase().trim());
}

export async function clearResetToken(email: string): Promise<void> {
  await db()
    .from(TABLE)
    .update({ reset_token_hash: null, reset_token_expires: null })
    .eq('email', email.toLowerCase().trim());
}

export async function validateCredentials(email: string, password: string): Promise<Member | null> {
  const member = await getMember(email);
  if (!member || !member.active) return null;
  if (member.role !== 'admin' && member.expires_at && new Date(member.expires_at) < new Date()) return null;
  const valid = await bcrypt.compare(password, member.password_hash);
  return valid ? member : null;
}

export async function deleteMember(email: string): Promise<void> {
  await db()
    .from(TABLE)
    .delete()
    .eq('email', email.toLowerCase().trim());
}

export async function recordLogin(email: string): Promise<void> {
  await db()
    .from(TABLE)
    .update({ last_login: Date.now() })
    .eq('email', email.toLowerCase().trim());
}

// ─── Webinars ────────────────────────────────────────────────────────────────

const WEBINARS_TABLE = 'wsa_webinars';

export interface Webinar {
  id: string;
  title: string;
  description: string;
  scheduled_at: string; // ISO 8601
  join_link: string;
  recording_url: string;
  is_published: boolean;
  created_at: string;
  created_by: string;
}

export async function getWebinars(): Promise<Webinar[]> {
  const { data } = await db()
    .from(WEBINARS_TABLE)
    .select('*')
    .eq('is_published', true)
    .order('scheduled_at', { ascending: false });
  return data ?? [];
}

export async function getAllWebinars(): Promise<Webinar[]> {
  const { data } = await db()
    .from(WEBINARS_TABLE)
    .select('*')
    .order('scheduled_at', { ascending: false });
  return data ?? [];
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
  const record = {
    title: input.title,
    description: input.description ?? '',
    scheduled_at: input.scheduled_at,
    join_link: input.join_link ?? '',
    recording_url: input.recording_url ?? '',
    is_published: input.is_published ?? true,
    created_by: input.created_by ?? '',
  };
  const { data, error } = await db().from(WEBINARS_TABLE).insert(record).select().single();
  if (error) throw error;
  return data;
}

export async function updateWebinar(
  id: string,
  updates: Partial<Omit<Webinar, 'id' | 'created_at'>>
): Promise<Webinar | null> {
  const { data } = await db()
    .from(WEBINARS_TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return data ?? null;
}

export async function deleteWebinar(id: string): Promise<void> {
  await db().from(WEBINARS_TABLE).delete().eq('id', id);
}

// ─── Chat History ─────────────────────────────────────────────────────────────

const CHAT_HISTORY_TABLE = 'wsa_chat_history';
const CHAT_ANALYTICS_TABLE = 'wsa_chat_analytics';

export interface ChatHistoryMessage {
  id: string;
  member_email: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export async function getChatHistory(email: string, limit = 100): Promise<ChatHistoryMessage[]> {
  const { data } = await db()
    .from(CHAT_HISTORY_TABLE)
    .select('id, member_email, role, content, created_at')
    .eq('member_email', email.toLowerCase().trim())
    .order('created_at', { ascending: true })
    .limit(limit);
  return (data ?? []) as ChatHistoryMessage[];
}

export async function saveChatMessages(
  email: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<void> {
  const rows = messages.map(m => ({
    member_email: email.toLowerCase().trim(),
    role: m.role,
    content: m.content,
  }));
  await db().from(CHAT_HISTORY_TABLE).insert(rows);
}

export async function saveChatAnalytic(email: string, plan: string, question: string, answer = ''): Promise<void> {
  await db().from(CHAT_ANALYTICS_TABLE).insert({
    member_email: email.toLowerCase().trim(),
    plan,
    question,
    answer,
  });
}

// ─── Cue AI Instructions ──────────────────────────────────────────────────────

const CUE_INSTRUCTIONS_TABLE = 'wsa_cue_instructions';

export type InstructionType = 'do' | 'dont';

export interface CueInstruction {
  id: string;
  type: InstructionType;
  instruction: string;
  active: boolean;
  created_at: string;
  created_by: string;
}

export async function getCueInstructions(): Promise<CueInstruction[]> {
  const { data } = await db()
    .from(CUE_INSTRUCTIONS_TABLE)
    .select('*')
    .order('created_at', { ascending: true });
  return (data ?? []) as CueInstruction[];
}

export async function getActiveCueInstructions(): Promise<CueInstruction[]> {
  const { data } = await db()
    .from(CUE_INSTRUCTIONS_TABLE)
    .select('id, type, instruction')
    .eq('active', true)
    .order('created_at', { ascending: true });
  return (data ?? []) as CueInstruction[];
}

export async function createCueInstruction(input: {
  type: InstructionType;
  instruction: string;
  created_by: string;
}): Promise<CueInstruction> {
  const { data, error } = await db()
    .from(CUE_INSTRUCTIONS_TABLE)
    .insert({ type: input.type, instruction: input.instruction.trim(), active: true, created_by: input.created_by })
    .select()
    .single();
  if (error) throw error;
  return data as CueInstruction;
}

export async function updateCueInstruction(
  id: string,
  updates: Partial<Pick<CueInstruction, 'instruction' | 'active'>>
): Promise<CueInstruction | null> {
  const { data } = await db()
    .from(CUE_INSTRUCTIONS_TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return data ?? null;
}

export async function deleteCueInstruction(id: string): Promise<void> {
  await db().from(CUE_INSTRUCTIONS_TABLE).delete().eq('id', id);
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
  let q = db()
    .from(CHAT_ANALYTICS_TABLE)
    .select('id, member_email, plan, question, answer, created_at')
    .order('created_at', { ascending: false })
    .limit(1000);
  if (plan && plan !== 'all') q = q.eq('plan', plan);
  const { data } = await q;
  return (data ?? []) as AnalyticRow[];
}

// ─── Cue AI Freebie (public lead magnet — "ask Cue AI 3 questions") ───────────

const FREEBIE_LEADS_TABLE = 'wsa_freebie_leads';

export type TradingExperience = 'under_1y' | '1_3y' | '3_5y' | '5y_plus';

export interface FreebieLead {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  experience: TradingExperience | '';
  questions_asked: number;
  created_at: string;
}

export async function getFreebieLead(email: string): Promise<FreebieLead | null> {
  const { data } = await db()
    .from(FREEBIE_LEADS_TABLE)
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();
  return (data as FreebieLead) ?? null;
}

/** Creates the lead on first opt-in; returns the existing row unchanged if they opt in again. */
export async function upsertFreebieLead(input: {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  experience: TradingExperience;
}): Promise<FreebieLead> {
  const cleanEmail = input.email.toLowerCase().trim();
  const existing = await getFreebieLead(cleanEmail);
  if (existing) return existing;
  const { data, error } = await db()
    .from(FREEBIE_LEADS_TABLE)
    .insert({
      email: cleanEmail,
      first_name: input.first_name,
      last_name: input.last_name,
      phone: input.phone,
      experience: input.experience,
      questions_asked: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data as FreebieLead;
}

export async function incrementFreebieQuestions(email: string): Promise<void> {
  const lead = await getFreebieLead(email);
  if (!lead) return;
  await db()
    .from(FREEBIE_LEADS_TABLE)
    .update({ questions_asked: lead.questions_asked + 1 })
    .eq('email', email.toLowerCase().trim());
}
