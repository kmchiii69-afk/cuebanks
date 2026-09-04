import type { MutationCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

export async function syncUserRole(
  ctx: MutationCtx,
  userId: Id<"users"> | undefined,
  role: "member" | "admin" | "team",
) {
  if (!userId) return;
  const user = await ctx.db.get(userId);
  if (!user) return;
  if (user.role === role) return;
  await ctx.db.patch(userId, { role });
}
