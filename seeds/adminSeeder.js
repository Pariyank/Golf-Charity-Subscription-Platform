require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for Admin Seeding..."))
  .catch(err => console.log(err));

const seedAdmin = async () => {
  try {
    const email = "admin@golf-impact.app"; // Change this to your desired admin email
    const password = "AdminPassword123!"; // Change this to your desired admin password
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists. Skipping...");
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: "System Administrator",
      email: email,
      password: hashedPassword,
      role: "admin",
      subscriptionStatus: "active" // Admin is always active
    });

    console.log("✅ Admin Credentials Created Successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();