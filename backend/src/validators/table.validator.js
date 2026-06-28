import { body } from "express-validator";

export const createTableValidator = [
  body("tableNumber").notEmpty().withMessage("Table number is required").isInt({ min: 1 }).withMessage("Table number must be a positive integer"),
  body("capacity").notEmpty().withMessage("Capacity is required").isInt({ min: 1 }).withMessage("Capacity must be a positive integer"),
  body("location").optional().isIn(["Indoor", "Outdoor", "Family", "VIP"]).withMessage("Invalid location"),
  body("status").optional().isIn(["Available", "Reserved", "Occupied"]).withMessage("Invalid status"),
  body("tableName").optional({ checkFalsy: true }).isString(),
];

export const updateTableValidator = [
  body("tableNumber").optional().isInt({ min: 1 }).withMessage("Table number must be a positive integer"),
  body("capacity").optional().isInt({ min: 1 }).withMessage("Capacity must be a positive integer"),
  body("location").optional().isIn(["Indoor", "Outdoor", "Family", "VIP"]).withMessage("Invalid location"),
  body("status").optional().isIn(["Available", "Reserved", "Occupied"]).withMessage("Invalid status"),
];
