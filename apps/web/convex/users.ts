import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { assertBootstrapSecret, roleValidator } from "./lib/bootstrap";
import { syncUserRole } from "./lib/userRole";

const userRoleValidator = v.union(
  v.literal("member"),
  v.literal("admin"),
  v.literal("team"),
);

export async function getAuthedUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  const user = await ctx.db.get(userId);
  if (!user?.email) return null;
  return user;
}

export async function requireAdminUser(ctx: QueryCtx | MutationCtx) {
  const user = await getAuthedUser(ctx);
  if (!user) throw new Error("Authentication required.");
  if (user.role !== "admin") throw new Error("Admin access required.");
  return user;
}

export const viewer = query({
  args: {},
  returns: v.union(
    v.object({
      userId: v.id("users"),
      email: v.string(),
      name: v.union(v.string(), v.null()),
      role: v.union(userRoleValidator, v.null()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const user = await getAuthedUser(ctx);
    if (!user) return null;
    return {
      userId: user._id,
      email: user.email!.toLowerCase(),
      name: user.name ?? null,
      role: user.role ?? null,
    };
  },
});

/** Secret-gated role lookup for Next routes (legacy JWT sessions). */
export const getRoleByEmail = query({
  args: { email: v.string(), secret: v.string() },
  returns: v.union(userRoleValidator, v.null()),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    return user?.role ?? null;
  },
});

/** Set role on a users row (bootstrap / admin tooling). */
export const setRole = mutation({
  args: {
    secret: v.string(),
    email: v.string(),
    role: roleValidator,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const expected = process.env.AUTH_BOOTSTRAP_SECRET;
    if (!expected || args.secret !== expected) {
      throw new Error("Unauthorized");
    }
    const email = args.email.toLowerCase().trim();
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();
    if (!user) throw new Error("User not found");
    await syncUserRole(ctx, user._id, args.role);
    return null;
  },
});

/** Sync role between users and members — never demote an elevated users.role. */
export const syncMyRoleFromMember = mutation({
  args: {},
  returns: v.null(),
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
    if (!member) return null;

    // users.role is the app auth gate. If it's already admin/team (e.g. set in
    // the Convex dashboard), keep it and promote the member row to match.
    if (user.role === "admin" || user.role === "team") {
      if (member.role !== user.role) {
        await ctx.db.patch(member._id, { role: user.role });
      }
      return null;
    }

    await syncUserRole(ctx, userId, member.role);
    return null;
  },
});

/** One-shot: copy members.role onto linked users.role. */
export const backfillRolesFromMembers = internalMutation({
  args: {},
  returns: v.object({ updated: v.number() }),
  handler: async (ctx) => {
    const members = await ctx.db.query("members").take(500);
    let updated = 0;
    for (const member of members) {
      if (!member.userId) continue;
      const user = await ctx.db.get(member.userId);
      if (!user) continue;
      if (user.role === member.role) continue;
      await syncUserRole(ctx, member.userId, member.role);
      updated += 1;
    }
    return { updated };
  },
});
