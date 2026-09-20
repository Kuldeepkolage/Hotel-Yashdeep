import Admin from "../models/Admin.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Return only safe admin fields.
 *
 * Never send the password hash to the frontend.
 */
const sanitizeAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

/**
 * Get currently logged-in admin.
 *
 * GET /api/admin/me
 */
export const getCurrentAdmin = asyncHandler(
  async (req, res) => {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      throw new ApiError(
        404,
        "Admin account not found."
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        sanitizeAdmin(admin),
        "Current admin fetched"
      )
    );
  }
);

/**
 * Get admin profile.
 *
 * GET /api/admin/profile
 */
export const getAdminProfile = asyncHandler(
  async (req, res) => {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      throw new ApiError(
        404,
        "Admin account not found."
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        sanitizeAdmin(admin),
        "Admin profile fetched"
      )
    );
  }
);

/**
 * Update admin profile.
 *
 * PUT /api/admin/profile
 *
 * Allowed fields:
 * - name
 * - email
 */
export const updateAdminProfile =
  asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    const admin = await Admin.findById(
      req.admin._id
    );

    if (!admin) {
      throw new ApiError(
        404,
        "Admin account not found."
      );
    }

    // -----------------------------
    // Validate name
    // -----------------------------

    if (name !== undefined) {
      const trimmedName =
        String(name).trim();

      if (!trimmedName) {
        throw new ApiError(
          400,
          "Name cannot be empty."
        );
      }

      if (trimmedName.length < 2) {
        throw new ApiError(
          400,
          "Name must be at least 2 characters."
        );
      }

      admin.name = trimmedName;
    }

    // -----------------------------
    // Validate email
    // -----------------------------

    if (email !== undefined) {
      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();

      if (!normalizedEmail) {
        throw new ApiError(
          400,
          "Email cannot be empty."
        );
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(normalizedEmail)) {
        throw new ApiError(
          400,
          "Please provide a valid email address."
        );
      }

      // Check if another admin already
      // uses this email.
      const existingAdmin =
        await Admin.findOne({
          email: normalizedEmail,
          _id: { $ne: admin._id },
        });

      if (existingAdmin) {
        throw new ApiError(
          409,
          "This email address is already in use."
        );
      }

      admin.email = normalizedEmail;
    }

    await admin.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        sanitizeAdmin(admin),
        "Profile updated successfully"
      )
    );
  });

/**
 * Change admin password.
 *
 * PUT /api/admin/change-password
 *
 * Body:
 * {
 *   currentPassword,
 *   newPassword
 * }
 */
export const changeAdminPassword =
  asyncHandler(async (req, res) => {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    // -----------------------------
    // Validate request
    // -----------------------------

    if (!currentPassword) {
      throw new ApiError(
        400,
        "Current password is required."
      );
    }

    if (!newPassword) {
      throw new ApiError(
        400,
        "New password is required."
      );
    }

    if (newPassword.length < 6) {
      throw new ApiError(
        400,
        "New password must be at least 6 characters."
      );
    }

    // -----------------------------
    // Get admin
    // -----------------------------

    const admin = await Admin.findById(
      req.admin._id
    );

    if (!admin) {
      throw new ApiError(
        404,
        "Admin account not found."
      );
    }

    // -----------------------------
    // Verify current password
    // -----------------------------

    const isCurrentPasswordCorrect =
      await admin.comparePassword(
        currentPassword
      );

    if (!isCurrentPasswordCorrect) {
      throw new ApiError(
        400,
        "Current password is incorrect."
      );
    }

    // -----------------------------
    // Prevent same password
    // -----------------------------

    const isSamePassword =
      await admin.comparePassword(
        newPassword
      );

    if (isSamePassword) {
      throw new ApiError(
        400,
        "New password must be different from the current password."
      );
    }

    // -----------------------------
    // Save new password
    // -----------------------------
    //
    // Admin model's pre-save hook
    // automatically hashes this password.
    //

    admin.password = newPassword;

    await admin.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Password changed successfully"
      )
    );
  });

/**
 * Logout.
 *
 * JWTs are stateless, so the actual token
 * is cleared by the frontend.
 *
 * POST /api/admin/logout
 */
export const logoutAdmin = asyncHandler(
  async (req, res) => {
    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Logged out successfully"
      )
    );
  }
);