import WebsiteContent from "../models/WebsiteContent.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getContent = asyncHandler(async (req, res) => {
  let content = await WebsiteContent.findOne();

  if (!content) {
    content = await WebsiteContent.create({});
  }

  return res.status(200).json(new ApiResponse(200, content, "Website content fetched"));
});

export const updateContent = asyncHandler(async (req, res) => {
  let content = await WebsiteContent.findOne();

  // Never allow these to be overwritten via the generic content update endpoint
  const { _id, createdAt, updatedAt, ...updates } = req.body;

  if (!content) {
    content = await WebsiteContent.create(updates);
  } else {
    Object.assign(content, updates);
    await content.save();
  }

  return res.status(200).json(new ApiResponse(200, content, "Website content updated successfully"));
});
