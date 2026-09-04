/** Shared gate for Next.js server routes talking to Convex without a user JWT. */
export function authSecret(): string {
  const s = process.env.AUTH_BOOTSTRAP_SECRET;
  if (!s) throw new Error("Missing AUTH_BOOTSTRAP_SECRET");
  return s;
}
