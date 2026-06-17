"use client";

import { useEffect, useRef } from "react";

export type FunnelData = {
  fonts: string[];
  css: string;
  body: string;
  script: string;
};

/**
 * Renders a self-contained marketing funnel that was authored as a standalone
 * HTML file and extracted by scripts/extract-funnel.mjs. The original CSS is
 * injected verbatim, the body markup is mounted as-is, and the page's inline
 * scripts (scroll reveals, marquees, masonry) run once after mount.
 *
 * `onReady` fires after the markup is mounted and the page's own scripts have
 * run, receiving the container element. Use it to wire CTAs into React state
 * (e.g. open a lead-capture modal) without editing the generated markup.
 * Return a cleanup function to detach listeners on unmount.
 */
export default function FunnelRenderer({
  data,
  onReady,
}: {
  data: FunnelData;
  onReady?: (root: HTMLDivElement) => void | (() => void);
}) {
  const ran = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true; // guard against React StrictMode double-invoke

    if (data.script) {
      try {
        new Function(data.script)();
      } catch (err) {
        console.error("[funnel] script error", err);
      }
    }

    if (onReady && rootRef.current) {
      return onReady(rootRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.script]);

  return (
    <>
      {/* React 19 hoists these <link>s into <head> automatically. */}
      {data.fonts.map((tag, i) => (
        <FontLink key={i} tag={tag} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: data.css }} />
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: data.body }} />
    </>
  );
}

// Parse the raw <link ...> string the extractor captured and re-emit it as a
// real React element so React can hoist + dedupe it.
function FontLink({ tag }: { tag: string }) {
  const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
  if (!href) return null;
  const rel = tag.match(/rel=["']([^"']+)["']/i)?.[1] ?? "stylesheet";
  const crossOrigin = /crossorigin/i.test(tag) ? "" : undefined;
  return <link rel={rel} href={href} crossOrigin={crossOrigin} />;
}
