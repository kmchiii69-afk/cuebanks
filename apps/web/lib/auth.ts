import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { jwtVerify } from "jose";
import { api } from "@/convex/_generated/api";
import { getMember, getUserRole } from "@/lib/db";
import { isStaffRole, type AppRole } from "@/lib/roles";

export type AuthPayload = {
  email: string;
  role: AppRole;
};

const LEGACY_COOKIE = "wsa_auth_token";

async function readLegacySession(): Promise<{ email: string; role: AppRole } | null> {
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
    const role = payload.role as AppRole | undefined;
    if (!email || !role) return null;
    return { email, role };
  } catch {
    return null;
  }
}

function resolveRole(
  userRole: AppRole | null | undefined,
  fallback: AppRole | null | undefined,
): AppRole {
  if (userRole === "admin" || userRole === "team" || userRole === "member") {
    return userRole;
  }
  if (fallback === "admin" || fallback === "team" || fallback === "member") {
    return fallback;
  }
  return "member";
}

/**
 * Resolve the signed-in user. Access role comes from Convex `users.role`
 * (staff bypass product gates). Legacy JWT is only used to find the email.
 */
export async function getAuthUser(): Promise<AuthPayload | null> {
  try {
    const token = await convexAuthNextjsToken();
    if (token) {
      const [viewer, member] = await Promise.all([
        fetchQuery(api.users.viewer, {}, { token }),
        fetchQuery(api.members.me, {}, { token }),
      ]);
      const email = (member?.email ?? viewer?.email ?? "").toLowerCase();
      if (!email) return null;
      const role = resolveRole(viewer?.role, member?.role);
      if (isStaffRole(role)) {
        return { email, role };
      }
      if (!member || !member.active) return null;
      if (member.expires_at && new Date(member.expires_at) < new Date()) {
        return null;
      }
      return { email, role };
    }
  } catch (err) {
    console.error("[getAuthUser] Convex Auth lookup failed:", err);
  }

  const legacy = await readLegacySession();
  if (!legacy) return null;

  const [member, userRole] = await Promise.all([
    getMember(legacy.email).catch(() => null),
    getUserRole(legacy.email).catch(() => null),
  ]);
  const role = resolveRole(userRole, member?.role ?? legacy.role);
  if (isStaffRole(role)) {
    return { email: legacy.email, role };
  }
  if (!member || !member.active) return null;
  if (member.expires_at && new Date(member.expires_at) < new Date()) {
    return null;
  }
  return { email: legacy.email, role };
}

/** Strict admin gate for /admin APIs — `users.role` admin or team. */
export async function requireAdminAuth(): Promise<AuthPayload | null> {
  const auth = await getAuthUser();
  if (!auth || !isStaffRole(auth.role)) return null;
  return auth;
}

export { LEGACY_COOKIE };
