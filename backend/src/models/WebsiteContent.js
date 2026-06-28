import mongoose from "mongoose";

const websiteContentSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      default: "Hotel Yashdeep",
    },

    heroTitle: String,

    heroSubtitle: String,

    heroImage: {
      type: String,
      default: "",
    },

    about: String,

    address: String,

    phone: String,

    email: String,

    googleMap: String,

    openingHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
    },

    socialLinks: {
      facebook: String,
      instagram: String,
      whatsapp: String,
    },

    menuImages: [
      {
        image: String,
      },
    ],

    galleryImages: [
      {
        image: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("WebsiteContent", websiteContentSchema);
