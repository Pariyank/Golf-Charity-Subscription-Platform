const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
   country: { type: String, default: "IN" },
  currency: { type: String, default: "INR" },
  language: { type: String, default: "en" },
  
  // Subscription
  stripeCustomerId: String,
  subscriptionStatus: { type: String, enum: ["active", "inactive", "past_due"], default: "inactive" },
  subscriptionType: { type: String, enum: ["monthly", "yearly", "none"], default: "none" },
  
  // Charity logic (PRD Requirement 08)
  selectedCharity: { type: mongoose.Schema.Types.ObjectId, ref: "Charity" },
  charityContribution: { type: Number, default: 10, min: 10 }, 

  // Score logic (PRD Requirement 05: Exactly 5 scores)
  scores: [{
    value: { type: Number, min: 1, max: 45 },
    date: { type: Date, default: Date.now }
  }],

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);