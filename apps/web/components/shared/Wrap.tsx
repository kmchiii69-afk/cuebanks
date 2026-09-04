import React from "react";

export default function Wrap({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        ...style,
      }}
      className={`mx-auto w-full max-w-[1320px] px-12 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
