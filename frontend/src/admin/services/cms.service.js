import api from "./api.js";

const unwrap = (response) => response?.data?.data ?? response?.data ?? {};

export const cmsService = {
  async getContent() {
    return unwrap(await api.get("/content"));
  },

  async saveContent(data) {
    return unwrap(await api.put("/content", data));
  },

  async saveSection(section, data) {
    const current = await this.getContent();
    return this.saveContent({ ...current, [section]: data });
  },

  async resetContent() {
    return this.saveContent(DEFAULT_CMS_CONTENT);
  },
};

export const DEFAULT_CMS_CONTENT = {
  restaurantName: "Hotel Yashdeep",
  hero: {
    headline: "Fine Dining, Timeless Moments",
    subheadline: "Experience the art of Indian cuisine in an ambiance crafted for celebration.",
    ctaText: "Reserve a Table",
    ctaLink: "/reservations",
    backgroundImage: "",
    overlayOpacity: 0.5,
  },
  about: {
    title: "Our Story",
    body: "Hotel Yashdeep brings traditional Indian warmth together with modern hospitality.",
    image: "",
    highlights: [],
  },
  contact: {
    phone: "",
    email: "",
    address: { line1: "", line2: "", city: "", state: "", pincode: "" },
  },
  openingHours: [],
  socialLinks: { instagram: "", facebook: "", twitter: "", youtube: "", whatsapp: "" },
  seo: { title: "", description: "", keywords: "", ogImage: "" },
  footer: {
    tagline: "Crafted with love, served with pride.",
    copyrightName: "Hotel Yashdeep",
    showSocialLinks: true,
    showOpeningHours: true,
    quickLinks: [],
  },
};
