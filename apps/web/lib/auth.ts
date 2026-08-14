import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { jwtVerify } from "jose";
import { api } from "@/convex/_generated/api";
import { getMember } from "@/lib/db";

export type AuthPayload = {
  email: string;
  role: "member" | "admin" | "team";
};

const LEGACY_COOKIE = "wsa_auth_token";

async function readLegacySession(): Promise<{ email: string; role: "member" | "admin" | "team" } | null> {
  if (typeof (await import("next/headers")).cookies !== "function") return null;
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    const token = store.get(LEGACY_COOKIE)?.value;
    if (!token) return null;
    const secret = process.env.JWT_SECRET ?? "";
    if (!secret) return null;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const email = typeof payload.email === "string" ? payload.email : "";
    const role = payload.role as "member" | "admin" | "team" | undefined;
    if (!email || !role) return null;
    return { email, role };
  } catch {
    return null;
  }
}

/**
 * Resolve the signed-in member from Convex Auth + members table, with a
 * fallback to the legacy migration JWT cookie.
 *
 * Role prefers `users.role` (admin gate) and falls back to `members.role`.
 */
export async function getAuthUser(): Promise<AuthPayload | null> {
  // Try Convex Auth first.
  try {
    const token = await convexAuthNextjsToken();
    if (token) {
      const [viewer, member] = await Promise.all([
        fetchQuery(api.users.viewer, {}, { token }),
        fetchQuery(api.members.me, {}, { token }),
      ]);
      if (!member || !member.active) return null;
      const role = viewer?.role ?? member.role;
      if (
        role !== "admin" &&
        role !== "team" &&
        member.expires_at &&
        new Date(member.expires_at) < new Date()
      ) {
        return null;
      }
      return { email: member.email, role };
    }
  } catch (err) {
    console.error("[getAuthUser] Convex Auth lookup failed:", err);
  }

  // Fallback to legacy JWT cookie — verifies the member is still active in Convex.
  const legacy = await readLegacySession();
  if (!legacy) return null;
  const member = await getMember(legacy.email).catch(() => null);
  if (!member || !member.active) return null;
  if (
    legacy.role !== "admin" &&
    legacy.role !== "team" &&
    member.expires_at &&
    new Date(member.expires_at) < new Date()
  ) {
    return null;
  }
  return { email: legacy.email, role: legacy.role };
}

/** Strict admin gate for /admin APIs — requires users.role === "admin" or "team". */
export async function requireAdminAuth(): Promise<AuthPayload | null> {
  const auth = await getAuthUser();
  if (!auth || (auth.role !== "admin" && auth.role !== "team")) return null;
  return auth;
}

/** Export for backwards-compat with callers that read the legacy cookie directly. */
export { LEGACY_COOKIE };
