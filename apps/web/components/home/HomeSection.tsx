import type { ReactNode } from "react";

/** Centered wrapper matching the funnel's `.wrap` (max-width 1100px, side gutters). */
export function HomeWrap({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1100px] px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

export function HomeEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3.5 font-[family-name:var(--font-mono)] text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-[var(--acid)]">
      {children}
    </div>
  );
}

export function HomeSecHead({
  eyebrow,
  title,
  sub,
  center,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 max-w-[62ch] ${center ? "mx-auto text-center" : ""}`}>
      <HomeEyebrow>{eyebrow}</HomeEyebrow>
      <h2 className="mb-3.5 text-[clamp(1.7rem,3.6vw,2.7rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--bone)]">
        {title}
      </h2>
      {sub ? <p className="text-[1.05rem] leading-relaxed text-[var(--ash)]">{sub}</p> : null}
    </div>
  );
}

/** Apply CTA — opens the Typeform popup; falls back to /ig if the embed fails to load. */
export function TypeformApplyLink({
  children,
  className = "btn",
  typeformId,
}: {
  children: ReactNode;
  className?: string;
  typeformId: string;
}) {
  return (
    <a
      href="/ig"
      className={className}
      data-tf-popup={typeformId}
      data-tf-opacity="100"
      data-tf-iframe-props="title=Wall Street Academy Application"
      data-tf-transitive-search-params
      data-tf-medium="snippet"
    >
      {children}
    </a>
  );
}
