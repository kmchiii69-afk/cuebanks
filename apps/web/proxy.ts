import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { isLowPPP } from "@/lib/geo";

/**
 * Use `/path` + `/path/(.*)` — NOT `/path(.*)`.
 * path-to-regexp treats `/cue(.*)` as matching `/cue-wins` (public marketing).
 */
const isProtectedPage = createRouteMatcher([
  "/portal",
  "/portal/(.*)",
  "/roadmap",
  "/roadmap/(.*)",
  "/cue",
  "/cue/(.*)",
  "/admin",
  "/admin/(.*)",
]);

const LEGACY_COOKIE = "wsa_auth_token";

function readLegacySecret(): Uint8Array {
  const s = process.env.JWT_SECRET ?? "";
  return new TextEncoder().encode(s);
}

async function isLegacyAuthed(request: Request): Promise<{ ok: boolean; role: "member" | "admin" | "team" | null }> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(/;\s*/)
    .find((c) => c.startsWith(`${LEGACY_COOKIE}=`))
    ?.split("=")[1];
  if (!token) return { ok: false, role: null };
  try {
    const { payload } = await jwtVerify(token, readLegacySecret());
    return {
      ok: true,
      role: payload.role as "member" | "admin" | "team" | null,
    };
  } catch {
    return { ok: false, role: null };
  }
}

/**
 * Next.js 16 `proxy` (formerly middleware).
 *
 * Hybrid during the migration window:
 *   - Accept the Convex Auth cookie (preferred).
 *   - Accept the legacy `wsa_auth_token` JWT cookie issued by the existing
 *     /api/auth/login route while the migration is in flight.
 *   - For Convex-Auth sessions we cannot read the role from the cookie
 *     directly, so the per-route guards in `lib/auth.ts` re-verify the
 *     member role on each request.
 *
 * Keeps the /wolfpack-global PPP and free.quantumcipherlab.com rewrites.
 */
export const proxy = convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const host = request.headers.get("host") || "";
  const path = request.nextUrl.pathname;

  const convexAuthed = await convexAuth.isAuthenticated();
  const legacy = await isLegacyAuthed(request);
  const authed = convexAuthed || legacy.ok;

  if (isProtectedPage(request) && !authed) {
    const returnTo = request.nextUrl.pathname + request.nextUrl.search;
    const login = new URL("/login", request.url);
    login.searchParams.set("next", returnTo);
    return nextjsMiddlewareRedirect(request, `${login.pathname}${login.search}`);
  }

  // /admin role is enforced in getAuthUser / requireAdminAuth (users.role),
  // not from the legacy JWT payload.

  // /wolfpack-global PPP redirect
  if (path === "/wolfpack-global" && request.nextUrl.searchParams.get("preview") !== "1") {
    const country = request.headers.get("x-vercel-ip-country");
    const checkoutLive = !!(process.env.NEXT_PUBLIC_WHOP_GLOBAL_URL || "").trim();
    if (country && !isLowPPP(country)) {
      return NextResponse.redirect(new URL("/wolfpack", request.url));
    }
    if (!checkoutLive) {
      return NextResponse.redirect(new URL("/wolfpack?offer=intl", request.url));
    }
  }

  if (
    host === "free.quantumcipherlab.com" &&
    !path.startsWith("/api/") &&
    !path.startsWith("/_next/") &&
    !path.startsWith("/uploads/")
  ) {
    const rewritePath = path === "/" ? "/free-course" : `/free-course${path}`;
    const rewriteUrl = new URL(rewritePath, request.url);
    rewriteUrl.search = request.nextUrl.search;
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
