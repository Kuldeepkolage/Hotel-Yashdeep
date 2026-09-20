import { body } from "express-validator";

export const createTableValidator = [
  body("tableNumber").notEmpty().withMessage("Table number is required").isInt({ min: 1 }).withMessage("Table number must be a positive integer"),
  body("capacity").notEmpty().withMessage("Capacity is required").isInt({ min: 1 }).withMessage("Capacity must be a positive integer"),
  body("location").optional().isIn(["Indoor", "Outdoor", "Family", "VIP", "Bar", "Terrace", "Private"]).withMessage("Invalid location"),
  body("floor").optional().isString(),
  body("section").optional().isString(),
  body("status").optional().isIn(["Available", "Reserved", "Occupied", "Maintenance"]).withMessage("Invalid status"),
  body("tableName").optional({ checkFalsy: true }).isString(),
];

export const updateTableValidator = [
  body("tableNumber").optional().isInt({ min: 1 }).withMessage("Table number must be a positive integer"),
  body("capacity").optional().isInt({ min: 1 }).withMessage("Capacity must be a positive integer"),
  body("location").optional().isIn(["Indoor", "Outdoor", "Family", "VIP", "Bar", "Terrace", "Private"]).withMessage("Invalid location"),
  body("floor").optional().isString(),
  body("section").optional().isString(),
  body("status").optional().isIn(["Available", "Reserved", "Occupied", "Maintenance"]).withMessage("Invalid status"),
];
