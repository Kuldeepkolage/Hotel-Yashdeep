import mongoose from "mongoose";

/**
 * Generic atomic counter collection.
 * Used to generate sequential, human-friendly IDs (e.g. HY1001, HY1002...)
 * without race conditions under concurrent requests.
 */
const counterSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Counter", counterSchema);
