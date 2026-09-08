"use client";

import { useAuthToken } from "@convex-dev/auth/react";
import { getConvexSiteUrl } from "@/lib/convexSite";

type CueMessage = { role: "user" | "assistant"; content: string };

export function useCueChatRequest() {
  const token = useAuthToken();

  return (messages: CueMessage[]) => {
    const site = getConvexSiteUrl();
    if (token && site) {
      return fetch(`${site}/cue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages }),
      });
    }
    return fetch("/api/cue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
  };
}
