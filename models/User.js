const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, // Optional for Google users
  firebaseUID: { type: String }, 
  role: { 
    type: String, 
    enum: ["subscriber", "admin"], 
    default: "subscriber" 
  },
  subscriptionStatus: { 
    type: String, 
    enum: ["active", "inactive", "past_due"], 
    default: "inactive" 
  },
  scores: [{
    value: { type: Number, min: 1, max: 45 },
    date: { type: Date, default: Date.now }
  }],
  selectedCharity: { type: mongoose.Schema.Types.ObjectId, ref: "Charity" },
  charityContribution: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);