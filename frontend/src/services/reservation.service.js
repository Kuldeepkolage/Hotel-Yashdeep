import publicApi from "./publicApi.js";

export async function createReservation(payload) {
  const response = await publicApi.post("/reservations", payload);
  return response.data?.data || response.data;
}

export async function checkReservation(bookingId, phone) {
  const response = await publicApi.post(`/reservations/${encodeURIComponent(bookingId)}/check`, { phone });
  return response.data?.data || response.data;
}

export async function rescheduleReservation(bookingId, payload) {
  const response = await publicApi.put(`/reservations/${encodeURIComponent(bookingId)}/reschedule`, payload);
  return response.data?.data || response.data;
}

export async function cancelReservation(bookingId, phone) {
  const response = await publicApi.put(`/reservations/${encodeURIComponent(bookingId)}/cancel`, { phone });
  return response.data?.data || response.data;
}
