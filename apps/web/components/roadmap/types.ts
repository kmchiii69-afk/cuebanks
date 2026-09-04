// Type definitions for the Inner Circle roadmap modules.
// These types live alongside the data so the rendering modules can stay
// focused on JSX, not on declared shapes.

import type { Video } from "@/lib/roadmap-data";

export type DocSection = {
  heading: string;
  paras?: string[];
  bullets?: string[];
  footer?: string;
};

export type DocContent = {
  title: string;
  sections: DocSection[];
};

export type ChecklistItem = { text: string };
export type ChecklistSection = { heading: string; items: ChecklistItem[] };

export type ChecklistDoc = {
  title: string;
  theme: "red" | "green";
  sections: ChecklistSection[];
  rule?: string;
};

export type PhaseItem = {
  label: string;
  note: string;
  tag?: string;
  videos?: Video[];
  doc?: DocContent;
  checklist?: ChecklistDoc;
  images?: string[];
};

export type Phase = {
  num: string;
  title: string;
  duration: string;
  tagline: string;
  checkpoint: string;
  items: PhaseItem[];
};

export type ModalVideo = { id: string; hash?: string; label: string };

export type ImageGalleryProps = { images: string[]; title: string };

export type Member = {
  email: string;
  name: string;
  cohort: string;
  created_at: number;
  current_phase: number;
  phase_progress: import("@/lib/phases").PhaseProgress;
};
