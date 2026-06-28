import express from "express";
import { loginAdmin } from "../controllers/auth.controller.js";
import { loginValidator } from "../validators/auth.validator.js";
import validate from "../middleware/validate.middleware.js";
import { loginLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

router.post("/login", loginLimiter, loginValidator, validate, loginAdmin);

export default router;
