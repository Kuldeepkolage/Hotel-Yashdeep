import { body, param } from "express-validator";

export const createReservationValidator = [
  body("customerName").trim().notEmpty().withMessage("Customer name is required"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9+\-\s]{7,15}$/)
    .withMessage("Enter a valid phone number"),
  body("email").optional({ checkFalsy: true }).isEmail().withMessage("Invalid email address"),
  body("reservationDate").notEmpty().withMessage("Reservation date is required").isISO8601().withMessage("Invalid date format"),
  body("reservationTime").trim().notEmpty().withMessage("Reservation time is required"),
  body("guests").notEmpty().withMessage("Number of guests is required").isInt({ min: 1 }).withMessage("Guests must be at least 1"),
  body("specialRequest").optional({ checkFalsy: true }).isString(),
];

export const lookupReservationValidator = [
  param("bookingId").trim().notEmpty().withMessage("Booking ID is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required for verification"),
];

export const rescheduleReservationValidator = [
  param("bookingId").trim().notEmpty().withMessage("Booking ID is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required for verification"),
  body("reservationDate").notEmpty().withMessage("New reservation date is required").isISO8601().withMessage("Invalid date format"),
  body("reservationTime").trim().notEmpty().withMessage("New reservation time is required"),
];

export const assignTableValidator = [
  param("id").isMongoId().withMessage("Invalid reservation reference"),
  body("tableId").isMongoId().withMessage("Invalid table reference"),
];

export const walkInValidator = [
  body("customerName").trim().notEmpty().withMessage("Customer name is required"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9+\-\s]{7,15}$/)
    .withMessage("Enter a valid phone number"),
  body("guests").notEmpty().withMessage("Number of guests is required").isInt({ min: 1 }).withMessage("Guests must be at least 1"),
  body("tableId").isMongoId().withMessage("A table must be assigned for walk-ins"),
];
