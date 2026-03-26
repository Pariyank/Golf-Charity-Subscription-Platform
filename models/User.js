// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, 
  avatar: { type: String }, // Store Google profile pic
  firebaseUID: { type: String },
  role: { type: String, enum: ["subscriber", "admin"], default: "subscriber" },
  subscriptionStatus: { type: String, enum: ["active", "inactive"], default: "inactive" },
  scores: [{ value: Number, date: { type: Date, default: Date.now } }],
  selectedCharity: { type: mongoose.Schema.Types.ObjectId, ref: "Charity" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);