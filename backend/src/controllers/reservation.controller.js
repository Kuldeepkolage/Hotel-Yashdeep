import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";
import generateBookingId from "../utils/generateBookingId.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/* ---------------------------------- */
/* CREATE RESERVATION */
/* ---------------------------------- */

export const createReservation = asyncHandler(async (req, res) => {

    const {
        customerName,
        phone,
        email,
        reservationDate,
        reservationTime,
        guests,
        specialRequest
    } = req.body;

    const table = await Table.findOne({
        capacity: { $gte: guests }
    }).sort({ capacity: 1 });

    if (!table) {
        throw new ApiError(400, "No suitable table available.");
    }

    const bookingId = await generateBookingId();

    const reservation = await Reservation.create({

        bookingId,

        customerName,

        phone,

        email,

        reservationDate,

        reservationTime,

        guests,

        specialRequest,

        table: table._id,

        status: "Pending"

    });

    res.status(201).json(
        new ApiResponse(
            201,
            reservation,
            "Reservation Created Successfully"
        )
    );

});

/* ---------------------------------- */
/* GET ALL */
/* ---------------------------------- */

export const getReservations = asyncHandler(async (req, res) => {

    const reservations = await Reservation.find()
        .populate("table")
        .sort({ reservationDate: 1 });

    res.json(
        new ApiResponse(
            200,
            reservations
        )
    );

});

/* ---------------------------------- */
/* GET SINGLE */
/* ---------------------------------- */

export const getReservation = asyncHandler(async (req, res) => {

    const reservation = await Reservation.findOne({
        bookingId: req.params.bookingId
    }).populate("table");

    if (!reservation) {

        throw new ApiError(404, "Reservation Not Found");

    }

    res.json(
        new ApiResponse(
            200,
            reservation
        )
    );

});

/* ---------------------------------- */
/* RESCHEDULE */
/* ---------------------------------- */

export const rescheduleReservation = asyncHandler(async (req, res) => {

    const {

        reservationDate,

        reservationTime

    } = req.body;

    const reservation = await Reservation.findOne({

        bookingId: req.params.bookingId

    });

    if (!reservation) {

        throw new ApiError(404, "Reservation Not Found");

    }

    reservation.previousReservations.push({

        reservationDate: reservation.reservationDate,

        reservationTime: reservation.reservationTime

    });

    reservation.reservationDate = reservationDate;

    reservation.reservationTime = reservationTime;

    reservation.status = "Rescheduled";

    reservation.rescheduleCount += 1;

    await reservation.save();

    res.json(

        new ApiResponse(

            200,

            reservation,

            "Reservation Rescheduled"

        )

    );

});

/* ---------------------------------- */
/* CANCEL */
/* ---------------------------------- */

export const cancelReservation = asyncHandler(async (req, res) => {

    const reservation = await Reservation.findOne({

        bookingId: req.params.bookingId

    });

    if (!reservation) {

        throw new ApiError(404, "Reservation Not Found");

    }

    reservation.status = "Cancelled";

    await reservation.save();

    res.json(

        new ApiResponse(

            200,

            reservation,

            "Reservation Cancelled"

        )

    );

});

/* ---------------------------------- */
/* UPDATE STATUS */
/* ---------------------------------- */

export const updateStatus = asyncHandler(async (req, res) => {

    const reservation = await Reservation.findById(req.params.id);

    reservation.status = req.body.status;

    await reservation.save();

    res.json(

        new ApiResponse(

            200,

            reservation,

            "Status Updated"

        )

    );

});

/* ---------------------------------- */
/* DELETE */
/* ---------------------------------- */

export const deleteReservation = asyncHandler(async (req, res) => {

    await Reservation.findByIdAndDelete(req.params.id);

    res.json(

        new ApiResponse(

            200,

            {},

            "Reservation Deleted"

        )

    );

});