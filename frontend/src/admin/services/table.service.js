/**
 * table.service.js
 * All API calls talk directly to your Express/MongoDB backend.
 * No hardcoded / mock data anywhere.
 *
 * Expected backend routes:
 *   GET    /api/tables              → { tables, total, totalPages }
 *   GET    /api/tables/stats        → { stats: { total, available, reserved, occupied, maintenance } }
 *   GET    /api/tables/:id          → { table }
 *   POST   /api/tables              → { table }
 *   PUT    /api/tables/:id          → { table }
 *   DELETE /api/tables/:id          → { message }
 *   PATCH  /api/tables/:id/status   → { table }
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Auth helper ───────────────────────────────────────────────────
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ── Response handler ──────────────────────────────────────────────
const handleResponse = async (res) => {
  if (!res.ok) {
    let errMsg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      errMsg = body.message || body.error || errMsg;
    } catch (_) {
      // response body wasn't JSON
    }
    throw new Error(errMsg);
  }
  return res.json();
};

// ── Build query string, stripping undefined/null/"all" values ────
const buildQuery = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "" && val !== "all") {
      q.set(key, val);
    }
  });
  const str = q.toString();
  return str ? `?${str}` : "";
};

// ── Service object ────────────────────────────────────────────────
export const tableService = {
  /**
   * GET /api/tables
   * Params: search, status, floor, section, page, limit
   * Returns: { tables: [...], total: N, totalPages: N }
   */
  async getTables(params = {}) {
    const url = `${API_BASE}/tables${buildQuery(params)}`;
    const res = await api.get(url, {
      method: "GET",
      // headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * GET /api/tables/stats
   * Returns: { stats: { total, available, reserved, occupied, maintenance } }
   *
   * Your backend should run an aggregation like:
   *   Table.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
   * and return counts per status plus a grand total.
   */
  async getStats() {
    const url = `${API_BASE}/tables/stats`;
    const res = await api.get(url, {
      method: "GET",
      // headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * GET /api/tables/:id
   * Returns: { table: { ... } }
   */
  async getTable(id) {
    const res = await api.get(`${API_BASE}/tables/${id}`, {
      method: "GET",
      // headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * POST /api/tables
   * Body: { tableNumber, capacity, floor, section, status }
   * Returns: { table: { ... } }
   */
  async createTable(data) {
    const res = await api.post(`${API_BASE}/tables`, {
      method: "POST",
      // headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * PUT /api/tables/:id
   * Body: { tableNumber, capacity, floor, section, status }
   * Returns: { table: { ... } }
   */
  async updateTable(id, data) {
    const res = await api.put(`${API_BASE}/tables/${id}`, {
      method: "PUT",
      // headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * DELETE /api/tables/:id
   * Returns: { message: "Table deleted" }
   */
  async deleteTable(id) {
    const res = await api.delete(`${API_BASE}/tables/${id}`, {
      method: "DELETE",
      // headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * PATCH /api/tables/:id/status
   * Body: { status }
   * Returns: { table: { ... } }
   */
  async updateTableStatus(id, status) {
    const res = await api.patch(`${API_BASE}/tables/${id}/status`, {
      method: "PATCH",
      // headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },
};