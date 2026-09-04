"use client";

import { M, S } from "./fonts";

type Props = {
  currentPassword: string;
  setCurrentPassword: (s: string) => void;
  newPassword: string;
  setNewPassword: (s: string) => void;
  confirmPassword: string;
  setConfirmPassword: (s: string) => void;
  pwError: string;
  pwSaved: boolean;
  pwSaving: boolean;
  changePassword: () => void;
  logout: () => void;
};

/** Bottom-of-dashboard card: change password + sign out. Local state lives
 *  in the parent page (PortalPage), which forwards it down here. */
export default function SecurityPanel({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  pwError,
  pwSaved,
  pwSaving,
  changePassword,
  logout,
}: Props) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          ...M,
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.28)",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        Security
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <label>
          <div
            style={{
              ...M,
              fontSize: 7.5,
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Current
          </div>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              padding: "9px 11px",
              color: "#fff",
              ...S,
              fontSize: 13,
              outline: "none",
            }}
          />
        </label>
        <label>
          <div
            style={{
              ...M,
              fontSize: 7.5,
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            New
          </div>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              padding: "9px 11px",
              color: "#fff",
              ...S,
              fontSize: 13,
              outline: "none",
            }}
          />
        </label>
        <label>
          <div
            style={{
              ...M,
              fontSize: 7.5,
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Confirm
          </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              padding: "9px 11px",
              color: "#fff",
              ...S,
              fontSize: 13,
              outline: "none",
            }}
          />
        </label>
      </div>
      {pwError ? (
        <div
          style={{
            ...S,
            fontSize: 12,
            color: "#ef4444",
            marginTop: 10,
          }}
        >
          {pwError}
        </div>
      ) : null}
      {pwSaved ? (
        <div
          style={{
            ...S,
            fontSize: 12,
            color: "#22c55e",
            marginTop: 10,
          }}
        >
          ✓ Password updated successfully.
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 14,
          alignItems: "center",
        }}
      >
        <button
          onClick={changePassword}
          disabled={pwSaving}
          style={{
            background: "rgba(37,99,235,0.12)",
            border: "1px solid rgba(37,99,235,0.35)",
            borderRadius: 7,
            padding: "9px 18px",
            ...M,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#2563eb",
            cursor: pwSaving ? "not-allowed" : "pointer",
            opacity: pwSaving ? 0.5 : 1,
          }}
        >
          {pwSaving ? "Updating…" : "Change Password"}
        </button>
        <button
          onClick={logout}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 7,
            padding: "9px 18px",
            ...M,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
