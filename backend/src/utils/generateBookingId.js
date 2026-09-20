import Counter from "../models/Counter.js";
import Reservation from "../models/Reservation.js";

/**
 * Atomically generates the next sequential booking ID, e.g. HY1001, HY1002...
 * Uses MongoDB's atomic $inc on a dedicated counter document, and ensures
 * the generated ID is strictly greater than any existing reservation bookingId.
 */
const generateBookingId = async () => {
  let counter = await Counter.findOneAndUpdate(
    { key: "bookingId" },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true }
  );

  let nextId = `HY${1000 + counter.seq}`;

  // Check if this bookingId already exists in reservations
  const existing = await Reservation.findOne({ bookingId: nextId });
  if (existing) {
    const allRes = await Reservation.find({ bookingId: /^HY\d+$/ }).select("bookingId");
    let maxNum = 1000;
    for (const r of allRes) {
      const num = parseInt(r.bookingId.replace("HY", ""), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }

    const newSeq = maxNum - 1000 + 1;
    counter = await Counter.findOneAndUpdate(
      { key: "bookingId" },
      { $set: { seq: newSeq } },
      { returnDocument: "after", upsert: true }
    );
    nextId = `HY${1000 + counter.seq}`;
  }

  return nextId;
};

export default generateBookingId;
