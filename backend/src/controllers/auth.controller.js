import Admin from "../models/Admin.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

const admin = await Admin.findOne({ email });

console.log("📧 Email entered:", email);
console.log("👤 Admin found:", admin);

if (!admin) {
  throw new ApiError(401, "Invalid credentials.");
}

const isMatch = await admin.comparePassword(password);

console.log("🔑 Password entered:", password);
console.log("✅ Password Match:", isMatch);

if (!isMatch) {
  throw new ApiError(401, "Invalid credentials.");
}

  const token = admin.generateToken();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      "Login successful"
    )
  );
});