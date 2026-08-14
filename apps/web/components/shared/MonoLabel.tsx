import React from "react";

const COLOR_CLASS: Record<string, string> = {
  "var(--acid)": "text-acid",
  "var(--ash)": "text-ash",
  "var(--bone)": "text-bone",
  "var(--muted)": "text-muted",
  "var(--pink)": "text-pink",
};

export default function MonoLabel({
  children,
  color = "var(--acid)",
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}) {
  const colorClass = COLOR_CLASS[color] ?? "";
  return (
    <div
      style={style}
      className={`font-mono text-[11px] font-bold tracking-[0.22em] uppercase ${colorClass}`}
    >
      {children}
    </div>
  );
}
