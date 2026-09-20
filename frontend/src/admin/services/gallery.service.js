import api from "./api.js";

export const galleryService = {
  async getImages({ page = 1, limit = 20, category = "", search = "" } = {}) {
    const res = await api.get("/gallery", { params: { page, limit, category, search } });
    return res.data?.data || res.data;
  },

  async uploadImages(files, category = "general", onProgress) {
    const formData = new FormData();
    Array.from(files || []).forEach((file) => formData.append("image", file));
    formData.append("category", category);

    const res = await api.post("/gallery/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total && onProgress) onProgress(Math.round((event.loaded * 100) / event.total));
      },
    });
    return res.data?.data || [];
  },

  async deleteImage(id) {
    const res = await api.delete(`/gallery/${id}`);
    return res.data?.data || res.data;
  },

  async updateImage(id, data) {
    const res = await api.patch(`/gallery/${id}`, data);
    return res.data?.data || res.data;
  },

  async getCategories() {
    const res = await api.get("/gallery/categories");
    return res.data?.data || res.data;
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
