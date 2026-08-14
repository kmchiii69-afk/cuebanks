"use node";

import { retrieveAccount } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { assertBootstrapSecret } from "./lib/bootstrap";

/**
 * Server-side password verification for the Next `/api/auth/login` route.
 *
 * Convex Auth's normal `signIn` flow sets cookies via the client. To keep the
 * existing server-rendered login form working during the migration, we
 * validate the password server-side through Convex Auth and hand back
 * enough profile info for the legacy caller to issue its own session marker.
 *
 * This is an action (requires `"use node"` because `retrieveAccount` is an
 * internal action) that internally calls `ctx.runQuery(api.members.getByEmail, ...)`
 * to read the member row.
 */
type ValidateResult = {
  email: string;
  role: "member" | "admin" | "team";
  name: string;
  active: boolean;
  cohort: string;
} | null;

export const validateCredentials = action({
  args: {
    secret: v.string(),
    email: v.string(),
    password: v.string(),
  },
  returns: v.union(
    v.object({
      email: v.string(),
      role: v.union(v.literal("member"), v.literal("admin"), v.literal("team")),
      name: v.string(),
      active: v.boolean(),
      cohort: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, args): Promise<ValidateResult> => {
    assertBootstrapSecret(args.secret);
    const email = args.email.trim().toLowerCase();

    try {
      await retrieveAccount(ctx, {
        provider: "password",
        account: { id: email, secret: args.password },
      });
    } catch {
      return null;
    }

    const member = await ctx.runQuery(api.members.getByEmail, {
      secret: args.secret,
      email,
    });

    if (!member) {
      return { email, role: "member", name: "", active: true, cohort: "" };
    }

    return {
      email: member.email,
      role: member.role,
      name: member.name,
      active: member.active,
      cohort: member.cohort,
    };
  },
});
