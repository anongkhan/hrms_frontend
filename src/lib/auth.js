export const ROLE_ROUTES = {
  HR: ["/dashboard", "/employee", "/attendance", "/leave"],
  Employee: ["/dashboard", "/attendance", "/leave"],
  Accountant: ["/payroll", "/reports"],
  Admin: ["/dashboard", "/employee", "/attendance", "/leave", "/payroll", "/reports"],
};

export function normalizeRole(role) {
  if (!role) return "";

  const normalized = String(role).trim().toLowerCase();
  if (normalized === "accounting" || normalized === "accountant") return "Accountant";
  if (normalized === "admin") return "Admin";
  if (normalized === "hr") return "HR";
  if (normalized === "employee") return "Employee";

  return role;
}

export function getDefaultRoute(role) {
  const normalizedRole = normalizeRole(role);
  return ROLE_ROUTES[normalizedRole]?.[0] || "/";
}

export function canAccessPath(role, pathname) {
  const normalizedRole = normalizeRole(role);
  const allowedRoutes = ROLE_ROUTES[normalizedRole] || [];

  return allowedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function getStoredSession() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");

  if (!token || !rawUser) return null;

  try {
    const user = JSON.parse(rawUser);
    return {
      token,
      user: {
        ...user,
        Role: normalizeRole(user.Role || user.role),
      },
    };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
}

export function storeSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify({
    ...user,
    Role: normalizeRole(user.Role || user.role),
  }));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
