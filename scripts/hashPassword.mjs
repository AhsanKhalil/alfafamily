import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") }); // explicitly load .env.local

import bcrypt from "bcryptjs";

(async () => {
  const plainPassword = process.env.API_USER_PASSWORD;
  if (!plainPassword) {
    console.error("Please define API_USER_PASSWORD in .env.local");
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  console.log("Hashed password:", hashedPassword);
})();
