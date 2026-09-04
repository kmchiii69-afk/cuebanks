import { v } from "convex/values";

/** Shared gate for Next.js server routes talking to Convex without a user JWT. */
export function assertBootstrapSecret(secret: string) {
  const expected = process.env.AUTH_BOOTSTRAP_SECRET;
  if (!expected || secret !== expected) {
    throw new Error("Unauthorized");
  }
}

export const planValidator = v.union(
  v.literal("5k"),
  v.literal("7.5k"),
  v.literal("15k"),
  v.literal("low_ticket"),
);

export const roleValidator = v.union(
  v.literal("member"),
  v.literal("admin"),
  v.literal("team"),
);

export const phaseCompletionValidator = v.object({
  status: v.literal("complete"),
  completedAt: v.string(),
  completedBy: v.union(v.literal("member"), v.literal("admin")),
  homeworkConfirmed: v.optional(v.boolean()),
});
