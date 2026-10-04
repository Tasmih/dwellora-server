import "dotenv/config";
import bcrypt from "bcryptjs";


import { connectDatabase } from "../config/datbase.js";
import { createAdmin } from "../models/admin.models.js";


async function createFirstAdmin() {
  try {
    await connectDatabase();

    const hashedPassword = await bcrypt.hash(
      "admin123",
      10
    );

    await createAdmin({
      name: "Dwellora Admin",
      email: "admin@dwellora.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");

    process.exit(0);

  } catch (error) {
    console.log("Admin creation failed", error);
    process.exit(1);
  }
}


createFirstAdmin();