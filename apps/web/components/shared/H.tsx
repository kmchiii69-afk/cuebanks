import React from "react";
import Wrap from "./Wrap";

export default function H({
  num,
  label,
  title,
  sub,
  className,
}: {
  num: string;
  label: string;
  title: React.ReactNode;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={`mb-15 ${className ?? ""}`}>
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <span className="font-mono text-[11px] font-semibold text-acid tracking-[0.22em] px-3 py-1.5 border border-acid whitespace-nowrap">
          § {num}
        </span>
        <div className="font-mono text-[11px] font-semibold text-acid tracking-[0.22em] uppercase">
          {label}
        </div>
      </div>
      <h2 className="font-display font-semibold text-[76px] leading-[0.98] tracking-[-0.04em] text-bone mb-6 max-w-[1100px]">
        {title}
      </h2>
      {sub && (
        <p className="font-body text-[19px] leading-[1.6] text-ash m-0 max-w-[820px] font-normal">
          {sub}
        </p>
      )}
    </div>
  );
}

export function Section({
  id,
  children,
  py = 120,
  className,
  style,
}: {
  id?: string;
  children: React.ReactNode;
  py?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section
      id={id}
      style={{ paddingTop: py, paddingBottom: py, ...style }}
      className={className}
    >
      <Wrap>{children}</Wrap>
    </section>
  );
}
