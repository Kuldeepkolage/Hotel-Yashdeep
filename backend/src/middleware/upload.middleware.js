import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hotel-yashdeep",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 5MB per file
  },
});

export default upload;
