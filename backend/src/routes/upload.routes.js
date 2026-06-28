import express from "express";
import upload from "../middleware/upload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  uploadImage,
  uploadMultipleImages,
  uploadHeroImage,
  uploadGalleryImages,
  uploadMenuImages,
  deleteImage,
} from "../controllers/upload.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", upload.single("image"), uploadImage);
router.post("/multiple", upload.array("images", 10), uploadMultipleImages);
router.post("/hero", upload.single("image"), uploadHeroImage);
router.post("/gallery", upload.array("images", 20), uploadGalleryImages);
router.post("/menu", upload.array("images", 20), uploadMenuImages);
router.delete("/", deleteImage);

export default router;
