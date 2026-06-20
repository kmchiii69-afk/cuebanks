import type { CueTestimonial } from "@/components/page2/CueVideoTestimonial";

// Real, unscripted member video testimonials (self-hosted MP4 + poster frame).
// Captions are intentionally neutral — swap in each member's real quote/result
// once transcribed. Shared by /training and /offer.
export const CUE_TESTIMONIALS: CueTestimonial[] = [
  { src: "/wsa/testimonials/alex-1.mp4",   poster: "/wsa/testimonials/alex-1.jpg",   name: "Alex",     caption: "Why he joined WSA — and what changed." },
  { src: "/wsa/testimonials/regi.mp4",     poster: "/wsa/testimonials/regi.jpg",     name: "Regi",     caption: "On structure, accountability, and the WSA Protocol." },
  { src: "/wsa/testimonials/lakeisha.mp4", poster: "/wsa/testimonials/lakeisha.jpg", name: "Lakeisha", caption: "From overwhelmed to following a real roadmap." },
  { src: "/wsa/testimonials/alex-2.mp4",   poster: "/wsa/testimonials/alex-2.jpg",   name: "Alex",     caption: "The difference coaching and community made." },
];
