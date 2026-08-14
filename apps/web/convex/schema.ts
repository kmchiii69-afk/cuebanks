import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

/**
 * Convex schema — port of Supabase tables from the legacy `lib/db.ts` + Convex Auth.
 *
 * | Supabase               | Convex            |
 * |------------------------|-------------------|
 * | wsa_members            | members           |
 * | wsa_webinars           | webinars          |
 * | wsa_chat_history       | chatHistory       |
 * | wsa_chat_analytics     | chatAnalytics     |
 * | wsa_cue_instructions   | cueInstructions   |
 * | wsa_freebie_leads      | freebieLeads      |
 * | wsa_freebie_qa         | freebieQa         |
 * | (auth)                 | users + auth*     |
 */

const plan = v.union(
  v.literal("5k"),
  v.literal("7.5k"),
  v.literal("15k"),
  v.literal("low_ticket"),
);

const role = v.union(
  v.literal("member"),
  v.literal("admin"),
  v.literal("team"),
);

const phaseCompletion = v.object({
  status: v.literal("complete"),
  completedAt: v.string(),
  completedBy: v.union(v.literal("member"), v.literal("admin")),
  homeworkConfirmed: v.optional(v.boolean()),
});

const tradingExperience = v.union(
  v.literal("under_1y"),
  v.literal("1_3y"),
  v.literal("3_5y"),
  v.literal("5y_plus"),
  v.literal(""),
);

export default defineSchema({
  ...authTables,

  // Convex Auth users table (overrides authTables.users with indexes we need)
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    /** App role — `admin` gates /admin routes. Defaults to member when unset. */
    role: v.optional(role),
  })
    .index("email", ["email"])
    .index("by_role", ["role"]),

  // ── wsa_members ────────────────────────────────────────────────────────────
  members: defineTable({
    userId: v.optional(v.id("users")), // Convex Auth user link
    email: v.string(),
    name: v.string(),
    role,
    active: v.boolean(),
    cohort: v.string(),
    discordId: v.string(),
    notes: v.string(),
    lastLogin: v.number(),
    currentPhase: v.number(),
    phaseProgress: v.record(v.string(), phaseCompletion),
    plan,
    expiresAt: v.union(v.string(), v.null()),
    goal: v.string(),
    onboarded: v.boolean(),
    portalUnlocked: v.boolean(),
    skipContract: v.boolean(),
    resetTokenHash: v.union(v.string(), v.null()),
    resetTokenExpires: v.union(v.number(), v.null()),
  })
    .index("by_email", ["email"])
    .index("by_user", ["userId"])
    .index("by_role", ["role"])
    .index("by_plan", ["plan"])
    .index("by_active", ["active"]),

  webinars: defineTable({
    title: v.string(),
    description: v.string(),
    scheduledAt: v.string(),
    joinLink: v.string(),
    recordingUrl: v.string(),
    isPublished: v.boolean(),
    createdBy: v.string(),
  })
    .index("by_scheduled_at", ["scheduledAt"])
    .index("by_is_published_and_scheduled_at", ["isPublished", "scheduledAt"]),

  chatHistory: defineTable({
    memberEmail: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  }).index("by_member_email", ["memberEmail"]),

  chatAnalytics: defineTable({
    memberEmail: v.string(),
    plan: v.string(),
    question: v.string(),
    answer: v.string(),
  })
    .index("by_member_email", ["memberEmail"])
    .index("by_plan", ["plan"]),

  cueInstructions: defineTable({
    type: v.union(v.literal("do"), v.literal("dont")),
    instruction: v.string(),
    active: v.boolean(),
    createdBy: v.string(),
  }).index("by_active", ["active"]),

  freebieLeads: defineTable({
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string(),
    experience: tradingExperience,
    questionsAsked: v.number(),
    clickedCta: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]),

  freebieQa: defineTable({
    email: v.string(),
    question: v.string(),
    answer: v.string(),
  }).index("by_email", ["email"]),
});
