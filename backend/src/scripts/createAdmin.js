import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/database.js";
import Admin from "../models/Admin.js";

const createAdmin = async () => {
  try {
    const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const password = String(process.env.ADMIN_PASSWORD || "");
    const name = String(process.env.ADMIN_NAME || "Hotel Yashdeep Admin").trim();

    if (!email || !password) {
      throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment before creating the admin.");
    }
    if (password.length < 6) {
      throw new Error("ADMIN_PASSWORD must be at least 6 characters.");
    }

    await connectDB();

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    await Admin.create({ name, email, password, role: "superadmin" });
    console.log(`🎉 Admin created: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Could not create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
