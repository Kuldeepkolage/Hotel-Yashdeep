import asyncHandler from "../utils/asyncHandler.js";

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image uploaded",
    });
  }

  res.status(200).json({
    success: true,
    imageUrl: req.file.path,
  });
});