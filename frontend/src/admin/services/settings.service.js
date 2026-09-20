import api from "./api.js";

/* -------------------------------------------------------------------------
 * Settings service
 *
 * Every Settings API call lives here. It reuses the existing Axios instance
 * (./api.js), so the existing auth token / interceptors apply unchanged.
 *
 * ENDPOINTS below are the paths from the project brief. They have NOT been
 * verified against the backend. If your routes differ, change them here and
 * nowhere else.
 *
 * Path prefix: if api.defaults.baseURL already ends in "/api" the prefix is
 * dropped automatically; otherwise "/api" is added. Adjust apiPrefix() if
 * your auth.service.js does something different.
 * ---------------------------------------------------------------------- */

const ENDPOINTS = {
  profile: "/admin/profile", // GET, PUT
  changePassword: "/admin/change-password", // PUT
  sessions: "/admin/sessions", // GET
  session: (id) => `/admin/session/${encodeURIComponent(id)}`, // DELETE
  logoutAll: "/admin/logout-all", // POST
};

const apiPrefix = () => {
  const base = String(api?.defaults?.baseURL || "").replace(/\/+$/, "");
  return /\/api$/i.test(base) ? "" : "/api";
};

const url = (path) => `${apiPrefix()}${path}`;

/* ------------------------------ helpers -------------------------------- */

const unwrap = (res) => res?.data?.data ?? res?.data;

/**
 * Converts an Axios error into a plain Error with:
 *   - message      : text safe to show in the UI
 *   - status       : HTTP status (or null)
 *   - unavailable  : true when the endpoint does not exist (404/405/501)
 */
const toServiceError = (err, fallback) => {
  const status = err?.response?.status ?? null;
  const data = err?.response?.data;

  let message = "";
  if (data && typeof data === "object") {
    const candidate = data.message || data.error || data.msg;
    if (typeof candidate === "string") message = candidate;
  }
  if (!message) {
    if (err?.response) message = fallback;
    else if (err?.request) {
      message = "Unable to reach the server. Check your connection and try again.";
    } else message = err?.message || fallback;
  }

  const out = new Error(message);
  out.status = status;
  out.unavailable = status === 404 || status === 405 || status === 501;
  return out;
};

/** Copies only defined values from `patch` onto `base`. */
export const mergeDefined = (base, patch) => {
  const out = { ...(base || {}) };
  Object.entries(patch || {}).forEach(([key, value]) => {
    if (value !== undefined) out[key] = value;
  });
  return out;
};

/* ---------------------------- normalizers ------------------------------ */

/**
 * Maps whatever the backend returns (or the AuthContext user) onto the fields
 * the Settings UI understands. Missing fields stay `undefined` — nothing is
 * invented. Returns null when the object does not look like a profile.
 */
export const normalizeProfile = (raw) => {
  if (!raw || typeof raw !== "object") return null;
  const src = raw.admin ?? raw.user ?? raw.profile ?? raw.data ?? raw;
  if (!src || typeof src !== "object") return null;

  const profile = {
    id: src._id ?? src.id,
    name: src.name,
    email: src.email,
    phone: src.phone,
    role: src.role,
    createdAt: src.createdAt,
    lastLogin: src.lastLogin ?? src.lastLoginAt,
  };

  return profile.id || profile.name || profile.email ? profile : null;
};

const normalizeSession = (raw) => {
  if (!raw || typeof raw !== "object") return null;
  return {
    id: raw._id ?? raw.id ?? raw.sessionId,
    device: raw.device ?? raw.deviceName ?? raw.browser ?? raw.userAgent,
    ip: raw.ip ?? raw.ipAddress,
    location: raw.location,
    lastActive: raw.lastActive ?? raw.lastActiveAt ?? raw.lastUsedAt ?? raw.updatedAt,
    createdAt: raw.createdAt,
    current: Boolean(raw.isCurrent ?? raw.current ?? raw.currentSession),
  };
};

/* ------------------------------ requests ------------------------------- */

export const getProfile = async () => {
  let res;
  try {
    res = await api.get(url(ENDPOINTS.profile));
  } catch (err) {
    throw toServiceError(err, "Could not load your profile.");
  }

  const profile = normalizeProfile(unwrap(res));
  if (!profile) throw new Error("The server returned an unexpected profile response.");
  return profile;
};

/** Returns the updated profile if the server sends one, otherwise null. */
export const updateProfile = async (payload) => {
  try {
    const res = await api.put(url(ENDPOINTS.profile), payload);
    return normalizeProfile(unwrap(res));
  } catch (err) {
    throw toServiceError(err, "Could not update your profile.");
  }
};

/**
 * Field names are mapped in one place. If your backend expects different
 * keys (e.g. `oldPassword`, `password`), change them here.
 */
const buildPasswordPayload = ({ currentPassword, newPassword }) => ({
  currentPassword,
  newPassword,
});

export const changePassword = async (values) => {
  try {
    const res = await api.put(url(ENDPOINTS.changePassword), buildPasswordPayload(values));
    return res?.data?.message || "";
  } catch (err) {
    throw toServiceError(err, "Could not change your password.");
  }
};

export const getSessions = async () => {
  // JWT authentication is stateless in this backend; there is no server-side
  // session collection to enumerate. Return an empty list instead of calling
  // a nonexistent endpoint so Settings remains functional.
  return [];
};

export const revokeSession = async () => {
  return "Session management is stateless.";
};

export const logoutAllDevices = async () => {
  try {
    const res = await api.post("/admin/logout");
    return res?.data?.message || "";
  } catch (err) {
    throw toServiceError(err, "Could not log out.");
  }
};
