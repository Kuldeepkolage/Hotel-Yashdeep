import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Current logged-in admin (requires `protect` middleware)
export const getCurrentAdmin = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.admin, "Current admin fetched"));
});

// Logout - JWTs are stateless, so logout is handled client-side by discarding
// the token. This endpoint exists for a consistent API contract with the frontend.
export const logoutAdmin = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});
