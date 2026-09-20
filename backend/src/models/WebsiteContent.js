import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    image: { type: String, default: "" },
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    category: { type: String, default: "general" },
    alt: { type: String, default: "" },
    filename: { type: String, default: "" },
  },
  { timestamps: true }
);

const websiteContentSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, default: "Hotel Yashdeep" },

    heroTitle: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },
    heroImage: { type: String, default: "" },

    // CMS structure used by the admin editor
    hero: {
      headline: { type: String, default: "Fine Dining, Timeless Moments" },
      subheadline: { type: String, default: "" },
      ctaText: { type: String, default: "Reserve a Table" },
      ctaLink: { type: String, default: "/reservations" },
      backgroundImage: { type: String, default: "" },
      overlayOpacity: { type: Number, default: 0.5 },
    },

    about: {
      title: { type: String, default: "Our Story" },
      body: { type: String, default: "" },
      image: { type: String, default: "" },
      highlights: { type: [String], default: [] },
    },

    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      address: {
        line1: { type: String, default: "" },
        line2: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        pincode: { type: String, default: "" },
      },
    },

    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    googleMap: { type: String, default: "" },

    openingHours: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    socialLinks: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    seo: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    footer: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    menuImages: { type: [imageSchema], default: [] },
    galleryImages: { type: [imageSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("WebsiteContent", websiteContentSchema);
