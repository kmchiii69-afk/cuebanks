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
