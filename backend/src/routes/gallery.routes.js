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
router.use(protect);

router.get("/", getGalleryImages);
router.get("/categories", getGalleryCategories);
router.post("/upload", upload.array("image", 20), uploadGallery);
router.delete("/:id", deleteGalleryImage);
router.patch("/:id", updateGalleryImage);

export default router;
