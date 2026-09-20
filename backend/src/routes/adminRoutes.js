import express from "express";

import {
  getCurrentAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  logoutAdmin,
} from "../controllers/admin.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/*
 * All admin routes require authentication.
 */
router.use(protect);

/*
 * Current logged-in admin
 */
router.get(
  "/me",
  getCurrentAdmin
);

/*
 * Profile
 */
router.get(
  "/profile",
  getAdminProfile
);

router.put(
  "/profile",
  updateAdminProfile
);

/*
 * Password
 */
router.put(
  "/change-password",
  changeAdminPassword
);

/*
 * Logout
 */
router.post(
  "/logout",
  logoutAdmin
);

export default router;