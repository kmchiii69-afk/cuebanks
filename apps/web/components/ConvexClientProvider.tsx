"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
}

const convex = new ConvexReactClient(convexUrl);

/**
 * Wraps the app with Convex Auth — provides both the Convex client context
 * and the `@convex-dev/auth/react` AuthProvider that supplies the
 * `ConvexAuthInternalContext` consumed by Convex's `ConvexProviderWithAuth`.
 *
 * We use `ConvexAuthProvider` (instead of `ConvexAuthNextjsProvider`) because
 * the Next.js App-Router-aware variant expects the Next middleware to inject
 * the auth cookie via `convexAuthNextjsMiddleware`. We already have a custom
 * `proxy.ts` that handles auth via our own legacy JWT cookie + Convex Auth,
 * so opting into the Next-middleware variant would create two competing
 * session sources. The non-Next variant is the right fit for our dual-cookie
 * migration window.
 */
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider client={convex}>
      {children}
    </ConvexAuthProvider>
  );
}
