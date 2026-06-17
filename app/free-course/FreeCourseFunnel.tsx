"use client";

import { useCallback, useState } from "react";
import posthog from "posthog-js";
import FunnelRenderer, { type FunnelData } from "@/components/funnel/FunnelRenderer";
import LeadCaptureModal from "@/components/funnel/LeadCaptureModal";

export default function FreeCourseFunnel({ data }: { data: FunnelData }) {
  const [open, setOpen] = useState(false);

  // After the funnel markup mounts, intercept the "Get Free Access" CTAs and
  // open the lead-capture modal instead of jumping to the (form-less) #access
  // section. In-page anchors like "#cases" keep their default scroll behavior.
  const onReady = useCallback((root: HTMLDivElement) => {
    const handler = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const isAccessCta = href === "#" || href.endsWith("#access");
      if (isAccessCta) {
        e.preventDefault();
        posthog.capture("free_course_modal_opened");
        setOpen(true);
      }
    };
    root.addEventListener("click", handler);
    return () => root.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <FunnelRenderer data={data} onReady={onReady} />
      <LeadCaptureModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
