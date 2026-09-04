import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { assertBootstrapSecret } from "./lib/bootstrap";
import { requireAdminUser } from "./users";

const webinarPublicValidator = v.object({
  id: v.string(),
  title: v.string(),
  description: v.string(),
  scheduled_at: v.string(),
  join_link: v.string(),
  recording_url: v.string(),
  is_published: v.boolean(),
  created_at: v.string(),
  created_by: v.string(),
});

function toPublic(doc: Doc<"webinars">) {
  return {
    id: doc._id,
    title: doc.title,
    description: doc.description,
    scheduled_at: doc.scheduledAt,
    join_link: doc.joinLink,
    recording_url: doc.recordingUrl,
    is_published: doc.isPublished,
    created_at: new Date(doc._creationTime).toISOString(),
    created_by: doc.createdBy,
  };
}

async function requireAuthed(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Authentication required.");
  const user = await ctx.db.get(userId);
  if (!user?.email) throw new Error("Authentication required.");
  return user;
}

/** Published webinars for portal members. */
export const listPublished = query({
  args: {},
  returns: v.array(webinarPublicValidator),
  handler: async (ctx) => {
    await requireAuthed(ctx);
    const rows = await ctx.db
      .query("webinars")
      .withIndex("by_is_published_and_scheduled_at", (q) => q.eq("isPublished", true))
      .order("asc")
      .take(100);
    return rows.map(toPublic);
  },
});

export const adminList = query({
  args: {},
  returns: v.array(webinarPublicValidator),
  handler: async (ctx) => {
    await requireAdminUser(ctx);
    const rows = await ctx.db.query("webinars").order("desc").take(200);
    return rows.map(toPublic);
  },
});

export const adminCreate = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    scheduledAt: v.string(),
    joinLink: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  returns: webinarPublicValidator,
  handler: async (ctx, args) => {
    const admin = await requireAdminUser(ctx);
    const id = await ctx.db.insert("webinars", {
      title: args.title.trim(),
      description: (args.description ?? "").trim(),
      scheduledAt: args.scheduledAt,
      joinLink: (args.joinLink ?? "").trim(),
      recordingUrl: (args.recordingUrl ?? "").trim(),
      isPublished: args.isPublished ?? true,
      createdBy: admin.email?.toLowerCase() ?? "",
    });
    const doc = await ctx.db.get(id);
    return toPublic(doc!);
  },
});

export const adminUpdate = mutation({
  args: {
    id: v.id("webinars"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    scheduledAt: v.optional(v.string()),
    joinLink: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  returns: v.union(webinarPublicValidator, v.null()),
  handler: async (ctx, args) => {
    await requireAdminUser(ctx);
    const existing = await ctx.db.get(args.id);
    if (!existing) return null;
    const patch: Partial<Doc<"webinars">> = {};
    if (args.title !== undefined) patch.title = args.title.trim();
    if (args.description !== undefined) patch.description = args.description.trim();
    if (args.scheduledAt !== undefined) patch.scheduledAt = args.scheduledAt;
    if (args.joinLink !== undefined) patch.joinLink = args.joinLink.trim();
    if (args.recordingUrl !== undefined) patch.recordingUrl = args.recordingUrl.trim();
    if (args.isPublished !== undefined) patch.isPublished = args.isPublished;
    await ctx.db.patch(args.id, patch);
    const updated = await ctx.db.get(args.id);
    return updated ? toPublic(updated) : null;
  },
});

export const adminRemove = mutation({
  args: { id: v.id("webinars") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdminUser(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing) await ctx.db.delete(args.id);
    return null;
  },
});

/** Server-only variants with bootstrap secret, for Next `/api/admin/webinars`. */
export const adminListServer = query({
  args: { secret: v.string() },
  returns: v.array(webinarPublicValidator),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const rows = await ctx.db.query("webinars").order("desc").take(200);
    return rows.map(toPublic);
  },
});

export const adminCreateServer = mutation({
  args: {
    secret: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    scheduledAt: v.string(),
    joinLink: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  returns: webinarPublicValidator,
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const id = await ctx.db.insert("webinars", {
      title: args.title.trim(),
      description: (args.description ?? "").trim(),
      scheduledAt: args.scheduledAt,
      joinLink: (args.joinLink ?? "").trim(),
      recordingUrl: (args.recordingUrl ?? "").trim(),
      isPublished: args.isPublished ?? true,
      createdBy: "",
    });
    const doc = await ctx.db.get(id);
    return toPublic(doc!);
  },
});

export const adminUpdateServer = mutation({
  args: {
    secret: v.string(),
    id: v.id("webinars"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    scheduledAt: v.optional(v.string()),
    joinLink: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  returns: v.union(webinarPublicValidator, v.null()),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const existing = await ctx.db.get(args.id);
    if (!existing) return null;
    const patch: Partial<Doc<"webinars">> = {};
    if (args.title !== undefined) patch.title = args.title.trim();
    if (args.description !== undefined) patch.description = args.description.trim();
    if (args.scheduledAt !== undefined) patch.scheduledAt = args.scheduledAt;
    if (args.joinLink !== undefined) patch.joinLink = args.joinLink.trim();
    if (args.recordingUrl !== undefined) patch.recordingUrl = args.recordingUrl.trim();
    if (args.isPublished !== undefined) patch.isPublished = args.isPublished;
    await ctx.db.patch(args.id, patch);
    const updated = await ctx.db.get(args.id);
    return updated ? toPublic(updated) : null;
  },
});

export const adminRemoveServer = mutation({
  args: { secret: v.string(), id: v.id("webinars") },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);
    const existing = await ctx.db.get(args.id);
    if (existing) await ctx.db.delete(args.id);
    return null;
  },
});
