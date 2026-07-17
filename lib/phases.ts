// Canonical roadmap phase metadata + progress helpers.
// Single source of truth — app/roadmap/page.tsx, app/portal/page.tsx, and
// app/admin/page.tsx all previously hardcoded their own divergent copies of
// this list (different counts, different current_phase→title mappings).
// Import from here instead of redefining it locally.

export interface PhaseDef {
  id: number;
  num: string;
  title: string;
  duration: string;
  hasHomework: boolean;
}

export const PHASES: PhaseDef[] = [
  { id: 1, num: "00", title: "Prepare",           duration: "Week 1",      hasHomework: true },
  { id: 2, num: "SET", title: "Set",               duration: "Week 2 – 3",  hasHomework: true },
  { id: 3, num: "EXE", title: "Execute",           duration: "Week 4",      hasHomework: false },
  { id: 4, num: "01",  title: "Phase 1 — Launch", duration: "Week 5",      hasHomework: false },
  { id: 5, num: "02",  title: "Phase 2",           duration: "Week 6 – 7",  hasHomework: true },
  { id: 6, num: "03",  title: "Phase 3",           duration: "Week 7 – 10", hasHomework: true },
  { id: 7, num: "04",  title: "Phase 4",           duration: "Week 11 – 14", hasHomework: false },
  { id: 8, num: "★",   title: "Bonus",             duration: "Week 14 – 21", hasHomework: false },
];

export const TOTAL_PHASES = PHASES.length;

export function getPhase(id: number): PhaseDef | undefined {
  return PHASES.find(p => p.id === id);
}

export function phaseLabel(id: number): string {
  if (id <= 0) return "—";
  if (id > TOTAL_PHASES) return "Complete ✓";
  return getPhase(id)?.title ?? "—";
}

export type PhaseCompletion = {
  status: "complete";
  completedAt: string;
  completedBy: "member" | "admin";
  homeworkConfirmed?: boolean;
};

export type PhaseProgress = Record<string, PhaseCompletion>;

export function isPhaseComplete(progress: PhaseProgress | null | undefined, id: number): boolean {
  return progress?.[String(id)]?.status === "complete";
}

// Phase 1 is always unlocked; every other phase requires the previous one complete.
export function isPhaseUnlocked(progress: PhaseProgress | null | undefined, id: number): boolean {
  if (id <= 1) return true;
  return isPhaseComplete(progress, id - 1);
}

// The furthest phase the member has unlocked — kept as the `current_phase`
// cache column so existing progress-bar/dot rendering keeps working.
export function furthestUnlockedPhase(progress: PhaseProgress | null | undefined): number {
  let furthest = 1;
  for (let id = 1; id <= TOTAL_PHASES; id++) {
    if (isPhaseComplete(progress, id)) furthest = Math.min(id + 1, TOTAL_PHASES);
    else break;
  }
  return furthest;
}
