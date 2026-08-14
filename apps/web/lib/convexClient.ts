import { ConvexHttpClient } from "convex/browser";

/** Lazy-init Convex HTTP client for server-side route handlers. */
let _client: ConvexHttpClient | null = null;
export function convexClient(): ConvexHttpClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
  _client = new ConvexHttpClient(url);
  return _client;
}
