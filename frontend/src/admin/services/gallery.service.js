const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const galleryService = {
  async getImages({ page = 1, limit = 20, category = "", search = "" } = {}) {
    const params = new URLSearchParams({ page, limit });
    if (category) params.append("category", category);
    if (search) params.append("search", search);

    const res = await fetch(`${API_BASE}/gallery?${params}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch gallery images");
    return res.json();
  },

  async uploadImages(files, category = "general", onProgress) {
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("image", files[i]);
      formData.append("category", category);

      const res = await fetch(`${API_BASE}/gallery/upload`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });
      if (!res.ok) throw new Error(`Failed to upload ${files[i].name}`);
      const data = await res.json();
      results.push(data);
      if (onProgress) onProgress(Math.round(((i + 1) / files.length) * 100));
    }
    return results;
  },

  async deleteImage(id) {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete image");
    return res.json();
  },

  async updateImage(id, data) {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: "PATCH",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update image");
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/gallery/categories`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },
};

export const GALLERY_CATEGORIES = [
  { value: "all", label: "All Photos" },
  { value: "restaurant", label: "Restaurant" },
  { value: "ambiance", label: "Ambiance" },
  { value: "food", label: "Food & Drinks" },
  { value: "events", label: "Events" },
  { value: "exterior", label: "Exterior" },
  { value: "team", label: "Our Team" },
  { value: "general", label: "General" },
];