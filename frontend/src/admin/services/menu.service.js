// src/admin/services/menu.service.js
// Uses ONLY the existing axios instance from api.js
// Routes are EXACTLY as defined in menu.routes.js mounted at /api/menu in app.js
// Model fields: name, category, description, price, image, isVeg, available
// Category enum: Starter | Main Course | Chinese | Tandoor | Rice | Biryani | Dessert | Beverage | Beer | Mocktail

import api from "./api.js";

// ─── Constants ───────────────────────────────────────────────────────────────

export const MENU_CATEGORIES = [
  "Starter",
  "Main Course",
  "Chinese",
  "Tandoor",
  "Rice",
  "Biryani",
  "Dessert",
  "Beverage",
  "Beer",
  "Mocktail",
];

// ─── API Calls ────────────────────────────────────────────────────────────────

/**
 * GET /api/menu
 * Supported query params from controller: category, available
 * Backend sorts by: { category: 1, createdAt: -1 }
 * All filtering beyond category+available is done client-side.
 *
 * @param {Object} params
 * @param {string} [params.category]   - exact category string or "" for all
 * @param {string} [params.available]  - "true" | "false" | "" for all
 * @returns {Promise<Array>}           - array of menu items
 */
export async function getMenuItems({ category = "", available = "" } = {}) {
  const params = {};
  if (category) params.category = category;
  if (available !== "") params.available = available;

  const res = await api.get("/menu", { params });
  // ApiResponse shape: { statusCode, data, message }
  return res.data.data;
}

/**
 * GET /api/menu/:id
 * @param {string} id - MongoDB _id
 * @returns {Promise<Object>} menu item
 */
export async function getMenuItem(id) {
  const res = await api.get(`/menu/${id}`);
  return res.data.data;
}

/**
 * POST /api/menu  (requires auth — token injected by api.js interceptor)
 * @param {Object} payload - { name, category, description, price, image, isVeg, available }
 * @returns {Promise<Object>} created menu item
 */
export async function createMenuItem(payload) {
  const res = await api.post("/menu", payload);
  return res.data.data;
}

/**
 * PUT /api/menu/:id  (requires auth)
 * @param {string} id
 * @param {Object} payload - fields to update
 * @returns {Promise<Object>} updated menu item
 */
export async function updateMenuItem(id, payload) {
  const res = await api.put(`/menu/${id}`, payload);
  return res.data.data;
}

/**
 * DELETE /api/menu/:id  (requires auth)
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteMenuItem(id) {
  await api.delete(`/menu/${id}`);
}

export async function uploadMenuImage(file) {
  return URL.createObjectURL(file);
}

/**
 * Toggle availability  — uses PUT /api/menu/:id
 * @param {string} id
 * @param {boolean} available
 * @returns {Promise<Object>} updated menu item
 */
export async function toggleAvailability(id, available) {
  return updateMenuItem(id, { available });
}

  export async function toggleRecommended(id, recommended){
   return updateMenuItem(id,{
      isRecommended:recommended
   });
}

// ─── Image Upload ─────────────────────────────────────────────────────────────
// TODO: Backend has an uploadRoutes mounted at /api/upload but the source was
// not provided. When available, implement:
//
// export async function uploadMenuImage(file) {
//   const formData = new FormData();
//   formData.append("image", file);
//   const res = await api.post("/upload", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data.data.url; // adjust to actual response shape
// }
//
// For now the form accepts a direct URL string for the `image` field.