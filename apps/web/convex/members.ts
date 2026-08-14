import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import {
  assertBootstrapSecret,
  phaseCompletionValidator,
  planValidator,
  roleValidator,
} from "./lib/bootstrap";
import { syncUserRole } from "./lib/userRole";
import { requireAdminUser } from "./users";

/** API-facing snake_case shape (safe for clients — never includes secrets). */
const memberPublicValidator = v.object({
  id: v.string(),
  email: v.string(),
  name: v.string(),
  role: roleValidator,
  active: v.boolean(),
  cohort: v.string(),
  discord_id: v.string(),
  notes: v.string(),
  created_at: v.number(),
  last_login: v.number(),
  current_phase: v.number(),
  phase_progress: v.record(v.string(), phaseCompletionValidator),
  plan: planValidator,
  expires_at: v.union(v.string(), v.null()),
  goal: v.string(),
  onboarded: v.boolean(),
  portal_unlocked: v.boolean(),
  skip_contract: v.boolean(),
});

export function toPublicMember(doc: Doc<"members">) {
  return {
    id: doc._id,
    email: doc.email,
    name: doc.name,
    role: doc.role,
    active: doc.active,
    cohort: doc.cohort,
    discord_id: doc.discordId,
    notes: doc.notes,
    created_at: doc._creationTime,
    last_login: doc.lastLogin,
    current_phase: doc.currentPhase,
    phase_progress: doc.phaseProgress,
    plan: doc.plan,
    expires_at: doc.expiresAt,
    goal: doc.goal,
    onboarded: doc.onboarded,
    portal_unlocked: doc.portalUnlocked,
    skip_contract: doc.skipContract,
  };
}

/** Secret-gated server shape — reset tokens only, never password hashes. */
const memberInternalValidator = memberPublicValidator.extend({
  reset_token_hash: v.union(v.string(), v.null()),
  reset_token_expires: v.union(v.number(), v.null()),
});

function toInternalMember(doc: Doc<"members">) {
  return {
    ...toPublicMember(doc),
    reset_token_hash: doc.resetTokenHash,
    reset_token_expires: doc.resetTokenExpires,
  };
}

/** Logged-in member profile (no password). */
export const me = query({
  args: {},
  returns: v.union(memberPublicValidator, v.null()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user?.email) return null;

    let member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", user.email!.toLowerCase()))
      .unique();

    if (!member) {
      member = await ctx.db
        .query("members")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();
    }
    if (!member || !member.active) return null;

    return toPublicMember(member);
  },
});

export const getByEmail = query({
  args: { email: v.string(), secret: v.string() },
  returns: v.union(memberInternalValidator, v.null()),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    return member ? toInternalMember(member) : null;
  },
});

export const exists = query({
  args: { email: v.string(), secret: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    return !!member;
  },
});

export const list = query({
  args: { secret: v.string() },
  returns: v.array(memberInternalValidator),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const rows = await ctx.db.query("members").order("desc").take(500);
    return rows.map(toInternalMember);
  },
});

export const create = mutation({
  args: {
    secret: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.optional(roleValidator),
    cohort: v.optional(v.string()),
    plan: v.optional(planValidator),
    skipContract: v.optional(v.boolean()),
    portalUnlocked: v.optional(v.boolean()),
    userId: v.optional(v.id("users")),
  },
  returns: memberInternalValidator,
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const email = args.email.toLowerCase().trim();
    const existing = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) {
      throw new Error("An account with this email already exists");
    }

    const role = args.role ?? "member";
    const isStaff = role === "admin" || role === "team";
    const expiresAt = isStaff
      ? null
      : new Date(Date.now() + 4 * 30 * 24 * 60 * 60 * 1000).toISOString();

    const id = await ctx.db.insert("members", {
      userId: args.userId,
      email,
      name: args.name?.trim() || "",
      role,
      active: true,
      cohort: args.cohort ?? "",
      discordId: "",
      notes: "",
      lastLogin: 0,
      currentPhase: 0,
      phaseProgress: {},
      plan: isStaff ? "5k" : (args.plan ?? "5k"),
      expiresAt,
      goal: "",
      onboarded: false,
      portalUnlocked: args.portalUnlocked ?? isStaff,
      skipContract: args.skipContract ?? false,
      resetTokenHash: null,
      resetTokenExpires: null,
    });

    const doc = await ctx.db.get(id);
    if (!doc) throw new Error("Failed to create member");
    await syncUserRole(ctx, args.userId, role);
    return toInternalMember(doc);
  },
});

