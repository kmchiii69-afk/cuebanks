"use client";

import { useEffect } from "react";

const CALENDLY_URL = "https://calendly.com/admin-wsacademyfx/30min";

const THEME_PARAMS = new URLSearchParams({
  background_color: "000000",
  text_color: "ffffff",
  primary_color: "f9ff3c",
  hide_event_type_details: "1",
  hide_landing_page_details: "1",
}).toString();

export default function CalendlyWidget({
  firstName = "",
  lastName = "",
  email = "",
}: {
  firstName?: string;
  lastName?: string;
  email?: string;
}) {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  const params = new URLSearchParams(THEME_PARAMS);
  if (name) params.set("name", name.replace(/\+/g, "%20"));
  if (email) params.set("email", email);
  const url = `${CALENDLY_URL}?${params.toString().replace(/\+/g, "%20")}`;

  useEffect(() => {
    const existing = document.getElementById("calendly-widget-script");
    if (existing) return;
    const script = document.createElement("script");
    script.id = "calendly-widget-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, []);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      const data = e.data as { event?: string } | null;
      if (data?.event === "calendly.event_scheduled") {
        window.location.href = "/book/confirm";
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url={url}
      style={{ minWidth: 320, height: 700 }}
    />
  );
}
