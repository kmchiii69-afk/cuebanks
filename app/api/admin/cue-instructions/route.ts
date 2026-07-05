import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getMember, getCueInstructions, createCueInstruction, InstructionType } from '@/lib/db';

async function requireAdmin(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return null;
  const member = await getMember(user.email);
  if (!member || member.role !== 'admin') return null;
  return user;
}

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const instructions = await getCueInstructions();
  return NextResponse.json(instructions);
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { type, instruction } = body as { type?: string; instruction?: string };
  if (!type || !['do', 'dont'].includes(type)) return NextResponse.json({ error: 'type must be do or dont' }, { status: 400 });
  if (!instruction || typeof instruction !== 'string' || !instruction.trim()) return NextResponse.json({ error: 'instruction required' }, { status: 400 });
  if (instruction.trim().length > 500) return NextResponse.json({ error: 'instruction too long (max 500 chars)' }, { status: 400 });
  const row = await createCueInstruction({ type: type as InstructionType, instruction, created_by: user.email });
  return NextResponse.json(row, { status: 201 });
}
