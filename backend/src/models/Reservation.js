import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    reservationDate: {
      type: Date,
      required: true,
    },

    reservationTime: {
      type: String,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
    },

    specialRequest: {
      type: String,
      default: "",
    },

    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Rescheduled",
        "Completed",
        "Cancelled",
        "Walk-In",
      ],
      default: "Pending",
    },

    // True for walk-in customers created directly by admin (no online booking flow)
    isWalkIn: {
      type: Boolean,
      default: false,
    },

    rescheduleCount: {
      type: Number,
      default: 0,
    },

    previousReservations: [
      {
        reservationDate: Date,
        reservationTime: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Helpful for dashboard / availability queries
reservationSchema.index({ reservationDate: 1, reservationTime: 1 });
reservationSchema.index({ table: 1, reservationDate: 1, reservationTime: 1 });

export default mongoose.model("Reservation", reservationSchema);
