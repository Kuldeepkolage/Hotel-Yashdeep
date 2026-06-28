import express from "express";

import {
  createMenu,
  getMenus,
  getMenu,
  updateMenu,
  deleteMenu,
} from "../controllers/menu.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getMenus);

router.get("/:id", getMenu);

router.post("/", protect, createMenu);

router.put("/:id", protect, updateMenu);

router.delete("/:id", protect, deleteMenu);

export default router;