import { timingSafeEqual } from "crypto";

/** Invite query param: `/sign-up?invite=...` */
export const SIGNUP_INVITE_PARAM = "invite";

export function isValidSignupInvite(invite: string | null | undefined): boolean {
  const expected = (process.env.SIGNUP_INVITE_KEY ?? "").trim();
  const given = (invite ?? "").trim();
  if (!expected || !given) return false;

  const a = Buffer.from(given, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
