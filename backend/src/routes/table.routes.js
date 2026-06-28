import express from "express";
import {
  createTable,
  getTables,
  getTable,
  getAvailableTables,
  updateTable,
  deleteTable,
} from "../controllers/table.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { createTableValidator, updateTableValidator } from "../validators/table.validator.js";
import validate from "../middleware/validate.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getTables);
router.get("/available", getAvailableTables);
router.get("/:id", getTable);
router.post("/", createTableValidator, validate, createTable);
router.put("/:id", updateTableValidator, validate, updateTable);
router.delete("/:id", deleteTable);

export default router;
