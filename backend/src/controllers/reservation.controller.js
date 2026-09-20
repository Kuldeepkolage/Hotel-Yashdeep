import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";
import generateBookingId from "../utils/generateBookingId.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { assertTableAssignable, findAvailableTables } from "../services/availability.service.js";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const setTableStatus = async (tableId, status) => {
  if (!tableId) return;
  await Table.findByIdAndUpdate(tableId, { status });
};

/* ------------------------------------------------------------------ */
/* PUBLIC: CREATE RESERVATION                                         */
/* Automatically assigns an available table matching party size.      */
/* ------------------------------------------------------------------ */

export const createReservation = asyncHandler(async (req, res) => {
  const customer = req.customer;
  if (!customer || !customer._id) {
    throw new ApiError(401, "Customer authentication required. Please log in.");
  }

  const { reservationDate, reservationTime, guests, specialRequest } = req.body;

  const bookingId = await generateBookingId();

  // Find an available table for this date, time and guest count
  let assignedTable = null;
  try {
    const availableTables = await findAvailableTables({
      reservationDate,
      reservationTime,
      guests: Number(guests),
    });

    if (availableTables && availableTables.length > 0) {
      assignedTable = availableTables[0];
    }
  } catch (err) {
    console.warn("Table auto-assignment notice:", err.message);
  }

  const reservation = await Reservation.create({
    bookingId,
    customer: customer._id,
    customerName: customer.name,
    phone: customer.phone,
    email: customer.email,
    reservationDate,
    reservationTime,
    guests,
    specialRequest: specialRequest || "",
    table: assignedTable ? assignedTable._id : null,
    status: assignedTable ? "Confirmed" : "Pending",
  });

  if (assignedTable) {
    await setTableStatus(assignedTable._id, "Reserved");
    await reservation.populate("table", "tableNumber tableName capacity location");
  }

  const message = assignedTable
    ? `Reservation confirmed! Table ${assignedTable.tableNumber} (${assignedTable.location || "Indoor"}) has been reserved.`
    : "Reservation created successfully. Awaiting confirmation.";

  return res.status(201).json(new ApiResponse(201, reservation, message));
});

/* ------------------------------------------------------------------ */
/* PUBLIC: CHECK RESERVATION (Booking ID + Phone)                     */
/* ------------------------------------------------------------------ */

export const checkReservation = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { phone } = req.body;

  const reservation = await Reservation.findOne({ bookingId, phone }).populate("table", "tableNumber tableName capacity location");

  if (!reservation) {
    throw new ApiError(404, "No reservation found for that Booking ID and phone number");
  }

  return res.status(200).json(new ApiResponse(200, reservation, "Reservation found"));
});

/* ------------------------------------------------------------------ */
/* PUBLIC: RESCHEDULE RESERVATION (Booking ID + Phone)                */
/* ------------------------------------------------------------------ */

export const rescheduleReservation = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { phone, reservationDate, reservationTime } = req.body;

  const reservation = await Reservation.findOne({ bookingId, phone });

  if (!reservation) {
    throw new ApiError(404, "No reservation found for that Booking ID and phone number");
  }

  if (["Completed", "Cancelled"].includes(reservation.status)) {
    throw new ApiError(400, `Reservation is already ${reservation.status} and cannot be rescheduled`);
  }

  // If a table was already assigned, make sure it's free at the new slot
  if (reservation.table) {
    await assertTableAssignable({
      tableId: reservation.table,
      reservationDate,
      reservationTime,
      guests: reservation.guests,
      excludeReservationId: reservation._id,
    });
  }

  reservation.previousReservations.push({
    reservationDate: reservation.reservationDate,
    reservationTime: reservation.reservationTime,
  });

  reservation.reservationDate = reservationDate;
  reservation.reservationTime = reservationTime;
  reservation.status = "Rescheduled";
  reservation.rescheduleCount += 1;

  await reservation.save();

  return res.status(200).json(new ApiResponse(200, reservation, "Reservation rescheduled successfully"));
});

/* ------------------------------------------------------------------ */
/* PUBLIC: CANCEL RESERVATION (Booking ID + Phone)                    */
/* ------------------------------------------------------------------ */

export const cancelReservation = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { phone } = req.body;

  const reservation = await Reservation.findOne({ bookingId, phone });

  if (!reservation) {
    throw new ApiError(404, "No reservation found for that Booking ID and phone number");
  }

  if (reservation.status === "Cancelled") {
    throw new ApiError(400, "Reservation is already cancelled");
  }

  if (reservation.status === "Completed") {
    throw new ApiError(400, "Completed reservations cannot be cancelled");
  }

  if (reservation.table) {
    await setTableStatus(reservation.table, "Available");
  }

  reservation.status = "Cancelled";
  reservation.table = null;
  await reservation.save();

  return res.status(200).json(new ApiResponse(200, reservation, "Reservation cancelled successfully"));
});

/* ------------------------------------------------------------------ */
/* ADMIN: GET ALL (with filters)                                      */
/* ------------------------------------------------------------------ */

export const getReservations = asyncHandler(async (req, res) => {
  const { status, date, isWalkIn } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (isWalkIn !== undefined) filter.isWalkIn = isWalkIn === "true";

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.reservationDate = { $gte: start, $lte: end };
  }

  const reservations = await Reservation.find(filter)
    .populate("table", "tableNumber tableName capacity location")
    .populate("customer", "name email phone isEmailVerified")
    .sort({ reservationDate: 1, reservationTime: 1 });

  return res.status(200).json(new ApiResponse(200, reservations, "Reservations fetched"));
});

