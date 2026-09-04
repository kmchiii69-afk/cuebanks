// Wall Street Academy design tokens — single source of truth for the
// re-skinned broker/confirm pages and any future WSA-branded marketing page.
//
// Color palette is kept distinct from `@cuebanks/tailwind-config` on purpose:
// broker logos (Hydra, BloFin) and the "you've registered" green need their
// own hex codes that don't collide with the cuebanks token system. These
// tokens are consumed by `components/wsa/ui.tsx` via plain CSS variables
// (`var(--wsa-yellow)` etc) and Tailwind arbitrary values
// (`text-[var(--wsa-yellow)]`). Adding a new token = add it here + use it.
export const wsa = {
  // palette
  black: "#000000",
  bg: "#05070b", // near-black page base with a hint of cool blue
  white: "#ffffff",
  greyBg: "#e6e6e6",
  panel: "#0c1018",
  panel2: "#111827",
  panelLine: "#1a2230",
  yellow: "#f9ff3c",
  blue: "#188bf6",
  green: "#12da00",
  green2: "#37ca37",
  red: "#e93d3d",
  muted: "#707070",
  ash: "#9aa3b2",
  line: "#2b333f",

  // typography — these specific families are only loaded on the broker/confirm
  // pages via the `@import` block in app/globals.css. The rest of the site
  // (home / cue-wins / free-course / innercircle) uses the cuebanks token
  // family in @cuebanks/tailwind-config instead.
  fontH1: "'Open Sans', sans-serif",
  fontH2: "'Montserrat', sans-serif",
  fontBody: "'Open Sans', sans-serif",
  fontAccent: "'Times New Roman', Times, serif",

  // the round WSA badge extracted from the home funnel
  logo: "/wsa/home/1.png",
} as const;
