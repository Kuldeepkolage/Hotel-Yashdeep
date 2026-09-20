import crypto from "crypto";
import bcrypt from "bcrypt";
import Customer from "../models/Customer.js";
import CustomerOTP from "../models/CustomerOTP.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendOTPEmail, isEmailServiceConfigured } from "../services/email.service.js";

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds

/* ------------------------------------------------------------------ */
/* CUSTOMER SIGNUP                                                    */
/* ------------------------------------------------------------------ */
export const signupCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  let customer = await Customer.findOne({ email: normalizedEmail });

  if (customer && customer.isEmailVerified) {
    throw new ApiError(409, "An account with this email already exists. Please log in.");
  }

  if (customer && !customer.isEmailVerified) {
    // Unverified account exists: update name, phone, and password
    customer.name = name.trim();
    customer.phone = phone.trim();
    customer.password = password;
    await customer.save();
  } else {
    // Create new customer account
    customer = await Customer.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password,
      isEmailVerified: false,
    });
  }

  // Generate 6-digit numeric OTP
  const rawOtp = crypto.randomInt(100000, 1000000).toString();
  const hashedOTP = await bcrypt.hash(rawOtp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Invalidate any existing OTPs
  await CustomerOTP.deleteMany({ customer: customer._id });

  // Store hashed OTP
  await CustomerOTP.create({
    customer: customer._id,
    email: normalizedEmail,
    hashedOTP,
    expiresAt,
    attempts: 0,
    lastResentAt: new Date(),
  });

  // Dispatch OTP email
  await sendOTPEmail({
    to: normalizedEmail,
    name: customer.name,
    otp: rawOtp,
  });

  const devInfo = (!isEmailServiceConfigured() && process.env.NODE_ENV !== "production")
    ? { devOtp: rawOtp }
    : {};

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        email: customer.email,
        isEmailVerified: false,
        ...devInfo,
      },
      "Signup successful. A 6-digit verification code has been sent to your email."
    )
  );
});

/* ------------------------------------------------------------------ */
/* VERIFY EMAIL OTP                                                   */
/* ------------------------------------------------------------------ */
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const customer = await Customer.findOne({ email: normalizedEmail });
  if (!customer) {
    throw new ApiError(404, "Customer account not found.");
  }

  if (customer.isEmailVerified) {
    throw new ApiError(400, "Email is already verified. Please log in.");
  }

  const otpRecord = await CustomerOTP.findOne({ customer: customer._id }).sort({ createdAt: -1 });

  if (!otpRecord || new Date() > otpRecord.expiresAt) {
    if (otpRecord) {
      await CustomerOTP.deleteOne({ _id: otpRecord._id });
    }
    throw new ApiError(400, "Verification code has expired. Please request a new one.");
  }

  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    await CustomerOTP.deleteOne({ _id: otpRecord._id });
    throw new ApiError(400, "Maximum verification attempts exceeded. Please request a new code.");
  }

  // Increment attempt count
  otpRecord.attempts += 1;
  await otpRecord.save();

  // Compare hashed OTP
  const isMatch = await bcrypt.compare(otp.trim(), otpRecord.hashedOTP);
  if (!isMatch) {
    const remainingAttempts = MAX_OTP_ATTEMPTS - otpRecord.attempts;
    throw new ApiError(
      400,
      `Invalid verification code. ${remainingAttempts > 0 ? `${remainingAttempts} attempt(s) remaining.` : "Please request a new code."}`
    );
  }

  // Mark customer verified and purge OTP records
  customer.isEmailVerified = true;
  await customer.save();
  await CustomerOTP.deleteMany({ customer: customer._id });

  // Issue customer JWT
  const token = customer.generateToken();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          isEmailVerified: true,
        },
      },
      "Email verified successfully. Welcome to Hotel Yashdeep!"
    )
  );
});

/* ------------------------------------------------------------------ */
/* RESEND OTP                                                         */
/* ------------------------------------------------------------------ */
export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const customer = await Customer.findOne({ email: normalizedEmail });
  if (!customer) {
    throw new ApiError(404, "Customer account not found.");
  }

  if (customer.isEmailVerified) {
    throw new ApiError(400, "Email is already verified. Please log in.");
  }

  // Check 60s cooldown
  const lastOtp = await CustomerOTP.findOne({ customer: customer._id }).sort({ createdAt: -1 });
  if (lastOtp) {
    const elapsed = Date.now() - new Date(lastOtp.lastResentAt).getTime();
    if (elapsed < RESEND_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
      throw new ApiError(429, `Please wait ${waitSeconds} seconds before requesting a new code.`);
    }
  }

  // Generate new OTP
  const rawOtp = crypto.randomInt(100000, 1000000).toString();
  const hashedOTP = await bcrypt.hash(rawOtp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Invalidate previous OTPs
  await CustomerOTP.deleteMany({ customer: customer._id });

  await CustomerOTP.create({
    customer: customer._id,
    email: normalizedEmail,
    hashedOTP,
    expiresAt,
    attempts: 0,
    lastResentAt: new Date(),
  });

  await sendOTPEmail({
    to: normalizedEmail,
    name: customer.name,
    otp: rawOtp,
  });

  const devInfo = (!isEmailServiceConfigured() && process.env.NODE_ENV !== "production")
    ? { devOtp: rawOtp }
    : {};

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        email: normalizedEmail,
        ...devInfo,
      },
      "A new verification code has been sent to your email."
    )
  );
});

/* ------------------------------------------------------------------ */
/* CUSTOMER LOGIN                                                     */
/* ------------------------------------------------------------------ */
export const loginCustomer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const customer = await Customer.findOne({ email: normalizedEmail });
  if (!customer) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await customer.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!customer.isEmailVerified) {
    throw new ApiError(403, "Please verify your email address before logging in.");
  }

  const token = customer.generateToken();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          isEmailVerified: true,
        },
      },
      "Login successful."
    )
  );
});

/* ------------------------------------------------------------------ */
/* GET CURRENT CUSTOMER PROFILE (/me)                                 */
/* ------------------------------------------------------------------ */
export const getCurrentCustomer = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        customer: {
          id: req.customer._id,
          name: req.customer.name,
          email: req.customer.email,
          phone: req.customer.phone,
          isEmailVerified: req.customer.isEmailVerified,
          createdAt: req.customer.createdAt,
        },
      },
      "Customer profile retrieved."
    )
  );
});
