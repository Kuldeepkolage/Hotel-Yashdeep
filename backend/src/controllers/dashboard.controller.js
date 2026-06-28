import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    totalReservations,
    pending,
    confirmed,
    completed,
    cancelled,
    rescheduled,
    walkInsToday,
    todaysReservations,
    upcomingReservations,
    availableTables,
    occupiedTables,
    reservedTables,
    latestReservations,
  ] = await Promise.all([
    Reservation.countDocuments(),
    Reservation.countDocuments({ status: "Pending" }),
    Reservation.countDocuments({ status: "Confirmed" }),
    Reservation.countDocuments({ status: "Completed" }),
    Reservation.countDocuments({ status: "Cancelled" }),
    Reservation.countDocuments({ status: "Rescheduled" }),
    Reservation.countDocuments({
      isWalkIn: true,
      reservationDate: { $gte: todayStart, $lte: todayEnd },
    }),
    Reservation.find({
      reservationDate: { $gte: todayStart, $lte: todayEnd },
    })
      .populate("table", "tableNumber tableName")
      .sort({ reservationTime: 1 }),
    Reservation.find({
      reservationDate: { $gt: todayEnd },
      status: { $in: ["Pending", "Confirmed", "Rescheduled"] },
    })
      .populate("table", "tableNumber tableName")
      .sort({ reservationDate: 1, reservationTime: 1 })
      .limit(20),
    Table.countDocuments({ status: "Available" }),
    Table.countDocuments({ status: "Occupied" }),
    Table.countDocuments({ status: "Reserved" }),
    Reservation.find()
      .populate("table", "tableNumber tableName")
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  const stats = {
    totalReservations,
    pending,
    confirmed,
    completed,
    cancelled,
    rescheduled,
    walkInsToday,
    todaysReservations,
    upcomingReservations,
    tables: {
      available: availableTables,
      occupied: occupiedTables,
      reserved: reservedTables,
    },
    latestReservations,
  };

  return res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched"));
});
