import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    tableName: {
      type: String,
      default: "",
    },

    capacity: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      enum: ["Indoor", "Outdoor", "Family", "VIP", "Bar", "Terrace", "Private"],
      default: "Indoor",
    },

    floor: {
      type: String,
      default: "Ground",
      trim: true,
    },

    section: {
      type: String,
      default: "Indoor",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Available", "Reserved", "Occupied", "Maintenance"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Table", tableSchema);
