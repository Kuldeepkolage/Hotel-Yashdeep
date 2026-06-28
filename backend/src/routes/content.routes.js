import express from "express";
import { getContent, updateContent } from "../controllers/content.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { updateContentValidator } from "../validators/content.validator.js";
import validate from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", getContent);
router.put("/", protect, updateContentValidator, validate, updateContent);

export default router;
