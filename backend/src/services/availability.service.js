import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";
import ApiError from "../utils/ApiError.js";

// Statuses that mean a table is actively "held" by a reservation
const ACTIVE_STATUSES = ["Confirmed", "Rescheduled", "Walk-In"];

/**
 * Normalizes a date to midnight so date-only comparisons ignore time-of-day.
 */
const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Checks whether a given table is already held by another active reservation
 * on the same date and time slot. Prevents double-booking the same table.
 */
export const isTableTaken = async ({ tableId, reservationDate, reservationTime, excludeReservationId = null }) => {
  const query = {
    table: tableId,
    reservationTime,
    reservationDate: {
      $gte: startOfDay(reservationDate),
      $lte: endOfDay(reservationDate),
    },
    status: { $in: ACTIVE_STATUSES },
  };

  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }

  const conflict = await Reservation.findOne(query);
  return Boolean(conflict);
};

/**
 * Assigns a table to a reservation after verifying:
 *  - the table exists and can seat the party
 *  - the table is not already held by another active reservation at that slot
 * Throws ApiError on any violation. Returns the updated reservation table status.
 */
export const assertTableAssignable = async ({ tableId, reservationDate, reservationTime, guests, excludeReservationId = null }) => {
  const table = await Table.findById(tableId);

  if (!table) {
    throw new ApiError(404, "Table not found");
  }

  if (guests && table.capacity < guests) {
    throw new ApiError(400, `Table ${table.tableNumber} can only seat ${table.capacity} guests`);
  }

  const taken = await isTableTaken({ tableId, reservationDate, reservationTime, excludeReservationId });

  if (taken) {
    throw new ApiError(409, `Table ${table.tableNumber} is already reserved for that date and time`);
  }

  return table;
};

/**
 * Returns tables that can seat the party and are not already held by another
 * active reservation at the requested date/time. Used by admin UI to pick a
 * suitable table when confirming a reservation or logging a walk-in.
 */
export const findAvailableTables = async ({ reservationDate, reservationTime, guests }) => {
  const allTables = await Table.find({
    status: { $ne: "Occupied" },
    ...(guests ? { capacity: { $gte: guests } } : {}),
  }).sort({ capacity: 1, tableNumber: 1 });

  if (!reservationDate || !reservationTime) {
    return allTables;
  }

  const busyReservations = await Reservation.find({
    reservationTime,
    reservationDate: {
      $gte: startOfDay(reservationDate),
      $lte: endOfDay(reservationDate),
    },
    status: { $in: ACTIVE_STATUSES },
    table: { $ne: null },
  }).select("table");

  const busyTableIds = new Set(busyReservations.map((r) => String(r.table)));

  return allTables.filter((t) => !busyTableIds.has(String(t._id)));
};

export default {
  isTableTaken,
  assertTableAssignable,
  findAvailableTables,
};
