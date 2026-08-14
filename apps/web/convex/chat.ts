import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { assertBootstrapSecret } from "./lib/bootstrap";
import { requireAdminUser } from "./users";

const messageRoleValidator = v.union(v.literal("user"), v.literal("assistant"));

const messagePublicValidator = v.object({
  id: v.string(),
  member_email: v.string(),
  role: messageRoleValidator,
  content: v.string(),
  created_at: v.string(),
});

const analyticPublicValidator = v.object({
  id: v.string(),
  member_email: v.string(),
  plan: v.string(),
  question: v.string(),
  answer: v.string(),
  created_at: v.string(),
});

function toPublicMessage(doc: Doc<"chatHistory">) {
  return {
    id: doc._id,
    member_email: doc.memberEmail,
    role: doc.role,
    content: doc.content,
    created_at: new Date(doc._creationTime).toISOString(),
  };
}

function toPublicAnalytic(doc: Doc<"chatAnalytics">) {
  return {
    id: doc._id,
    member_email: doc.memberEmail,
    plan: doc.plan,
    question: doc.question,
    answer: doc.answer,
    created_at: new Date(doc._creationTime).toISOString(),
  };
}

async function requireMemberEmail(ctx: QueryCtx | MutationCtx): Promise<string> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Authentication required.");
  const user = await ctx.db.get(userId as Id<"users">);
  if (!user?.email) throw new Error("Authentication required.");
  return user.email.toLowerCase();
}

export const listForMe = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(messagePublicValidator),
  handler: async (ctx, args) => {
    const email = await requireMemberEmail(ctx);
    const limit = Math.min(args.limit ?? 100, 200);
    const rows = await ctx.db
      .query("chatHistory")
      .withIndex("by_member_email", (q) => q.eq("memberEmail", email))
      .order("desc")
      .take(limit);
    return rows.reverse().map(toPublicMessage);
  },
});

export const appendMessages = mutation({
  args: {
    messages: v.array(
      v.object({
        role: messageRoleValidator,
        content: v.string(),
      }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const email = await requireMemberEmail(ctx);
    for (const msg of args.messages) {
      if (!msg.content.trim()) continue;
      await ctx.db.insert("chatHistory", {
        memberEmail: email,
        role: msg.role,
        content: msg.content,
      });
    }
    return null;
  },
});

/** Called from Next `/api/cue` after a turn (bootstrap secret). */
export const recordAnalytic = mutation({
  args: {
    secret: v.string(),
    memberEmail: v.string(),
    plan: v.string(),
    question: v.string(),
    answer: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    await ctx.db.insert("chatAnalytics", {
      memberEmail: args.memberEmail.toLowerCase().trim(),
      plan: args.plan,
      question: args.question,
      answer: args.answer ?? "",
    });
    return null;
  },
});

export const adminListAnalytics = query({
  args: { plan: v.optional(v.string()) },
  returns: v.array(analyticPublicValidator),
  handler: async (ctx, args) => {
    await requireAdminUser(ctx);
    const plan = args.plan && args.plan !== "all" ? args.plan : null;
    if (plan) {
      const rows = await ctx.db
        .query("chatAnalytics")
        .withIndex("by_plan", (q) => q.eq("plan", plan))
        .order("desc")
        .take(500);
      return rows.map(toPublicAnalytic);
    }
    const rows = await ctx.db.query("chatAnalytics").order("desc").take(500);
    return rows.map(toPublicAnalytic);
  },
});

/** Server-only call from Next `/api/chat-history` GET. */
export const listForMeServer = query({
  args: { secret: v.string(), memberEmail: v.string(), limit: v.optional(v.number()) },
  returns: v.array(messagePublicValidator),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const limit = Math.min(args.limit ?? 100, 200);
    const email = args.memberEmail.toLowerCase().trim();
    const rows = await ctx.db
      .query("chatHistory")
      .withIndex("by_member_email", (q) => q.eq("memberEmail", email))
      .order("asc")
      .take(limit);
    return rows.map(toPublicMessage);
  },
});

/** Server-only call from Next `/api/chat-history` POST. */
export const saveManyForMember = mutation({
  args: {
    secret: v.string(),
    memberEmail: v.string(),
    messages: v.array(v.object({ role: messageRoleValidator, content: v.string() })),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const email = args.memberEmail.toLowerCase().trim();
    for (const msg of args.messages) {
      if (!msg.content.trim()) continue;
      await ctx.db.insert("chatHistory", {
        memberEmail: email,
        role: msg.role,
        content: msg.content,
      });
    }
    return null;
  },
});

/** Server-only: admin analytics list with bootstrap secret. */
export const adminListAnalyticsServer = query({
  args: { secret: v.string(), plan: v.optional(v.string()) },
  returns: v.array(analyticPublicValidator),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const plan = args.plan && args.plan !== "all" ? args.plan : null;
    if (plan) {
      const rows = await ctx.db
        .query("chatAnalytics")
        .withIndex("by_plan", (q) => q.eq("plan", plan))
        .order("desc")
        .take(500);
      return rows.map(toPublicAnalytic);
    }
    const rows = await ctx.db.query("chatAnalytics").order("desc").take(500);
    return rows.map(toPublicAnalytic);
  },
});
