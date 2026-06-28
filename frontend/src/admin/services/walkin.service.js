const BASE_URL = "/api/admin";

// function getAuthHeaders() {
//   const token = localStorage.getItem("admin_token");
//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

// ─── Walk-ins ────────────────────────────────────────────────────────────────

export async function fetchWalkIns({ page = 1, limit = 10, search = "", status = "", date = "" } = {}) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);
  if (search) params.set("search", search);
  if (status && status !== "all") params.set("status", status);
  if (date) params.set("date", date);

  const res = await fetch(`${BASE_URL}/walkins?${params.toString()}`, {
    // headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchWalkInById(id) {
  const res = await fetch(`${BASE_URL}/walkins/${id}`, {
    // headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function createWalkIn(payload) {
  const res = await fetch(`${BASE_URL}/walkins`, {
    method: "POST",
    // headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateWalkIn(id, payload) {
  const res = await fetch(`${BASE_URL}/walkins/${id}`, {
    method: "PUT",
    // headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteWalkIn(id) {
  const res = await fetch(`${BASE_URL}/walkins/${id}`, {
    method: "DELETE",
    // headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchWalkInStats() {
  const res = await fetch(`${BASE_URL}/walkins/stats`, {
    // headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ─── Tables ──────────────────────────────────────────────────────────────────

export async function fetchAvailableTables() {
  const res = await fetch(`${BASE_URL}/tables?status=available`, {
    // headers: getAuthHeaders(),
  });
  return handleResponse(res);
}