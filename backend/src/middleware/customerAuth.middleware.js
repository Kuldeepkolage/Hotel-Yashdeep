import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protectCustomer = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized as customer. Please log in.");
  }

  const secret = process.env.CUSTOMER_JWT_SECRET || process.env.JWT_SECRET;
  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired customer token. Please log in again.");
  }

  // Token role isolation: must be a customer token
  if (!decoded || decoded.role !== "customer") {
    throw new ApiError(401, "Invalid token type for customer access.");
  }

  const customer = await Customer.findById(decoded.id).select("-password");

  if (!customer) {
    throw new ApiError(401, "Customer account no longer exists.");
  }

  if (!customer.isEmailVerified) {
    throw new ApiError(403, "Please verify your email address before continuing.");
  }

  req.customer = customer;
  next();
});
