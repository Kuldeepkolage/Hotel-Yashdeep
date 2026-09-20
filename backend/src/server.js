import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/database.js";

const PORT = Number(process.env.PORT || 5000);

const required = ["MONGODB_URI", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Hotel Yashdeep API listening on port ${PORT}`);
  });
} catch (error) {
  console.error("❌ Server startup failed:", error.message);
  process.exit(1);
}
