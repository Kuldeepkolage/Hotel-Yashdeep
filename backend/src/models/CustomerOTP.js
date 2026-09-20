import mongoose from "mongoose";

const customerOTPSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    hashedOTP: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    lastResentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically purge expired OTP documents
customerOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const CustomerOTP = mongoose.model("CustomerOTP", customerOTPSchema);

export default CustomerOTP;
