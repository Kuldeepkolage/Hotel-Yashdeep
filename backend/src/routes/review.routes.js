import express from "express";
import { getGoogleReviews } from "../controllers/review.controller.js";

const router = express.Router();

// GET /api/reviews - public endpoint to fetch Google reviews
router.get("/", getGoogleReviews);
router.get("/google", getGoogleReviews);

export default router;
