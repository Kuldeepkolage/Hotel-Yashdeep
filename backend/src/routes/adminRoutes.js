import express from "express";

import {
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
} from "../controllers/adminController.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/me", protect, getCurrentAdmin);

router.post("/logout", protect, logoutAdmin);

export default router;