export const update = mutation({
  args: {
    secret: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.optional(roleValidator),
    active: v.optional(v.boolean()),
    cohort: v.optional(v.string()),
    discordId: v.optional(v.string()),
    notes: v.optional(v.string()),
    lastLogin: v.optional(v.number()),
    currentPhase: v.optional(v.number()),
    phaseProgress: v.optional(v.record(v.string(), phaseCompletionValidator)),
    plan: v.optional(planValidator),
    expiresAt: v.optional(v.union(v.string(), v.null())),
    goal: v.optional(v.string()),
    onboarded: v.optional(v.boolean()),
    portalUnlocked: v.optional(v.boolean()),
    skipContract: v.optional(v.boolean()),
    resetTokenHash: v.optional(v.union(v.string(), v.null())),
    resetTokenExpires: v.optional(v.union(v.number(), v.null())),
    userId: v.optional(v.id("users")),
  },
  returns: v.union(memberInternalValidator, v.null()),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    if (!member) return null;

    const { secret, email, ...patch } = args;
    void secret;
    void email;

    const updates: Partial<Doc<"members">> = {};
    if (patch.name !== undefined) updates.name = patch.name;
    if (patch.role !== undefined) updates.role = patch.role;
    if (patch.active !== undefined) updates.active = patch.active;
    if (patch.cohort !== undefined) updates.cohort = patch.cohort;
    if (patch.discordId !== undefined) updates.discordId = patch.discordId;
    if (patch.notes !== undefined) updates.notes = patch.notes;
    if (patch.lastLogin !== undefined) updates.lastLogin = patch.lastLogin;
    if (patch.currentPhase !== undefined) updates.currentPhase = patch.currentPhase;
    if (patch.phaseProgress !== undefined) updates.phaseProgress = patch.phaseProgress;
    if (patch.plan !== undefined) updates.plan = patch.plan;
    if (patch.expiresAt !== undefined) updates.expiresAt = patch.expiresAt;
    if (patch.goal !== undefined) updates.goal = patch.goal;
    if (patch.onboarded !== undefined) updates.onboarded = patch.onboarded;
    if (patch.portalUnlocked !== undefined) updates.portalUnlocked = patch.portalUnlocked;
    if (patch.skipContract !== undefined) updates.skipContract = patch.skipContract;
    if (patch.resetTokenHash !== undefined) updates.resetTokenHash = patch.resetTokenHash;
    if (patch.resetTokenExpires !== undefined) updates.resetTokenExpires = patch.resetTokenExpires;
    if (patch.userId !== undefined) updates.userId = patch.userId;

    await ctx.db.patch(member._id, updates);
    const updated = await ctx.db.get(member._id);
    if (updated) {
      const linkedUserId = updated.userId ?? patch.userId;
      if (patch.role !== undefined || patch.userId !== undefined) {
        await syncUserRole(ctx, linkedUserId, updated.role);
      }
    }
    return updated ? toInternalMember(updated) : null;
  },
});

export const remove = mutation({
  args: { secret: v.string(), email: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    if (member) await ctx.db.delete(member._id);
    return null;
  },
});

export const recordLogin = mutation({
  args: { secret: v.string(), email: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    if (member) await ctx.db.patch(member._id, { lastLogin: Date.now() });
    return null;
  },
});

export const linkUser = mutation({
  args: { secret: v.string(), email: v.string(), userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    if (member) {
      await ctx.db.patch(member._id, { userId: args.userId });
      await syncUserRole(ctx, args.userId, member.role);
    }
    return null;
  },
});

const TOTAL_PHASES = 8;

function isPhaseComplete(
  progress: Record<string, { status: string }>,
  id: number,
): boolean {
  return progress[String(id)]?.status === "complete";
}

function furthestUnlockedPhase(
  progress: Record<string, { status: string }>,
): number {
  let furthest = 1;
  for (let id = 1; id <= TOTAL_PHASES; id++) {
    if (isPhaseComplete(progress, id)) furthest = Math.min(id + 1, TOTAL_PHASES);
    else break;
  }
  return furthest;
}

/** Admin UI: list members (no secrets). */
export const adminList = query({
  args: {},
  returns: v.array(memberPublicValidator),
  handler: async (ctx) => {
    await requireAdminUser(ctx);
    const rows = await ctx.db.query("members").order("desc").take(500);
    return rows.map(toPublicMember);
  },
});

/** Admin UI: patch a member by email. */
export const adminUpdate = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    role: v.optional(roleValidator),
    active: v.optional(v.boolean()),
    cohort: v.optional(v.string()),
    discordId: v.optional(v.string()),
    notes: v.optional(v.string()),
    plan: v.optional(planValidator),
    expiresAt: v.optional(v.union(v.string(), v.null())),
    goal: v.optional(v.string()),
    onboarded: v.optional(v.boolean()),
    portalUnlocked: v.optional(v.boolean()),
    skipContract: v.optional(v.boolean()),
    currentPhase: v.optional(v.number()),
    phaseProgress: v.optional(v.record(v.string(), phaseCompletionValidator)),
  },
  returns: v.union(memberPublicValidator, v.null()),
  handler: async (ctx, args) => {
    const admin = await requireAdminUser(ctx);
    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    if (!member) return null;

    // Team accounts can't grant admin/team via edit.
    let role = args.role;
    if (admin.role === "team" && (role === "admin" || role === "team")) {
      role = undefined;
    }

    const updates: Partial<Doc<"members">> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (role !== undefined) updates.role = role;
    if (args.active !== undefined) updates.active = args.active;
    if (args.cohort !== undefined) updates.cohort = args.cohort;
    if (args.discordId !== undefined) updates.discordId = args.discordId;
    if (args.notes !== undefined) updates.notes = args.notes;
    if (args.plan !== undefined) updates.plan = args.plan;
    if (args.expiresAt !== undefined) updates.expiresAt = args.expiresAt;
    if (args.goal !== undefined) updates.goal = args.goal;
    if (args.onboarded !== undefined) updates.onboarded = args.onboarded;
    if (args.portalUnlocked !== undefined) updates.portalUnlocked = args.portalUnlocked;
    if (args.skipContract !== undefined) updates.skipContract = args.skipContract;
    if (args.currentPhase !== undefined) updates.currentPhase = args.currentPhase;
    if (args.phaseProgress !== undefined) updates.phaseProgress = args.phaseProgress;

    await ctx.db.patch(member._id, updates);
    const updated = await ctx.db.get(member._id);
    if (updated && role !== undefined) {
      await syncUserRole(ctx, updated.userId, updated.role);
    }
    return updated ? toPublicMember(updated) : null;
  },
});

