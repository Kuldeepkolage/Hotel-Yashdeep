import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    filename: { type: String, default: "" },
    mimeType: { type: String, default: "image/*" },
    size: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
