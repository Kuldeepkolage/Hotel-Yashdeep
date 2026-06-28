import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/database.js";
import Admin from "../models/Admin.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({
      email: "admin@hotelyashdeep.com",
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    const admin = await Admin.create({
      name: "Hotel Yashdeep Admin",
      email: "admin@hotelyashdeep.com",
      password: "Admin@123",
      role: "superadmin",
    });

    console.log("🎉 Admin created successfully!");
    console.log(admin);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
