import express from "express";
import {
  createReservation,
  checkReservation,
  rescheduleReservation,
  cancelReservation,
  getReservations,
  getReservationById,
  confirmReservation,
  assignTable,
  createWalkIn,
  markCompleted,
  updateStatus,
  deleteReservation,
  getCustomerReservations,
} from "../controllers/reservation.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { protectCustomer } from "../middleware/customerAuth.middleware.js";
import { reservationLimiter } from "../middleware/rateLimiter.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createReservationValidator,
  lookupReservationValidator,
  rescheduleReservationValidator,
  assignTableValidator,
  walkInValidator,
} from "../validators/reservation.validator.js";

const router = express.Router();

/* -------------------------- PUBLIC / CUSTOMER ROUTES -------------------------- */

router.post("/", reservationLimiter, protectCustomer, createReservationValidator, validate, createReservation);
router.get("/customer/my-reservations", protectCustomer, getCustomerReservations);
router.post("/:bookingId/check", reservationLimiter, lookupReservationValidator, validate, checkReservation);
router.put("/:bookingId/reschedule", reservationLimiter, rescheduleReservationValidator, validate, rescheduleReservation);
router.put("/:bookingId/cancel", reservationLimiter, lookupReservationValidator, validate, cancelReservation);

/* --------------------------- ADMIN ROUTES --------------------------- */

const adminRouter = express.Router();
adminRouter.use(protect);

adminRouter.get("/", getReservations);
adminRouter.get("/:id", getReservationById);
adminRouter.post("/walk-in", walkInValidator, validate, createWalkIn);
adminRouter.put("/:id/confirm", assignTableValidator, validate, confirmReservation);
adminRouter.put("/:id/assign-table", assignTableValidator, validate, assignTable);
adminRouter.put("/:id/complete", markCompleted);
adminRouter.put("/:id/status", updateStatus);
adminRouter.delete("/:id", deleteReservation);

router.use("/admin", adminRouter);

export default router;
