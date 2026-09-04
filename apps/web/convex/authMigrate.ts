"use node";

import {
  createAccount,
  modifyAccountCredentials,
  retrieveAccount,
} from "@convex-dev/auth/server";
import { v } from "convex/values";
import { action } from "./_generated/server";

function assertBootstrapSecret(secret: string) {
  const expected = process.env.AUTH_BOOTSTRAP_SECRET;
  if (!expected || secret !== expected) {
    throw new Error("Unauthorized");
  }
}

/**
 * After Next.js validates a legacy Supabase password, call this to create
 * (or sync) the matching Convex Auth password account.
 *
 * Gated by AUTH_BOOTSTRAP_SECRET so it can't be used as a free sign-up.
 */
export const provisionPasswordAccount = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
    secret: v.string(),
  },
  returns: v.object({
    ok: v.boolean(),
    alreadyExisted: v.boolean(),
  }),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);

    const email = args.email.trim().toLowerCase();

    // Correct password already stored?
    try {
      await retrieveAccount(ctx, {
        provider: "password",
        account: { id: email, secret: args.password },
      });
      return { ok: true, alreadyExisted: true };
    } catch {
      // Missing account or password drift — continue.
    }

    // Account exists with a different password → sync from validated Supabase creds.
    try {
      await retrieveAccount(ctx, {
        provider: "password",
        account: { id: email },
      });
      await modifyAccountCredentials(ctx, {
        provider: "password",
        account: { id: email, secret: args.password },
      });
      return { ok: true, alreadyExisted: true };
    } catch {
      // No account yet.
    }

    await createAccount(ctx, {
      provider: "password",
      account: { id: email, secret: args.password },
      profile: {
        email,
        ...(args.name?.trim() ? { name: args.name.trim() } : {}),
      },
    });

    return { ok: true, alreadyExisted: false };
  },
});

/**
 * Keep Convex Auth credentials in sync when password is changed via
 * portal / reset / admin (Supabase remains source of truth until full migrate).
 */
export const syncPassword = action({
  args: {
    email: v.string(),
    password: v.string(),
    secret: v.string(),
  },
  returns: v.object({ ok: v.boolean() }),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);

    const email = args.email.trim().toLowerCase();

    try {
      await retrieveAccount(ctx, {
        provider: "password",
        account: { id: email },
      });
      await modifyAccountCredentials(ctx, {
        provider: "password",
        account: { id: email, secret: args.password },
      });
    } catch {
      await createAccount(ctx, {
        provider: "password",
        account: { id: email, secret: args.password },
        profile: { email },
      });
    }

    return { ok: true };
  },
});

/** Verify current password then set a new one (portal change-password). */
export const changePassword = action({
  args: {
    email: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
    secret: v.string(),
  },
  returns: v.object({ ok: v.boolean() }),
  handler: async (ctx, args) => {
    assertBootstrapSecret(args.secret);

    const email = args.email.trim().toLowerCase();
    if (args.newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    try {
      await retrieveAccount(ctx, {
        provider: "password",
        account: { id: email, secret: args.currentPassword },
      });
    } catch {
      throw new Error("Current password is incorrect");
    }

    await modifyAccountCredentials(ctx, {
      provider: "password",
      account: { id: email, secret: args.newPassword },
    });

    return { ok: true };
  },
});
