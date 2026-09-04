import { NextResponse } from "next/server";

const LEGACY_COOKIE = "wsa_auth_token";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear the legacy migration cookie. The Convex Auth cookie (if any) is
  // managed by the client via signOut from @convex-dev/auth/react.
  res.cookies.set(LEGACY_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
