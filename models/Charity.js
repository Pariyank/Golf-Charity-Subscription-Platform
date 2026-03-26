const mongoose = require("mongoose");

const charitySchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  category: String,
  location: String,
  website: String,
  featured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Charity", charitySchema);