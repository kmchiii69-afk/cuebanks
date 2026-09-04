"use client";

import { M } from "./fonts";

// Centered LOADING splash. Renders before auth check resolves.
export default function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          ...M,
          fontSize: 11,
          color: "rgba(37,99,235,0.4)",
          letterSpacing: "0.2em",
        }}
      >
        LOADING
      </div>
    </div>
  );
}
