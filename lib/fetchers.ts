import type {
  TeamMember,
  Event,
  Achievement,
  TeamInput,
  EventInput,
  AchievementInput,
  LoginInput,
} from "@/lib/types";

const BASE = "";

function csrfToken(): string {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("cpset_csrf="))
      ?.split("=")[1] ?? ""
  );
}

async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (typeof window === "undefined") {
    return [] as unknown as T;
  }

  const headers: Record<string, string> = {
    "X-Requested-With": "XMLHttpRequest",
    ...(options.headers as Record<string, string>),
  };

  // Add CSRF for mutations
  if (options.method && options.method !== "GET") {
    headers["X-CSRF-Token"] = csrfToken();
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: "same-origin",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Team ──────────────────────────────────────────────

export const fetchTeam = () => api<TeamMember[]>("/api/team");

export const createTeamMember = (data: TeamInput) =>
  api<TeamMember>("/api/team", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateTeamMember = (id: string, data: TeamInput) =>
  api<TeamMember>(`/api/team/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteTeamMember = (id: string) =>
  api<void>(`/api/team/${id}`, { method: "DELETE" });

// ── Events ────────────────────────────────────────────

export const fetchEvents = () => api<Event[]>("/api/events");

export const createEvent = (data: EventInput) =>
  api<Event>("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateEvent = (id: string, data: EventInput) =>
  api<Event>(`/api/events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteEvent = (id: string) =>
  api<void>(`/api/events/${id}`, { method: "DELETE" });

// ── Achievements ──────────────────────────────────────

export const fetchAchievements = () =>
  api<Achievement[]>("/api/achievements");

export const createAchievement = (data: AchievementInput) =>
  api<Achievement>("/api/achievements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateAchievement = (id: string, data: AchievementInput) =>
  api<Achievement>(`/api/achievements/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteAchievement = (id: string) =>
  api<void>(`/api/achievements/${id}`, { method: "DELETE" });

// ── Auth ──────────────────────────────────────────────

export const login = (data: LoginInput) =>
  api<{ ok: boolean }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const logout = () =>
  api<{ ok: boolean }>("/api/auth/logout", { method: "POST" });

// ── TOTP / 2FA ─────────────────────────────────────────

/** Step 1 — generate a TOTP secret + otpauth:// URL for the QR code. */
export const generateTotp = () =>
  api<{ secret: string; otpauthUrl: string }>("/api/auth/totp");

/** Step 2 — confirm a 6-digit code to activate TOTP on the account. */
export const enableTotp = (token: string) =>
  api<{ ok: boolean }>("/api/auth/totp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

/** Disable TOTP and clear the secret (invalidates all sessions). */
export const disableTotp = () =>
  api<void>("/api/auth/totp", { method: "DELETE" });

// ── Image Upload ──────────────────────────────────────

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/uploads/image", {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRF-Token": csrfToken(),
    },
    credentials: "same-origin",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(body.error || "Upload failed");
  }

  const { url } = await res.json();
  return url;
};
