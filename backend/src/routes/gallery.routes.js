import express from "express";
import upload from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  getGalleryImages,
  getGalleryCategories,
  uploadGallery,
  deleteGalleryImage,
  updateGalleryImage,
} from "../controllers/gallery.controller.js";

const router = express.Router();

router.get("/", getGalleryImages);
router.get("/categories", getGalleryCategories);
router.post("/upload", protect, upload.array("image", 20), uploadGallery);
router.delete("/:id", protect, deleteGalleryImage);
router.patch("/:id", protect, updateGalleryImage);

export default router;
