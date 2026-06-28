import Counter from "../models/Counter.js";

/**
 * Atomically generates the next sequential booking ID, e.g. HY1001, HY1002...
 * Uses MongoDB's atomic $inc on a dedicated counter document so concurrent
 * reservation requests can never collide on the same bookingId.
 */
const generateBookingId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { key: "bookingId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  // Offset by 1000 so the first generated ID is HY1001 (Mongo's $inc on a
  // missing field during upsert starts the value at the increment amount
  // itself, i.e. 1 on first call - not the schema's `default`).
  return `HY${1000 + counter.seq}`;
};

export default generateBookingId;
