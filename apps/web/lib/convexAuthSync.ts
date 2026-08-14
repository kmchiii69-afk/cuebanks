import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

/** Sync password into Convex Auth (best-effort; never throws to callers). */
export async function syncConvexPassword(email: string, password: string): Promise<void> {
  const secret = process.env.AUTH_BOOTSTRAP_SECRET;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!secret || !convexUrl) {
    console.error("[syncConvexPassword] Missing AUTH_BOOTSTRAP_SECRET or NEXT_PUBLIC_CONVEX_URL");
    return;
  }

  try {
    const client = new ConvexHttpClient(convexUrl);
    await client.action(api.authMigrate.syncPassword, {
      email: email.trim().toLowerCase(),
      password,
      secret,
    });
  } catch (err) {
    console.error("[syncConvexPassword] failed:", err);
  }
}
