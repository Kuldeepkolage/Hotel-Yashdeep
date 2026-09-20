import api from "./api.js";

export const MENU_CATEGORIES = [
  "Starter", "Main Course", "Chinese", "Tandoor", "Rice",
  "Biryani", "Dessert", "Beverage", "Beer", "Mocktail",
];

const normalizeItem = (item) => ({
  ...item,
  veg: Boolean(item.isVeg ?? item.veg),
  image_url: item.image || item.image_url || "",
  is_recommended: Boolean(item.isRecommended ?? item.is_recommended),
  is_special: Boolean(item.isSpecial ?? item.is_special),
});

const toPayload = (payload = {}) => {
  const next = { ...payload };
  if ("veg" in next) { next.isVeg = Boolean(next.veg); delete next.veg; }
  if ("image_url" in next) { next.image = next.image_url; delete next.image_url; }
  if ("is_recommended" in next) { next.isRecommended = Boolean(next.is_recommended); delete next.is_recommended; }
  if ("is_special" in next) { next.isSpecial = Boolean(next.is_special); delete next.is_special; }
  return next;
};

export async function getMenuItems({ category = "", available = "", search = "", page = 1, limit = 12 } = {}) {
  const params = {};
  if (category && category !== "All") params.category = category;
  if (available !== "") params.available = available;
  const res = await api.get("/menu", { params });
  let items = (res.data?.data || []).map(normalizeItem);

  const q = String(search || "").trim().toLowerCase();
  if (q) items = items.filter((i) => `${i.name} ${i.description}`.toLowerCase().includes(q));

  const count = items.length;
  const start = (Number(page) - 1) * Number(limit);
  return { data: items.slice(start, start + Number(limit)), count };
}

export async function getMenuItem(id) {
  const res = await api.get(`/menu/${id}`);
  return normalizeItem(res.data?.data || res.data);
}

export async function createMenuItem(payload) {
  const res = await api.post("/menu", toPayload(payload));
  return normalizeItem(res.data?.data || res.data);
}

export async function updateMenuItem(id, payload) {
  const res = await api.put(`/menu/${id}`, toPayload(payload));
  return normalizeItem(res.data?.data || res.data);
}

export async function deleteMenuItem(id) {
  await api.delete(`/menu/${id}`);
}

export async function uploadMenuImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data?.url || "";
}

export async function toggleAvailability(id, available) {
  return updateMenuItem(id, { available });
}

export async function toggleRecommended(id, recommended) {
  return updateMenuItem(id, { isRecommended: recommended });
}
