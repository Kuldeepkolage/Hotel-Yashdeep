import Table from "../models/Table.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { findAvailableTables } from "../services/availability.service.js";

export const createTable = asyncHandler(async (req, res) => {
  const existing = await Table.findOne({ tableNumber: req.body.tableNumber });

  if (existing) {
    throw new ApiError(409, `Table number ${req.body.tableNumber} already exists`);
  }

  const table = await Table.create(req.body);

  return res.status(201).json(new ApiResponse(201, table, "Table created successfully"));
});

export const getTables = asyncHandler(async (req, res) => {
  const { location, status } = req.query;

  const filter = {};
  if (location) filter.location = location;
  if (status) filter.status = status;

  const tables = await Table.find(filter).sort({ tableNumber: 1 });

  return res.status(200).json(new ApiResponse(200, tables, "Tables fetched successfully"));
});

export const getTable = asyncHandler(async (req, res) => {
  const table = await Table.findById(req.params.id);

  if (!table) {
    throw new ApiError(404, "Table not found");
  }

  return res.status(200).json(new ApiResponse(200, table, "Table fetched"));
});

// Returns tables that can seat `guests` and are free at `reservationDate` + `reservationTime`.
// Used by the admin panel when confirming a reservation or creating a walk-in.
export const getAvailableTables = asyncHandler(async (req, res) => {
  const { reservationDate, reservationTime, guests } = req.query;

  const tables = await findAvailableTables({
    reservationDate,
    reservationTime,
    guests: guests ? Number(guests) : undefined,
  });

  return res.status(200).json(new ApiResponse(200, tables, "Available tables fetched"));
});

export const updateTable = asyncHandler(async (req, res) => {
  const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!table) {
    throw new ApiError(404, "Table not found");
  }

  return res.status(200).json(new ApiResponse(200, table, "Table updated"));
});

export const deleteTable = asyncHandler(async (req, res) => {
  const table = await Table.findByIdAndDelete(req.params.id);

  if (!table) {
    throw new ApiError(404, "Table not found");
  }

  return res.status(200).json(new ApiResponse(200, null, "Table deleted"));
});
