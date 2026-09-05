export type AppRole = "member" | "admin" | "team";

export function isStaffRole(role: string | null | undefined): boolean {
  return role === "admin" || role === "team";
}

export function isAdminRole(role: string | null | undefined): boolean {
  return role === "admin";
}
