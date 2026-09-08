import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { assertBootstrapSecret } from "./lib/bootstrap";
import { requireAdminUser } from "./users";

const typeValidator = v.union(v.literal("do"), v.literal("dont"));

const instructionPublicValidator = v.object({
  id: v.string(),
  type: typeValidator,
  instruction: v.string(),
  active: v.boolean(),
  created_at: v.string(),
  created_by: v.string(),
});

function toPublic(doc: Doc<"cueInstructions">) {
  return {
    id: doc._id,
    type: doc.type,
    instruction: doc.instruction,
    active: doc.active,
    created_at: new Date(doc._creationTime).toISOString(),
    created_by: doc.createdBy,
  };
}

/** Secret-gated list for server prompt assembly. */
export const listActiveForServer = query({
  args: { secret: v.string() },
  returns: v.array(instructionPublicValidator),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const rows = await ctx.db
      .query("cueInstructions")
      .withIndex("by_active", (q) => q.eq("active", true))
      .take(200);
    return rows.map(toPublic);
  },
});

export const adminList = query({
  args: { secret: v.string() },
  returns: v.array(instructionPublicValidator),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const rows = await ctx.db.query("cueInstructions").order("desc").take(200);
    return rows.map(toPublic);
  },
});

export const adminCreateServer = mutation({
  args: {
    secret: v.string(),
    type: typeValidator,
    instruction: v.string(),
    createdBy: v.optional(v.string()),
  },
  returns: instructionPublicValidator,
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const text = args.instruction.trim();
    if (!text) throw new Error("Instruction required");
    const id = await ctx.db.insert("cueInstructions", {
      type: args.type,
      instruction: text,
      active: true,
      createdBy: args.createdBy ?? "",
    });
    const doc = await ctx.db.get(id);
    return toPublic(doc!);
  },
});

export const adminCreate = mutation({
  args: {
    type: typeValidator,
    instruction: v.string(),
  },
  returns: instructionPublicValidator,
  handler: async (ctx, args) => {
    const admin = await requireAdminUser(ctx);
    const text = args.instruction.trim();
    if (!text) throw new Error("Instruction required");
    const id = await ctx.db.insert("cueInstructions", {
      type: args.type,
      instruction: text,
      active: true,
      createdBy: admin.email?.toLowerCase() ?? "",
    });
    const doc = await ctx.db.get(id);
    return toPublic(doc!);
  },
});

export const adminUpdate = mutation({
  args: {
    id: v.id("cueInstructions"),
    instruction: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  returns: v.union(instructionPublicValidator, v.null()),
  handler: async (ctx, args) => {
    await requireAdminUser(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) return null;
    const patch: Partial<Doc<"cueInstructions">> = {};
    if (args.instruction !== undefined) patch.instruction = args.instruction.trim();
    if (args.active !== undefined) patch.active = args.active;
    await ctx.db.patch(args.id, patch);
    const updated = await ctx.db.get(args.id);
    return updated ? toPublic(updated) : null;
  },
});

export const adminRemove = mutation({
  args: { id: v.id("cueInstructions") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdminUser(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing) await ctx.db.delete(args.id);
    return null;
  },
});
