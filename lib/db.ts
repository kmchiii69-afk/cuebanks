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
  current_phase: number; // 0 = not started, 1-6 = active phase
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
}): Promise<Member> {
  const email = input.email.toLowerCase().trim();
  const password_hash = await bcrypt.hash(input.password, 12);
  const now = Date.now();
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

export async function validateCredentials(email: string, password: string): Promise<Member | null> {
  const member = await getMember(email);
  if (!member || !member.active) return null;
  const valid = await bcrypt.compare(password, member.password_hash);
  return valid ? member : null;
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
