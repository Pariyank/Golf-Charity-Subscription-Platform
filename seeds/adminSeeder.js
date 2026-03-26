const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");

console.log("Connecting to:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("📦 Connected. Preparing Admin...");
    
    // 1. DELETE EXISTING ADMIN (To avoid duplicates or old hashes)
    await User.deleteOne({ email: "admin@golf-impact.app" });
    console.log("🗑 Old admin removed.");

    // 2. CREATE FRESH ADMIN
    // Note: We don't hash here, the Safety Bypass in Controller handles the plain text.
    // Or we hash with 10 rounds to be standard.
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash("AdminPassword123!", 10);

    await User.create({
      name: "System Administrator",
      email: "admin@golf-impact.app",
      password: hashedPassword,
      role: "admin",
      subscriptionStatus: "active"
    });

    console.log("✅ SUCCESS: Admin 'admin@golf-impact.app' created.");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
  });