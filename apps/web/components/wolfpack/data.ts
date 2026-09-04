// Shared types for wolfpack primitives. Keeping these in one file means
// every section/tile can import just the type without dragging in
// the entire `data.ts` worth of strings.

export interface KryptonCaseData {
  tag: string;
  big: string;
  from: string;
  span: string;
  note: string;
  accent?: string;
}

export interface PackageTileData {
  idx: number;
  kicker: string;
  title: string;
  body: string;
  items: string[];
  accent: string;
  wide?: boolean;
}

export interface FuruRowData {
  furu: string;
  wolf: string;
}

export interface TradeRowData {
  kicker: string;
  title: React.ReactNode;
  body: string;
  img: string;
  callouts: { v: string; k: string }[];
  accent: string;
  flip?: boolean;
  ratio?: string;
}

export interface ResultBannerData {
  kicker: string;
  big: string;
  sub: string;
  period: string;
  image: string;
  accent?: string;
  flipped?: boolean;
}

export interface VideoTestimonialData {
  videoId: string;
  headline: string;
  body: string;
}

export interface ReviewData {
  name: string;
  date: string;
  quote: string;
}

export interface WolfWinTileData {
  src: string;
  handle: string;
  caption: string;
  dollars: string;
  platform: string;
  accent?: string;
}

export interface RickRossSlide {
  src: string;
  date: string;
  amount: string;
  note: string;
}

export interface LifestyleTile {
  src: string;
  tag: string;
  line: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface TopCallTileData {
  src: string;
  ticker: string;
  amount: string;
  note: string;
  accent?: string;
}

export interface HeroBadge {
  k: string;
  v: string;
}

export interface PriceRow {
  text: string;
}

export interface FooterLink {
  label: string;
  href: string;
}
