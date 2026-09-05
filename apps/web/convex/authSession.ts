"use node";

import {
  createAccount,
  retrieveAccount,
} from "@convex-dev/auth/server";
import bcrypt from "bcryptjs";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import type { ActionCtx } from "./_generated/server";
import { assertBootstrapSecret } from "./lib/bootstrap";

/**
 * Server-side password verification for the Next `/api/auth/login` route.
 *
 * Order:
 *   1. Convex Auth (source of truth after first successful login)
 *   2. If no Convex Auth account yet, bcrypt against live Supabase `wsa_members`
 *      and provision Convex Auth with the plaintext they just typed
 *   3. Wrong Convex Auth password does not fall back to Supabase
 */
type ValidateResult = {
  email: string;
  role: "member" | "admin" | "team";
  name: string;
  active: boolean;
  cohort: string;
} | null;

async function memberProfile(
  ctx: ActionCtx,
  secret: string,
  email: string,
  fallbackName: string,
): Promise<ValidateResult> {
  const member = await ctx.runQuery(api.members.getByEmail, {
    secret,
    email,
  });

  if (!member) {
    return { email, role: "member", name: fallbackName, active: true, cohort: "" };
  }

  return {
    email: member.email,
    role: member.role,
    name: member.name,
    active: member.active,
    cohort: member.cohort,
  };
}

async function convexPasswordAccountExists(
  ctx: ActionCtx,
  email: string,
): Promise<boolean> {
  try {
    await retrieveAccount(ctx, {
      provider: "password",
      account: { id: email },
    });
    return true;
  } catch {
    return false;
  }
}

type LegacyRow = {
  email?: string;
  name?: string;
  password_hash?: string;
  active?: boolean;
};

async function verifyLiveSupabasePassword(
  email: string,
  password: string,
): Promise<{ ok: true; name: string } | { ok: false }> {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!baseUrl || !serviceKey) {
    console.warn("[auth] SUPABASE_URL / SUPABASE_SERVICE_KEY not set; skipping legacy password fallback");
    return { ok: false };
  }

  const params = new URLSearchParams({
    select: "email,name,password_hash,active",
    email: `eq.${email}`,
    limit: "1",
  });
  const response = await fetch(`${baseUrl}/rest/v1/wsa_members?${params.toString()}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    console.error("[auth] Supabase member lookup failed:", response.status);
    return { ok: false };
  }

  const rows = (await response.json()) as LegacyRow[];
  const row = rows[0];
  const hash = row?.password_hash;
  if (!row || typeof hash !== "string" || !hash) {
    return { ok: false };
  }
  if (row.active === false) {
    return { ok: false };
  }

  const matches = await bcrypt.compare(password, hash);
  if (!matches) {
    return { ok: false };
  }
  return { ok: true, name: typeof row.name === "string" ? row.name : "" };
}

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

    let fallbackName = "";

    try {
      await retrieveAccount(ctx, {
        provider: "password",
        account: { id: email, secret: args.password },
      });
    } catch {
      if (await convexPasswordAccountExists(ctx, email)) {
        return null;
      }

      const legacy = await verifyLiveSupabasePassword(email, args.password);
      if (!legacy.ok) {
        return null;
      }

      await createAccount(ctx, {
        provider: "password",
        account: { id: email, secret: args.password },
        profile: {
          email,
          ...(legacy.name.trim() ? { name: legacy.name.trim() } : {}),
        },
      });
      fallbackName = legacy.name;
    }

    const existing = await ctx.runQuery(api.members.getByEmail, {
      secret: args.secret,
      email,
    });
    if (!existing) {
      await ctx.runMutation(api.members.create, {
        secret: args.secret,
        email,
        name: fallbackName,
        role: "member",
        portalUnlocked: true,
      });
    }

    return await memberProfile(ctx, args.secret, email, fallbackName);
  },
});
