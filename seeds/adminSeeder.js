const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");

console.log("Connecting to:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("📦 Connected. Preparing Admin...");
  
    await User.deleteOne({ email: "admin@golf-impact.app" });
    console.log("🗑 Old admin removed.");

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