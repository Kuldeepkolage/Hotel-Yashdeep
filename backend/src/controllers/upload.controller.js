import cloudinary from "../config/cloudinary.js";
import WebsiteContent from "../models/WebsiteContent.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Extracts the Cloudinary public_id from a stored secure_url so we can delete it later
const extractPublicId = (url) => {
  try {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    const publicIdWithExt = fileName.split(".")[0];
    return `${folder}/${publicIdWithExt}`;
  } catch {
    return null;
  }
};

/* ------------------------------------------------------------------ */
/* GENERIC SINGLE UPLOAD                                              */
/* ------------------------------------------------------------------ */

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image uploaded");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        url: req.file.path,
        publicId: req.file.filename,
      },
      "Image uploaded successfully"
    )
  );
});

/* ------------------------------------------------------------------ */
/* GENERIC MULTIPLE UPLOAD                                            */
/* ------------------------------------------------------------------ */

export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No images uploaded");
  }

  const images = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  return res.status(200).json(new ApiResponse(200, images, "Images uploaded successfully"));
});

/* ------------------------------------------------------------------ */
/* HERO UPLOAD - stores URL on WebsiteContent.heroImage               */
/* ------------------------------------------------------------------ */

export const uploadHeroImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image uploaded");
  }

  let content = await WebsiteContent.findOne();
  if (!content) {
    content = await WebsiteContent.create({});
  }

  content.heroImage = req.file.path;
  await content.save();

  return res.status(200).json(new ApiResponse(200, content, "Hero image updated successfully"));
});

/* ------------------------------------------------------------------ */
/* GALLERY UPLOAD - appends to WebsiteContent.galleryImages           */
/* ------------------------------------------------------------------ */

export const uploadGalleryImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No images uploaded");
  }

  let content = await WebsiteContent.findOne();
  if (!content) {
    content = await WebsiteContent.create({});
  }

  const newImages = req.files.map((file) => ({ image: file.path }));
  content.galleryImages.push(...newImages);
  await content.save();

  return res.status(200).json(new ApiResponse(200, content, "Gallery images uploaded successfully"));
});

/* ------------------------------------------------------------------ */
/* MENU IMAGE UPLOAD - appends to WebsiteContent.menuImages           */
/* (separate from the Menu collection's per-item `image` field)       */
/* ------------------------------------------------------------------ */

export const uploadMenuImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No images uploaded");
  }

  let content = await WebsiteContent.findOne();
  if (!content) {
    content = await WebsiteContent.create({});
  }

  const newImages = req.files.map((file) => ({ image: file.path }));
  content.menuImages.push(...newImages);
  await content.save();

  return res.status(200).json(new ApiResponse(200, content, "Menu images uploaded successfully"));
});

/* ------------------------------------------------------------------ */
/* DELETE IMAGE - removes from Cloudinary, and from CMS array if      */
/* a matching URL exists in galleryImages / menuImages / heroImage    */
/* ------------------------------------------------------------------ */

export const deleteImage = asyncHandler(async (req, res) => {
  const { url, publicId } = req.body;

  if (!url && !publicId) {
    throw new ApiError(400, "Provide either the image url or its Cloudinary publicId");
  }

  const idToDelete = publicId || extractPublicId(url);

  if (!idToDelete) {
    throw new ApiError(400, "Could not resolve Cloudinary public ID for this image");
  }

  await cloudinary.uploader.destroy(idToDelete);

  if (url) {
    const content = await WebsiteContent.findOne();
    if (content) {
      content.galleryImages = content.galleryImages.filter((img) => img.image !== url);
      content.menuImages = content.menuImages.filter((img) => img.image !== url);
      if (content.heroImage === url) content.heroImage = "";
      await content.save();
    }
  }

  return res.status(200).json(new ApiResponse(200, null, "Image deleted successfully"));
});
