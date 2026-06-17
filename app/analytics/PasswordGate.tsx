"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/analytics/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        {/* WSA badge */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/wsa/home/1.png"
          alt="Wall Street Academy"
          style={{ height: 72, width: 72, borderRadius: "50%", objectFit: "cover", display: "block", margin: "0 auto 28px" }}
        />

        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.28em",
            color: "#f9ff3c",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          · Wall Street Academy ·
        </div>
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: "#707070",
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          · Analytics Access ·
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            required
            style={{
              width: "100%",
              background: "#0c1018",
              border: "1px solid #2b333f",
              borderRadius: 8,
              color: "#ffffff",
              padding: "16px 20px",
              fontFamily: "'Open Sans', sans-serif",
              fontSize: 14,
              letterSpacing: "0.04em",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#f9ff3c")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#2b333f")}
          />

          {error && (
            <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: "#e93d3d", letterSpacing: "0.04em" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: "16px",
              background: loading || !password ? "#1a2230" : "#f9ff3c",
              border: 0,
              borderRadius: 8,
              color: loading || !password ? "#707070" : "#000000",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: loading || !password ? "default" : "pointer",
              transition: "all 200ms ease",
            }}
          >
            {loading ? "Verifying..." : "Unlock →"}
          </button>
        </form>
      </div>
    </div>
  );
}