/* ------------------------------------------------------------------ */
/* ADMIN: GET SINGLE BY MONGO ID                                      */
/* ------------------------------------------------------------------ */

export const getReservationById = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id)
    .populate("table", "tableNumber tableName capacity location")
    .populate("customer", "name email phone isEmailVerified");

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  return res.status(200).json(new ApiResponse(200, reservation, "Reservation fetched"));
});

/* ------------------------------------------------------------------ */
/* ADMIN: CONFIRM RESERVATION + ASSIGN TABLE                          */
/* ------------------------------------------------------------------ */

export const confirmReservation = asyncHandler(async (req, res) => {
  const { tableId } = req.body;

  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  if (["Completed", "Cancelled"].includes(reservation.status)) {
    throw new ApiError(400, `Reservation is already ${reservation.status}`);
  }

  await assertTableAssignable({
    tableId,
    reservationDate: reservation.reservationDate,
    reservationTime: reservation.reservationTime,
    guests: reservation.guests,
    excludeReservationId: reservation._id,
  });

  reservation.table = tableId;
  reservation.status = "Confirmed";
  await reservation.save();

  await setTableStatus(tableId, "Reserved");

  await reservation.populate("table", "tableNumber tableName capacity location");

  return res.status(200).json(new ApiResponse(200, reservation, "Reservation confirmed and table assigned"));
});

/* ------------------------------------------------------------------ */
/* ADMIN: REASSIGN TABLE (e.g. customer moved tables on arrival)      */
/* ------------------------------------------------------------------ */

export const assignTable = asyncHandler(async (req, res) => {
  const { tableId } = req.body;

  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  await assertTableAssignable({
    tableId,
    reservationDate: reservation.reservationDate,
    reservationTime: reservation.reservationTime,
    guests: reservation.guests,
    excludeReservationId: reservation._id,
  });

  const previousTable = reservation.table;

  reservation.table = tableId;
  await reservation.save();

  if (previousTable && String(previousTable) !== String(tableId)) {
    await setTableStatus(previousTable, "Available");
  }
  await setTableStatus(tableId, reservation.isWalkIn ? "Occupied" : "Reserved");

  await reservation.populate("table", "tableNumber tableName capacity location");

  return res.status(200).json(new ApiResponse(200, reservation, "Table reassigned successfully"));
});

/* ------------------------------------------------------------------ */
/* ADMIN: CREATE WALK-IN (table assigned immediately)                 */
/* ------------------------------------------------------------------ */

export const createWalkIn = asyncHandler(async (req, res) => {
  const { customerName, phone, email, guests, specialRequest, tableId } = req.body;

  const now = new Date();
  const reservationTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  await assertTableAssignable({
    tableId,
    reservationDate: now,
    reservationTime,
    guests,
    allowOvercapacity: true,
  });

  const bookingId = await generateBookingId();

  const reservation = await Reservation.create({
    bookingId,
    customerName,
    phone,
    email,
    reservationDate: now,
    reservationTime,
    guests,
    specialRequest,
    table: tableId,
    status: "Walk-In",
    isWalkIn: true,
  });

  await setTableStatus(tableId, "Occupied");

  await reservation.populate("table", "tableNumber tableName capacity location");

  return res.status(201).json(new ApiResponse(201, reservation, "Walk-in reservation created and table assigned"));
});

/* ------------------------------------------------------------------ */
/* ADMIN: MARK COMPLETED (frees the table)                            */
/* ------------------------------------------------------------------ */

export const markCompleted = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  if (reservation.status === "Cancelled") {
    throw new ApiError(400, "Cancelled reservations cannot be marked completed");
  }

  if (reservation.table) {
    await setTableStatus(reservation.table, "Available");
  }

  reservation.status = "Completed";
  await reservation.save();

  return res.status(200).json(new ApiResponse(200, reservation, "Reservation marked as completed"));
});

/* ------------------------------------------------------------------ */
/* ADMIN: GENERIC STATUS UPDATE                                       */
/* ------------------------------------------------------------------ */

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["Pending", "Confirmed", "Rescheduled", "Completed", "Cancelled", "Walk-In"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  if (["Completed", "Cancelled"].includes(status) && reservation.table) {
    await setTableStatus(reservation.table, "Available");
  }

  reservation.status = status;
  await reservation.save();

  return res.status(200).json(new ApiResponse(200, reservation, "Status updated"));
});

/* ------------------------------------------------------------------ */
/* ADMIN: DELETE                                                      */
/* ------------------------------------------------------------------ */

export const deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  if (reservation.table) {
    await setTableStatus(reservation.table, "Available");
  }

  await reservation.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "Reservation deleted"));
});

/* ------------------------------------------------------------------ */
/* CUSTOMER: GET MY RESERVATIONS                                      */
/* ------------------------------------------------------------------ */

export const getCustomerReservations = asyncHandler(async (req, res) => {
  const customerId = req.customer._id;
  const reservations = await Reservation.find({ customer: customerId })
    .populate("table", "tableNumber capacity floor")
    .sort({ reservationDate: -1, reservationTime: -1 });

  return res.status(200).json(
    new ApiResponse(200, reservations, "Customer reservations retrieved successfully.")
  );
});

