import Menu from "../models/Menu.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

// Create Menu Item
export const createMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.create(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, menu, "Menu item created successfully"));
});

// Get All Menu
export const getMenus = asyncHandler(async (req, res) => {
  const menus = await Menu.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, menus, "Menu fetched successfully"));
});

// Get Single Menu
export const getMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.findById(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, menu, "Menu fetched"));
});

// Update Menu
export const updateMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, menu, "Menu updated"));
});

// Delete Menu
export const deleteMenu = asyncHandler(async (req, res) => {
  await Menu.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Menu deleted"));
});