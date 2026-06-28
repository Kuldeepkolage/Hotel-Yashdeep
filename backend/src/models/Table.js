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
      enum: ["Indoor", "Outdoor", "Family", "VIP"],
      default: "Indoor",
    },

    status: {
      type: String,
      enum: ["Available", "Reserved", "Occupied"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Table", tableSchema);
