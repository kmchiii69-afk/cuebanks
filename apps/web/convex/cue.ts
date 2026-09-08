import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { getAuthedUser } from "./users";
import { instructionAppendix } from "./lib/cuePrompt";

const HOURLY_LIMIT = 20;

export const emailFromAuth = internalQuery({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const user = await getAuthedUser(ctx);
    return user?.email?.toLowerCase() ?? null;
  },
});

export const prepareMember = internalQuery({
  args: { email: v.string(), now: v.number() },
  returns: v.union(
    v.object({
      ok: v.literal(true),
      email: v.string(),
      plan: v.string(),
      appendix: v.string(),
    }),
    v.object({
      ok: v.literal(false),
      status: v.number(),
      error: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();
    const member = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    const role = user?.role ?? member?.role ?? "member";
    const staff = role === "admin" || role === "team";
    if (!staff) {
      if (!member || !member.active) {
        return { ok: false as const, status: 401, error: "Unauthorized" };
      }
      if (member.expiresAt) {
        const expires = Date.parse(member.expiresAt);
        if (!Number.isNaN(expires) && expires < args.now) {
          return { ok: false as const, status: 401, error: "Unauthorized" };
        }
      }
    }

    const recent = await ctx.db
      .query("chatAnalytics")
      .withIndex("by_member_email", (q) => q.eq("memberEmail", email))
      .order("desc")
      .take(HOURLY_LIMIT + 5);
    const hourAgo = args.now - 60 * 60 * 1000;
    const count = recent.filter((row) => row._creationTime >= hourAgo).length;
    if (count >= HOURLY_LIMIT) {
      return {
        ok: false as const,
        status: 429,
        error: "You've hit the hourly limit (20 messages). Come back in an hour.",
      };
    }

    const instructions = await ctx.db
      .query("cueInstructions")
      .withIndex("by_active", (q) => q.eq("active", true))
      .take(200);

    return {
      ok: true as const,
      email,
      plan: member?.plan ?? "5k",
      appendix: instructionAppendix(instructions),
    };
  },
});

export const beginTurn = internalMutation({
  args: {
    email: v.string(),
    plan: v.string(),
    question: v.string(),
  },
  returns: v.id("chatAnalytics"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("chatAnalytics", {
      memberEmail: args.email.toLowerCase().trim(),
      plan: args.plan,
      question: args.question,
      answer: "",
    });
  },
});

export const finishTurn = internalMutation({
  args: {
    id: v.id("chatAnalytics"),
    answer: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { answer: args.answer });
    return null;
  },
});

export const prepareFreebie = internalQuery({
  args: { email: v.string() },
  returns: v.union(
    v.object({
      ok: v.literal(true),
      email: v.string(),
      experience: v.string(),
      appendix: v.string(),
    }),
    v.object({
      ok: v.literal(false),
      status: v.number(),
      error: v.string(),
      message: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const lead = await ctx.db
      .query("freebieLeads")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (!lead) {
      return { ok: false as const, status: 401, error: "Opt in first" };
    }
    if (lead.questionsAsked >= 3) {
      return {
        ok: false as const,
        status: 403,
        error: "limit_reached",
        message:
          "You've used all 3 free questions. Join the Inner Circle for unlimited access to Cue AI.",
      };
    }
    const instructions = await ctx.db
      .query("cueInstructions")
      .withIndex("by_active", (q) => q.eq("active", true))
      .take(200);
    return {
      ok: true as const,
      email,
      experience: lead.experience,
      appendix: instructionAppendix(instructions),
    };
  },
});

export const incrementFreebieQuestions = internalMutation({
  args: { email: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const lead = await ctx.db
      .query("freebieLeads")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    if (lead) {
      await ctx.db.patch(lead._id, { questionsAsked: lead.questionsAsked + 1 });
    }
    return null;
  },
});

export const saveFreebieQa = internalMutation({
  args: {
    email: v.string(),
    question: v.string(),
    answer: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("freebieQa", {
      email: args.email.toLowerCase().trim(),
      question: args.question,
      answer: args.answer,
    });
    return null;
  },
});
