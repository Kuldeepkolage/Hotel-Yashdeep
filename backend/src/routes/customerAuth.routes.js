import express from "express";
import {
  signupCustomer,
  verifyOTP,
  resendOTP,
  loginCustomer,
  getCurrentCustomer,
} from "../controllers/customerAuth.controller.js";
import {
  signupValidator,
  verifyOtpValidator,
  resendOtpValidator,
  customerLoginValidator,
} from "../validators/customerAuth.validator.js";
import validate from "../middleware/validate.middleware.js";
import {
  customerAuthLimiter,
  otpResendLimiter,
} from "../middleware/rateLimiter.middleware.js";
import { protectCustomer } from "../middleware/customerAuth.middleware.js";

const router = express.Router();

// Customer Signup
router.post(
  "/signup",
  customerAuthLimiter,
  signupValidator,
  validate,
  signupCustomer
);

// Verify Email OTP
router.post(
  "/verify-otp",
  customerAuthLimiter,
  verifyOtpValidator,
  validate,
  verifyOTP
);

// Resend OTP (with 60s cooldown limiter)
router.post(
  "/resend-otp",
  otpResendLimiter,
  resendOtpValidator,
  validate,
  resendOTP
);

// Customer Login
router.post(
  "/login",
  customerAuthLimiter,
  customerLoginValidator,
  validate,
  loginCustomer
);

// Get Authenticated Customer Profile
router.get("/me", protectCustomer, getCurrentCustomer);

export default router;
