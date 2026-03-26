const mongoose = require("mongoose");

const drawSchema = new mongoose.Schema({
  numbers: [Number],
  month: String,
  year: Number,

  type: {
    type: String,
    enum: ["random", "algorithm"],
  },

  results: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    matchCount: Number,
    prize: Number,

    proofImage: String,

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
],

  jackpot: {
    type: Number,
    default: 0,
  },

}, { timestamps: true });

module.exports = mongoose.model("Draw", drawSchema);