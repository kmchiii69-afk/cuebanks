"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const posthogKey = (process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "").trim();

if (typeof window !== "undefined" && posthogKey) {
  posthog.init(posthogKey, {
    api_host: (process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "").trim(),
    capture_pageview: false,  // we fire manually to catch App Router navigations
    capture_pageleave: true,
    person_profiles: "always",
    disable_compression: true, // MetaMask SES breaks gzip-js; plain JSON works for everyone
  });
}

function PageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!posthogKey) return;
    const url =
      window.location.origin +
      pathname +
      (searchParams.toString() ? `?${searchParams.toString()}` : "");
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!posthogKey) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
