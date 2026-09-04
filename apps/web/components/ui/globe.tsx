"use client";
import React from "react";

interface GlobeProps {
  /** Rendered diameter in pixels. The sphere scales from a 250px base. */
  size?: number;
  style?: React.CSSProperties;
}

export default function Globe({ size = 250, style }: GlobeProps) {
  const scale = size / 250;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        ...style,
      }}
    >
      <div
        style={{
          width: 250,
          height: 250,
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow:
            "0 0 20px rgba(255,255,255,0.18), -5px 0 8px #c3f4ff inset, 15px 2px 25px #000 inset, -24px -2px 34px rgba(195,244,255,0.6) inset, 250px 0 44px rgba(0,0,0,0.4) inset, 150px 0 38px rgba(0,0,0,0.67) inset",
          backgroundImage:
            "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "left center",
          animation: "earthRotate 30s linear infinite",
        }}
      />
    </div>
  );
}
