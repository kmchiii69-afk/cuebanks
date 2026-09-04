import type { ReactNode } from "react";
import { TYPEFORM_ID, funnelBtn } from "./funnel";

/** Centered wrapper matching the funnel `.wrap` (max-width 1120px). */
export function HomeWrap({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1120px] px-[22px] ${className}`}>{children}</div>
  );
}

export function HomeEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3.5 font-h2 text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-acid">
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
      <h2 className="mb-3.5 font-h2 text-[clamp(1.7rem,3.6vw,2.7rem)] font-extrabold leading-[1.1] tracking-[-0.01em] text-bone">
        {title}
      </h2>
      {sub ? <p className="font-h1 text-[1.05rem] leading-relaxed text-[#cbd5e0]">{sub}</p> : null}
    </div>
  );
}

/** Apply CTA — Typeform popup; `/ig` if the embed script fails. */
export function TypeformApplyLink({
  children,
  className = funnelBtn,
  typeformId = TYPEFORM_ID,
}: {
  children: ReactNode;
  className?: string;
  typeformId?: string;
}) {
  return (
    <a
      href="/ig"
      className={className}
      data-tf-popup={typeformId}
      data-tf-opacity="100"
      data-tf-iframe-props="title=Wall Street Academy Application"
      data-tf-transitive-search-params=""
      data-tf-medium="snippet"
    >
      {children}
    </a>
  );
}
