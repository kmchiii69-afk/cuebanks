import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { assertBootstrapSecret } from "./lib/bootstrap";

const experienceValidator = v.union(
  v.literal("under_1y"),
  v.literal("1_3y"),
  v.literal("3_5y"),
  v.literal("5y_plus"),
  v.literal(""),
);

const leadPublicValidator = v.object({
  id: v.string(),
  email: v.string(),
  first_name: v.string(),
  last_name: v.string(),
  phone: v.string(),
  experience: experienceValidator,
  questions_asked: v.number(),
  clicked_cta: v.boolean(),
  created_at: v.string(),
});

const qaPublicValidator = v.object({
  id: v.string(),
  email: v.string(),
  question: v.string(),
  answer: v.string(),
  created_at: v.string(),
});

function toPublicLead(doc: Doc<"freebieLeads">) {
  return {
    id: doc._id,
    email: doc.email,
    first_name: doc.firstName,
    last_name: doc.lastName,
    phone: doc.phone,
    experience: doc.experience,
    questions_asked: doc.questionsAsked,
    clicked_cta: doc.clickedCta,
    created_at: new Date(doc._creationTime).toISOString(),
  };
}

function toPublicQa(doc: Doc<"freebieQa">) {
  return {
    id: doc._id,
    email: doc.email,
    question: doc.question,
    answer: doc.answer,
    created_at: new Date(doc._creationTime).toISOString(),
  };
}

/** Secret-gated: used by Next freebie opt-in / cue / CTA routes. */
export const upsertLead = mutation({
  args: {
    secret: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string(),
    experience: v.union(
      v.literal("under_1y"),
      v.literal("1_3y"),
      v.literal("3_5y"),
      v.literal("5y_plus"),
    ),
  },
  returns: v.object({
    lead: leadPublicValidator,
    created: v.boolean(),
  }),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const email = args.email.toLowerCase().trim();
    const phone = args.phone.trim();

    const byEmail = await ctx.db
      .query("freebieLeads")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    const byPhone = phone
      ? await ctx.db
          .query("freebieLeads")
          .withIndex("by_phone", (q) => q.eq("phone", phone))
          .unique()
      : null;

    const existing = byEmail ?? byPhone;
    if (existing) {
      await ctx.db.patch(existing._id, {
        firstName: args.firstName.trim() || existing.firstName,
        lastName: args.lastName.trim() || existing.lastName,
        experience: args.experience,
        // Keep canonical email/phone from first opt-in for uniqueness.
      });
      const updated = await ctx.db.get(existing._id);
      return { lead: toPublicLead(updated!), created: false };
    }

    const id = await ctx.db.insert("freebieLeads", {
      email,
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      phone,
      experience: args.experience,
      questionsAsked: 0,
      clickedCta: false,
    });
    const doc = await ctx.db.get(id);
    return { lead: toPublicLead(doc!), created: true };
  },
});

export const getLeadByEmail = query({
  args: { secret: v.string(), email: v.string() },
  returns: v.union(leadPublicValidator, v.null()),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const lead = await ctx.db
      .query("freebieLeads")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    return lead ? toPublicLead(lead) : null;
  },
});

export const getLeadByPhone = query({
  args: { secret: v.string(), phone: v.string() },
  returns: v.union(leadPublicValidator, v.null()),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const phone = args.phone.trim();
    if (!phone) return null;
    const lead = await ctx.db
      .query("freebieLeads")
      .withIndex("by_phone", (q) => q.eq("phone", phone))
      .unique();
    return lead ? toPublicLead(lead) : null;
  },
});

export const incrementQuestions = mutation({
  args: { secret: v.string(), email: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
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

export const markCtaClicked = mutation({
  args: { secret: v.string(), email: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const lead = await ctx.db
      .query("freebieLeads")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .unique();
    if (lead && !lead.clickedCta) {
      await ctx.db.patch(lead._id, { clickedCta: true });
    }
    return null;
  },
});

export const saveQa = mutation({
  args: {
    secret: v.string(),
    email: v.string(),
    question: v.string(),
    answer: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    await ctx.db.insert("freebieQa", {
      email: args.email.toLowerCase().trim(),
      question: args.question,
      answer: args.answer,
    });
    return null;
  },
});

export const adminListLeads = query({
  args: { secret: v.string() },
  returns: v.array(leadPublicValidator),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const rows = await ctx.db.query("freebieLeads").order("desc").take(500);
    return rows.map(toPublicLead);
  },
});

export const adminListQa = query({
  args: { secret: v.string() },
  returns: v.array(qaPublicValidator),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const rows = await ctx.db.query("freebieQa").order("desc").take(1000);
    return rows.map(toPublicQa);
  },
});
