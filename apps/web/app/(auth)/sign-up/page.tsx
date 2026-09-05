import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidSignupInvite, SIGNUP_INVITE_PARAM } from "@/lib/signup-invite";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up — Wall Street Academy",
  robots: { index: false, follow: false },
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const params = await searchParams;
  const invite = params[SIGNUP_INVITE_PARAM] ?? "";
  if (!isValidSignupInvite(invite)) {
    notFound();
  }

  return <SignUpForm invite={invite} />;
}
