import WebsiteContent from "../models/WebsiteContent.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getContent = asyncHandler(async (req, res) => {
  let content = await WebsiteContent.findOne();

  if (!content) {
    content = await WebsiteContent.create({});
  }

  res.status(200).json({
    success: true,
    data: content,
  });
});

export const updateContent = asyncHandler(async (req, res) => {
  let content = await WebsiteContent.findOne();

  if (!content) {
    content = await WebsiteContent.create(req.body);
  } else {
    Object.assign(content, req.body);
    await content.save();
  }

  res.status(200).json({
    success: true,
    message: "Website updated successfully",
    data: content,
  });
});