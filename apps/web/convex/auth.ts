import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type { DataModel } from "./_generated/dataModel";

const PasswordProvider = Password<DataModel>({
  profile(params) {
    const email = typeof params.email === "string" ? params.email.trim().toLowerCase() : "";
    const name = typeof params.name === "string" ? params.name.trim() : "";
    return {
      email,
      ...(name ? { name } : {}),
    };
  },
  validatePasswordRequirements(password) {
    if (typeof password !== "string" || password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [PasswordProvider],
});
