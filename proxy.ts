import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { isLowPPP } from "@/lib/geo";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? '');
const PROTECTED_PAGES = ['/portal', '/roadmap', '/cue', '/admin'];
const ADMIN_ONLY_PAGES = ['/admin'];

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const path = request.nextUrl.pathname;

  // WSA auth protection
  const needsAuth = PROTECTED_PAGES.some(p => path === p || path.startsWith(p + '/'));
  if (needsAuth) {
    const token = request.cookies.get('wsa_auth_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const { payload } = await jwtVerify(token, SECRET);
      const role = payload.role as string;
      if (ADMIN_ONLY_PAGES.some(p => path === p || path.startsWith(p + '/'))) {
        if (role !== 'admin' && role !== 'team') {
          return NextResponse.redirect(new URL('/portal', request.url));
        }
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

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
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
