import express from "express";
import {
  getContent,
  updateContent,
} from "../controllers/content.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getContent);

router.put("/", protect, updateContent);

export default router;