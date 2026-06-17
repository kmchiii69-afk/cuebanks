// Wall Street Academy design tokens — single source of truth for the
// re-skinned funnel pages. Mirrors the palette/typography baked into the
// authored funnel HTML (see app/_funnels/*).
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

  // typography (loaded globally in app/layout.tsx)
  fontH1: "'Open Sans', sans-serif",
  fontH2: "'Montserrat', sans-serif",
  fontBody: "'Open Sans', sans-serif",
  fontAccent: "'Times New Roman', Times, serif",

  // the round WSA badge extracted from the home funnel
  logo: "/wsa/home/1.png",
} as const;
