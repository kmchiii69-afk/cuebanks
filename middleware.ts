import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? '');

const PROTECTED_PAGES = ['/portal', '/roadmap', '/cue', '/admin'];
const ADMIN_ONLY_PAGES = ['/admin'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth = PROTECTED_PAGES.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get('wsa_auth_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const role = payload.role as string;

    // Admin-only pages
    if (ADMIN_ONLY_PAGES.some(p => pathname === p || pathname.startsWith(p + '/'))) {
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/portal', req.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/portal/:path*', '/roadmap/:path*', '/cue/:path*', '/admin/:path*'],
};
