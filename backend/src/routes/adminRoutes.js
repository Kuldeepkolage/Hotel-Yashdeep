import express from "express";
import { getCurrentAdmin, logoutAdmin } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, getCurrentAdmin);
router.post("/logout", protect, logoutAdmin);

export default router;
