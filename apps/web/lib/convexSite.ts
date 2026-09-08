/** Convex HTTP actions live on `.convex.site`, not `.convex.cloud`. */
export function getConvexSiteUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  return url.replace(/\.convex\.cloud$/, ".convex.site");
}
