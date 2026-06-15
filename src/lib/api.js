import { clearSession, getStoredSession } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiRequest(path, options = {}) {
  const session = getStoredSession();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (response.status === 401) {
    clearSession();
  }

  if (!response.ok) {
    throw new Error(data?.message || "API request failed");
  }

  return data;
}

export { API_BASE_URL };
