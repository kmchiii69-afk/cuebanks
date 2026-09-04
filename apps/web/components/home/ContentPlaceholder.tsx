import type { ReactNode } from "react";

export function ContentPlaceholderShell({
  badge,
  title,
  children,
  className = "",
}: {
  badge: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-dashed border-[var(--line-2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%),var(--bg-1)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative z-[1] p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          <span className="rounded-md border border-[var(--acid)]/35 bg-[rgba(var(--acid-rgb),0.08)] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--acid)]">
            {badge}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-faint)]">
            {title}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function HeroVideoPlaceholder() {
  return (
    <ContentPlaceholderShell badge="Replace me" title="Hero VSL / welcome video">
      <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <div className="relative aspect-video overflow-hidden rounded-lg border border-[var(--line)] bg-black/40">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 text-2xl text-white">
              ▶
            </div>
            <div className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[-0.02em] text-[var(--bone)]">
              WSA hero video goes here
            </div>
            <p className="max-w-[36ch] text-sm leading-relaxed text-[var(--fg-muted)]">
              16:9 Vimeo or Mux embed. Autoplay muted on load. Drop the final cut in once Cue&apos;s
              VSL is locked.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-left">
          <h3 className="font-[family-name:var(--font-display)] text-base font-semibold tracking-[-0.02em] text-[var(--bone)]">
            What to send us
          </h3>
          <ul className="space-y-2 text-[13px] leading-relaxed text-[var(--ash)]">
            <li>
              <span className="font-semibold text-[var(--bone)]">Asset:</span> final VSL / welcome
              cut (Vimeo link or file)
            </li>
            <li>
              <span className="font-semibold text-[var(--bone)]">Length:</span> ~2–8 minutes typical
            </li>
            <li>
              <span className="font-semibold text-[var(--bone)]">Aspect:</span> 16:9 landscape
            </li>
            <li>
              <span className="font-semibold text-[var(--bone)]">Optional:</span> poster/thumbnail
              frame + captions
            </li>
          </ul>
          <p className="border-t border-[var(--line)] pt-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
            Drop-in: Vimeo ID → home hero embed
          </p>
        </div>
      </div>
    </ContentPlaceholderShell>
  );
}

const FORM_FIELDS = [
  "Full name",
  "Email + phone",
  "Trading experience level",
  "Monthly income / capital range",
  "Why WSA / goals",
  "Availability for a strategy call",
];

export function TypeformPlaceholder() {
  return (
    <ContentPlaceholderShell badge="Replace me" title="Application Typeform embed">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-3 text-left">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-[-0.02em] text-[var(--bone)]">
            Qualification form slot
          </h3>
          <p className="text-[15px] leading-relaxed text-[var(--ash)]">
            Embed your Wall Street Academy Typeform here. The same form is opened by Apply CTAs
            across the site, so applicants never have to re-enter their info.
          </p>
          <ul className="space-y-2 text-[13px] leading-relaxed text-[var(--ash)]">
            <li>
              <span className="font-semibold text-[var(--bone)]">Provide:</span> Typeform form ID or
              share URL
            </li>
            <li>
              <span className="font-semibold text-[var(--bone)]">Redirect:</span> thank-you /
              booking URL after submit
            </li>
            <li>
              <span className="font-semibold text-[var(--bone)]">Webhook:</span> Discord / CRM if you
              want lead alerts
            </li>
          </ul>
          <p className="border-t border-[var(--line)] pt-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--fg-faint)]">
            Drop-in: Typeform ID → homepage + Apply popups
          </p>
        </div>

        <div className="rounded-lg border border-[var(--line)] bg-[var(--bg)]/70 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-faint)]">
              Suggested question flow
            </div>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 rounded-full bg-[var(--acid)]" />
            </div>
          </div>
          <div className="space-y-2.5">
            {FORM_FIELDS.map((label, i) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-md border border-[var(--line)] bg-[var(--bg-1)] px-3 py-2.5"
              >
                <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold text-[var(--fg-faint)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="h-2.5 flex-1 rounded-sm bg-white/10" />
                <span className="hidden text-[12px] text-[var(--muted)] sm:inline">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
            <span className="text-[12px] text-[var(--fg-faint)]">Preview only — not interactive</span>
            <span className="rounded-md border border-[var(--line-2)] px-3 py-1.5 text-[12px] font-semibold text-[var(--bone)] opacity-60">
              Submit application
            </span>
          </div>
        </div>
      </div>
    </ContentPlaceholderShell>
  );
}
