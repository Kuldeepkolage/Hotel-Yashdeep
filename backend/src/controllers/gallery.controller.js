import WebsiteContent from "../models/WebsiteContent.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import cloudinary from "../config/cloudinary.js";

const getContent = async () => {
  let content = await WebsiteContent.findOne();
  if (!content) content = await WebsiteContent.create({});
  return content;
};

export const getGalleryImages = asyncHandler(async (req, res) => {
  const content = await getContent();
  let images = content.galleryImages.map((img) => ({
    id: img._id,
    _id: img._id,
    url: img.url || img.image,
    image: img.image || img.url,
    publicId: img.publicId || "",
    filename: img.filename || "",
    category: img.category || "general",
    alt: img.alt || "",
    createdAt: img.createdAt,
  }));

  const category = req.query.category;
  const search = String(req.query.search || "").trim().toLowerCase();
  if (category) images = images.filter((img) => img.category === category);
  if (search) images = images.filter((img) =>
    `${img.filename} ${img.alt} ${img.category}`.toLowerCase().includes(search)
  );

  images.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const total = images.length;

  return res.status(200).json(new ApiResponse(200, {
    images: images.slice((page - 1) * limit, page * limit),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }, "Gallery fetched"));
});

export const getGalleryCategories = asyncHandler(async (req, res) => {
  const content = await getContent();
  const categories = [...new Set(content.galleryImages.map((img) => img.category || "general"))].sort();
  return res.status(200).json(new ApiResponse(200, categories, "Gallery categories fetched"));
});

export const uploadGallery = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new ApiError(400, "No images uploaded");
  const content = await getContent();
  const category = req.body.category || "general";

  const added = req.files.map((file) => ({
    image: file.path,
    url: file.path,
    publicId: file.filename,
    filename: file.originalname || file.filename,
    category,
    alt: file.originalname || "",
  }));

  content.galleryImages.push(...added);
  await content.save();

  return res.status(201).json(new ApiResponse(201, added.map((img, i) => ({
    ...img,
    id: content.galleryImages[content.galleryImages.length - added.length + i]._id,
  })), "Gallery images uploaded successfully"));
});

export const deleteGalleryImage = asyncHandler(async (req, res) => {
  const content = await getContent();
  const image = content.galleryImages.id(req.params.id);
  if (!image) throw new ApiError(404, "Gallery image not found");

  if (image.publicId) {
    try { await cloudinary.uploader.destroy(image.publicId); } catch (_) {}
  }

  image.deleteOne();
  await content.save();

  return res.status(200).json(new ApiResponse(200, null, "Gallery image deleted"));
});

export const updateGalleryImage = asyncHandler(async (req, res) => {
  const content = await getContent();
  const image = content.galleryImages.id(req.params.id);
  if (!image) throw new ApiError(404, "Gallery image not found");

  if (req.body.category !== undefined) image.category = req.body.category;
  if (req.body.alt !== undefined) image.alt = req.body.alt;
  if (req.body.filename !== undefined) image.filename = req.body.filename;
  await content.save();

  return res.status(200).json(new ApiResponse(200, image, "Gallery image updated"));
});
