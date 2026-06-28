import express from "express";

import {

createReservation,
getReservations,
getReservation,
rescheduleReservation,
cancelReservation,
updateStatus,
deleteReservation

} from "../controllers/reservation.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* Customer */

router.post("/", createReservation);

router.get("/:bookingId", getReservation);

router.put("/reschedule/:bookingId", rescheduleReservation);

router.put("/cancel/:bookingId", cancelReservation);

/* Admin */

router.get("/", protect, getReservations);

router.put("/status/:id", protect, updateStatus);

router.delete("/:id", protect, deleteReservation);

export default router;