/** Admin UI: delete a member by email. */
export const adminRemove = mutation({
  args: { email: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdminUser(ctx);
    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    if (member) await ctx.db.delete(member._id);
    return null;
  },
});

/** Admin UI: complete or reopen a roadmap phase for a member. */
export const adminOverridePhase = mutation({
  args: {
    email: v.string(),
    phaseId: v.number(),
    action: v.union(v.literal("complete"), v.literal("reopen")),
  },
  returns: v.union(memberPublicValidator, v.null()),
  handler: async (ctx, args) => {
    await requireAdminUser(ctx);
    if (args.phaseId < 1 || args.phaseId > TOTAL_PHASES) {
      throw new Error("Invalid phase");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    if (!member) return null;

    const progress: Doc<"members">["phaseProgress"] = {
      ...(member.phaseProgress || {}),
    };

    if (args.action === "complete") {
      for (let id = 1; id <= args.phaseId; id++) {
        if (!isPhaseComplete(progress, id)) {
          progress[String(id)] = {
            status: "complete",
            completedAt: new Date().toISOString(),
            completedBy: "admin",
          };
        }
      }
    } else {
      for (let id = args.phaseId; id <= TOTAL_PHASES; id++) {
        delete progress[String(id)];
      }
    }

    const currentPhase = furthestUnlockedPhase(progress);
    await ctx.db.patch(member._id, {
      phaseProgress: progress,
      currentPhase,
    });
    const updated = await ctx.db.get(member._id);
    return updated ? toPublicMember(updated) : null;
  },
});

async function requireActiveMemberDoc(ctx: MutationCtx | QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Authentication required.");
  const user = await ctx.db.get(userId);
  if (!user?.email) throw new Error("Authentication required.");
  const email = user.email.toLowerCase();
  let member = await ctx.db
    .query("members")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();
  if (!member) {
    member = await ctx.db
      .query("members")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  }
  if (!member || !member.active) throw new Error("Member not found");
  return member;
}

const HOMEWORK_PHASES = new Set([1, 2, 5, 6]);

/** Portal: set onboarding goal. */
export const setGoal = mutation({
  args: { goal: v.string() },
  returns: memberPublicValidator,
  handler: async (ctx, args) => {
    const member = await requireActiveMemberDoc(ctx);
    const goal = args.goal.trim();
    if (!goal) throw new Error("goal required");
    await ctx.db.patch(member._id, { goal, onboarded: true });
    const updated = await ctx.db.get(member._id);
    return toPublicMember(updated!);
  },
});

/** Portal: mark a roadmap phase complete (member rules — no skip ahead). */
export const completePhase = mutation({
  args: {
    phaseId: v.number(),
    homeworkConfirmed: v.optional(v.boolean()),
  },
  returns: v.object({
    ok: v.boolean(),
    current_phase: v.number(),
    phase_progress: v.record(v.string(), phaseCompletionValidator),
  }),
  handler: async (ctx, args) => {
    const member = await requireActiveMemberDoc(ctx);
    if (args.phaseId < 1 || args.phaseId > TOTAL_PHASES) {
      throw new Error("Invalid phase");
    }

    const progress: Doc<"members">["phaseProgress"] = {
      ...(member.phaseProgress || {}),
    };

    if (isPhaseComplete(progress, args.phaseId)) {
      return {
        ok: true,
        current_phase: member.currentPhase,
        phase_progress: progress,
      };
    }

    if (args.phaseId > 1 && !isPhaseComplete(progress, args.phaseId - 1)) {
      throw new Error("Complete the previous phase first");
    }

    if (HOMEWORK_PHASES.has(args.phaseId) && !args.homeworkConfirmed) {
      throw new Error("Homework confirmation required");
    }

    progress[String(args.phaseId)] = {
      status: "complete",
      completedAt: new Date().toISOString(),
      completedBy: "member",
      ...(HOMEWORK_PHASES.has(args.phaseId) ? { homeworkConfirmed: true } : {}),
    };

    const currentPhase = furthestUnlockedPhase(progress);
    await ctx.db.patch(member._id, {
      phaseProgress: progress,
      currentPhase,
    });

    return {
      ok: true,
      current_phase: currentPhase,
      phase_progress: progress,
    };
  },
});
