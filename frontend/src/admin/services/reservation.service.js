import api from "./api";

// ─── Admin Reservation Endpoints ─────────────────────────────────────────────
// All admin routes are protected via Bearer token (handled by axios interceptor)
// Base path: /api/reservations/admin

/**
 * Get all reservations with optional filters
 * @param {{ status?: string, date?: string, isWalkIn?: boolean }} params
 */
export const fetchReservations = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status)                      query.append("status",   params.status);
  if (params.date)                        query.append("date",     params.date);
  if (params.isWalkIn !== undefined)      query.append("isWalkIn", params.isWalkIn);

  const qs = query.toString();
  const { data } = await api.get(`/reservations/admin${qs ? `?${qs}` : ""}`);
  return data; // { success, data: [...], message }
};

/**
 * Get a single reservation by its MongoDB _id
 * @param {string} id
 */
export const fetchReservationById = async (id) => {
  const { data } = await api.get(`/reservations/admin/${id}`);
  return data;
};

/**
 * Confirm a reservation and assign a table
 * @param {string} id  - reservation _id
 * @param {string} tableId - table _id
 */
export const confirmReservation = async (id, tableId) => {
  const { data } = await api.put(`/reservations/admin/${id}/confirm`, { tableId });
  return data;
};

/**
 * Reassign a table to an already-confirmed reservation
 * @param {string} id
 * @param {string} tableId
 */
export const assignTableToReservation = async (id, tableId) => {
  const { data } = await api.put(`/reservations/admin/${id}/assign-table`, { tableId });
  return data;
};

/**
 * Mark a reservation as Completed (also frees the table)
 * @param {string} id
 */
export const completeReservation = async (id) => {
  const { data } = await api.put(`/reservations/admin/${id}/complete`);
  return data;
};

/**
 * Update status to any valid enum value
 * Valid: Pending | Confirmed | Rescheduled | Completed | Cancelled | Walk-In
 * @param {string} id
 * @param {string} status
 */
export const updateReservationStatus = async (id, status) => {
  const { data } = await api.put(`/reservations/admin/${id}/status`, { status });
  return data;
};

/**
 * Permanently delete a reservation (also frees its table if assigned)
 * @param {string} id
 */
export const deleteReservation = async (id) => {
  const { data } = await api.delete(`/reservations/admin/${id}`);
  return data;
};

/**
 * Create a walk-in reservation (table assigned immediately)
 * @param {{ customerName, phone, email?, guests, specialRequest?, tableId }} payload
 */
export const createWalkIn = async (payload) => {
  const { data } = await api.post("/reservations/admin/walk-in", payload);
  return data;
};

// ─── Table endpoint (needed to populate "assign table" dropdown) ──────────────
/**
 * Fetch available tables for a given date / time slot
 * @param {{ reservationDate?: string, reservationTime?: string, guests?: number }} params
 */
export const fetchAvailableTables = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.reservationDate) query.append("reservationDate", params.reservationDate);
  if (params.reservationTime) query.append("reservationTime", params.reservationTime);
  if (params.guests)          query.append("guests",          params.guests);

  const qs = query.toString();
  const { data } = await api.get(`/tables/available${qs ? `?${qs}` : ""}`);
  return data;
};

/**
 * Fetch all tables (for admin dropdowns regardless of availability)
 */
export const fetchAllTables = async () => {
  const { data } = await api.get("/tables");
  return data;
};