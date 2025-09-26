// scripts/createApiUser.mjs
import dotenv from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import ApiUser from "../models/ApiUser.js"; // Make sure the path is correct

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI in .env.local");
  process.exit(1);
}

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {});

    const username = process.env.API_USER_USERNAME;
    const plainPassword = process.env.API_USER_PASSWORD;
    const companyid = process.env.COMPANY_ID;

    console.log("COMPANY_ID from env:", companyid);
    
    if (!username || !plainPassword) {
      console.error("Please define API_USER_USERNAME and API_USER_PASSWORD in .env.local");
      process.exit(1);
    }

    // Check if user exists
    const existingUser = await ApiUser.findOne({ username });
    if (existingUser) {
      console.log(`API User "${username}" already exists.`);
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create new user
    const newUser = new ApiUser({
      companyid,
      username,
      password: hashedPassword,
      isActive: true,
    });

    await newUser.save();
    console.log(`API User "${username}" created successfully.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
