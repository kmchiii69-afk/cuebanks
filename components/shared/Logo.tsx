export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, whiteSpace: "nowrap" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/wsa/home/1.png"
        alt="Wall Street Academy"
        style={{ height: 48, width: 48, borderRadius: "50%", objectFit: "cover", display: "block", flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: "0.04em",
          color: "var(--bone)",
          whiteSpace: "nowrap",
        }}
      >
        Wall Street Academy
      </span>
    </div>
  );
}
