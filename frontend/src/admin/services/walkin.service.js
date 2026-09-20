import api from "./api.js";

const unwrap = (res) => res?.data?.data ?? res?.data ?? {};

const toUiStatus = (status) => ({
  "Walk-In": "seated",
  Confirmed: "seated",
  Completed: "completed",
  Cancelled: "cancelled",
  Pending: "waiting",
  Rescheduled: "waiting",
}[status] || "waiting");

const toApiStatus = (status) => ({
  waiting: "Pending",
  seated: "Walk-In",
  completed: "Completed",
  cancelled: "Cancelled",
}[status] || "Walk-In");

const normalize = (r) => ({
  ...r,
  id: r._id,
  tableId: r.table?._id || r.table || "",
  arrivalTime: r.createdAt || r.reservationDate,
  status: toUiStatus(r.status),
});

export async function fetchWalkIns({ page = 1, limit = 10, search = "", status = "", date = "" } = {}) {
  const res = await api.get("/reservations/admin", {
    params: { isWalkIn: true, ...(date ? { date } : {}) },
  });
  let rows = (unwrap(res) || []).map(normalize);

  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((r) => `${r.customerName} ${r.phone} ${r.bookingId}`.toLowerCase().includes(q));
  }
  if (status && status !== "all") rows = rows.filter((r) => r.status === status);

  const total = rows.length;
  return {
    walkIns: rows.slice((page - 1) * limit, page * limit),
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function fetchWalkInById(id) {
  const res = await api.get(`/reservations/admin/${id}`);
  return normalize(unwrap(res));
}

export async function createWalkIn(payload) {
  const res = await api.post("/reservations/admin/walk-in", {
    customerName: payload.customerName,
    phone: payload.phone,
    email: payload.email || "",
    guests: Number(payload.guests),
    specialRequest: payload.specialRequest || "",
    tableId: payload.tableId,
  });
  return normalize(unwrap(res));
}

export async function updateWalkIn(id, payload) {
  let current = await fetchWalkInById(id);
  let result = current;

  if (payload.tableId && payload.tableId !== current.tableId) {
    const res = await api.put(`/reservations/admin/${id}/assign-table`, { tableId: payload.tableId });
    result = normalize(unwrap(res));
  }

  const fields = {
    ...(payload.status ? { status: toApiStatus(payload.status) } : {}),
  };

  if (Object.keys(fields).length) {
    const res = await api.put(`/reservations/admin/${id}/status`, fields);
    result = normalize(unwrap(res));
  }

  return result;
}

export async function deleteWalkIn(id) {
  const res = await api.delete(`/reservations/admin/${id}`);
  return unwrap(res);
}

export async function fetchWalkInStats() {
  const res = await api.get("/reservations/admin", { params: { isWalkIn: true } });
  const rows = (unwrap(res) || []).map(normalize);
  return {
    todayTotal: rows.filter((r) => new Date(r.reservationDate).toDateString() === new Date().toDateString()).length,
    total: rows.length,
    waiting: rows.filter((r) => r.status === "waiting").length,
    seated: rows.filter((r) => r.status === "seated").length,
    completed: rows.filter((r) => r.status === "completed").length,
    cancelled: rows.filter((r) => r.status === "cancelled").length,
  };
}

export async function fetchAvailableTables() {
  const res = await api.get("/tables/available");
  return unwrap(res);
}
