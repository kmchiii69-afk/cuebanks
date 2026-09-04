// Shared font-family style stubs for the portal page. The original page
// inlined three CSSProperties constants (M, S, D) at module scope — many
// sub-components spelled them out inline instead of importing them. To
// keep this PR focused on the 1k-line goal, we re-export them here as
// plain objects so future extractions can import them.

import type { CSSProperties } from "react";

export const M: CSSProperties = { fontFamily: "'Space Mono', monospace" };
export const S: CSSProperties = { fontFamily: "'DM Sans', system-ui, sans-serif" };
export const D: CSSProperties = { fontFamily: "'Sora', system-ui, sans-serif" };
